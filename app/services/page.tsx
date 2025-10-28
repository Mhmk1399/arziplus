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

  return (
    <div className="group relative overflow-hidden w-[230px] h-[280px] md:h-[280px] rounded-2xl sm:rounded-3xl hover:scale-95 hover:shadow-sm transition-all duration-500 border border-[#0A1D37]/20">
      {/* Service Image */}
      <div className="relative h-36 lg:h-40 w-full overflow-hidden">
        {!imageError && service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-contain transition-transform duration-500 hover:scale-95 "
            unoptimized={true}
            onError={() => setImageError(true)}
          />
        ) : service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="w-1/2 h-1/2 object-cover transition-transform duration-500  hover:scale-95"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        ) : (
          <Image
            src="/assets/images/logoArzi.webp"
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500  hover:scale-95"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {!service.image && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A1D37]/20 to-[#4DBFF0]/20">
            <div className="text-4xl sm:text-5xl lg:text-6xl text-[#0A1D37]/10 font-bold">
              {service.title.charAt(0)}
            </div>
          </div>
        )}

        {service.wallet && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg">
            <FaCheckCircle className="text-xs" />
            <span>پرداخت کیف پول</span>
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3
          className={`text-[#0A1D37] font-bold text-center text-sm lg:text-base leading-relaxed ${estedadBold.className}`}
        >
          {service.title}
        </h3>
      </div>

      <div className="p-4 lg:p-5">
        <Link href={`/services/${service.slug}`}>
          <button className="w-full flex items-center cursor-pointer shadow-[10px_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.3)] justify-center gap-2 bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/90 hover:from-[#0A1D37]/90 hover:to-[#0A1D37] text-white font-bold py-3 lg:py-3 px-4 sm:px-5 lg:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 active:scale-95">
            <span className="text-sm sm:text-sm">ثبت درخواست</span>
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

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions (RTL: right arrow scrolls right, left arrow scrolls left)
  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  // Initialize scroll position check
  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [services.length]);

  return (
    <section className="mb-8 sm:mb-12 lg:mb-16 mx-2 lg:mx-0">
      {/* Category Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10 px-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2
              className={`text-xl  lg:text-2xl font-bold text-[#0A1D37] mb-2 sm:mb-3 ${estedadBold.className}`}
            >
              {category}
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] rounded-full" />
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 px-3 sm:px-4 py-2 rounded-xl">
            <span className="text-xs sm:text-sm font-bold text-[#0A1D37]">
              {services.length} خدمت
            </span>
          </div>
        </div>
      </div>

      {/* Services Horizontal Scroll Container */}
      <div className="relative group">
        {/* Right Arrow (scrolls to right/start in RTL) */}
        {services.length > 4 && canScrollRight && (
          <button
            onClick={scrollToRight}
            aria-label="اسکرول به راست"
            className="hidden lg:flex absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
          >
            <FaArrowRight className="text-[#0A1D37] text-lg" />
          </button>
        )}

        {/* Left Arrow (scrolls to left/end in RTL) */}
        {services.length > 4 && canScrollLeft && (
          <button
            onClick={scrollToLeft}
            aria-label="اسکرول به چپ"
            className="hidden lg:flex absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
          >
            <FaArrowLeft className="text-[#0A1D37] text-lg" />
          </button>
        )}

        {/* Scrollable Services Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          onScroll={checkScrollPosition}
        >
          {services.map((service) => (
            <div
              key={service._id}
              className="flex-shrink-0 w-[220px] sm:w-[300px] lg:w-[calc(25%-70px)] snap-start"
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Categories array for filtering
  const categories = [
    "وریفای حساب های خارجی",
    "ثبت نام سایت های فریلنسری",
    "سیم کارت های فیزیکی",
    "هاستینگ و دامنه",
    "پرداخت‌های دانشجویی",
    "سفارت / ویزا / هتل",
    "آزمون بین‌المللی",
    "اکانت هوش مصنوعی",
    "خدمات حساب وایز",
    "خدمات پی پال",
  ];

  // Fetch services using SWR
  const {
    data: services,
    error,
    isLoading,
  } = useSWR<Service[]>("/api/dynamicServices?status=active", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: false,
  });

  // Filter services based on search and category
  const filteredServices =
    services?.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory
        ? service.category === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    }) || [];

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
            className="px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/90 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white   py-8" dir="rtl">
      <div className="max-w-7xl mx-auto   sm:px-2 lg:px-4">
        {/* Header */}  
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-full">
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
                className="w-full px-5 sm:px-6 py-3 sm:py-4 lg:py-5 pr-12 sm:pr-14 bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl sm:rounded-3xl text-[#0A1D37] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A1D37]/30 focus:border-[#0A1D37] transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
              />
              <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                <FaSearch className="text-base sm:text-lg text-gray-400 group-focus-within:text-[#0A1D37] transition-colors duration-300" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0A1D37] transition-colors duration-200"
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

        {/* Category Filter Bar - Horizontal Scrollable */}
        {!isLoading && services && services.length > 0 && (
          <div className="mb-8 sm:mb-12 lg:mb-16 px-4">
            {/* Header with Clear Filter */}
            <div className="flex py-2 items-center justify-between mb-4 sm:mb-6">
              <h3
                className={`text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1D37] ${estedadBold.className}`}
              >
                دسته‌بندی خدمات
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <span>پاک کردن فیلتر</span>
                  <svg
                    className="w-4 h-4"
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

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  selectedCategory === null
                    ? "bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/90 text-white shadow-md"
                    : "bg-white hover:bg-gray-50 text-[#0A1D37] border border-gray-200 hover:border-[#0A1D37]/30"
                }`}
              >
                همه ({services?.length || 0})
              </button>

              {categories.map((category) => {
                const categoryCount =
                  services?.filter((service) => service.category === category)
                    .length || 0;
                if (categoryCount === 0) return null;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 rounded-xl font-medium text-xs transition-all ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/90 text-white shadow-md"
                        : "bg-white hover:bg-gray-50 text-[#0A1D37] border border-gray-200 hover:border-[#0A1D37]/30"
                    }`}
                  >
                    {category} ({categoryCount})
                  </button>
                );
              })}
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex-shrink-0 snap-start px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/90 text-white shadow-md"
                      : "bg-white text-[#0A1D37] border border-gray-200"
                  }`}
                >
                  همه ({services?.length || 0})
                </button>

                {categories.map((category) => {
                  const categoryCount =
                    services?.filter((service) => service.category === category)
                      .length || 0;
                  if (categoryCount === 0) return null;

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex-shrink-0 snap-start px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/90 text-white shadow-md"
                          : "bg-white text-[#0A1D37] border border-gray-200"
                      }`}
                    >
                      {category} ({categoryCount})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filter Display */}
            {selectedCategory && (
              <div className="mt-4 sm:mt-6 flex items-center gap-2 text-sm sm:text-base text-gray-600">
                <span>در حال نمایش:</span>
                <span className="font-bold text-[#0A1D37]">
                  {selectedCategory}
                </span>
                <span>({filteredServices.length} خدمت)</span>
              </div>
            )}

            {/* Custom Scrollbar Hide Styles */}
            <style jsx>{`
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-2xl animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="animate-spin text-2xl sm:text-3xl text-white" />
              </div>
            </div>
            <span className="text-base sm:text-lg font-medium text-gray-700">
              در حال بارگذاری خدمات
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
                className="px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/90 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
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
