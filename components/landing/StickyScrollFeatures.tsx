'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface StageData {
  id: string;
  stepNumber: string;
  tabLabel: string;
  badgeLabel: string;
  badgeVariant: 'teal' | 'blue' | 'emerald';
  title: string;
  tagline: string;
  description: string;
  project: string;
  location: string;
  regulatoryCode: string;
  bulletPoints: string[];
  ctaLabel: string;
  consoleData: {
    code: string;
    headline: string;
    subhead: string;
    metrics: { label: string; value: string; highlight?: boolean }[];
    statusNote: string;
    floatingBadge: string;
  };
}

const STAGES: StageData[] = [
  {
    id: 'intake',
    stepNumber: '01',
    tabLabel: '01 // Site Intake & Pour Logs',
    badgeLabel: 'Field Intake Verified',
    badgeVariant: 'teal',
    title: 'Centralized Site Intake & Pour Logs',
    tagline: 'Preserve source field records with GPS location and batch tickets.',
    description:
      'Direct transit mixer delivery notes, slump test records, and geotagged pour manifests are captured in a structured workspace—keeping source evidence intact before concrete curing begins.',
    project: 'LAMATA Blue Line Rail Extension Phase 2',
    location: 'Marina to Okokomaiko Viaduct, Lagos',
    regulatoryCode: 'FMWH Highway Manual Vol. 1 & Lagos State Materials Testing Protocol',
    bulletPoints: [
      'Tamper-evident GPS coordinates & timestamped delivery intake',
      'Batch slump test verification (125mm recorded vs 100-150mm design spec)',
      'COREN-registered Resident Site Engineer digital authentication',
    ],
    ctaLabel: 'Review Site Submissions',
    consoleData: {
      code: 'SUB-2026-LMT-042',
      headline: 'Pier 14 Substructure Pour Log',
      subhead: 'Ready-Mix Transit Mixer #TRK-882 &bull; 08:45 AM WAT',
      metrics: [
        { label: 'Mix Grade', value: 'C35/45 Ready-Mix' },
        { label: 'Slump Test', value: '125 mm (PASS)', highlight: true },
        { label: 'Geotag', value: '6.4531° N, 3.3958° E' },
        { label: 'COREN Seal', value: 'R.58492 Validated' },
      ],
      statusNote: 'All batch tickets verified against Lagos State Ministry of Works concrete specifications.',
      floatingBadge: '✓ COREN R.58492 Verified',
    },
  },
  {
    id: 'testing',
    stepNumber: '02',
    tabLabel: '02 // Lab Crushing & Strength',
    badgeLabel: 'UNILAG Certified',
    badgeVariant: 'blue',
    title: 'Quality Verification & Material Lab Crushing',
    tagline: 'Track 7-day and 28-day cube strength margins with accredited labs.',
    description:
      'Crushing specimens are tracked from casting through standard curing tank baths to the hydraulic testing frame. Verified strength curves are cross-checked against design specifications before concrete is cleared.',
    project: 'Eko Atlantic Coastal Revetment & Sea Wall Defense',
    location: 'Victoria Island Coastal Basin, Lagos',
    regulatoryCode: 'BS 8110 / Eurocode 2 Part 1-1 Structural Concrete & BS 1881 Testing Standards',
    bulletPoints: [
      'Specimen curing verified at UNILAG Civil Engineering Materials Laboratory',
      '28-day crushing mean of 34.3 MPa exceeds 30.0 MPa design target by +14.3%',
      'Tamper-evident failure fracture curve uploaded with laboratory certificate',
    ],
    ctaLabel: 'Inspect Crushing Curve',
    consoleData: {
      code: 'LAB-2026-EKO-012',
      headline: '28-Day Concrete Cube Crushing Audit',
      subhead: 'UNILAG Accredited Materials Facility #LAB-NG-012',
      metrics: [
        { label: '7-Day Strength', value: '24.1 MPa (70% Target)' },
        { label: '28-Day Strength', value: '34.3 MPa (+14.3%)', highlight: true },
        { label: 'Specimen Size', value: '3 Cubes (150x150mm)' },
        { label: 'Curing Bath', value: '27°C ± 2°C Standard' },
      ],
      statusNote: 'Strength curve complies with Eurocode 2 marine durability requirements.',
      floatingBadge: '✓ Lab Certified: +14.3% Margin',
    },
  },
  {
    id: 'clarifications',
    stepNumber: '03',
    tabLabel: '03 // Clarifications & Site Instructions',
    badgeLabel: 'Site Clarification Issued',
    badgeVariant: 'teal',
    title: 'Site Instructions & Clarification Governance',
    tagline: 'Highlight discrepancies and issue formal Site Instructions to contractors.',
    description:
      'When rebar spacing differs from structural drawings or mill certificates are missing, Civora surfaces the gap. Resident engineers can issue a formal Site Instruction (SI) with an unalterable audit trail.',
    project: 'FCDA Abuja Ring Road Sector 4 Interchange',
    location: 'Central Area to Airport Expressway, FCT Abuja',
    regulatoryCode: 'ASTM A615 Grade 60 Rebar Specification & FCDA Development Control Manual',
    bulletPoints: [
      'Missing mill certificate on 25mm high-yield consignment automatically surfaced',
      'Site Instruction #SI-048 issued directly to Prime Contractor with required remedy',
      'AI observations remain distinct from engineer judgement under ethical oversight',
    ],
    ctaLabel: 'Track Site Instructions',
    consoleData: {
      code: 'SI-2026-FCDA-048',
      headline: 'Site Instruction: Rebar Mill Certificate Required',
      subhead: 'Consignment: 25mm High-Yield Grade 60 &bull; Pier Cap Reinforcement',
      metrics: [
        { label: 'Defect Type', value: 'Documentation Gap' },
        { label: 'Action Gate', value: 'Hold Pour Sign-Off', highlight: true },
        { label: 'Authority', value: 'Resident Engineer SI' },
        { label: 'FCDA Ref', value: 'FCDA-DC-ENG-2026' },
      ],
      statusNote: 'Human engineering judgement sovereign; hold applied until contractor mill test is uploaded.',
      floatingBadge: '✓ SI-048 Pending Contractor',
    },
  },
  {
    id: 'release',
    stepNumber: '04',
    tabLabel: '04 // Certified IPC & Milestone Clearance',
    badgeLabel: 'Approved for Release',
    badgeVariant: 'emerald',
    title: 'Traceable Project Reports & IPC Clearance',
    tagline: 'Compile verified submittals into client reports and Interim Payment Certificates.',
    description:
      'Approved submittals feed directly into interim valuation schedules and executive stakeholder dossiers. Submission approval remains separate from final report release, ensuring rigorous institutional governance.',
    project: 'Lekki Deep Sea Port Container Terminal 2 Expansion',
    location: 'Lekki Free Trade Zone, Ibeju-Lekki, Lagos',
    regulatoryCode: 'NIQS Conditions of Contract Valuation Standards & Bank PME Sign-Off',
    bulletPoints: [
      'Interim Payment Certificate IPC-09 reconciled with dual-currency breakdown',
      'Co-signed by Supervising Consultant and Bank Project Monitoring Engineer (PME)',
      'Statutory stage compliance verified with LASBCA Form C Stage Clearance',
    ],
    ctaLabel: 'View Executive Dossier',
    consoleData: {
      code: 'IPC-2026-LEKKI-09',
      headline: 'Certified Interim Payment Valuation Dossier',
      subhead: 'Valuation to Date: Work Completed through October 2026',
      metrics: [
        { label: 'Civil Works (₦)', value: '₦184,200,000 NGN', highlight: true },
        { label: 'Procurement ($)', value: '$320,000 USD' },
        { label: 'Statutory Perm', value: 'LASBCA Form C' },
        { label: 'NIQS Sign-Off', value: 'Verified & Certified' },
      ],
      statusNote: 'Approved for disbursement release with full backward traceability to source batch records.',
      floatingBadge: '✓ Approved for IPC Release',
    },
  },
];

