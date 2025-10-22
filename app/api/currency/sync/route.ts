import { NextRequest, NextResponse } from "next/server";
import { syncCurrencyPrices } from "@/lib/ai-currency";

/**
 * API endpoint to sync currency prices
 * This can be called manually or by a cron job
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET || "your-secret-token";

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Sync currency prices
    await syncCurrencyPrices();

    return NextResponse.json(
      {
        success: true,
        message: "Currency prices synced successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Currency sync API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to trigger sync (for testing)
 */
export async function GET() {
  try {
    await syncCurrencyPrices();

    return NextResponse.json(
      {
        success: true,
        message: "Currency prices synced successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Currency sync API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
