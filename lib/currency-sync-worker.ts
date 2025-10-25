/**
 * Currency Sync Background Worker
 * Runs every 10 minutes to fetch and update currency prices
 * This file should be imported in your root layout or middleware
 */

import { syncCurrencyPrices } from "@/lib/ai-currency";

let intervalId: NodeJS.Timeout | null = null;

/**
 * Start the currency sync worker
 */
export function startCurrencySyncWorker() {
  // Only run on server side
  if (typeof window !== "undefined") {
    return;
  }

  // Prevent multiple intervals
  if (intervalId) {
    console.log("⚠️ Currency sync worker already running");
    return;
  }

  console.log("🚀 Starting currency sync worker...");

  // Run immediately on startup
  syncCurrencyPrices().catch((error) => {
    console.log("❌ Initial currency sync failed:", error);
  });

  // Run every 10 minutes
  intervalId = setInterval(
    () => {
      console.log("⏰ Running scheduled currency sync...");
      syncCurrencyPrices().catch((error) => {
        console.log("❌ Scheduled currency sync failed:", error);
      });
    },
    10 * 60 * 1000
  ); // 10 minutes in milliseconds

  console.log("✅ Currency sync worker started (runs every 10 minutes)");
}

/**
 * Stop the currency sync worker
 */
export function stopCurrencySyncWorker() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("🛑 Currency sync worker stopped");
  }
}

// Auto-start the worker when this module is imported
if (process.env.NODE_ENV !== "test") {
  startCurrencySyncWorker();
}
