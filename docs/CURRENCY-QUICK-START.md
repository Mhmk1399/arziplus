# AI-Powered Currency Price Sync - Quick Start

## ✅ What Was Created

### 1. **lib/ai-currency.ts** 
Core library that:
- Uses Liara AI (GPT) to fetch currency prices from alanchand.com
- Parses USD, EUR, GBP buy/sell prices
- Updates MongoDB database automatically

### 2. **app/api/currency/sync/route.ts**
API endpoint:
- GET/POST: `/api/currency/sync`
- Can be called manually or by cron jobs
- Protected with Bearer token authentication

### 3. **lib/currency-sync-worker.ts**
Background worker:
- Auto-starts when app launches
- Runs every 10 minutes
- Updates prices automatically

### 4. **Updated Files**
- `.env` - Added `CRON_SECRET`
- `app/layout.tsx` - Imports worker to start it
- `package.json` - Added OpenAI SDK

## 🚀 How It Works

```
Every 10 minutes:
1. Worker triggers sync
2. AI (GPT) scrapes alanchand.com
3. Returns JSON with currency prices
4. Updates MongoDB Currency collection
5. Logs success/failure
```

## 🧪 Testing

### Test the API endpoint:
```bash
# Test GET (no auth required)
curl http://localhost:3000/api/currency/sync

# Or visit in browser:
http://localhost:3000/api/currency/sync
```

### Test the lib function:
```bash
# Install tsx if needed
npm install -D tsx

# Run test
npx tsx lib/test-currency-sync.ts
```

## 📊 Database Updates

The system updates these currencies in MongoDB:

| Currency | Fields Updated |
|----------|----------------|
| USD | `buyPrice`, `salePrise` |
| EUR | `buyPrice`, `salePrise` |
| GBP | `buyPrice`, `salePrise` |

## 🔐 Security

Set a strong `CRON_SECRET` in production:
```bash
CRON_SECRET=your-super-secret-random-string-here
```

## 📝 Monitoring

Check logs for:
- `🔄 Fetching currency prices...` - Starting
- `✅ Currency prices updated successfully` - Success
- `❌ Error:` - Failed attempts

## ⚙️ Configuration

### Change Update Frequency

Edit `lib/currency-sync-worker.ts`:
```typescript
// Change from 10 minutes to desired interval
10 * 60 * 1000  // 10 minutes
5 * 60 * 1000   // 5 minutes
60 * 60 * 1000  // 1 hour
```

### Change AI Model

Edit `.env`:
```
AI_MODEL_ID=openai/gpt-4o-mini  # Faster, cheaper
AI_MODEL_ID=openai/gpt-4o       # More accurate
AI_MODEL_ID=openai/gpt-5        # Current setting
```

## 🐛 Troubleshooting

### Worker not starting?
- Check console logs on server startup
- Ensure `app/layout.tsx` imports the worker
- Verify `.env` variables are set

### AI not returning data?
- Check AI API key is valid
- Verify base URL is correct
- Test with manual API call

### Database not updating?
- Check MongoDB connection
- Verify Currency model schema matches
- Check for database errors in logs

## 📦 Production Deployment

### Option 1: Built-in Worker (Recommended)
Already configured! Just deploy to Liara:
```bash
liara deploy
```

### Option 2: External Cron Job
Add to Liara dashboard or `liara.json`:
```json
{
  "cron": [
    {
      "schedule": "*/10 * * * *",
      "command": "curl -X POST https://payment.arziplus.com/api/currency/sync -H 'Authorization: Bearer YOUR_CRON_SECRET'"
    }
  ]
}
```

## 🎯 Next Steps

1. **Deploy**: Push to production
2. **Monitor**: Watch logs for first few syncs
3. **Verify**: Check database has updated prices
4. **Optimize**: Adjust timing if needed

## 📚 Files Reference

```
lib/
  ├── ai-currency.ts           # Core logic
  ├── currency-sync-worker.ts  # Background worker
  └── test-currency-sync.ts    # Test script

app/
  └── api/
      └── currency/
          └── sync/
              └── route.ts      # API endpoint

docs/
  ├── CURRENCY-SYNC.md         # Detailed docs
  └── CURRENCY-QUICK-START.md  # This file
```
