import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Eye,
  Lock,
  Sparkles,
  Users2,
  HardHat,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Governance & Accountability | Civora — Intelligent Construction. Clearer Control.',
  description:
    'Civora keeps source submissions traceable and review decisions explicit, with strict human oversight and clear approval boundaries.',
};

export default function GovernancePage() {
  const audiences = [
    {
      title: 'Project Engineers',
      role: 'project_engineer',
      badgeVariant: 'teal' as const,
      icon: HardHat,
      description:
        'Organize incoming site updates, review submissions, and see which details require follow-up.',
      details: [
        'Inspect incoming site logs and test reports',
        'Mark missing information for clarification',
        'Record review decisions with full source context',
      ],
    },
    {
      title: 'Construction Project Managers',
      role: 'project_manager',
      badgeVariant: 'blue' as const,
      icon: Building2,
      description:
        'Get a structured view of reporting progress and the items that need attention across projects.',
      details: [
        'Monitor overall submission status and review pace',
        'Identify operational bottlenecks before report deadlines',
        'Keep teams aligned on pending site clarification items',
      ],
    },
    {
      title: 'Head Office & Reporting Teams',
      role: 'reporting_team',
      badgeVariant: 'amber' as const,
      icon: Users2,
      description:
        'Work from reports built through a traceable review process, with approval status clearly visible.',
      details: [
        'Compile structured reports from vetted submissions',
        'Maintain a clear audit trail from report figures back to source records',
        'Ensure governance requirements are satisfied prior to release',
      ],
    },
    {
      title: 'Clients & Executive Stakeholders',
      role: 'read_only_stakeholder',
      badgeVariant: 'emerald' as const,
      icon: ShieldCheck,
      description:
        'Access the reports and project information they are authorized to see, with clear distinctions between draft, approved, and released information.',
      details: [
        'View released reports with full approval context',
        'Gain confidence through traceable source references',
        'Respect authorization boundaries and draft status flags',
      ],
    },
  ];

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
                  Built Around Accountability
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#001237] font-['Encode_Sans_Condensed',sans-serif] leading-[1.05] uppercase">
                Clear workflows. Accountable decisions.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Construction reports need more than collected information. Teams need to understand
                where information came from, what has been reviewed, and who is responsible for the
                next decision. Civora is designed to keep source submissions traceable and review
                decisions explicit.
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
                  <span>See the Workflow</span>
                  <ArrowRight className="w-4 h-4 text-[#4FAAA7]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-[28px] sm:rounded-[32px] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1/1] shadow-2xl border border-slate-200 group">
              <Image
                src="/images/skyline_telemetry.jpg"
                alt="Civora Enterprise Skyline Governance"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001237]/85 via-[#001237]/20 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-sm">
                  Executive Governance
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#001237]/85 backdrop-blur-md border border-white/15 text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif] mb-1">
                  Human Authority Guaranteed
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  Dual-custody separation: individual submission approval never bypasses final release oversight.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Governance Pillars */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl bg-[#f8fafc] border border-slate-200 p-8 space-y-4 hover:border-[#4FAAA7] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Preserve the Source
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Keep original submissions and available evidence connected to the review process.
                Teams can always inspect the original lab break sheet, photos, or logs that informed
                a finding.
              </p>
            </div>

            <div className="rounded-3xl bg-[#f8fafc] border border-slate-200 p-8 space-y-4 hover:border-amber-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#001237] text-amber-400 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Make Gaps Visible
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Mark missing or unclear information for follow-up instead of filling gaps with
                assumptions. Civora highlights incomplete records so issues are resolved early.
              </p>
            </div>

            <div className="rounded-3xl bg-[#f8fafc] border border-slate-200 p-8 space-y-4 hover:border-emerald-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#001237] text-emerald-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Keep Approvals Distinct
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Separate submission review from final report approval and release. Approving a field
                record confirms its technical adequacy; report release is an independent sign-off.
              </p>
            </div>
          </div>
        </section>

        {/* AI & Human Oversight Principle */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-[36px] bg-[#001237] text-white p-8 sm:p-12 lg:p-16 space-y-6 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Human Oversight Principle
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase max-w-2xl leading-tight">
              AI can assist with identifying potential issues. Authorized people remain responsible for review, approval, and release decisions.
            </h2>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-normal">
              Civora uses AI-assisted analysis to highlight missing fields, flag potential
              inconsistencies, or suggest areas for closer scrutiny. However, AI observations remain
              distinct from confirmed facts. Civora never autonomously approves submissions or releases
              reports without human review.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#18243D] border border-slate-700/80 space-y-2">
                <span className="font-bold uppercase tracking-wider text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
                  AI Advisory Role
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Surfaces potential gaps, flags missing attachments, and points reviewers to areas
                  requiring verification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#18243D] border border-slate-700/80 space-y-2">
                <span className="font-bold uppercase tracking-wider text-blue-300 font-['Encode_Sans_Condensed',sans-serif]">
                  Human Reviewer Authority
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Authorized project professionals make all factual determinations, request
                  clarifications, and execute release sign-offs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Audiences Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
              Designed For Project Teams
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
              A Clearer View for Everyone Involved in Reporting
            </h2>
            <p className="text-sm text-slate-600">
              Civora supports distinct responsibilities across the project reporting lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((aud, idx) => {
              const IconComp = aud.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-[#f8fafc] border border-slate-200/90 p-6 flex flex-col justify-between space-y-4 hover:border-[#4FAAA7] transition-all"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <Badge variant={aud.badgeVariant} size="sm">
                      {aud.title}
                    </Badge>
                    <h3 className="text-lg font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                      {aud.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {aud.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-200">
                    {aud.details.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAAA7] mt-0.5 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center max-w-xl mx-auto">
            <p className="text-[11px] text-slate-500 font-normal">
              Civora aligns claims with its actual access model and available role permissions.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-[36px] bg-[#f8fafc] border border-slate-200 p-8 sm:p-14 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
              Make construction reporting clearer.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
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
