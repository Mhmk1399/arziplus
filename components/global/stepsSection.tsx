"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { gsap } from "gsap";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

interface StepsSectionProps {
  heading: string;
  description?: string;
  steps: Step[];
  theme?: {
    backgroundColor?: string;
    backgroundGradient?: string;
    headingColor?: string;
    descriptionColor?: string;
    stepBoxColor?: string;
    stepActiveColor?: string;
    stepCompletedColor?: string;
    stepTextColor?: string;
    stepDescriptionColor?: string;
    stepActiveTextColor?: string;
    stepCompletedTextColor?: string;
    connectionLineColor?: string;
    numberColor?: string;
    numberActiveColor?: string;
    numberCompletedColor?: string;
  };
  layout?: "vertical" | "horizontal" | "grid" | "timeline";
  boxShape?: "rounded" | "square" | "circle" | "hexagon" | "diamond";
  boxSize?: "sm" | "md" | "lg" | "xl";
  showConnections?: boolean;
  showNumbers?: boolean;
  showIcons?: boolean;
  animated?: boolean;
  interactive?: boolean;
  className?: string;
}

export default function StepsSection({
  heading,
  description,
  steps,
  theme = {},
  showIcons = false,
  animated = true,
  interactive = false,
  className = "",
}: StepsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const stepsPerPage = 4;
  const showNavigation = isMounted && steps.length > stepsPerPage;

  // Responsive step width calculation
  const getStepWidth = () => {
    if (typeof window === "undefined") return 300;
    if (window.innerWidth < 640) return 280;
    if (window.innerWidth < 768) return 320;
    return 300;
  };

  const [stepWidth, setStepWidth] = useState(300);
  const [isDesktop, setIsDesktop] = useState(false);
  const gap = 24;

  // Helper function to check if step is in active window
  const isStepActive = (stepIndex: number) => {
    return stepIndex >= currentIndex && stepIndex < currentIndex + stepsPerPage;
  };

  const {
    backgroundColor = "bg-gray-50",
    stepDescriptionColor = "text-gray-400",
    backgroundGradient,
    headingColor = "text-gray-900",
    descriptionColor = "text-gray-600",
    stepBoxColor = "bg-white",
    stepActiveColor = "bg-blue-50",
    stepCompletedColor = "bg-green-50",
    stepTextColor = "text-gray-700",
    stepActiveTextColor = "text-blue-700",
    stepCompletedTextColor = "text-green-700",
    connectionLineColor = "border-gray-300",
    numberColor = "bg-gray-200 text-gray-700",
    numberActiveColor = "bg-blue-500 text-white",
    numberCompletedColor = "bg-green-500 text-white"
  } = theme;

  // Helper function to extract hex color and apply as inline style
  const getBoxStyle = (colorClass: string) => {
    if (colorClass.includes('bg-[#')) {
      const hexMatch = colorClass.match(/bg-\[#([A-Fa-f0-9]{6})\]/);
      if (hexMatch) {
        return { backgroundColor: `#${hexMatch[1]}` };
      }
    }
    return {};
  };

  // Calculate max scroll
  const getMaxScroll = () => {
    if (!scrollContainerRef.current || !contentRef.current) return 0;
    const containerWidth = scrollContainerRef.current.clientWidth;
    const totalWidth = steps.length * (stepWidth + gap) - gap;
    return Math.max(0, totalWidth - containerWidth);
  };

  // Update scroll buttons
  const updateScrollButtons = () => {
    if (!contentRef.current) return;

    const currentX = Math.abs(
      gsap.getProperty(contentRef.current, "x") as number
    );
    const maxScroll = getMaxScroll();

    setCanScrollRight(currentX < maxScroll - 10);
    setCanScrollLeft(currentX > 10);
  };

  // Hydration-safe mounting
  useEffect(() => {
    setIsMounted(true);
    setStepWidth(getStepWidth());
    setIsDesktop(window.innerWidth >= 768);

    const handleResize = () => {
      setStepWidth(getStepWidth());
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (!contentRef.current) return;

    const targetX = -index * (stepWidth + gap);
    const maxScroll = getMaxScroll();
    const boundedX = Math.max(-maxScroll, Math.min(0, targetX));

    gsap.to(contentRef.current, {
      x: boundedX,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: updateScrollButtons,
      onComplete: updateScrollButtons,
    });

    setCurrentIndex(index);
  };

  // Auto-scroll animation
  useEffect(() => {
    if (!isMounted || !showNavigation) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, steps.length - stepsPerPage);
          const next = prev + 1;
          const newIndex = next > maxIndex ? 0 : next;
          scrollToIndex(newIndex);
          return newIndex;
        });
      }, 3000);
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    startAutoScroll();

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", stopAutoScroll);
      container.addEventListener("mouseleave", startAutoScroll);
    }

    return () => {
      stopAutoScroll();
      if (container) {
        container.removeEventListener("mouseenter", stopAutoScroll);
        container.removeEventListener("mouseleave", startAutoScroll);
      }
    };
  }, [isMounted, showNavigation, steps.length]);

  // Intersection Observer for animation
  useEffect(() => {
    if (!animated || !isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute("data-step-id");
            if (stepId) {
              setVisibleSteps((prev) => new Set([...prev, stepId]));
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements =
      containerRef.current?.querySelectorAll("[data-step-id]");
    stepElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [animated, isMounted]);

  // Handle step click
  const handleStepClick = (stepId: string) => {
    if (interactive) {
      setActiveStep(activeStep === stepId ? null : stepId);
    }
  };

  // Navigation handlers - Fixed for RTL
  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, steps.length - stepsPerPage);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  // Fixed drag and touch functionality for RTL
  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let startX = 0;
    let currentX = 0;
    let isDown = false;
    let lastMoveTime = 0;
    let lastMoveX = 0;
    let velocity = 0;

    const handleStart = (clientX: number) => {
      isDown = true;
      setIsDragging(true);
      startX = clientX;
      currentX = gsap.getProperty(content, "x") as number;
      lastMoveX = clientX;
      lastMoveTime = Date.now();
      velocity = 0;

      gsap.killTweensOf(content);
    };

    const handleMove = (clientX: number) => {
      if (!isDown) return;

      // RTL: Drag right = move left (negative), Drag left = move right (positive)
      const deltaX = clientX - startX;
      const newX = currentX + deltaX;
      const maxScroll = getMaxScroll();

      let boundedX = newX;

      // Add rubber band effect at boundaries
      if (newX > 0) {
        boundedX = newX * 0.3; // Pull from left edge
      } else if (newX < -maxScroll) {
        boundedX = -maxScroll + (newX + maxScroll) * 0.3; // Pull from right edge
      }

      gsap.set(content, { x: boundedX });

      // Calculate velocity for momentum
      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt > 0) {
        velocity = (clientX - lastMoveX) / dt;
        lastMoveX = clientX;
        lastMoveTime = now;
      }

      updateScrollButtons();
    };

    const handleEnd = () => {
      if (!isDown) return;
      isDown = false;

      setTimeout(() => setIsDragging(false), 100);

      const currentPos = gsap.getProperty(content, "x") as number;
      const maxScroll = getMaxScroll();
      let targetX = currentPos;

      // Snap back if out of bounds
      if (currentPos > 0) {
        targetX = 0;
      } else if (currentPos < -maxScroll) {
        targetX = -maxScroll;
      } else {
        // Snap to nearest card
        const cardStep = stepWidth + gap;
        const currentStepIndex = Math.abs(currentPos) / cardStep;
        let snapIndex = Math.round(currentStepIndex);

        // Add momentum based on velocity
        if (Math.abs(velocity) > 0.5) {
          // RTL: positive velocity = dragging right = go to previous
          if (velocity > 0) {
            snapIndex = Math.floor(currentStepIndex);
          } else {
            snapIndex = Math.ceil(currentStepIndex);
          }
        }

        snapIndex = Math.max(0, Math.min(snapIndex, steps.length - 1));
        targetX = -snapIndex * cardStep;
        targetX = Math.max(-maxScroll, Math.min(0, targetX));

        setCurrentIndex(snapIndex);
      }

      gsap.to(content, {
        x: targetX,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: updateScrollButtons,
        onComplete: updateScrollButtons,
      });
    };

    // Touch events
    const touchStart = (e: TouchEvent) => {
      handleStart(e.touches[0].clientX);
    };

    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    const touchEnd = () => {
      handleEnd();
    };

    // Mouse events
    const mouseDown = (e: MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX);
    };

    const mouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const mouseUp = () => {
      handleEnd();
    };

    container.addEventListener("touchstart", touchStart, { passive: false });
    container.addEventListener("touchmove", touchMove, { passive: false });
    container.addEventListener("touchend", touchEnd);
    container.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    updateScrollButtons();

    return () => {
      container.removeEventListener("touchstart", touchStart);
      container.removeEventListener("touchmove", touchMove);
      container.removeEventListener("touchend", touchEnd);
      container.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, [steps.length, stepWidth, gap]);

  // Mobile simple layout (no sliding)
  if (!isDesktop && isMounted) {
    return (
      <section className={`py-16 md:py-20 ${backgroundGradient || backgroundColor} ${className}`} dir="rtl">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold ${headingColor} mb-4 leading-tight`}>
              {heading}
            </h2>
            {description && (
              <p className={`text-sm ${descriptionColor} max-w-xl mx-auto leading-relaxed opacity-75`}>
                {description}
              </p>
            )}
          </div>

          {/* Simple Mobile Steps Grid */}
          <div className="flex flex-col gap-6 p-4">
            {steps.map((step) => (
              <div key={step.id} className="w-full">
                <div 
                  className={`${stepBoxColor.includes('bg-[#') ? '' : stepBoxColor} shadow-xl backdrop-blur-lg rounded-xl border border-gray-400/10 p-6 transition-all duration-300 hover:border-gray-200 hover:shadow-2xl hover:scale-105 h-32`}
                  style={getBoxStyle(stepBoxColor)}
                >
                  <div className="h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      {showIcons && step.icon && (
                        <div className={`text-lg ${stepActiveTextColor} flex-shrink-0`}>
                          {step.icon}
                        </div>
                      )}
                      <h3 className={`text-sm font-bold ${stepTextColor} flex-1 line-clamp-2`}>
                        {step.title}
                      </h3>
                    </div>
                    {step.description && (
                      <p className={`text-xs ${descriptionColor} leading-7 line-clamp-2`}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop sliding layout
  return (
    <section
      ref={containerRef}
      className={`py-16 md:py-20 ${backgroundGradient || backgroundColor} ${className}`}
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-2xl md:text-3xl font-bold ${headingColor} mb-4 leading-tight`}>
            {heading}
          </h2>

          {description && (
            <p className={`text-sm ${descriptionColor} max-w-xl mx-auto leading-relaxed opacity-75`}>
              {description}
            </p>
          )}
        </div>

        {/* Steps Container */}
        <div className="relative" suppressHydrationWarning>
          {/* Navigation Buttons */}
          {showNavigation && (
            <>
              {/* Previous button (right side in RTL) */}
              <button
                onClick={handlePrevious}
                disabled={!canScrollLeft}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Previous"
              >
                <ChevronRightIcon className={`w-5 h-5 ${stepActiveTextColor}`} />
              </button>

              {/* Next button (left side in RTL) */}
              <button
                onClick={handleNext}
                disabled={!canScrollRight}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Next"
              >
                <ChevronLeftIcon className={`w-5 h-5 ${stepActiveTextColor}`} />
              </button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{ touchAction: "pan-y pinch-zoom" }}
          >
            <div
              ref={contentRef}
              className="flex flex-row-reverse p-4 w-full"
              style={{
                gap: `${gap}px`,
                willChange: "transform",
                transform: "translateZ(0)",
              }}
              suppressHydrationWarning
            >
              {steps.map((step, stepIndex) => {
                const isActive = isStepActive(stepIndex);
                return (
                  <div
                    key={step.id}
                    data-step-id={step.id}
                    className={`flex-shrink-0   transition-all duration-500 ${
                      isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
                    } ${isDragging ? "pointer-events-none" : ""}`}
                    style={{
                      width: `${stepWidth}px`,
                      minWidth: `${stepWidth}px`,
                    }}
                    onClick={(e) => {
                      if (isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <div
                      className={`${stepBoxColor.includes('bg-[#') ? '' : stepBoxColor} shadow-xl backdrop-blur-lg rounded-xl border p-6 md:p-8 transition-all duration-500 h-64 ${
                        isActive
                          ? `${stepActiveColor} hover:shadow-2xl hover:scale-105`
                          : "border-gray-400/10 hover:border-gray-200 hover:opacity-60"
                      }`}
                      style={getBoxStyle(stepBoxColor)}
                    >
                      {/* Icon */}
                      {showIcons && step.icon && (
                        <div
                          className={`flex justify-center text-xl my-6 transition-colors duration-300 ${
                            isActive ? stepActiveTextColor : "text-gray-400"
                          }`}
                        >
                          {step.icon}
                        </div>
                      )}

                      {/* Content */}
                      <div className="text-center space-y-9">
                        <h3
                          className={`text-md font-bold transition-colors duration-300 ${
                            isActive ? stepTextColor : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </h3>
                        {step.description && (
                          <p
                            className={`text-xs leading-relaxed transition-colors duration-300 ${stepDescriptionColor}  `}
                          >
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Dots */}
          {showNavigation && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({
                length: Math.max(0, steps.length - stepsPerPage + 1),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? `${numberActiveColor.replace('text-white', '')} w-8`
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Active Steps Indicator */}
        {showNavigation && (
          <div className="text-center mt-6">
            <p className={`text-sm ${descriptionColor}`}>
              نمایش مراحل {currentIndex + 1} تا{" "}
              {Math.min(currentIndex + stepsPerPage, steps.length)} از{" "}
              {steps.length}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        * {
          -webkit-overflow-scrolling: touch;
        }

        .select-none {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .cursor-grab {
          cursor: grab;
        }

        .cursor-grab:active {
          cursor: grabbing;
        }

        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}
