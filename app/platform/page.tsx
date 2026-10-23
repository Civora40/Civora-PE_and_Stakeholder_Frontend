import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Layers, FileCheck, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'The Civora Platform | Intelligent Construction. Clearer Control.',
  description:
    'Civora brings construction site submissions, project updates, review workflows, and reporting into one structured workspace.',
};

export default function PlatformPage() {
  return (
    <div className="relative min-h-screen bg-white text-[#001237] flex flex-col overflow-x-hidden selection:bg-[#4FAAA7]/30 selection:text-[#001237]">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-[#001237]">
                <span className="w-2 h-2 rounded-full bg-[#4FAAA7]" />
                <span className="font-['Encode_Sans_Condensed',sans-serif] tracking-wider uppercase">
                  The Civora Platform
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#001237] font-['Encode_Sans_Condensed',sans-serif] leading-[1.05] uppercase">
                From scattered updates to structured reporting.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                Site information is only useful when teams can find it, understand its status, and act on what is missing. Civora is designed to organize incoming updates and supporting evidence into a consistent process—from initial submission through review and report preparation.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-xs font-bold text-[#001237] bg-[#4FAAA7] hover:bg-[#439693] shadow-md shadow-[#4FAAA7]/20 transition-all font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider group"
                >
                  <span>Register on Platform</span>
                  <div className="w-6 h-6 rounded-full bg-[#001237] text-white flex items-center justify-center transition-transform group-hover:scale-105">
                    <ArrowUpRight className="w-3.5 h-3.5 font-bold" />
                  </div>
                </Link>

                <Link
                  href="/workflow"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-[#001237] bg-white border border-slate-200 hover:bg-slate-50 transition-colors font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-xs"
                >
                  <span>See How It Works</span>
                  <ArrowRight className="w-4 h-4 text-[#4FAAA7]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-[28px] sm:rounded-[32px] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1/1] shadow-2xl border border-slate-200 group">
              <Image
                src="/images/hero_tower.jpg"
                alt="Civora Platform infrastructure"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001237]/85 via-[#001237]/20 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-sm">
                  Enterprise Infrastructure
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#001237]/85 backdrop-blur-md border border-white/15 text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif] mb-1">
                  Structured Project Workspace
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  Keep source submissions connected to the review process and visible to authorized teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars of the Workspace */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
              Workspace Foundation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
              Keep the source information visible. Make the next action clear.
            </h2>
            <p className="text-sm text-slate-600">
              Civora brings construction site submissions, project updates, review workflows, and reporting into one structured workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/90 space-y-3 hover:border-[#4FAAA7] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                One Structured Workspace
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Bring site updates and supporting evidence together into a single, organized project record.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/90 space-y-3 hover:border-[#3B68DE] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#001237] text-blue-400 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Clear Review States
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                See what is received, under review, incomplete, or approved with explicit review labels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/90 space-y-3 hover:border-[#4FAAA7] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Outstanding Details Visible
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Identify information that needs clarification or follow-up before reports are prepared.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/90 space-y-3 hover:border-emerald-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#001237] text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Traceable Reporting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Keep source submissions connected to the review process and final approved report packages.
              </p>
            </div>
          </div>
        </section>

        {/* Workspace Flow & Architecture */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-[36px] bg-[#001237] text-white p-8 sm:p-14 lg:p-16 space-y-10 shadow-2xl">
            <div className="max-w-2xl space-y-3">
              <Badge variant="teal" size="sm">
                Structured Reporting Pipeline
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Preserve source submissions. Eliminate fragmented follow-ups.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Construction reporting often becomes fragmented across messaging groups, documents, photos, and manual follow-ups. Civora brings those inputs into a structured workflow—helping teams preserve source submissions, review information consistently, identify gaps that need attention, and prepare reports from approved submissions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-[#18243D] border border-slate-700/80 space-y-3">
                <span className="text-xs font-mono text-[#4FAAA7]">STAGE 01</span>
                <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Centralize Intake
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Incoming site logs, test reports, and photos are associated with their project, reporting group, and received time.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#18243D] border border-slate-700/80 space-y-3">
                <span className="text-xs font-mono text-blue-400">STAGE 02</span>
                <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Review & Clarify
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reviewers check details, request clarification on incomplete items, and record decisions with full traceability.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#18243D] border border-slate-700/80 space-y-3">
                <span className="text-xs font-mono text-emerald-400">STAGE 03</span>
                <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Report Preparation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reports are compiled from approved submissions, with final report release remaining a separate, authorized decision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-[36px] bg-[#f8fafc] border border-slate-200 p-8 sm:p-14 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
              Make construction reporting clearer.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Bring site updates, review workflows, and project reporting into a more structured process with Civora.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold text-[#001237] bg-[#4FAAA7] hover:bg-[#439693] shadow-md transition-all font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
              >
                <span>Register on the Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold text-[#001237] bg-white border border-slate-300 hover:bg-slate-50 transition-all font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
              >
                Sign In
              </Link>
            </div>
            <div className="text-xs text-slate-500 font-normal">
              See how a structured reporting workflow could fit your project operations.
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
