import OpenAI from "openai";

interface CurrencyData {
  USD: { buy: number; sell: number };
  EUR: { buy: number; sell: number };
  GBP: { buy: number; sell: number };
}

/**
 * Fetch HTML content from alanchand.com
 */
async function fetchWebsiteHTML(): Promise<string> {
  try {
    const response = await fetch("https://alanchand.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log("📄 Fetched HTML length:", html.length);
    return html;
  } catch (error) {
    console.error("❌ Error fetching website:", error);
    throw error;
  }
}

/**
 * Use AI to parse currency prices from HTML
 */
async function parseCurrencyFromHTML(html: string): Promise<string> {
  const openai = new OpenAI({
    baseURL: process.env.AI_BASE_URL,
    apiKey: process.env.AI_APP_TOKEN,
  });

  // Truncate HTML if too long (keep first 20000 chars which should include the table)
  const truncatedHTML = html.substring(0, 20000);

  const completion = await openai.chat.completions.create({
    model: process.env.AI_MODEL_ID || "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a data extraction specialist. Extract currency exchange rates from HTML and return ONLY valid JSON with no additional text or formatting.",
      },
      {
        role: "user",
        content: `Extract the buy (خرید) and sell (فروش) prices for USD, EUR, and GBP from this HTML content from alanchand.com.

HTML:
${truncatedHTML}

Return ONLY this exact JSON structure with the actual numbers found in the HTML (in Toman):

{
  "USD": { "buy": <number>, "sell": <number> },
  "EUR": { "buy": <number>, "sell": <number> },
  "GBP": { "buy": <number>, "sell": <number> }
}

Rules:
- Return ONLY the JSON object
- Numbers must be integers (no commas, no strings)
- Extract the actual values from the HTML table
- Do NOT return -1 or placeholder values
- Do NOT wrap in markdown code blocks`,
      },
    ],
    temperature: 0.1,
  });

  return completion.choices[0]?.message?.content || "";
}

/**
 * Fetch currency prices from Alan Chand using Liara AI (GPT)
 * @returns Promise<CurrencyData> - Currency buy/sell prices
 */
export async function fetchCurrencyPrices(): Promise<CurrencyData> {
  try {
    console.log("🌐 Fetching website HTML...");
    const html = await fetchWebsiteHTML();

    console.log("🤖 Asking AI to parse prices...");
    const responseText = await parseCurrencyFromHTML(html);

    if (!responseText) {
      throw new Error("No response from AI");
    }

    console.log("🤖 AI Response:", responseText);

    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/g, "");
    }
    if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\s*/g, "");
    }
    if (cleanedResponse.endsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/\s*```$/g, "");
    }

    console.log("🧹 Cleaned Response:", cleanedResponse);

    // Parse the JSON response
    let currencyData: CurrencyData;
    try {
      currencyData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      console.error("Raw response was:", responseText);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log("📊 Parsed Data:", JSON.stringify(currencyData, null, 2));

    // Validate the structure
    if (
      !currencyData.USD ||
      !currencyData.EUR ||
      !currencyData.GBP ||
      typeof currencyData.USD.buy !== "number" ||
      typeof currencyData.USD.sell !== "number" ||
      typeof currencyData.EUR.buy !== "number" ||
      typeof currencyData.EUR.sell !== "number" ||
      typeof currencyData.GBP.buy !== "number" ||
      typeof currencyData.GBP.sell !== "number"
    ) {
      console.error("❌ Invalid structure. Received:", currencyData);
      throw new Error(
        `Invalid currency data structure. USD: ${JSON.stringify(currencyData.USD)}, EUR: ${JSON.stringify(currencyData.EUR)}, GBP: ${JSON.stringify(currencyData.GBP)}`
      );
    }

    return currencyData;
  } catch (error) {
    console.error("Error fetching currency prices:", error);
    throw error;
  }
}

/**
 * Update currency prices in the database
 * @param currencyData - Currency data to update
 */
export async function updateCurrencyDatabase(
  currencyData: CurrencyData
): Promise<void> {
  const { default: connect } = await import("@/lib/data");
  const { default: Currency } = await import("@/models/curancy");

  try {
    await connect();

    // Update or create each currency
    const currencies = [
      { name: "USD", data: currencyData.USD },
      { name: "EUR", data: currencyData.EUR },
      { name: "GBP", data: currencyData.GBP },
    ];

    for (const currency of currencies) {
      await Currency.findOneAndUpdate(
        { name: currency.name },
        {
          name: currency.name,
          buyPrice: currency.data.buy,
          salePrise: currency.data.sell,
        },
        { upsert: true, new: true }
      );

      console.log(`Updated ${currency.name}: Buy=${currency.data.buy}, Sell=${currency.data.sell}`);
    }

    console.log("✅ Currency prices updated successfully");
  } catch (error) {
    console.error("❌ Error updating currency database:", error);
    throw error;
  }
}

/**
 * Main function to fetch and update currency prices
 */
export async function syncCurrencyPrices(): Promise<void> {
  try {
    console.log("🔄 Fetching currency prices from AI...");
    const currencyData = await fetchCurrencyPrices();
    
    console.log("💾 Updating database...");
    await updateCurrencyDatabase(currencyData);
    
    console.log("✅ Currency sync completed successfully");
  } catch (error) {
    console.error("❌ Currency sync failed:", error);
    throw error;
  }
}
