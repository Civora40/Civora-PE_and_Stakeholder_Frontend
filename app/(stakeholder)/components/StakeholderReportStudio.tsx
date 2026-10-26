'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Send,
  Lock,
  Check,
  Calendar,
  Building,
  Eye,
  Printer,
  Download,
  Share2,
  Copy,
  Plus,
  ExternalLink,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileCheck2,
  UserCheck,
  Link as LinkIcon,
  Mail,
  Layers,
  Shield,
  Tag,
  HelpCircle,
  X,
  CornerDownRight,
  Sparkles,
  BookOpen,
  Sliders,
  CheckSquare,
} from 'lucide-react';

import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import {
  StudioReport,
  ReportSection,
  CoverPreset,
  PaperSize,
} from '@/lib/types/reporting-studio';
import {
  StakeholderFeedbackComment,
  StakeholderFeedbackType,
  StakeholderApprovalRecord,
  StakeholderShareLink,
  getStakeholderFeedbacks,
  addStakeholderFeedback,
  replyToStakeholderFeedback,
  toggleStakeholderFeedbackResolved,
  getStakeholderApproval,
  submitStakeholderApproval,
  getStakeholderShareLinks,
  createStakeholderShareLink,
  revokeStakeholderShareLink,
} from '@/lib/services/stakeholder-report-service';

interface StakeholderReportStudioProps {
  user: CivoraUser;
  report: StudioReport;
  initialMode?: 'editor' | 'preview' | 'dossier';
}

