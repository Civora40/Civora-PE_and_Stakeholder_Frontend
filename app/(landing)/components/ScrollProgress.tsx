'use client';

import React, { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#4FAAA7] via-[#3B68DE] to-[#4FAAA7] transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(79,170,167,0.7)]"
        style={{
          width: '100%',
          transformOrigin: 'left',
          transform: `scaleX(${scrollProgress / 100})`,
        }}
      />
    </div>
  );
}
