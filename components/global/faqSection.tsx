"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
 import { estedadBold } from "@/next-persian-fonts/estedad";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQButton {
  text: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  icon?: React.ReactNode;
  target?: "_blank" | "_self";
}

interface FAQSectionProps {
  heading: string;
  description?: string;
  svgIcon?: React.ReactNode;
  faqItems: FAQItem[];
  buttons?: FAQButton[];
  theme?: {
    backgroundColor?: string;
    headingColor?: string;
    descriptionColor?: string;
    questionColor?: string;
    answerColor?: string;
    iconColor?: string;
    borderColor?: string;
    activeColor?: string;
  };
  layout?: "default" | "centered" | "wide";
  showCategories?: boolean;
  searchable?: boolean;
  animate?: boolean;
  className?: string;
}

export default function FAQSection({
  heading,
  description,
  svgIcon,
  faqItems,
  buttons = [],
  theme = {},
  layout = "default",
  showCategories = false,
  searchable = false,
  animate = true,
  className = "",
}: FAQSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const faqListRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const {
    backgroundColor = "",
    headingColor = "text-[#FFFFFF]",
    descriptionColor = "text-[#A0A0A0]",
    questionColor = "text-[#FFFFFF]",
    answerColor = "text-[#A0A0A0]",
    iconColor = "text-[#FF7A00]",
    borderColor = "border-[#FF7A00]/20",
    activeColor = "text-[#FF7A00]",
  } = theme;

  // فیلتر کردن FAQ items
  const filteredItems = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // دریافت categories منحصر به فرد
  const categories = Array.from(
    new Set(faqItems.map((item) => item.category).filter(Boolean))
  );

  // تغییر وضعیت باز/بسته بودن آیتم
  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // Enhanced entrance animations
  useEffect(() => {
    if (!animate) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Header entrance with 3D rotation
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 60, rotationX: 45, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        }
      );

      // Text elements stagger animation
      const textElements = headerRef.current?.querySelectorAll(".animate-text");
      if (textElements) {
        tl.fromTo(
          textElements,
          { y: 40, opacity: 0, rotationY: 20 },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.6"
        );
      }

      // FAQ items with enhanced stagger
      const faqElements = faqListRef.current?.children;
      if (faqElements) {
        tl.fromTo(
          faqElements,
          { opacity: 0, y: 50, x: -30, scale: 0.9, rotationY: -15 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
      }

      // Buttons with bounce effect
      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current.children,
          { opacity: 0, y: 30, scale: 0.8, rotationZ: -10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationZ: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(2)",
          },
          "-=0.3"
        );
      }

      // Floating elements animation
      gsap.to(".floating-element", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-10, 10)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animate]);

  // انیمیشن باز/بسته شدن FAQ items
  useEffect(() => {
    openItems.forEach((id) => {
      const element = document.getElementById(`faq-answer-${id}`);
      if (element) {
        gsap.to(element, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    // بستن آیتم‌هایی که در openItems نیستند
    faqItems.forEach((item) => {
      if (!openItems.has(item.id)) {
        const element = document.getElementById(`faq-answer-${item.id}`);
        if (element) {
          gsap.to(element, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    });
  }, [openItems, faqItems]);


  const layoutClasses = {
    default: "max-w-7xl mx-auto px-4 md:px-8",
    centered: "max-w-4xl mx-auto px-4 md:px-8",
    wide: "max-w-full px-4 md:px-8",
  };

  return (
    <section
      ref={containerRef}
      className={`relative min-h-screen py-12 md:py-24 overflow-hidden ${className}`}
      dir="rtl"
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
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="floating-element absolute opacity-20"
            style={{
              left: `${10 + ((i * 8) % 80)}%`,
              top: `${15 + ((i * 7) % 70)}%`,
              width: `${8 + (i % 4) * 6}px`,
              height: `${8 + (i % 4) * 6}px`,
              background: `linear-gradient(45deg, 
                ${
                  i % 3 === 0 ? "#FF7A00" : i % 3 === 1 ? "#4DBFF0" : "#FFFFFF"
                }, 
                ${i % 3 === 0 ? "#FF7A00" : i % 3 === 1 ? "#4DBFF0" : "#FFFFFF"}
              )`,
              borderRadius: i % 2 === 0 ? "50%" : "6px",
              filter: "blur(1px)",
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div className="absolute top-20 right-16 w-24 h-24 border border-[#4DBFF0]/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 left-16 w-20 h-20 border-2 border-[#FF7A00]/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-[#FF7A00]/10 to-[#4DBFF0]/10 rounded-lg rotate-12 animate-bounce"></div>
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

      <div className={`relative z-10 ${layoutClasses[layout]}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Right Side - Header & Buttons */}
          <div ref={headerRef} className="lg:order-1">
            {/* Header with Glass Background */}
            <div className="relative text-center lg:text-right mb-8 p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl">
              {/* Subtle Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-5 rounded-3xl"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,122,0,0.15) 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* SVG Icon */}
              {svgIcon && (
                <div className="relative z-10 animate-text mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#4DBFF0]/20 ${iconColor} backdrop-blur-sm border border-[#FF7A00]/30 shadow-lg`}
                  >
                    {svgIcon}
                  </div>
                </div>
              )}

              <h2
                className={`animate-text text-2xl md:text-3xl lg:text-4xl ${estedadBold.className} ${headingColor} mb-6 relative z-10`}
                style={{
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #4DBFF0 50%, #FF7A00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
                }}
              >
                {heading}
              </h2>

              {description && (
                <p
                  className={`animate-text text-base md:text-lg ${descriptionColor} leading-relaxed relative z-10 max-w-2xl mx-auto lg:mx-0`}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Enhanced Search Box */}
            {searchable && (
              <div className="animate-text mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجو در سوالات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full placeholder:text-[#A0A0A0] text-[#FFFFFF] px-6 py-4 pr-14 bg-white/10 border border-[#FF7A00]/30 rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-[#FF7A00]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Categories */}
            {showCategories && categories.length > 0 && (
              <div className="animate-text mb-8">
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === "all"
                        ? `bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-[#FFFFFF] shadow-lg`
                        : `bg-white/10 text-[#A0A0A0] hover:bg-white/20 hover:text-[#FFFFFF] border border-white/20`
                    } backdrop-blur-sm`}
                  >
                    همه
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category!)}
                      className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category
                          ? `bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-[#FFFFFF] shadow-lg`
                          : `bg-white/10 text-[#A0A0A0] hover:bg-white/20 hover:text-[#0A1D37] border border-white/20`
                      } backdrop-blur-sm`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

       
          </div>
          {/* Left Side - Enhanced FAQ Items */}
          <div ref={faqListRef} className="lg:order-2">
            <div className="space-y-4 md:space-y-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl hover:border-[#FF7A00]/30 transition-all duration-500"
                  >
                    {/* Subtle Pattern Overlay */}
                    <div
                      className="absolute inset-0 opacity-5 rounded-2xl md:rounded-3xl"
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,122,0,0.15) 1px, transparent 0)`,
                        backgroundSize: "15px 15px",
                      }}
                    ></div>

                    {/* Question */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="relative z-10 w-full p-4 md:p-6 text-right flex items-center justify-between hover:bg-white/5 rounded-2xl md:rounded-3xl transition-all duration-300 group-hover:scale-[1.02]"
                    >
                      <div className="flex-1 text-right">
                        <h3
                          className={`text-sm md:text-base lg:text-lg font-bold leading-relaxed ${
                            openItems.has(item.id) ? activeColor : questionColor
                          } transition-colors duration-300`}
                        >
                          {item.question}
                        </h3>
                        {item.category && (
                          <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 text-[#FF7A00] text-xs font-medium rounded-full border border-[#FF7A00]/30">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Enhanced Toggle Icon */}
                      <div className="mr-4 flex-shrink-0">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 flex items-center justify-center border border-[#FF7A00]/30 transform transition-all duration-300 ${
                            openItems.has(item.id)
                              ? "rotate-180 bg-gradient-to-r from-[#FF7A00]/40 to-[#4DBFF0]/40"
                              : ""
                          } group-hover:scale-110`}
                        >
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5 text-[#FF7A00]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Enhanced Answer */}
                    <div
                      id={`faq-answer-${item.id}`}
                      className="overflow-hidden transition-all duration-500"
                      style={{
                        height: openItems.has(item.id) ? "auto" : 0,
                        opacity: openItems.has(item.id) ? 1 : 0,
                      }}
                    >
                      <div className="px-4 md:px-6 pb-4 md:pb-6">
                        <div
                          className={`text-sm md:text-base ${answerColor} leading-relaxed pt-4 border-t border-[#FF7A00]/20 relative`}
                        >
                          {/* Answer content with better spacing */}
                          <div className="space-y-3">{item.answer}</div>
                        </div>
                      </div>
                    </div>

                    {/* Glow Effect on Hover */}
                    <div className="absolute -inset-1 rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#FF7A00]/20 via-[#4DBFF0]/20 to-[#FF7A00]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 md:py-20">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#FF7A00]/20 to-[#4DBFF0]/20 backdrop-blur-sm border border-[#FF7A00]/30 mb-6">
                    <svg
                      className="w-10 h-10 md:w-12 md:h-12 text-[#FF7A00]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[#FFFFFF] text-xl md:text-2xl font-bold mb-3">
                    {searchTerm ? "نتیجه‌ای یافت نشد" : "سوالی موجود نیست"}
                  </h3>
                  <p className="text-[#A0A0A0] text-base md:text-lg mb-6 max-w-md mx-auto">
                    {searchTerm
                      ? "هیچ سوالی با این جستجو پیدا نشد. کلمات کلیدی دیگری را امتحان کنید"
                      : "در حال حاضر سوالی برای نمایش وجود ندارد"}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-[#FFFFFF] rounded-full font-medium hover:scale-105 transition-transform duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      پاک کردن جستجو
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Results Count */}
            {searchTerm && filteredItems.length > 0 && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 backdrop-blur-sm border border-[#FF7A00]/30">
                  <svg
                    className="w-4 h-4 text-[#FF7A00]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-[#FFFFFF]">
                    {filteredItems.length} سوال پیدا شد
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  document.head.appendChild(styleSheet);
}
