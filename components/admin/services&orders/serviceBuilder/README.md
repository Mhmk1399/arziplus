# Service Builder System

سیستم ساخت سرویس‌های پویا برای ایجاد فرم‌های مختلف و مدیریت درخواست‌های کاربران.

## ویژگی‌ها

- 🚀 **ایجاد سرویس‌های پویا**: امکان ایجاد فرم‌های مختلف با فیلدهای متنوع
- 🎨 **رابط کاربری زیبا**: طراحی مدرن با افکت‌های بصری جذاب
- 📝 **انواع فیلد مختلف**: متن، عدد، انتخاب، چک‌باکس، فایل، تاریخ و...
- 🔗 **منطق شرطی**: نمایش فیلدها بر اساس مقادیر فیلدهای دیگر
- ✅ **اعتبارسنجی پیشرفته**: قوانین اعتبارسنجی قابل تنظیم
- 📱 **طراحی ریسپانسیو**: سازگار با تمام دستگاه‌ها
- 🔄 **مدیریت کامل**: CRUD کامل برای سرویس‌ها و درخواست‌ها

## ساختار فایل‌ها

```
components/serviceBuilder/
├── ServiceBuilder.tsx      # کامپوننت اصلی ساخت سرویس
├── ServiceRenderer.tsx     # نمایش سرویس به عنوان فرم
├── ServiceList.tsx         # لیست سرویس‌ها
├── ServiceManager.tsx      # مدیریت کامل سرویس‌ها
├── FieldBuilder.tsx        # ساخت فیلدها
└── index.ts               # Export اصلی

types/serviceBuilder/
└── types.ts               # تایپ‌های TypeScript

app/api/
├── dynamicServices/       # API سرویس‌ها
│   └── route.ts
└── service-requests/      # API درخواست‌ها
    └── route.ts
```

## استفاده

### 1. نمایش لیست سرویس‌ها (برای کاربران)

```tsx
import { ServiceManager } from '@/components/serviceBuilder';

function ServicesPage() {
  return <ServiceManager mode="user" />;
}
```

### 2. مدیریت سرویس‌ها (برای ادمین)

```tsx
import { ServiceManager } from '@/components/serviceBuilder';

function AdminServicesPage() {
  return <ServiceManager mode="admin" />;
}
```

### 3. ایجاد سرویس جدید

```tsx
import { ServiceBuilder } from '@/components/serviceBuilder';

function CreateServicePage() {
  const handleSave = async (data) => {
    const response = await fetch('/api/dynamicServices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  return <ServiceBuilder onSave={handleSave} />;
}
```

### 4. نمایش یک سرویس خاص

```tsx
import ServiceRenderer from '@/components/ServiceRenderer';

function ServicePage({ service }) {
  const handleSubmit = (data) => {
    console.log('Service request:', data);
    // Handle service request submission
  };

  return (
    <ServiceRenderer 
      service={service}
      onSubmit={handleSubmit}
    />
  );
}
```

## انواع فیلد

### فیلدهای متنی
- `string`: متن ساده
- `email`: ایمیل
- `password`: رمز عبور
- `tel`: شماره تلفن
- `textarea`: متن چندخطی

### فیلدهای عددی
- `number`: عدد

### فیلدهای انتخاب
- `select`: انتخاب تکی
- `multiselect`: انتخاب چندگانه
- `boolean`: بله/خیر (چک‌باکس)

### فیلدهای خاص
- `date`: تاریخ
- `file`: آپلود فایل

## مثال: ایجاد سرویس ChatGPT

```tsx
const chatGPTService = {
  title: 'ایجاد حساب ChatGPT',
  slug: 'create-chatgpt-account',
  fee: 150000,
  description: 'ایجاد حساب ChatGPT Plus',
  fields: [
    {
      name: 'email',
      label: 'آدرس ایمیل',
      type: 'email',
      required: true,
      placeholder: 'example@gmail.com'
    },
    {
      name: 'account_type',
      label: 'نوع حساب',
      type: 'select',
      required: true,
      options: [
        { key: 'free', value: 'حساب رایگان' },
        { key: 'plus', value: 'ChatGPT Plus' }
      ]
    },
    {
      name: 'phone_verification',
      label: 'تأیید شماره تلفن',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'phone_number',
      label: 'شماره تلفن',
      type: 'tel',
      showIf: {
        field: 'phone_verification',
        value: true
      },
      validation: {
        pattern: '^\\+[1-9]\\d{1,14}$',
        message: 'فرمت صحیح: +989123456789'
      }
    }
  ]
};
```

## API Endpoints

### سرویس‌ها (Dynamic Services)
- `GET /api/dynamicServices` - لیست سرویس‌ها
- `POST /api/dynamicServices` - ایجاد سرویس جدید  
- `PUT /api/dynamicServices` - بروزرسانی سرویس
- `DELETE /api/dynamicServices` - حذف سرویس

### درخواست‌ها (Service Requests)
- `GET /api/service-requests` - لیست درخواست‌ها
- `POST /api/service-requests` - ثبت درخواست جدید
- `PUT /api/service-requests` - بروزرسانی وضعیت درخواست
- `DELETE /api/service-requests` - حذف درخواست

## اعتبارسنجی

### قوانین موجود:
- `required`: اجباری بودن فیلد
- `minLength/maxLength`: حداقل/حداکثر طول متن
- `min/max`: حداقل/حداکثر مقدار عدد
- `pattern`: الگوی regex
- `email`: فرمت ایمیل

### مثال:
```tsx
{
  name: 'password',
  label: 'رمز عبور',
  type: 'password',
  required: true,
  validation: {
    minLength: 8,
    maxLength: 50,
    message: 'رمز عبور باید بین 8 تا 50 کاراکتر باشد'
  }
}
```

## منطق شرطی

فیلدها را می‌توان بر اساس مقدار فیلدهای دیگر نمایش داد:

```tsx
{
  name: 'advanced_options',
  label: 'تنظیمات پیشرفته',
  type: 'textarea',
  showIf: {
    field: 'account_type',
    value: 'premium'
  }
}
```

## Styling

سیستم از Tailwind CSS استفاده می‌کند و شامل:
- طراحی شیشه‌ای (Glassmorphism)
- انیمیشن‌های روان
- طراحی تیره با رنگ‌های مدرن
- ریسپانسیو بودن کامل

## توسعه

برای اضافه کردن نوع فیلد جدید:

1. نوع فیلد را به `ServiceField['type']` اضافه کنید
2. منطق فیلد را به `FieldBuilder.tsx` اضافه کنید
3. منطق رندر را به `ServiceRenderer.tsx` اضافه کنید
4. اعتبارسنجی مربوطه را تعریف کنید

## مثال‌ها

صفحه `/examples/chatgpt-service` حاوی مثال کاملی از ایجاد سرویس پیچیده است که شامل:
- انواع مختلف فیلد
- منطق شرطی
- اعتبارسنجی
- فیلدهای اجباری و اختیاری