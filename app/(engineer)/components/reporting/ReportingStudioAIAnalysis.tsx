'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  RefreshCw,
  Building,
  Calendar,
  Layers,
  Inbox,
  Flag,
  Tag,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';

import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
  getAIAnalysisRuns,
  triggerAIAnalysisRun,
  getStudioReports,
} from '@/lib/services/reporting-studio-service';
import { AIAnalysisRun, AIAnalysisFinding } from '@/lib/types/reporting-studio';

interface ReportingStudioAIAnalysisProps {
  user: CivoraUser;
  projects: Project[];
}

export function ReportingStudioAIAnalysis({ user, projects }: ReportingStudioAIAnalysisProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.length > 0 ? projects[0].id : ''
  );
  const [reportType, setReportType] = useState('Weekly Progress Review');
  const [period, setPeriod] = useState('October 2026 (W42)');
  const [sourceInclusions, setSourceInclusions] = useState({
    submittals: true,
    milestones: true,
    inspections: true,
    labBreaks: true,
  });

  const [runs, setRuns] = useState<AIAnalysisRun[]>(() => getAIAnalysisRuns(selectedProjectId));
  const [activeRunId, setActiveRunId] = useState<string>(
    runs.length > 0 ? runs[0].id : ''
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const activeRun = useMemo(() => {
    return runs.find((r) => r.id === activeRunId) || runs[0] || null;
  }, [runs, activeRunId]);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const totalCount =
        (sourceInclusions.submittals ? 16 : 0) +
        (sourceInclusions.milestones ? 3 : 0) +
        (sourceInclusions.inspections ? 2 : 0) +
        (sourceInclusions.labBreaks ? 4 : 0);

      const newRun = triggerAIAnalysisRun({
        projectId: selectedProjectId,
        reportType,
        period,
        selectedSourcesCount: totalCount,
      });

      setRuns([newRun, ...runs]);
      setActiveRunId(newRun.id);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleFindingAction = (findingId: string, status: 'accepted' | 'dismissed') => {
    if (!activeRun) return;
    const updatedFindings = activeRun.findings.map((f) =>
      f.id === findingId ? { ...f, status } : f
    );
    const updatedRuns = runs.map((r) =>
      r.id === activeRun.id ? { ...r, findings: updatedFindings } : r
    );
    setRuns(updatedRuns);
  };

  const filteredFindings = useMemo(() => {
    if (!activeRun) return [];
    if (filterCategory === 'all') return activeRun.findings;
    return activeRun.findings.filter((f) => f.category === filterCategory);
  }, [activeRun, filterCategory]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Analysis & Evidence Synthesis Engine"
        description="Grounding engine analyzing authorized field submittals, lab crush logs, and contractual milestones to generate verifiable report findings."
      />

      {/* Analysis Configuration Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              Execute Analysis on Verified Project Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Restricted exclusively to records certified within your project membership.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <Sparkles className={`w-4 h-4 text-[#4FAAA7] ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Project Records...' : 'Run Analysis Engine'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Project Asset</label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setRuns(getAIAnalysisRuns(e.target.value));
              }}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium text-slate-800"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Target Report Standard</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium text-slate-800"
            >
              <option value="Weekly Progress Review">Weekly Construction Progress</option>
              <option value="Monthly Compliance Dossier">Monthly Compliance Dossier</option>
              <option value="Site Inspection Record">Site Inspection & QA Audit</option>
              <option value="HSE Audit Dossier">Health, Safety & Environment</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Reporting Cadence Window</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Source Inclusions Checkboxes */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Selected Source Boundaries
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sourceInclusions.submittals}
                onChange={(e) =>
                  setSourceInclusions({ ...sourceInclusions, submittals: e.target.checked })
                }
                className="w-3.5 h-3.5 text-[#3B68DE] rounded"
              />
              <span>WhatsApp / Telegram Bot Submissions</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sourceInclusions.milestones}
                onChange={(e) =>
                  setSourceInclusions({ ...sourceInclusions, milestones: e.target.checked })
                }
                className="w-3.5 h-3.5 text-[#3B68DE] rounded"
              />
              <span>Approved Project Milestones</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sourceInclusions.inspections}
                onChange={(e) =>
                  setSourceInclusions({ ...sourceInclusions, inspections: e.target.checked })
                }
                className="w-3.5 h-3.5 text-[#3B68DE] rounded"
              />
              <span>Joint Site Inspection Notes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sourceInclusions.labBreaks}
                onChange={(e) =>
                  setSourceInclusions({ ...sourceInclusions, labBreaks: e.target.checked })
                }
                className="w-3.5 h-3.5 text-[#3B68DE] rounded"
              />
              <span>Concrete Cube Crush Results</span>
            </label>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {activeRun && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#001237]">
                  Analysis Run #{activeRun.id}
                </span>
                <Badge variant="teal" size="sm">
                  {activeRun.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-slate-400">
                  {activeRun.completedAt}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Scope: <strong>{activeRun.sourcesCoverage}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Finding Type:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Findings ({activeRun.findings.length})</option>
                <option value="executive_summary">Executive Summary</option>
                <option value="progress_milestone">Milestone Progress</option>
                <option value="evidence_gap">Evidence Gaps</option>
                <option value="risk_issue">Risks & Issues</option>
                <option value="next_action">Recommended Actions</option>
              </select>
            </div>
          </div>

          {/* Finding Cards */}
          <div className="grid grid-cols-1 gap-4">
            {filteredFindings.map((finding) => (
              <div
                key={finding.id}
                className={`p-5 rounded-2xl bg-white border transition-all ${
                  finding.status === 'accepted'
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : finding.status === 'dismissed'
                    ? 'opacity-60 border-slate-200'
                    : 'border-slate-200/80 hover:border-[#3B68DE]/40 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={finding.category === 'evidence_gap' ? 'amber' : 'blue'} size="sm">
                      {finding.category.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Grounded in Civora Records
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    AI-Assisted Suggestion — Not Certified
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-condensed tracking-tight mb-1.5">
                  {finding.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed font-sans mb-3 whitespace-pre-line">
                  {finding.content}
                </p>

                {/* Source Provenance References */}
                {finding.sourceReferences.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 mb-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Grounded Evidence Sources:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {finding.sourceReferences.map((ref, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600"
                        >
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span>{ref.label} ({ref.date})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Status: <strong className="text-slate-700 capitalize">{finding.status}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {finding.status !== 'dismissed' && (
                      <button
                        onClick={() => handleFindingAction(finding.id, 'dismissed')}
                        className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Dismiss
                      </button>
                    )}
                    {finding.status !== 'accepted' && (
                      <button
                        onClick={() => handleFindingAction(finding.id, 'accepted')}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#001237] hover:bg-[#18243D] text-white font-semibold shadow-2xs transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Accept into Draft</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredFindings.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-400">
                No findings match the selected category filter.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
