# Currency Price Sync Cron Job

This system automatically fetches and updates currency prices every 10 minutes using Liara AI.

## Files Created

1. **lib/ai-currency.ts** - Core logic for fetching prices from AI and updating database
2. **app/api/currency/sync/route.ts** - API endpoint to trigger sync

## Setup Instructions

### 1. Install OpenAI SDK

```bash
npm install openai
```

### 2. Add Environment Variable (Optional)

Add to your `.env` file for security:

```
CRON_SECRET=your-random-secret-string-here
```

### 3. Configure Liara Cron Job

In your Liara dashboard:

1. Go to your app settings
2. Navigate to "Cron Jobs" section
3. Add a new cron job:

**Schedule**: `*/10 * * * *` (every 10 minutes)
**Command**: 
```bash
curl -X POST https://payment.arziplus.com/api/currency/sync \
  -H "Authorization: Bearer your-random-secret-string-here"
```

Alternatively, use Liara's built-in cron format in `liara.json`:

```json
{
  "cron": [
    {
      "schedule": "*/10 * * * *",
      "command": "curl -X POST https://payment.arziplus.com/api/currency/sync -H 'Authorization: Bearer your-random-secret-string-here'"
    }
  ]
}
```

### 4. Manual Testing

Test the endpoint manually:

```bash
# Using GET (for testing only)
curl https://payment.arziplus.com/api/currency/sync

# Using POST (with auth)
curl -X POST https://payment.arziplus.com/api/currency/sync \
  -H "Authorization: Bearer your-random-secret-string-here"
```

## How It Works

1. **Cron job triggers** every 10 minutes
2. **API endpoint** receives the request
3. **AI fetches prices** from https://alanchand.com using GPT
4. **Database updates** with new USD, EUR, GBP prices
5. **Logs results** for monitoring

## Database Schema

The currency model stores:
- `name`: Currency code (USD, EUR, GBP)
- `buyPrice`: Current buy price
- `salePrise`: Current sell price (note: typo in original model)

## Monitoring

Check logs in Liara dashboard to monitor:
- ✅ Successful syncs
- ❌ Failed syncs
- 🔄 Fetch attempts

## Alternative: Next.js Server Action

If you prefer to run this directly in your Next.js app without external cron:

```typescript
// app/currency-sync-worker.ts
import { syncCurrencyPrices } from "@/lib/ai-currency";

// Run on server startup
if (typeof window === "undefined") {
  // Initial sync
  syncCurrencyPrices().catch(console.error);
  
  // Repeat every 10 minutes
  setInterval(() => {
    syncCurrencyPrices().catch(console.error);
  }, 10 * 60 * 1000); // 10 minutes
}
```

Then import this in your root layout or app initialization.
