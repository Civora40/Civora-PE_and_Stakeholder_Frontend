'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  ChevronLeft,
  Calendar,
  Building,
  Clock,
  Download,
  Shield,
  FileText,
  CheckCircle2,
  ExternalLink,
  Layers,
  MapPin,
  Lock,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { StakeholderReleasedReport } from '@/lib/mock-data/stakeholder';

interface ReportDetailViewProps {
  user: CivoraUser;
  report: StakeholderReleasedReport;
}

export function ReportDetailView({ user, report }: ReportDetailViewProps) {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownload = () => {
    setDownloadNotice(`Downloading ${report.reportNumber} PDF (${report.fileSize})...`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Toast Notice */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Download className="w-4 h-4 text-[#4FAAA7] animate-bounce" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          href="/stakeholder/reports"
          className="inline-flex items-center gap-1 hover:text-[#001237] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Released Reports</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-slate-700">{report.reportNumber}</span>
      </div>

      {/* Report Header Card (Section 9) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4FAAA7] bg-[#001237] px-2 py-0.5 rounded">
                {report.reportNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {report.version} &bull; Released Snapshot
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Immutable Version
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Project: <strong className="text-slate-700">{report.projectName}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Period: <strong className="text-slate-700">{report.period}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Release Date: <strong className="text-slate-700">{report.releaseDate}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-[#4FAAA7]" />
              <span>Download Signed PDF ({report.fileSize})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Report Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Approved Executive Summary (Section 9) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Approved Executive Summary
              </h2>
            </div>
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {report.executiveSummary}
            </div>
          </div>

          {/* Report Sections Snapshot */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Certified Compliance Sections
            </h2>

            <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl overflow-hidden text-xs">
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>1. Structural Concrete & Reinforcement Verification</span>
                  <span className="text-emerald-600 font-mono text-[11px]">Pass &bull; 100% Verified</span>
                </div>
                <p className="text-slate-500">
                  Batch test crushing records meet Eurocode 2 C30/37 characteristic cube strengths.
                </p>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>2. Geotechnical & Foundation Settlement Inspection</span>
                  <span className="text-emerald-600 font-mono text-[11px]">Pass &bull; 0.2mm within tolerance</span>
                </div>
                <p className="text-slate-500">
                  Piezometer and settlement pin optical levels confirm negligible displacement across all foundation pads.
                </p>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>3. Statutory Permits & Municipal LASBCA Clearances</span>
                  <span className="text-emerald-600 font-mono text-[11px]">Authorized & Valid</span>
                </div>
                <p className="text-slate-500">
                  Site permit endorsement renewed with statutory planning authority through next fiscal quarter.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Verification Dossier & Security Stamp */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#4FAAA7]" />
              <h3 className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Release Authorization
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sign-Off Status:</span>
                <span className="font-bold text-emerald-700">Released by Project Authority</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Snapshot Integrity:</span>
                <span className="font-mono text-[11px] text-slate-700">Immutable Cryptographic Seal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">File Attachment:</span>
                <span className="font-mono text-[11px] text-slate-700">{report.fileSize} (PDF)</span>
              </div>
            </div>
          </div>

          {/* Quick link to project */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Associated Capital Project
            </span>
            <h4 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
              {report.projectName}
            </h4>
            <Link
              href={`/stakeholder/projects/${report.projectId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B68DE] hover:underline"
            >
              <span>Open Project Overview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
