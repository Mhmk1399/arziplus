"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { estedadBold } from "@/next-persian-fonts/estedad/index";

interface HeroButton {
  text: string;
  href: string;
  variant: "primary" | "secondary" | "outline" | "green" | "red" | "fuchsia";
  icon?: React.ReactNode;
  colors?: {
    bg: string;
    hover: string;
    text: string;
    hoverText?: string;
  };
}

interface HeroMedia {
  type: "image" | "video";
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  poster?: string; // For video poster image
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

interface HeroProps {
  heading: string;
  subheading?: string;
  description: string;
  buttons?: HeroButton[];
  media: HeroMedia;
  theme?: {
    headingColor?: string;
    descriptionColor?: string;
    backgroundColor?: string;
    backgroundGradient?: string;
    subheadingColor?: string;
    bgSubHeadingColor?: string;
    featuresColor?: string;
  };
  layout?: "default" | "centered" | "full-width";
  animationDelay?: number;
  stats?: {
    customers?: string;
    support?: string;
    experience?: string;
  };
  features?: { text: string; icon?: React.ReactNode }[];
}

export default function HeroSection({
  heading,
  subheading,
  description,
  buttons,
  media,
  features,
  theme = {},
  layout = "default",
  animationDelay = 0,
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const {
    headingColor = "text-[#0A1D37]",
    subheadingColor = "text-[#A0A0A0]",
    featuresColor = "text-[#FFFFFF]",
  } = theme;

  const getButtonClasses = (button: HeroButton) => {
    const baseClasses =
      "inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-500 shadow-xl transform relative overflow-hidden group backdrop-blur-sm border border-white/10";

    if (button.colors) {
      return `${baseClasses} ${button.colors.bg} ${button.colors.text} hover:${
        button.colors.hover
      } ${button.colors.hoverText || ""}`;
    }

    switch (button.variant) {
      case "primary":
        return `${baseClasses} bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] hover:from-[#0A1D37]/80 hover:to-[#4DBFF0]/80 hover:shadow-[#0A1D37]/50 hover:shadow-2xl`;
      case "red":
        return `${baseClasses} bg-[#0A1D37] text-[#FFFFFF] hover:bg-[#0A1D37]/80 hover:shadow-[#0A1D37]/50 hover:shadow-2xl`;
      case "secondary":
        return `${baseClasses} bg-[#0A1D37] text-[#FFFFFF] hover:bg-[#0A1D37]/80 hover:shadow-[#0A1D37]/50 hover:shadow-2xl`;
      case "fuchsia":
        return `${baseClasses} bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-[#FFFFFF] hover:from-[#4DBFF0]/80 hover:to-[#0A1D37]/80 hover:shadow-[#4DBFF0]/50 hover:shadow-2xl`;
      case "green":
        return `${baseClasses} bg-[#4DBFF0] text-[#FFFFFF] hover:bg-[#4DBFF0]/80 hover:shadow-[#4DBFF0]/50 hover:shadow-2xl`;
      case "outline":
        return `${baseClasses} border-2 border-[#4DBFF0]/50 text-[#4DBFF0] hover:border-[#4DBFF0] hover:bg-[#4DBFF0]/10 hover:text-[#4DBFF0] bg-[#FFFFFF]/5 backdrop-blur-md hover:shadow-[#4DBFF0]/30 hover:shadow-2xl`;
      default:
        return `${baseClasses} bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] hover:from-[#0A1D37]/80 hover:to-[#4DBFF0]/80 hover:shadow-[#0A1D37]/50 hover:shadow-2xl`;
    }
  };

  const containerClasses =
    layout === "full-width"
      ? "w-full px-4 md:px-8"
      : layout === "centered"
      ? "max-w-6xl mx-auto px-4 md:px-8 text-center"
      : "max-w-7xl mx-auto px-4 md:px-8";

  const renderMedia = () => {
    if (media.type === "video") {
      return (
        <video
          className="w-full h-auto rounded-3xl shadow-2xl object-cover"
          width={media.width || 600}
          height={media.height || 600}
          poster={media.poster}
          autoPlay={media.autoplay || false}
          loop={media.loop || false}
          muted={media.muted || true}
          controls={media.controls || false}
          playsInline
        >
          <source src={media.src} type="video/mp4" />
          <source src={media.src.replace(".mp4", ".webm")} type="video/webm" />
          متاسفانه مرورگر شما از ویدیو پشتیبانی نمی‌کند.
        </video>
      );
    }

    return (
      <div className="relative h-48 sm:h-56 lg:h-80 w-full overflow-hidden rounded-2xl">
        {!imageError && media.src ? (
          <Image
            src={media.src}
            alt={media.alt || "Hero Image"}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            priority
            fetchPriority="high"
            loading="eager"
            onError={() => {
              console.log(
                "Failed to load hero image with Next.js Image:",
                media.src
              );
              setImageError(true);
            }}
          />
        ) : media.src ? (
          <img
            src={media.src}
            alt={media.alt || "Hero Image"}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            fetchPriority="high"
            loading="eager"
            onError={(e) => {
              console.log("Failed to load hero image with img tag:", media.src);
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        ) : (
          <Image
            src="/assets/images/loggo.png"
            alt={media.alt || "Hero Image"}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Fallback Text */}
        {!media.src && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A1D37]/20 to-[#4DBFF0]/20">
            <div className="text-4xl sm:text-5xl lg:text-6xl text-[#0A1D37]/10 font-bold">
              {heading.charAt(0)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Split heading into words for animation

  return (
    <section
      ref={heroRef}
      className={`  relative min-h-screen flex items-center justify-center overflow-hidden py-24 px-2`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 12}%`,
              width: `${12 + (i % 3) * 8}px`,
              height: `${12 + (i % 3) * 8}px`,
              background: i % 2 === 0 ? "#0A1D37" : "#4DBFF0",
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

      <div className={containerClasses}>
        <div
          className={`relative z-10 grid grid-cols-1 ${
            layout === "centered" ? "" : "lg:grid-cols-2"
          } gap-10 lg:gap-24 items-center justify-center`}
        >
          {/* Enhanced Media Section */}
          {layout !== "centered" && (
            <div className="relative group animate-fade-in-up">
              {/* Luxury Frame */}
              <div className="relative z-10 p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <div className="relative overflow-hidden rounded-2xl">
                  {renderMedia()}

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out"></div>
                </div>

                {/* Enhanced Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#4DBFF0] to-[#0A1D37] rounded-full opacity-60 animate-pulse blur-sm"></div>
                <div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-70 animate-pulse blur-sm"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-1/4 -right-8 w-4 h-4 bg-gradient-to-br from-green-400 to-teal-600 rounded-full opacity-50 animate-pulse blur-sm"
                  style={{ animationDelay: "2s" }}
                ></div>

                {/* Luxury Video Overlay */}
                {media.type === "video" && (
                  <div className="absolute inset-8 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                )}

                {/* Enhanced Play Button */}
                {media.type === "video" && !media.autoplay && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-24 h-24 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 group/play backdrop-blur-sm border border-white/30">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full flex items-center justify-center group-hover/play:from-[#0A1D37]/80 group-hover/play:to-[#4DBFF0]/80 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-[#FFFFFF] ml-1 group-hover/play:scale-110 transition-transform duration-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D37]/20 via-[#4DBFF0]/20 to-[#0A1D37]/20 rounded-3xl blur-3xl -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
          )}

          {/* Enhanced Centered Media */}
          {layout === "centered" && (
            <div className="order-1 relative max-w-4xl mx-auto group animate-fade-in-up">
              <div className="relative p-6 bg-gradient-to-br from-white/15 via-white/8 to-transparent backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                <div className="relative overflow-hidden rounded-2xl">
                  {renderMedia()}

                  {/* Luxury Shimmer */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1200 ease-out"></div>
                </div>

                {/* Elegant Decorative Elements */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-[#4DBFF0] to-[#0A1D37] rounded-full opacity-70 animate-pulse"></div>
                <div
                  className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              {/* Centered Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4DBFF0]/15 via-[#0A1D37]/15 to-[#0A1D37]/15 rounded-3xl blur-2xl -z-10 group-hover:scale-105 transition-transform duration-700"></div>
            </div>
          )}
          {/* Enhanced Content Section */}
          <div dir="rtl" className="w-full relative">
            {/* Elegant Badge */}
            <div className="mb-4 md:mb-8 md:mt-4 flex justify-center md:justify-start">
              {subheading && (
                <div className="relative group/badge">
                  <span
                    className={`inline-flex items-center px-6 py-3 rounded-full text-[10px] md:text-sm font-medium bg-gradient-to-r from-white/20 via-white/10 to-white/5 backdrop-blur-sm border border-white/30 shadow-lg ${subheadingColor} relative z-10`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/10 rounded-full group-hover/badge:from-[#4DBFF0]/20 group-hover/badge:to-[#0A1D37]/20 transition-all duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] rounded-full animate-pulse"></div>
                      {subheading}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Luxury Main Heading */}
            <h1
              className={`mb-8 text-xl md:text-4xl md:leading-12 -tracking-wide animate-fade-in-up ${
                estedadBold.className
              } ${headingColor} ${
                layout === "centered"
                  ? "text-center"
                  : "text-center md:text-right"
              } relative`}
              style={{
                textShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background:
                  "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {heading}

              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/5 via-[#0A1D37]/5 to-[#0A1D37]/5 blur-xl -z-10"></div>
            </h1>

            {/* Enhanced Description */}
            <p
              className={`md:mb-8 mb-4 text-center md:text-justify text-sm md:text-lg lg:text-base text-[#A0A0A0] leading-relaxed font-medium animate-fade-in-up animation-delay-200`}
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              {description}
            </p>

            {features && features.length > 0 && (
              <div
                className={`mb-8 ${
                  layout === "centered" ? "flex justify-center" : ""
                }`}
              >
                <ul
                  className={`grid gap-2 ${
                    layout === "centered" ? "max-w-md" : "max-w-lg"
                  }`}
                >
                  {features.map((item, idx) => (
                    <li
                      key={idx}
                      className="group flex items-center justify-center md:justify-start gap-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex-shrink-0 md:w-10 md:h-10 p-2 rounded-xl bg-[#0A1D37] flex items-center justify-center shadow-lg group-hover:shadow-[#0A1D37] transition-all duration-300">
                        {item.icon ? (
                          <span className="text-[#FFFFFF] text-lg">
                            {item.icon}
                          </span>
                        ) : (
                          <svg
                            className="w-5 h-5 text-[#FFFFFF]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm md:text-base font-medium leading-relaxed ${featuresColor} group-hover:text-opacity-90 transition-all duration-300`}
                      >
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enhanced Luxury Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-6 animate-fade-in-up animation-delay-400 ${
                layout === "centered" ? "justify-center items-center" : ""
              }`}
            >
              {buttons?.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={`group relative overflow-hidden px-8 py-5 rounded-2xl font-bold text-base transition-all duration-500 hover:shadow-2xl ${getButtonClasses(
                    button
                  )} transform-gpu perspective-1000`}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

                  {/* Luxury Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                  {/* Content */}
                  <span className="relative flex items-center justify-center gap-3 z-10">
                    {button.icon && (
                      <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                        {button.icon}
                      </span>
                    )}
                    <span className="tracking-wide">{button.text}</span>

                    {/* Arrow Icon */}
                    <svg
                      className="w-5 h-5 rotate-180 translate-x-[10px] group-hover:translate-x-0 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>

                  {/* Bottom Highlight */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
