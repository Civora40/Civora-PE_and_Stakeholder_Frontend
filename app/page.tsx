import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  ShieldCheck,
  HardHat,
  FileSearch,
  CheckCircle2,
  Users2,
  Building2,
  Lock,
  Play,
  ArrowRight,
  FileText,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Mail,
} from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';
import { InteractiveProductPreview } from '@/components/landing/InteractiveProductPreview';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ContactForm } from '@/components/forms/ContactForm';
import { ScrollProgress } from '@/components/landing/ScrollProgress';
import { InfiniteMarquee } from '@/components/landing/InfiniteMarquee';
import { StickyScrollFeatures } from '@/components/landing/StickyScrollFeatures';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-[#001237] flex flex-col overflow-x-hidden selection:bg-[#4FAAA7]/30 selection:text-[#001237]">
      {/* Top Dynamic Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Navigation */}
      <PublicNavbar />

      <main className="flex-1">

        {/* ========================================================================= */}
        {/* HERO SECTION (Matches Reference Asymmetrical Split Card Layout)          */}
        {/* ========================================================================= */}
        <section className="pt-6 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Card: Architectural Photography with Illustrative Workspace Context */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal animation="fade-up" delay={50} duration={800} className="h-full">
                <div className="relative rounded-[32px] overflow-hidden min-h-[460px] lg:min-h-[580px] h-full shadow-2xl group border border-slate-100">
                  <Image
                    src="/images/hero_tower.jpg"
                    alt="Civora architectural engineering tower"
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001237]/85 via-transparent to-[#001237]/25" />

                  {/* Floating Top Telemetry Badge */}
                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#001237] shadow-lg font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#4FAAA7] animate-pulse" />
                      Centralized Site Submissions
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#001237]/75 backdrop-blur-md text-[10px] font-mono text-slate-200 border border-white/20">
                      Live Telemetry
                    </span>
                  </div>

                  {/* Floating Top-Right Verification Card (Dojah Style Floating Card) */}
                  <div className="absolute top-20 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#4FAAA7]/50 shadow-2xl animate-float-slow text-[#001237]">
                    <div className="w-7 h-7 rounded-lg bg-[#001237] text-[#4FAAA7] flex items-center justify-center font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Statutory Authority</div>
                      <div className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        COREN R.58492 Verified
                      </div>
                    </div>
                  </div>

                  {/* Floating Center-Left Lab Strength Card (Dojah Style Floating Card) */}
                  <div className="absolute top-44 -left-2 sm:-left-4 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#001237]/90 backdrop-blur-md border border-white/20 shadow-2xl animate-float-reverse text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4FAAA7] animate-pulse" />
                    <div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase">UNILAG Materials Lab</div>
                      <div className="text-xs font-bold text-[#4FAAA7] font-mono">
                        28-Day Target: 34.3 MPa (+14%)
                      </div>
                    </div>
                  </div>

                  {/* Floating Bottom Project Detail */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#001237]/90 backdrop-blur-md border border-white/15 text-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                        Structured Project Workspace
                      </span>
                      <span className="text-[10px] font-mono text-slate-300">Traceable Submissions</span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2">
                      Keep source submissions connected to the review process and visible to authorized teams.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Card: Crisp White/Stone Headline Card matching reference */}
            <div className="lg:col-span-7">
              <ScrollReveal animation="fade-up" delay={150} duration={800} className="h-full">
                <div className="rounded-[32px] bg-[#f8fafc] border border-slate-200/80 p-8 sm:p-12 lg:p-14 flex flex-col justify-between shadow-sm relative overflow-hidden h-full">
                  <div className="space-y-6">
                    {/* Eyebrow Tag */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#001237] shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#4FAAA7]" />
                      <span className="font-['Encode_Sans_Condensed',sans-serif] tracking-wider uppercase">
                        CONSTRUCTION INTELLIGENCE PLATFORM
                      </span>
                    </div>

                    {/* Massive Bold Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#001237] font-['Encode_Sans_Condensed',sans-serif] leading-[1.05] uppercase">
                      Bring Every Site Into Clearer View.
                    </h1>

                    {/* Subtitle / Supporting Paragraph */}
                    <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                      Civora brings construction site submissions, project updates, and reporting
                      workflows into one structured workspace—helping teams review information, track
                      outstanding details, and prepare clearer project reports.
                    </p>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-xs font-bold text-[#001237] bg-[#4FAAA7] hover:bg-[#439693] shadow-md shadow-[#4FAAA7]/20 transition-all group font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
                      >
                        <span>Register on Platform</span>
                        <div className="w-7 h-7 rounded-full bg-[#001237] text-white flex items-center justify-center transition-transform group-hover:scale-105">
                          <ArrowUpRight className="w-4 h-4 font-bold" />
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

                  {/* Bottom Highlight Row: Brand Signature & Interactive Tour Capsule */}
                  <div className="pt-10 mt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <div className="text-lg font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                        Intelligent Construction. Clearer Control.
                      </div>
                      <div className="text-xs text-slate-500 font-normal mt-0.5">
                        From incoming site updates to reports ready for review.
                      </div>
                    </div>

                    {/* Interactive Tour Capsule Button */}
                    <a
                      href="#features"
                      className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-md transition-all group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#4FAAA7] text-[#001237] flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-[#001237]" />
                      </div>
                      <span className="font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                        Interactive Platform Preview
                      </span>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INFINITE MARQUEE TICKER (Dojah Style Partner & Regulator Showcase)         */}
        {/* ========================================================================= */}
        <InfiniteMarquee />


        {/* ========================================================================= */}
        {/* VALUE PROPOSITION STRIP (Section 5 - Responsive Wrap - No Horiz Scroll)   */}
        {/* ========================================================================= */}
        <section className="py-6 border-y border-slate-100 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
              {[
                {
                  title: 'One Structured Workspace',
                  desc: 'Bring site updates and supporting evidence together.',
                  img: '/images/hero_tower.jpg',
                },
                {
                  title: 'Clear Review States',
                  desc: 'See what is received, pending, incomplete, or approved.',
                  img: '/images/structural_facade.jpg',
                },
                {
                  title: 'Outstanding Details Visible',
                  desc: 'Identify information that needs clarification.',
                  img: '/images/architectural_model.jpg',
                },
                {
                  title: 'Traceable Reporting',
                  desc: 'Keep source submissions connected to the review process.',
                  img: '/images/hero_tower.jpg',
                },
              ].map((pill, idx) => (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#4FAAA7] transition-all h-full">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 mt-0.5">
                      <Image src={pill.img} alt={pill.title} fill className="object-cover" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                        {pill.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {pill.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: PLATFORM INTRODUCTION & 3 CORE PILLARS                         */}
        {/* ========================================================================= */}
        <section id="platform" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Eyebrow and Heading from Spec Section 6 */}
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f5f9] text-[11px] font-bold text-[#001237] uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
                THE CIVORA PLATFORM
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase leading-tight">
                From scattered updates to structured reporting.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Site information is only useful when teams can find it, understand its status, and act
                on what is missing. Civora is designed to organize incoming updates and supporting
                evidence into a consistent process—from initial submission through review and report
                preparation.
              </p>
              <div className="text-xs font-semibold text-[#4FAAA7] uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif] pt-1">
                Keep the source information visible. Make the next action clear.
              </div>
            </div>
          </ScrollReveal>

          {/* 3 Prominent Cards matching the reference design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Dark Midnight Navy Card (Centralized Site Submissions) */}
            <ScrollReveal animation="fade-up" delay={100} className="h-full">
              <div className="rounded-[32px] bg-[#001237] text-white p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group min-h-[460px] h-full">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-white/10 pb-4 mb-8">
                    <span>01.</span>
                    <span className="text-[#4FAAA7] font-bold">INTAKE & ORGANIZATION</span>
                  </div>
                  <h3 className="text-2xl font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide mb-3">
                    Centralized Site Submissions
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold mb-2">
                    Bring incoming site updates and supporting evidence into a structured project workspace.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Keep submissions associated with their project, reporting group, received time,
                    and available attachments so teams can locate the original information when needed.
                  </p>
                </div>

                {/* Bottom Link with Arrow */}
                <div className="pt-8 flex items-center justify-between">
                  <Link
                    href="/capabilities#submissions"
                    className="text-xs font-bold text-white hover:text-[#4FAAA7] uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider"
                  >
                    Explore Submissions &rarr;
                  </Link>
                  <div className="w-10 h-10 rounded-full bg-[#4FAAA7] text-[#001237] flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowUpRight className="w-5 h-5 font-bold" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Muted Teal Accent Card with Architectural Facade (Submission Review) */}
            <ScrollReveal animation="fade-up" delay={200} className="h-full">
              <div className="rounded-[32px] bg-[#4FAAA7] text-[#001237] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group min-h-[460px] h-full">
                <div className="relative z-10">
                  <div className="flex items-center justify-between text-xs text-[#001237]/70 font-mono border-b border-[#001237]/15 pb-4 mb-6">
                    <span>02.</span>
                    <span className="font-bold">INSPECTION & DECISION</span>
                  </div>
                  <h3 className="text-2xl font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide mb-2">
                    Submission Review
                  </h3>
                  <p className="text-xs text-[#001237] leading-relaxed font-semibold mb-1">
                    Give reviewers a clear place to inspect incoming information and record decisions.
                  </p>
                  <p className="text-xs text-[#001237]/80 leading-relaxed font-normal">
                    Identify incomplete submissions, request clarification, and distinguish items
                    awaiting review from those that have been approved.
                  </p>
                </div>

                {/* Integrated Facade Photo at Bottom */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mt-6 shadow-md">
                  <Image
                    src="/images/structural_facade.jpg"
                    alt="Structural engineering facade detail"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Bottom Link with Arrow */}
                <div className="pt-4 flex items-center justify-between relative z-10">
                  <Link
                    href="/capabilities#review"
                    className="text-xs font-bold text-[#001237] uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider"
                  >
                    Explore Review Workflows &rarr;
                  </Link>
                  <div className="w-10 h-10 rounded-full bg-[#001237] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowUpRight className="w-5 h-5 font-bold" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Deep Steel Navy with Architectural Model Photo (Structured Project Reports) */}
            <ScrollReveal animation="fade-up" delay={300} className="h-full">
              <div className="rounded-[32px] bg-[#18243D] text-white p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group min-h-[460px] h-full">
                <div className="relative z-10">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-white/10 pb-4 mb-6">
                    <span>03.</span>
                    <span className="text-[#4FAAA7] font-bold">REPORT PREPARATION</span>
                  </div>
                  <h3 className="text-2xl font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide mb-2">
                    Structured Project Reports
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold mb-1">
                    Prepare reports from approved submissions and maintain a clear path to final approval.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Organize reviewed information into a consistent report structure. Keep submission
                    approval separate from the release of the final report.
                  </p>
                </div>

                {/* Integrated Architectural Model Photo at Bottom */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mt-6 shadow-md">
                  <Image
                    src="/images/architectural_model.jpg"
                    alt="Architectural engineering model"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Bottom Link with Arrow */}
                <div className="pt-4 flex items-center justify-between relative z-10">
                  <Link
                    href="/capabilities#reporting"
                    className="text-xs font-bold text-white hover:text-[#4FAAA7] uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider"
                  >
                    Explore Reporting &rarr;
                  </Link>
                  <div className="w-10 h-10 rounded-full bg-[#4FAAA7] text-[#001237] flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowUpRight className="w-5 h-5 font-bold" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DARK CONTRAST BREAK: BUILT AROUND ACCOUNTABILITY (Spec Section 10)         */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up" duration={800}>
            <div className="relative rounded-[36px] overflow-hidden bg-[#001237] text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
              {/* Background Skyline Image with Deep Navy Gradient */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/skyline_telemetry.jpg"
                  alt="City skyline infrastructure"
                  fill
                  className="object-cover object-center opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001237] via-[#001237]/85 to-transparent" />
              </div>

              <div className="relative z-10 space-y-12">
                <div className="max-w-3xl space-y-3">
                  <Badge variant="teal" size="sm">
                    BUILT AROUND ACCOUNTABILITY
                  </Badge>
                  <h3 className="text-3xl sm:text-4xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Clear workflows. Accountable decisions.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Construction reports need more than collected information. Teams need to understand
                    where information came from, what has been reviewed, and who is responsible for the
                    next decision. Civora is designed to keep source submissions traceable and review
                    decisions explicit.
                  </p>
                </div>

                {/* 4 Core Accountability Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                  <div className="space-y-2 border-l-2 border-[#4FAAA7] pl-4">
                    <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      Preserve the source
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Keep original submissions and available evidence connected to the review process.
                    </p>
                  </div>

                  <div className="space-y-2 border-l-2 border-[#3B68DE] pl-4">
                    <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      Make gaps visible
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Mark missing or unclear information for follow-up instead of filling gaps with assumptions.
                    </p>
                  </div>

                  <div className="space-y-2 border-l-2 border-[#4FAAA7] pl-4">
                    <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      Keep approvals distinct
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Separate submission review from final report approval and release.
                    </p>
                  </div>

                  <div className="space-y-2 border-l-2 border-emerald-400 pl-4">
                    <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      Human Responsibility
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      AI can assist with identifying potential issues. Authorized people remain responsible for decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: CORE CAPABILITIES MATRIX (Section 7)                           */}
        {/* ========================================================================= */}
        <section id="capabilities" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: High-contrast Architectural Image & Principle Callout */}
            <div className="lg:col-span-5">
              <ScrollReveal animation="slide-left">
                <div className="space-y-6">
                  <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] shadow-xl border border-slate-200">
                    <Image
                      src="/images/structural_facade.jpg"
                      alt="High precision civil engineering structure"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
                    <h4 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      Keep the source visible. Make the next action clear.
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Site information is only useful when teams can find it, understand its status, and
                      act on what is missing. Civora brings scattered updates into a defined, structured workspace.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Col: 2x2 Feature Matrix for the 4 Core Capabilities */}
            <div className="lg:col-span-7">
              <ScrollReveal animation="slide-right">
                <div className="space-y-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                      CORE CAPABILITIES
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase mt-1">
                      Structured tools for every stage of site reporting
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-[#4FAAA7] transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center mb-3">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        Centralized Site Submissions
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Bring incoming site updates and supporting evidence into a structured project
                        workspace with associated project, reporting group, and received time.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-[#3B68DE] transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#001237] text-blue-400 flex items-center justify-center mb-3">
                        <FileSearch className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        Submission Review
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Give reviewers a clear place to inspect incoming information, identify incomplete
                        submissions, request clarification, and record decisions.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-[#4FAAA7] transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center mb-3">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        AI-Assisted Checks
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Surface potential gaps and inconsistencies for human review. AI observations
                        remain distinct from confirmed facts and do not replace reviewer judgement.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-emerald-400 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#001237] text-emerald-400 flex items-center justify-center mb-3">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        Structured Project Reports
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Prepare reports from approved submissions and maintain a clear path to final
                        approval, keeping submission approval separate from final report release.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STICKY SCROLL FEATURE PROGRESSION (Dojah Signature Scroll Experience)      */}
        {/* ========================================================================= */}
        <div id="features" className="scroll-mt-24 border-t border-slate-100 bg-[#f8fafc]/50">
          <StickyScrollFeatures />
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE PRODUCT PREVIEW SECTION (Section 9)                           */}
        {/* ========================================================================= */}
        <section id="preview" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                INSIDE CIVORA
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Know what has arrived—and what still needs attention.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal">
                Get a clearer overview of project activity, submission status, outstanding information,
                and reports awaiting review. Keep the information that needs action visible without losing
                sight of the original submission.
              </p>
            </div>

            <div className="rounded-[32px] p-3 sm:p-5 bg-slate-100 border border-slate-200/80 shadow-2xl">
              <InteractiveProductPreview />
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: 4-STAGE WORKFLOW PIPELINE (Section 8)                          */}
        {/* ========================================================================= */}
        <section id="workflow" className="scroll-mt-24 py-20 border-t border-slate-100 bg-[#f8fafc] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                  HOW IT WORKS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  A clearer path from site update to final report.
                </h2>
                <p className="text-sm text-slate-600">
                  Civora organizes the reporting process into defined stages, helping teams understand
                  what has arrived, what needs attention, and what is ready for approval.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. Capture */}
              <ScrollReveal animation="fade-up" delay={100} className="h-full">
                <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#001237] text-[#4FAAA7] flex items-center justify-center font-bold text-xs font-mono">
                        01
                      </div>
                      <Badge variant="teal" size="sm">
                        Status: Received
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      1. Capture
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Bring site updates and supporting evidence into a centralized project record.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                    Preserve source attachments
                  </div>
                </div>
              </ScrollReveal>

              {/* 2. Review */}
              <ScrollReveal animation="fade-up" delay={200} className="h-full">
                <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#001237] text-[#3B68DE] flex items-center justify-center font-bold text-xs font-mono">
                        02
                      </div>
                      <Badge variant="blue" size="sm">
                        Status: Under review
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      2. Review
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Check the available information, identify missing details, and record reviewer decisions.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                    Surface gaps for human review
                  </div>
                </div>
              </ScrollReveal>

              {/* 3. Prepare */}
              <ScrollReveal animation="fade-up" delay={300} className="h-full">
                <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#001237] text-[#4FAAA7] flex items-center justify-center font-bold text-xs font-mono">
                        03
                      </div>
                      <Badge variant="teal" size="sm">
                        Status: Ready for report review
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      3. Prepare
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Build a structured report from submissions that have passed the required review.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                    Compile from approved submissions
                  </div>
                </div>
              </ScrollReveal>

              {/* 4. Approve & Release */}
              <ScrollReveal animation="fade-up" delay={400} className="h-full">
                <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#001237] text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                        04
                      </div>
                      <Badge variant="emerald" size="sm">
                        Status: Approved for release
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      4. Approve & Release
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      An authorized person reviews the final report and approves its release to the intended recipients.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                    Authorized release governance
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Workflow Note from Spec Section 8 */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-center gap-3 text-center">
                <Lock className="w-4 h-4 text-[#4FAAA7] flex-shrink-0" />
                <span className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Workflow note: Approving an individual submission does not automatically approve the final report.
                </span>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* GOVERNANCE & ACCOUNTABILITY (Spec Section 10)                              */}
        {/* ========================================================================= */}
        <section id="governance" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="rounded-[36px] bg-[#001237] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <Badge variant="teal" size="sm">
                    BUILT AROUND ACCOUNTABILITY
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Clear workflows. Accountable decisions.
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    Construction reports need more than collected information. Teams need to understand
                    where information came from, what has been reviewed, and who is responsible for the
                    next decision. Civora is designed to keep source submissions traceable and review
                    decisions explicit.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <h4 className="text-xs font-bold uppercase text-[#4FAAA7]">
                        Preserve the source
                      </h4>
                      <p className="text-xs text-slate-300">
                        Keep original submissions and available evidence connected to the review process.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <h4 className="text-xs font-bold uppercase text-[#3B68DE]">
                        Keep approvals distinct
                      </h4>
                      <p className="text-xs text-slate-300">
                        Separate submission review from final report approval and release.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#18243D] border border-slate-700/80 p-6 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#001237] border border-[#4FAAA7] text-[#4FAAA7] mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Human Responsibility
                  </h4>
                  <p className="text-xs text-slate-300">
                    AI can assist with identifying potential issues. Authorized people remain
                    responsible for review, approval, and release decisions.
                  </p>
                  <Link
                    href="/governance"
                    className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Explore Governance Standard &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* AUDIENCES / USE CASES (Spec Section 11)                                    */}
        {/* ========================================================================= */}
        <section id="audiences" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                DESIGNED FOR PROJECT TEAMS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                A clearer view for everyone involved in reporting.
              </h2>
              <p className="text-sm text-slate-600">
                Civora supports distinct responsibilities across the project reporting lifecycle.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Audience 1: Project Engineers */}
            <ScrollReveal animation="fade-up" delay={100} className="h-full">
              <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs hover:border-[#4FAAA7] transition-all h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
                    <HardHat className="w-5 h-5" />
                  </div>
                  <Badge variant="teal" size="sm">
                    Project Engineers
                  </Badge>
                  <h3 className="text-lg font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Project Engineers
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Organize incoming site updates, review submissions, and see which details require follow-up.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/register"
                    className="text-xs font-bold text-[#4FAAA7] hover:underline inline-flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
                  >
                    Join as Project Engineer &rarr;
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Audience 2: Construction Project Managers */}
            <ScrollReveal animation="fade-up" delay={200} className="h-full">
              <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs hover:border-[#3B68DE] transition-all h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#3B68DE] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <Badge variant="blue" size="sm">
                    Project Managers
                  </Badge>
                  <h3 className="text-lg font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Construction Project Managers
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Get a structured view of reporting progress and the items that need attention across projects.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/register"
                    className="text-xs font-bold text-[#3B68DE] hover:underline inline-flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
                  >
                    Join as Project Manager &rarr;
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Audience 3: Head Office & Reporting Teams */}
            <ScrollReveal animation="fade-up" delay={300} className="h-full">
              <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs hover:border-[#4FAAA7] transition-all h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <Badge variant="teal" size="sm">
                    Reporting Teams
                  </Badge>
                  <h3 className="text-lg font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Head Office & Reporting Teams
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Work from reports built through a traceable review process, with approval status clearly visible.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/register"
                    className="text-xs font-bold text-[#4FAAA7] hover:underline inline-flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
                  >
                    Join Reporting Team &rarr;
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Audience 4: Clients & Executive Stakeholders */}
            <ScrollReveal animation="fade-up" delay={400} className="h-full">
              <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs hover:border-emerald-400 transition-all h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <Badge variant="emerald" size="sm">
                    Stakeholders
                  </Badge>
                  <h3 className="text-lg font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Clients & Executive Stakeholders
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Access the reports and project information they are authorized to see, with clear
                    distinctions between draft, approved, and released information.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/register"
                    className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
                  >
                    Stakeholder Access &rarr;
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center max-w-xl mx-auto">
            <p className="text-[11px] text-slate-500 font-normal">
              Civora aligns claims with its actual access model and available role permissions.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CORE REPORTING PRINCIPLES (Replaces Fake Testimonials with Grounded Spec) */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                CORE REPORTING PRINCIPLES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Designed to Replace Fragmented Paperwork
              </h2>
              <p className="text-sm text-slate-600">
                Clear accountability without replacing the judgement of the people responsible for project decisions.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Principle 1 */}
            <ScrollReveal animation="slide-left">
              <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 space-y-4 shadow-sm flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Centralize Scattered Updates
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    Construction reporting can become fragmented across messaging groups, documents,
                    photos, and manual follow-ups. Civora brings those inputs into a more structured
                    workflow—helping teams preserve source submissions, review information consistently,
                    identify gaps that need attention, and prepare reports from approved submissions.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-[#4FAAA7] uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
                  Bring every site into clearer view
                </div>
              </div>
            </ScrollReveal>

            {/* Principle 2 */}
            <ScrollReveal animation="slide-right">
              <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 space-y-4 shadow-sm flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001237] text-blue-400 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Separated Governance Boundaries
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    Civora supports better visibility and accountability without replacing the judgement
                    of the people responsible for project decisions. Approving an individual submission
                    does not automatically approve the final report. AI observations remain distinct
                    from confirmed facts and do not replace the reviewer&apos;s judgement.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-[#3B68DE] uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
                  Defensible Human Authority
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TECHNICAL INSIGHTS & BEST PRACTICES                                       */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                  PRACTICE INSIGHTS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase mt-1">
                  Structured Construction Operations
                </h2>
              </div>
              <Link
                href="/capabilities"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#001237] hover:text-[#4FAAA7] uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider"
              >
                <span>Explore All Capabilities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: '/images/structural_facade.jpg',
                tag: 'Source Preservation',
                title: 'Preserving Original Evidence in Construction Reporting',
                desc: 'Why keeping source submissions directly connected to the review process eliminates downstream communication friction.',
                readTime: '4 min read',
                href: '/platform',
              },
              {
                img: '/images/architectural_model.jpg',
                tag: 'Workflow Governance',
                title: 'Why Approving Submissions Is Distinct From Report Release',
                desc: 'How separating submittal technical checks from executive distribution safeguards project accountability.',
                readTime: '5 min read',
                href: '/workflow',
              },
              {
                img: '/images/hero_tower.jpg',
                tag: 'Human Oversight',
                title: 'AI Observations vs. Reviewer Judgement in Construction',
                desc: 'Ensuring automated checks surface potential gaps without overstepping the role of authorized engineering professionals.',
                readTime: '6 min read',
                href: '/governance',
              },
            ].map((article, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 150} className="h-full">
                <div className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <Image
                        src={article.img}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#001237]/80 backdrop-blur-md text-[10px] font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                          {article.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      <div className="text-[11px] font-mono text-slate-400">
                        {article.readTime} &bull; Civora Practice Insights
                      </div>
                      <h3 className="text-lg font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase group-hover:text-[#4FAAA7] transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                        {article.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={article.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#001237] group-hover:text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
                    >
                      Explore Topic <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 12: TECHNICAL INQUIRY & CONTACT                                   */}
        {/* ========================================================================= */}
        <section id="contact" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Direct Inquiries Context */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                    GET IN TOUCH
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase mt-1">
                    Speak With Our Technical Advisory Team
                  </h2>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Whether you are evaluating Civora for a multi-phase build, standardizing quality gates across an enterprise portfolio, or seeking technical integration, our engineering advisory team is at your disposal.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/90 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-mono">Advisory Desk</div>
                      <div className="text-xs font-bold text-[#001237] font-mono">advisory@civora.com</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/90 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#001237] text-blue-400 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-mono">Compliance & Standards</div>
                      <div className="text-xs font-bold text-[#001237] font-mono">compliance@civora.com</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#001237] text-white space-y-2">
                  <div className="text-xs font-bold text-[#4FAAA7] uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
                    Rapid Response Commitment
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Direct technical consultation with civil engineers. Guaranteed response within 2 business hours for active project operations.
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Contact Form */}
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* FINAL CALL TO ACTION (Spec Section 12)                                    */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="rounded-[36px] bg-gradient-to-r from-[#001237] via-[#18243D] to-[#001237] text-white p-8 sm:p-14 lg:p-16 text-center space-y-6 shadow-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Make construction reporting clearer.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                Bring site updates, review workflows, and project reporting into a more structured process with Civora.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold text-[#001237] bg-[#4FAAA7] hover:bg-[#3d918e] shadow-xl transition-all font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
                >
                  <span>Register on the Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
                >
                  Sign In
                </Link>
              </div>
              <div className="text-xs text-slate-400 font-normal pt-2">
                See how a structured reporting workflow could fit your project operations.
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
