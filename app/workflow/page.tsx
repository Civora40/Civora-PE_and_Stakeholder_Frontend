import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  Inbox,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Workflow | Civora — Intelligent Construction. Clearer Control.',
  description:
    'Learn how Civora organizes construction reporting into defined stages: Capture, Review, Prepare, and Approve & Release.',
};

export default function WorkflowPage() {
  const steps = [
    {
      number: '01',
      title: 'Capture',
      status: 'Received',
      badgeVariant: 'teal' as const,
      icon: Inbox,
      description:
        'Bring site updates and supporting evidence into a centralized project record.',
      details: [
        'Associate incoming updates with project, reporting group, and received time',
        'Retain original attachments, lab certificates, and field notes without manual re-keying',
        'Establish an immutable intake record for complete traceability',
      ],
      illustrativeState: 'Status: Received • Ingestion timestamp logged',
    },
    {
      number: '02',
      title: 'Review',
      status: 'Under review',
      badgeVariant: 'blue' as const,
      icon: Search,
      description:
        'Check the available information, identify missing details, and record reviewer decisions.',
      details: [
        'Identify incomplete submissions and request needed clarification promptly',
        'Surface potential gaps and inconsistencies with AI-assisted checks for human inspection',
        'Distinguish items awaiting review from those that have been approved',
      ],
      illustrativeState: 'Status: Under review • Reviewer inspection in progress',
    },
    {
      number: '03',
      title: 'Prepare',
      status: 'Ready for report review',
      badgeVariant: 'amber' as const,
      icon: FileSpreadsheet,
      description:
        'Build a structured report from submissions that have passed the required review.',
      details: [
        'Compile report sections directly from approved submissions',
        'Ensure full audit trails linking each report figure back to source submissions',
        'Flag any unresolved questions before sending for executive sign-off',
      ],
      illustrativeState: 'Status: Ready for report review • Draft compiled',
    },
    {
      number: '04',
      title: 'Approve & Release',
      status: 'Approved for release',
      badgeVariant: 'emerald' as const,
      icon: ShieldCheck,
      description:
        'An authorized person reviews the final report and approves its release to the intended recipients.',
      details: [
        'Authorized personnel conduct a final governance and completeness review',
        'Dual-custody safeguard: submission sign-off is kept strictly separate from report release',
        'Release reports to external stakeholders with verifiable approval timestamps',
      ],
      illustrativeState: 'Status: Approved for release • Released to authorized stakeholders',
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
                  How It Works
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#001237] font-['Encode_Sans_Condensed',sans-serif] leading-[1.05] uppercase">
                A clearer path from site update to final report.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Civora organizes the reporting process into defined stages, helping teams understand
                what has arrived, what needs attention, and what is ready for approval.
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
                  href="/governance"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-[#001237] bg-white border border-slate-200 hover:bg-slate-50 transition-colors font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-xs"
                >
                  <span>Our Governance Model</span>
                  <ArrowRight className="w-4 h-4 text-[#4FAAA7]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-[28px] sm:rounded-[32px] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1/1] shadow-2xl border border-slate-200 group">
              <Image
                src="/images/architectural_model.jpg"
                alt="Civora 4-Stage Construction Workflow"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001237]/85 via-[#001237]/20 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-sm">
                  4-Stage Progression
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#001237]/85 backdrop-blur-md border border-white/15 text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif] mb-1">
                  Sequential Quality Gates
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  Capture &bull; Review &bull; Prepare &bull; Approve & Release with segregated sign-off boundaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Defined Stages */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.number}
                    className="rounded-3xl bg-[#f8fafc] border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#4FAAA7] transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="w-10 h-10 rounded-xl bg-[#001237] text-[#4FAAA7] font-black text-sm flex items-center justify-center font-mono">
                          {step.number}
                        </span>
                        <Badge variant={step.badgeVariant} size="sm">
                          {step.status}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        {step.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {step.description}
                      </p>

                      <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAAA7] mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-500">
                      {step.illustrativeState}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Critical Workflow Governance Note */}
            <div className="rounded-3xl bg-[#001237] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2 text-[#4FAAA7]">
                    <Lock className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
                      Core Governance Rule
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Approving an individual submission does not automatically approve the final report.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Submission review ensures that site evidence is vetted for technical validity.
                    Final report approval ensures that the synthesized intelligence is complete,
                    governed, and formally authorized before release to external parties.
                  </p>
                </div>

                <Link
                  href="/governance"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-[#001237] bg-[#4FAAA7] hover:bg-[#439693] transition-colors uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider flex-shrink-0"
                >
                  <span>Learn More on Governance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Lifecycle Comparison */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif]">
              Status Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
              Clear Labels at Every Point of the Process
            </h2>
            <p className="text-sm text-slate-600">
              Teams always know what has arrived, what needs clarification, and what is approved.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Stage 1 State
              </span>
              <div className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Received
              </div>
              <p className="text-xs text-slate-600">
                Logged in the system with source attachments preserved.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                Stage 2 State
              </span>
              <div className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Under Review
              </div>
              <p className="text-xs text-slate-600">
                Inspected by reviewers; missing details marked for clarification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono">
                Stage 3 State
              </span>
              <div className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Ready for report review
              </div>
              <p className="text-xs text-slate-600">
                Compiled from approved submissions, awaiting authorized release.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                Stage 4 State
              </span>
              <div className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Approved for release
              </div>
              <p className="text-xs text-slate-600">
                Formally signed off by authorized personnel and released.
              </p>
            </div>
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
