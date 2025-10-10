# 📁 ساختار فایلهای Sitemap دینامیک

## 🗂 نقشه کامل فایلها

```
arziplus/
├── app/
│   ├── sitemap.ts                 # 🎯 موتور اصلی
│   ├── robots.ts                  # 🤖 راهنمای ربات‌ها
│   └── sitemap-index.xml/
│       └── route.ts               # 📋 فهرست sitemap
├── lib/
│   ├── sitemap-config.ts          # ⚙️ تنظیمات مرکزی
│   └── sitemap-generator.ts       # 🔧 کلاس پیشرفته
├── scripts/
│   └── validate-sitemap.js        # ✅ ابزار تست
└── docs/
    ├── SITEMAP-GUIDE.md           # 📖 راهنمای کامل
    └── FILE-STRUCTURE.md          # 📁 این فایل
```

## 📄 شرح تفصیلی هر فایل

### 1️⃣ `app/sitemap.ts` - قلب سیستم
```typescript
// وظایف اصلی:
✅ اسکن پوشه app/
✅ شناسایی فایلهای page.tsx
✅ حذف پوشههای غیرضروری
✅ تولید XML sitemap
✅ اعمال اولویت و فرکانس
```

**خروجی:** `/sitemap.xml`

### 2️⃣ `app/robots.ts` - راهنمای موتورها
```typescript
// محتوای تولیدی:
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://domain.com/sitemap.xml
```

**خروجی:** `/robots.txt`

### 3️⃣ `lib/sitemap-config.ts` - مرکز کنترل
```typescript
// تنظیمات شامل:
🎯 baseUrl: آدرس سایت
📊 routeConfig: اولویت هر route
🚫 excludeRoutes: route های حذف شده
⏰ changeFreq: فرکانس بروزرسانی
```

### 4️⃣ `lib/sitemap-generator.ts` - ابزار پیشرفته
```typescript
// قابلیت‌های کلاس:
🔍 scanRoutes(): اسکن هوشمند
📂 getRoutesByCategory(): دستهبندی
🛡️ shouldSkipDirectory(): فیلتر پوشه‌ها
📄 hasPageFile(): تشخیص صفحه
```

### 5️⃣ `app/sitemap-index.xml/route.ts` - فهرست کلی
```xml
<!-- خروجی XML: -->
<sitemapindex>
  <sitemap>
    <loc>https://domain.com/sitemap.xml</loc>
    <lastmod>2024-01-01T00:00:00.000Z</lastmod>
  </sitemap>
</sitemapindex>
```

### 6️⃣ `scripts/validate-sitemap.js` - ابزار تست
```javascript
// عملکردها:
✅ بررسی وجود فایل‌ها
📊 شمارش route ها
📋 نمایش لیست صفحات
💡 راهنمای تست
```

## 🔄 فرآیند کارکرد

### مرحله 1: اسکن (sitemap.ts)
```
app/ → scanDirectory() → routes[]
```

### مرحله 2: فیلتر (sitemap-config.ts)
```
routes[] → excludeRoutes → validRoutes[]
```

### مرحله 3: اولویت‌بندی (sitemap-config.ts)
```
validRoutes[] → routeConfig → prioritizedRoutes[]
```

### مرحله 4: تولید XML (sitemap.ts)
```
prioritizedRoutes[] → MetadataRoute.Sitemap → sitemap.xml
```

## 📊 آمار فایل‌ها

| فایل | خطوط کد | وظیفه اصلی |
|------|---------|------------|
| sitemap.ts | ~60 | تولید sitemap |
| robots.ts | ~15 | تنظیم robots |
| sitemap-config.ts | ~45 | مدیریت تنظیمات |
| sitemap-generator.ts | ~120 | ابزار پیشرفته |
| route.ts | ~20 | فهرست sitemap |
| validate-sitemap.js | ~80 | تست سیستم |

## 🎯 نقاط کلیدی

### Dependencies
```json
{
  "fs": "داخلی Node.js",
  "path": "داخلی Node.js", 
  "MetadataRoute": "از Next.js"
}
```

### Cache Strategy
```typescript
// در route.ts
headers: {
  'Cache-Control': 'public, max-age=3600'
}
```

### Error Handling
```typescript
// در sitemap-generator.ts
try {
  // اسکن فایل‌ها
} catch (error) {
  console.warn('خطا در اسکن:', error)
}
```

## 🚀 نکات بهینه‌سازی

### 1. عملکرد
- اسکن تنها یک بار در build
- Cache مناسب برای production
- حداقل I/O operations

### 2. نگهداری
- کد ماژولار و قابل توسعه
- تنظیمات متمرکز
- مستندسازی کامل

### 3. SEO
- اولویت‌بندی بر اساس کسب‌وکار
- فرکانس مناسب بروزرسانی
- ساختار XML استاندارد

---
**نتیجه:** سیستمی کامل، خودکار و قابل نگهداری برای مدیریت sitemap