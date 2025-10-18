"use client";
import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaSearch,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
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
  const [imageError, setImageError] = useState(false);
  
  console.log("Service data:", service);
  console.log("Service image URL:", service.image);
  
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.03] border border-gray-100">
      {/* Service Image */}
      <div className="relative h-48 sm:h-56 lg:h-64 w-full overflow-hidden">
        {!imageError && service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            onError={(e) => {
              console.error("Failed to load service image with Next.js Image:", service.image);
              console.error("Falling back to regular img tag");
              setImageError(true);
            }}
          />
        ) : service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              console.error("Failed to load service image with img tag:", service.image);
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        ) : (
          <Image
            src="/assets/images/logoArzi.webp"
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Fallback Text */}
        {!service.image && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FF7A00]/20 to-[#4DBFF0]/20">
            <div className="text-4xl sm:text-5xl lg:text-6xl text-[#0A1D37]/10 font-bold">
              {service.title.charAt(0)}
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Badge - if wallet is enabled */}
        {service.wallet && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg">
            <FaCheckCircle className="text-xs" />
            <span>پرداخت کیف پول</span>
          </div>
        )}

        {/* Service Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
          <h3
            className={`text-white font-bold text-base sm:text-lg lg:text-xl mb-2 leading-relaxed ${estedadBold.className}`}
          >
            {service.title}
          </h3>
          {service.fee > 0 && (
            <div className="flex items-center gap-2 text-white/90">
              <span className="text-sm sm:text-base">هزینه:</span>
              <span className="text-base sm:text-lg font-bold">
                {service.fee.toLocaleString()} تومان
              </span>
            </div>
          )}
        </div>
      </div>



      {/* CTA Button */}
      <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-gray-50 to-white">
        <Link href={`/services/${service.slug}`}>
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#FF7A00]/90 hover:from-[#FF7A00]/90 hover:to-[#FF7A00] text-white font-bold py-3 sm:py-3.5 lg:py-4 px-4 sm:px-5 lg:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-95">
            <span className="text-sm sm:text-base">ثبت درخواست</span>
            <FaArrowLeft className="text-xs sm:text-sm" />
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
    <section className="mb-12 sm:mb-16 lg:mb-20">
      {/* Category Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10 px-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1D37] mb-2 sm:mb-3 ${estedadBold.className}`}
            >
              {category}
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] rounded-full" />
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#FF7A00]/10 to-[#4DBFF0]/10 px-3 sm:px-4 py-2 rounded-xl">
            <FaStar className="text-[#FF7A00] text-sm sm:text-base" />
            <span className="text-xs sm:text-sm font-bold text-[#0A1D37]">
              {services.length} خدمت
            </span>
          </div>
        </div>
      </div>

      {/* Services Horizontal Scroll Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {services.length > 4 && canScrollLeft && (
          <button
            onClick={scrollToLeft}
            aria-label="اسکرول به چپ"
            className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-full p-3 lg:p-4 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 group-hover:opacity-100 opacity-0 border border-gray-200"
            style={{ marginRight: "-24px" }}
          >
            <FaArrowRight className="text-[#0A1D37] text-base lg:text-lg" />
          </button>
        )}

        {/* Right Arrow */}
        {services.length > 4 && canScrollRight && (
          <button
            onClick={scrollToRight}
            aria-label="اسکرول به راست"
            className="hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-full p-3 lg:p-4 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 group-hover:opacity-100 opacity-0 border border-gray-200"
            style={{ marginLeft: "-24px" }}
          >
            <FaArrowLeft className="text-[#0A1D37] text-base lg:text-lg" />
          </button>
        )}

        {/* Scrollable Services Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing"
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
              className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-18px)]"
              style={{
                minWidth: "280px",
                maxWidth: "320px",
                userSelect: isDragging ? "none" : "auto",
              }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Scroll Indicator - Mobile */}
        {services.length > 1 && (
          <div className="flex lg:hidden justify-center gap-1.5 mt-4">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                canScrollLeft ? "w-6 bg-gray-300" : "w-8 bg-[#FF7A00]"
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                !canScrollLeft && !canScrollRight
                  ? "w-8 bg-[#FF7A00]"
                  : "w-6 bg-gray-300"
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                canScrollRight ? "w-6 bg-gray-300" : "w-8 bg-[#FF7A00]"
              }`}
            />
          </div>
        )}
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
      <div className="min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] flex items-center justify-center px-4">
        <div className="text-center p-6 sm:p-8 lg:p-12 bg-white rounded-3xl shadow-2xl max-w-md border border-red-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <div className="text-red-500 text-4xl sm:text-5xl">⚠️</div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A1D37] mb-3 sm:mb-4">
            خطا در بارگذاری خدمات
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            لطفاً صفحه را مجدداً بارگذاری کنید
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#FF7A00]/90 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-20 sm:py-24 lg:py-32"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FF7A00]/10 to-[#4DBFF0]/10 rounded-full">
            <span className="text-sm sm:text-base font-bold text-[#0A1D37]">
                خدمات حرفه‌ای ارزی
            </span>
          </div>

          <h1
            className={`text-xl   lg:text-4xl  font-bold text-[#0A1D37] mb-4 sm:mb-6 leading-tight ${estedadBold.className}`}
          >
            خدمات ارزی پلاس
          </h1>
          <p className="text-xs  lg:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            مجموعه کاملی از خدمات ارزی و مالی برای تسهیل امور بین‌المللی شما
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-8 sm:mt-10 lg:mt-12 px-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="جستجو در خدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 sm:px-6 py-3 sm:py-4 lg:py-5 pr-12 sm:pr-14 bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl sm:rounded-3xl text-[#0A1D37] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
              />
              <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                <FaSearch className="text-base sm:text-lg text-gray-400 group-focus-within:text-[#FF7A00] transition-colors duration-300" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FF7A00] transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Count */}
            {searchTerm && !isLoading && (
              <div className="mt-4 text-sm sm:text-base text-gray-600">
                {filteredServices.length > 0 ? (
                  <span>{filteredServices.length} خدمت یافت شد</span>
                ) : (
                  <span className="text-red-500">هیچ نتیجه‌ای یافت نشد</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-2xl animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="animate-spin text-2xl sm:text-3xl text-white" />
              </div>
            </div>
            <span className="text-base sm:text-lg font-medium text-gray-700">
              در حال بارگذاری خدمات...
            </span>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              لطفاً صبر کنید
            </p>
          </div>
        )}

        {/* Services by Category */}
        {!isLoading && Object.keys(servicesByCategory).length > 0 && (
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
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
          <div className="text-center py-16 sm:py-20 lg:py-24 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl">🔍</div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1D37] mb-3 sm:mb-4">
              هیچ خدمتی یافت نشد
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6">
              {searchTerm
                ? "لطفاً کلمه کلیدی دیگری را امتحان کنید"
                : "در حال حاضر خدمتی در دسترس نیست"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#FF7A00]/90 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                پاک کردن جستجو
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
