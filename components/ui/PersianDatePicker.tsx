"use client";
import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

// Persian months
const PERSIAN_MONTHS = [
  { value: "01", label: "فروردین" },
  { value: "02", label: "اردیبهشت" },
  { value: "03", label: "خرداد" },
  { value: "04", label: "تیر" },
  { value: "05", label: "مرداد" },
  { value: "06", label: "شهریور" },
  { value: "07", label: "مهر" },
  { value: "08", label: "آبان" },
  { value: "09", label: "آذر" },
  { value: "10", label: "دی" },
  { value: "11", label: "بهمن" },
  { value: "12", label: "اسفند" },
];

// Generate years (current year to 100 years ago)
const generateYears = () => {
  const currentYear = 1403; // Current Persian year
  const years = [];
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i.toString());
  }
  return years;
};

// Generate days for a month
const generateDays = (month: string, year: string) => {
  const days = [];
  let maxDays = 31;
  
  if (month && year) {
    // Persian calendar rules
    if (["01", "02", "03", "04", "05", "06"].includes(month)) {
      maxDays = 31; // First 6 months have 31 days
    } else if (["07", "08", "09", "10", "11"].includes(month)) {
      maxDays = 30; // Next 5 months have 30 days
    } else if (month === "12") {
      // Esfand has 29 days normally, 30 in leap years
      const persianYear = parseInt(year);
      const isLeapYear = ((persianYear + 2346) % 2816) % 128 <= 29;
      maxDays = isLeapYear ? 30 : 29;
    }
  }
  
  for (let i = 1; i <= maxDays; i++) {
    days.push(i.toString().padStart(2, "0"));
  }
  return days;
};

interface PersianDatePickerProps {
  value?: {
    year: string;
    month: string;
    day: string;
  };
  onChange: (date: { year: string; month: string; day: string }) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value = { year: "", month: "", day: "" },
  onChange,
  placeholder = "تاریخ تولد",
  className = "",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const years = generateYears();
  const days = generateDays(tempDate.month, tempDate.year);

  const handleDateChange = (field: "year" | "month" | "day", newValue: string) => {
    const updatedDate = { ...tempDate, [field]: newValue };
    
    // Reset day if month/year changed and current day is invalid
    if (field === "month" || field === "year") {
      const validDays = generateDays(
        field === "month" ? newValue : updatedDate.month,
        field === "year" ? newValue : updatedDate.year
      );
      if (updatedDate.day && !validDays.includes(updatedDate.day)) {
        updatedDate.day = "";
      }
    }
    
    setTempDate(updatedDate);
    onChange(updatedDate);
  };

  const formatDisplayDate = () => {
    if (value.year && value.month && value.day) {
      const monthName = PERSIAN_MONTHS.find(m => m.value === value.month)?.label || "";
      return `${value.day} ${monthName} ${value.year}`;
    }
    return placeholder;
  };

  const isDateComplete = value.year && value.month && value.day;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all text-right flex items-center justify-between ${
          isDateComplete ? "text-gray-900" : "text-gray-500"
        }`}
      >
        <span>{formatDisplayDate()}</span>
        <FaCalendarAlt className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50 p-4">
          <div className="grid grid-cols-3 gap-3">
            {/* Year Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                سال
              </label>
              <select
                value={tempDate.year}
                onChange={(e) => handleDateChange("year", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] text-sm"
              >
                <option value="">سال</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ماه
              </label>
              <select
                value={tempDate.month}
                onChange={(e) => handleDateChange("month", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] text-sm"
              >
                <option value="">ماه</option>
                {PERSIAN_MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                روز
              </label>
              <select
                value={tempDate.day}
                onChange={(e) => handleDateChange("day", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] text-sm"
                disabled={!tempDate.month || !tempDate.year}
              >
                <option value="">روز</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setTempDate({ year: "", month: "", day: "" });
                onChange({ year: "", month: "", day: "" });
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              پاک کردن
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1 text-sm bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/90 transition-colors"
            >
              تایید
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default PersianDatePicker;