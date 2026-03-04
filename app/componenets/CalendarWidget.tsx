"use client";

import { useMemo } from "react";

export default function CalendarWidget() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthName = today.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const calendarDays = useMemo(() => {
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...blanks, ...days];
  }, [firstDayOfMonth, daysInMonth]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-sm">
      
      {/* Header */}
      <h3 className="font-semibold text-gray-800 mb-4">
        {monthName} {year}
      </h3>

      {/* Week Names */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-3">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 text-center text-sm gap-y-3">
        {calendarDays.map((day, index) => {
          const isToday = day === today.getDate();

          return (
            <div
              key={index}
              className={`
                h-9 w-9 flex items-center justify-center mx-auto rounded-full
                ${day ? "text-gray-700" : ""}
                ${isToday ? "bg-green-500 text-white font-semibold" : ""}
              `}
            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}