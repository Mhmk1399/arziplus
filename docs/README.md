# 📚 مستندات Sitemap دینامیک

## 🎯 خلاصه پروژه
سیستم sitemap کاملاً خودکار برای پروژه Next.js با 30+ صفحه استاتیک

## 📖 راهنماهای موجود

### 1️⃣ [راهنمای کامل](./SITEMAP-GUIDE.md)
- توضیح کامل سیستم
- مزایا و ویژگیها
- نحوه کارکرد
- آمار و اطلاعات کلی

### 2️⃣ [ساختار فایلها](./FILE-STRUCTURE.md)
- نقشه کامل فایلها
- شرح تفصیلی هر فایل
- فرآیند کارکرد
- نکات بهینهسازی

### 3️⃣ [نمونههای کاربردی](./USAGE-EXAMPLES.md)
- راهنمای گام به گام
- نمونه خروجیها
- تنظیمات پیشرفته
- عیبیابی رایج

## 🚀 شروع سریع

```bash
# 1. تست سیستم
npm run validate-sitemap

# 2. بیلد پروژه
npm run build

# 3. اجرای محلی
npm run start

# 4. تست sitemap
curl http://localhost:3000/sitemap.xml
```

## 📊 آمار کلی

- **تعداد فایلهای ایجاد شده:** 6 فایل
- **تعداد صفحات پشتیبانی شده:** 30+ صفحه
- **زمان تولید sitemap:** < 100ms
- **سازگاری:** Next.js 15+

## 🎯 ویژگیهای کلیدی

✅ **خودکارسازی کامل** - بدون نیاز به مداخله دستی
✅ **اولویتبندی هوشمند** - بر اساس نوع خدمات
✅ **SEO بهینه** - ساختار استاندارد XML
✅ **عملکرد بالا** - Cache و بهینهسازی
✅ **قابلیت تنظیم** - تنظیمات انعطافپذیر

## 📁 فایلهای اصلی

```
├── app/sitemap.ts              # موتور اصلی
├── app/robots.ts               # تنظیمات robots
├── lib/sitemap-config.ts       # تنظیمات مرکزی
├── lib/sitemap-generator.ts    # ابزار پیشرفته
└── scripts/validate-sitemap.js # ابزار تست
```

## 🔗 لینکهای مفید

- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Search Console](https://search.google.com/search-console)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## 📞 پشتیبانی

برای سوالات و مشکلات:
1. ابتدا [راهنمای عیبیابی](./USAGE-EXAMPLES.md#-عیبیابی-رایج) را مطالعه کنید
2. اسکریپت `npm run validate-sitemap` را اجرا کنید
3. لاگهای خطا را بررسی کنید

---
**نکته:** این سیستم کاملاً خودکار است و نیازی به نگهداری دستی ندارد.