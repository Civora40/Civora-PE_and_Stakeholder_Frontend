import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Civora Control Plane',
  description: 'Sign in to access Civora intelligent construction and reporting control plane.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-white text-[#001237] selection:bg-[#4FAAA7]/30 selection:text-[#001237]">
      {/* 100% Full-Bleed Edge-to-Edge Split Layout */}
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row">
        {/* Left Half: Architectural Hero - Fixed & Non-Scrollable on Desktop */}
        <div className="relative min-h-[340px] sm:min-h-[420px] lg:fixed lg:inset-y-0 lg:left-0 lg:w-1/2 lg:h-screen lg:min-h-0 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden bg-[#001237] z-10">
          <Image
            src="/images/auth_hero.jpg"
            alt="Civora Architectural Control Center"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Subtle gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001237]/90 via-[#001237]/25 to-[#001237]/40" />

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
          <div className="relative z-10 space-y-3 pt-16 sm:pt-0 max-w-lg">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] tracking-tight uppercase leading-[1.08]">
              Bring every site into clearer view
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
              Structured site updates, review workflows, and traceable reporting across every build.
            </p>

            {/* Carousel Pill Indicator Dots [ — • • ] matching reference */}
            <div className="flex items-center gap-2 pt-4">
              <span className="w-9 h-1.5 rounded-full bg-white shadow-xs" />
              <span className="w-2 h-1.5 rounded-full bg-white/50" />
              <span className="w-2 h-1.5 rounded-full bg-white/50" />
            </div>
          </div>
        </div>

        {/* Right Half: Clean White Container 100% Filled - Scrollable Document Flow */}
        <div className="w-full lg:w-1/2 lg:ml-auto min-h-screen p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-between bg-white relative z-0">
          {/* Top-Right Pill Navigation Button */}
          <div className="flex justify-end">
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-full bg-[#001237] text-white text-xs font-bold hover:bg-[#18243D] transition-all font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-sm hover:scale-[1.02]"
            >
              Register
            </Link>
          </div>

          {/* Form Container */}
          <div className="flex-1 flex flex-col justify-center py-6 sm:py-8">
            <LoginForm />
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
