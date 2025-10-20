"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceItem {
  name: string;
  icon?: React.ReactNode;
  description?: string;
  children?: ServiceItem[];
}

interface ServicesGridProps {
  title?: string;
  subtitle?: string;
  services: ServiceItem[];
  className?: string;
  autoRotate?: boolean;
  visibleServices?: number; // 6 or 7 services visible at once
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  title = "خدمات ما",
  services,
  className = "",
  autoRotate = true,
  visibleServices = 6,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ferrisWheelRef = useRef<HTMLDivElement>(null);
  const servicesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [screenWidth, setScreenWidth] = useState(1024); // Default to desktop for SSR

  // Calculate how many services to show based on visibleServices prop
  const displayServices = services.slice(
    0,
    Math.min(services.length, visibleServices)
  );
  const angleStep = 360 / displayServices.length;
console.log(hoveredService,currentRotation)
  // Calculate radius based on screen width - much smaller for mobile
  const radius = useMemo(() => {
    if (screenWidth < 640) {
      // Mobile: very small radius to keep cards on screen
      return 40; // Even smaller - was 60px, now 40px
    } else if (screenWidth < 768) {
      // Tablet: medium radius
      return 100; // Reduced from 120px
    } else {
      // Desktop: full radius
      return 250; // Unchanged
    }
  }, [screenWidth]);

  // Calculate container size with same logic
  const containerSize = useMemo(() => {
    return screenWidth < 640 ? "280px" : screenWidth < 768 ? "400px" : "600px";
  }, [screenWidth]);
  useEffect(() => {
    // Set client flag and initial screen width
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !ferrisWheelRef.current) return;

    const ctx = gsap.context(() => {
      // Initial entrance animations
      const tl = gsap.timeline();

      // Header animation
      tl.fromTo(
        ".services-header",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Ferris wheel container entrance
      tl.fromTo(
        ferrisWheelRef.current,
        { scale: 0.3, opacity: 0, rotationY: 45 },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );

      // Service items stagger animation
      servicesRefs.current.forEach((serviceEl, index) => {
        if (!serviceEl) return;

        gsap.set(serviceEl, {
          opacity: 0,
          scale: 0.8,
          rotationX: 45,
        });

        tl.to(
          serviceEl,
          {
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          `-=${0.8 - index * 0.1}`
        );
      });

      // Continuous rotation animation
      if (autoRotate) {
        gsap.to(ferrisWheelRef.current, {
          rotation: 360,
          duration: 20,
          ease: "none",
          repeat: -1,
          onUpdate: function () {
            const currentRotationValue = this.progress() * 360;
            setCurrentRotation(currentRotationValue);

            // Counter-rotate service cards to keep them upright and readable
            servicesRefs.current.forEach((serviceEl) => {
              if (serviceEl) {
                gsap.set(serviceEl, {
                  rotation: -currentRotationValue,
                });
              }
            });
          },
        });
      }

      // Removed floating animation to keep service boxes stationary

      // Parallax background particles
      gsap.to(".floating-particle", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [displayServices.length, autoRotate]);

  // Handle service hover
  const handleServiceHover = (index: number | null) => {
    setHoveredService(index);

    servicesRefs.current.forEach((serviceEl, i) => {
      if (!serviceEl) return;

      if (index === null) {
        // Reset all
        gsap.to(serviceEl, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (i === index) {
        // Scale up hovered service (removed z movement)
        gsap.to(serviceEl, {
          scale: 1.1,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      } else {
        // Scale down others slightly (removed z movement)
        gsap.to(serviceEl, {
          scale: 0.9,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  return (
    <section
      ref={containerRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1D37] backdrop-blur-2xl py-24 px-4 ${className}`}
      dir="rtl"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute rounded-full opacity-20"
            style={{
              left: `${5 + ((i * 7) % 90)}%`,
              top: `${10 + ((i * 11) % 80)}%`,
              width: `${6 + (i % 5) * 3}px`,
              height: `${6 + (i % 5) * 3}px`,
              background: `linear-gradient(45deg, 
                ${
                  i % 4 === 0
                    ? "#0A1D37"
                    : i % 4 === 1
                    ? "#4DBFF0"
                    : i % 4 === 2
                    ? "#0A1D37"
                    : "#0A1D37"
                }, 
                ${
                  i % 4 === 0
                    ? "#0A1D37"
                    : i % 4 === 1
                    ? "#4DBFF0"
                    : i % 4 === 2
                    ? "#0A1D37"
                    : "#0A1D37"
                }
              )`,
              filter: "blur(1px)",
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-[#4DBFF0]/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 border-2 border-[#0A1D37]/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-lg rotate-12 animate-float"></div>
        <div className="absolute bottom-1/4 right-3/4 w-20 h-20 border border-[#0A1D37]/20 rounded-lg rotate-45 animate-spin-slow"></div>
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="services-header text-center mb-16 md:mb-2">
          <h2 className="text-3xl md:text-5xl text-gray-100 font-extrabold mb-6">
            {title}
          </h2>
        </div>

        {/* Ferris Wheel Container */}
        <div className="relative">
          <div
            ref={ferrisWheelRef}
            className="relative mx-auto"
            style={{
              width: containerSize,
              height: containerSize,
              maxWidth: "90vw",
              maxHeight: "90vw",
            }}
          >
            {/* Center Hub */}
            <div className="absolute md:hidden top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border-2 border-white/50 shadow-2xl flex items-center justify-center z-20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4DBFF0] to-[#0A1D37] shadow-inner"></div>
            </div>

            {/* Services arranged in circle */}
            {displayServices.map((service, index) => {
              const angle = (index * angleStep - 90) * (Math.PI / 180); // Start from top
              // Responsive x, y coordinates based on screen size

              const x = (Math.cos(angle) * radius) / 2;
              const y = (Math.sin(angle) * radius) / 2;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    servicesRefs.current[index] = el;
                  }}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                  }}
                  onMouseEnter={() => handleServiceHover(index)}
                  onMouseLeave={() => handleServiceHover(null)}
                >
                  <div className="relative group cursor-default">
                    {/* Service Card */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl hover:bg-white/25 hover:border-white/50 transition-all duration-500 flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 text-center relative overflow-hidden">
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>

                      {/* Icon */}
                      {service.icon && (
                        <div className="text-sm sm:text-xl md:text-2xl mb-1 sm:mb-2 text-[#0A1D37] relative z-10">
                          {service.icon}
                        </div>
                      )}

                      {/* Service Name */}
                      <h3 className="text-[7px]  md:text-sm font-bold text-gray-50 mb-1 relative z-10 line-clamp-3">
                        {service.name}
                      </h3>

                      {/* Glow Effect */}
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#0A1D37]/20 to-[#4DBFF0]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between md:hidden mt-10 ">
            <button
              onClick={() => {
                if (ferrisWheelRef.current) {
                  gsap.to(ferrisWheelRef.current, {
                    rotation: `+=${-angleStep}`,
                    duration: 0.8,
                    ease: "power2.out",
                  });
                }
              }}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300"
            >
              <svg
                className="w-6 h-6 text-[#0A1D37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                if (ferrisWheelRef.current) {
                  gsap.to(ferrisWheelRef.current, {
                    rotation: `+=${angleStep}`,
                    duration: 0.8,
                    ease: "power2.out",
                  });
                }
              }}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300"
            >
              <svg
                className="w-6 h-6 text-[#0A1D37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
