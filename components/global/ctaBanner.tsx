"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { estedadBold } from "@/next-persian-fonts/estedad";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CTABannerProps {
  heading: string;
  description: string;
  button: {
    text: string;
    href: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    icon?: React.ReactNode;
    target?: "_blank" | "_self";
  };
  theme?: {
    backgroundColor?: string;
    backgroundGradient?: string;
    headingColor?: string;
    descriptionColor?: string;
    buttonBackground?: string;
    buttonText?: string;
    buttonHover?: string;
    borderColor?: string;
  };
  height?: number;
  rounded?: boolean;
  shadow?: boolean;
  animate?: boolean;
  className?: string;
}

export default function CTABanner({
  heading,
  description,
  button,
  theme = {},
  // height = 300,
  rounded = true,
  // shadow = true,
  animate = true,
  className = "",
}: CTABannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Enhanced GSAP animations
  useEffect(() => {
    if (!animate || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "bottom 10%",
          toggleActions: "play none none reverse",
        },
      });

      // Container entrance with scale and rotation
      tl.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0, rotationY: -10 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 1, ease: "power3.out" }
      );

      // Text content stagger animation
      if (textRef.current) {
        const textElements = textRef.current.querySelectorAll(".animate-text");
        tl.fromTo(
          textElements,
          { y: 40, opacity: 0, rotationX: 30 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.6"
        );
      }

      // Button entrance with bounce
      if (buttonRef.current) {
        tl.fromTo(
          buttonRef.current,
          { scale: 0.8, opacity: 0, rotationZ: -10 },
          {
            scale: 1,
            opacity: 1,
            rotationZ: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
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
    }, containerRef);

    return () => ctx.revert();
  }, [animate]);

  const {
    // backgroundColor = "",
    // backgroundGradient,
    descriptionColor = "text-[#A0A0A0]",
    // borderColor = "border-[#FF7A00]/20",
  } = theme;

  // Enhanced luxury button classes
  const getButtonClasses = () => {
    const baseClasses =
      "group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-500 shadow-2xl hover:shadow-xl transform hover:scale-105 overflow-hidden backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50";

    switch (button.variant) {
      case "primary":
        return `${baseClasses} bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-[#FFFFFF] hover:from-[#FF7A00]/80 hover:to-[#4DBFF0]/80 hover:shadow-[#FF7A00]/50`;
      case "secondary":
        return `${baseClasses} bg-[#0A1D37] text-[#FFFFFF] hover:bg-[#0A1D37]/80 hover:shadow-[#0A1D37]/50`;
      case "outline":
        return `${baseClasses} border-2 border-[#4DBFF0] text-[#4DBFF0] hover:bg-[#4DBFF0] hover:text-[#FFFFFF] bg-white/5`;
      case "ghost":
        return `${baseClasses} text-[#4DBFF0] hover:bg-[#4DBFF0]/20 bg-white/5`;
      default:
        return `${baseClasses} bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-[#FFFFFF] hover:from-[#FF7A00]/80 hover:to-[#4DBFF0]/80`;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative
        min-h-[100px] md:min-h-[200px]
        overflow-hidden 
        py-8 md:py-12
        ${rounded ? "rounded-3xl md:rounded-[2rem]" : ""}
        transition-all duration-500
        ${className}

      `}
      dir="rtl"
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none ]">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-element absolute opacity-30"
            style={{
              left: `${15 + ((i * 12) % 70)}%`,
              top: `${20 + ((i * 8) % 60)}%`,
              width: `${8 + (i % 3) * 6}px`,
              height: `${8 + (i % 3) * 6}px`,
              background: `linear-gradient(45deg, 
                ${
                  i % 3 === 0 ? "#FF7A00" : i % 3 === 1 ? "#4DBFF0" : "#FFFFFF"
                }, 
                ${i % 3 === 0 ? "#FF7A00" : i % 3 === 1 ? "#4DBFF0" : "#FFFFFF"}
              )`,
              borderRadius: i % 2 === 0 ? "50%" : "4px",
              filter: "blur(1px)",
            }}
          />
        ))}

        {/* Geometric Accents */}
        <div className="absolute top-6 right-8 w-16 h-16 border border-[#4DBFF0]/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-6 left-8 w-12 h-12 border-2 border-[#FF7A00]/30 rotate-45 animate-pulse"></div>
      </div>
      <div className="relative z-10 h-full bg-[#0A1D37] mx-4 md:mx-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8">
        {/* Subtle Pattern Overlay */}
        <div
          className="absolute inset-0  opacity-5 rounded-2xl md:rounded-3xl"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,122,0,0.2) 1px, transparent 0)`,
            backgroundSize: "25px 25px",
          }}
        ></div>

        {/* Enhanced Content Container */}
        <div className="relative z-10 h-full  flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12">
          {/* Enhanced Text Content */}
          <div
            ref={textRef}
            className="flex flex-col text-center lg:text-right flex-1 max-w-2xl"
          >
            <h3
              className={`animate-text text-xl md:text-2xl lg:text-3xl  mb-4 lg:mb-6 ${estedadBold.className} font-extrabold leading-tight`}
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
            </h3>
            <p
              className={`animate-text text-sm lg:text-lg ${descriptionColor} leading-relaxed opacity-90 line-clamp-2`}
            >
              {description}
            </p>
          </div>

          {/* Enhanced Button */}
          <div className="flex justify-center lg:justify-end">
            <Link
              ref={buttonRef}
              href={button.href}
              target={button.target || "_self"}
              className={getButtonClasses()}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="relative z-10 flex items-center gap-3">
                <span className="font-bold">{button.text}</span>
                {button.icon && (
                  <span className="text-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {button.icon}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>
      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-white/5 backdrop-blur-[1px]"></div>

      {/* Main Glass Container */}
    </div>
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
