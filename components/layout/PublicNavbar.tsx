'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, LogIn } from 'lucide-react';
import { CivoraLogo } from '@/components/brand/CivoraLogo';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform', href: '/platform' },
    { name: 'Capabilities', href: '/capabilities' },
    { name: 'Workflow', href: '/workflow' },
    { name: 'Governance', href: '/governance' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
        : 'bg-white border-b border-slate-100 py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo with official assets */}
        <div className="flex-shrink-0">
          <CivoraLogo
            size="md"
            showTagline={false}
            href="/"
            theme="light"
            priority={true}
          />
        </div>

        {/* Center Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-8 xl:gap-9"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-bold tracking-wider text-[#001237] hover:text-[#3B68DE] capitalize font-['Encode_Sans_Condensed',sans-serif] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4FAAA7] after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions matching the reference design */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4 flex-shrink-0">
          {/* Role Login Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[#001237] hover:text-[#3B68DE] hover:bg-slate-50 transition-colors uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]"
          >
            <LogIn className="w-3.5 h-3.5 text-[#3B68DE]" />
            <span>Sign In</span>
          </Link>

          {/* Reference-Styled Register on Platform Capsule Button */}
          <Link
            href="/register"
            className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full text-xs font-bold text-[#001237] bg-[#4FAAA7] hover:bg-[#439693] shadow-md shadow-[#4FAAA7]/20 transition-all uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif] group cursor-pointer"
          >
            <span>Register on Platform</span>
            <div className="w-7 h-7 rounded-full bg-[#001237] text-white flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-12">
              <ArrowUpRight className="w-3.5 h-3.5 font-bold" />
            </div>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#001237] hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-lg px-6 pt-4 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-bold text-[#001237] hover:bg-slate-50 hover:text-[#3B68DE] rounded-lg capitalize font-['Encode_Sans_Condensed',sans-serif] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-xs font-bold text-[#001237] border border-slate-300 rounded-full hover:bg-slate-50 uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-xs font-bold text-[#001237] bg-[#4FAAA7] rounded-full uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif] shadow-xs"
              >
                Register &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
