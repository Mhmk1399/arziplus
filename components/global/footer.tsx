"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaPhone,
  FaTelegram,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaArrowUp,
  FaHeart,
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
      // Brand section entrance animation
      if (consultationRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: consultationRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });

        // Brand icon and title
        tl.fromTo(
          consultationRef.current.querySelector(".inline-flex"),
          { scale: 0, opacity: 0, rotationY: 180 },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 1,
            ease: "back.out(1.7)",
          }
        );

        // Brand text stagger
        const textElements = consultationRef.current.querySelectorAll("h2, p");
        tl.fromTo(
          textElements,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
          "-=0.6"
        );

        // Contact buttons
        const contactElements =
          consultationRef.current.querySelectorAll("a, .flex");
        tl.fromTo(
          contactElements,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
      }

      // Main footer sections animation
      if (mainFooterRef.current) {
        const footerSections = mainFooterRef.current.children;
        gsap.fromTo(
          footerSections,
          { y: 60, opacity: 0, rotationX: 30 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mainFooterRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Social icons enhanced animation
      socialRefs.current.forEach((el, index) => {
        if (el) {
          gsap.fromTo(
            el,
            { scale: 0, rotation: -360, opacity: 0 },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
              },
            }
          );
        }
      });

      // Newsletter form animation
      if (newsletterRef.current) {
        const formElements =
          newsletterRef.current.querySelectorAll("input, button");
        gsap.fromTo(
          formElements,
          { y: 20, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: newsletterRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Floating elements animation
      gsap.to(".floating-element", {
        y: "random(-15, 15)",
        x: "random(-10, 10)",
        rotation: "random(-5, 5)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      // Back to top button setup
      if (backToTopRef.current) {
        gsap.set(backToTopRef.current, { scale: 0 });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (backToTopRef.current) {
      gsap.to(backToTopRef.current, {
        scale: showBackToTop ? 1 : 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    }
  }, [showBackToTop]);

  const socialLinks = [
    {
      icon: FaTelegram,
      href: "#",
      label: "تلگرام",
    },
    {
      icon: FaInstagram,
      href: "#",
      label: "اینستاگرام",
    },
    {
      icon: FaWhatsapp,
      href: "#",
      label: "واتساپ",
    },
    {
      icon: FaEnvelope,
      href: "mailto:info@exchange.com",
      label: "ایمیل",
    },
  ];

  const quickLinks = [
    { text: "خانه", href: "/" },
    { text: "خدمات", href: "/services" },
    { text: "درباره ما", href: "/about" },
    { text: "تماس", href: "/contact" },
  ];

  const services = [
    "افتتاح حساب پیپال",
    "شارژ حساب وایز",
    "خرید ارز دیجیتال",
    "پرداخت بین‌المللی",
    "نقد کردن درآمد ارزی",
    "خدمات وریفای",
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      gsap.to(newsletterRef.current, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} className="relative overflow-hidden" dir="rtl">
      {/* Luxury Dark Background */}
      <div
        className="relative"
        style={{
          background: `
            #0A1D37,
            radial-gradient(circle at 20% 80%, rgba(255, 122, 0, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(77, 191, 240, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 122, 0, 0.08) 0%, transparent 60%),
            linear-gradient(135deg, rgba(255, 122, 0, 0.05) 0%, rgba(77, 191, 240, 0.05) 100%)
          `,
        }}
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="floating-element absolute opacity-20"
              style={{
                left: `${15 + ((i * 12) % 70)}%`,
                top: `${20 + ((i * 8) % 60)}%`,
                width: `${6 + (i % 3) * 4}px`,
                height: `${6 + (i % 3) * 4}px`,
                background: `linear-gradient(45deg, 
                  ${
                    i % 3 === 0
                      ? "#FF7A00"
                      : i % 3 === 1
                      ? "#4DBFF0"
                      : "#FFFFFF"
                  }, 
                  ${
                    i % 3 === 0
                      ? "#FF7A00"
                      : i % 3 === 1
                      ? "#4DBFF0"
                      : "#FFFFFF"
                  }
                )`,
                borderRadius: i % 2 === 0 ? "50%" : "4px",
                filter: "blur(1px)",
                animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}

          {/* Geometric Shapes */}
          <div className="absolute top-20 right-20 w-24 h-24 border border-[#4DBFF0]/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-[#FF7A00]/20 rotate-45 animate-pulse"></div>
        </div>

        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

        {/* Main Footer Content */}
        <div className="relative z-10 py-8">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            {/* Top Section - Brand & Contact */}
            <div ref={consultationRef} className="text-center mb-16 md:mb-4">
              {/* Brand Section */}
              <div className="mb-2 gap-16 inline-flex">
                <h2
                  className={`text-3xl ${estedadBold.className} font-extrabold mb-6 p-2`}
                  style={{
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #4DBFF0 50%, #FF7A00 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ارزی پلاس
                </h2>
                <a
                  href="tel:+989123456789"
                  className="group inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-[#FFFFFF] font-bold text-lg transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-[#FF7A00]/25"
                >
                  <FaPhone className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                  <span>۰۹۱۲-۳۴۵-۶۷۸۹</span>
                </a>
              </div>
              {/* Contact Section */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-4">
                  {socialLinks.map((social, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        if (el) socialRefs.current[index] = el;
                      }}
                    >
                      <a
                        href={social.href}
                        className="group relative p-4 rounded-xl text-[#FF7A00] hover:bg-white/20 transition-all duration-300 hover:scale-110 backdrop-blur-sm "
                        title={social.label}
                      >
                        <social.icon className="text-xl" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section - Links & Newsletter */}
            <div
              ref={mainFooterRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-8"
            >
              {/* Quick Links */}
              <div ref={quickLinksRef} className="text-center md:text-right">
                <h4 className="text-[#FFFFFF] text-xl font-bold mb-8">
                  دسترسی سریع
                </h4>
                <div className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="block text-[#A0A0A0] hover:text-[#FF7A00] transition-colors duration-300 text-lg font-medium"
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="text-center">
                <h4 className="text-[#FFFFFF] text-xl font-bold mb-8">
                  خدمات ویژه
                </h4>
                <div className="space-y-4">
                  {services.slice(0, 4).map((service, index) => (
                    <div
                      key={index}
                      className="text-[#A0A0A0] text-lg font-medium"
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div ref={newsletterRef} className="text-center md:text-left">
                <h4 className="text-[#FFFFFF] text-xl font-bold mb-8">
                  خبرنامه
                </h4>
                <p className="text-[#A0A0A0] mb-6 text-lg">
                  از جدیدترین اخبار و تخفیف‌ها باخبر شوید
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ایمیل شما"
                      className="w-full px-6 py-4 bg-white/10 border border-[#FF7A00]/30 rounded-2xl text-[#FFFFFF] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#4DBFF0] backdrop-blur-sm transition-all duration-300"
                      required
                    />
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FF7A00]" />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribed}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-[#FFFFFF] font-bold text-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {subscribed ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaHeart className="text-[#FFFFFF]" />
                        عضو شدید!
                      </span>
                    ) : (
                      "عضویت"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center pt-8 border-t border-[#FF7A00]/20">
              <p className="text-[#A0A0A0] text-base">
                © ۱۴۰۴ ارزی پلاس. تمامی حقوق محفوظ است.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Back to Top Button */}
      <button
        ref={backToTopRef}
        onClick={scrollToTop}
        className="fixed bottom-8 left-8 p-4 rounded-full bg-gradient-to-r from-[#FF7A00]/90 to-[#4DBFF0]/90 text-[#FFFFFF] backdrop-blur-sm shadow-2xl hover:shadow-[#FF7A00]/25 transition-all duration-300 z-50 group hover:scale-110"
      >
        <FaArrowUp className="text-lg group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
}

// Add required CSS animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-8px) rotate(2deg); }
    66% { transform: translateY(-4px) rotate(-1deg); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
