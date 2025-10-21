"use client";
import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

// Persian months
const PERSIAN_MONTHS = [
  { value: "08", label: "آبان" },
  { value: "09", label: "آذر" },
];

// Generate days for a month
const generateDays = (month: string) => {
  const days = [];
  let maxDays = 31;

  if (month) {
    if (["01", "02", "03", "04", "05", "06"].includes(month)) {
      maxDays = 31;
    } else if (["07", "08", "09", "10", "11"].includes(month)) {
      maxDays = 30;
    } else if (month === "12") {
      maxDays = 29; // Esfand in 1404
    }
  }

  for (let i = 1; i <= maxDays; i++) {
    days.push(i.toString().padStart(2, "0"));
  }
  return days;
};

// Check if date is valid (from today to 9 Azar 1404)
const isDateValid = (month: string, day: string): boolean => {
  if (!month || !day) return false;

  const selectedMonth = parseInt(month);
  const selectedDay = parseInt(day);

  // Allow months 7, 8, 9 (Mehr, Aban, Azar) and up to day 9 in Azar
  if (selectedMonth < 7 || selectedMonth > 9) return false;
  if (selectedMonth === 9 && selectedDay > 9) return false;

  return true;
};

interface PersianDatePickerPresentProps {
  value?: {
    month: string;
    day: string;
  };
  onChange: (date: { month: string; day: string }) => void;
  placeholder?: string;
  className?: string;
}

const PersianDatePickerPresent: React.FC<PersianDatePickerPresentProps> = ({
  value = { month: "", day: "" },
  onChange,
  placeholder = "تاریخ انتخاب کنید",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const days = generateDays(tempDate.month);

  const handleDateChange = (field: "month" | "day", newValue: string) => {
    const updatedDate = { ...tempDate, [field]: newValue };

    if (field === "month") {
      const validDays = generateDays(newValue);
      if (updatedDate.day && !validDays.includes(updatedDate.day)) {
        updatedDate.day = "";
      }
    }

    setTempDate(updatedDate);
    onChange(updatedDate);
  };

  const formatDisplayDate = () => {
    if (value.month && value.day) {
      const monthName =
        PERSIAN_MONTHS.find((m) => m.value === value.month)?.label || "";
      return `${value.day} ${monthName} ۱۴۰۴`;
    }
    return placeholder;
  };

  const isDateComplete = value.month && value.day;
  const isCurrentDateValid = isDateValid(value.month, value.day);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-all text-right flex items-center justify-between ${
          isDateComplete && isCurrentDateValid
            ? "text-gray-900"
            : "text-gray-500"
        } ${!isCurrentDateValid && isDateComplete ? "border-red-500" : ""}`}
      >
        <span>{formatDisplayDate()}</span>
        <FaCalendarAlt className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50 p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Month Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ماه
              </label>
              <select
                value={tempDate.month}
                onChange={(e) => handleDateChange("month", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
              >
                <option value="">ماه</option>
                {PERSIAN_MONTHS.slice(0, 9).map((month) => (
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
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                disabled={!tempDate.month}
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
                setTempDate({ month: "", day: "" });
                onChange({ month: "", day: "" });
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              پاک کردن
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1 text-sm bg-[#0A1D37] text-white rounded-lg hover:bg-[#0A1D37]/90 transition-colors"
            >
              تایید
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default PersianDatePickerPresent;
