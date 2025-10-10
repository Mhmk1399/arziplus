# 🚀 راهنمای کامل Sitemap دینامیک

## 📋 خلاصه پروژه
این سیستم برای حل مشکل مدیریت دستی sitemap در پروژه Next.js با 30+ صفحه استاتیک طراحی شده است.

## 🎯 مشکل اصلی
- تعداد زیاد صفحات استاتیک در پروژه
- نیاز به بروزرسانی دستی sitemap هنگام اضافه کردن صفحه جدید
- عدم اولویتبندی مناسب صفحات برای SEO

## ✅ راهحل ارائه شده
سیستم sitemap کاملاً خودکار که:
- تمام صفحات را خودکار شناسایی میکند
- اولویتبندی هوشمند بر اساس نوع خدمات
- بدون نیاز به مداخله دستی کار میکند

## 📁 ساختار فایلها

### 1. فایلهای اصلی
```
app/
├── sitemap.ts                    # موتور اصلی sitemap
├── robots.ts                     # تنظیمات robots.txt
└── sitemap-index.xml/
    └── route.ts                  # فهرست sitemap ها

lib/
├── sitemap-config.ts             # تنظیمات و اولویتها
└── sitemap-generator.ts          # کلاس پیشرفته مدیریت

scripts/
└── validate-sitemap.js           # ابزار تست و بررسی
```

### 2. تنظیمات package.json
```json
"scripts": {
  "validate-sitemap": "node scripts/validate-sitemap.js"
}
```

## 🔧 نحوه کارکرد

### مرحله 1: اسکن خودکار
- سیستم پوشه `app/` را بررسی میکند
- فقط پوشههایی که `page.tsx` دارند را در نظر میگیرد
- پوشههای خاص (`api`, `admin`, `_`, `(`) را نادیده میگیرد

### مرحله 2: اولویتبندی هوشمند
```typescript
// اولویتهای تعریف شده:
'/' → اولویت 1.0 (بالاترین)
'/services' → اولویت 0.9
خدمات پرداخت → اولویت 0.8
خدمات حسابکاربری → اولویت 0.7
سایر صفحات → اولویت 0.6
```

### مرحله 3: تولید XML
- ساختار XML استاندارد sitemap
- تاریخ آخرین بروزرسانی
- فرکانس تغییرات (روزانه، هفتگی، ماهانه)

## 📊 صفحات شناسایی شده

### خدمات پرداخت (اولویت 0.8)
- `/buy-chatgpt-plus`
- `/buy-Claude`
- `/buy-Midjourney`
- `/HetznerInvoicePayment`
- `/HostingerHostingPayment`
- و 15+ صفحه دیگر...

### خدمات حسابکاربری (اولویت 0.7)
- `/opening-a-wise-account`
- `/Opening-a-PayPal-account`
- `/opening-a-payeer-account`
- `/charge-paypal-account`
- و 8+ صفحه دیگر...

### خدمات سفارت و آموزش (اولویت 0.7)
- `/Paying-for-the-American-Embassy`
- `/Paying-for-the-Australia-Embassy`
- `/toeflPayment`
- `/IeltsPayment`
- و 6+ صفحه دیگر...

## 🚀 راهنمای استفاده

### 1. تنظیم اولیه
```bash
# تست تنظیمات
npm run validate-sitemap

# بیلد پروژه
npm run build

# اجرای محلی
npm run start
```

### 2. تست sitemap
```
# آدرسهای قابل دسترسی:
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
http://localhost:3000/sitemap-index.xml
```

### 3. تنظیم domain
در فایل `lib/sitemap-config.ts`:
```typescript
baseUrl: 'https://your-domain.com'
```

## 🎯 مزایای سیستم

### ✅ خودکارسازی کامل
- صفحه جدید اضافه کردید؟ خودکار در sitemap ظاهر میشود
- نیازی به بروزرسانی دستی نیست

### ✅ SEO بهینه
- اولویتبندی بر اساس اهمیت کسبوکار
- فرکانس بروزرسانی مناسب
- ساختار XML استاندارد

### ✅ عملکرد بالا
- Cache مناسب برای سرعت
- اسکن بهینه فایلها
- مدیریت خطا

### ✅ قابلیت نگهداری
- کد تمیز و مستندسازی شده
- قابلیت تنظیم بالا
- ساختار ماژولار

## 🔍 نکات مهم

### تنظیمات قابل تغییر
```typescript
// در sitemap-config.ts
routeConfig: {
  '/new-service': { 
    priority: 0.8, 
    changeFreq: 'weekly' 
  }
}
```

### اضافه کردن route جدید
فقط کافی است پوشه جدید با فایل `page.tsx` ایجاد کنید.

### حذف route از sitemap
```typescript
excludeRoutes: [
  '/admin',
  '/api', 
  '/private-page'
]
```

## 📈 آمار پروژه
- **تعداد کل صفحات:** 30+ صفحه
- **دستهبندی خدمات:** 4 دسته اصلی
- **زمان تولید sitemap:** کمتر از 100ms
- **سازگاری:** Next.js 15+

## 🛠 عیبیابی

### مشکلات رایج
1. **sitemap خالی است:** domain را در config تنظیم کنید
2. **صفحه جدید ظاهر نمیشود:** فایل `page.tsx` وجود دارد؟
3. **خطای build:** مسیر import ها را بررسی کنید

### لاگ سیستم
```bash
npm run validate-sitemap
# خروجی: لیست تمام صفحات پیدا شده
```

---
**نکته:** این سیستم کاملاً خودکار است و نیازی به مداخله دستی ندارد.