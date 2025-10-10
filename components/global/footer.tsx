"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaPhone,
  FaTelegram,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
   FaHeart,
  FaCheckCircle,
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { estedadBold } from "@/next-persian-fonts/estedad";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
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
    const ctx = gsap.context(() => {
      // Brand section entrance animation with stagger
      if (consultationRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: consultationRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });

        // Brand title with split animation
        tl.fromTo(
          consultationRef.current.querySelector("h2"),
          { y: -50, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          }
        );

        // Description text
        tl.fromTo(
          consultationRef.current.querySelector("p"),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.8"
        );

        // Phone button with bounce
        tl.fromTo(
          consultationRef.current.querySelector("a"),
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "back.out(2)",
          },
          "-=0.4"
        );
      }

      // Social icons with wave effect
      if (socialRefs.current.length > 0) {
        gsap.fromTo(
          socialRefs.current,
          { y: 50, opacity: 0, scale: 0, rotation: 180 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: socialRefs.current[0],
              start: "top 90%",
            },
          }
        );
      }

      // Main footer sections with 3D effect
      if (mainFooterRef.current) {
        const sections =
          mainFooterRef.current.querySelectorAll(".footer-section");
        gsap.fromTo(
          sections,
          {
            y: 80,
            opacity: 0,
            rotationX: 45,
            transformPerspective: 1000,
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.25,
            ease: "power4.out",
            scrollTrigger: {
              trigger: mainFooterRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Newsletter form elements animation
      if (newsletterRef.current) {
        const formElements =
          newsletterRef.current.querySelectorAll(".form-element");
        gsap.fromTo(
          formElements,
          { x: -40, opacity: 0, scale: 0.9 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: newsletterRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Decorative elements floating animation
      decorativeRefs.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            y: "random(-20, 20)",
            x: "random(-15, 15)",
            rotation: "random(-10, 10)",
            duration: "random(4, 8)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2,
          });
        }
      });

      // Quick links hover animation setup
      const quickLinks = document.querySelectorAll(".quick-link");
      quickLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            x: 10,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            x: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Pulse animation for decorative circles
      gsap.to(".pulse-circle", {
        scale: 1.2,
        opacity: 0.5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });

      // Copyright fade in
      gsap.fromTo(
        ".copyright-text",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ".copyright-text",
            start: "top 95%",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
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
    { icon: FaTelegram, href: "#", label: "تلگرام", color: "#0088cc" },
    { icon: FaInstagram, href: "#", label: "اینستاگرام", color: "#E4405F" },
    { icon: FaWhatsapp, href: "#", label: "واتساپ", color: "#25D366" },
    {
      icon: FaEnvelope,
      href: "mailto:info@exchange.com",
      label: "ایمیل",
      color: "#FF7A00",
    },
  ];

  const quickLinks = [
    { text: "خانه", href: "/" },
    { text: "خدمات", href: "/services" },
    { text: "درباره ما", href: "/about" },
    { text: "تماس با ما", href: "/contact" },
  ];

  const services = [
    "افتتاح حساب پیپال",
    "شارژ حساب وایز",
    "خرید ارز دیجیتال",
    "پرداخت بین‌المللی",
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
                    i % 2 === 0 ? "#FF7A00" : "#4DBFF0"
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
            <div className="w-full h-full border-2 border-[#FF7A00]/20 rotate-45" />
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
                <h2
                  className={`text-4xl md:text-5xl lg:text-5xl py-3 ${estedadBold.className} font-black tracking-tight`}
                  style={{
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #4DBFF0 50%, #FF7A00 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px rgba(77, 191, 240, 0.3))",
                  }}
                >
                  ارزی پلاس
                </h2>

                {/* Description */}
                <p className="text-[#A0A0A0] text-lg md:text-lg max-w-2xl mx-auto leading-relaxed">
                  راهکار امن و سریع برای تراکنش‌های مالی بین‌المللی
                </p>

                {/* CTA Phone Button */}
                <a
                  href="tel:+989123456789"
                  className="group inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white font-bold text-lg shadow-[0_10px_40px_rgba(255,122,0,0.3)] hover:shadow-[0_15px_50px_rgba(255,122,0,0.4)] transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                >
                  <FaPhone className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                  <span className="tracking-wider">۰۹۱۲-۳۴۵-۶۷۸۹</span>
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
                        className="group relative p-4 rounded-xl   hover:border-[#FF7A00]/50 transition-all duration-300 hover:scale-110  "
                        title={social.label}
                      >
                        <social.icon className="text-2xl text-white/80 group-hover:text-[#FF7A00] transition-colors duration-300" />

                        {/* Tooltip */}
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FF7A00] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
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
                    <div className="w-12 h-1 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full mb-4" />
                    <h4 className="text-white text-2xl font-bold">
                      دسترسی سریع
                    </h4>
                  </div>
                  <nav className="space-y-4">
                    {quickLinks.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        className="quick-link group flex items-center gap-3 text-[#A0A0A0] hover:text-white transition-colors duration-300 text-lg"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#FF7A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    <div className="w-12 h-1 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] rounded-full mb-4" />
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
                        <FaCheckCircle className="text-[#4DBFF0] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        <span className="leading-relaxed">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div ref={newsletterRef} className="footer-section space-y-8">
                  <div className="space-y-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full mb-4" />
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
                      <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF7A00]/50 group-focus-within:text-[#FF7A00] transition-colors duration-300" />
                    </div>

                    <button
                      type="submit"
                      disabled={subscribed}
                      className="form-element w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white font-bold text-lg shadow-[0_8px_30px_rgba(255,122,0,0.25)] hover:shadow-[0_12px_40px_rgba(255,122,0,0.35)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
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
                  © ۱۴۰۴ ارزی پلاس. تمامی حقوق محفوظ است.
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
