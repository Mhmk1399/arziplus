import type { Metadata } from "next";
import "./globals.css";
import { estedad } from "@/next-persian-fonts/estedad/index";
import Footer from "@/components/global/footer";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import NewNavbar from "@/components/global/navbar";
import SchemaProvider from "@/components/global/SchemaProvider";

export const metadata: Metadata = {
  title: "ارزی پلاس؛ سرویس کامل پرداخت‌های بین‌المللی",
  description:
    "ارزی پلاس؛ سرویس کامل پرداخت‌های بین‌المللی، افتتاح حساب بانکی خارجی، پرداخت آزمون‌ها و ثبت شرکت در کشورهای معتبر برای کاربران ایرانی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body
        className={` ${estedad.className} antialiased relative`}
        style={{
          background: `
          radial-gradient(circle at 20% 80%, rgba(10, 29, 55, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 122, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(77, 191, 240, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(10, 29, 55, 0.02) 100%)
        `,
        }}
      >
        <SchemaProvider>
          <Toaster position="top-center" />
          <NewNavbar />
          {children}
        </SchemaProvider>
        <div className="fixed bottom-2 right-2 flex flex-col gap-1 z-50">
          {/* Telegram Button */}
          <Link
            href="https://t.me/YOUR_TELEGRAM_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/40 to-blue-600/40 hover:from-blue-500 hover:to-blue-800 backdrop-blur-sm text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
          >
            <FaTelegramPlane className="text-2xl" />
          </Link>

          {/* WhatsApp Button */}
          <Link
            href="https://wa.me/YOUR_NUMBER" // شماره رو با فرمت بین‌المللی بزن مثل 989123456789+
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400/40 to-green-600/40 hover:from-green-500 hover:to-green-800 backdrop-blur-sm text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
          >
            <FaWhatsapp className="text-2xl" />
          </Link>
        </div>
        <Footer />
      </body>
    </html>
  );
}