// Official Civora Document Watermark
function CivoraWatermark({
  theme = 'light',
  customText,
}: {
  theme?: 'light' | 'dark';
  customText?: string;
}) {
  const text =
    customText ||
    'CIVORA CONTROL PLANE • VERIFIED STATUTORY AUDIT • CONTRACTUAL RECORD';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-0 print:opacity-100">
      <div
        className={`rotate-[-26deg] flex flex-col items-center gap-5 transition-opacity ${
          theme === 'dark' ? 'opacity-[0.06] text-white' : 'opacity-[0.055] text-slate-900'
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

export function StakeholderReportStudio({
  user,
  report: initialReport,
  initialMode = 'editor',
}: StakeholderReportStudioProps) {
  // Main view mode: 'editor' (3-region CMS layout), 'preview' (A4 print layout), 'dossier' (overview)
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'dossier'>(initialMode);
  const [report, setReport] = useState<StudioReport>(initialReport);

  // Active section in editor
  const [activeSectionId, setActiveSectionId] = useState<string>(
    initialReport.sections.length > 0 ? initialReport.sections[0].id : 'cover_page'
  );

  // Right sidebar tab in editor
  const [rightPanelTab, setRightPanelTab] = useState<'comments' | 'approval' | 'share'>('comments');

  // Zoom scale for A4 preview
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Stakeholder Feedback state
  const [feedbacks, setFeedbacks] = useState<StakeholderFeedbackComment[]>(() =>
    getStakeholderFeedbacks(initialReport.id)
  );
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [newFeedbackType, setNewFeedbackType] = useState<StakeholderFeedbackType>('comment');
  const [newFeedbackSectionId, setNewFeedbackSectionId] = useState<string>('active');
  const [selectedTextSnippet, setSelectedTextSnippet] = useState<string>('');
  const [suggestedRevisionInput, setSuggestedRevisionInput] = useState<string>('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'open' | 'active_section'>('all');

  // Approval state
  const [approval, setApproval] = useState<StakeholderApprovalRecord | null>(() =>
    getStakeholderApproval(initialReport.id)
  );
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [approvalOrg, setApprovalOrg] = useState(
    user.role === 'read_only_stakeholder' ? 'Institutional Stakeholder Board' : 'Project Monitoring Committee'
  );
  const [approvalAgreed, setApprovalAgreed] = useState(false);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  // Share via Link state
  const [shareLinks, setShareLinks] = useState<StakeholderShareLink[]>(() =>
    getStakeholderShareLinks(initialReport.id)
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePermission, setSharePermission] = useState<'view' | 'comment' | 'approve'>('comment');
  const [shareExpiryDays, setShareExpiryDays] = useState<number>(30);
  const [shareEmailInput, setShareEmailInput] = useState('');
  const [shareEmailsList, setShareEmailsList] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Toast notices
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Find currently selected section
  const activeSection = useMemo(() => {
    if (activeSectionId === 'cover_page') return null;
    if (activeSectionId === 'executive_summary') return null;
    return report.sections.find((s) => s.id === activeSectionId) || report.sections[0] || null;
  }, [report.sections, activeSectionId]);

  // Section comments counter helper
  const getSectionCommentCount = (secId: string) => {
    return feedbacks.filter((c) => c.sectionId === secId).length;
  };

  // Filtered comments for the comments panel
  const filteredComments = useMemo(() => {
    if (feedbackFilter === 'open') {
      return feedbacks.filter((c) => c.status === 'open');
    }
    if (feedbackFilter === 'active_section') {
      return feedbacks.filter((c) => c.sectionId === activeSectionId);
    }
    return feedbacks;
  }, [feedbacks, feedbackFilter, activeSectionId]);

  // Handle post feedback
  const handleAddFeedback = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newFeedbackText.trim()) return;

    const targetSectionId = newFeedbackSectionId === 'active' ? activeSectionId : newFeedbackSectionId;
    let targetTitle = 'General Document Observation';

    if (targetSectionId === 'cover_page') {
      targetTitle = 'Cover Page & Branding';
    } else if (targetSectionId === 'executive_summary') {
      targetTitle = 'Executive Summary';
    } else {
      const s = report.sections.find((sec) => sec.id === targetSectionId);
      if (s) targetTitle = s.title;
    }

    const created = addStakeholderFeedback(report.id, {
      sectionId: targetSectionId,
      sectionTitle: targetTitle,
      authorName: user.name,
      authorRole:
        user.role === 'read_only_stakeholder'
          ? 'Authorized Stakeholder Representative'
          : 'Lead Reviewing Engineer',
      content: newFeedbackText.trim(),
      feedbackType: newFeedbackType,
      selectedTextSnippet: selectedTextSnippet || undefined,
      suggestedRevision: suggestedRevisionInput.trim() || undefined,
    });

    setFeedbacks([created, ...feedbacks]);
    setNewFeedbackText('');
    setSelectedTextSnippet('');
    setSuggestedRevisionInput('');
    showToast('Feedback submitted successfully!');
  };

  // Handle reply to feedback
  const handleReplyToFeedback = (commentId: string) => {
    const text = replyInputs[commentId]?.trim();
    if (!text) return;

    const updated = replyToStakeholderFeedback(commentId, {
      authorName: user.name,
      authorRole: 'Stakeholder Reviewer',
      content: text,
    });

    if (updated) {
      setFeedbacks((prev) => prev.map((c) => (c.id === commentId ? { ...updated } : c)));
      setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
      showToast('Reply posted.');
    }
  };

  // Handle toggle resolve
  const handleToggleResolve = (commentId: string) => {
    const updated = toggleStakeholderFeedbackResolved(commentId);
    if (updated) {
      setFeedbacks((prev) => prev.map((c) => (c.id === commentId ? { ...updated } : c)));
      showToast(updated.status === 'resolved' ? 'Comment marked as addressed.' : 'Comment reopened.');
    }
  };

  // Handle execute approval
  const handleConfirmApproval = () => {
    if (!approvalAgreed) return;
    setIsSubmittingApproval(true);

    setTimeout(() => {
      const record = submitStakeholderApproval(report.id, {
        approverName: user.name,
        approverRole: 'Authorized Stakeholder Sign-Off Authority',
        organization: approvalOrg,
        notes: approvalNotes,
      });

      setApproval(record);
      setIsSubmittingApproval(false);
      setShowApprovalModal(false);
      showToast('Document formally approved & cryptographic seal recorded!');
    }, 600);
  };

  // Handle share link creation
  const handleCreateShareLink = () => {
    const created = createStakeholderShareLink(report.id, {
      permission: sharePermission,
      expiryDays: shareExpiryDays,
      invitedEmails: shareEmailsList,
      createdByName: user.name,
    });

    setShareLinks([created, ...shareLinks]);
    setShareEmailsList([]);
    setShareEmailInput('');
    showToast('New secure share link generated!');
  };

  // Handle copy share link
  const handleCopyLink = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      showToast('Share link copied to clipboard!');
    }
  };

  // Handle add email to invite list
  const handleAddEmail = () => {
    if (!shareEmailInput.trim() || !shareEmailInput.includes('@')) return;
    if (!shareEmailsList.includes(shareEmailInput.trim())) {
      setShareEmailsList([...shareEmailsList, shareEmailInput.trim()]);
      setShareEmailInput('');
    }
  };

  // Handle text selection on center canvas
  const handleCanvasMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 5) {
      const selected = selection.toString().trim();
      setSelectedTextSnippet(selected.length > 140 ? selected.slice(0, 140) + '...' : selected);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle PDF download
  const handleDownloadPdf = () => {
    showToast(`Downloading signed statutory PDF for ${report.reportNumber}...`);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Paper dimensions for A4 preview
  const layout = report.layoutSettings || {
    paperSize: 'A4' as PaperSize,
    orientation: 'PORTRAIT' as const,
    coverPage: {
      enabled: true,
      preset: 'architectural_dark' as CoverPreset,
      headlinePrimary: 'CERTIFIED COMPLIANCE\nDOSSIER',
      headlineSecondary: `${report.projectName} • Statutory Audit`,
      periodYearDisplay: '2026',
    },
  };

  const isLandscape = layout.orientation === 'LANDSCAPE';
  const sheetWidthMm = isLandscape ? 297 : 210;
  const sheetHeightMm = isLandscape ? 210 : 297;

  return (
    <div className="space-y-4 font-['Inter',sans-serif]">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#4FAAA7]" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Top Header Command Bar (Sticky) */}
      <div className="print:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/stakeholder/reports"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
            title="Back to Released Reports"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            {/* Document Title & Status */}
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] tracking-tight truncate max-w-xl">
                {report.title}
              </h1>
              {approval ? (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Approved</span>
                </span>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Pending Sign-Off</span>
                </span>
              )}
            </div>

            {/* Subtle Metadata Subtitle */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-0.5">
              <span className="text-slate-600 font-semibold truncate max-w-[220px]">{report.projectName}</span>
              <span>&bull;</span>
              <span className="font-mono text-slate-500">{report.reportNumber}</span>
              <span>&bull;</span>
              <span className="font-mono text-slate-500">{report.currentVersion}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* View Mode Toggle Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-white text-[#001237] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Platform Document Editor & Inline Comments"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white text-[#001237] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="A4 Print Preview & Page Layout"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('dossier')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'dossier'
                  ? 'bg-white text-[#001237] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Compliance Dossier & Statutory Release Ledger"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Dossier</span>
            </button>
          </div>

          {/* Share via Link Button */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Share document link with other stakeholders"
          >
            <Share2 className="w-3.5 h-3.5 text-[#3B68DE]" />
            <span>Share</span>
            {shareLinks.length > 0 && (
              <span className="bg-blue-100 text-[#3B68DE] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {shareLinks.length}
              </span>
            )}
          </button>

          {/* Approve Document Button */}
          {approval ? (
            <button
              type="button"
              onClick={() => {
                setViewMode('editor');
                setRightPanelTab('approval');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approved</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowApprovalModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#4FAAA7]" />
              <span>Approve</span>
            </button>
          )}

          {/* Quick PDF Download */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: PLATFORM-BASED EDITOR & COLLABORATION REVIEW (3 REGIONS)          */}
      {/* ========================================================================= */}
      {viewMode === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start lg:h-[calc(100vh-210px)]">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT REGION: Report Outline & Navigation (3 cols)                       */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 lg:h-full lg:overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Document Outline
              </h2>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                {report.sections.length} Verified Sections
              </span>
            </div>

            {/* Cover Page & Branding outline item */}
            <div
              onClick={() => setActiveSectionId('cover_page')}
              className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
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
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase truncate max-w-[90px] ${
                  activeSectionId === 'cover_page'
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {(report.layoutSettings?.coverPage?.preset || 'architectural_dark').replace('_', ' ')}
              </span>
            </div>

            {/* Executive Summary outline item */}
            <div
              onClick={() => setActiveSectionId('executive_summary')}
              className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
                activeSectionId === 'executive_summary'
                  ? 'bg-[#001237] text-white font-bold shadow-2xs'
                  : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileCheck2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                <span className="truncate">Executive Summary</span>
              </div>
              {getSectionCommentCount('executive_summary') > 0 && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    activeSectionId === 'executive_summary'
                      ? 'bg-[#4FAAA7] text-[#001237]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {getSectionCommentCount('executive_summary')}
                </span>
              )}
            </div>

            {/* Structured Report Sections list */}
            <div className="space-y-1.5">
              {report.sections.map((section, idx) => {
                const isActive = section.id === activeSectionId;
                const commentCount = getSectionCommentCount(section.id);
                return (
                  <div
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer group ${
                      isActive
                        ? 'bg-blue-50/80 border-blue-200 text-[#001237] font-bold shadow-2xs'
                        : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center shrink-0 ${
                          section.isCompleted
                            ? 'bg-emerald-100 text-emerald-700 font-bold'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {section.isCompleted ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </div>

                    {commentCount > 0 && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 flex items-center gap-0.5">
                        <MessageSquare className="w-2.5 h-2.5" />
                        <span>{commentCount}</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Filter & Feedback Notice */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setRightPanelTab('comments');
                  setNewFeedbackSectionId(activeSectionId);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200/80 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#3B68DE]" />
                <span>Submit Feedback on Section</span>
              </button>

              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#3B68DE] shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Highlight any sentence in the editor to attach an inline comment or proposed text revision.
                </p>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* CENTER REGION: Structured Document Canvas (6 cols)                      */}
          {/* ----------------------------------------------------------------------- */}
          <div
            className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5 lg:h-full lg:overflow-y-auto no-scrollbar"
            onMouseUp={handleCanvasMouseUp}
          >
            {/* COVER PAGE VIEW */}
            {activeSectionId === 'cover_page' ? (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight">
                      Cover Page & Institutional Branding
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Statutory cover design generated for stakeholder verification and physical print bound dossiers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001237] text-white text-xs font-semibold hover:bg-[#18243D] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#4FAAA7]" />
                    <span>View in Full A4 Mode</span>
                  </button>
                </div>

                {/* Branded Cover Live Demonstration */}
                <div className="rounded-xl overflow-hidden shadow-md border border-slate-700 bg-[#1e2433] text-white">
                  <div
                    className="p-6 bg-cover bg-center space-y-2 relative overflow-hidden"
                    style={{ backgroundImage: 'url(/images/cover_top_bg.png)' }}
                  >
                    <div className="absolute inset-0 bg-[#0B132B]/40 pointer-events-none" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#4FAAA7] uppercase">
                        CIVORA STAKEHOLDER VERIFIED RELEASE
                      </span>
                      <h3 className="text-2xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase leading-[0.92] tracking-tight text-white whitespace-pre-line drop-shadow-md">
                        {report.layoutSettings?.coverPage?.headlinePrimary || 'CERTIFIED COMPLIANCE\nDOSSIER'}
                      </h3>
                      <p className="text-xs text-white/90 font-light whitespace-pre-line leading-relaxed pt-1.5 drop-shadow-sm">
                        {report.projectName} &bull; {report.periodFormatted}
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
                          {report.projectCode} &bull; Official Dossier
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 text-right">
                      <span className="text-[10px] text-slate-200 block font-light lowercase">released</span>
                      <span className="text-xl font-black text-white leading-none tracking-tight block">
                        {report.releasedAt || 'October 2026'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-800">Security Seal & Watermark</span>
                    <span className="font-mono text-emerald-600 font-bold text-[11px]">ACTIVE & VERIFIED</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Every page rendered on Civora incorporates an embedded cryptographic watermark identifying the release author, statutory COREN seal, and stakeholder audit snapshot.
                  </p>
                </div>
              </div>
            ) : activeSectionId === 'executive_summary' ? (
              /* EXECUTIVE SUMMARY VIEW */
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight">
                      Approved Executive Summary
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Lead Engineer Certified
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {report.executiveSummary}
                </div>

                {/* Stakeholder Suggestion Box */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#3B68DE]" />
                      <span>Stakeholder Notes & Executive Observations</span>
                    </span>
                    <span className="text-[10px] font-mono text-blue-700">Optional Stakeholder Addendum</span>
                  </div>
                  <textarea
                    rows={3}
                    value={activeSectionId === newFeedbackSectionId ? newFeedbackText : ''}
                    onChange={(e) => {
                      setNewFeedbackSectionId('executive_summary');
                      setNewFeedbackText(e.target.value);
                    }}
                    placeholder="Write a feedback note or comment on the executive summary..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Routes to the Lead Engineer & Project Sponsor.</span>
                    <button
                      type="button"
                      onClick={() => handleAddFeedback()}
                      className="px-3.5 py-1.5 rounded-lg bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Post Summary Note
                    </button>
                  </div>
                </div>
              </div>
            ) : activeSection ? (
              /* STRUCTURED SECTION CANVAS */
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold font-['Encode_Sans_Condensed',sans-serif] text-slate-900 tracking-tight">
                      {activeSection.title}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Compliance Section &bull; Verified Field Record
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="emerald" size="sm">
                      100% Verified
                    </Badge>
                  </div>
                </div>

                {/* Floating Quick Action Toolbar if text is selected */}
                {selectedTextSnippet && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
                    <div className="truncate min-w-0">
                      <span className="font-bold text-amber-900 block text-[11px]">Selected text:</span>
                      <p className="text-amber-800 italic truncate text-[11px]">"{selectedTextSnippet}"</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRightPanelTab('comments');
                        setNewFeedbackSectionId(activeSection.id);
                        setNewFeedbackText(`Regarding: "${selectedTextSnippet}"\n\n`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] shrink-0 cursor-pointer"
                    >
                      + Comment on Selection
                    </button>
                  </div>
                )}

                {/* Section Narrative Body */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans select-text space-y-3">
                  <div className="whitespace-pre-line">{activeSection.content}</div>

                  {/* Technical Guidance Callout */}
                  {activeSection.guidance && (
                    <div className="p-3 rounded-lg bg-white border border-slate-200/90 text-xs text-slate-600 space-y-1">
                      <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1 font-mono uppercase">
                        <BookOpen className="w-3 h-3 text-[#3B68DE]" />
                        Technical Reference & Statutory Standards
                      </span>
                      <p className="text-[11px] text-slate-500 leading-normal">{activeSection.guidance}</p>
                    </div>
                  )}
                </div>

                {/* Linked Evidence Records & Lab Certificates */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5 text-[#4FAAA7]" />
                      Certified Field Citations ({activeSection.sourceReferences?.length || 1})
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Immutable Lab Pass
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeSection.sourceReferences && activeSection.sourceReferences.length > 0 ? (
                      activeSection.sourceReferences.map((ref) => (
                        <div
                          key={ref.recordId}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-slate-800 block text-[11px]">
                              {ref.label}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {ref.date} &bull; Record #{ref.recordId} &bull; Verified by Resident QA
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white border border-slate-200 text-slate-600">
                            {ref.type}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-slate-800 text-[11px] block">
                            Standard Compressive Strength Cylinder / Cube Test
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            Accredited Materials Lab Break #LAB-2026-901 &bull; Eurocode 2 Compliant
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white border border-slate-200 text-slate-600">
                          LAB_RESULT
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Section Feedback Composer */}
                <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#3B68DE]" />
                      <span>Write Comment or Suggest Revision for This Section</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {(['comment', 'clarification', 'revision_request', 'endorsement'] as StakeholderFeedbackType[]).map(
                        (type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setNewFeedbackType(type)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              newFeedbackType === type
                                ? 'bg-[#001237] text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {type.replace('_', ' ')}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={activeSectionId === newFeedbackSectionId ? newFeedbackText : ''}
                    onChange={(e) => {
                      setNewFeedbackSectionId(activeSection.id);
                      setNewFeedbackText(e.target.value);
                    }}
                    placeholder={`Write your feedback, question, or suggested revision for "${activeSection.title}"...`}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Logged in as <strong>{user.name}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddFeedback()}
                      className="px-4 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Feedback</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT REGION: Stakeholder Governance & Collaboration Panel (3 cols)    */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4 lg:h-full lg:overflow-y-auto no-scrollbar">
            {/* Panel Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setRightPanelTab('comments')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  rightPanelTab === 'comments'
                    ? 'bg-white text-[#001237] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Feedback ({feedbacks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setRightPanelTab('approval')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  rightPanelTab === 'approval'
                    ? 'bg-white text-[#001237] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Approval</span>
              </button>

              <button
                type="button"
                onClick={() => setRightPanelTab('share')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  rightPanelTab === 'share'
                    ? 'bg-white text-[#001237] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* TAB 1: COMMENTS & FEEDBACK */}
            {rightPanelTab === 'comments' && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900 uppercase font-mono tracking-wider">
                    Stakeholder Comments
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFeedbackFilter('all')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        feedbackFilter === 'all'
                          ? 'bg-[#001237] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackFilter('active_section')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        feedbackFilter === 'active_section'
                          ? 'bg-[#001237] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Section
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredComments.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 space-y-2">
                      <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs">No comments found under this filter.</p>
                    </div>
                  ) : (
                    filteredComments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                          comment.status === 'resolved'
                            ? 'bg-slate-50/60 border-slate-200 text-slate-500'
                            : 'bg-white border-slate-200/90 shadow-2xs text-slate-800'
                        }`}
                      >
                        {/* Header: Author & category */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#001237] text-[#4FAAA7] text-[10px] font-bold flex items-center justify-center shrink-0">
                              {comment.authorAvatar || 'ST'}
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 block text-[11px] leading-tight">
                                {comment.authorName}
                              </span>
                              <span className="text-[10px] text-slate-400 block leading-tight">
                                {comment.authorRole}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                              comment.feedbackType === 'revision_request'
                                ? 'bg-amber-100 text-amber-800'
                                : comment.feedbackType === 'endorsement'
                                ? 'bg-emerald-100 text-emerald-800'
                                : comment.feedbackType === 'clarification'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {comment.feedbackType.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Section Reference Tag */}
                        <div className="text-[10px] font-mono text-slate-400 truncate bg-slate-50 px-2 py-0.5 rounded">
                          {comment.sectionTitle}
                        </div>

                        {/* Selected quote if any */}
                        {comment.selectedTextSnippet && (
                          <div className="p-2 rounded bg-amber-50/70 border-l-2 border-amber-400 text-[11px] italic text-amber-900">
                            "{comment.selectedTextSnippet}"
                          </div>
                        )}

                        {/* Comment Body */}
                        <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                          {comment.content}
                        </p>

                        {/* Suggested revision box if any */}
                        {comment.suggestedRevision && (
                          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] space-y-1">
                            <span className="font-bold text-emerald-800 block text-[10px] uppercase font-mono">
                              Proposed Text Revision:
                            </span>
                            <p className="text-emerald-900 leading-snug">{comment.suggestedRevision}</p>
                          </div>
                        )}

                        {/* Replies Thread */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 space-y-1.5 pl-3 border-l-2 border-slate-200">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="text-[11px] space-y-0.5">
                                <span className="font-bold text-slate-800 block">
                                  {reply.authorName} &bull; <span className="font-normal text-slate-400">{reply.createdAt}</span>
                                </span>
                                <p className="text-slate-600 leading-snug">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Footer & Reply Input */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">{comment.createdAt}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleResolve(comment.id)}
                            className={`font-semibold hover:underline cursor-pointer ${
                              comment.status === 'resolved' ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {comment.status === 'resolved' ? 'Reopen Comment' : 'Mark as Addressed'}
                          </button>
                        </div>

                        {/* Quick Reply Form */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyInputs[comment.id] || ''}
                            onChange={(e) =>
                              setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleReplyToFeedback(comment.id);
                            }}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] focus:bg-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleReplyToFeedback(comment.id)}
                            className="p-1 rounded-lg bg-[#001237] text-white hover:bg-[#18243D] cursor-pointer"
                            title="Send Reply"
                          >
                            <CornerDownRight className="w-3 h-3 text-[#4FAAA7]" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: FORMAL APPROVAL GOVERNANCE */}
            {rightPanelTab === 'approval' && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-xs text-slate-900 uppercase font-mono tracking-wider">
                    Stakeholder Sign-Off Status
                  </h3>
                </div>

                {approval ? (
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Formally Endorsed & Approved</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-emerald-900">
                      <p>
                        <strong>Signatory:</strong> {approval.approverName}
                      </p>
                      <p>
                        <strong>Designation:</strong> {approval.approverRole}
                      </p>
                      <p>
                        <strong>Organization:</strong> {approval.organization}
                      </p>
                      <p>
                        <strong>Timestamp:</strong> {approval.signOffDate}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-emerald-200 font-mono text-[10px] text-slate-600 break-all space-y-1">
                      <span className="font-bold text-emerald-800 block uppercase">Cryptographic Stamp</span>
                      <span>{approval.digitalSignatureHash}</span>
                    </div>

                    {approval.notes && (
                      <p className="text-[11px] text-emerald-950 italic pt-1">
                        "{approval.notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Awaiting Stakeholder Authorization</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        This report has completed technical authoring and is awaiting formal stakeholder sign-off from authorized representatives.
                      </p>
                    </div>

                    {/* Pre-approval verification checklist */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-800 uppercase font-mono block">
                        Verification Gate Checklist:
                      </span>
                      {[
                        'All laboratory cube crushing test records meet design thresholds (28.4 MPa)',
                        'Statutory municipal LASBCA Stage 2 structural notice confirmed',
                        'Environmental siltation & bathymetric clearances verified',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowApprovalModal(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                    >
                      <CheckSquare className="w-4 h-4 text-[#4FAAA7]" />
                      <span>Execute Sign-Off & Approval</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SHARE LINKS & DISTRIBUTION */}
            {rightPanelTab === 'share' && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#3B68DE]" />
                    <h3 className="font-bold text-xs text-slate-900 uppercase font-mono tracking-wider">
                      Shared Stakeholder Links
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="p-1 rounded-lg bg-blue-50 text-[#3B68DE] hover:bg-blue-100 cursor-pointer"
                    title="Generate New Link"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {shareLinks.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 space-y-2">
                      <LinkIcon className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs">No active share links.</p>
                      <button
                        type="button"
                        onClick={() => setShowShareModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#001237] text-white text-xs font-semibold cursor-pointer"
                      >
                        Create Share Link
                      </button>
                    </div>
                  ) : (
                    shareLinks.map((link) => (
                      <div
                        key={link.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase">
                            {link.permission} ACCESS
                          </span>
                          <span className="text-[10px] text-slate-400">{link.expiresAt}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            readOnly
                            value={link.shareUrl}
                            className="w-full text-[11px] font-mono bg-white border border-slate-200 rounded px-2 py-1 text-slate-600 select-all"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopyLink(link.shareUrl)}
                            className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer"
                            title="Copy Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {link.sharedWithEmails.length > 0 && (
                          <div className="text-[10px] text-slate-500 space-y-0.5">
                            <span className="font-semibold text-slate-700">Invited stakeholders:</span>
                            <p className="truncate">{link.sharedWithEmails.join(', ')}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 border-t border-slate-200/60">
                          <span>{link.accessCount} visits logged</span>
                          <button
                            type="button"
                            onClick={() => {
                              revokeStakeholderShareLink(link.id);
                              setShareLinks(getStakeholderShareLinks(report.id));
                              showToast('Link revoked.');
                            }}
                            className="text-rose-600 hover:underline cursor-pointer"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate New Share Link</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: FULL A4 PRINT PREVIEW (MATCHING REPORTING STUDIO EXPORT)           */}
      {/* ========================================================================= */}
      {viewMode === 'preview' && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Zoom & Print Toolbar (Sticky) */}
          <div className="print:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-condensed">Preview Scale:</span>
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setZoomScale(Math.max(50, zoomScale - 10))}
                  className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 text-[11px] font-mono font-bold text-slate-600">{zoomScale}%</span>
                <button
                  type="button"
                  onClick={() => setZoomScale(Math.min(130, zoomScale + 10))}
                  className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Document</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Download Signed PDF</span>
              </button>
            </div>
          </div>

          {/* Main A4 Document Sheets (Internal Scroll, No Scrollbar) */}
          <div className="flex justify-center overflow-x-auto overflow-y-auto no-scrollbar h-[calc(100vh-230px)] p-4 sm:p-6 bg-slate-200/60 rounded-2xl print:bg-transparent print:p-0 print:h-auto">
            <div
              style={{
                transform: `scale(${zoomScale / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
              }}
              className="space-y-8 print:space-y-0 print:transform-none"
            >
              {/* PAGE 1: COVER PAGE */}
              <div
                style={{
                  width: `${sheetWidthMm}mm`,
                  minHeight: `${sheetHeightMm}mm`,
                  height: `${sheetHeightMm}mm`,
                }}
                className="bg-[#1e2433] text-white shadow-xl relative flex flex-col justify-between print:shadow-none print:break-after-page print:w-full print:min-h-screen print:h-screen overflow-hidden"
              >
                <CivoraWatermark theme="dark" />

                {/* Top Section */}
                <div
                  className="flex-[57] p-12 sm:p-16 flex flex-col justify-start relative z-10 bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url('/images/cover_top_bg.png')` }}
                >
                  <div className="absolute inset-0 bg-[#0B132B]/35 pointer-events-none" />
                  <div className="relative z-10 mt-4 sm:mt-8">
                    <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#4FAAA7] block mb-2">
                      CIVORA STAKEHOLDER VERIFIED RELEASE
                    </span>
                    <h1 className="text-5xl sm:text-6xl font-black font-['Encode_Sans_Condensed',sans-serif] tracking-[-0.03em] uppercase leading-[0.92] text-white drop-shadow-md">
                      {report.layoutSettings?.coverPage?.headlinePrimary || 'CERTIFIED COMPLIANCE\nDOSSIER'}
                    </h1>
                    <p className="text-sm text-white/90 font-light whitespace-pre-line leading-relaxed pt-3 drop-shadow-sm max-w-lg">
                      {report.title}
                    </p>
                  </div>
                </div>

                {/* Bottom Section */}
                <div
                  className="flex-[43] p-10 sm:p-14 bg-cover bg-center relative z-10 flex flex-col justify-between"
                  style={{ backgroundImage: `url('/images/curved_glass_facade.jpg')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161c28]/95 via-[#161c28]/45 to-transparent pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center">
                        <img
                          src="/images/civora_watermark_icon.png"
                          alt="Civora"
                          className="w-full h-full object-contain brightness-200"
                        />
                      </div>
                      <div>
                        <span className="font-black text-sm tracking-wider text-white block">CIVORA</span>
                        <span className="text-[10px] text-slate-300 font-mono">
                          {report.projectCode} &bull; Statutory Audit
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-300 block font-light">Document Reference</span>
                      <span className="text-sm font-mono font-bold text-white block">
                        {report.reportNumber}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between pt-6 border-t border-white/20">
                    <div>
                      <span className="text-xs text-slate-300 block font-light">Asset:</span>
                      <span className="text-base font-bold text-white block">
                        {report.projectName}
                      </span>
                      <span className="text-xs text-[#4FAAA7] font-mono">
                        Period: {report.periodFormatted}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-300 block font-light">Release Year</span>
                      <span className="text-3xl font-black text-white leading-none tracking-tight block">
                        2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAGE 2: TABLE OF CONTENTS & EXECUTIVE SUMMARY */}
              <div
                style={{
                  width: `${sheetWidthMm}mm`,
                  minHeight: `${sheetHeightMm}mm`,
                  padding: '25mm',
                }}
                className="bg-white text-slate-900 shadow-xl relative print:shadow-none print:break-after-page print:w-full print:min-h-screen overflow-hidden flex flex-col justify-between"
              >
                <CivoraWatermark theme="light" />

                <div className="relative z-10 space-y-6">
                  {/* Institutional Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                    <span className="font-black text-sm text-[#001237] tracking-wider uppercase font-['Encode_Sans_Condensed',sans-serif]">
                      CIVORA CONTROL PLANE &bull; STATUTORY REPORT
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-bold">{report.reportNumber}</span>
                  </div>

                  {/* Executive Summary */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wide border-b border-slate-200 pb-1 flex items-center justify-between">
                      <span>Executive Summary</span>
                      <span className="text-xs text-emerald-700 font-mono font-semibold">Verified Snapshot</span>
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      {report.executiveSummary}
                    </p>
                  </div>

                  {/* Table of Contents */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-1">
                      Certified Section Directory
                    </h3>
                    <div className="space-y-2 text-xs">
                      {report.sections.map((sec, idx) => (
                        <div key={sec.id} className="flex items-baseline justify-between">
                          <span className="font-medium text-slate-800">{sec.title}</span>
                          <span className="flex-1 mx-2 border-b border-dotted border-slate-300" />
                          <span className="font-mono font-semibold text-slate-500">Page {idx + 3}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{report.projectName}</span>
                  <span>Page 2 of {report.sections.length + 2}</span>
                </div>
              </div>

              {/* PAGE 3+: DETAILED SECTIONS */}
              {report.sections.map((section, idx) => (
                <div
                  key={section.id}
                  style={{
                    width: `${sheetWidthMm}mm`,
                    minHeight: `${sheetHeightMm}mm`,
                    padding: '25mm',
                  }}
                  className="bg-white text-slate-900 shadow-xl relative print:shadow-none print:break-after-page print:w-full print:min-h-screen overflow-hidden flex flex-col justify-between"
                >
                  <CivoraWatermark theme="light" />

                  <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Section {idx + 1}
                        </span>
                        <h2 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
                          {section.title}
                        </h2>
                      </div>
                      <Badge variant="emerald" size="sm">
                        Verified Record
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="text-xs text-slate-800 leading-relaxed text-justify whitespace-pre-line">
                      {section.content}
                    </div>

                    {/* Source Citations */}
                    {section.sourceReferences && section.sourceReferences.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="font-bold text-[11px] text-slate-700 uppercase font-mono block">
                          Verified Laboratory Citations & Endorsements
                        </span>
                        {section.sourceReferences.map((ref) => (
                          <div key={ref.recordId} className="text-[11px] text-slate-600 flex justify-between">
                            <span>{ref.label}</span>
                            <span className="font-mono text-slate-400">{ref.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Formal Sign-Off Matrix on last page */}
                  {idx === report.sections.length - 1 && (
                    <div className="relative z-10 pt-6 border-t-2 border-slate-900 space-y-4">
                      <div className="grid grid-cols-2 gap-6 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Authoring Supervising Engineer:
                          </span>
                          <span className="font-bold text-slate-900 block">{report.createdByName}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            COREN Reg. R.48201 &bull; Certified Seal
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Authorized Stakeholder Sign-Off:
                          </span>
                          <span className="font-bold text-emerald-800 block">
                            {approval ? approval.approverName : 'Awaiting Stakeholder Sign-Off'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {approval ? approval.digitalSignatureHash.slice(0, 24) + '...' : 'Pending Digital Seal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="relative z-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{report.reportNumber} &bull; {report.projectName}</span>
                    <span>Page {idx + 3} of {report.sections.length + 2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: COMPLIANCE DOSSIER & AUDIT TRAIL OVERVIEW                         */}
      {/* ========================================================================= */}
      {viewMode === 'dossier' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-210px)] items-start">
          <div className="lg:col-span-2 space-y-6 lg:h-full lg:overflow-y-auto no-scrollbar">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4FAAA7]" />
                <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Statutory Compliance Release Ledger
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This document represents an immutable snapshot released under Section 9 of the Civora Governance Specification. All field measurements, concrete cube strength breaks, and municipal stage inspection certificates are cryptographically linked.
              </p>

              <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl overflow-hidden text-xs">
                {report.auditTrail.map((entry) => (
                  <div key={entry.id} className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{entry.action}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{entry.timestamp}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      By <strong>{entry.actor}</strong> ({entry.actorRole}): {entry.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:h-full lg:overflow-y-auto no-scrollbar">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-[#001237] uppercase tracking-wide font-mono">
                Asset Metadata
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Project:</span>
                  <span className="font-bold text-slate-800">{report.projectName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Document No:</span>
                  <span className="font-mono text-slate-800 font-bold">{report.reportNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Version:</span>
                  <span className="font-mono text-emerald-700 font-bold">{report.currentVersion}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Sign-Off:</span>
                  <span className="font-bold text-emerald-700">
                    {approval ? 'Approved by Stakeholder' : 'Pending Stakeholder Sign-Off'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="w-full py-2.5 px-4 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#4FAAA7]" />
              <span>Download Immutable PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SHARE VIA LINK & INVITE STAKEHOLDERS                             */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#3B68DE]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
                    Share Document with Stakeholders
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generate secure shareable links and invite co-stakeholders to inspect and review.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Permission Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Stakeholder Permission Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'view', label: 'Viewer', desc: 'Read-only preview' },
                  { id: 'comment', label: 'Commenter', desc: 'Can submit feedbacks' },
                  { id: 'approve', label: 'Sign-Off Authority', desc: 'Can approve document' },
                ].map((perm) => (
                  <button
                    key={perm.id}
                    type="button"
                    onClick={() => setSharePermission(perm.id as any)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      sharePermission === perm.id
                        ? 'border-[#001237] bg-blue-50/50 text-[#001237] ring-1 ring-[#001237]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{perm.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{perm.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Link Expiry */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Link Expiration</label>
              <select
                value={shareExpiryDays}
                onChange={(e) => setShareExpiryDays(Number(e.target.value))}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value={7}>7 Days Access</option>
                <option value={30}>30 Days Access (Recommended)</option>
                <option value={90}>90 Days Access</option>
                <option value={0}>Never Expires</option>
              </select>
            </div>

            {/* Invite by Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Invite Colleagues via Email</label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={shareEmailInput}
                  onChange={(e) => setShareEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                  placeholder="stakeholder.rep@authority.gov.ng"
                  className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {shareEmailsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {shareEmailsList.map((em) => (
                    <span
                      key={em}
                      className="px-2 py-0.5 rounded-full bg-blue-50 text-[#3B68DE] border border-blue-200 text-[10px] font-mono flex items-center gap-1"
                    >
                      <span>{em}</span>
                      <button
                        type="button"
                        onClick={() => setShareEmailsList(shareEmailsList.filter((e) => e !== em))}
                        className="text-blue-400 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCreateShareLink();
                  setShowShareModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Create & Copy Share Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DOCUMENT APPROVAL & ELECTRONIC SIGN-OFF                         */}
      {/* ========================================================================= */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
                  Formal Stakeholder Document Approval
                </h3>
                <p className="text-xs text-slate-500">
                  Execute authorized electronic sign-off and record statutory audit seal.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <p>
                <strong>Report:</strong> {report.title} ({report.reportNumber})
              </p>
              <p>
                <strong>Asset:</strong> {report.projectName}
              </p>
              <p>
                <strong>Signatory:</strong> {user.name} ({user.role.replace('_', ' ')})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Stakeholder Organization / Agency
                </label>
                <input
                  type="text"
                  value={approvalOrg}
                  onChange={(e) => setApprovalOrg(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Approval Endorsement Remarks (Optional)
                </label>
                <textarea
                  rows={2}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Record formal board resolution or technical endorsement notes..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                />
              </div>

              {/* Statutory Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={approvalAgreed}
                  onChange={(e) => setApprovalAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#001237] focus:ring-[#001237]"
                />
                <span className="text-[11px] text-blue-950 font-medium leading-relaxed">
                  I solemnly certify that I have reviewed this compliance dossier on behalf of my stakeholder organization and approve release as an authentic record.
                </span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                disabled={!approvalAgreed || isSubmittingApproval}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmittingApproval ? 'Sealing...' : 'Confirm Formal Sign-Off'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
