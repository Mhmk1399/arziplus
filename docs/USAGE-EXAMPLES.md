# 🎯 نمونههای کاربردی Sitemap دینامیک

## 🚀 راهنمای گام به گام

### 1. تست اولیه سیستم
```bash
# بررسی تنظیمات
npm run validate-sitemap

# خروجی مورد انتظار:
# ✅ sitemap.ts exists
# ✅ robots.ts exists  
# ✅ sitemap-config.ts exists
# 📄 Found route: /buy-chatgpt-plus
# 📄 Found route: /HetznerInvoicePayment
# 📊 Total routes found: 31 (including root)
```

### 2. تنظیم Domain
```typescript
// در lib/sitemap-config.ts
export const sitemapConfig = {
  baseUrl: 'https://arziPlus.com', // آدرس واقعی سایت شما
  // ...
}
```

### 3. تست محلی
```bash
# بیلد پروژه
npm run build

# اجرای سرور
npm run start

# تست sitemap
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```

## 📋 نمونه خروجی Sitemap

### XML تولید شده:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://arziPlus.com/</loc>
    <lastmod>2024-01-15T10:30:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://arziPlus.com/buy-chatgpt-plus</loc>
    <lastmod>2024-01-15T10:30:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://arziPlus.com/HetznerInvoicePayment</loc>
    <lastmod>2024-01-15T10:30:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- و 28+ URL دیگر... -->
</urlset>
```

## ⚙️ تنظیمات پیشرفته

### 1. اضافه کردن صفحه جدید
```bash
# فقط پوشه جدید با page.tsx ایجاد کنید
mkdir app/new-service
echo 'export default function NewService() { return <div>New Service</div> }' > app/new-service/page.tsx

# خودکار در sitemap ظاهر میشود!
```

### 2. تنظیم اولویت خاص
```typescript
// در lib/sitemap-config.ts
routeConfig: {
  '/new-service': { 
    priority: 0.9, 
    changeFreq: 'daily' as const 
  },
  // ...
}
```

### 3. حذف صفحه از sitemap
```typescript
// در lib/sitemap-config.ts
excludeRoutes: [
  '/admin',
  '/api',
  '/private-page',
  '/new-service' // حذف از sitemap
]
```

## 🔍 نمونههای تست

### تست 1: بررسی تعداد صفحات
```javascript
// اجرای validate-sitemap.js
const routes = scanRoutes()
console.log(`تعداد کل صفحات: ${routes.length}`)

// خروجی مورد انتظار: 31 صفحه
```

### تست 2: بررسی دستهبندی
```javascript
// استفاده از SitemapGenerator
const generator = new SitemapGenerator()
const categories = generator.getRoutesByCategory()

console.log('خدمات پرداخت:', categories.payment.length)
console.log('خدمات حسابکاربری:', categories.accounts.length)
console.log('خدمات سفارت:', categories.embassy.length)
```

### تست 3: بررسی XML
```bash
# تست ساختار XML
curl -s http://localhost:3000/sitemap.xml | head -20

# بررسی تعداد URL ها
curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"
```

## 🎯 سناریوهای کاربردی

### سناریو 1: اضافه کردن خدمت جدید
```bash
# 1. ایجاد پوشه جدید
mkdir app/buy-netflix

# 2. ایجاد صفحه
cat > app/buy-netflix/page.tsx << 'EOF'
import NetflixComponent from '@/components/static/Netflix'
export default function NetflixPage() {
  return <NetflixComponent />
}
EOF

# 3. تنظیم اولویت (اختیاری)
# در sitemap-config.ts اضافه کنید:
# '/buy-netflix': { priority: 0.8, changeFreq: 'weekly' }

# 4. تست
npm run validate-sitemap
# خروجی: 📄 Found route: /buy-netflix
```

### سناریو 2: تغییر اولویت صفحات
```typescript
// قبل از تغییر - اولویت پیشفرض 0.6
'/some-page': { priority: 0.6, changeFreq: 'monthly' }

// بعد از تغییر - اولویت بالا
'/some-page': { priority: 0.9, changeFreq: 'weekly' }
```

### سناریو 3: حذف صفحه از نتایج جستجو
```typescript
// روش 1: حذف از sitemap
excludeRoutes: ['/old-service']

// روش 2: تنظیم اولویت صفر
'/old-service': { priority: 0.0, changeFreq: 'never' }
```

## 📊 مانیتورینگ و گزارشگیری

### گزارش کامل صفحات:
```bash
npm run validate-sitemap 2>&1 | grep "Found route" | wc -l
# خروجی: تعداد کل صفحات
```

### بررسی عملکرد:
```bash
# زمان تولید sitemap
time curl -s http://localhost:3000/sitemap.xml > /dev/null
# باید کمتر از 100ms باشد
```

### تست SEO:
```bash
# بررسی robots.txt
curl http://localhost:3000/robots.txt

# خروجی مورد انتظار:
# User-agent: *
# Allow: /
# Disallow: /admin/
# Disallow: /api/
# Sitemap: https://arziPlus.com/sitemap.xml
```

## 🚨 عیبیابی رایج

### مشکل 1: صفحه جدید ظاهر نمیشود
```bash
# بررسی وجود فایل page.tsx
ls -la app/new-service/
# باید page.tsx وجود داشته باشد

# بررسی exclude list
grep -n "excludeRoutes" lib/sitemap-config.ts
```

### مشکل 2: خطای 404 در sitemap
```bash
# بررسی build
npm run build
# اگر خطا داشت، مسیر import ها را چک کنید

# تست مجدد
npm run start
curl http://localhost:3000/sitemap.xml
```

### مشکل 3: اولویت اشتباه
```typescript
// بررسی تنظیمات در sitemap-config.ts
console.log(getRouteConfig('/your-route'))
// باید اولویت صحیح را برگرداند
```

---
**نکته مهم:** تمام تغییرات بعد از build جدید اعمال میشوند.