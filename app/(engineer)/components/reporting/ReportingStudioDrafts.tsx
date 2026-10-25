'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileEdit,
  Search,
  Filter,
  PlusCircle,
  Copy,
  Trash2,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
  getStudioDrafts,
  createStudioReportDraft,
} from '@/lib/services/reporting-studio-service';
import { StudioReport } from '@/lib/types/reporting-studio';

interface ReportingStudioDraftsProps {
  user: CivoraUser;
  projects: Project[];
}

export function ReportingStudioDrafts({ user, projects }: ReportingStudioDraftsProps) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<StudioReport[]>(() =>
    getStudioDrafts(user.assignedProjects)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');

  const filteredDrafts = useMemo(() => {
    return drafts.filter((d) => {
      const matchProj = projectFilter === 'all' || d.projectId === projectFilter;
      const matchSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchSearch;
    });
  }, [drafts, projectFilter, searchQuery]);

  const handleDuplicate = (draft: StudioReport) => {
    const copy = createStudioReportDraft({
      projectId: draft.projectId,
      templateId: draft.templateId,
      title: `${draft.title} (Copy)`,
      reportingPeriodStart: draft.reportingPeriodStart,
      reportingPeriodEnd: draft.reportingPeriodEnd,
      authorId: user.id,
      authorName: user.name,
      authorTitle: user.title,
      reference: `${draft.reportNumber}-COPY`,
      objective: draft.executiveSummary,
    });
    router.push(`/engineer/reports/${copy.id}/edit`);
  };

  const handleDelete = (draftId: string) => {
    if (confirm('Are you sure you want to discard this draft? This action cannot be undone.')) {
      setDrafts(drafts.filter((d) => d.id !== draftId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Drafts & In-Progress Reports"
          description="Resume saved drafts, review outstanding author notes, and prepare compliance documents for technical submission."
        />
        <Link
          href="/engineer/reports/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Draft</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search active drafts by title or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
          />
        </div>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none font-medium"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Drafts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrafts.map((draft) => {
          const completedSectionsCount = draft.sections.filter((s) => s.isCompleted).length;
          const totalSectionsCount = draft.sections.length;
          const percent = totalSectionsCount > 0 ? Math.round((completedSectionsCount / totalSectionsCount) * 100) : 0;

          return (
            <div
              key={draft.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-[#3B68DE]/40 transition-all space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    {draft.reportNumber}
                  </span>
                  <Badge variant={draft.workflowStatus === 'changes_requested' ? 'rose' : 'blue'} size="sm">
                    {draft.workflowStatus.replace('_', ' ')}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                  <Link
                    href={`/engineer/reports/${draft.id}/edit`}
                    className="hover:text-[#3B68DE] transition-colors"
                  >
                    {draft.title}
                  </Link>
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {draft.executiveSummary || 'No executive summary drafted yet.'}
                </p>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Draft Readiness</span>
                    <span className="font-mono font-bold text-[#001237]">{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4FAAA7] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[150px]">{draft.projectName}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{draft.periodFormatted}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] font-mono">
                  Saved {draft.lastSavedAt}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicate(draft)}
                    title="Duplicate draft"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(draft.id)}
                    title="Discard draft"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href={`/engineer/reports/${draft.id}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#001237] hover:bg-[#18243D] text-white font-semibold text-xs transition-colors"
                  >
                    <span>Resume</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filteredDrafts.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white border border-slate-200/80">
            <FileEdit className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Drafts In Progress</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              All started reports have been submitted or released. Click "New Draft" to begin authoring.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
