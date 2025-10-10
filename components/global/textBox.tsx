"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextBoxProps {
  heading: string;
  content: string | React.ReactNode;
  height?: number;
  theme?: {
    backgroundColor?: string;
    headingColor?: string;
    textColor?: string;
    borderColor?: string;
    scrollbarColor?: string;
    scrollbarTrackColor?: string;
  };
  typography?: {
    headingSize?: string;
    textSize?: string;
    lineHeight?: string;
    fontWeight?: string;
  };
  spacing?: {
    padding?: string;
    margin?: string;
    gap?: string;
  };
  style?: {
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
  };
  animate?: boolean;
  showScrollIndicator?: boolean;
  className?: string;
}

export default function TextBox({
  heading,
  content,
  height = 200,
  theme = {},
  typography = {},
  spacing = {},
  style = {},
  animate = true,
  className = "",
}: TextBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  console.log(scrollProgress)

  const {
    backgroundColor = "bg-white",
    headingColor = "text-gray-900",
    textColor = "text-gray-700",
    borderColor = "border-gray-200",
    scrollbarColor = "scrollbar-thumb-blue-500",
    scrollbarTrackColor = "scrollbar-track-gray-100",
  } = theme;

  const {
    headingSize = "text-xl md:text-2xl",
    textSize = "text-base",
    lineHeight = "leading-relaxed",
    fontWeight = "font-normal",
  } = typography;

  const { padding = "p-6", margin = "", gap = "space-y-4" } = spacing;

  const { rounded = true, shadow = true, border = true } = style;

  // بررسی قابلیت اسکرول
  useEffect(() => {
    const checkScrollable = () => {
      if (contentRef.current && textBoxRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const containerHeight = textBoxRef.current.clientHeight;
        setIsScrollable(contentHeight > containerHeight);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => window.removeEventListener("resize", checkScrollable);
  }, [content]);

  // مدیریت اسکرول و progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    setScrollProgress(progress);
  };

  // انیمیشن ورود
  useEffect(() => {
    if (!animate) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      )
        .fromTo(
          headingRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .fromTo(
          textBoxRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [animate]);

  const containerClasses = [
    backgroundColor,
    padding,
    margin,
    gap,
    rounded ? "" : "",
    shadow ? "shadow-lg hover:shadow-xl" : "",
    border ? `border ${borderColor}` : "",
    "transition-all duration-300",
    "relative",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textBoxClasses = [
    "relative",
    "overflow-y-auto",
    "scrollbar-thin",
    scrollbarColor,
    scrollbarTrackColor,
    "scrollbar-corner-transparent",
    border ? `border ${borderColor}` : "",
    rounded ? "rounded-lg" : "",
     "p-4",
    "transition-all duration-200",
    "hover:bg-gray-50/90",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={` sm:px-30 py-12  `}
      dir="rtl"
    >
      {/* Heading */}
      <h3
        ref={headingRef}
        className={`${headingSize} font-bold text-center ${headingColor} mb-4`}
      >
        {heading}
      </h3>

      {/* Text Box Container */}
      <div className="relative">
        {/* Text Box */}
        <div
          ref={textBoxRef}
          className={textBoxClasses}
          style={{ height: `${height}px` }}
          onScroll={handleScroll}
        >
          <div
            ref={contentRef}
            className={`${textSize} ${textColor} ${lineHeight} ${fontWeight}  whitespace-pre-wrap`}
          >
            {content}
          </div>

          {/* Scroll Hint */}
          {isScrollable && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-50 animate-bounce">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Fade Gradients */}
        {isScrollable && (
          <>
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-50/80 to-transparent pointer-events-none z-5" />
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50/80 to-transparent pointer-events-none z-5" />
          </>
        )}
      </div>

      <style jsx>{`
        /* Custom Scrollbar Styles */
        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-blue-500::-webkit-scrollbar-thumb {
          background-color: #3b82f6;
          border-radius: 3px;
        }

        .scrollbar-thumb-blue-500::-webkit-scrollbar-thumb:hover {
          background-color: #2563eb;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
          border-radius: 3px;
        }

        .scrollbar-corner-transparent::-webkit-scrollbar-corner {
          background-color: transparent;
        }

        /* Smooth scrolling */
        .overflow-y-auto {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
