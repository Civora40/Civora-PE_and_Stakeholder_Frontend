'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Building,
  Layers,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Inbox,
  Flag,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
  getStudioTemplates,
  createStudioReportDraft,
} from '@/lib/services/reporting-studio-service';

interface ReportingStudioCreateReportProps {
  user: CivoraUser;
  projects: Project[];
}

export function ReportingStudioCreateReport({ user, projects }: ReportingStudioCreateReportProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTemplateId = searchParams.get('templateId') || '';

  const templates = useMemo(() => getStudioTemplates(), []);

  // Form states
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.length > 0 ? projects[0].id : ''
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    preselectedTemplateId || 'tmpl_weekly_progress'
  );
  const [title, setTitle] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-10-15');
  const [endDate, setEndDate] = useState<string>('2026-10-22');
  const [objective, setObjective] = useState<string>('');

  // Source inclusion toggles
  const [includeSubmissions, setIncludeSubmissions] = useState(true);
  const [includeMilestones, setIncludeMilestones] = useState(true);
  const [includeInspections, setIncludeInspections] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const selectedTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedTemplateId) || null;
  }, [templates, selectedTemplateId]);

  // Auto-generate title if blank when project or template changes
  React.useEffect(() => {
    if (!title) {
      const proj = projects.find((p) => p.id === selectedProjectId);
      const tmplName = selectedTemplate?.name || 'Structured Report';
      if (proj) {
        setTitle(`${tmplName} — ${proj.code} (${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })})`);
      }
    }
  }, [selectedProjectId, selectedTemplate, title, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedProjectId) {
      setErrorMsg('Please select an authorized project.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Report title is required.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg('Reporting period start date cannot be after end date.');
      return;
    }

    setIsCreating(true);

    try {
      const draft = createStudioReportDraft({
        projectId: selectedProjectId,
        templateId: selectedTemplateId !== 'blank' ? selectedTemplateId : undefined,
        title: title.trim(),
        reportingPeriodStart: startDate,
        reportingPeriodEnd: endDate,
        authorId: user.id,
        authorName: user.name,
        authorTitle: user.title,
        reference: reference.trim() || undefined,
        objective: objective.trim() || undefined,
        selectedEvidenceCount: (includeSubmissions ? 6 : 0) + (includeMilestones ? 2 : 0) + (includeInspections ? 2 : 0),
      });

      router.push(`/engineer/reports/${draft.id}/edit`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create report draft.');
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/engineer/reports"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Reporting Studio</span>
        </Link>
      </div>

      <PageHeader
        title="Initialize New Report Draft"
        description="Select an asset, bind an approved institutional template, and link authorized field evidence."
      />

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Project & Template Selection */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              1. Project Asset & Template Schema
            </h2>
            <p className="text-xs text-slate-500">
              Select the asset you are authorized to superintend and choose an approved reporting standard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Project Asset</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium text-slate-800"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Template Standard</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium text-slate-800"
              >
                <option value="blank">Blank Structured Report (Custom Sections)</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (v{t.version} — {t.frequency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedTemplate && selectedTemplateId !== 'blank' && (
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{selectedTemplate.name}</span>
                <Badge variant="teal" size="sm">
                  {selectedTemplate.sections.length} Pre-Configured Sections
                </Badge>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {selectedTemplate.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedTemplate.sections.map((s) => (
                  <span
                    key={s.id}
                    className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-slate-600"
                  >
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Report Metadata & Period */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              2. Title & Reporting Cadence
            </h2>
            <p className="text-xs text-slate-500">
              Provide formal report title and reporting period window.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Formal Report Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Weekly Construction Progress Report — Marina Concourse Superstructure"
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Period Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Period End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Reference (Optional)</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Auto-generated if blank"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 font-mono text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Executive Objective / Note (Optional)
              </label>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Initial context or specific executive highlights for this reporting cycle..."
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Source Evidence Linking */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              3. Authorized Evidence & Source Inclusions
            </h2>
            <p className="text-xs text-slate-500">
              Only verified records from the authorized asset will be made accessible for citation and AI analysis.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={includeSubmissions}
                onChange={(e) => setIncludeSubmissions(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5 text-slate-400" />
                  Verified WhatsApp & Telegram Field Submittals
                </span>
                <p className="text-[11px] text-slate-500">
                  Include reviewed pour tickets, batch slips, and daily workforce headcounts.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={includeMilestones}
                onChange={(e) => setIncludeMilestones(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-slate-400" />
                  Approved Milestones & Statutory Stage Gates
                </span>
                <p className="text-[11px] text-slate-500">
                  Bind contractual target dates and official certificates (LASBCA / FMWH).
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={includeInspections}
                onChange={(e) => setIncludeInspections(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  Laboratory Cube Breaks & Inspection Test Logs
                </span>
                <p className="text-[11px] text-slate-500">
                  Include certified 7, 14, and 28-day concrete strength break certificates.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/engineer/reports"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
          >
            <span>{isCreating ? 'Creating Draft...' : 'Create Draft & Open Editor'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
