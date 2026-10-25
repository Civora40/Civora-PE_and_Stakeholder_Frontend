'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  Eye,
  FileEdit,
  History,
  Send,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  User,
  MessageSquare,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { StudioReport, ReportingWorkflowStatus } from '@/lib/types/reporting-studio';

interface ReportingStudioDetailViewProps {
  user: CivoraUser;
  report: StudioReport;
}

export function ReportingStudioDetailView({ user, report }: ReportingStudioDetailViewProps) {
  const isDraft = report.workflowStatus === 'draft' || report.workflowStatus === 'changes_requested';
  const isReleased = report.workflowStatus === 'released';

  const getStatusBadge = (status: ReportingWorkflowStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="blue" size="sm">Draft</Badge>;
      case 'ready_for_review':
        return <Badge variant="teal" size="sm">Ready for Review</Badge>;
      case 'in_review':
        return <Badge variant="slate" size="sm">In Review</Badge>;
      case 'changes_requested':
        return <Badge variant="rose" size="sm">Changes Requested</Badge>;
      case 'approved':
        return <Badge variant="emerald" size="sm">Approved</Badge>;
      case 'released':
        return <Badge variant="emerald" size="sm" dot>Released</Badge>;
      default:
        return <Badge variant="slate" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/engineer/reports/all"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Reports</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                {report.reportNumber}
              </span>
              {getStatusBadge(report.workflowStatus)}
              <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {report.currentVersion}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight">
              {report.title}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{report.projectName}</span>
              <span className="text-slate-300">•</span>
              <span>{report.periodFormatted}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isDraft && (
              <Link
                href={`/engineer/reports/${report.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Resume Editing</span>
              </Link>
            )}

            <Link
              href={`/engineer/reports/${report.id}/preview`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview & Print</span>
            </Link>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-mono block text-[10px]">AUTHOR</span>
            <span className="font-bold text-slate-800">{report.createdByName}</span>
            <span className="text-slate-500 text-[11px] block">{report.authorTitle}</span>
          </div>

          <div>
            <span className="text-slate-400 font-mono block text-[10px]">TEMPLATE SCHEMA</span>
            <span className="font-bold text-slate-800">{report.reportType}</span>
            <span className="text-slate-500 text-[11px] block">
              {report.templateVersion ? `v${report.templateVersion}` : 'Custom'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-mono block text-[10px]">SOURCE EVIDENCE</span>
            <span className="font-bold text-slate-800">
              {report.sourceSubmissionsCount} Submissions
            </span>
            <span className="text-slate-500 text-[11px] block">
              {report.linkedEvidenceCount} Citations
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-mono block text-[10px]">LAST UPDATED</span>
            <span className="font-bold text-slate-800">{report.lastSavedAt}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">
            Executive Summary
          </span>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-sans">
            {report.executiveSummary}
          </p>
        </div>
      </div>

      {/* Sections Summary */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight border-b border-slate-100 pb-3">
          Report Sections ({report.sections.length})
        </h2>

        <div className="space-y-4">
          {report.sections.map((section, idx) => (
            <div key={section.id} className="p-4 rounded-xl border border-slate-200/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  {idx + 1}. {section.title}
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Ready
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
                {section.content || 'No content drafted for this section.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail & History */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <span>Governance Audit Trail ({report.auditTrail.length} Events)</span>
        </h2>

        <div className="space-y-3">
          {report.auditTrail.map((entry) => (
            <div
              key={entry.id}
              className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{entry.action}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600">{entry.actor} ({entry.actorRole})</span>
                </div>
                <p className="text-[11px] text-slate-500">{entry.note}</p>
              </div>

              <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                {entry.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
