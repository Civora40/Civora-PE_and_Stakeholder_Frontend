'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Sliders,
  ArrowLeft,
  Save,
  Check,
  Eye,
  Layout,
  Type,
  Maximize2,
  BookOpen,
  ListOrdered,
  Calendar,
  Building,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import {
  StudioReport,
  ReportLayoutSettings,
  PaperSize,
  PageOrientation,
  MarginPreset,
  CoverPreset,
} from '@/lib/types/reporting-studio';
import {
  DEFAULT_REPORT_LAYOUT_SETTINGS,
  updateReportLayoutSettings,
} from '@/lib/services/reporting-studio-service';

interface ReportingStudioPageSettingsProps {
  user: CivoraUser;
  report: StudioReport;
}

export function ReportingStudioPageSettings({
  user,
  report,
}: ReportingStudioPageSettingsProps) {
  const router = useRouter();

  const [settings, setSettings] = useState<ReportLayoutSettings>(
    report.layoutSettings || DEFAULT_REPORT_LAYOUT_SETTINGS
  );

  const [activeTab, setActiveTab] = useState<'paper' | 'cover' | 'toc' | 'header_footer' | 'typography'>('paper');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Paper Size specs map
  const paperDimensions: Record<PaperSize, { widthMm: number; heightMm: number; label: string; useCase: string }> = {
    A4: { widthMm: 210, heightMm: 297, label: 'A4 (210 × 297 mm)', useCase: 'Standard business and technical reports (Global standard)' },
    A3: { widthMm: 297, heightMm: 420, label: 'A3 (297 × 420 mm)', useCase: 'Large tables, engineering drawings, and schedule matrices' },
    LETTER: { widthMm: 215.9, heightMm: 279.4, label: 'Letter (8.5 × 11 in)', useCase: 'North American engineering and stakeholder briefs' },
    LEGAL: { widthMm: 215.9, heightMm: 355.6, label: 'Legal (8.5 × 14 in)', useCase: 'Contractual annexures and statutory compliance filings' },
    A5: { widthMm: 148, heightMm: 210, label: 'A5 (148 × 210 mm)', useCase: 'Compact executive digests and field handbook briefs' },
  };

  // Margin preset values
  const marginPresets: Record<MarginPreset, { top: number; right: number; bottom: number; left: number }> = {
    standard: { top: 25, right: 25, bottom: 25, left: 25 },
    narrow: { top: 12.7, right: 12.7, bottom: 12.7, left: 12.7 },
    wide: { top: 38, right: 38, bottom: 38, left: 38 },
    custom: { top: settings.margins.top, right: settings.margins.right, bottom: settings.margins.bottom, left: settings.margins.left },
  };

  const handleApplyMarginPreset = (preset: MarginPreset) => {
    setSettings((prev) => ({
      ...prev,
      margins: {
        preset,
        ...marginPresets[preset],
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    updateReportLayoutSettings(report.id, settings);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/engineer/reports" className="hover:text-slate-900 transition-colors">
              Reporting Studio
            </Link>
            <span>/</span>
            <Link href={`/engineer/reports/${report.id}/edit`} className="hover:text-slate-900 transition-colors">
              {report.reportNumber}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Document Layout & Page Setup</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-condensed">
            Document Layout & Page Setup
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure physical paper size, margins, branded cover styling, automatic table of contents, and running headers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/engineer/reports/${report.id}/edit`}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            Return to Editor
          </Link>

          <Link
            href={`/engineer/reports/${report.id}/preview`}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Print Preview</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Apply & Save Settings'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Settings Tabs & Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings Configuration Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation Pill Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold text-slate-600">
            {[
              { id: 'paper', label: '1. Paper Size & Margins', icon: Layout },
              { id: 'cover', label: '2. Cover Page Builder', icon: ImageIcon },
              { id: 'toc', label: '3. Table of Contents', icon: ListOrdered },
              { id: 'header_footer', label: '4. Headers & Footers', icon: Sliders },
              { id: 'typography', label: '5. Typography', icon: Type },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Paper Size & Margins */}
          {activeTab === 'paper' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-condensed">Physical Paper Preset</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select canonical physical dimensions for engineering report pagination and print-layout rendering.
                </p>
              </div>

              {/* Paper Size Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.keys(paperDimensions) as PaperSize[]).map((sizeKey) => {
                  const dim = paperDimensions[sizeKey];
                  const isSelected = settings.paperSize === sizeKey;
                  return (
                    <div
                      key={sizeKey}
                      onClick={() => setSettings({ ...settings, paperSize: sizeKey })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#001237] bg-slate-50/70 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{dim.label}</span>
                        {isSelected && <Badge variant="teal" size="sm">Active</Badge>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {dim.useCase}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Orientation */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block mb-2">Page Orientation</label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, orientation: 'PORTRAIT' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      settings.orientation === 'PORTRAIT'
                        ? 'border-[#001237] bg-slate-50 text-slate-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="w-3 h-4 border border-slate-700 rounded-xs" />
                    <span>Portrait</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, orientation: 'LANDSCAPE' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      settings.orientation === 'LANDSCAPE'
                        ? 'border-[#001237] bg-slate-50 text-slate-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="w-4 h-3 border border-slate-700 rounded-xs" />
                    <span>Landscape</span>
                  </button>
                </div>
              </div>

              {/* Margins */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">Print Margins</label>
                    <span className="text-[11px] text-slate-500">
                      Standard ISO margins protect text from binding hole punches and physical cutter tolerances.
                    </span>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {(['standard', 'narrow', 'wide', 'custom'] as MarginPreset[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleApplyMarginPreset(p)}
                        className={`px-2.5 py-1 rounded-md text-[11px] capitalize font-medium transition-colors ${
                          settings.margins.preset === p
                            ? 'bg-[#001237] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom numeric margin inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Top (mm)</label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={settings.margins.top}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          margins: { ...settings.margins, preset: 'custom', top: Number(e.target.value) },
                        })
                      }
                      className="w-full text-xs font-mono py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Bottom (mm)</label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={settings.margins.bottom}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          margins: { ...settings.margins, preset: 'custom', bottom: Number(e.target.value) },
                        })
                      }
                      className="w-full text-xs font-mono py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Left (mm)</label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={settings.margins.left}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          margins: { ...settings.margins, preset: 'custom', left: Number(e.target.value) },
                        })
                      }
                      className="w-full text-xs font-mono py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Right (mm)</label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={settings.margins.right}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          margins: { ...settings.margins, preset: 'custom', right: Number(e.target.value) },
                        })
                      }
                      className="w-full text-xs font-mono py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Cover Page Builder */}
          {activeTab === 'cover' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-condensed">Branded Cover Page</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure institutional cover page layout, client branding, and engineering metadata.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">Enable Cover</span>
                  <input
                    type="checkbox"
                    checked={settings.coverPage.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        coverPage: { ...settings.coverPage, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-[#001237] rounded border-slate-300 focus:ring-[#001237]"
                  />
                </label>
              </div>

              {settings.coverPage.enabled ? (
                <div className="space-y-6">
                  {/* Preset Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-2">Cover Layout Preset</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'architectural_dark',
                          title: '1. Architectural Dark Split (Annual Report)',
                          desc: 'Deep midnight navy upper with bold uppercase headline, dark architectural facade lower, Civora logo, and prominent year indicator.',
                        },
                        {
                          id: 'civora_standard',
                          title: '2. Civora Standard Corporate',
                          desc: 'Restrained corporate styling with Midnight Navy typography, teal divider, and clean metadata block.',
                        },
                        {
                          id: 'project_image',
                          title: '3. Project Image Hero',
                          desc: 'Full-width aerial project photograph header with high-contrast title typography.',
                        },
                        {
                          id: 'technical_report',
                          title: '4. Technical Report & Blueprint',
                          desc: 'Institutional engineering document control box with COREN signature block and client seal.',
                        },
                        {
                          id: 'executive_brief',
                          title: '5. Executive Brief',
                          desc: 'Compact presentation layout with highlighted executive delivery metrics and KPI summary.',
                        },
                      ].map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              coverPage: { ...settings.coverPage, preset: preset.id as CoverPreset },
                            })
                          }
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            settings.coverPage.preset === preset.id
                              ? 'border-[#001237] bg-slate-50/70 shadow-2xs ring-2 ring-[#001237]/10'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="font-bold text-xs text-slate-900 block">{preset.title}</span>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{preset.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Year / Period Display & Headline Customization */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">Cover Typography & Period Display</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Cover Year / Period Display (e.g. 2025/26)
                        </label>
                        <input
                          type="text"
                          value={settings.coverPage.periodYearDisplay || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              coverPage: { ...settings.coverPage, periodYearDisplay: e.target.value },
                            })
                          }
                          placeholder="2025/26"
                          className="w-full text-xs font-mono py-2 px-3 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Primary Headline (Uppercase)
                        </label>
                        <input
                          type="text"
                          value={settings.coverPage.headlinePrimary || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              coverPage: { ...settings.coverPage, headlinePrimary: e.target.value },
                            })
                          }
                          placeholder="ANNUAL REPORT or CONSTRUCTION PROGRESS"
                          className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metadata field toggles */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800 block">Cover Metadata Inclusions</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.coverPage.showLogo}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              coverPage: { ...settings.coverPage, showLogo: e.target.checked },
                            })
                          }
                          className="w-4 h-4 text-[#001237] rounded"
                        />
                        <span className="text-slate-800 font-medium">Civora Brand Logo Mark</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.coverPage.showClientLogo}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              coverPage: { ...settings.coverPage, showClientLogo: e.target.checked },
                            })
                          }
                          className="w-4 h-4 text-[#001237] rounded"
                        />
                        <span className="text-slate-800 font-medium">Client / Authority Seal</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.coverPage.showLocation}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              coverPage: { ...settings.coverPage, showLocation: e.target.checked },
                            })
                          }
                          className="w-4 h-4 text-[#001237] rounded"
                        />
                        <span className="text-slate-800 font-medium">Asset Location & Chainage</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.coverPage.showReviewers}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              coverPage: { ...settings.coverPage, showReviewers: e.target.checked },
                            })
                          }
                          className="w-4 h-4 text-[#001237] rounded"
                        />
                        <span className="text-slate-800 font-medium">Peer Reviewer & Approver Block</span>
                      </label>
                    </div>

                    {/* Confidentiality Label */}
                    <div className="pt-2">
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Confidentiality & Statutory Classification Label
                      </label>
                      <input
                        type="text"
                        value={settings.coverPage.confidentialityLabel}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            coverPage: { ...settings.coverPage, confidentialityLabel: e.target.value },
                          })
                        }
                        className="w-full text-xs font-mono py-2 px-3 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  Cover page is currently disabled. Report will begin immediately on Page 1 with the title header.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Table of Contents */}
          {activeTab === 'toc' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-condensed">Automatic Table of Contents</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate semantic table of contents, list of figures, and list of tables with live page numbers.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">Enable TOC</span>
                  <input
                    type="checkbox"
                    checked={settings.tableOfContents.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tableOfContents: { ...settings.tableOfContents, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-[#001237] rounded"
                  />
                </label>
              </div>

              {settings.tableOfContents.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">TOC Section Title</label>
                      <input
                        type="text"
                        value={settings.tableOfContents.title}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            tableOfContents: { ...settings.tableOfContents, title: e.target.value },
                          })
                        }
                        className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">Heading Depth Included</label>
                      <select
                        value={settings.tableOfContents.maxHeadingLevel}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            tableOfContents: {
                              ...settings.tableOfContents,
                              maxHeadingLevel: Number(e.target.value) as any,
                            },
                          })
                        }
                        className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white font-medium"
                      >
                        <option value={1}>Heading 1 Only (Primary Sections)</option>
                        <option value={2}>Heading 1 & 2 (Sections & Subsections)</option>
                        <option value={3}>Heading 1, 2 & 3 (Deep Detailed Breakdown)</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Lists */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800 block">Supplementary Automated Registers</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.tableOfContents.showListOfFigures}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              tableOfContents: {
                                ...settings.tableOfContents,
                                showListOfFigures: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-[#001237] rounded"
                        />
                        <span className="text-slate-800 font-medium">List of Figures & Photographs</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.tableOfContents.showListOfTables}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              tableOfContents: {
                                ...settings.tableOfContents,
                                showListOfTables: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-[#001237] rounded"
                        />
                        <span className="text-slate-800 font-medium">List of Laboratory & Data Tables</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Headers & Footers */}
          {activeTab === 'header_footer' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-condensed">Running Headers, Footers & Numbering</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set up running top headers, bottom classification labels, and dynamic page numbering.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Header Style</label>
                  <select
                    value={settings.headerFooter.headerType}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        headerFooter: { ...settings.headerFooter, headerType: e.target.value as any },
                      })
                    }
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="title">Formal Report Title</option>
                    <option value="project">Project Name & Code</option>
                    <option value="reference">Report Reference Number</option>
                    <option value="none">None (Clean Header)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Footer Classification</label>
                  <select
                    value={settings.headerFooter.footerType}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        headerFooter: { ...settings.headerFooter, footerType: e.target.value as any },
                      })
                    }
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="confidential">Confidentiality Classification</option>
                    <option value="reference">Report Reference & Revision</option>
                    <option value="date_version">Issue Date & Version</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Page Number Style</label>
                  <select
                    value={settings.headerFooter.pageNumberStyle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        headerFooter: { ...settings.headerFooter, pageNumberStyle: e.target.value as any },
                      })
                    }
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="page_of_total">Page X of Y (e.g. Page 3 of 12)</option>
                    <option value="arabic">Arabic Numerals (1, 2, 3)</option>
                    <option value="roman">Roman Numerals (i, ii, iii)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Number Position</label>
                  <select
                    value={settings.headerFooter.pageNumberPosition}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        headerFooter: { ...settings.headerFooter, pageNumberPosition: e.target.value as any },
                      })
                    }
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="right">Bottom Right (Standard)</option>
                    <option value="center">Bottom Center</option>
                    <option value="left">Bottom Left</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={settings.headerFooter.hideOnCover}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        headerFooter: { ...settings.headerFooter, hideOnCover: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-[#001237] rounded"
                  />
                  <span className="font-semibold text-slate-800">
                    Hide header and page numbering on the Cover Page (Recommended)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: Typography */}
          {activeTab === 'typography' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-condensed">Typography & Readability</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set baseline font family, point size, and paragraph line spacing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Body Font Family</label>
                  <select
                    value={settings.typography.fontFamily}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        typography: { ...settings.typography, fontFamily: e.target.value as any },
                      })
                    }
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white font-medium"
                  >
                    <option value="Inter">Inter (Civora Clean Sans)</option>
                    <option value="Encode Sans Condensed">Encode Sans Condensed (Institutional)</option>
                    <option value="Roboto">Roboto (Technical)</option>
                    <option value="Courier">Courier (Monospace / Spec)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Body Font Size</label>
                  <select
                    value={settings.typography.fontSizePt}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        typography: { ...settings.typography, fontSizePt: Number(e.target.value) },
                      })
                    }
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white font-medium"
                  >
                    <option value={10}>10 pt (Compact data-dense)</option>
                    <option value={11}>11 pt (Standard ISO readability)</option>
                    <option value={12}>12 pt (Large executive print)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Line Spacing</label>
                  <select
                    value={settings.typography.lineSpacing}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        typography: { ...settings.typography, lineSpacing: Number(e.target.value) },
                      })
                    }
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white font-medium"
                  >
                    <option value={1.15}>1.15 (Tight)</option>
                    <option value={1.25}>1.25 (Standard Institutional)</option>
                    <option value={1.5}>1.5 (Relaxed Review)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Layout Miniature Thumbnail */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 sticky top-6">
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-condensed uppercase tracking-wider">
              Physical Sheet Geometry
            </h4>
            <p className="text-[11px] text-slate-500">
              Live scale preview for {settings.paperSize} ({settings.orientation.toLowerCase()})
            </p>
          </div>

          {/* Miniature Paper Canvas */}
          <div className="p-6 bg-slate-100 rounded-xl flex items-center justify-center min-h-[280px]">
            <div
              className={`bg-white border border-slate-300 shadow-md relative transition-all duration-300 flex flex-col justify-between ${
                settings.orientation === 'PORTRAIT'
                  ? settings.paperSize === 'A3'
                    ? 'w-44 h-64'
                    : 'w-40 h-56'
                  : settings.paperSize === 'A3'
                  ? 'w-64 h-44'
                  : 'w-56 h-40'
              }`}
              style={{
                paddingTop: `${Math.max(4, settings.margins.top / 3)}px`,
                paddingBottom: `${Math.max(4, settings.margins.bottom / 3)}px`,
                paddingLeft: `${Math.max(4, settings.margins.left / 3)}px`,
                paddingRight: `${Math.max(4, settings.margins.right / 3)}px`,
              }}
            >
              {/* Top Miniature Header */}
              <div className="border-b border-slate-200 pb-1 flex justify-between items-center text-[7px] text-slate-400 font-mono">
                <span className="truncate max-w-[80px]">
                  {settings.headerFooter.headerType === 'title' ? report.title : report.projectCode}
                </span>
                <span>{report.reportNumber}</span>
              </div>

              {/* Center Content Lines */}
              <div className="space-y-1.5 py-2">
                <div className="h-1.5 bg-slate-800 rounded-xs w-3/4" />
                <div className="h-1 bg-[#4FAAA7] rounded-xs w-1/2" />
                <div className="space-y-0.5 pt-1">
                  <div className="h-1 bg-slate-200 rounded-xs w-full" />
                  <div className="h-1 bg-slate-200 rounded-xs w-full" />
                  <div className="h-1 bg-slate-200 rounded-xs w-4/5" />
                </div>
              </div>

              {/* Bottom Miniature Footer */}
              <div className="border-t border-slate-200 pt-1 flex justify-between items-center text-[7px] text-slate-400 font-mono">
                <span>CIVORA CONFIDENTIAL</span>
                <span>Page 1 of 6</span>
              </div>
            </div>
          </div>

          {/* Quick Specifications Summary */}
          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Paper Size:</span>
              <span className="font-semibold text-slate-900">{settings.paperSize}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Orientation:</span>
              <span className="font-semibold text-slate-900 capitalize">{settings.orientation.toLowerCase()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Margins:</span>
              <span className="font-semibold text-slate-900 font-mono">
                {settings.margins.top}mm / {settings.margins.left}mm
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Cover Preset:</span>
              <span className="font-semibold text-slate-900 capitalize">
                {settings.coverPage.preset.replace('_', ' ')}
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2 bg-[#001237] hover:bg-[#18243D] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            {saveSuccess ? 'Settings Saved' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
