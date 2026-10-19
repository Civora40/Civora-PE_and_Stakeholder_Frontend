import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  FileCheck,
  Search,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Capabilities | Civora — Intelligent Construction. Clearer Control.',
  description:
    'Explore Civora core capabilities: centralized site submissions, submission review, AI-assisted checks, and structured project reports.',
};

export default function CapabilitiesPage() {
  return (
    <div className="relative min-h-screen bg-white text-[#001237] flex flex-col overflow-x-hidden selection:bg-[#4FAAA7]/30 selection:text-[#001237]">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-[#001237]">
                <span className="w-2 h-2 rounded-full bg-[#4FAAA7]" />
                <span className="font-['Encode_Sans_Condensed',sans-serif] tracking-wider uppercase">
                  Core Capabilities
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#001237] font-['Encode_Sans_Condensed',sans-serif] leading-[1.05] uppercase">
                From scattered updates to structured reporting.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Site information is only useful when teams can find it, understand its status, and act
                on what is missing. Civora is designed to organize incoming updates and supporting
                evidence into a consistent process—from initial submission through review and report
                preparation.
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
                  <span>Explore the Workflow</span>
                  <ArrowRight className="w-4 h-4 text-[#4FAAA7]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-[28px] sm:rounded-[32px] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1/1] shadow-2xl border border-slate-200 group">
              <Image
                src="/images/structural_facade.jpg"
                alt="Civora Structural Capabilities"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001237]/85 via-[#001237]/20 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-sm">
                  Field & Structural Audit
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#001237]/85 backdrop-blur-md border border-white/15 text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif] mb-1">
                  Traceable Evidence Ingestion
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  Connect site attachments, test logs, and technical notes directly to report sections.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Capabilities Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
              Built For Clearer Control
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
              Four Core Capabilities Supporting Project Operations
            </h2>
            <p className="text-sm text-slate-600">
              Keep the source information visible. Make the next action clear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Capability 1: Centralized Site Submissions */}
            <div
              id="submissions"
              className="rounded-3xl bg-[#f8fafc] border border-slate-200/90 p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:border-[#4FAAA7] transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>CAPABILITY 01</span>
                  <Badge variant="teal" size="sm">
                    Intake & Organization
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Centralized Site Submissions
                </h3>
                <p className="text-sm font-semibold text-slate-700">
                  Bring incoming site updates and supporting evidence into a structured project workspace.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Keep submissions associated with their project, reporting group, received time,
                  and available attachments so teams can locate the original information when needed.
                </p>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 text-xs">
                  <div className="font-bold text-[#001237] uppercase tracking-wide font-['Encode_Sans_Condensed',sans-serif]">
                    Associated Submission Metadata
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAAA7]" />
                      Project association and geographic site zone
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAAA7]" />
                      Reporting group (e.g. Site Engineering, Geotechnical, Quality)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAAA7]" />
                      Received timestamp and attached evidentiary records
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#001237] hover:text-[#4FAAA7] uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider"
                >
                  <span>Explore Submissions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Capability 2: Submission Review */}
            <div
              id="review"
              className="rounded-3xl bg-[#f8fafc] border border-slate-200/90 p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:border-[#3B68DE] transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#001237] text-blue-400 flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>CAPABILITY 02</span>
                  <Badge variant="blue" size="sm">
                    Inspection & Decision
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Submission Review
                </h3>
                <p className="text-sm font-semibold text-slate-700">
                  Give reviewers a clear place to inspect incoming information and record decisions.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Identify incomplete submissions, request clarification, and distinguish items
                  awaiting review from those that have been approved.
                </p>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 text-xs">
                  <div className="font-bold text-[#001237] uppercase tracking-wide font-['Encode_Sans_Condensed',sans-serif]">
                    Review Status Distinctions
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      Items received and awaiting reviewer triage
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      Marked for clarification: missing site photos or lab break data
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Approved submissions eligible for inclusion in report packages
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  href="/workflow"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#001237] hover:text-[#3B68DE] uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider"
                >
                  <span>Explore Review Workflows</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Capability 3: AI-Assisted Checks */}
            <div
              id="assisted-checks"
              className="rounded-3xl bg-[#f8fafc] border border-slate-200/90 p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:border-amber-400 transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#001237] text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>CAPABILITY 03</span>
                  <Badge variant="amber" size="sm">
                    Human-in-the-Loop
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  AI-Assisted Checks
                </h3>
                <p className="text-sm font-semibold text-slate-700">
                  Surface potential gaps and inconsistencies for human review.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Use AI-assisted analysis to help highlight missing fields or information that may
                  need attention. AI observations remain distinct from confirmed facts and do not
                  replace the reviewer’s judgement.
                </p>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs text-slate-700">
                  <div className="font-bold text-[#001237] uppercase tracking-wide font-['Encode_Sans_Condensed',sans-serif]">
                    Ethical Advisory Guardrails
                  </div>
                  <p className="text-xs text-slate-600">
                    AI suggests observations for human inspection. Authorized human reviewers retain
                    full responsibility for all verification decisions and approvals.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  href="/governance"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#001237] hover:text-amber-600 uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider"
                >
                  <span>Explore Assisted Checks</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Capability 4: Structured Project Reports */}
            <div
              id="reporting"
              className="rounded-3xl bg-[#f8fafc] border border-slate-200/90 p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:border-emerald-400 transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#001237] text-emerald-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>CAPABILITY 04</span>
                  <Badge variant="emerald" size="sm">
                    Report Release
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Structured Project Reports
                </h3>
                <p className="text-sm font-semibold text-slate-700">
                  Prepare reports from approved submissions and maintain a clear path to final approval.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Organize reviewed information into a consistent report structure. Keep submission
                  approval separate from the approval and release of the final report.
                </p>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 text-xs">
                  <div className="font-bold text-[#001237] uppercase tracking-wide font-['Encode_Sans_Condensed',sans-serif]">
                    Governance Separation
                  </div>
                  <p className="text-xs text-slate-600">
                    Approving an individual submission does not automatically approve the final
                    report. Release is an independent, accountable milestone.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  href="/workflow"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#001237] hover:text-emerald-600 uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider"
                >
                  <span>Explore Reporting</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Product Direction Note */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-['Encode_Sans_Condensed',sans-serif]">
              Product Direction & Architecture
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Capabilities are designed around traceable human oversight. Any planned capabilities
              are developed with the same commitment to preserving source records and keeping
              reviewer responsibilities explicit.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-[36px] bg-[#001237] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase">
              Make construction reporting clearer.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
              Bring site updates, review workflows, and project reporting into a more structured
              process with Civora.
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
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
              >
                Sign In
              </Link>
            </div>
            <div className="text-xs text-slate-400 font-normal">
              See how a structured reporting workflow could fit your project operations.
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