export function StickyScrollFeatures() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStage = STAGES[activeIdx];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001237] text-white text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#4FAAA7] animate-pulse" />
          CIVORA PLATFORM SUITE
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase leading-tight">
          From Concrete Pour Slump to Approved IPC.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Civora connects field evidence, UNILAG lab crushing curves, resident engineer instructions, and executive milestone sign-offs in one structured Nigerian audit trail.
        </p>
      </div>

      {/* Stage Selector Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-[#001237] border border-slate-800 shadow-xl max-w-4xl w-full">
          {STAGES.map((stage, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveIdx(idx)}
                className={`flex-1 min-w-[170px] sm:min-w-[200px] px-4 py-3 rounded-xl text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-[#4FAAA7] text-[#001237] shadow-md shadow-[#4FAAA7]/20 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{stage.tabLabel}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#001237] animate-ping" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Showcase Container (Single Unified High-Tech Card) */}
      <div className="relative rounded-[32px] sm:rounded-[40px] bg-[#001237] text-white p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Ambient Radial Teal/Blue Glows */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-[#4FAAA7]/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-[#3B68DE]/15 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Context, Narrative & Checkpoints */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant={activeStage.badgeVariant} size="sm" dot>
                {activeStage.badgeLabel}
              </Badge>
              <span className="text-[11px] font-mono text-slate-400">
                Step {activeStage.stepNumber} of 04
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide leading-tight">
                {activeStage.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#4FAAA7] font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>{activeStage.project} &bull; {activeStage.location}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {activeStage.description}
            </p>

            {/* Checkpoints */}
            <div className="space-y-2.5 pt-1">
              {activeStage.bulletPoints.map((point, pIdx) => (
                <div key={pIdx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#4FAAA7]/20 text-[#4FAAA7] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-slate-200 leading-relaxed font-medium">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Regulatory Reference Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#4FAAA7] shrink-0" />
              <div className="text-[11px] text-slate-300">
                <strong className="text-white font-semibold">Technical Standard:</strong> {activeStage.regulatoryCode}
              </div>
            </div>

            {/* Action CTA Link */}
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold text-[#001237] bg-[#4FAAA7] hover:bg-[#439693] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider shadow-lg transition-all group"
              >
                <span>{activeStage.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Live Telemetry Console */}
          <div className="lg:col-span-6 relative">
            {/* Floating Top Badge (Dojah Style) */}
            <div className="hidden sm:flex absolute -top-4 -right-2 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#001237] border border-[#4FAAA7]/40 shadow-xl animate-float-slow">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                {activeStage.consoleData.floatingBadge}
              </span>
            </div>

            {/* Terminal Window */}
            <div className="rounded-2xl bg-[#18243D] border border-slate-700/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-300 font-semibold ml-2">
                    CIVORA OS // TELEMETRY TERMINAL
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#4FAAA7] px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  LIVE CONSOLE
                </span>
              </div>

              {/* Submittal Title & Subhead */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#4FAAA7]">
                    {activeStage.consoleData.code}
                  </span>
                  <Badge variant={activeStage.badgeVariant} size="sm">
                    Verified
                  </Badge>
                </div>
                <h4 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  {activeStage.consoleData.headline}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {activeStage.consoleData.subhead}
                </p>
              </div>

              {/* 2x2 Telemetry Metric Boxes */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {activeStage.consoleData.metrics.map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                      metric.highlight
                        ? 'bg-[#4FAAA7]/10 border-[#4FAAA7]/40 text-[#4FAAA7]'
                        : 'bg-[#001237] border-slate-700/60 text-white'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      {metric.label}
                    </span>
                    <div className="font-bold font-mono text-xs truncate">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Note Strip */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-[#4FAAA7] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {activeStage.consoleData.statusNote}
                </p>
              </div>

              {/* Terminal Bottom Controls */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#4FAAA7]" />
                  <span>Audit Trail Encrypted</span>
                </span>
                <span className="text-[#4FAAA7] font-semibold">
                  Stage {activeStage.stepNumber} Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
