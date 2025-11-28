/**
 * SHEBA (IBAN) Validation Service
 * Verifies if a SHEBA number matches the given national code and birth date
 * Using s.api.ir Switch1 IbanMatch API
 */

interface IbanMatchResponse {
  data: boolean;
  success: boolean;
  code: number;
  error: string | null;
  message: string | null;
}

/**
 * Validate SHEBA number with national code and birth date
 * @param shabaNumber - SHEBA number (without IR prefix, 24 digits)
 * @param nationalCode - 10-digit national code
 * @param birthDate - Birth date in format YYYY/M/D (e.g., "1371/1/1")
 * @returns Promise<boolean> - true if SHEBA matches, false otherwise
 */
export async function shabaValidation(
  shabaNumber: string,
  nationalCode: string,
  birthDate: string
): Promise<{ verified: boolean; error?: string }> {
  try {
    const apiToken = process.env.API_IR_TOKEN;

    if (!apiToken) {
      throw new Error("API_IR_TOKEN is not configured");
    }

    // Validate inputs
    if (!nationalCode || nationalCode.length !== 10) {
      throw new Error("National code must be 10 digits");
    }

    // Clean and validate SHEBA number
    let cleanSheba = shabaNumber.replace(/\s/g, "").toUpperCase();
    
    // Remove IR prefix if present
    if (cleanSheba.startsWith("IR")) {
      cleanSheba = cleanSheba.substring(2);
    }

    // SHEBA should be 24 digits after IR
    if (cleanSheba.length !== 24 || !/^\d{24}$/.test(cleanSheba)) {
      throw new Error("SHEBA number must be 24 digits (without IR prefix)");
    }

    if (!birthDate || !/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(birthDate)) {
      throw new Error("Birth date must be in format YYYY/M/D");
    }

    // Format SHEBA with IR prefix
    const formattedSheba = `IR${cleanSheba}`;

    // Call IbanMatch API
    const response = await fetch("https://s.api.ir/api/sw1/IbanMatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        nationalCode,
        birthDate,
        iban: formattedSheba,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("IbanMatch API error:", response.status, errorText);
      throw new Error(`IbanMatch API request failed: ${response.status}`);
    }

    const result: IbanMatchResponse = await response.json();

    if (!result.success) {
      return {
        verified: false,
        error: result.error || result.message || "Verification failed",
      };
    }

    return {
      verified: result.data === true,
      error:
        result.data === false
          ? "SHEBA number does not match national code"
          : undefined,
    };
  } catch (error) {
    console.error("Error in shabaValidation:", error);
    return {
      verified: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

/**
 * Validate SHEBA with national code (full verification with additional checks)
 * This can be extended to include additional validation or logging
 */
export async function shabaValidationFull(
  shabaNumber: string,
  nationalCode: string,
  birthDate: string
): Promise<{
  verified: boolean;
  error?: string;
  details?: {
    nationalCode: string;
    iban: string;
    timestamp: string;
  };
}> {
  const result = await shabaValidation(shabaNumber, nationalCode, birthDate);

  return {
    ...result,
    details: {
      nationalCode,
      iban: shabaNumber.startsWith("IR")
        ? shabaNumber.replace(/\d(?=\d{4})/g, "*")
        : `IR${shabaNumber}`.replace(/\d(?=\d{4})/g, "*"),
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * CardMatch Validation Service
 * Verifies if a bank card number matches the given national code and birth date
 * Using s.api.ir Switch1 CardMatch API
 */

interface CardMatchResponse {
  data: boolean;
  success: boolean;
  code: number;
  error: string | null;
  message: string | null;
}

/**
 * Validate bank card number with national code and birth date
 * @param cardNumber - 16-digit bank card number
 * @param nationalCode - 10-digit national code
 * @param birthDate - Birth date in format YYYY/M/D (e.g., "1371/1/1")
 * @returns Promise<{verified: boolean; error?: string}> - verification result
 */
export async function cardValidation(
  cardNumber: string,
  nationalCode: string,
  birthDate: string
): Promise<{ verified: boolean; error?: string }> {
  try {
    const apiToken = process.env.API_IR_TOKEN;

    if (!apiToken) {
      throw new Error("API_IR_TOKEN is not configured");
    }

    // Validate inputs
    if (!nationalCode || nationalCode.length !== 10) {
      throw new Error("National code must be 10 digits");
    }

    // Clean and validate card number
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    console.log(cleanCardNumber,"cleancardnumber")
    
    if (cleanCardNumber.length !== 16 || !/^\d{16}$/.test(cleanCardNumber)) {
      throw new Error("Card number must be 16 digits");
    }

    if (!birthDate || !/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(birthDate)) {
      throw new Error("Birth date must be in format YYYY/M/D");
    }

    // Call CardMatch API
    const response = await fetch("https://s.api.ir/api/sw1/CardMatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        nationalCode,
        birthDate,
        cardNumber: cleanCardNumber,
      }),
    });
    console.log(response,"cardmatchresponse")

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText)
      console.error("CardMatch API error:", response.status, errorText);
      throw new Error(`CardMatch API request failed: ${response.status}`);
    }

    const result: CardMatchResponse = await response.json();
    console.log(result,"cardmatchresult")

    if (!result.success) {
      return {
        verified: false,
        error: result.error || result.message || "Verification failed",
      };
    }

    return {
      verified: result.data === true,
      error:
        result.data === false
          ? "Card number does not match national code"
          : undefined,
    };
  } catch (error) {
    console.error("Error in cardValidation:", error);
    return {
      verified: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

/**
 * Validate card with national code (full verification with additional checks)
 * This can be extended to include additional validation or logging
 */
export async function cardValidationFull(
  cardNumber: string,
  nationalCode: string,
  birthDate: string
): Promise<{
  verified: boolean;
  error?: string;
  details?: {
    nationalCode: string;
    cardNumber: string;
    timestamp: string;
  };
}> {
  const result = await cardValidation(cardNumber, nationalCode, birthDate);

  return {
    ...result,
    details: {
      nationalCode,
      cardNumber: cardNumber.replace(/\s/g, "").replace(/\d(?=\d{4})/g, "*"),
      timestamp: new Date().toISOString(),
    },
  };
}