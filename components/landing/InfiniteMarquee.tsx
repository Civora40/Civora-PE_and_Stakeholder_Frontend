'use client';

import React from 'react';
import {
  Building2,
  HardHat,
  ShieldCheck,
  Landmark,
  Layers,
  Award,
  Scale,
  Compass,
} from 'lucide-react';

interface Partner {
  name: string;
  tag: string;
  icon: React.ElementType;
}

const PARTNERS: Partner[] = [
  { name: 'Julius Berger Nigeria', tag: 'Tier-1 Infrastructure', icon: Building2 },
  { name: 'Craneburg Construction', tag: 'Highways & Marine', icon: HardHat },
  { name: 'ITB Nigeria Ltd', tag: 'High-Rise Concrete', icon: Layers },
  { name: 'LAMATA', tag: 'Urban Rail Transit', icon: Landmark },
  { name: 'FMWH Highways', tag: 'Federal Ministry', icon: ShieldCheck },
  { name: 'LASBCA', tag: 'Building Control', icon: Award },
  { name: 'Dangote Materials', tag: 'Grade 42.5R Cement', icon: Scale },
  { name: 'BUA Infrastructure', tag: 'Ready-Mix Concrete', icon: Layers },
  { name: 'COREN Consultancies', tag: 'Engineering Council', icon: Compass },
  { name: 'NIQS Practices', tag: 'Quantity Surveying', icon: ShieldCheck },
];

export function InfiniteMarquee() {
  // Duplicate array 3 times for a seamless continuous horizontal loop
  const marqueeItems = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="relative w-full py-5 bg-[#fafafa] border-y border-slate-200/90 overflow-hidden">
      {/* Subtle edge fade gradient mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#fafafa] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#fafafa] to-transparent z-10" />

      {/* Header Eyebrow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 text-center">
        <p className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-500 uppercase font-['Encode_Sans_Condensed',sans-serif]">
          ALIGNING WITH NIGERIAN INFRASTRUCTURE LEADERS, TIER-1 CONTRACTORS & REGULATORY BODIES
        </p>
      </div>

      {/* Horizontal Scrolling Ribbon */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div
          className="animate-marquee flex items-center gap-4 sm:gap-6 py-1"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: 'max-content',
          }}
        >
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.name}-${idx}`}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs hover:border-[#4FAAA7] hover:shadow-xs transition-all duration-200 shrink-0 cursor-default select-none"
              >
                <div className="w-6 h-6 rounded-full bg-[#001237] text-[#4FAAA7] flex items-center justify-center shrink-0">
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                    {item.name}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] text-slate-500 font-medium">
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
