import { SchemaData } from './schema-generator'

// تنظیمات Schema برای صفحات مختلف
export const schemaConfig: Record<string, Partial<SchemaData>> = {
  // صفحه اصلی
  '/': {
    type: 'Organization',
    title: 'ارزی پلاس - خدمات پرداخت ارزی و خرید اشتراک خارجی',
    description: 'ارائه خدمات پرداخت ارزی، خرید اشتراک ChatGPT، Netflix، Spotify و باز کردن حساب خارجی',
    features: ['پرداخت ارزی', 'خرید اشتراک', 'باز کردن حساب خارجی', 'پشتیبانی 24 ساعته']
  },

  // خدمات هوش مصنوعی
  '/buy-chatgpt-plus': {
    type: 'Service',
    title: 'خرید ChatGPT Plus از ایران - پرداخت ریالی',
    description: 'خرید اشتراک ChatGPT Plus با پرداخت ریالی، بدون نیاز به کارت اعتباری خارجی',
    category: 'AI Services',
    provider: 'OpenAI',
    price: '25',
    currency: 'USD',
    features: ['دسترسی اولویتدار', 'پاسخ سریعتر', 'دسترسی به GPT-4', 'پلاگینها']
  },

  '/buy-Claude': {
    type: 'Service',
    title: 'خرید اشتراک Claude Pro از ایران',
    description: 'خرید اشتراک Claude Pro با پرداخت ریالی و دسترسی کامل به قابلیتهای پیشرفته',
    category: 'AI Services',
    provider: 'Anthropic',
    price: '20',
    currency: 'USD'
  },

  '/buy-Midjourney': {
    type: 'Service',
    title: 'خرید اشتراک Midjourney از ایران',
    description: 'خرید اشتراک Midjourney برای تولید تصاویر با هوش مصنوعی',
    category: 'AI Services',
    provider: 'Midjourney',
    price: '10',
    currency: 'USD'
  },

  '/buy-D-ID': {
    type: 'Service',
    title: 'خرید اشتراک D-ID از ایران',
    description: 'خرید اشتراک D-ID برای تولید ویدیو با هوش مصنوعی',
    category: 'AI Services',
    provider: 'D-ID'
  },

  '/buy-DALL-E': {
    type: 'Service',
    title: 'خرید اشتراک DALL-E از ایران',
    description: 'خرید اشتراک DALL-E برای تولید تصاویر',
    category: 'AI Services',
    provider: 'OpenAI'
  },

  // خدمات هاستینگ
  '/HetznerInvoicePayment': {
    type: 'Service',
    title: 'پرداخت فاکتور هتزنر از ایران - ارزی پلاس',
    description: 'پرداخت فاکتور هتزنر با کارمزد پایین و در کمتر از 1 ساعت',
    category: 'Hosting Services',
    provider: 'Hetzner',
    features: ['پرداخت سریع', 'کارمزد پایین', 'پشتیبانی فارسی', 'تضمین پرداخت']
  },

  '/HostingerHostingPayment': {
    type: 'Service',
    title: 'پرداخت هاستینگر از ایران',
    description: 'پرداخت فاکتور هاستینگر با پرداخت ریالی',
    category: 'Hosting Services',
    provider: 'Hostinger'
  },

  // خدمات حسابکاربری
  '/opening-a-wise-account': {
    type: 'Service',
    title: 'باز کردن حساب Wise از ایران - راهنمای کامل',
    description: 'راهنمای کامل باز کردن حساب Wise برای ایرانیان با تمام مراحل',
    category: 'Financial Services',
    provider: 'Wise',
    steps: ['ثبتنام', 'تأیید هویت', 'واریز اولیه', 'فعالسازی کارت']
  },

  '/Opening-a-PayPal-account': {
    type: 'Service',
    title: 'باز کردن حساب PayPal از ایران',
    description: 'راهنمای باز کردن حساب PayPal برای کاربران ایرانی',
    category: 'Financial Services',
    provider: 'PayPal'
  },

  '/opening-a-payeer-account': {
    type: 'Service',
    title: 'باز کردن حساب Payeer از ایران',
    description: 'راهنمای کامل باز کردن حساب Payeer',
    category: 'Financial Services',
    provider: 'Payeer'
  },

  '/opening-a-perfect-money-account': {
    type: 'Service',
    title: 'باز کردن حساب Perfect Money از ایران',
    description: 'راهنمای کامل باز کردن حساب Perfect Money',
    category: 'Financial Services',
    provider: 'Perfect Money'
  },

  // خدمات شارژ حساب
  '/charge-paypal-account': {
    type: 'Service',
    title: 'شارژ حساب PayPal از ایران',
    description: 'شارژ حساب PayPal با پرداخت ریالی و کارمزد مناسب',
    category: 'Financial Services',
    provider: 'PayPal'
  },

  '/charge-wise-account': {
    type: 'Service',
    title: 'شارژ حساب Wise از ایران',
    description: 'شارژ حساب Wise با بهترین نرخ ارز',
    category: 'Financial Services',
    provider: 'Wise'
  },

  '/charge-payeer-account': {
    type: 'Service',
    title: 'شارژ حساب Payeer از ایران',
    description: 'شارژ حساب Payeer با پرداخت ریالی',
    category: 'Financial Services',
    provider: 'Payeer'
  },

  '/charge-perfect-Money-account': {
    type: 'Service',
    title: 'شارژ حساب Perfect Money از ایران',
    description: 'شارژ حساب Perfect Money با بهترین نرخ',
    category: 'Financial Services',
    provider: 'Perfect Money'
  },

  // خدمات برداشت
  '/cashing-out-Payer-balance': {
    type: 'Service',
    title: 'برداشت موجودی Payeer از ایران',
    description: 'برداشت و تبدیل موجودی Payeer به ریال',
    category: 'Financial Services',
    provider: 'Payeer'
  },

  '/cashing-out-PayPal-balance': {
    type: 'Service',
    title: 'برداشت موجودی PayPal از ایران',
    description: 'برداشت و تبدیل موجودی PayPal به ریال',
    category: 'Financial Services',
    provider: 'PayPal'
  },

  '/cashing-out-PerfectMoney-balance': {
    type: 'Service',
    title: 'برداشت موجودی Perfect Money از ایران',
    description: 'برداشت موجودی Perfect Money',
    category: 'Financial Services',
    provider: 'Perfect Money'
  },

  '/cashing-out-wise-account': {
    type: 'Service',
    title: 'برداشت موجودی Wise از ایران',
    description: 'برداشت و انتقال موجودی Wise',
    category: 'Financial Services',
    provider: 'Wise'
  },

  // خدمات سرگرمی
  '/buy-Airbnb': {
    type: 'Service',
    title: 'پرداخت Airbnb از ایران',
    description: 'پرداخت هزینه اقامت Airbnb با پرداخت ریالی',
    category: 'Travel Services',
    provider: 'Airbnb'
  },

  '/buy-booking': {
    type: 'Service',
    title: 'پرداخت Booking.com از ایران',
    description: 'پرداخت هزینه هتل در Booking.com',
    category: 'Travel Services',
    provider: 'Booking.com'
  },

  // خدمات سفارت
  '/Paying-for-the-American-Embassy': {
    type: 'Service',
    title: 'پرداخت هزینه سفارت آمریکا از ایران',
    description: 'پرداخت هزینه ویزا و خدمات سفارت آمریکا',
    category: 'Embassy Services',
    provider: 'US Embassy'
  },

  '/Paying-for-the-Australia-Embassy': {
    type: 'Service',
    title: 'پرداخت هزینه سفارت استرالیا از ایران',
    description: 'پرداخت هزینه ویزا استرالیا با پرداخت ریالی',
    category: 'Embassy Services',
    provider: 'Australia Embassy'
  },

  '/Paying-for-the-england-Embassy': {
    type: 'Service',
    title: 'پرداخت هزینه سفارت انگلستان از ایران',
    description: 'پرداخت هزینه ویزا انگلستان',
    category: 'Embassy Services',
    provider: 'UK Embassy'
  },

  '/Paying-tuition-fees-at-a-foreign-university': {
    type: 'Service',
    title: 'پرداخت شهریه دانشگاه خارجی از ایران',
    description: 'پرداخت شهریه دانشگاههای خارجی',
    category: 'Education Services'
  },

  // خدمات آموزشی
  '/toeflPayment': {
    type: 'Service',
    title: 'پرداخت هزینه آزمون TOEFL از ایران',
    description: 'ثبتنام و پرداخت هزینه آزمون TOEFL',
    category: 'Education Services',
    provider: 'ETS'
  },

  '/IeltsPayment': {
    type: 'Service',
    title: 'پرداخت هزینه آزمون IELTS از ایران',
    description: 'ثبتنام و پرداخت هزینه آزمون IELTS',
    category: 'Education Services',
    provider: 'British Council'
  },

  '/grePayment': {
    type: 'Service',
    title: 'پرداخت هزینه آزمون GRE از ایران',
    description: 'ثبتنام و پرداخت هزینه آزمون GRE',
    category: 'Education Services',
    provider: 'ETS'
  },

  '/duolingoPayment': {
    type: 'Service',
    title: 'پرداخت اشتراک Duolingo از ایران',
    description: 'خرید اشتراک Duolingo Plus',
    category: 'Education Services',
    provider: 'Duolingo'
  },

  '/prometricPayment': {
    type: 'Service',
    title: 'پرداخت آزمون Prometric از ایران',
    description: 'ثبتنام و پرداخت آزمون Prometric',
    category: 'Education Services',
    provider: 'Prometric'
  },

  '/register-international-exams': {
    type: 'Service',
    title: 'ثبتنام آزمونهای بینالمللی از ایران',
    description: 'ثبتنام و پرداخت انواع آزمونهای بینالمللی',
    category: 'Education Services'
  },

  '/UniAssistPayment': {
    type: 'Service',
    title: 'پرداخت UniAssist از ایران',
    description: 'پرداخت هزینه درخواست تحصیل از طریق UniAssist',
    category: 'Education Services',
    provider: 'UniAssist'
  },

  '/ApplicationFeePayment': {
    type: 'Service',
    title: 'پرداخت هزینه درخواست از ایران',
    description: 'پرداخت هزینه درخواست تحصیل و ویزا',
    category: 'Education Services'
  },

  '/depositFeePayment': {
    type: 'Service',
    title: 'پرداخت هزینه سپرده از ایران',
    description: 'پرداخت هزینه سپرده تحصیل و اقامت',
    category: 'Education Services'
  },

  // صفحه خدمات
  '/services': {
    type: 'WebPage',
    title: 'خدمات ارزی پلاس - فهرست کامل',
    description: 'فهرست کامل خدمات پرداخت ارزی، خرید اشتراک و باز کردن حساب خارجی',
    category: 'Services Directory'
  },

  // خدمات سیم کارت بینالمللی
  '/EnglishSimCard': {
    type: 'Service',
    title: 'خرید سیم کارت انگلیس از ایران',
    description: 'خرید سیم کارت انگلیس برای مسافرت و اقامت',
    category: 'Telecom Services',
    provider: 'UK Telecom'
  },

  '/EstonianSimCard': {
    type: 'Service',
    title: 'خرید سیم کارت استونی از ایران',
    description: 'خرید سیم کارت استونی برای اروپا',
    category: 'Telecom Services',
    provider: 'Estonia Telecom'
  },

  '/GermanSimCard': {
    type: 'Service',
    title: 'خرید سیم کارت آلمان از ایران',
    description: 'خرید سیم کارت آلمان برای مسافرت و تحصیل',
    category: 'Telecom Services',
    provider: 'Germany Telecom'
  },

  '/MalaysianSimCard': {
    type: 'Service',
    title: 'خرید سیم کارت مالزی از ایران',
    description: 'خرید سیم کارت مالزی برای آسیا',
    category: 'Telecom Services',
    provider: 'Malaysia Telecom'
  },

  '/InternationalSimRecharge': {
    type: 'Service',
    title: 'شارژ سیم کارت بینالمللی از ایران',
    description: 'شارژ اعتبار سیم کارتهای بینالمللی',
    category: 'Telecom Services'
  },

  // خدمات اضافی
  '/jokerPayment': {
    type: 'Service',
    title: 'خرید دامنه از Joker از ایران',
    description: 'خرید دامنه از سایت Joker.com',
    category: 'Domain Services',
    provider: 'Joker.com'
  },

  '/opening-a-Upwork-account': {
    type: 'Service',
    title: 'باز کردن حساب Upwork از ایران',
    description: 'راهنمای کامل باز کردن حساب Upwork برای فریلنسرها',
    category: 'Freelance Services',
    provider: 'Upwork'
  },

  '/AddressVerificationDocuments': {
    type: 'Service',
    title: 'مدارک تأیید آدرس بینالمللی',
    description: 'دریافت مدارک تأیید آدرس برای حسابهای بینالمللی',
    category: 'Document Services'
  },

  // صفحات اضافی
  '/about': {
    type: 'WebPage',
    title: 'درباره ارزی پلاس',
    description: 'آشنایی با ارزی پلاس و خدمات ما',
    category: 'About'
  },

  '/contact': {
    type: 'WebPage',
    title: 'تماس با ارزی پلاس',
    description: 'راههای تماس و پشتیبانی ارزی پلاس',
    category: 'Contact'
  },

  '/services-client': {
    type: 'WebPage',
    title: 'پنل مشتری ارزی پلاس',
    description: 'پنل مدیریت خدمات و سفارشات',
    category: 'Client Panel'
  }
}

// دریافت تنظیمات Schema برای یک route
export function getSchemaConfig(route: string): Partial<SchemaData> | undefined {
  return schemaConfig[route]
}

// شمارش کل صفحات تعریف شده
export function getTotalPagesCount(): number {
  return Object.keys(schemaConfig).length
}

// دریافت لیست صفحات جدید
export function getNewPages(): string[] {
  return [
    '/EnglishSimCard',
    '/EstonianSimCard', 
    '/GermanSimCard',
    '/MalaysianSimCard',
    '/InternationalSimRecharge',
    '/jokerPayment',
    '/opening-a-Upwork-account',
    '/AddressVerificationDocuments',
    '/about',
    '/contact',
    '/services-client'
  ]
}