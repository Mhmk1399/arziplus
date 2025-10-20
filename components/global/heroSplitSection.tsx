"use client";
import { estedadBold } from "@/next-persian-fonts/estedad";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ThemeConfig {
  background: string;
  textBoxBg: string;
  subHeading: string;
  heading: string;
  description: string;
  button: string;
}

interface HeroButton {
  text: string;
  href: string;
  variant: "primary" | "secondary" | "outline" | "green" | "red" | "purple";
  icon?: React.ReactNode;
  colors?: {
    bg: string;
    hover: string;
    text: string;
    hoverText?: string;
  };
}

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  style?: {
    bg?: string; // background color classes
    text?: string; // text color classes
    border?: string; // border color classes
    iconColor?: string; // icon color classes
    shadow?: string; // shadow styles
    rounded?: string; // rounded styles
  };
}

interface Props {
  heading: string;
  subHeading?: string;
  buttons?: HeroButton[];
  description: string;
  imageSrc: string;
  imageAlt?: string;
  theme: ThemeConfig;
  layout?: "image-left" | "image-right";
  imageWidth?: "1/3" | "1/2" | "2/3";
  features?: FeatureItem[];
}

export default function HeroSplitSection({
  heading,
  subHeading,
  description,
  buttons,
  imageSrc,
  imageAlt = "hero image",
  // theme,
  layout = "image-left",
  imageWidth = "1/2",
  features = [],
}: Props) {
  const imageClass = `md:w-${imageWidth} w-full`;
  const textClass =
    imageWidth === "1/3"
      ? "md:w-2/3"
      : imageWidth === "2/3"
      ? "md:w-1/3"
      : "md:w-1/2";

  const containerFlex =
    layout === "image-right" ? "md:flex-row-reverse" : "md:flex-row";

  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Image entrance animation
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          {
            scale: 0.8,
            opacity: 0,
            rotationY: layout === "image-right" ? -15 : 15,
          },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 1.2,
            ease: "power3.out",
          }
        );
      }

      // Text content stagger animation
      if (textRef.current) {
        const textElements = textRef.current.querySelectorAll(".animate-text");
        tl.fromTo(
          textElements,
          { y: 60, opacity: 0, rotationX: 45 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.6"
        );
      }

      // Floating particles animation
      gsap.to(".floating-element", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-5, 5)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [layout]);

  const getButtonClasses = (button: HeroButton) => {
    const baseClasses =
      "group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-500 shadow-2xl hover:shadow-xl transform hover:scale-105 overflow-hidden backdrop-blur-sm border border-white/20";

    if (button.colors) {
      return `${baseClasses} ${button.colors.bg} ${button.colors.text} hover:${
        button.colors.hover
      } ${button.colors.hoverText || ""}`;
    }

    switch (button.variant) {
      case "primary":
        return `${baseClasses} bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] hover:from-[#0A1D37]/80 hover:to-[#4DBFF0]/80 hover:shadow-[#0A1D37]/50`;
      case "purple":
        return `${baseClasses} bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-[#FFFFFF] hover:from-[#4DBFF0]/80 hover:to-[#0A1D37]/80 hover:shadow-[#4DBFF0]/50`;
      case "red":
        return `${baseClasses} bg-[#0A1D37] text-[#FFFFFF] hover:bg-[#0A1D37]/80 hover:shadow-[#0A1D37]/50`;
      case "secondary":
        return `${baseClasses} bg-[#0A1D37] text-[#FFFFFF] hover:bg-[#0A1D37]/80 hover:shadow-[#0A1D37]/50`;
      case "green":
        return `${baseClasses} bg-[#4DBFF0] text-[#FFFFFF] hover:bg-[#4DBFF0]/80 hover:shadow-[#4DBFF0]/50`;
      case "outline":
        return `${baseClasses} border-2 border-[#4DBFF0] text-[#4DBFF0] hover:bg-[#4DBFF0] hover:text-[#FFFFFF] bg-white/5`;
      default:
        return `${baseClasses} bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] hover:from-[#0A1D37]/80 hover:to-[#4DBFF0]/80`;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-16 md:py-24 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(10, 29, 55, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 122, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(77, 191, 240, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(10, 29, 55, 0.02) 100%)
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
              left: `${10 + ((i * 12) % 80)}%`,
              top: `${15 + ((i * 8) % 70)}%`,
              width: `${12 + (i % 3) * 8}px`,
              height: `${12 + (i % 3) * 8}px`,
              background: `linear-gradient(45deg, 
                ${
                  i % 3 === 0 ? "#0A1D37" : i % 3 === 1 ? "#4DBFF0" : "#0A1D37"
                }, 
                ${i % 3 === 0 ? "#0A1D37" : i % 3 === 1 ? "#4DBFF0" : "#0A1D37"}
              )`,
              borderRadius: i % 2 === 0 ? "50%" : "8px",
              filter: "blur(1px)",
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-[#4DBFF0]/10 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-[#0A1D37]/10 rotate-45 animate-pulse"></div>
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-[1px]"></div>

      <div
        className={`relative z-10 w-full max-w-7xl mx-auto flex flex-col ${containerFlex} items-center gap-8 md:gap-16`}
      >
        {/* IMAGE SECTION */}
        <div
          ref={imageRef}
          className={`relative ${imageClass} h-80 md:h-[70vh] group`}
        >
          {/* Image Container with Glass Effect */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>

            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-105"
            />

            {/* Glow Effect */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#0A1D37]/20 via-[#4DBFF0]/20 to-[#0A1D37]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>

          {/* Floating Accent Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#0A1D37] to-[#4DBFF0] rounded-full opacity-80 animate-pulse shadow-lg"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[#4DBFF0] to-[#0A1D37] rounded-full opacity-60 animate-bounce shadow-lg"></div>
        </div>

        {/* TEXT SECTION */}
        <div
          ref={textRef}
          dir="rtl"
          className={`relative ${textClass} flex flex-col justify-center items-center md:items-start gap-6 md:gap-8`}
        >
          {/* Luxury Glass Background */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl  -z-10">
            {/* Subtle Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,122,0,0.15) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          {/* Content with Animations */}
          {subHeading && (
            <div className="animate-text">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-[#0A1D37]/20 to-[#4DBFF0]/20 text-[#0A1D37] border border-[#0A1D37]/30 backdrop-blur-sm p ">
                <div className="w-2 h-2 ml-2 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full  animate-pulse"></div>
                {subHeading}
              </span>
            </div>
          )}

          <h2
            className={`animate-text text-2xl md:text-4xl lg:text-5xl ${estedadBold.className} text-center md:text-right font-extrabold leading-tight`}
            style={{
              background:
                "linear-gradient(135deg, #0A1D37 0%, #4DBFF0 50%, #0A1D37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 4px 20px rgba(10, 29, 55, 0.1)",
            }}
          >
            {heading}
          </h2>

          <p className="animate-text text-[#A0A0A0] text-base md:text-lg leading-relaxed text-center md:text-justify max-w-2xl opacity-90">
            {description}
          </p>

          {/* Features with Enhanced Styling */}
          {features.length > 0 && (
            <ul className="animate-text grid gap-4 mt-6">
              {features.map((feature, index) => (
                <li
                  key={feature.id}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-[#0A1D37]/20 hover:border-[#4DBFF0]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#0A1D37]/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    {feature.icon ? (
                      <span className="text-white text-lg">{feature.icon}</span>
                    ) : (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-[#0A1D37] text-sm md:text-base mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-[#A0A0A0] text-xs md:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Enhanced Buttons */}
          {buttons?.length && (
            <div className="animate-text flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              {buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={getButtonClasses(button)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative flex items-center gap-3 z-10">
                    {button.icon && (
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                        {button.icon}
                      </span>
                    )}
                    <span>{button.text}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
