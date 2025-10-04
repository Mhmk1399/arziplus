"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { menuItems, IconComponent } from "@/lib/menuData";
import { MenuItem, DropdownItem } from "@/types/menu";
import { MdClose, MdMenu } from "react-icons/md";
import Image from "next/image";

export default function NewNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(
    null
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileActiveItem, setMobileActiveItem] = useState<string | null>(null);
  const [mobileActiveSubItem, setMobileActiveSubItem] = useState<string | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll handler
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // Initial navbar animation
  useEffect(() => {
    if (!isMounted || !navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, [isMounted]);

  // Logo animation
  useEffect(() => {
    if (!isMounted || !logoRef.current) return;

    gsap.to(logoRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });
  }, [isMounted]);

  // Mobile menu animation
  useEffect(() => {
    if (!isMounted || !mobileMenuRef.current) return;

    if (isMobileOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isMobileOpen, isMounted]);

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(title);
    setActiveSubDropdown("all");
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    }, 200);
  };

  const handleMegaMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveSubDropdown("all");
  };

  const handleMegaMenuMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    }, 200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
    if (isMobileOpen) {
      setMobileActiveItem(null);
      setMobileActiveSubItem(null);
    }
  };

  const handleMobileItemClick = (title: string) => {
    setMobileActiveItem(mobileActiveItem === title ? null : title);
    setMobileActiveSubItem(null);
  };

  const handleMobileSubItemClick = (name: string) => {
    setMobileActiveSubItem(mobileActiveSubItem === name ? null : name);
  };

  // Prevent hydration mismatch by showing a simple navbar until client hydrates
  if (!isMounted) {
    return (
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Image
                src="/assets/images/logoArzi.webp"
                width={90}
                height={90}
                alt="logo"
              />
            </div>
            <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  className="px-4 py-2 font-medium text-sm text-[#0A1D37] rounded-lg"
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center space-x-3 space-x-reverse">
              <button className="p-2 rounded-xl text-gray-700">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
            </div>
            <button className="lg:hidden p-2 rounded-xl text-gray-700">
              <MdMenu className="text-2xl" />
            </button>
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
        className="fixed top-0 left-0 right-0 z-50   backdrop-blur-md transition-all duration-500"
        dir="rtl"
        suppressHydrationWarning
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <Image
                src={"/assets/images/logoArzi.webp"}
                width={90}
                height={90}
                alt={"logo"}
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="px-4 py-2 font-medium text-sm text-[#0A1D37] hover:text-blue-600 transition-all duration-300 rounded-lg ">
                    {item.title}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5  bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></div>
                  </button>

                  {/* Mega Menu Dropdown - Centered */}
                  {activeDropdown === item.title && (
                    <>
                      {/* Enhanced Backdrop with blur */}
                      <div
                        className="fixed inset-0 z-40 backdrop-blur-sm"
                        onClick={() => setActiveDropdown(null)}
                      />

                      <div
                        className="fixed left-1/2 transform -translate-x-1/2 top-24 w-[95vw] max-w-7xl bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-6 animate-in fade-in-0 zoom-in-95 duration-300 z-50"
                        onMouseEnter={handleMegaMenuMouseEnter}
                        onMouseLeave={handleMegaMenuMouseLeave}
                        suppressHydrationWarning
                      >
                        {/* Header */}
                        <div className="text-center mb-8">
                          <h2 className="text-xl font-bold text-[#0A1D37] mb-1">
                            {item.title}
                          </h2>
                          <div className="w-16 h-0.5 mt-3 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] mx-auto rounded-full"></div>
                        </div>

                        {/* Dynamic Grid Layout based on dropdown count */}
                        <div
                          className="grid gap-6"
                          style={{
                            gridTemplateColumns: `repeat(${item.childrens.dropdowns.length}, minmax(0, 1fr))`,
                          }}
                          suppressHydrationWarning
                        >
                          {item.childrens.dropdowns.map((dropdown: DropdownItem) => (
                            <div
                              key={dropdown.name}
                              className="space-y-3 min-w-0 border-r border-gray-200"
                            >
                              {/* Category Header - More compact */}
                              <div className="flex items-center space-x-2 space-x-reverse pb-2 border-b border-gray-200/50">
                                <div className="flex-shrink-0 p-1.5 rounded-lg">
                                  <IconComponent
                                    icon={dropdown.icon}
                                    className="text-base text-[#FF7A00]"
                                  />
                                </div>
                                <h3 className="text-[#0A1D37] font-semibold text-sm truncate">
                                  {dropdown.name}
                                </h3>
                              </div>

                              {/* Sub Menu Items */}
                              <div className="space-y-1">
                                {dropdown.childrens.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className="flex items-center space-x-2 space-x-reverse p-2 text-gray-600 hover:text-[#0A1D37] text-xs rounded-lg hover:bg-blue-400/40 transition-all duration-200 group/item border border-transparent hover:border-gray-200/30 hover:shadow-sm"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <IconComponent
                                      icon={subItem.icon}
                                      className="flex-shrink-0 text-xs text-[#4DBFF0] group-hover/item:text-blue-600 transition-colors duration-200"
                                    />
                                    <span className="flex-1 truncate leading-tight">
                                      {subItem.name}
                                    </span>
                                    <svg
                                      className="w-3 h-3 text-gray-300 group-hover/item:text-gray-500 opacity-0 group-hover/item:opacity-100 transition-all duration-200 flex-shrink-0"
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
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-3 space-x-reverse">
              <button
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 text-[#FF7A00] hover:text-blue-600"
                suppressHydrationWarning
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>

              <Link
                href="/auth/login"
                className="px-6 py-2 font-medium text-sm text-[#0A1D37] hover:text-blue-600 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-[#FF7A00] rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                suppressHydrationWarning
              >
                ورود / ثبت نام
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 text-gray-700 hover:text-[#0A1D37]"
              suppressHydrationWarning
            >
              {isMobileOpen ? (
                <MdClose className="text-2xl" />
              ) : (
                <MdMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        dir="rtl"
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMobileMenu}
        ></div>

        {/* Sidebar */}
        <div
          ref={mobileMenuRef}
          className="absolute right-0 top-0 h-full w-90 bg-white/10 backdrop-blur-2xl border-l border-white/20 shadow-2xl"
          style={{ transform: "translateX(100%)" }}
          suppressHydrationWarning
        >
          <div className="p-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-16"></div>

            {/* Mobile Menu Items */}
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {menuItems.map((item) => (
                <div key={item.title} className="space-y-2">
                  <button
                    onClick={() => handleMobileItemClick(item.title)}
                    className={`w-full flex items-center   bg-[#0A1D37]/20 justify-between p-4 text-white/90 hover:text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300`}
                  >
                    <span>{item.title}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
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
                      className={`space-y-1 p-3 ${
                        mobileActiveItem ? "" : " bg-[#4DBFF0]/20"
                      } animate-in fade-in-0 slide-in-from-top-2 duration-200`}
                    >
                      {item.childrens.dropdowns.map((dropdown: DropdownItem) => (
                        <div key={dropdown.name} className="space-y-1">
                          {/* Render button with sub-items */}
                          <button
                            onClick={() =>
                              handleMobileSubItemClick(dropdown.name)
                            }
                            className="w-full flex items-center p-3 bg-white/10  justify-between  text-white/80 hover:text-white text-sm rounded-lg hover:bg-white/5 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <IconComponent
                                icon={dropdown.icon}
                                className="text-sm text-blue-300 "
                              />
                              <span className="mr-2">{dropdown.name}</span>
                            </div>
                            <svg
                              className={`w-3 h-3 transition-transform duration-200 ${
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
                            <div className="space-y-1 p-2 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                              {dropdown.childrens.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={toggleMobileMenu}
                                  className="flex items-center p-3 bg-[#0A1D37]/20 space-x-2 space-x-reverse  text-white hover:text-white text-xs rounded-lg hover:bg-white/5 transition-all duration-200"
                                >
                                  <IconComponent
                                    icon={subItem.icon}
                                    className="text-xs text-blue-300"
                                  />
                                  <span className="mr-2">
                                    {subItem.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Footer */}
            <div className="absolute bottom-6 left-6 right-6">
              <Link
                href="/auth/login"
                onClick={toggleMobileMenu}
                className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-[#4DBFF0]/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:from-[#4DBFF0]/30 hover:to-purple-500/30 transition-all duration-300"
              >
                ورود / ثبت نام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
