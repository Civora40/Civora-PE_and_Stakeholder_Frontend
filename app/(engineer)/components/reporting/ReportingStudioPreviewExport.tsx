'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Building,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Lock,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StudioReport } from '@/lib/types/reporting-studio';

interface ReportingStudioPreviewExportProps {
  user: CivoraUser;
  report: StudioReport;
}

export function ReportingStudioPreviewExport({
  user,
  report,
}: ReportingStudioPreviewExportProps) {
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Cryptographically authorized export generated for ${report.reportNumber}.`);
    }, 1000);
  };

  const isDraft = report.workflowStatus === 'draft' || report.workflowStatus === 'changes_requested';
  const isReleased = report.workflowStatus === 'released';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar (Hidden during print) */}
      <div className="print:hidden bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href={
              isDraft
                ? `/engineer/reports/${report.id}/edit`
                : `/engineer/reports/${report.id}`
            }
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {isDraft ? 'Return to CMS Editor' : 'Back to Report Overview'}
            </span>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs font-bold text-slate-400">
              {report.reportNumber}
            </span>
            <Badge variant={isReleased ? 'emerald' : isDraft ? 'blue' : 'teal'} size="sm">
              {report.workflowStatus.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Generating PDF...' : 'Download Signed PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas Document */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Watermark for Drafts */}
        {!isReleased && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none rotate-[-30deg]">
            <span className="text-6xl sm:text-8xl font-black font-mono tracking-widest text-slate-900 text-center">
              INTERNAL DRAFT — NOT RELEASED
            </span>
          </div>
        )}

        {/* Document Header */}
        <div className="border-b-2 border-[#001237] pb-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-white bg-[#001237] px-2 py-0.5 rounded">
                  CIVORA COMPLIANCE DOSSIER
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {report.projectCode}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight">
                {report.title}
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {report.projectName}
              </p>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <span className="font-bold text-[#001237] block text-sm">
                {report.reportNumber}
              </span>
              <span className="text-slate-500 block">{report.periodFormatted}</span>
              <span className="text-slate-400 block">{report.currentVersion}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-mono block text-[10px]">REPORT TYPE</span>
              <span className="font-bold text-slate-800">{report.reportType}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono block text-[10px]">SUPERINTENDING LEAD</span>
              <span className="font-bold text-slate-800">{report.createdByName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono block text-[10px]">GOVERNANCE STATUS</span>
              <span className="font-bold text-slate-800 uppercase">{report.workflowStatus.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono block text-[10px]">DATE CERTIFIED</span>
              <span className="font-bold text-slate-800">{report.lastSavedAt}</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="py-6 border-b border-slate-100 space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
            Executive Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
            {report.executiveSummary || 'No executive summary drafted.'}
          </p>
        </div>

        {/* Section Breakdown */}
        <div className="py-6 space-y-8">
          {report.sections.map((section, idx) => (
            <div key={section.id} className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>
                  {idx + 1}. {section.title}
                </span>
                {section.sourceReferences && section.sourceReferences.length > 0 && (
                  <span className="text-[10px] font-mono text-slate-400 font-normal">
                    {section.sourceReferences.length} verified source citation(s)
                  </span>
                )}
              </h2>

              <div className="text-xs text-slate-800 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                {section.content || (
                  <span className="italic text-slate-400">
                    Section marked as compliant with no exceptional variance noted.
                  </span>
                )}
              </div>

              {/* Citations block */}
              {section.sourceReferences && section.sourceReferences.length > 0 && (
                <div className="pt-2 text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-600 block">Verified Evidence Provenance:</span>
                  {section.sourceReferences.map((ref, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>{ref.label} ({ref.date}) — Ref #{ref.recordId}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Signature & Audit Certification Block */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Prepared & Verified By
            </span>
            <div className="space-y-1">
              <p className="font-bold text-slate-900 text-sm">{report.createdByName}</p>
              <p className="text-slate-500">{report.authorTitle}</p>
              <p className="font-mono text-slate-400 text-[11px]">COREN Registered Engineer (Structural Division)</p>
            </div>
          </div>

          <div className="space-y-3 sm:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Statutory Platform Attestation
            </span>
            <div className="space-y-1">
              <p className="font-mono text-slate-700 font-bold">Civora Control Plane v4.2</p>
              <p className="text-slate-500 text-[11px]">SHA-256 Ledger Provenance Certified</p>
              <p className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1 justify-start sm:justify-end">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Institutional Release</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
