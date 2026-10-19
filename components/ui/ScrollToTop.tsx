'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show button after scrolling past 300px
      if (currentScrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress percentage (0 - 100)
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / scrollHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 transition-all duration-300 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#001237]/90 hover:bg-[#001237] text-white backdrop-blur-md border border-white/20 shadow-xl shadow-[#001237]/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none"
          viewBox="0 0 48 48"
        >
          {/* Background track circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-white/10"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Active progress indicator circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-[#4FAAA7] transition-all duration-150 ease-out"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        {/* Arrow Up Icon with subtle hover lift */}
        <ArrowUp className="w-5 h-5 text-white group-hover:-translate-y-0.5 group-hover:text-[#4FAAA7] transition-all duration-200 relative z-10" />

        {/* Floating Tooltip on Hover */}
        <span className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 px-2.5 py-1 rounded-md bg-[#001237] text-white text-[10px] font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-md whitespace-nowrap border border-white/10">
          Scroll to top
        </span>
      </button>
    </div>
  );
}
