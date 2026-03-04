"use client";

import Link from "next/link";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-sm" />
          <h1 className="text-lg font-semibold text-gray-800">
            Fund Collector
          </h1>
        </div>

        {/* Center - Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600"></nav>

        {/* Right - Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-800">
            <Bell size={18} />
          </button>
          <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-800">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
