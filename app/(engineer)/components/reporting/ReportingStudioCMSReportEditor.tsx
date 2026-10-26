'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Save,
  Check,
  Send,
  Eye,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  MessageSquare,
  Building,
  Calendar,
  Layers,
  FileCheck2,
  Tag,
  Clock,
  BookOpen,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Sliders,
  History,
  MoreHorizontal,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StudioReport, ReportSection, CoverPreset } from '@/lib/types/reporting-studio';
import {
  saveStudioDraft,
  submitReportForReview,
  runReportPreflightCheck,
  PreflightCheckResult,
  DEFAULT_REPORT_LAYOUT_SETTINGS,
} from '@/lib/services/reporting-studio-service';

interface ReportingStudioCMSReportEditorProps {
  user: CivoraUser;
  initialReport: StudioReport;
}

export function ReportingStudioCMSReportEditor({
  user,
  initialReport,
}: ReportingStudioCMSReportEditorProps) {
  const router = useRouter();

  const [report, setReport] = useState<StudioReport>(initialReport);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    initialReport.sections.length > 0 ? initialReport.sections[0].id : ''
  );

  // Editor states
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>(initialReport.lastSavedAt);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPreflightModal, setShowPreflightModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [submitAuthorNotes, setSubmitAuthorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preflightResult: PreflightCheckResult = useMemo(() => runReportPreflightCheck(report), [report]);

  // AI Assistant states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    sectionId: string;
    text: string;
    actionType: string;
  } | null>(null);

  const activeSection = useMemo(() => {
    if (activeSectionId === 'cover_page') return null;
    return report.sections.find((s) => s.id === activeSectionId) || report.sections[0] || null;
  }, [report.sections, activeSectionId]);

  const handleAddSectionFromTemplate = (
    templateTitle: string,
    defaultGuidance: string,
    defaultPlaceholder: string
  ) => {
    const newId = `sec_tmpl_${Date.now()}`;
    const newSec: ReportSection = {
      id: newId,
      title: templateTitle,
      content: '',
      guidance: defaultGuidance,
      placeholder: defaultPlaceholder,
      isRequired: false,
      isCompleted: false,
    };
    setReport((prev) => ({ ...prev, sections: [...prev.sections, newSec] }));
    setActiveSectionId(newId);
    setSaveStatus('unsaved');
    setShowAddSectionModal(false);
  };

  // Handle section text change
  const handleSectionContentChange = (content: string) => {
    if (!activeSection) return;

    setSaveStatus('unsaved');
    const updatedSections = report.sections.map((s) => {
      if (s.id === activeSection.id) {
        return {
          ...s,
          content,
          isCompleted: content.trim().length > 20,
        };
      }
      return s;
    });

    setReport((prev) => ({ ...prev, sections: updatedSections }));
  };

  // Handle section internal notes
  const handleInternalNotesChange = (notes: string) => {
    if (!activeSection) return;

    setSaveStatus('unsaved');
    const updatedSections = report.sections.map((s) => {
      if (s.id === activeSection.id) {
        return {
          ...s,
          internalNotes: notes,
        };
      }
      return s;
    });

    setReport((prev) => ({ ...prev, sections: updatedSections }));
  };

  // Add new section
  const handleAddSection = () => {
    const newId = `sec_custom_${Date.now()}`;
    const newSec: ReportSection = {
      id: newId,
      title: 'New Custom Section',
      content: '',
      isRequired: false,
      isCompleted: false,
    };
    setReport((prev) => ({ ...prev, sections: [...prev.sections, newSec] }));
    setActiveSectionId(newId);
    setSaveStatus('unsaved');
  };

  // Move section up/down
  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= report.sections.length) return;

    const updated = [...report.sections];
    const [moved] = updated.splice(idx, 1);
    updated.splice(newIdx, 0, moved);

    setReport((prev) => ({ ...prev, sections: updated }));
    setSaveStatus('unsaved');
  };

  // Delete section
  const handleDeleteSection = (secId: string) => {
    if (report.sections.length <= 1) {
      alert('A report must have at least one section.');
      return;
    }
    const updated = report.sections.filter((s) => s.id !== secId);
    setReport((prev) => ({ ...prev, sections: updated }));
    if (activeSectionId === secId) {
      setActiveSectionId(updated[0].id);
    }
    setSaveStatus('unsaved');
  };

  // Debounced auto-save
  useEffect(() => {
    if (saveStatus !== 'unsaved') return;

    const timer = setTimeout(() => {
      setSaveStatus('saving');
      try {
        saveStudioDraft(report.id, {
          title: report.title,
          executiveSummary: report.executiveSummary,
          sections: report.sections,
          actorName: user.name,
        });

        const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(now);
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('unsaved');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [report, saveStatus, user.name]);

  // Explicit Save
  const handleManualSave = () => {
    setSaveStatus('saving');
    saveStudioDraft(report.id, {
      title: report.title,
      executiveSummary: report.executiveSummary,
      sections: report.sections,
      actorName: user.name,
    });
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(now);
    setSaveStatus('saved');
  };

  // AI drafting actions (grounded simulation)
  const handleAIDraftSection = (actionType: string) => {
    if (!activeSection) return;
    setAiLoading(true);

    setTimeout(() => {
      setAiLoading(false);
      let draftText = '';

      if (actionType === 'draft') {
        draftText = `Physical progress for ${activeSection.title} in the ${report.projectName} asset proceeded in accordance with approved drawings. Inspection verified rebar layout against BS 8110 standards. Concrete pour ticket signed off with accredited testing lab cube crush certification.`;
      } else if (actionType === 'summarize') {
        draftText = `Summary of verified field submittals: 14 pour tickets processed with zero structural NCRs. Average 7-day compressive break verified at 28.4 MPa exceeding the 70% threshold.`;
      } else if (actionType === 'clarity') {
        draftText = activeSection.content
          ? `${activeSection.content} All elements comply with statutory LASBCA building control provisions.`
          : 'Refined engineering narrative ready for review.';
      }

      setAiSuggestion({
        sectionId: activeSection.id,
        text: draftText,
        actionType,
      });
    }, 700);
  };

  const handleApplyAISuggestion = (mode: 'replace' | 'append') => {
    if (!aiSuggestion || !activeSection) return;

    const newContent =
      mode === 'replace'
        ? aiSuggestion.text
        : `${activeSection.content}\n\n${aiSuggestion.text}`.trim();

    handleSectionContentChange(newContent);
    setAiSuggestion(null);
  };

  // Submit for Review
  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitReportForReview(report.id, {
        actorName: user.name,
        authorNotes: submitAuthorNotes,
      });
      setIsSubmitting(false);
      setShowSubmitModal(false);
      router.push('/engineer/reports/review');
    }, 600);
  };

  const completedCount = report.sections.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / report.sections.length) * 100);

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/engineer/reports/drafts"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
            title="Back to Drafts"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            {/* Title & Save State */}
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-slate-900 font-condensed tracking-tight truncate max-w-xl">
                {report.title}
              </h1>
              {/* Subtle save state */}
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    saveStatus === 'saving'
                      ? 'bg-blue-500 animate-ping'
                      : saveStatus === 'unsaved'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="text-[11px] font-medium">{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'unsaved' ? 'Unsaved' : 'Saved'}</span>
              </span>
            </div>

            {/* Subtle breadcrumb meta */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-0.5">
              <span className="text-slate-600 font-semibold truncate max-w-[200px]">{report.projectName}</span>
              <span>&bull;</span>
              <span className="font-mono text-slate-500">{report.reportNumber}</span>
              <span>&bull;</span>
              <span className="font-mono text-slate-500">{report.currentVersion}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {/* Preflight Indicator */}
          <button
            type="button"
            onClick={() => setShowPreflightModal(true)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Open Preflight Validation"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                preflightResult.blockingCount > 0
                  ? 'bg-rose-500'
                  : preflightResult.warningCount > 0
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
            <span>Preflight</span>
            {preflightResult.blockingCount > 0 && (
              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {preflightResult.blockingCount}
              </span>
            )}
          </button>

          {/* Page Setup / Layout */}
          <Link
            href={`/engineer/reports/${report.id}/settings`}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Configure physical paper size, margins, and cover page"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Layout</span>
          </Link>

          {/* More Dropdown (Versions, Review, Manual Save) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsMoreMenuOpen(false)} />
                <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 text-xs">
                  <Link
                    href={`/engineer/reports/${report.id}/versions`}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>Version History</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{report.versions.length + 1}</span>
                  </Link>

                  <Link
                    href={`/engineer/reports/${report.id}/review`}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>Review & Comments</span>
                    </div>
                    {report.reviewComments.length > 0 && (
                      <span className="text-[10px] font-mono text-amber-600 font-bold">
                        {report.reviewComments.length}
                      </span>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      handleManualSave();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 border-t border-slate-100 mt-1 pt-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-400" />
                    <span>Save Changes Now</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Preview */}
          <Link
            href={`/engineer/reports/${report.id}/preview`}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview</span>
          </Link>

          {/* Primary Action: Submit for Review */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* 3-Region Desktop CMS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start lg:h-[calc(100vh-210px)]">
        {/* Left Region: Report Outline & Navigation (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 lg:h-full lg:overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              Report Outline
            </h2>
            <span className="text-[11px] font-mono font-bold text-slate-400">
              {completedCount}/{report.sections.length} Ready
            </span>
          </div>

          {/* Cover Page & Branding Outline Card */}
          <div
            onClick={() => setActiveSectionId('cover_page')}
            className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer mb-2.5 ${
              activeSectionId === 'cover_page'
                ? 'bg-[#001237] text-white font-bold shadow-2xs'
                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Cover Page & Branding</span>
            </div>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase truncate max-w-[100px] ${
                activeSectionId === 'cover_page'
                  ? 'bg-white/20 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {(report.layoutSettings?.coverPage?.preset || 'architectural_dark').replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-1.5">
            {report.sections.map((section, idx) => {
              const isActive = section.id === activeSectionId;
              return (
                <div
                  key={section.id}
                  className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between group ${
                    isActive
                      ? 'bg-blue-50/70 border-blue-200 text-slate-900 font-bold shadow-2xs'
                      : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <button
                    onClick={() => setActiveSectionId(section.id)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0"
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center flex-shrink-0 ${
                        section.isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {section.isCompleted ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </button>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === report.sections.length - 1}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-0.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAddSection}
              className="flex-1 py-2 px-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-slate-400 hover:text-slate-900 flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom</span>
            </button>
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Add pre-structured section from template"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>
          </div>
        </div>

        {/* Center Region: Structured Editor Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6 lg:h-full lg:overflow-y-auto no-scrollbar">
          {activeSectionId === 'cover_page' ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight">
                    Cover Page Template & Branding
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a cover layout template. Every design includes the Civora Logo and full document watermark.
                  </p>
                </div>
                <Link
                  href={`/engineer/reports/${report.id}/preview`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001237] text-white text-xs font-semibold hover:bg-[#18243D] transition-colors self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Cover</span>
                </Link>
              </div>

              {/* Template Selector Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Select Cover Page Template</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'architectural_dark',
                      name: '1. Architectural Dark Split',
                      badge: 'Annual Report Style',
                      desc: 'Deep midnight navy upper with massive uppercase headline, dark architectural facade lower, Civora logo, and prominent year indicator.',
                    },
                    {
                      id: 'civora_standard',
                      name: '2. Civora Standard Corporate',
                      badge: 'Institutional',
                      desc: 'Crisp corporate white sheet with Midnight Navy header band, Civora full brand mark, and formal dual sign-off matrix.',
                    },
                    {
                      id: 'project_image',
                      name: '3. Project Hero Full Bleed',
                      badge: 'Site Photography',
                      desc: 'Full-bleed high-resolution site photo background with dark cinematic glass overlay and gold/teal badge.',
                    },
                    {
                      id: 'technical_report',
                      name: '4. Technical Engineering & COREN',
                      badge: 'Statutory Seal',
                      desc: 'Blueprint coordinate grid frame, institutional title block, and COREN verification stamp.',
                    },
                    {
                      id: 'executive_brief',
                      name: '5. Executive Brief',
                      badge: 'Board Digest',
                      desc: 'Minimalist editorial format with vertical teal accent line and key KPI summary highlights.',
                    },
                  ].map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        setReport((prev) => ({
                          ...prev,
                          layoutSettings: {
                            ...(prev.layoutSettings || DEFAULT_REPORT_LAYOUT_SETTINGS),
                            coverPage: {
                              ...(prev.layoutSettings?.coverPage || DEFAULT_REPORT_LAYOUT_SETTINGS.coverPage),
                              preset: tmpl.id as CoverPreset,
                            },
                          },
                        }));
                        setSaveStatus('unsaved');
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        (report.layoutSettings?.coverPage?.preset || 'architectural_dark') === tmpl.id
                          ? 'border-[#001237] bg-slate-50/80 shadow-2xs ring-2 ring-[#001237]/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-slate-900">{tmpl.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{tmpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cover Live Mini Preview */}
              <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider block">
                  Cover Page Live Preview
                </span>
                {(report.layoutSettings?.coverPage?.preset || 'architectural_dark') === 'architectural_dark' ? (
                  <div className="rounded-xl overflow-hidden shadow-md border border-slate-700 bg-[#1e2433] text-white">
                    <div
                      className="p-6 bg-cover bg-center space-y-1.5 relative overflow-hidden"
                      style={{ backgroundImage: 'url(/images/cover_top_bg.png)' }}
                    >
                      <div className="absolute inset-0 bg-[#0B132B]/35 pointer-events-none" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase leading-[0.91] tracking-tight text-white whitespace-pre-line drop-shadow-md">
                          {report.layoutSettings?.coverPage?.headlinePrimary || 'ANNUAL\nREPORT'}
                        </h3>
                        <p className="text-xs text-white/90 font-light whitespace-pre-line leading-relaxed pt-2 drop-shadow-sm">
                          {report.layoutSettings?.coverPage?.headlineSecondary || 'Construction Progress &\nPerformance'}
                        </p>
                      </div>
                    </div>
                    <div
                      className="p-5 bg-cover bg-center relative flex items-end justify-between min-h-[140px]"
                      style={{ backgroundImage: 'url(/images/curved_glass_facade.jpg)' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161c28]/95 via-[#161c28]/40 to-transparent" />
                      <div className="relative z-10 flex items-center gap-2">
                        <img
                          src="/images/civora_watermark_icon.png"
                          alt="Civora"
                          className="w-6 h-6 object-contain brightness-200"
                        />
                        <div>
                          <span className="font-black text-xs tracking-wider text-white block leading-tight">CIVORA</span>
                          <span className="text-[9px] text-slate-300 block leading-tight">
                            {report.projectName ? report.projectName.split('—')[0].trim() : 'Construction Control'}
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 text-right">
                        <span className="text-[10px] text-slate-200 block font-light lowercase">year</span>
                        <span className="text-2xl font-black text-white leading-none tracking-tight block">
                          {report.layoutSettings?.coverPage?.periodYearDisplay || '2025/26'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl p-5 bg-white text-slate-900 shadow-sm border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-black text-xs text-[#001237]">CIVORA CONTROL PLANE</span>
                      <span className="text-[10px] font-mono text-slate-500">{report.projectCode}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500">{report.projectName}</p>
                    <div className="pt-2 border-t text-[10px] font-mono text-slate-400 flex justify-between">
                      <span>{report.reportNumber}</span>
                      <span>{report.periodFormatted}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Metadata Inputs */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Cover Typography & Period Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Primary Headline (Uppercase)
                    </label>
                    <input
                      type="text"
                      value={report.layoutSettings?.coverPage?.headlinePrimary || 'ANNUAL REPORT'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setReport((prev) => ({
                          ...prev,
                          layoutSettings: {
                            ...(prev.layoutSettings || DEFAULT_REPORT_LAYOUT_SETTINGS),
                            coverPage: {
                              ...(prev.layoutSettings?.coverPage || DEFAULT_REPORT_LAYOUT_SETTINGS.coverPage),
                              headlinePrimary: val,
                            },
                          },
                        }));
                        setSaveStatus('unsaved');
                      }}
                      placeholder="ANNUAL REPORT or CONSTRUCTION PROGRESS"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Cover Period / Year Display
                    </label>
                    <input
                      type="text"
                      value={report.layoutSettings?.coverPage?.periodYearDisplay || '2025/26'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setReport((prev) => ({
                          ...prev,
                          layoutSettings: {
                            ...(prev.layoutSettings || DEFAULT_REPORT_LAYOUT_SETTINGS),
                            coverPage: {
                              ...(prev.layoutSettings?.coverPage || DEFAULT_REPORT_LAYOUT_SETTINGS.coverPage),
                              periodYearDisplay: val,
                            },
                          },
                        }));
                        setSaveStatus('unsaved');
                      }}
                      placeholder="2025/26"
                      className="w-full text-xs font-mono font-bold py-2 px-3 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Secondary Subtitle
                    </label>
                    <input
                      type="text"
                      value={report.layoutSettings?.coverPage?.headlineSecondary || 'Construction Progress & Performance'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setReport((prev) => ({
                          ...prev,
                          layoutSettings: {
                            ...(prev.layoutSettings || DEFAULT_REPORT_LAYOUT_SETTINGS),
                            coverPage: {
                              ...(prev.layoutSettings?.coverPage || DEFAULT_REPORT_LAYOUT_SETTINGS.coverPage),
                              headlineSecondary: val,
                            },
                          },
                        }));
                        setSaveStatus('unsaved');
                      }}
                      placeholder="Construction Progress & Performance"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-700">Civora Watermark</span>
                    <span className="text-[11px] text-slate-500">• Embedded across all report pages</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    Official Statutory Seal
                  </span>
                </div>
              </div>
            </div>
          ) : activeSection ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <input
                  type="text"
                  value={activeSection.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setReport((prev) => ({
                      ...prev,
                      sections: prev.sections.map((s) =>
                        s.id === activeSection.id ? { ...s, title: newTitle } : s
                      ),
                    }));
                    setSaveStatus('unsaved');
                  }}
                  className="text-lg font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1 -ml-1 w-full"
                />
                {activeSection.isRequired && (
                  <Badge variant="amber" size="sm">
                    Required
                  </Badge>
                )}
              </div>

              {/* Formatting Toolbar */}
              <div className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-1 text-slate-600 text-xs">
                <button
                  type="button"
                  title="Bold"
                  onClick={() => handleSectionContentChange(activeSection.content + ' **Bold Text**')}
                  className="p-1.5 rounded hover:bg-slate-200/60 text-slate-700 font-bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => handleSectionContentChange(activeSection.content + ' *Italic Text*')}
                  className="p-1.5 rounded hover:bg-slate-200/60 text-slate-700 italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Bullet List"
                  onClick={() => handleSectionContentChange(activeSection.content + '\n• Point 1\n• Point 2')}
                  className="p-1.5 rounded hover:bg-slate-200/60 text-slate-700"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Numbered List"
                  onClick={() => handleSectionContentChange(activeSection.content + '\n1. First step\n2. Second step')}
                  className="p-1.5 rounded hover:bg-slate-200/60 text-slate-700"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Insert Engineering Table Template"
                  onClick={() =>
                    handleSectionContentChange(
                      activeSection.content +
                        '\n\n| Element / Gridline | Test Result | Tolerance | Status |\n|---|---|---|---|\n| Marina Slab C1-C8 | 28.4 MPa | > 25 MPa | Verified |'
                    )
                  }
                  className="px-2 py-1 rounded hover:bg-slate-200/60 text-[11px] font-mono text-slate-700"
                >
                  + Table
                </button>
              </div>

              {/* Text Canvas */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Section Content (Markdown & Structured Narrative)</label>
                <textarea
                  rows={12}
                  value={activeSection.content}
                  onChange={(e) => handleSectionContentChange(e.target.value)}
                  placeholder={activeSection.placeholder || 'Draft engineering observations, measurements, and test citations...'}
                  className="w-full text-xs py-3 px-3.5 rounded-xl border border-slate-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20 font-sans leading-relaxed"
                />
              </div>

              {/* Author Internal Notes (Excluded from released report) */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Author Internal Notes (Strictly Hidden from Released Dossier)</span>
                </div>
                <textarea
                  rows={2}
                  value={activeSection.internalNotes || ''}
                  onChange={(e) => handleInternalNotesChange(e.target.value)}
                  placeholder="Private notes for reviewer or peer engineers..."
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-amber-200 bg-white/80 focus:bg-white leading-relaxed"
                />
              </div>

              {/* AI Proposed Changes Diff Box if available */}
              {aiSuggestion && aiSuggestion.sectionId === activeSection.id && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Proposed AI Grounded Suggestion
                    </span>
                    <Badge variant="teal" size="sm">
                      Requires Review
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-950/80 leading-relaxed font-sans bg-white p-3 rounded-lg border border-blue-100">
                    {aiSuggestion.text}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => setAiSuggestion(null)}
                      className="px-3 py-1 rounded-md text-slate-500 hover:bg-white"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => handleApplyAISuggestion('append')}
                      className="px-3 py-1 rounded-md bg-white border border-blue-200 text-blue-800 font-semibold hover:bg-blue-50"
                    >
                      Append to Section
                    </button>
                    <button
                      onClick={() => handleApplyAISuggestion('replace')}
                      className="px-3 py-1 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                      Replace Existing
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              No section selected.
            </div>
          )}
        </div>

        {/* Right Region: Context & AI Assistant (3 cols) */}
        <div className="lg:col-span-3 space-y-5 lg:h-full lg:overflow-y-auto no-scrollbar">
          {/* Section Guidance Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold border-b border-slate-100 pb-2">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Section Technical Guidance</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {activeSection?.guidance ||
                'Ensure all structural members, compressive cube break results, and statutory stage inspections are referenced with accredited lab certificate numbers.'}
            </p>
          </div>

          {/* AI Drafting Assistant Card */}
          <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
              <Sparkles className="w-4 h-4 text-[#3B68DE]" />
              <h3 className="font-bold text-slate-900">AI Drafting Assistant</h3>
            </div>

            <p className="text-[11px] text-slate-500">
              Draft or synthesize this section based strictly on verified field submissions and linked evidence.
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleAIDraftSection('draft')}
                disabled={aiLoading}
                className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#3B68DE] font-semibold text-left flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>Draft Section Narrative</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleAIDraftSection('summarize')}
                disabled={aiLoading}
                className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-left flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>Summarize Field Submittals</span>
                <FileText className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleAIDraftSection('clarity')}
                disabled={aiLoading}
                className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-left flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>Rewrite for Regulatory Clarity</span>
                <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {aiLoading && (
              <div className="p-3 text-center text-blue-600 font-medium animate-pulse text-[11px]">
                Grounding against authorized project records...
              </div>
            )}
          </div>

          {/* Linked Source Evidence */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Linked Evidence Records
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {report.linkedEvidenceCount} records
              </span>
            </div>

            <div className="space-y-2">
              {activeSection?.sourceReferences && activeSection.sourceReferences.length > 0 ? (
                activeSection.sourceReferences.map((ref) => (
                  <div key={ref.recordId} className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px]">
                    <span className="font-mono font-bold text-slate-800 block truncate">{ref.label}</span>
                    <span className="text-slate-400 text-[10px]">{ref.date} • Record #{ref.recordId}</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 leading-snug">
                  No citations directly linked to this section yet. Citations appear when AI drafts or when verified records are inserted.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit for Review Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#3B68DE]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                  Submit Report for Technical Review
                </h3>
                <p className="text-xs text-slate-500">
                  Locks this draft version and routes it to the designated Lead Engineer.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 space-y-1">
              <p>
                <strong>Report:</strong> {report.title} ({report.reportNumber})
              </p>
              <p>
                <strong>Asset:</strong> {report.projectName}
              </p>
              <p>
                <strong>Readiness:</strong> {completedCount} of {report.sections.length} sections completed.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Author Submission Notes / Review Focus (Optional)
              </label>
              <textarea
                rows={3}
                value={submitAuthorNotes}
                onChange={(e) => setSubmitAuthorNotes(e.target.value)}
                placeholder="Highlight specific sections or items requiring reviewer confirmation..."
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting || preflightResult.blockingCount > 0}
                className="px-5 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preflight Validation Checklist Modal */}
      {showPreflightModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3B68DE]" />
                <h3 className="text-base font-bold text-slate-900 font-condensed">
                  Report Preflight & Governance Checklist
                </h3>
              </div>
              <button
                onClick={() => setShowPreflightModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Status Summary Banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                preflightResult.blockingCount > 0
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : preflightResult.warningCount > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {preflightResult.blockingCount > 0 ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className="font-bold">
                  {preflightResult.blockingCount > 0
                    ? `${preflightResult.blockingCount} Blocking Issues Detected`
                    : preflightResult.warningCount > 0
                    ? `${preflightResult.warningCount} Advisories (Submission Permitted)`
                    : 'All Preflight Checks Passed'}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold">
                {preflightResult.blockingCount === 0 ? 'READY FOR REVIEW' : 'ACTION REQUIRED'}
              </span>
            </div>

            {/* Checklist Items List */}
            <div className="max-h-72 overflow-y-auto space-y-2.5 text-xs pr-1">
              {preflightResult.issues.length > 0 ? (
                preflightResult.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${
                            issue.type === 'blocking'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {issue.type}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {issue.category}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-normal">{issue.message}</p>
                    </div>

                    {issue.sectionId && (
                      <button
                        onClick={() => {
                          setActiveSectionId(issue.sectionId!);
                          setShowPreflightModal(false);
                        }}
                        className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 shrink-0"
                      >
                        {issue.fixActionLabel || 'Fix'}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  No blocking issues or warnings. The report is fully compliant.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <Link
                href={`/engineer/reports/${report.id}/settings`}
                className="text-[#3B68DE] hover:underline font-semibold"
              >
                Page Setup & Layout Settings →
              </Link>

              <button
                type="button"
                onClick={() => setShowPreflightModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Preflight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Template Picker Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                  Add Section from Institutional Template
                </h3>
                <p className="text-xs text-slate-500">
                  Select a standardized section structure to maintain compliance across engineering reports.
                </p>
              </div>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {[
                {
                  title: 'Physical Work Packages & Delivery Progress',
                  category: 'Execution',
                  guidance: 'Itemize chainages, grid lines, pour tickets, and physical percentage completions.',
                  placeholder: 'Draft work packages, grid alignments, and structural progress metrics...',
                },
                {
                  title: 'Concrete Compressive Strength QA & Testing',
                  category: 'Quality QA/QC',
                  guidance: 'Tabulate 7-day and 28-day cube breaks, slump tests, and laboratory certificate numbers.',
                  placeholder: 'Record laboratory test specimen IDs, batching tickets, and MPa strengths...',
                },
                {
                  title: 'LASBCA & Regulatory Notices Compliance',
                  category: 'Statutory',
                  guidance: 'Record district authority inspection visits, stage notices, and official sign-off stamps.',
                  placeholder: 'Record LASBCA stage notices, official inspectorial observations, and permits...',
                },
                {
                  title: 'Health, Safety & Environmental Observations',
                  category: 'HSE',
                  guidance: 'Log toolbox talks, PPE adherence, safety hazard mitigations, and environmental controls.',
                  placeholder: 'Document safe working hours, site audits, and environmental mitigation protocols...',
                },
                {
                  title: 'Critical Path Schedule & Look-Ahead Risks',
                  category: 'Planning',
                  guidance: 'Document milestone dependencies, procurement lead times, and weather risk mitigations.',
                  placeholder: 'Itemize 2-week look-ahead milestones and material delivery contingencies...',
                },
                {
                  title: 'Blank Custom Section',
                  category: 'Custom',
                  guidance: 'Author a custom section tailored to specific project requirements.',
                  placeholder: 'Draft custom section narrative...',
                },
              ].map((template, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    handleAddSectionFromTemplate(template.title, template.guidance, template.placeholder)
                  }
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#001237] hover:bg-slate-50/80 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-[#001237]">
                        {template.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{template.guidance}</p>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#001237] shrink-0 mt-0.5" />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
