'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-[#0D1B2A] border-b border-[#1E3A5F]">
      {/* Left: Logo */}
      <Link
        href="/"
        className="font-bold text-lg text-green-400 hover:opacity-90 transition z-10"
      >
        🛢️ FUELSMART
      </Link>

      {/* Right: User Icon with Hover Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="flex items-center hover:text-green-400 transition">
          <User className="w-6 h-6 text-white" />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
            <Link
              href="/login"
              className="block px-4 py-2 hover:bg-green-100 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block px-4 py-2 hover:bg-green-100 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
