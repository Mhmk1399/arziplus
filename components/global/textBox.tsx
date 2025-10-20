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
  animate = true,
}: TextBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  console.log(scrollProgress,isScrollable);

  const {
    headingColor = "text-gray-900",
    textColor = "text-gray-700",
  } = theme;

  const {
    headingSize = "text-xl md:text-2xl",
    textSize = "text-base",
    fontWeight = "font-normal",
  } = typography;



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

  // const containerClasses = [
  //   backgroundColor,
  //   padding,
  //   margin,
  //   gap,
  //   rounded ? "" : "",
  //   shadow ? "shadow-lg hover:shadow-xl" : "",
  //   border ? `border ${borderColor}` : "",
  //   "transition-all duration-300",
  //   "relative",
  //   className,
  // ]
  //   .filter(Boolean)
  //   .join(" ");

  const textBoxClasses = [
    "relative",
    "overflow-y-auto",
    "custom-scrollbar",
    "rounded-xl",
    "p-4",
    "transition-all duration-200",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={` sm:px-30 py-12  `} dir="rtl">
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
            className={`${textSize} ${textColor}   ${fontWeight} text-justify whitespace-pre-wrap`}
          >
            {content}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #0A1D37 transparent;
          scroll-behavior: smooth;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #0A1D37, #4dbff0);
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #e56a00, #3da8d9);
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
