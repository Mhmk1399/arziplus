"use client";
import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";

// Service interface
interface Service {
  _id: string;
  title: string;
  slug: string;
  fee: number;
  wallet: boolean;
  description?: string;
  helper?: string;
  category?: string;
  icon?: string;
  image?: string;
  status: string;
  fields?: string[];
}

// API Response interface
interface ServicesResponse {
  success: boolean;
  data: Service[];
  message?: string;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<Service[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }
  const data: ServicesResponse = await response.json();
  return data.success ? data.data : [];
};

// Group services by category
const groupServicesByCategory = (services: Service[]) => {
  const grouped = services.reduce((acc, service) => {
    const category = service.category || "سایر خدمات";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // Sort categories to show "سایر خدمات" (uncategorized) last
  const sortedEntries = Object.entries(grouped).sort(
    ([categoryA], [categoryB]) => {
      if (categoryA === "سایر خدمات") return 1;
      if (categoryB === "سایر خدمات") return -1;
      return categoryA.localeCompare(categoryB, "fa");
    }
  );

  return Object.fromEntries(sortedEntries);
};

// Service Card Component
const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <div className="group relative overflow-hidden  transition-all duration-300 transform hover:scale-105">
      {/* Service Image */}
      <div className="relative h-64 w-full">
        <Image
          src={service.image || "/assets/images/logoArzi.webp"}
          alt={service.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="text-4xl text-white font-bold">
          {service.title.charAt(0)}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Service Title Overlay */}
        <div className="absolute bottom-4 right-4 left-4">
          <h3
            className={`text-white font-bold text-lg ${estedadBold.className}`}
          >
            {service.title}
          </h3>
          <div className="flex items-center gap-2 mt-2"></div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-4 ">
        <Link href={`/services/${service.slug}`}>
          <button className="w-full flex items-center justify-center gap-2  text-[#0A1D37] font-medium py-3 px-6 rounded-xl hover:opacity-90 transition-opacity">
            ثبت درخواست
            <FaArrowLeft className="text-sm" />
          </button>
        </Link>
      </div>
    </div>
  );
};

// Category Section Component
const CategorySection = ({
  category,
  services,
}: {
  category: string;
  services: Service[];
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 296; // 280px + 16px gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 296; // 280px + 16px gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };

  // Pan/drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
      scrollContainerRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  // Touch events for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Initialize scroll position check
  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [services.length]);

  return (
    <section className="mb-16">
      {/* Category Header */}
      <div className="mb-8">
        <h2
          className={`text-3xl font-bold text-[#0A1D37] mb-4 ${estedadBold.className}`}
        >
          {category}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] rounded-full" />
      </div>

      {/* Services Horizontal Scroll Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {services.length > 4 && canScrollLeft && (
          <button
            onClick={scrollToLeft}
            className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 group-hover:opacity-100 opacity-0"
            style={{ marginRight: "-20px" }}
          >
            <FaArrowRight className="text-[#0A1D37] text-sm" />
          </button>
        )}

        {/* Right Arrow */}
        {services.length > 4 && canScrollRight && (
          <button
            onClick={scrollToRight}
            className="hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 group-hover:opacity-100 opacity-0"
            style={{ marginLeft: "-20px" }}
          >
            <FaArrowLeft className="text-[#0A1D37] text-sm" />
          </button>
        )}

        {/* Scrollable Services Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 cursor-grab"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onScroll={checkScrollPosition}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {services.map((service) => (
            <div
              key={service._id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              style={{
                minWidth: "280px",
                userSelect: isDragging ? "none" : "auto",
              }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

// Main Services Page Component
export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch services using SWR
  const {
    data: services,
    error,
    isLoading,
  } = useSWR<Service[]>("/api/dynamicServices?status=active", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: false,
  });

  // Filter services based on search
  const filteredServices =
    services?.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Group filtered services by category
  const servicesByCategory = groupServicesByCategory(filteredServices);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-2">
            خطا در بارگذاری خدمات
          </h2>
          <p className="text-[#0A1D37]/60">
            لطفاً صفحه را مجدداً بارگذاری کنید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-32" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className={`text-5xl font-bold text-[#0A1D37] mb-6 ${estedadBold.className}`}
          >
            خدمات ارزی پلاس
          </h1>
          <p className="text-xl text-[#0A1D37]/70 max-w-3xl mx-auto leading-relaxed">
            مجموعه کاملی از خدمات ارزی و مالی برای تسهیل امور بین‌المللی شما
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در خدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-2 border-[#4DBFF0]/30 rounded-2xl text-[#0A1D37] placeholder-[#0A1D37]/50 focus:outline-none focus:ring-2 focus:ring-[#4DBFF0]/50 focus:border-[#4DBFF0] transition-all duration-300"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-[#0A1D37]/40"
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
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-[#4DBFF0]">
              <FaSpinner className="animate-spin text-2xl" />
              <span className="text-lg font-medium">
                در حال بارگذاری خدمات...
              </span>
            </div>
          </div>
        )}

        {/* Services by Category */}
        {!isLoading && Object.keys(servicesByCategory).length > 0 && (
          <div>
            {Object.entries(servicesByCategory).map(
              ([category, categoryServices]) => (
                <CategorySection
                  key={category}
                  category={category}
                  services={categoryServices}
                />
              )
            )}
          </div>
        )}

        {/* No Services Found */}
        {!isLoading && filteredServices.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[#0A1D37]/40 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-[#0A1D37] mb-2">
              هیچ خدمتی یافت نشد
            </h3>
            <p className="text-[#0A1D37]/60">
              {searchTerm
                ? "لطفاً کلمه کلیدی دیگری را امتحان کنید"
                : "در حال حاضر خدمتی در دسترس نیست"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
