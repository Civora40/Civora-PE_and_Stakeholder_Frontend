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
  Lock,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import {
  StudioReport,
  ReportLayoutSettings,
  PaperSize,
  PageOrientation,
} from '@/lib/types/reporting-studio';
import { DEFAULT_REPORT_LAYOUT_SETTINGS } from '@/lib/services/reporting-studio-service';

interface ReportingStudioPreviewExportProps {
  user: CivoraUser;
  report: StudioReport;
}

{/* Official Civora Document Watermark for Every Page */}
function CivoraWatermark({
  isReleased,
  workflowStatus,
  customText,
  theme = 'light',
}: {
  isReleased: boolean;
  workflowStatus: string;
  customText?: string;
  theme?: 'light' | 'dark';
}) {
  const text =
    customText ||
    (isReleased
      ? 'CIVORA CONTROL PLANE • VERIFIED STATUTORY AUDIT • CONTRACTUAL RECORD'
      : workflowStatus === 'ready_for_review'
      ? 'CIVORA CONTROL PLANE • STATUTORY PEER REVIEW • RESTRICTED'
      : 'CIVORA CONTROL PLANE • INTERNAL WORKING DRAFT • NOT CONTRACTUALLY RELEASED');

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-0 print:opacity-100">
      <div
        className={`rotate-[-26deg] flex flex-col items-center gap-5 transition-opacity ${
          theme === 'dark'
            ? 'opacity-[0.06] text-white'
            : 'opacity-[0.055] text-slate-900'
        }`}
      >
        <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          <img
            src="/images/civora_watermark_icon.png"
            alt="Civora Watermark"
            className={`w-full h-full object-contain ${
              theme === 'dark' ? 'brightness-0 invert' : 'contrast-125'
            }`}
          />
        </div>
        <div className="text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black font-['Encode_Sans_Condensed',sans-serif] tracking-[0.3em] uppercase block">
            CIVORA
          </span>
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase block">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ReportingStudioPreviewExport({
  user,
  report,
}: ReportingStudioPreviewExportProps) {
  const [downloading, setDownloading] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(100);

  const layout: ReportLayoutSettings = report.layoutSettings || DEFAULT_REPORT_LAYOUT_SETTINGS;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate real PDF generation and trigger standard print dialog
      window.print();
    }, 600);
  };

  const isDraft = report.workflowStatus === 'draft' || report.workflowStatus === 'changes_requested';
  const isReleased = report.workflowStatus === 'released';

  // Compute paper width and height in mm based on paper size and orientation
  const isLandscape = layout.orientation === 'LANDSCAPE';
  const paperDimensionsMm: Record<PaperSize, { width: number; height: number }> = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    LETTER: { width: 215.9, height: 279.4 },
    LEGAL: { width: 215.9, height: 355.6 },
    A5: { width: 148, height: 210 },
  };

  const baseDim = paperDimensionsMm[layout.paperSize] || paperDimensionsMm.A4;
  const sheetWidthMm = isLandscape ? baseDim.height : baseDim.width;
  const sheetHeightMm = isLandscape ? baseDim.width : baseDim.height;

  // Approximate page numbers for TOC
  const totalPagesEstimate = (layout.coverPage.enabled ? 1 : 0) + (layout.tableOfContents.enabled ? 1 : 0) + Math.max(2, Math.ceil(report.sections.length / 2));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Command Bar (Hidden during print) */}
      <div className="print:hidden bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={isDraft ? `/engineer/reports/${report.id}/edit` : `/engineer/reports/${report.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isDraft ? 'Return to CMS Editor' : 'Back to Report Overview'}</span>
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href={`/engineer/reports/${report.id}/settings`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Page Setup ({layout.paperSize} {layout.orientation.toLowerCase()})</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs font-bold text-slate-400">{report.reportNumber}</span>
            <Badge variant={isReleased ? 'emerald' : isDraft ? 'blue' : 'teal'} size="sm">
              {report.workflowStatus.replace('_', ' ').toUpperCase()}
            </Badge>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Margins: {layout.margins.top}mm • Font: {layout.typography.fontFamily} {layout.typography.fontSizePt}pt
            </span>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 text-xs">
            <button
              onClick={() => setZoomScale(Math.max(50, zoomScale - 10))}
              title="Zoom Out"
              className="p-1 text-slate-600 hover:text-slate-900"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-mono font-bold text-slate-600">{zoomScale}%</span>
            <button
              onClick={() => setZoomScale(Math.min(130, zoomScale + 10))}
              title="Zoom In"
              className="p-1 text-slate-600 hover:text-slate-900"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

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
            <span>{downloading ? 'Preparing PDF...' : 'Download Signed PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container with Zoom scaling */}
      <div className="flex justify-center overflow-x-auto overflow-y-auto no-scrollbar h-[calc(100vh-220px)] p-4 sm:p-6 bg-slate-200/60 rounded-2xl print:bg-transparent print:p-0 print:h-auto">
        <div
          style={{
            transform: `scale(${zoomScale / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
          }}
          className="space-y-8 print:space-y-0 print:transform-none"
        >
          {/* ========================================================= */}
          {/* PAGE 1: BRANDED COVER PAGE (Multi-Template Supported)     */}
          {/* ========================================================= */}
          {layout.coverPage.enabled && (
            <>
              {/* PRESET 1: ARCHITECTURAL DARK SPLIT (ANNUAL REPORT STYLE) */}
              {layout.coverPage.preset === 'architectural_dark' && (
                <div
                  style={{
                    width: `${sheetWidthMm}mm`,
                    minHeight: `${sheetHeightMm}mm`,
                    height: `${sheetHeightMm}mm`,
                  }}
                  className="bg-[#1e2433] text-white shadow-xl relative flex flex-col justify-between print:shadow-none print:break-after-page print:w-full print:min-h-screen print:h-screen overflow-hidden"
                >
                  {/* Top Portion (approx 57% of A4 page): Digital Cybernetic Grid Background with massive bold typography */}
                  <div
                    className="flex-[57] p-12 sm:p-16 flex flex-col justify-start relative z-10 bg-cover bg-center overflow-hidden"
                    style={{
                      backgroundImage: `url('/images/cover_top_bg.png')`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[#0B132B]/35 pointer-events-none" />
                    <div className="relative z-10 mt-4 sm:mt-8">
                      <h1 className="text-6xl sm:text-7xl lg:text-[80px] font-black font-['Encode_Sans_Condensed',sans-serif] tracking-[-0.03em] uppercase leading-[0.91] text-white drop-shadow-md">
                        {layout.coverPage.headlinePrimary ? (
                          <span className="whitespace-pre-line">{layout.coverPage.headlinePrimary}</span>
                        ) : (
                          <>
                            ANNUAL
                            <br />
                            REPORT
                          </>
                        )}
                      </h1>
                      <p className="text-2xl sm:text-3xl font-light text-white font-sans tracking-normal mt-7 sm:mt-9 max-w-xl leading-snug drop-shadow-sm">
                        {layout.coverPage.headlineSecondary ? (
                          <span className="whitespace-pre-line">{layout.coverPage.headlineSecondary}</span>
                        ) : (
                          <>
                            Construction Progress &amp;
                            <br />
                            Performance
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Portion (approx 43% of A4 page): Modern Curved Glass Curtain-Wall Skyscraper Facade */}
                  <div
                    className="flex-[43] min-h-[290px] sm:min-h-[350px] relative bg-cover bg-center flex flex-col justify-end p-10 sm:p-14 overflow-hidden"
                    style={{
                      backgroundImage: `url(${layout.coverPage.projectImageUrl || '/images/curved_glass_facade.jpg'})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161c28]/95 via-[#161c28]/40 to-transparent" />

                    <div className="relative z-10 flex items-end justify-between w-full">
                      {/* Bottom-Left: Civora Brand Icon + Title/Project */}
                      <div className="flex items-center gap-3.5">
                        <img
                          src="/images/civora_watermark_icon.png"
                          alt="Civora"
                          className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-md brightness-200"
                        />
                        <div className="flex flex-col">
                          <span className="font-black text-white text-base sm:text-lg tracking-wider leading-tight font-['Encode_Sans_Condensed',sans-serif]">
                            CIVORA
                          </span>
                          <span className="text-[11px] sm:text-xs font-medium text-slate-300 tracking-wider font-sans mt-0.5">
                            {report.projectName ? report.projectName.split('—')[0].trim() : 'Construction Control'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom-Right: year + 2025/26 (matching reference exact layout) */}
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-light text-slate-200 tracking-normal block lowercase font-sans leading-tight">
                          year
                        </span>
                        <span className="text-6xl sm:text-7xl lg:text-[78px] font-black text-white tracking-tight font-sans block leading-none mt-1">
                          {layout.coverPage.periodYearDisplay || '2025/26'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRESET 2: CIVORA STANDARD CORPORATE DOSSIER */}
              {layout.coverPage.preset === 'civora_standard' && (
                <div
                  style={{
                    width: `${sheetWidthMm}mm`,
                    minHeight: `${sheetHeightMm}mm`,
                    padding: `${layout.margins.top}mm ${layout.margins.right}mm ${layout.margins.bottom}mm ${layout.margins.left}mm`,
                  }}
                  className="bg-white shadow-xl relative flex flex-col justify-between print:shadow-none print:break-after-page print:w-full print:min-h-screen"
                >
                  <div className="space-y-6 relative z-10">
                    {layout.coverPage.showLogo && (
                      <div className="flex items-center justify-between border-b-2 border-[#001237] pb-4">
                        <CivoraLogo size="md" theme="light" variant="full" showTagline={false} />
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                            STATUTORY COMPLIANCE DOSSIER
                          </span>
                          <span className="text-xs font-mono font-bold text-[#3B68DE]">{report.projectCode}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-14 pb-8 space-y-4">
                      <div className="inline-block bg-[#001237] text-white text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded">
                        {report.reportType}
                      </div>

                      <h1 className="text-4xl sm:text-5xl font-extrabold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight leading-tight">
                        {report.title}
                      </h1>

                      <p className="text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
                        {report.projectName} — Asset Delivery & Statutory Engineering Verification
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-12 border-t border-slate-200 relative z-10">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Prepared By</span>
                        <p className="font-bold text-slate-900 mt-0.5">{report.createdByName}</p>
                        <span className="text-[11px] text-slate-500">{report.authorTitle}</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Reporting Cadence</span>
                        <p className="font-bold text-slate-900 mt-0.5">{report.periodFormatted}</p>
                        <span className="text-[11px] text-slate-500">Document Ref: {report.reportNumber}</span>
                      </div>

                      {layout.coverPage.showReviewers && (
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Technical Review</span>
                          <p className="font-bold text-slate-900 mt-0.5">
                            {report.reviewComments.length > 0 ? report.reviewComments[0].reviewerName : 'Pending Formal Peer Review'}
                          </p>
                          <span className="text-[11px] text-slate-500">Supervising Structural Engineer (COREN)</span>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Document Status</span>
                        <div className="mt-0.5">
                          <Badge variant={isReleased ? 'emerald' : isDraft ? 'blue' : 'teal'} size="sm">
                            {report.workflowStatus.replace('_', ' ').toUpperCase()} • {report.currentVersion}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {layout.coverPage.showConfidentiality && (
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{layout.coverPage.confidentialityLabel}</span>
                        <span>{layout.coverPage.customTagline}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PRESET 3: PROJECT IMAGE FULL BLEED */}
              {layout.coverPage.preset === 'project_image' && (
                <div
                  style={{
                    width: `${sheetWidthMm}mm`,
                    minHeight: `${sheetHeightMm}mm`,
                    backgroundImage: `url(${layout.coverPage.projectImageUrl || '/images/hero_tower.jpg'})`,
                  }}
                  className="bg-cover bg-center text-white shadow-xl relative flex flex-col justify-between p-12 print:shadow-none print:break-after-page print:w-full print:min-h-screen overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#001237]/90 via-[#001237]/75 to-[#001237]/95" />

                  <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-4">
                    <CivoraLogo size="md" theme="dark" variant="full" showTagline={false} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      {report.projectCode}
                    </span>
                  </div>

                  <div className="relative z-10 my-auto py-12 space-y-4">
                    <span className="inline-block px-3 py-1 rounded bg-[#4FAAA7]/20 border border-[#4FAAA7]/40 text-[#4FAAA7] text-xs font-mono font-bold uppercase tracking-widest">
                      {report.reportType}
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black font-['Encode_Sans_Condensed',sans-serif] text-white tracking-tight leading-tight">
                      {report.title}
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-xl">
                      {report.projectName}
                    </p>
                  </div>

                  <div className="relative z-10 pt-6 border-t border-white/20 flex items-end justify-between text-xs font-mono text-slate-300">
                    <div>
                      <span className="block font-bold text-white">{report.createdByName}</span>
                      <span>{report.authorTitle}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-white">{report.periodFormatted}</span>
                      <span>{report.reportNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PRESET 4: TECHNICAL REPORT & BLUEPRINT */}
              {layout.coverPage.preset === 'technical_report' && (
                <div
                  style={{
                    width: `${sheetWidthMm}mm`,
                    minHeight: `${sheetHeightMm}mm`,
                    padding: `${layout.margins.top}mm ${layout.margins.right}mm ${layout.margins.bottom}mm ${layout.margins.left}mm`,
                  }}
                  className="bg-white shadow-xl relative flex flex-col justify-between print:shadow-none print:break-after-page print:w-full print:min-h-screen border-8 border-slate-900"
                >
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b-4 border-slate-900 pb-4">
                      <CivoraLogo size="sm" theme="light" variant="full" showTagline={false} />
                      <div className="text-right font-mono">
                        <span className="text-xs font-black block">COREN STATUTORY RECORD</span>
                        <span className="text-[10px] text-slate-600">{report.reportNumber}</span>
                      </div>
                    </div>

                    <div className="pt-10 pb-6 space-y-3 font-mono">
                      <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                        ENGINEERING ASSESSMENT & SITE VERIFICATION
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase font-sans tracking-tight">
                        {report.title}
                      </h1>
                      <div className="p-3 bg-slate-100 border border-slate-300 text-xs font-mono">
                        PROJECT: {report.projectName} [{report.projectCode}]
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 border-t-2 border-slate-900 pt-4 font-mono text-[11px] grid grid-cols-2 gap-4">
                    <div className="p-3 border border-slate-300 space-y-1">
                      <span className="font-bold block text-slate-500 text-[10px]">SIGN-OFF ENGINEER</span>
                      <p className="font-bold text-slate-900">{report.createdByName}</p>
                      <p className="text-slate-500 text-[10px]">{report.authorTitle}</p>
                    </div>
                    <div className="p-3 border border-slate-300 space-y-1 text-right">
                      <span className="font-bold block text-slate-500 text-[10px]">VERIFICATION STAMP</span>
                      <p className="font-bold text-emerald-700">COREN VERIFIED: YES</p>
                      <p className="text-slate-500 text-[10px]">{report.lastSavedAt}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PRESET 5: EXECUTIVE BRIEF */}
              {layout.coverPage.preset === 'executive_brief' && (
                <div
                  style={{
                    width: `${sheetWidthMm}mm`,
                    minHeight: `${sheetHeightMm}mm`,
                    padding: `${layout.margins.top}mm ${layout.margins.right}mm ${layout.margins.bottom}mm ${layout.margins.left}mm`,
                  }}
                  className="bg-white shadow-xl relative flex flex-col justify-between print:shadow-none print:break-after-page print:w-full print:min-h-screen border-l-[16px] border-[#001237]"
                >
                  <div className="space-y-8 relative z-10 pl-6">
                    <CivoraLogo size="md" theme="light" variant="full" showTagline={false} />

                    <div className="pt-8 space-y-3">
                      <span className="text-xs font-mono font-bold tracking-widest text-[#4FAAA7] uppercase block">
                        EXECUTIVE BRIEFING
                      </span>
                      <h1 className="text-4xl sm:text-5xl font-black font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight">
                        {report.title}
                      </h1>
                      <p className="text-base text-slate-600 font-medium">{report.projectName}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 block mb-1">Executive Summary</span>
                      {report.executiveSummary}
                    </div>
                  </div>

                  <div className="relative z-10 pl-6 pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>{report.reportNumber}</span>
                    <span>{report.periodFormatted}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* PAGE 2: TABLE OF CONTENTS & DOCUMENT CONTROL              */}
          {/* ========================================================= */}
          {layout.tableOfContents.enabled && (
            <div
              style={{
                width: `${sheetWidthMm}mm`,
                minHeight: `${sheetHeightMm}mm`,
                padding: `${layout.margins.top}mm ${layout.margins.right}mm ${layout.margins.bottom}mm ${layout.margins.left}mm`,
              }}
              className="bg-white shadow-xl relative flex flex-col justify-between print:shadow-none print:break-after-page print:w-full print:min-h-screen overflow-hidden"
            >
              <CivoraWatermark
                isReleased={isReleased}
                workflowStatus={report.workflowStatus}
                customText={layout.watermark?.customText}
                theme="light"
              />

              {/* Running Header */}
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{report.title}</span>
                <span>{report.reportNumber}</span>
              </div>

              {/* Table of Contents Body */}
              <div className="py-8 space-y-6 flex-1">
                <h2 className="text-2xl font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight border-b-2 border-[#001237] pb-2">
                  {layout.tableOfContents.title}
                </h2>

                <div className="space-y-3 text-xs">
                  {report.sections.map((sec, idx) => (
                    <div key={sec.id} className="flex items-baseline justify-between group">
                      <span className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="font-mono text-slate-400">{idx + 1}.0</span>
                        <span>{sec.title}</span>
                      </span>
                      <div className="flex-1 mx-2 border-b border-dotted border-slate-300" />
                      <span className="font-mono font-bold text-slate-600">
                        {Math.min(totalPagesEstimate, idx + 3)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* List of Figures if enabled */}
                {layout.tableOfContents.showListOfFigures && report.figures && report.figures.length > 0 && (
                  <div className="pt-6 border-t border-slate-200 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase font-condensed tracking-wider">
                      List of Figures & Photographs
                    </h3>
                    {report.figures.map((fig) => (
                      <div key={fig.id} className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-700">
                          Figure {fig.figureNumber}: {fig.title}
                        </span>
                        <div className="flex-1 mx-2 border-b border-dotted border-slate-300" />
                        <span className="font-mono text-slate-600">{fig.pageNumber || 3}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* List of Tables if enabled */}
                {layout.tableOfContents.showListOfTables && report.tables && report.tables.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase font-condensed tracking-wider">
                      List of Technical Tables
                    </h3>
                    {report.tables.map((tbl) => (
                      <div key={tbl.id} className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-700">
                          Table {tbl.tableNumber}: {tbl.title}
                        </span>
                        <div className="flex-1 mx-2 border-b border-dotted border-slate-300" />
                        <span className="font-mono text-slate-600">{tbl.pageNumber || 4}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Document Control Table */}
                <div className="pt-6 border-t border-slate-200 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Institutional Document Control
                  </h3>
                  <table className="w-full text-[10px] border border-slate-300">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-1.5 border border-slate-300 text-left">Rev</th>
                        <th className="p-1.5 border border-slate-300 text-left">Date</th>
                        <th className="p-1.5 border border-slate-300 text-left">Description</th>
                        <th className="p-1.5 border border-slate-300 text-left">Prepared</th>
                        <th className="p-1.5 border border-slate-300 text-left">Approved</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 font-mono">
                      <tr>
                        <td className="p-1.5 border border-slate-300 font-bold">{report.currentVersion}</td>
                        <td className="p-1.5 border border-slate-300">{report.lastSavedAt}</td>
                        <td className="p-1.5 border border-slate-300">{report.workflowStatus.replace('_', ' ')}</td>
                        <td className="p-1.5 border border-slate-300">{report.createdByName}</td>
                        <td className="p-1.5 border border-slate-300">{report.releasedByName || 'Pending Sign-Off'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Running Footer */}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>CIVORA QUALITY AUDIT</span>
                <span>Page 2 of {totalPagesEstimate}</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 3+: REPORT SECTIONS & EVIDENCE CONTENT               */}
          {/* ========================================================= */}
          <div
            style={{
              width: `${sheetWidthMm}mm`,
              minHeight: `${sheetHeightMm}mm`,
              padding: `${layout.margins.top}mm ${layout.margins.right}mm ${layout.margins.bottom}mm ${layout.margins.left}mm`,
            }}
            className="bg-white shadow-xl relative flex flex-col justify-between print:shadow-none print:w-full print:min-h-screen overflow-hidden"
          >
            <CivoraWatermark
              isReleased={isReleased}
              workflowStatus={report.workflowStatus}
              customText={layout.watermark?.customText}
              theme="light"
            />

            {/* Running Header */}
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="truncate max-w-sm">{report.title}</span>
              <span>{report.reportNumber}</span>
            </div>

            {/* Content Sections */}
            <div className="py-6 space-y-8 flex-1">
              {report.sections.map((sec, idx) => (
                <div key={sec.id} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                    <span className="font-mono text-xs font-bold text-[#3B68DE]">{idx + 1}.0</span>
                    <h3 className="text-base font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight">
                      {sec.title}
                    </h3>
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                    {sec.content || (
                      <span className="text-slate-400 italic">No content recorded for this section.</span>
                    )}
                  </div>

                  {/* Evidence Citations Footnote */}
                  {sec.sourceReferences && sec.sourceReferences.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-mono space-y-1">
                      <span className="font-bold uppercase text-slate-400 block">Verified Evidence Provenance:</span>
                      {sec.sourceReferences.map((ref, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>
                            [{ref.type.toUpperCase()}] {ref.label} • Record #{ref.recordId}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Sample Technical Cube Break Table */}
              {report.tables && report.tables.length > 0 && (
                <div className="pt-4 space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    Table 1: {report.tables[0].title}
                  </div>
                  <div className="overflow-x-auto border border-slate-300 rounded-lg">
                    <table className="w-full text-[10px] text-left">
                      <thead className="bg-[#001237] text-white">
                        <tr>
                          {report.tables[0].headers.map((h, i) => (
                            <th key={i} className="p-2 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono">
                        {report.tables[0].rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2 text-slate-700">
                                {cell === 'PASSED' ? (
                                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                    PASSED
                                  </span>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Statutory Sign-off Seal Box */}
              <div className="mt-12 pt-6 border-t-2 border-[#001237] grid grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 uppercase block font-condensed">
                    Authorizing Project Engineer
                  </span>
                  <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 font-mono text-[11px] text-slate-700">
                    {report.createdByName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    COREN Registered Engineer • Stamp #CR-89412
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="font-bold text-slate-900 uppercase block font-condensed">
                    Supervising Technical Reviewer
                  </span>
                  <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 font-mono text-[11px] text-slate-700">
                    {isReleased ? report.releasedByName : 'Formal Sign-Off on Final Release'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Ministry of Works & Infrastructure Stamped Verification
                  </div>
                </div>
              </div>
            </div>

            {/* Running Footer */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>{layout.headerFooter.footerType === 'confidential' ? 'CIVORA STATUTORY DOSSIER' : report.reportNumber}</span>
              <span>Page 3 of {totalPagesEstimate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
