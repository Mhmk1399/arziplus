import { FaShieldAlt, FaGavel, FaUserShield } from "react-icons/fa";

const TermsPage = () => {
  return (
    <div className=" min-h-screen text-white text-justify" dir="rtl">
      <div className="max-w-6xl mx-auto py-8 space-y-12">
        {/* Header */}
       

        {/* Section 1 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6 flex items-center">
            <FaGavel className="ml-3" />
            ۱. شرایط و قوانین کلی
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-justify">
              <strong>۱.</strong> فعالیت وبسایت ارزی پلاس بر اساس ماده ۱۰ قانون
              مدنی و با توجه به توافق میان طرفین (کاربر و مجموعه ارزی پلاس)
              انجام میشود. این فعالیت تابع کلیه قوانین و مقررات جمهوری اسلامی
              ایران است، بهویژه قانون تجارت الکترونیک مصوب سال ۱۳۸۲ و آیین نامه
              های مرتبط با جرایم رایانهای.
            </p>
            <p className="bg-[#4DBFF0] bg-opacity-20 p-4 rounded-lg text-justify">
              با ثبت نام، ساخت حساب کاربری یا استفاده از خدمات ارزی پلاس، کاربر
              کلیه مفاد این توافقنامه را پذیرفته و آن را لازمالاجرا میداند.
            </p>

            <p className="text-justify">
              <strong>۲.</strong> در صورتی که موردی در این توافقنامه ذکر نشده
              باشد، مطابق با قوانین رسمی کشور یا سیاست های عملیاتی و مصوبات
              داخلی ارزی پلاس اجرا خواهد شد. لازم به ذکر است که ارزی پلاس
              هیچگونه خدماتی در زمینه سایتهای غیراخلاقی، شرطبندی، خرید VPN یا
              فعالیتهای مغایر با قوانین جمهوری اسلامی ایران ارائه نمیدهد. تمامی
              پرداخت های ارزی تنها برای مصارف قانونی، تحصیلی، تجاری و خدمات
              آنلاین معتبر انجام میشود.
            </p>

            <p className="text-justify">
              <strong>۳.</strong> این توافقنامه میان برند ارزی پلاس
              (arziPlus.com) از یک سو و کاربر (شخص حقیقی یا حقوقی) از سوی دیگر
              منعقد شده و از لحظه تأیید آن در وبسایت، قابل استناد قانونی است.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6">
            ۲. شرایط و قوانین مالی
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-justify">
              <strong>۱.</strong> در صورت بروز خطا یا نقص فنی در وبسایت که منجر
              به سوءاستفاده کاربران شود، شخص خاطی موظف به جبران خسارت وارده به
              مجموعه خواهد بود.
            </p>

            <p className="bg-red-100 p-4 rounded-lg border-r-4 border-red-500 text-justify">
              <strong>۲.</strong> طبق قوانین مالیاتی، مبالغ واریزی به حسابهای
              تجاری ارزی پلاس مشمول مالیات ارزش افزوده هستند. بنابراین در صورتی
              که کاربر پس از افزایش موجودی، از آن برای خرید یا سفارش استفاده
              نکند، مبلغی معادل ۱.۵٪ از کل موجودی بابت مالیات و ارزش افزوده کسر
              خواهد شد.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6">
            ۳. اصطلاحات و تعاریف
          </h2>

          <div className="space-y-4 text-lg leading-relaxed">
            <div className="bg-[#4DBFF0] bg-opacity-10 p-4 rounded-lg text-justify">
              <strong className="text-[#0A1D37]">سایت ارزی پلاس:</strong>{" "}
              پلتفرمی به نشانی اینترنتی arziPlus.com که به عنوان رابط میان
              کاربران و خدمات پرداخت ارزی فعالیت میکند و تابع تمامی قوانین
              جمهوری اسلامی ایران است.
            </div>

            <div className="bg-[#4DBFF0] bg-opacity-10 p-4 rounded-lg text-justify">
              <strong className="text-[#0A1D37]">حساب کاربری:</strong> صفحه
              اختصاصی هر کاربر (حقیقی یا حقوقی) برای مدیریت سفارشها، پرداخت ها و
              تراکنش ها در چارچوب قوانین رسمی کشور.
            </div>

            <div className="bg-[#4DBFF0] bg-opacity-10 p-4 rounded-lg text-justify">
              <strong className="text-[#0A1D37]">اطلاعات هویتی:</strong> شامل
              نام، نام خانوادگی، کد ملی و سایر اطلاعاتی است که کاربر برای احراز
              هویت باید به صورت واقعی و صحیح وارد کند.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6">
            ۴. مقررات عمومی
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-justify">
              <strong>۱.</strong> مجموعه ارزی پلاس هیچگونه فعالیتی در زمینه خرید
              و فروش ارز فیزیکی، طلا یا داراییهای غیرالکترونیکی ندارد.
            </p>
            <p className="text-justify">
              <strong>۲.</strong> هر کاربر موظف است با اطلاعات واقعی و شخصی خود
              در سایت ثبت نام کند و از واگذاری حساب کاربری خود به دیگران خودداری
              نماید.
            </p>
            <p className="text-justify">
              <strong>۳.</strong> مسئولیت هرگونه سوءاستفاده یا کلاهبرداری ناشی
              از واگذاری حساب به اشخاص ثالث بر عهده خود کاربر است.
            </p>
            <p className="text-justify">
              <strong>۴.</strong> کاربران مجاز به استفاده از خدمات ارزی پلاس
              باید در بازه سنی ۱۸ تا ۵۸ سال باشند.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6">
            ۵. مقررات مربوط به ساخت و مدیریت حساب کاربری
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-justify">
              <strong>۱.</strong> ایجاد حساب کاربری در ارزی پلاس الزامی است و
              مراحل آن شامل وارد کردن شماره همراه، دریافت پیامک تأیید، انتخاب
              گذرواژه و ثبت اطلاعات هویتی میباشد.
            </p>
            <p className="text-justify">
              <strong>۲.</strong> کاربران موظف اند اطلاعات خود را دقیق و صحیح
              وارد کنند. در صورت ارائه اطلاعات نادرست یا جعلی، ارزی پلاس مجاز
              است حساب کاربر را بدون اخطار قبلی مسدود نماید.
            </p>
            <p className="text-justify">
              <strong>۳.</strong> مسئولیت حفظ امنیت رمز عبور و اطلاعات حساب بر
              عهده کاربر است.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6">
            ۶. ساخت حساب حقوقی در ارزی پلاس
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-justify">
              <strong>۱.</strong> اشخاص حقوقی برای افتتاح حساب باید درخواست رسمی
              در سربرگ شرکت خود ارسال کرده و مدارک لازم را بارگذاری کنند.
            </p>
            <p className="text-justify">
              <strong>۲.</strong> حساب شرکتی باید به نام نماینده رسمی شرکت ثبت
              شود و تراکنشها تنها از حساب بانکی همان نماینده یا شرکت انجام شود.
            </p>

            <div className="bg-[#4DBFF0] bg-opacity-20 p-6 rounded-lg">
              <h4 className="font-bold text-[#0A1D37] mb-4">۳. مدارک لازم:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>آگهی تأسیس شرکت</li>
                <li>آخرین تغییرات هیئتمدیره</li>
                <li>معرفینامه رسمی و اقرارنامه نماینده</li>
                <li>کارت ملی و کارت بانکی نماینده شرکت</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6 flex items-center">
            <FaUserShield className="ml-3" />
            ۷. قوانین احراز هویت کاربران
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-justify">
              طبق قانون تجارت الکترونیک، ارائه خدمات ارزی بدون احراز هویت مجاز
              نیست. ارزی پلاس موظف است برای امنیت کاربران و جلوگیری از جرایم
              مالی، اطلاعات زیر را از کاربران دریافت و تأیید کند:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#4DBFF0] bg-opacity-10 p-4 rounded-lg">
                • ایمیل معتبر
              </div>
              <div className="bg-[#4DBFF0] bg-opacity-10 p-4 rounded-lg">
                • شماره همراه به نام کاربر
              </div>
              <div className="bg-[#4DBFF0] bg-opacity-10 p-4 rounded-lg">
                • تصویر کارت ملی یا مدارک جایگزین
              </div>
              <div className="bg-[#4DBFF0] bg-opacity-10 p-4 rounded-lg">
                • کارت بانکی به نام کاربر
              </div>
              <div className="bg-[#4DBFF0] bg-opacity-10 p-4 rounded-lg col-span-2">
                • سلفی تأیید هویت همراه با متن و امضا
              </div>
            </div>

            <div className="bg-red-100 border-r-4 border-red-500 p-4 rounded-lg">
              <p className="flex items-center">
                <span className="text-2xl ml-2">📌</span>
                <strong>
                  هرگونه جعل یا دستکاری در مدارک هویتی جرم محسوب میشود و ارزی
                  پلاس حق دارد موضوع را از طریق مراجع قضایی پیگیری کند.
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6">
            ۸. استفاده از خدمات ارزی پلاس
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-justify">
              <strong>۱.</strong> خدمات ارزی پلاس شامل پرداخت هزینه آزمونهای
              بینل المللی افتتاح حساب بانکی خارجی، ثبت شرکت، خرید از سایتهای
              خارجی، و نقد درآمدهای بینل المللی است.
            </p>
            <p className="text-justify">
              <strong>۲.</strong> کاربران موظفاند از خدمات صرفاً در چارچوب
              قوانین جمهوری اسلامی ایران استفاده کنند.
            </p>
            <p className="text-justify">
              <strong>۳.</strong> به منظور حفظ امنیت تراکنشها، ممکن است برخی
              پرداخت ها یا برداشتها با تأخیر ۷۲ ساعته انجام شود.
            </p>
            <p className="text-justify">
              <strong>۴.</strong> ارزی پلاس مسئولیتی در قبال نوسانات نرخ ارز یا
              تغییر کارمزدها ندارد.
            </p>
            <p className="text-justify">
              <strong>۵.</strong> هرگونه خطا در وارد کردن اطلاعات حساب مقصد یا
              درخواست بازگشت وجه، پس از انجام تراکنش قابل پیگیری نخواهد بود.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="bg-[#FFFFFF] text-[#0A1D37] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-6 flex items-center">
            <FaShieldAlt className="ml-3" />
            ۹. حریم خصوصی کاربران
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-justify">
              <strong>۱.</strong> اطلاعات شخصی کاربران شامل ایمیل، شماره تماس،
              مدارک هویتی و اطلاعات بانکی نزد ارزی پلاس کاملاً محرمانه و محافظت
              شده است و تنها با دستور مقامات قضایی قابل ارائه به نهادهای ذیربط
              خواهد بود.
            </p>
            <p className="text-justify">
              <strong>۲.</strong> کاربران موظف اند رمز عبور خود را محرمانه
              نگهدارند. در صورت افشای اطلاعات ورود، ارزی پلاس مسئولیتی در قبال
              دسترسی غیرمجاز به حساب نخواهد داشت.
            </p>
            <p className="text-justify">
              <strong>۳.</strong> ارزی پلاس متعهد است امنیت دادهها و اطلاعات
              کاربران را با بالاترین سطح استاندارد حفظ نماید.
            </p>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-green-600 text-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-3xl ml-3">🟢</span>
            جمع بندی
          </h2>

          <div className="space-y-4 text-lg leading-relaxed">
            <p className="text-justify">
              با ثبت نام یا استفاده از خدمات ارزی پلاس، شما به عنوان کاربر،
              تمامی شرایط فوق را مطالعه و با آن موافقت میکنید.
            </p>
            <p className="text-justify">
              هدف ما در ارزی پلاس، ایجاد بستری شفاف، امن و سریع برای پرداخت های
              بین المللی است تا کاربران ایرانی بتوانند بدون دغدغه در سطح جهانی
              فعالیت کنند.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
