'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-sage-100'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Home">
          <Image
            src="/logo.png"
            alt="Rebalance Reflexology"
            width={160}
            height={48}
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#about"
            className="font-body text-sm text-brand-800 hover:text-brand-600 transition-colors tracking-wide"
          >
            About
          </a>
          <a
            href="#services"
            className="font-body text-sm text-brand-800 hover:text-brand-600 transition-colors tracking-wide"
          >
            Services
          </a>
          <a
            href="#contact"
            className="font-body text-sm text-brand-800 hover:text-brand-600 transition-colors tracking-wide"
          >
            Contact
          </a>
          <Link href="/booking" className="btn-primary text-xs px-6 py-2.5">
            Book Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-brand-800"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M3 8h18M3 16h18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-sage-100 animate-fade-in">
          <div className="section-container py-6 flex flex-col gap-4">
            <a href="#about" onClick={() => setMobileOpen(false)} className="font-body text-brand-800 py-2">About</a>
            <a href="#services" onClick={() => setMobileOpen(false)} className="font-body text-brand-800 py-2">Services</a>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="font-body text-brand-800 py-2">Contact</a>
            <Link href="/booking" className="btn-primary text-center mt-2" onClick={() => setMobileOpen(false)}>
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
