import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  FileCheck,
  ArrowRight,
  MapPin,
  Phone,
} from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Technical Advisory | Civora — Intelligent Construction. Clearer Control.',
  description:
    'Speak directly with our engineering advisory desk to evaluate Civora for your construction projects, pilot integrations, and compliance governance.',
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-white text-[#001237] flex flex-col overflow-x-hidden selection:bg-[#4FAAA7]/30 selection:text-[#001237]">
      <PublicNavbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                             */}
        {/* ========================================================================= */}
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-[#001237]">
                <span className="w-2 h-2 rounded-full bg-[#4FAAA7]" />
                <span className="font-['Encode_Sans_Condensed',sans-serif] tracking-wider uppercase">
                  Technical Advisory & Inquiries
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#001237] font-['Encode_Sans_Condensed',sans-serif] leading-[1.05] uppercase">
                Let&apos;s structure your project reporting.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Whether you are evaluating Civora for a multi-phase build, standardizing quality gates across an enterprise portfolio, or seeking technical integration, our engineering advisory team is at your disposal.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#4FAAA7] flex items-center justify-center border border-teal-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>&lt; 2hr Response for Active Operations</span>
                </div>

                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Direct Civil Engineering Consultation</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-[28px] sm:rounded-[32px] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1/1] shadow-2xl border border-slate-200 group">
              <Image
                src="/images/skyline_telemetry.jpg"
                alt="Civora Advisory Infrastructure"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001237]/85 via-[#001237]/20 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-sm">
                  Advisory Headquarters
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#001237]/85 backdrop-blur-md border border-white/15 text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif] mb-1">
                  Global Project Operations
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  Supporting major civil engineering, infrastructure, and commercial structural packages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE FORM & DIRECT COORDINATES                                     */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Contact Channels & Operational Context */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                  Direct Channels
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Reach Our Advisory Desk
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Connect with technical specialists who understand submittal verification, engineering stage gates, and defensible reporting.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 flex items-start gap-4 hover:border-[#4FAAA7] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                      Technical Advisory
                    </div>
                    <div className="text-sm font-semibold text-slate-800 font-mono">
                      advisory@civora.com
                    </div>
                    <div className="text-xs text-slate-500">
                      For pilot evaluations, specifications review & enterprise pilots
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 flex items-start gap-4 hover:border-[#3B68DE] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-blue-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                      Governance & Compliance
                    </div>
                    <div className="text-sm font-semibold text-slate-800 font-mono">
                      compliance@civora.com
                    </div>
                    <div className="text-xs text-slate-500">
                      ISO 19650 alignment, audit trails & security governance
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 flex items-start gap-4 hover:border-[#4FAAA7] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                      Engineering Operations
                    </div>
                    <div className="text-xs font-medium text-slate-700">
                      London &bull; New York &bull; Global Field Telemetry Hubs
                    </div>
                    <div className="text-xs text-slate-500">
                      Operating across EMEA, Americas, and APAC timezones
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQ / Value callout */}
              <div className="p-6 rounded-2xl bg-[#001237] text-white space-y-3">
                <div className="text-xs font-bold text-[#4FAAA7] uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
                  What happens next?
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4FAAA7] flex-shrink-0 mt-0.5" />
                    <span>A dedicated project engineer reviews your submittal requirements.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4FAAA7] flex-shrink-0 mt-0.5" />
                    <span>We schedule an operational walkthrough tailored to your site roles.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4FAAA7] flex-shrink-0 mt-0.5" />
                    <span>Configure your verification workflows without upfront platform lock-in.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
