# 🎯 سیستم Schema دینامیک

## 📋 خلاصه
سیستم Schema کاملاً خودکار که برای هر صفحه، Schema مناسب JSON-LD تولید میکند و SEO را بهبود میدهد.

## 🚀 ویژگیهای کلیدی

✅ **تولید خودکار Schema** - بر اساس URL و محتوای صفحه
✅ **پشتیبانی از انواع مختلف** - Service, Organization, WebPage, Product
✅ **تنظیمات قابل سفارشی** - برای هر صفحه جداگانه
✅ **تزریق خودکار** - بدون نیاز به کد اضافی
✅ **SEO بهینه** - ساختار استاندارد Schema.org

## 📁 ساختار فایلها

```
lib/
├── schema-generator.ts          # موتور اصلی تولید Schema
├── schema-config.ts             # تنظیمات تفصیلی هر صفحه

components/global/
├── SchemaProvider.tsx           # Provider خودکار
└── DynamicSchema.tsx           # کامپوننت دینامیک

hooks/
└── useSchema.ts                # Hook برای مدیریت Schema

scripts/
└── validate-schemas.js         # ابزار تست و بررسی
```

## 🎯 انواع Schema پشتیبانی شده

### 1️⃣ Service Schema - خدمات
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "خرید ChatGPT Plus از ایران",
  "description": "خرید اشتراک ChatGPT Plus با پرداخت ریالی",
  "serviceType": "AI Services",
  "provider": {
    "@type": "Organization",
    "name": "ارزی پلاس"
  },
  "offers": {
    "@type": "Offer",
    "price": "25",
    "priceCurrency": "USD"
  }
}
```

### 2️⃣ Organization Schema - سازمان
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ارزی پلاس",
  "description": "ارائه خدمات پرداخت ارزی",
  "serviceType": ["Payment Services", "Currency Exchange"]
}
```

## 🔧 نحوه استفاده

### روش 1: خودکار (پیشنهادی)
```tsx
// در layout.tsx - همه صفحات خودکار Schema دارند
import SchemaProvider from '@/components/global/SchemaProvider'

export default function Layout({ children }) {
  return (
    <SchemaProvider>
      {children}
    </SchemaProvider>
  )
}
```

### روش 2: دستی با Hook
```tsx
'use client'
import { useSchema } from '@/hooks/useSchema'

export default function MyPage() {
  const { generateSchema } = useSchema({
    customData: {
      title: 'عنوان سفارشی',
      price: '100',
      currency: 'USD'
    }
  })

  return <div>محتوای صفحه</div>
}
```

### روش 3: کامپوننت دستی
```tsx
import { ManualSchema } from '@/components/global/SchemaProvider'

export default function MyPage() {
  return (
    <>
      <ManualSchema data={{
        title: 'خدمت ویژه',
        description: 'توضیحات خدمت',
        price: '50'
      }} />
      <div>محتوای صفحه</div>
    </>
  )
}
```

## ⚙️ تنظیمات پیشرفته

### اضافه کردن صفحه جدید
```typescript
// در lib/schema-config.ts
export const schemaConfig = {
  '/new-service': {
    type: 'Service',
    title: 'خدمت جدید',
    description: 'توضیحات خدمت جدید',
    category: 'New Category',
    provider: 'Provider Name',
    price: '30',
    currency: 'USD',
    features: ['ویژگی 1', 'ویژگی 2']
  }
}
```

### تنظیم Schema سفارشی
```typescript
// استفاده از SchemaGenerator مستقیم
import { SchemaGenerator } from '@/lib/schema-generator'

const generator = new SchemaGenerator()
const customSchema = generator.generateSchema('/my-route', {
  title: 'عنوان سفارشی',
  description: 'توضیحات سفارشی',
  price: '100'
})
```

## 📊 صفحات پشتیبانی شده

### خدمات هوش مصنوعی
- `/buy-chatgpt-plus` - ChatGPT Plus
- `/buy-Claude` - Claude Pro  
- `/buy-Midjourney` - Midjourney
- `/buy-DALL-E` - DALL-E

### خدمات هاستینگ
- `/HetznerInvoicePayment` - پرداخت هتزنر
- `/HostingerHostingPayment` - پرداخت هاستینگر

### خدمات مالی
- `/opening-a-wise-account` - باز کردن حساب Wise
- `/Opening-a-PayPal-account` - باز کردن حساب PayPal
- `/charge-paypal-account` - شارژ PayPal
- `/charge-wise-account` - شارژ Wise

### خدمات سفارت
- `/Paying-for-the-American-Embassy` - سفارت آمریکا
- `/Paying-for-the-Australia-Embassy` - سفارت استرالیا

### خدمات آموزشی
- `/toeflPayment` - آزمون TOEFL
- `/IeltsPayment` - آزمون IELTS
- `/grePayment` - آزمون GRE

## 🧪 تست و بررسی

### اجرای تست خودکار
```bash
# بررسی تمام Schema ها
npm run validate-schemas

# خروجی نمونه:
# ✅ /buy-chatgpt-plus - Service
# ✅ /HetznerInvoicePayment - Service
# 📊 تعداد کل Schema ها: 25
# 📊 Schema های معتبر: 25
# 📊 درصد موفقیت: 100%
```

### تست دستی
```bash
# 1. بیلد پروژه
npm run build

# 2. اجرای سرور
npm run start

# 3. بررسی Schema در مرورگر
# DevTools > Application > Structured Data
```

### ابزارهای آنلاین
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)

## 🎯 مزایای SEO

### بهبود نمایش در نتایج جستجو
- Rich Snippets برای خدمات
- نمایش قیمت و امتیاز
- اطلاعات تماس سازمان

### افزایش CTR
- عنوان و توضیحات بهینه
- نمایش ویژگیهای کلیدی
- اعتماد بیشتر کاربران

### بهبود رتبهبندی
- ساختار داده استاندارد
- اطلاعات کامل و دقیق
- سازگاری با الگوریتمهای Google

## 🚨 نکات مهم

### بهترین روشها
- همیشه از تنظیمات config استفاده کنید
- قیمتها را بهروز نگه دارید
- توضیحات را کامل و دقیق بنویسید

### اجتناب از خطاها
- Schema تکراری ایجاد نکنید
- فیلدهای ضروری را خالی نگذارید
- از فرمت صحیح قیمت استفاده کنید

### مانیتورینگ
- بهطور منظم Schema ها را تست کنید
- Google Search Console را چک کنید
- خطاهای Structured Data را رفع کنید

---
**نتیجه:** سیستمی کامل و خودکار برای بهبود SEO با Schema های استاندارد