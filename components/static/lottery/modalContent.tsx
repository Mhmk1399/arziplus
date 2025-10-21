import Image from "next/image";
import React, { useState } from "react";

const ImageWithFallback = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <>
      {!imageError ? (
        <Image
          className={className}
          alt={alt}
          width={width}
          height={height}
          src={src}
          onError={() => setImageError(true)}
        />
      ) : (
        <img
          className={className}
          alt={alt}
          src={src}
          style={{ width, height }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
          }}
        />
      )}
    </>
  );
};

const COLORS = {
  primary: "#0A1D37",
  secondary: "#0A1D37",
  accent: "#4DBFF0",
  white: "#FFFFFF",
  gray: "#A0A0A0",
};

export const modalContents = {
  step1: {
    title: "  راهنمای کامل شرایط ثبت‌نام لاتاری آمریکا 1404",
    content: (
      <div className="space-y-6 text-center" dir="rtl">
        <h2
          className="md:text-3xl text-xl font-bold mb-6"
          style={{ color: COLORS.primary }}
        >
          شرایط ثبت نام لاتاری آمریکا 1404 با ارزی پلاس
        </h2>

        <ImageWithFallback
          className="mx-auto my-4 w-1/3 h-1/3"
          alt="شرایط ثبت نام لاتاری آمریکا 1404 با ارزی پلاس"
          width={500}
          height={500}
          src="https://arziplus.storage.c2.liara.space/images/lottery/55-min%20%281%29.jpg"
        />

        <p
          className="leading-relaxed md:text-lg"
          style={{ color: COLORS.gray }}
        >
          در ادامه تمام شرایطی که برای شرکت در لاتاری نیاز دارید را توضیح
          داده‌ایم.
        </p>

        {/* بخش 1: متولد کشور مجاز */}
        <section>
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            1️⃣ متولد کشور مجاز باشید
          </h3>

          <p className="leading-relaxed mb-4" style={{ color: COLORS.gray }}>
            هر سال، دولت آمریکا لیستی از کشورهایی که مجاز به شرکت در لاتاری
            هستند منتشر می‌کند. ایران، افغانستان و اکثر کشورهای همسایه مجاز به
            شرکت در لاتاری هستند. اما کشورهایی که طی سال‌های اخیر تعداد زیادی
            مهاجر از طریق ویزاهای کاری، خانوادگی یا سرمایه‌گذاری به آمریکا
            فرستاده‌اند، از فهرست مجاز حذف می‌شوند.
          </p>
          <div
            className="bg-green-50 p-4 rounded-lg mb-4"
            style={{ borderRight: `4px solid ${COLORS.primary}` }}
          >
            <p
              className="font-bold md:text-xl text-base"
              style={{ color: COLORS.primary }}
            >
              ایرانیان نه‌تنها مجاز به شرکت هستند، بلکه معمولاً سهمیه بیشتری
              نسبت به برخی کشورها دارند.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p style={{ color: COLORS.gray }}>
              💡 اگر در کشوری متولد شده‌اید که در فهرست مجاز نیست، می‌توانید از
              طریق کشور تولد همسر یا یکی از والدین‌تان در لاتاری شرکت کنید.
            </p>
          </div>
        </section>

        {/* بخش 2: مدرک دیپلم یا سابقه کار */}
        <section>
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            2️⃣ مدرک دیپلم یا سابقه کار داشته باشید
          </h3>
          <p className="leading-relaxed mb-4" style={{ color: COLORS.gray }}>
            برای ثبت نام لاتاری باید حداقل یکی از دو شرط زیر را داشته باشید:
          </p>
          <ul
            className="space-y-2 list-disc list-inside mr-4 mb-4"
            style={{ color: COLORS.gray }}
          >
            <li>مدرک تحصیلی حداقل دیپلم</li>
            <li>یا دو سال سابقه کار قابل اثبات طی پنج سال اخیر</li>
          </ul>
          <div
            className="bg-yellow-50 p-4 rounded-lg"
            style={{ borderRight: `4px solid ${COLORS.secondary}` }}
          >
            <p style={{ color: COLORS.gray }}>
              ⚠️ اگر این شرایط را نداشته باشید، فرم شما ممکن است پذیرفته شود اما
              در مرحله مصاحبه، احتمال رد شدن ویزا زیاد است. در صورت برنده شدن،
              شما باید مدارک تحصیلی و شغلی خود را در فرم DS-260 ثبت و در روز
              مصاحبه ارائه کنید.
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg mt-4">
            <p style={{ color: COLORS.gray }}>
              🔸 <strong>نکته:</strong> افراد زیر 18 سال معمولاً نمی‌توانند
              به‌عنوان متقاضی اصلی ثبت نام کنند، اما می‌توانند همراه والدین
              باشند.
            </p>
          </div>
        </section>

        {/* بخش 3: پاسپورت */}
        <section>
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            3️⃣ بدون نیاز به پاسپورت برای ثبت نام
          </h3>
          <p className="leading-relaxed" style={{ color: COLORS.gray }}>
            در لاتاری 1404 (2027) شما برای ثبت نام نیازی به پاسپورت ندارید. اما
            در صورت برنده شدن باید پاسپورتی با حداقل ۶ ماه اعتبار پس از ورود به
            آمریکا ارائه دهید.
          </p>
        </section>

        {/* بخش 4: مدارک لازم */}
        <section>
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            مدارک لازم برای ثبت نام لاتاری
          </h3>
          <p className="leading-relaxed mb-4" style={{ color: COLORS.gray }}>
            برای پر کردن فرم ثبت نام در سایت ارزی پلاس باید اطلاعات زیر را
            به‌صورت دقیق وارد کنید:
          </p>
          <ul
            className="space-y-2 list-disc list-inside mr-4"
            style={{ color: COLORS.gray }}
          >
            <li>نام و نام خانوادگی</li>
            <li>تاریخ تولد دقیق</li>
            <li>جنسیت</li>
            <li>شهر و کشور محل تولد</li>
            <li>آدرس محل سکونت فعلی</li>
            <li>شماره موبایل و ایمیل معتبر</li>
            <li>آخرین مدرک تحصیلی</li>
            <li>وضعیت تأهل و تعداد فرزندان زیر ۲۱ سال</li>
          </ul>
          <div
            className="bg-red-50 p-4 rounded-lg mt-4"
            style={{ borderRight: `4px solid ${COLORS.secondary}` }}
          >
            <p className="font-bold" style={{ color: COLORS.primary }}>
              ⚠️ دقت در وارد کردن اطلاعات بسیار مهم است. هر اشتباه کوچک ممکن است
              باعث رد شدن پرونده شما شود.
            </p>
          </div>
        </section>

        {/* بخش 5: عکس */}
        <section>
          <h3
            className="text-2xl font-bold mb-4"
            style={{ color: COLORS.secondary }}
          >
            عکس مخصوص لاتاری
          </h3>
          <p className="leading-relaxed mb-4" style={{ color: COLORS.gray }}>
            عکس لاتاری یکی از مهم‌ترین بخش‌های ثبت نام است. عکس باید طبق
            استانداردهای اداره مهاجرت آمریکا باشد:
          </p>
          <ul
            className="space-y-2 list-disc list-inside mr-4 mb-4"
            style={{ color: COLORS.gray }}
          >
            <li>پس‌زمینه سفید</li>
            <li>چهره کاملاً واضح و مستقیم</li>
            <li>بدون عینک یا فیلتر</li>
            <li>اندازه دقیق 600x600 پیکسل</li>
          </ul>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p style={{ color: COLORS.gray }}>
              ارزی پلاس خدمات بررسی و اصلاح عکس لاتاری را ارائه می‌دهد تا مطمئن
              شوید تصویر شما کاملاً مطابق استاندارد است.
            </p>
            <p className="mt-2 font-bold" style={{ color: COLORS.secondary }}>
              👉 برای مشاهده شرایط کامل عکس لاتاری، به بخش راهنمای عکس لاتاری
              ارزی پلاس مراجعه کنید.
            </p>
          </div>
        </section>

        {/* بخش 6: هزینه */}
        <section>
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            هزینه ثبت نام لاتاری 1404
          </h3>
          <p className="leading-relaxed mb-4" style={{ color: COLORS.gray }}>
            هزینه ثبت نام در لاتاری شامل موارد زیر است:
          </p>
          <ul
            className="space-y-2 list-disc list-inside mr-4 mb-4"
            style={{ color: COLORS.gray }}
          >
            <li>کارمزد خدمات ثبت نام ارزی پلاس</li>
            <li>۱ دلار هزینه رسمی اداره مهاجرت آمریکا</li>
          </ul>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="mb-2" style={{ color: COLORS.gray }}>
              نیازی به پرداخت دلار یا هزینه‌های اضافی نیست. هزینه نهایی بر اساس
              تعداد اعضای خانواده محاسبه می‌شود.
            </p>
            <p className="font-bold" style={{ color: COLORS.primary }}>
              👉 مشاهده هزینه ثبت نام لاتاری در ارزی پلاس
            </p>
          </div>
        </section>

        {/* بخش 7: شرایط ایرانیان */}
        <section>
          <h3
            className="text-2xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            🇮🇷 شرایط شرکت در لاتاری برای ایرانیان
          </h3>
          <p className="leading-relaxed mb-4" style={{ color: COLORS.gray }}>
            ثبت نام در لاتاری برای ایرانیان بسیار ساده است و هیچ محدودیتی از نظر
            زبان، مذهب یا شغل وجود ندارد. فقط کافی است شرایط زیر را داشته باشید:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p style={{ color: COLORS.gray }}>
                ✅ متولد کشور مجاز (مثل ایران یا افغانستان)
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p style={{ color: COLORS.gray }}>
                ✅ مدرک تحصیلی حداقل دیپلم یا ۲ سال سابقه کار
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p style={{ color: COLORS.gray }}>
                ✅ سن بالای ۱۸ سال برای ثبت نام مستقل
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p style={{ color: COLORS.gray }}>✅ عکس استاندارد</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p style={{ color: COLORS.gray }}>✅ پرداخت هزینه ثبت نام</p>
            </div>
          </div>
        </section>

        {/* بخش 8: مشاوره */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            مشاوره و ثبت نام لاتاری با ارزی پلاس
          </h3>
          <p className="leading-relaxed mb-4" style={{ color: COLORS.gray }}>
            اگر در هر مرحله از ثبت نام نیاز به راهنمایی دارید، کارشناسان ارزی
            پلاس آماده‌اند تا شما را به‌صورت تخصصی راهنمایی کنند. از بررسی مدارک
            تا آماده‌سازی عکس و تکمیل فرم‌ها، تیم ارزی پلاس تمام مراحل را
            برایتان انجام می‌دهد.
          </p>
          <div className="space-y-2">
            <p className="font-bold" style={{ color: COLORS.primary }}>
              📞 شماره تماس: 021-49374
            </p>
            <p className="font-bold" style={{ color: COLORS.primary }}>
              📱 پشتیبانی تلگرام: 09391324467
            </p>
          </div>
        </section>

        {/* بخش 9: CTA نهایی */}
        <section
          className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2"
          style={{ borderColor: COLORS.primary }}
        >
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.secondary }}
          >
            فرم ثبت نام لاتاری
          </h3>
          <p
            className="leading-relaxed mb-4 text-lg"
            style={{ color: COLORS.gray }}
          >
            فرصت طلایی زندگی شما همین حالاست! با شرکت در لاتاری 1404 (2027) شانس
            دریافت گرین کارت آمریکا را برای خود و خانواده‌تان رقم بزنید. همین
            حالا فرم ثبت نام را از طریق سایت ارزی پلاس تکمیل کنید و قدمی بزرگ به
            سوی رویای آمریکایی بردارید.
          </p>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: COLORS.primary }}>
              ثبت نام لاتاری آمریکا با ارزی پلاس
            </p>
          </div>
        </section>
      </div>
    ),
  },

  step2: {
    title:
      "📸 عکس لاتاری 1404 (2027) – راهنمای کامل ثبت عکس گرین کارت با ارزی پلاس",
    content: (
      <div className="space-y-6 text-center" dir="rtl">
        <h2
          className="md:text-3xl text-xl font-bold mb-6"
          style={{ color: COLORS.secondary }}
        >
          عکس لاتاری 1404 (2027) – راهنمای کامل ثبت عکس گرین کارت با ارزی پلاس
        </h2>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            عکس مناسب برای ثبت‌نام لاتاری گرین کارت آمریکا
          </h3>
          <ImageWithFallback
            className="mx-auto my-4 "
            alt="شرایط ثبت نام لاتاری آمریکا 1404 با ارزی پلاس"
            width={300}
            height={300}
            src="https://arziplus.storage.c2.liara.space/images/lottery/58-min.jpg"
          />
          <p className="leading-relaxed mb-4" style={{ color: COLORS.gray }}>
            برای بسیاری از متقاضیان، تهیه عکس استاندارد لاتاری از دشوارترین
            مراحل ثبت نام است. اگر قصد شرکت در لاتاری 1404 (لاتاری 2027) را
            دارید، توجه داشته باشید که عکس شما باید دقیقاً مطابق با استانداردهای
            اداره مهاجرت آمریکا باشد. ارزی پلاس به شما کمک می‌کند تا عکس خود را
            مطابق تمام شرایط و بدون هیچ خطایی آماده کرده و با اطمینان در لاتاری
            شرکت کنید.
          </p>
        </section>

        <section className="bg-blue-50 p-4 rounded-lg">
          <h4
            className="text-xl font-bold mb-3"
            style={{ color: COLORS.primary }}
          >
            فهرست مطالب
          </h4>
          <ul className="space-y-1" style={{ color: COLORS.gray }}>
            <li>• شرایط و فرمت عمومی عکس لاتاری</li>
            <li>• شرایط عکس آقایان</li>
            <li>• شرایط عکس بانوان</li>
            <li>• شرایط عکس نوزادان</li>
            <li>• آموزش گرفتن عکس لاتاری با موبایل</li>
            <li>• نکات مهم در عکاسی لاتاری</li>
            <li>• ابعاد و حجم استاندارد عکس لاتاری</li>
            <li>• سوالات متداول</li>
          </ul>
        </section>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            شرایط و فرمت عمومی عکس لاتاری
          </h3>
          <p className="mb-4" style={{ color: COLORS.gray }}>
            برای اینکه عکس شما در سیستم ثبت‌نام لاتاری پذیرفته شود، باید
            ویژگی‌های زیر را داشته باشد:
          </p>
          <ul
            className="space-y-2 list-disc list-inside mr-4"
            style={{ color: COLORS.gray }}
          >
            <li>
              پس‌زمینه سفید یا روشن (در صورت نیاز توسط کارشناسان ارزی پلاس
              ویرایش می‌شود)
            </li>
            <li>نمای نیم‌تنه از روبه‌رو با فاصله مناسب</li>
            <li>وضوح و کیفیت بالا بدون تاری، سایه یا افکت</li>
            <li>چهره کاملاً تمام‌رخ و مستقیم به دوربین</li>
            <li>فضای خالی بالای سر و اطراف شانه‌ها مشخص باشد</li>
            <li>عکس جدید باشد (کمتر از ۶ ماه)</li>
            <li>
              ژرفای رنگی ۲۴ بیت در هر پیکسل (عکس‌های سیاه و سفید پذیرفته
              نمی‌شوند)
            </li>
          </ul>
          <div
            className="bg-yellow-50 p-4 rounded-lg mt-4"
            style={{ borderRight: `4px solid ${COLORS.secondary}` }}
          >
            <p className="font-bold" style={{ color: COLORS.primary }}>
              ⚠️ توجه: همه اعضای خانواده (همسر و فرزندان زیر ۲۱ سال) نیز باید
              عکس جداگانه و استاندارد داشته باشند.
            </p>
          </div>
        </section>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            شرایط عکس لاتاری برای آقایان
          </h3>
          <ImageWithFallback
            className="mx-auto my-4 "
            alt="شرایط ثبت نام لاتاری آمریکا 1404 با ارزی پلاس"
            width={300}
            height={300}
            src="https://arziplus.storage.c2.liara.space/images/lottery/%D8%B4%D8%B1%D8%A7%DB%8C%D8%B7%20%D8%AB%D8%A8%D8%AA%20%D9%86%D8%A7%D9%85%20%D9%84%D8%A7%D8%AA%D8%A7%D8%B1%DB%8C.jpg"
          />
          <ul
            className="space-y-2 list-disc list-inside mr-4"
            style={{ color: COLORS.gray }}
          >
            <li>بدون عینک، کلاه یا پوشش سر</li>
            <li>زیورآلات در صورت نپوشاندن چهره، بلامانع است</li>
            <li>ریش و سبیل اختیاری است</li>
            <li>موها نباید روی صورت را بپوشانند</li>
            <li>لبخند با دندان‌های مشخص مجاز نیست</li>
            <li>بدون چسب یا پوشش روی بینی</li>
            <li>عکس باید رنگی و واضح باشد</li>
          </ul>
          <div className="bg-green-50 p-3 rounded-lg mt-4">
            <p style={{ color: COLORS.gray }}>
              <strong>نکته:</strong> کارشناسان ارزی پلاس در صورت نیاز، ویرایش
              عکس را به صورت استاندارد انجام می‌دهند.
            </p>
          </div>
        </section>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            شرایط عکس لاتاری برای بانوان
          </h3>
          <ImageWithFallback
            className="mx-auto my-4 "
            alt="شرایط ثبت نام لاتاری آمریکا 1404 با ارزی پلاس"
            width={300}
            height={300}
            src="https://arziplus.storage.c2.liara.space/images/lottery/61-min.jpg"
          />
          <p className="mb-4" style={{ color: COLORS.gray }}>
            بانوان می‌توانند عکس خود را با یا بدون حجاب اسلامی ارسال کنند، تنها
            کافی است گردی صورت مشخص باشد.
          </p>
          <ul
            className="space-y-2 list-disc list-inside mr-4"
            style={{ color: COLORS.gray }}
          >
            <li>داشتن روسری یا مقنعه مانعی ندارد</li>
            <li>آرایش باید طبیعی باشد و چهره را نپوشاند</li>
            <li>زیورآلات به شرط مشخص بودن چهره مجاز است</li>
            <li>لبخند بدون نمایش دندان</li>
            <li>پوشش‌های سنگین، فیلتر یا ادیت ممنوع</li>
            <li>عکس سیاه و سفید قابل قبول نیست</li>
          </ul>
        </section>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            شرایط عکس لاتاری برای نوزادان و کودکان
          </h3>
          <ImageWithFallback
            className="mx-auto my-4 "
            alt="شرایط ثبت نام لاتاری آمریکا 1404 با ارزی پلاس"
            width={300}
            height={300}
            src="https://arziplus.storage.c2.liara.space/images/lottery/60-min.jpg"
          />
          <p className="mb-4" style={{ color: COLORS.gray }}>
            حتی نوزادان یک‌روزه نیز باید عکس جداگانه داشته باشند. اما چون گرفتن
            عکس از کودکان دشوار است، قوانین کمی آسان‌تر است:
          </p>
          <ul
            className="space-y-2 list-disc list-inside mr-4"
            style={{ color: COLORS.gray }}
          >
            <li>نوزاد باید بیدار باشد</li>
            <li>پس‌زمینه باید روشن یا سفید باشد</li>
            <li>کودک را می‌توان روی پارچه سفید خواباند و از بالا عکس گرفت</li>
            <li>
              هیچ فردی نباید در عکس دیده شود (دست نگه‌دارنده یا وسایل اضافی حذف
              شوند)
            </li>
          </ul>
        </section>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            آموزش گرفتن عکس لاتاری با موبایل در منزل
          </h3>
          <p className="mb-4" style={{ color: COLORS.gray }}>
            اگر به عکاسی حضوری دسترسی ندارید، می‌توانید با موبایل خود عکس مناسب
            تهیه کنید. تنها کافی است نکات زیر را رعایت کنید:
          </p>
          <ul
            className="space-y-2 list-disc list-inside mr-4"
            style={{ color: COLORS.gray }}
          >
            <li>عکس سلفی یا پرسنلی ۳×۴ مورد قبول نیست</li>
            <li>دوربین در زاویه مستقیم و روبه‌رو باشد</li>
            <li>سر صاف و بدون خمیدگی</li>
            <li>موها از روی صورت کنار زده شوند</li>
            <li>عکس بدون فیلتر، سایه یا روتوش باشد</li>
            <li>لباس روشن بپوشید اما سفید نباشد</li>
            <li>از نور طبیعی روز استفاده کنید</li>
            <li>صورت در مرکز کادر و چشمان مستقیم به دوربین نگاه کنند</li>
          </ul>
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <p style={{ color: COLORS.gray }}>
              عکس خام خود را ارسال کنید تا تیم ارزی پلاس آن را ویرایش، اصلاح و
              سایزبندی کند.
            </p>
          </div>
        </section>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            ⚠️ نکات مهم در مورد عکس لاتاری
          </h3>
          <div
            className="bg-red-50 p-4 rounded-lg"
            style={{ borderRight: `4px solid ${COLORS.secondary}` }}
          >
            <p className="mb-3" style={{ color: COLORS.gray }}>
              عکس لاتاری نقش حیاتی در پذیرش فرم شما دارد. در صورت ارسال تصویر
              نامناسب، پرونده شما به‌صورت خودکار از قرعه‌کشی حذف می‌شود.
            </p>
            <p className="font-bold mb-2" style={{ color: COLORS.primary }}>
              نکات کلیدی:
            </p>
            <ul
              className="space-y-2 list-disc list-inside mr-4"
              style={{ color: COLORS.gray }}
            >
              <li>سیستم ثبت نام لاتاری قادر به تشخیص اشتباهات عکس نیست.</li>
              <li>
                عکس‌های ویرایش‌شده توسط کارشناسان ارزی پلاس مطابق استاندارد
                اداره مهاجرت آمریکا اصلاح و بارگذاری می‌شوند.
              </li>
              <li>
                در صورت وجود مشکل در تصویر، از طریق پیامک یا ایمیل اطلاع‌رسانی
                می‌شود تا بتوانید عکس جدید ارسال کنید.
              </li>
            </ul>
          </div>
          <p className="mt-4" style={{ color: COLORS.gray }}>
            📩 عکس‌ها با فرمت‌های jpg, jpeg, png, bmp, gif, webp, heic, pdf قابل
            ارسال هستند (حتی در حالت فشرده zip یا rar).
          </p>
        </section>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            اندازه و ابعاد عکس لاتاری گرین کارت
          </h3>
          <p className="mb-4" style={{ color: COLORS.gray }}>
            برای ثبت‌نام لاتاری، ابعاد عکس باید به‌صورت زیر باشد:
          </p>
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse border"
              style={{ borderColor: COLORS.primary }}
            >
              <thead>
                <tr style={{ backgroundColor: `${COLORS.primary}20` }}>
                  <th
                    className="border p-3 text-center"
                    style={{
                      borderColor: COLORS.primary,
                      color: COLORS.primary,
                    }}
                  >
                    ویژگی
                  </th>
                  <th
                    className="border p-3 text-center"
                    style={{
                      borderColor: COLORS.primary,
                      color: COLORS.primary,
                    }}
                  >
                    مقدار
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    حداقل ابعاد عکس
                  </td>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    600 × 600 پیکسل
                  </td>
                </tr>
                <tr style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    حداکثر ابعاد عکس
                  </td>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    1200 × 1200 پیکسل
                  </td>
                </tr>
                <tr>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    نسبت ابعاد
                  </td>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    1:1 (مربع)
                  </td>
                </tr>
                <tr style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    اندازه چاپی
                  </td>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    5 × 5 سانتی‌متر
                  </td>
                </tr>
                <tr>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    حجم مجاز فایل
                  </td>
                  <td
                    className="border p-3"
                    style={{ borderColor: COLORS.primary, color: COLORS.gray }}
                  >
                    حداکثر 240 کیلوبایت
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            سوالات متداول درباره عکس لاتاری
          </h3>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold mb-2" style={{ color: COLORS.primary }}>
                آیا می‌توان عکس لاتاری را با موبایل گرفت؟
              </p>
              <p style={{ color: COLORS.gray }}>
                بله، در صورتی که نورپردازی مناسب، پس‌زمینه ساده و زاویه مستقیم
                رعایت شود. گوشی‌های آیفون، سامسونگ و سایر مدل‌های هوشمند کافی
                هستند.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold mb-2" style={{ color: COLORS.primary }}>
                آیا می‌توان از عکس پارسال استفاده کرد؟
              </p>
              <p style={{ color: COLORS.gray }}>
                خیر. توصیه می‌شود حتماً عکس جدید و کمتر از ۶ ماه تهیه کنید تا
                مغایرتی با قوانین نداشته باشد.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold mb-2" style={{ color: COLORS.primary }}>
                آیا می‌توان عکس لاتاری را در منزل گرفت؟
              </p>
              <p style={{ color: COLORS.gray }}>
                بله، اما باید تمامی استانداردها رعایت شود. در صورت نیاز، ارزی
                پلاس راهنمای کامل و ویرایش تخصصی تصویر را برای شما انجام می‌دهد.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
          <h3
            className="md:text-3xl text-xl font-bold mb-4"
            style={{ color: COLORS.secondary }}
          >
            خدمات عکاسی و ویرایش عکس لاتاری با ارزی پلاس
          </h3>
          <p className="leading-relaxed" style={{ color: COLORS.gray }}>
            اگر مایل هستید عکس خود را به‌صورت حرفه‌ای و کاملاً استاندارد آماده
            کنید، می‌توانید از خدمات عکاسی لاتاری ارزی پلاس استفاده کنید.
            کارشناسان ما با بررسی دقیق تصویر، نور، پس‌زمینه و ابعاد، عکس شما را
            مطابق استاندارد رسمی اداره مهاجرت آمریکا تنظیم می‌کنند.
          </p>
          <p className="mt-4 font-bold" style={{ color: COLORS.secondary }}>
            👉 رزرو وقت عکاسی لاتاری در ارزی پلاس
          </p>
        </section>
      </div>
    ),
  },

  step3: {
    title: "💰 راهنمای پرداخت هزینه ثبت‌نام لاتاری",
    content: (
      <div className="space-y-6 text-center" dir="rtl">
        <h2
          className="md:text-3xl text-xl font-bold"
          style={{ color: COLORS.primary }}
        >
          پرداخت هزینه ثبت‌نام لاتاری با ارزی پلاس
        </h2>

        <section>
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            روش‌های پرداخت
          </h3>
          <ul
            className="space-y-2 list-disc list-inside"
            style={{ color: COLORS.gray }}
          >
            <li>پرداخت آنلاین از طریق درگاه امن بانکی</li>
            <li>کارت به کارت</li>
            <li>واریز به حساب</li>
            <li>پرداخت حضوری در دفاتر ارزی پلاس</li>
          </ul>
        </section>

        <section>
          <h3
            className="md:text-2xl text-xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            مراحل پس از پرداخت
          </h3>
          <ul
            className="space-y-2 list-disc list-inside"
            style={{ color: COLORS.gray }}
          >
            <li>دریافت رسید پرداخت</li>
            <li>تایید ثبت‌نام از طریق ایمیل</li>
            <li>دریافت کد رهگیری</li>
            <li>امکان پیگیری وضعیت ثبت‌نام</li>
          </ul>
        </section>

        <div
          className="bg-green-50 p-6 rounded-lg"
          style={{ borderRight: `4px solid ${COLORS.primary}` }}
        >
          <p className="font-bold mb-2" style={{ color: COLORS.primary }}>
            🔒 امنیت پرداخت
          </p>
          <p style={{ color: COLORS.gray }}>
            تمامی پرداخت‌ها از طریق درگاه‌های معتبر بانکی و با رعایت
            استانداردهای امنیتی انجام می‌شود.
          </p>
        </div>
      </div>
    ),
  },
};
