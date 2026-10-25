'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  ArrowRight,
  Send,
  Building,
  Layers,
  History,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
  getStudioReports,
  getStudioDrafts,
  getAIAnalysisRuns,
} from '@/lib/services/reporting-studio-service';

interface ReportingStudioOverviewProps {
  user: CivoraUser;
  projects: Project[];
}

export function ReportingStudioOverview({ user, projects }: ReportingStudioOverviewProps) {
  const reports = useMemo(() => getStudioReports(user.assignedProjects), [user.assignedProjects]);
  const drafts = useMemo(() => getStudioDrafts(user.assignedProjects), [user.assignedProjects]);
  const aiRuns = useMemo(() => getAIAnalysisRuns(), []);

  // Summary Metrics computed from authorized dataset
  const metrics = useMemo(() => {
    const draftsCount = reports.filter((r) => r.workflowStatus === 'draft').length;
    const awaitingReviewCount = reports.filter(
      (r) => r.workflowStatus === 'ready_for_review' || r.workflowStatus === 'in_review'
    ).length;
    const changesRequestedCount = reports.filter(
      (r) => r.workflowStatus === 'changes_requested'
    ).length;
    const approvedReleasedCount = reports.filter(
      (r) => r.workflowStatus === 'approved' || r.workflowStatus === 'released'
    ).length;

    return {
      draftsCount,
      awaitingReviewCount,
      changesRequestedCount,
      approvedReleasedCount,
    };
  }, [reports]);

  // Actionable items: changes requested or incomplete drafts
  const actionItems = useMemo(() => {
    return reports.filter(
      (r) => r.workflowStatus === 'changes_requested' || (r.workflowStatus === 'draft' && r.reviewComments.length > 0)
    );
  }, [reports]);

  // Recently submitted items
  const submittedItems = useMemo(() => {
    return reports.filter(
      (r) => r.workflowStatus === 'ready_for_review' || r.workflowStatus === 'in_review'
    );
  }, [reports]);

  return (
    <div className="space-y-8">
      {/* Header with primary actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Encode_Sans_Condensed',sans-serif] text-[#001237] tracking-tight">
            Reporting Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, analyze, and manage project reports from verified project information.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/engineer/reports/ai-analysis"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#3B68DE]" />
            <span>Analyze Project Data</span>
          </Link>
          <Link
            href="/engineer/reports/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Report</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-mono">DRAFTS IN PROGRESS</span>
            <FileEdit className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black font-mono text-[#001237]">{metrics.draftsCount}</div>
          <p className="text-[11px] text-slate-400">Editable project authoring drafts</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-mono">AWAITING REVIEW</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-mono text-[#001237]">{metrics.awaitingReviewCount}</div>
          <p className="text-[11px] text-slate-400">Submitted for peer/lead sign-off</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-mono">CHANGES REQUESTED</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black font-mono text-rose-600">{metrics.changesRequestedCount}</div>
          <p className="text-[11px] text-slate-400">Review comments awaiting revision</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-mono">APPROVED / RELEASED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black font-mono text-[#001237]">{metrics.approvedReleasedCount}</div>
          <p className="text-[11px] text-slate-400">Certified this reporting cadence</p>
        </div>
      </div>

      {/* Action Banner if Changes Requested */}
      {actionItems.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Action Required: Reports Returned with Review Feedback</span>
          </div>
          <div className="divide-y divide-rose-200/60">
            {actionItems.map((item) => (
              <div key={item.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-rose-950 mr-2">{item.reportNumber}</span>
                  <span className="font-semibold text-rose-900">{item.title}</span>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Latest reviewer feedback: "{item.reviewComments[0]?.comments || 'Revisions requested by reviewer'}"
                  </p>
                </div>
                <Link
                  href={`/engineer/reports/${item.id}/edit`}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs whitespace-nowrap self-start sm:self-auto shadow-2xs"
                >
                  Edit & Resubmit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Continue Editing & Recently Submitted */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Continue Editing Recent Drafts */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-[#3B68DE]" />
              <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                Continue Editing Drafts
              </h2>
            </div>
            <Link
              href="/engineer/reports/drafts"
              className="text-xs text-[#3B68DE] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All Drafts</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {drafts.slice(0, 4).map((draft) => (
              <div
                key={draft.id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      {draft.reportNumber}
                    </span>
                    <Badge variant={draft.workflowStatus === 'changes_requested' ? 'rose' : 'blue'} size="sm">
                      {draft.workflowStatus.replace('_', ' ')}
                    </Badge>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {draft.periodFormatted}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{draft.title}</h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{draft.projectName}</span>
                    <span className="text-slate-300">•</span>
                    <span>Saved {draft.lastSavedAt}</span>
                  </p>
                </div>

                <Link
                  href={`/engineer/reports/${draft.id}/edit`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold whitespace-nowrap self-start sm:self-auto transition-colors"
                >
                  Resume Draft
                </Link>
              </div>
            ))}

            {drafts.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No active drafts. Click "Create Report" to start a new report.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Activity & Recently Submitted */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Activity */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3B68DE]" />
                <h3 className="text-sm font-bold text-slate-900 font-condensed tracking-tight">
                  AI Analysis Activity
                </h3>
              </div>
              <Link
                href="/engineer/reports/ai-analysis"
                className="text-xs text-[#3B68DE] font-semibold hover:underline"
              >
                Run Analysis
              </Link>
            </div>

            <div className="space-y-3">
              {aiRuns.slice(0, 2).map((run) => (
                <div
                  key={run.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">
                      {run.projectName}
                    </span>
                    <Badge variant="teal" size="sm">
                      {run.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {run.sourcesCoverage} • {run.findings.length} findings generated
                  </p>
                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">{run.createdAt}</span>
                    <Link
                      href="/engineer/reports/ai-analysis"
                      className="text-[#3B68DE] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Review Findings</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-[#001237] to-[#18243D] text-white p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-sm font-bold font-condensed tracking-tight">
              Reporting Tools Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <Link
                href="/engineer/reports/templates"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-[#4FAAA7]" />
                <span className="font-medium">Templates</span>
              </Link>
              <Link
                href="/engineer/reports/review"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#4FAAA7]" />
                <span className="font-medium">Submissions</span>
              </Link>
              <Link
                href="/engineer/reports/all"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#4FAAA7]" />
                <span className="font-medium">All Reports</span>
              </Link>
              <Link
                href="/engineer/reports/ai-analysis"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#4FAAA7]" />
                <span className="font-medium">AI Insights</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
