'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#0D1B2A]  border-b border-[#1E3A5F]">
      <div className="font-bold text-lg text-green-400">🛢️ FUELSMART</div>
      <ul className="flex space-x-6 text-sm font-medium text-white">
        <li>
          <Link href="/" className="hover:text-green-400 transition">Home</Link>
        </li>
        <li>
          <Link href="/stations" className="hover:text-green-400 transition">Stations</Link>
        </li>
        <li>
          <Link href="/report" className="hover:text-green-400 transition">Report</Link>
        </li>
        <li>
          <Link href="/compare" className="hover:text-green-400 transition">Compare</Link>
        </li>
      </ul>
    </nav>
  );
}
