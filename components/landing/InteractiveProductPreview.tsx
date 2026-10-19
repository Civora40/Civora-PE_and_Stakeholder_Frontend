'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  Lock,
  Sparkles,
  Layers,
  FileText,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function InteractiveProductPreview() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'assisted' | 'reports'>('submissions');

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#18243D]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-md text-white">
      {/* Top Window Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-300">
              Civora Workspace // Project overview: Riverside Commercial Development
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-[#4FAAA7] border border-white/10">
              Illustrative interface
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#001237] p-1 rounded-lg border border-slate-700/80 text-xs">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'submissions'
                ? 'bg-[#3B68DE] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recent submissions
          </button>
          <button
            onClick={() => setActiveTab('assisted')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'assisted'
                ? 'bg-[#3B68DE] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4FAAA7]" />
            AI-assisted checks
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-[#3B68DE] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reports awaiting approval
          </button>
        </div>
      </div>

      {/* Illustrative Data Notice Strip */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 mb-4 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#4FAAA7]" />
          <span>Fictional sample data shown for demonstration purposes (Illustrative data)</span>
        </div>
        <span className="font-mono text-slate-400">Reporting group: Site Engineering</span>
      </div>

      {/* Tab 1: Recent Submissions & Submission Review */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Submission Inspection Card */}
            <div className="lg:col-span-2 rounded-xl bg-[#001237] border border-slate-800 p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-semibold text-[#4FAAA7]">
                      SUB-2026-RIV-01
                    </span>
                    <Badge variant="amber" size="sm" dot>
                      Needs information
                    </Badge>
                    <Badge variant="blue" size="sm">
                      Site Engineering
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Riverside Commercial Development — Foundation Pours & Break Logs
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Received: Today 08:30 &bull; Source: Site Engineering Group &bull; Attachments: 2 PDF records
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider transition-colors">
                    View submission
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-[#4FAAA7] hover:bg-[#439693] text-[#001237] text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider transition-colors">
                    Review details
                  </button>
                </div>
              </div>

              {/* Outstanding Details Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Review note: Additional site details required</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Compression cylinder test records received. Field placement batch ticket and slump
                  verification photos are missing from the intake packet. Awaiting clarification from
                  the site field engineer before review can be finalized.
                </p>
              </div>

              {/* Status Breakdown Table */}
              <div className="rounded-lg border border-slate-700/60 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#18243D] text-slate-300 font-semibold border-b border-slate-700">
                    <tr>
                      <th className="p-2.5">Item Record</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Review State</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    <tr>
                      <td className="p-2.5 font-medium">Pour 3A Compression Break Tests</td>
                      <td className="p-2.5 text-slate-400">Lab Results</td>
                      <td className="p-2.5">
                        <span className="text-blue-400 font-medium">Awaiting review</span>
                      </td>
                      <td className="p-2.5 text-[#4FAAA7] font-medium">Inspect record</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Cylinder Slump & Air Void Records</td>
                      <td className="p-2.5 text-slate-400">Field Logs</td>
                      <td className="p-2.5">
                        <span className="text-amber-400 font-medium">Needs information</span>
                      </td>
                      <td className="p-2.5 text-amber-300 font-medium">Request clarification</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Rebar Placement Verification Sheet</td>
                      <td className="p-2.5 text-slate-400">Quality Checklist</td>
                      <td className="p-2.5">
                        <span className="text-emerald-400 font-medium">Approved submissions</span>
                      </td>
                      <td className="p-2.5 text-slate-400">Verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Overview Summary */}
            <div className="rounded-xl bg-[#001237] border border-slate-800 p-5 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-['Encode_Sans_Condensed',sans-serif]">
                  Project Overview
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#18243D] border border-slate-700/60">
                    <span className="text-slate-400 text-[11px] block">Project Name</span>
                    <span className="text-white font-bold text-sm">Riverside Commercial Development</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#18243D] border border-slate-700/60">
                    <span className="text-slate-400 text-[11px] block">Active Submissions</span>
                    <span className="text-white font-bold text-sm">14 Tracked in Workspace</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#18243D] border border-slate-700/60">
                    <span className="text-slate-400 text-[11px] block">Review Bottlenecks</span>
                    <span className="text-amber-300 font-bold text-sm">2 Require Site Clarification</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300">
                Keep the source information visible. Make the next action clear.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI-Assisted Checks */}
      {activeTab === 'assisted' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/40 p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#4FAAA7] flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    AI-Assisted Check: Missing Supporting Field Documentation
                  </span>
                  <Badge variant="amber" size="sm">
                    Observation for Reviewer
                  </Badge>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  The incoming submission contains concrete compression results, but is missing
                  batch ticket timestamps and batch water-cement ratio logs. This potential gap has
                  been flagged for human review.
                </p>
                <div className="p-3 rounded-lg bg-[#001237] border border-amber-500/20 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-[#4FAAA7]">Suggested Action:</div>
                  <p>
                    Reviewer may request clarification or upload the missing delivery tickets before
                    marking the submission as approved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#001237] border border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">
                Ethical Human Oversight Principle:
              </span>
              <p className="text-slate-400">
                AI observations remain distinct from confirmed facts and do not replace the
                reviewer’s judgement. Authorized personnel hold final review and release authority.
              </p>
            </div>
            <Link
              href="/governance"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-xs whitespace-nowrap"
            >
              Learn More
            </Link>
          </div>
        </div>
      )}

      {/* Tab 3: Reports Awaiting Approval */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#001237] border border-slate-800 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-[#4FAAA7]">
                  RPT-RIV-2026-WK42
                </span>
                <h3 className="text-base font-bold text-white">
                  Riverside Commercial Development — Weekly Site Engineering Progress Report
                </h3>
              </div>
              <Badge variant="amber" size="md" dot>
                Report status: Awaiting final approval
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#18243D] border border-slate-700/60">
                <span className="text-slate-400 block mb-1">Approved Submissions Included</span>
                <span className="text-base font-bold text-white">12 Verified Items</span>
              </div>
              <div className="p-3 rounded-lg bg-[#18243D] border border-slate-700/60">
                <span className="text-slate-400 block mb-1">Items Excluded / Pending</span>
                <span className="text-base font-bold text-amber-300">2 Needs Information</span>
              </div>
              <div className="p-3 rounded-lg bg-[#18243D] border border-slate-700/60">
                <span className="text-slate-400 block mb-1">Report Path</span>
                <span className="text-base font-bold text-emerald-400">Ready for report review</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#18243D]/60 border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Lock className="w-4 h-4 text-[#4FAAA7]" />
                <span>Workflow Rule: Approving an individual submission does not automatically approve the final report.</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                An authorized person reviews the final report and approves its release to the
                intended recipients. Source submissions remain traceable from every report section.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
