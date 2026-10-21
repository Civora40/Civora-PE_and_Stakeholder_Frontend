import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { RegisterForm } from '@/components/forms/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account | Civora Construction Control Plane',
  description: 'Set up your Civora account to access verified construction reporting and review workflows.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-white text-[#001237] selection:bg-[#4FAAA7]/30 selection:text-[#001237] overflow-x-hidden">
      {/* 100% Full-Bleed Edge-to-Edge Split Layout */}
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left Half: Architectural Hero 100% Filled */}
        <div className="relative min-h-[360px] sm:min-h-[440px] lg:min-h-screen p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden bg-[#001237]">
          <Image
            src="/images/auth_hero.jpg"
            alt="Civora Construction Intelligence Center"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Subtle gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001237]/95 via-[#001237]/35 to-[#001237]/50" />

          {/* Top-Left Brand Mark & Name */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Image src="/images/browser_icon.png" width={24} height={24} alt="Civora" />
              </div>
              <span className="text-white font-black text-2xl font-['Encode_Sans_Condensed',sans-serif] tracking-wider drop-shadow-md uppercase">
                Civora
              </span>
            </Link>
          </div>

          {/* Bottom Headline, Subtext, & Indicator Dots */}
          <div className="relative z-10 space-y-3.5 pt-16 sm:pt-0 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#4FAAA7] text-[11px] font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
              Construction Governance
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] tracking-tight uppercase leading-[1.08]">
              A clearer way to manage construction reporting.
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
              Civora brings site updates, review workflows, and project reporting into a structured workspace—helping teams see what has arrived, what needs attention, and what is ready for review.
            </p>

            <div className="pt-2 text-xs font-bold text-[#4FAAA7] tracking-wider uppercase font-['Encode_Sans_Condensed',sans-serif]">
              Intelligent Construction. Clearer Control.
            </div>

            {/* Carousel Pill Indicator Dots [ — • • ] matching reference */}
            <div className="flex items-center gap-2 pt-3">
              <span className="w-9 h-1.5 rounded-full bg-white shadow-xs" />
              <span className="w-2 h-1.5 rounded-full bg-white/50" />
              <span className="w-2 h-1.5 rounded-full bg-white/50" />
            </div>
          </div>
        </div>

        {/* Right Half: Clean White Container 100% Filled */}
        <div className="min-h-screen p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-between bg-white relative">
          {/* Top-Right Pill Navigation Button */}
          <div className="flex justify-end">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full bg-[#001237] text-white text-xs font-bold hover:bg-[#18243D] transition-all font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-sm hover:scale-[1.02]"
            >
              Sign in
            </Link>
          </div>

          {/* Form Container */}
          <div className="flex-1 flex flex-col justify-center py-6 sm:py-8">
            <Suspense fallback={<div className="animate-pulse text-xs text-slate-400">Loading form...</div>}>
              <RegisterForm />
            </Suspense>
          </div>

          {/* Bottom Subtle Copyright / Security Note */}
          <div className="text-center pt-4 text-[11px] text-slate-400 font-mono">
            &copy; {new Date().getFullYear()} Civora Systems &bull; High-Assurance Construction Governance
          </div>
        </div>
      </div>
    </div>
  );
}
