'use client';

import Link from 'next/link';
import { User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-[#0D1B2A] border-b border-[#1E3A5F]">
      {/* Left: Logo */}
      <Link href="/" className="font-bold text-lg text-green-400 hover:opacity-90 transition z-10">
        🛢️ FUELSMART
      </Link>

      {/* Center: Navigation Links with spacing */}
      <ul className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8 text-sm font-medium text-white">
        <li>
          <Link href="/" className="hover:text-green-400 transition-colors">Home</Link>
        </li>
        <li>
          <Link href="/stations" className="hover:text-green-400 transition-colors">Stations</Link>
        </li>
        <li>
          <Link href="/Report" className="hover:text-green-400 transition-colors">Report</Link>
        </li>
        <li>
          <Link href="/compare" className="hover:text-green-400 transition-colors">Compare</Link>
        </li>
        <li>
          <Link href="/trends" className="hover:text-green-400 transition-colors">Trends</Link>
        </li>
      </ul>

      {/* Right Placeholder (can be a profile, login, etc.) */}
      <Link href="/profile" className="hover:text-green-400 transition">
  <User className="w-6 h-6 text-white" />
</Link>
    </nav>
  );
}
