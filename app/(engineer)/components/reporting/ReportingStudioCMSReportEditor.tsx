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
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StudioReport, ReportSection } from '@/lib/types/reporting-studio';
import {
  saveStudioDraft,
  submitReportForReview,
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
  const [submitAuthorNotes, setSubmitAuthorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Assistant states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    sectionId: string;
    text: string;
    actionType: string;
  } | null>(null);

  const activeSection = useMemo(() => {
    return report.sections.find((s) => s.id === activeSectionId) || report.sections[0] || null;
  }, [report.sections, activeSectionId]);

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
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/engineer/reports/drafts"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                {report.reportNumber}
              </span>
              <Badge variant="blue" size="sm">
                {report.currentVersion}
              </Badge>
              <Badge variant="teal" size="sm">
                {report.projectName}
              </Badge>
            </div>
            <h1 className="text-base font-bold text-slate-900 font-condensed tracking-tight mt-0.5">
              {report.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Save Status Indicator */}
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium px-2">
            {saveStatus === 'saving' && (
              <span className="text-blue-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved ({lastSavedTime})
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-amber-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Unsaved changes
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleManualSave}
            disabled={saveStatus === 'saved'}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>

          <Link
            href={`/engineer/reports/${report.id}/preview`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* 3-Region Desktop CMS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Region: Report Outline & Navigation (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              Report Outline
            </h2>
            <span className="text-[11px] font-mono font-bold text-slate-400">
              {completedCount}/{report.sections.length} Ready
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

          <button
            onClick={handleAddSection}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-slate-400 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Section</span>
          </button>
        </div>

        {/* Center Region: Structured Editor Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          {activeSection ? (
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
        <div className="lg:col-span-3 space-y-5">
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
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
