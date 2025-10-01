// src/components/Navigation.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl sm:text-3xl">♿</span>
            <span className="text-xl sm:text-2xl font-bold text-white">
              Access<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Lens</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/" className="text-black-200 hover:text-black font-medium transition text-sm lg:text-base">
              Home
            </Link>
            <Link href="/preview?story=blog-post-sample" className="text-black-200 hover:text-black font-medium transition text-sm lg:text-base">
              Try Demo
            </Link>
            <Link href="/docs" className="text-black-200 hover:text-black font-medium transition text-sm lg:text-base">
              Docs
            </Link>
            <Link
              href="/preview?story=landing-page"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-sky-600 transition shadow-lg"
            >
              Launch App →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-3 backdrop-blur-lg bg-white/10 p-4 rounded-xl">
            <Link href="/" className="text-black-200 hover:text-black font-medium py-2 transition" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/preview?story=home" className="text-black-200 hover:text-black font-medium py-2 transition" onClick={() => setMobileMenuOpen(false)}>
              Try Demo
            </Link>
            <Link href="/about" className="text-black-200 hover:text-black font-medium py-2 transition" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/docs" className="text-black-200 hover:text-black font-medium py-2 transition" onClick={() => setMobileMenuOpen(false)}>
              Docs
            </Link>
            <Link
              href="/preview?story=home"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-black rounded-lg font-semibold text-center hover:from-purple-600 hover:to-pink-600 transition shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Launch App →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}