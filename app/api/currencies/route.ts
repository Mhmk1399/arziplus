import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Currency from "@/models/curancy";

/**
 * GET - Fetch all currency prices
 */
export async function GET(request: NextRequest) {
  try {
    await connect();

    // Fetch all currencies
    const currencies = await Currency.find({});

    return NextResponse.json(
      {
        success: true,
        currencies: currencies.map((curr) => ({
          name: curr.name,
          buyPrice: curr.buyPrice,
          salePrise: curr.salePrise,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
