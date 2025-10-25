"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { estedadBold } from "@/next-persian-fonts/estedad";

gsap.registerPlugin(ScrollTrigger);

export interface ThemeConfig {
  background: string;
  textBoxBg: string;
  heading: string;
  description: string;
  button: string;
}

export interface WhyUsItem {
  id: number;
  icon: React.ReactNode;
  title: string;
  description?: string;
  iconColor?: string;
}

interface Props {
  heading: string;
  buttonColor?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  items: WhyUsItem[];
  theme: ThemeConfig;
}

export default function WhyUsSection({
  heading,
  description,
  buttonText,
  buttonLink,
  buttonColor,
  items,
  theme,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cleanup: (() => void)[] = [];

    // Enhanced hover animations
    itemsRef.current.forEach((item) => {
      const iconEl = item.querySelector(".icon-container");
      const titleEl = item.querySelector(".item-title");

      const handleMouseEnter = () => {
        gsap.to(item, {
          scale: 1.02,
          y: -4,
          duration: 0.4,
          ease: "power2.out",
          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
        });

        if (iconEl) {
          gsap.to(iconEl, {
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        }

        if (titleEl) {
          gsap.to(titleEl, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(item, {
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.inOut",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        });

        if (iconEl) {
          gsap.to(iconEl, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
        }

        if (titleEl) {
          gsap.to(titleEl, {
            scale: 1,
            duration: 0.3,
            ease: "power2.inOut",
          });
        }
      };

      item.addEventListener("mouseenter", handleMouseEnter);
      item.addEventListener("mouseleave", handleMouseLeave);

      cleanup.push(() => {
        item.removeEventListener("mouseenter", handleMouseEnter);
        item.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full py-20 px-4 md:px-8 lg:px-12 ${theme.background}`}
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-slate-900/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-48 h-48 bg-indigo-900/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-blue-900/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-gray-900/10 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-slate-800/15 rounded-full blur-xl" />
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        {/* Right: Box */}
        <div
          className={`p-6 lg:p-8 rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm ${theme.textBoxBg} self-start md:sticky top-24 transition-all duration-300 hover:shadow-2xl hover:border-white/30`}
        >
          <h2
            className={`text-center md:text-right text-2xl md:text-3xl ${estedadBold.className} leading-tight mb-4 ${theme.heading} transition-colors duration-300`}
          >
            {heading}
          </h2>
          <p
            className={`text-sm md:text-base text-center md:text-justify leading-relaxed mb-6 ${theme.description} transition-colors duration-300`}
          >
            {description}
          </p>
          <Link
            href={buttonLink}
            className={`inline-block w-full md:w-auto text-center px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 ${
              buttonColor ?? theme.button
            }`}
          >
            {buttonText}
          </Link>
        </div>

        {/* Left: Items */}
        <div
          className={`
            grid 
            sm:grid-cols- 
            lg:grid-cols-2 
            xl:grid-cols-2
            gap-6
          `}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) itemsRef.current[index] = el;
              }}
              className={`p-4 lg:p-6 rounded-2xl shadow-md border border-transparent text-center md:text-right transition-all duration-300 backdrop-blur-sm cursor-pointer group ${theme.textBoxBg} hover:border-white/20`}
            >
              <div className="flex  gap-2 md:gap-4 justify-between items-center">
                <div
                  className={`icon-container p-2 md:p-4 flex items-center justify-center  rounded-xl text-white text-sm md:text-xl shadow-md transition-all duration-300 group-hover:shadow-lg ${
                    item.iconColor ?? "bg-[#4DBFF0]"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex border-r border-white px-4 flex-col  leading-relaxed tracking-wider gap-1">
                  <h3
                    className={`text-right text-sm line-clamp-1  md:text-base ${estedadBold.className}    transition-all duration-300 ${theme.heading}`}
                  >
                    {item.title}
                  </h3>{" "}
                  <p
                    className={`text-[10px] text-right sm:leading-0.5  md:leading-relaxed transition-colors duration-300 ${theme.description}`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
