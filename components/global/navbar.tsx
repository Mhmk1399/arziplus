"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { menuItems, IconComponent } from "@/lib/menuData";
import { DropdownItem } from "@/types/menu";
import { IconType } from "react-icons/lib";
import { MdClose, MdMenu } from "react-icons/md";
import { FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import Image from "next/image";
import { getCurrentUser, AuthUser } from "@/lib/auth";
import { usePathname } from "next/navigation";

export default function NewNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileActiveItem, setMobileActiveItem] = useState<string | null>(null);
  const [mobileActiveSubItem, setMobileActiveSubItem] = useState<string | null>(
    null
  );
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMouseOverMenu = useRef(false);
  const previousDropdown = useRef<string | null>(null);

  console.log(isScrolled);
  // Hydration fix and user authentication
  useEffect(() => {
    setIsMounted(true);

    const fetchFullUser = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setUser(null);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ ...currentUser, ...data.user });
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.log("Error fetching user:", error);
        setUser(currentUser);
      }
    };

    fetchFullUser();

    // Listen for login events to refresh user state
    const handleUserLogin = () => {
      fetchFullUser();
    };

    window.addEventListener("userLoggedIn", handleUserLogin);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLogin);
    };
  }, []);

  console.log(user, "]]]]]]]]]]]]]]]]]]]");

  // Scroll handler
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);

      if (navRef.current) {
        if (scrolled) {
          gsap.to(navRef.current, {
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(navRef.current, {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // Logo animation
  useEffect(() => {
    if (!isMounted || !logoRef.current) return;

    const logo = logoRef.current;

    const handleMouseEnter = () => {
      gsap.to(logo, {
        scale: 1.1,
        duration: 0.4,
        ease: "back.out(2)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logo, {
        scale: 1,
        duration: 0.4,
        ease: "back.out(2)",
      });
    };

    logo.addEventListener("mouseenter", handleMouseEnter);
    logo.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      logo.removeEventListener("mouseenter", handleMouseEnter);
      logo.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMounted]);

  // Mobile menu animation
  useEffect(() => {
    if (!isMounted || !mobileMenuRef.current) return;

    if (isMobileOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
      );

      const items = mobileMenuRef.current.querySelectorAll(".mobile-menu-item");
      gsap.fromTo(
        items,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          delay: 0.2,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [isMobileOpen, isMounted]);

  // Mega menu animation - only on initial open
  useEffect(() => {
    if (!isMounted || !megaMenuRef.current) return;

    if (activeDropdown && previousDropdown.current === null) {
      // Only animate when opening for the first time
      const megaMenu = megaMenuRef.current;

      gsap.fromTo(
        megaMenu,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }

    // Update previous dropdown
    previousDropdown.current = activeDropdown;

    // Reset when closing
    if (!activeDropdown) {
      previousDropdown.current = null;
    }
  }, [activeDropdown, isMounted]);

  // Cleanup timeout on unmount and click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserDropdown &&
        !(event.target as Element).closest(".user-dropdown")
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [showUserDropdown]);

  // Improved hover handlers - Smooth switching between menus
  const handleMenuEnter = (title: string) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    isMouseOverMenu.current = true;

    // Just update the active dropdown without closing
    setActiveDropdown(title);
  };

  const handleMenuLeave = () => {
    isMouseOverMenu.current = false;

    // Set timeout to close menu
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      if (!isMouseOverMenu.current) {
        setActiveDropdown(null);
      }
    }, 300);
  };

  const handleMegaMenuMouseEnter = () => {
    // Cancel closing when entering mega menu
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    isMouseOverMenu.current = true;
  };

  const handleMegaMenuMouseLeave = () => {
    isMouseOverMenu.current = false;

    // Close menu after delay
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
    if (isMobileOpen) {
      setMobileActiveItem(null);
      setMobileActiveSubItem(null);
    }
  };

  const handleMobileItemClick = (title: string) => {
    const newState = mobileActiveItem === title ? null : title;
    setMobileActiveItem(newState);
    setMobileActiveSubItem(null);
  };

  const handleMobileSubItemClick = (name: string) => {
    setMobileActiveSubItem(mobileActiveSubItem === name ? null : name);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setShowUserDropdown(false);
    window.location.href = "/";
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    return "کاربر";
  };

  console.log(getCurrentUser, "........................");
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
    return null;
  }

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Image
                src="/assets/images/logoArzi.webp"
                width={90}
                height={90}
                alt="logo"
                priority
              />
            </div>
            <div className="hidden lg:flex items-center space-x-6 space-x-reverse">
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  className="px-4 py-2 font-medium text-sm text-[#0A1D37]"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-500 border-b border-white/10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
        dir="rtl"
        suppressHydrationWarning
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/">
              {" "}
              <div ref={logoRef} className="flex items-center cursor-pointer">
                <Image
                  src="/assets/images/loggo.png"
                  width={70}
                  height={70}
                  alt="logo"
                  priority
                  className="transition-all duration-300"
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1 space-x-reverse">
              {menuItems.map((item, index) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    menuItemRefs.current[index] = el;
                  }}
                  className="relative group"
                  onMouseEnter={() => handleMenuEnter(item.title)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button
                    className={`relative px-5 py-3 font-semibold cursor-pointer text-sm transition-all duration-300 rounded-xl ${
                      activeDropdown === item.title
                        ? "text-[#0A1D37]  "
                        : "text-[#0A1D37] hover:text-[#0A1D37]"
                    }`}
                  >
                    {item.title}
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="tel:09991202049">
                {" "}
                <button
                  className="group p-3 rounded-xl cursor-pointer bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 hover:from-[#0A1D37]/20 hover:to-[#4DBFF0]/20 backdrop-blur-sm transition-all duration-300 border border-[#0A1D37]/20 hover:border-[#0A1D37]/40 hover:scale-105"
                  suppressHydrationWarning
                >
                  <svg
                    className="w-5 h-5 text-[#0A1D37] group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>
              </Link>

              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="group relative cursor-pointer px-4 py-3 font-bold text-sm text-[#0A1D37] overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 hover:from-[#0A1D37]/20 hover:to-[#4DBFF0]/20 border border-[#0A1D37]/20 hover:border-[#0A1D37]/40 flex items-center gap-2"
                    suppressHydrationWarning
                  >
                    {user?.profile?.avatar ? (
                      <img
                        src={user.profile.avatar}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full object-cover border-2 border-[#4DBFF0]"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          const fallback =
                            img.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {!user?.profile?.avatar && (
                      <FaUser className="text-[#0A1D37]" />
                    )}
                    <span className="relative z-10">
                      {getUserDisplayName()}
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#0A1D37] transition-transform duration-200 ${
                        showUserDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showUserDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white/80 backdrop-blur-xl border border-[#0A1D37]/20 rounded-xl shadow-2xl shadow-[#0A1D37]/10 overflow-hidden z-50">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[#0A1D37] hover:bg-gradient-to-r hover:from-[#0A1D37]/5 hover:to-[#4DBFF0]/5 transition-all duration-200"
                      >
                        <FaTachometerAlt className="text-[#4DBFF0]" />
                        <span>داشبورد</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        <FaSignOutAlt className="text-red-500" />
                        <span>خروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/sms"
                  className="group relative px-6 py-3 font-bold text-sm text-white overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#0A1D37]/20"
                  suppressHydrationWarning
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0]" />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">ورود / ثبت نام</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 border border-[#0A1D37]/20"
              suppressHydrationWarning
            >
              {isMobileOpen ? (
                <MdClose className="text-2xl text-[#0A1D37]" />
              ) : (
                <MdMenu className="text-2xl text-[#0A1D37]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mega Menu Dropdown */}
      {activeDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setActiveDropdown(null);
              isMouseOverMenu.current = false;
            }}
          />

          {/* Bridge div to prevent gap issues */}
          <div
            className="fixed left-0 right-0 z-50 h-2"
            style={{ top: "96px" }}
            onMouseEnter={handleMegaMenuMouseEnter}
            onMouseLeave={handleMegaMenuMouseLeave}
          />

          {/* Mega Menu Container */}
          <div
            ref={megaMenuRef}
            className="fixed left-1/2 transform -translate-x-1/2 z-50 w-[95vw] max-w-7xl transition-opacity duration-200"
            style={{ top: "100px" }}
            onMouseEnter={handleMegaMenuMouseEnter}
            onMouseLeave={handleMegaMenuMouseLeave}
            dir="rtl"
            suppressHydrationWarning
          >
            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl shadow-[#0A1D37]/10 overflow-hidden">
              {/* Header */}
              <div className="relative px-8 py-6 bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-[#0A1D37]">
                      {activeDropdown}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      انتخاب کنید از میان خدمات زیر
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Grid Layout */}
              <div className="p-8">
                <div
                  className="grid gap-8"
                  style={{
                    gridTemplateColumns: `repeat(${
                      menuItems.find((item) => item.title === activeDropdown)
                        ?.childrens.dropdowns.length || 1
                    }, minmax(0, 1fr))`,
                  }}
                  suppressHydrationWarning
                >
                  {menuItems
                    .find((item) => item.title === activeDropdown)
                    ?.childrens.dropdowns.map(
                      (dropdown: DropdownItem, dropdownIndex) => (
                        <div
                          key={dropdown.name}
                          className="dropdown-column space-y-4 relative"
                        >
                          {/* Divider line between columns */}
                          {dropdownIndex !== 0 && (
                            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                          )}

                          {/* Category Header */}
                          <div className="flex items-center gap-1 pb-4 border-b-2 border-gradient-to-r from-[#0A1D37] to-[#4DBFF0]">
                            {dropdown.icon && (
                              <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-[#0A1D37]/10 to-[#4DBFF0]/10">
                                <IconComponent
                                  icon={dropdown.icon as IconType}
                                  className="text-xl text-[#0A1D37]"
                                />
                              </div>
                            )}
                            <h3 className="text-[#0A1D37] font-bold text-base">
                              {dropdown.name}
                            </h3>
                          </div>

                          {/* Sub Menu Items - No animations */}
                          <div className="space-y-2">
                            {dropdown.childrens.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="dropdown-item group flex items-center space-x-3 space-x-reverse p-3 text-gray-700 hover:text-[#0A1D37] text-sm rounded-xl hover:bg-gradient-to-r hover:from-[#0A1D37]/5 hover:to-[#4DBFF0]/5 transition-all duration-300 border border-transparent hover:border-[#0A1D37]/20 hover:shadow-md"
                                onClick={() => {
                                  setActiveDropdown(null);
                                  isMouseOverMenu.current = false;
                                }}
                              >
                                {subItem.icon && (
                                  <IconComponent
                                    icon={subItem.icon as IconType}
                                    className="flex-shrink-0 text-base text-[#4DBFF0] group-hover:text-[#0A1D37] group-hover:scale-110 transition-all duration-300"
                                  />
                                )}
                                <span className="flex-1 font-medium group-hover:translate-x-1 transition-transform duration-300">
                                  {subItem.name}
                                </span>
                                <svg
                                  className="w-4 h-4 text-gray-300 group-hover:text-[#0A1D37] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
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
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-999 lg:hidden ${
          isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        dir="rtl"
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-[#0A1D37]/20 to-[#0A1D37]/40 backdrop-blur-md transition-opacity duration-500 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMobileMenu}
        />

        {/* Sidebar */}
        <div
          ref={mobileMenuRef}
          className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl"
          style={{ transform: "translateX(100%)" }}
          suppressHydrationWarning
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Link href="/">
                  {" "}
                  <Image
                    src="/assets/images/loggo.png"
                    width={50}
                    height={50}
                    alt="logo"
                  />
                </Link>

                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-xl bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 hover:scale-110 transition-transform duration-300"
                >
                  <MdClose className="text-2xl text-[#0A1D37]" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 ">
              {menuItems.map((item) => (
                <div key={item.title} className="mobile-menu-item space-y-2">
                  <button
                    onClick={() => handleMobileItemClick(item.title)}
                    className={`w-full flex items-center justify-between p-4 text-sm font-bold rounded-xl transition-all duration-300 ${
                      mobileActiveItem === item.title
                        ? "bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white shadow-lg"
                        : "bg-gray-50 text-[#0A1D37] hover:bg-gray-100"
                    }`}
                  >
                    <span>{item.title}</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        mobileActiveItem === item.title ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Mobile Dropdown Items */}
                  {mobileActiveItem === item.title && (
                    <div
                      className="space-y-2 pr-4"
                      data-mobile-item={item.title}
                    >
                      {item.childrens.dropdowns.map(
                        (dropdown: DropdownItem) => (
                          <div key={dropdown.name} className="space-y-2">
                            <button
                              onClick={() =>
                                handleMobileSubItemClick(dropdown.name)
                              }
                              className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
                            >
                              <div className="flex items-center gap-1">
                                {dropdown.icon && (
                                  <IconComponent
                                    icon={dropdown.icon as IconType}
                                    className="text-base mr-1 text-[#0A1D37]"
                                  />
                                )}
                                <span className="text-xs font-semibold text-[#0A1D37]">
                                  {dropdown.name}
                                </span>
                              </div>
                              <svg
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                  mobileActiveSubItem === dropdown.name
                                    ? "rotate-180"
                                    : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            {/* Mobile Sub Items */}
                            {mobileActiveSubItem === dropdown.name && (
                              <div className="space-y-1 pr-4">
                                {dropdown.childrens.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    onClick={toggleMobileMenu}
                                    className="flex items-center gap-1 p-3 bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5 hover:from-[#0A1D37]/10 hover:to-[#4DBFF0]/10 text-gray-700 hover:text-[#0A1D37] text-sm rounded-lg transition-all duration-200"
                                  >
                                    {subItem.icon && (
                                      <IconComponent
                                        icon={subItem.icon as IconType}
                                        className="text-sm ml-1 text-[#4DBFF0]"
                                      />
                                    )}
                                    <span className="font-medium text-[10px]">
                                      {subItem.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Footer */}
            <div className="p-6 border-t border-gray-200 space-y-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-xl">
                    {user?.profile?.avatar ? (
                      <img
                        src={user.profile.avatar}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full object-cover border-2 border-[#4DBFF0]"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          const fallback =
                            img.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {!user?.profile?.avatar && (
                      <FaUser className="text-[#0A1D37]" />
                    )}
                    <span className="font-bold text-[#0A1D37]">
                      {getUserDisplayName()}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={toggleMobileMenu}
                    className="group relative w-full flex items-center justify-center gap-2 p-4 font-bold text-white overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37]" />
                    <span className="relative z-10 flex items-center gap-2">
                      <FaTachometerAlt />
                      داشبورد
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-4 font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300"
                  >
                    <FaSignOutAlt />
                    خروج
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/sms"
                  onClick={toggleMobileMenu}
                  className="group relative w-full flex items-center justify-center p-4 font-bold text-white overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0]" />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">ورود / ثبت نام</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
