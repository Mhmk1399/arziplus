"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothTimelineProps {
  title?: string;
  subtitle?: string;
  steps?: TimelineStep[];
  className?: string;
  compact?: boolean; // For smaller displays
}
interface TimelineStep {
  id: number;
  title: string;
  desc: string;
}

export default function SmoothTimeline({
  title,
  subtitle,
  steps,
  className = "",
  compact = false,
}: SmoothTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !progressLineRef.current) return;

    // خط وسط که با اسکرول پر می‌شود - سریع‌تر
    gsap.fromTo(
      progressLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%", // شروع زودتر
          end: "bottom 25%", // پایان زودتر
          scrub: 0.2, // کاهش از 0.5 به 0.2 برای سرعت بیشتر
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // اضافه کردن افکت glow بر اساس پیشرفت - سریع‌تر
            const progress = self.progress;
            gsap.to(progressLineRef.current, {
              boxShadow: `0 0 ${20 * progress}px rgba(255, 122, 0, ${
                0.6 * progress
              })`,
              duration: 0.05, // کاهش از 0.1 به 0.05
            });
          },
        },
      }
    );

    // انیمیشن اضافی برای خط پیشرفت
    gsap.set(progressLineRef.current, {
      filter: "blur(0px)",
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        // تغییر رنگ خط بر اساس پیشرفت
        gsap.to(progressLineRef.current, {
          background: `linear-gradient(to bottom, 
            rgba(255, 122, 0, ${0.8 + 0.2 * progress}), 
            rgba(77, 191, 240, ${0.8 + 0.2 * progress}), 
            rgba(10, 29, 55, ${0.8 + 0.2 * progress}))`,
          duration: 0.1,
        });
      },
    });

    // انیمیشن ایستگاه‌ها با scroll position دقیق
    stepsRef.current.forEach((stepEl, index) => {
      if (!stepEl) return;

      // حالت اولیه
      gsap.set(stepEl, {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotationX: 45,
      });

      // انیمیشن مرحله‌ای بر اساس موقعیت دقیق اسکرول - سریع‌تر
      gsap.to(stepEl, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.1, // کاهش از 1 به 0.5
        ease: "power2.out",
        scrollTrigger: {
          trigger: stepEl,
          start: "top 85%", // شروع زودتر
          end: "top 40%", // پایان زودتر
          scrub: 0.3, // کاهش از 1 به 0.3 برای سرعت بیشتر
          toggleActions: "play none none reverse",
          onEnter: () => {
            // افکت اضافی هنگام ورود - سریع‌تر
            gsap.to(stepEl.querySelector(".station-circle"), {
              scale: 1.15,
              duration: 0.15, // کاهش از 0.3 به 0.15
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
            });
          },
          onLeave: () => {
            // کم کردن opacity هنگام خروج از بالا - سریع‌تر
            gsap.to(stepEl, {
              opacity: 0.3,
              scale: 0.9,
              duration: 0.15, // کاهش از 0.3 به 0.15
            });
          },
          onEnterBack: () => {
            // بازگشت به حالت عادی - سریع‌تر
            gsap.to(stepEl, {
              opacity: 1,
              scale: 1,
              duration: 0.15, // کاهش از 0.3 به 0.15
            });
          },
          onLeaveBack: () => {
            // مخفی کردن هنگام اسکرول به عقب - سریع‌تر
            gsap.to(stepEl, {
              opacity: 0,
              y: 100,
              scale: 0.8,
              rotationX: 45,
              duration: 0.25, // کاهش از 0.5 به 0.25
            });
          },
        },
      });

      // انیمیشن جداگانه برای متن داخل هر step - سریع‌تر
      const textContent = stepEl.querySelector(".step-content");
      if (textContent) {
        gsap.set(textContent, { opacity: 0, x: index % 2 === 0 ? 30 : -30 }); // کاهش مسافت حرکت

        gsap.to(textContent, {
          opacity: 1,
          x: 0,
          duration: 0.1, // کاهش از 0.8 به 0.4
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepEl,
            start: "top 75%", // شروع زودتر
            end: "top 45%", // پایان زودتر
            scrub: 0.2, // کاهش از 0.5 به 0.2
          },
        });
      }
    });

    // Scroll progress indicator
    const scrollProgress = document.querySelector(".scroll-progress");
    const progressText = document.querySelector(".progress-text");

    if (scrollProgress && progressText) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = Math.round(self.progress * 100);
          gsap.to(scrollProgress, {
            scaleY: self.progress,
            duration: 0.1,
          });
          progressText.textContent = progress.toString();
        },
      });
    }

    // Add scroll-based parallax for floating elements
    gsap.to(".floating-particle", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative ${
        compact ? "min-h-[60vh] py-16" : "min-h-screen py-32"
      } flex items-center justify-center overflow-hidden px-2 ${className}`}
      dir="rtl"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(10, 29, 55, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 122, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(77, 191, 240, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(10, 29, 55, 0.02) 100%)
        `,
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating Particles - Responsive */}
        {[...Array(compact ? 6 : 12)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute rounded-full opacity-20"
            style={{
              left: `${10 + ((i * 8) % 80)}%`,
              top: `${15 + ((i * 7) % 70)}%`,
              width: `${compact ? 4 + (i % 3) * 2 : 8 + (i % 4) * 4}px`,
              height: `${compact ? 4 + (i % 3) * 2 : 8 + (i % 4) * 4}px`,
              background: `linear-gradient(45deg, 
                ${
                  i % 3 === 0 ? "#0A1D37" : i % 3 === 1 ? "#4DBFF0" : "#0A1D37"
                }, 
                ${i % 3 === 0 ? "#0A1D37" : i % 3 === 1 ? "#4DBFF0" : "#0A1D37"}
              )`,
              filter: "blur(1px)",
            }}
          />
        ))}

        {/* Geometric Shapes - Responsive */}
        <div
          className={`absolute top-20 right-20 ${
            compact ? "w-16 h-16" : "w-32 h-32"
          } border border-[#4DBFF0]/20 rounded-full animate-spin-slow`}
        ></div>
        <div
          className={`absolute bottom-32 left-16 ${
            compact ? "w-12 h-12" : "w-24 h-24"
          } border-2 border-[#0A1D37]/20 rotate-45 animate-pulse`}
        ></div>
        {!compact && (
          <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-lg rotate-12 animate-float"></div>
        )}
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

      <div
        className={`relative z-10 w-full ${
          compact ? "max-w-2xl" : "max-w-4xl"
        } mx-auto`}
      >
        {/* Scroll Progress Indicator - Hide on compact mode */}
        {!compact && (
          <div className="fixed top-1/2 left-8 transform -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
            <div className="w-1 h-32 bg-white/20 rounded-full overflow-hidden">
              <div
                className="scroll-progress w-full bg-gradient-to-t from-[#0A1D37] via-[#4DBFF0] to-[#0A1D37] rounded-full origin-bottom"
                style={{ transform: "scaleY(0)" }}
              ></div>
            </div>
            <div className="text-xs text-[#A0A0A0]"></div>
          </div>
        )}

        {/* هدینگ */}
        <div
          className={`text-center ${compact ? "mb-8 md:mb-12" : "mb-24"} px-4`}
        >
          <h2
            className={`${
              compact ? "text-lg md:text-2xl" : "text-xl md:text-3xl"
            } font-extrabold mb-6 text-[#0A1D37]`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`text-[#0A1D37] max-w-2xl mx-auto ${
                compact ? "text-xs md:text-sm" : "text-sm md:text-base"
              } leading-relaxed opacity-90`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* تایم‌لاین */}
        <div
          className={`${compact ? "max-w-3xl" : "max-w-5xl"} mx-auto relative ${
            compact ? "px-3 md:px-6" : "px-6"
          }`}
        >
          {/* خط خاکستری - Hidden on small screens */}
          <div
            className={`absolute top-0 left-1/2 ${
              compact ? "w-[2px]" : "w-[3px]"
            } h-full bg-white/20 backdrop-blur-sm -translate-x-1/2 ${
              compact ? "hidden md:block" : "hidden sm:block"
            }`}
          />

          {/* خط پررنگ - Hidden on small screens */}
          <div
            ref={progressLineRef}
            className={`absolute top-0 left-1/2 ${
              compact ? "w-[2px]" : "w-[3px]"
            } h-full bg-gradient-to-b from-[#0A1D37] via-[#4DBFF0] to-[#0A1D37] -translate-x-1/2 ${
              compact ? "hidden md:block" : "hidden sm:block"
            }`}
            style={{ transform: "scaleY(0)", transformOrigin: "top center" }}
          />

          {/* ایستگاه‌ها */}
          <div
            className={`relative flex flex-col ${
              compact ? "gap-8 md:gap-16" : "gap-24 md:gap-12"
            }`}
          >
            {steps?.map((step, i) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepsRef.current[i] = el;
                }}
                className={`flex items-start ${
                  compact ? "gap-4 md:gap-6" : "gap-6 md:gap-8"
                } ${
                  compact
                    ? "flex-row-reverse text-right"
                    : i % 2 === 0
                    ? "flex-row-reverse text-right"
                    : "text-left"
                }`}
              >
                {/* شماره مرحله با glass effect و انیمیشن */}
                <div
                  className={`station-circle ${
                    compact ? "w-8 h-8 mt-1" : "w-10 h-10 mt-2"
                  } rounded-full bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border-2 border-white/50 shadow-2xl relative overflow-hidden flex-shrink-0 flex items-center justify-center`}
                >
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#0A1D37] to-[#4DBFF0] shadow-inner`}
                  ></div>
                  {/* شماره مرحله */}
                  <span
                    className={`relative z-10 font-bold text-[#FFFFFF] ${
                      compact ? "text-xs" : "text-sm"
                    } drop-shadow-sm`}
                  >
                    {i + 1}
                  </span>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0A1D37]/30 to-[#4DBFF0]/30 animate-ping"></div>
                  {/* Glow effect */}
                  <div
                    className={`absolute ${
                      compact ? "-inset-1" : "-inset-2"
                    } rounded-full bg-gradient-to-br from-[#0A1D37]/20 to-[#4DBFF0]/20 blur-md -z-10`}
                  ></div>
                </div>

                {/* متن با glass container و کلاس برای انیمیشن */}
                <div
                  className={`step-content ${
                    compact ? "max-w-xs" : "max-w-md"
                  } text-right ${
                    compact ? "p-4 md:p-6" : "p-6 md:p-8"
                  } rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 relative overflow-hidden`}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000"></div>

                  <h3
                    className={`${
                      compact ? "text-sm md:text-lg" : "text-lg md:text-lg"
                    } font-bold ${
                      compact ? "mb-2" : "mb-3"
                    } text-[#0A1D37] relative z-10`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-[#A0A0A0] ${
                      compact ? "text-xs md:text-sm" : "text-sm md:text-base"
                    } leading-relaxed opacity-90 relative z-10`}
                  >
                    {step.desc}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${
                      compact ? "h-0.5" : "h-1"
                    } bg-gradient-to-r from-[#0A1D37]/50 via-[#4DBFF0]/50 to-[#0A1D37]/50 scale-x-0 hover:scale-x-100 transition-transform duration-500 origin-right`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .floating-particle {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
