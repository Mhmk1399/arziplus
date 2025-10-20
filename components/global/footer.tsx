"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaPhone,
  FaTelegram,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const pathname = usePathname();

  const footerRef = useRef<HTMLDivElement>(null);
  const consultationRef = useRef<HTMLDivElement>(null);
  const mainFooterRef = useRef<HTMLDivElement>(null);
  const socialRefs = useRef<HTMLDivElement[]>([]);
  const quickLinksRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);
  const decorativeRefs = useRef<HTMLDivElement[]>([]);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (backToTopRef.current) {
      gsap.to(backToTopRef.current, {
        scale: showBackToTop ? 1 : 0,
        rotation: showBackToTop ? 0 : 180,
        duration: 0.5,
        ease: "back.out(2)",
      });
    }
  }, [showBackToTop]);

  const socialLinks = [
    {
      icon: FaTelegram,
      href: "https://t.me/Arzi_Plus",
      label: "تلگرام",
      color: "#0088cc",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/arziplus.co?igsh=MXN2c21icHhpZXU3MA%3D%3D&utm_source=qr",
      label: "اینستاگرام",
      color: "#E4405F",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/message/BMUIYPPM3P3GI1",
      label: "واتساپ",
      color: "#25D366",
    },
    {
      icon: FaEnvelope,
      href: "mailto:info@arziplus.com",
      label: "ایمیل",
      color: "#0A1D37",
    },
  ];

  const quickLinks = [
    { text: "خانه", href: "/" },
    { text: "خدمات", href: "/services" },
    { text: "درباره ما", href: "/about" },
    { text: "تماس با ما", href: "/contact" },
  ];

  const services = [
    { text: "افتتاح حساب پی پال", href: "/Opening-a-PayPal-account" },
    {
      text: "افتتاح حساب وایز",
      href: "/opening-a-wise-account",
    },
    { text: "ثبت نام لاتاری", href: "/lottery" },
    { text: "خرید اکانت هوش مصنوعی", href: "/buy-chatgpt-plus" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);

      // Success animation
      gsap
        .timeline()
        .to(newsletterRef.current, {
          scale: 1.03,
          duration: 0.2,
          ease: "power2.out",
        })
        .to(newsletterRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1, 0.3)",
        });

      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer ref={footerRef} className="relative overflow-hidden" dir="rtl">
      {/* Luxury Background with Gradient */}
      <div className="relative bg-gradient-to-br from-[#0A1D37] via-[#0A1D37] to-[#0d2342]">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          {/* Decorative Circles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`circle-${i}`}
              ref={(el) => {
                if (el) decorativeRefs.current[i] = el;
              }}
              className="absolute rounded-full"
              style={{
                left: `${10 + ((i * 18) % 80)}%`,
                top: `${15 + ((i * 15) % 70)}%`,
                width: `${40 + (i % 3) * 30}px`,
                height: `${40 + (i % 3) * 30}px`,
                background:
                  i % 2 === 0
                    ? "radial-gradient(circle, rgba(255, 122, 0, 0.15), transparent)"
                    : "radial-gradient(circle, rgba(77, 191, 240, 0.15), transparent)",
                filter: "blur(20px)",
              }}
            />
          ))}

          {/* Geometric Lines */}
          <div className="absolute top-0 right-0 w-full h-full">
            {[...Array(3)].map((_, i) => (
              <div
                key={`line-${i}`}
                className="absolute h-px opacity-10"
                style={{
                  top: `${30 + i * 20}%`,
                  left: 0,
                  right: 0,
                  background: `linear-gradient(90deg, transparent, ${
                    i % 2 === 0 ? "#0A1D37" : "#4DBFF0"
                  }, transparent)`,
                }}
              />
            ))}
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 pulse-circle">
            <div className="w-full h-full border border-[#4DBFF0]/20 rounded-full" />
          </div>
          <div className="absolute bottom-0 left-0 w-32 h-32 pulse-circle">
            <div className="w-full h-full border-2 border-[#0A1D37]/20 rotate-45" />
          </div>
        </div>

        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-white/[0.05]" />

        {/* Main Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Section - Brand & CTA */}
            <div
              ref={consultationRef}
              className="pt-20 pb-16 text-center border-b border-white/5"
            >
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Brand Title */}
                <Link href="/">
                  {" "}
                  <div className="flex  mb-8 items-center justify-center cursor-pointer">
                    <Image
                      src="/assets/images/whitelogo.png"
                      width={80}
                      height={80}
                      alt="logo"
                      priority
                      className="transition-all duration-300"
                    />
                  </div>
                </Link>

                {/* Description */}
                <p className="text-[#A0A0A0] text-lg md:text-lg max-w-2xl mx-auto leading-relaxed">
                  ارزی پلاس پلتفرم تخصصی پرداخت‌های بین‌المللی برای کاربران
                  ایرانی است. از افتتاح حساب بانکی و پرداخت هزینه آزمون‌ها تا
                  ثبت شرکت در خارج، همه با امنیت و سرعت بالا در ارزی پلاس انجام
                  می‌شود.{" "}
                </p>

                {/* CTA Phone Button */}
                <a
                  href="tel:09991202049"
                  className="group inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold text-lg  transition-all duration-75 hover:scale-105 hover:-translate-y-1"
                >
                  <FaPhone className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                  <span className="tracking-wider">09991202049</span>
                </a>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4">
                  {socialLinks.map((social, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        if (el) socialRefs.current[index] = el;
                      }}
                    >
                      <a
                        href={social.href}
                        className="group relative p-4 rounded-xl   hover:border-[#0A1D37]/50 transition-all duration-300 hover:scale-110  "
                        title={social.label}
                      >
                        <social.icon className="text-2xl text-white/80 group-hover:text-[#0A1D37] transition-colors duration-300" />

                        {/* Tooltip */}
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0A1D37] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                          {social.label}
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Section - Main Content Grid */}
            <div ref={mainFooterRef} className="py-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                {/* Quick Links */}
                <div ref={quickLinksRef} className="footer-section space-y-8">
                  <div className="space-y-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full mb-4" />
                    <h4 className="text-white text-2xl font-bold">
                      دسترسی سریع
                    </h4>
                  </div>
                  <nav className="space-y-4">
                    {quickLinks.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        className="quick-link group flex items-end gap-3 text-[#A0A0A0] hover:text-white transition-colors duration-300 text-lg"
                      >
                        <span className="group-hover:tracking-wide transition-all duration-300">
                          {link.text}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Services */}
                <div className="footer-section space-y-8">
                  <div className="space-y-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] rounded-full mb-4" />
                    <h4 className="text-white text-2xl font-bold">
                      خدمات ویژه
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="group flex items-start gap-3 text-[#A0A0A0] hover:text-white transition-colors duration-300 text-lg cursor-pointer"
                      >
                        <Link href={service.href} className="leading-relaxed">
                          {service.text}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div ref={newsletterRef} className="footer-section space-y-8">
                  <div className="space-y-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full mb-4" />
                    <h4 className="text-white text-2xl font-bold">خبرنامه</h4>
                  </div>

                  <p className="text-[#A0A0A0] text-lg leading-relaxed">
                    از جدیدترین اخبار و پیشنهادات ویژه باخبر شوید
                  </p>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="form-element relative group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ایمیل شما"
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#4DBFF0] focus:bg-white/10 backdrop-blur-sm transition-all duration-300"
                        required
                        disabled={subscribed}
                      />
                      <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0A1D37]/50 group-focus-within:text-[#0A1D37] transition-colors duration-300" />
                    </div>

                    <button
                      type="submit"
                      disabled={subscribed}
                      className="form-element w-full py-4 rounded-2xl bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold text-lg    hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                    >
                      {subscribed ? (
                        <span className="flex items-center justify-center gap-3">
                          <FaHeart className="text-white animate-pulse" />
                          <span>با موفقیت عضو شدید!</span>
                        </span>
                      ) : (
                        "عضویت در خبرنامه"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Bottom Section - Copyright */}
            <div className="py-8 border-t border-white/5">
              <div className="copyright-text text-center space-y-4">
                <p className="text-[#A0A0A0] text-base md:text-lg">
                  ©{" "}
                  {new Date().toLocaleDateString("fa-IR", { year: "numeric" })}{" "}
                  ارزی پلاس. تمامی حقوق محفوظ است.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-12px) translateX(8px) rotate(3deg);
          }
          66% {
            transform: translateY(-6px) translateX(-8px) rotate(-2deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </footer>
  );
}
