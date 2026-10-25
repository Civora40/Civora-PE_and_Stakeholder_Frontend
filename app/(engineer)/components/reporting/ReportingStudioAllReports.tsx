'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Eye,
  FileEdit,
  Copy,
  History,
  Download,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
  getStudioReports,
  createStudioReportDraft,
} from '@/lib/services/reporting-studio-service';
import { StudioReport, ReportingWorkflowStatus } from '@/lib/types/reporting-studio';

interface ReportingStudioAllReportsProps {
  user: CivoraUser;
  projects: Project[];
}

export function ReportingStudioAllReports({ user, projects }: ReportingStudioAllReportsProps) {
  const router = useRouter();
  const [reports, setReports] = useState<StudioReport[]>(() =>
    getStudioReports(user.assignedProjects)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<'lastSavedAt' | 'title' | 'period'>('lastSavedAt');

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => {
        const matchesProject = projectFilter === 'all' || r.projectId === projectFilter;
        const matchesStatus = statusFilter === 'all' || r.workflowStatus === statusFilter;
        const matchesType = typeFilter === 'all' || r.reportType === typeFilter;
        const matchesSearch =
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.createdByName.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesProject && matchesStatus && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortField === 'title') return a.title.localeCompare(b.title);
        if (sortField === 'period') return a.periodFormatted.localeCompare(b.periodFormatted);
        return b.id.localeCompare(a.id); // Latest first
      });
  }, [reports, projectFilter, statusFilter, typeFilter, searchQuery, sortField]);

  const handleDuplicate = (report: StudioReport) => {
    const copy = createStudioReportDraft({
      projectId: report.projectId,
      templateId: report.templateId,
      title: `${report.title} (Copy)`,
      reportingPeriodStart: report.reportingPeriodStart,
      reportingPeriodEnd: report.reportingPeriodEnd,
      authorId: user.id,
      authorName: user.name,
      authorTitle: user.title,
      reference: `${report.reportNumber}-COPY`,
      objective: report.executiveSummary,
    });
    router.push(`/engineer/reports/${copy.id}/edit`);
  };

  const getStatusBadge = (status: ReportingWorkflowStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="blue" size="sm">Draft</Badge>;
      case 'ready_for_review':
        return <Badge variant="teal" size="sm">Ready for Review</Badge>;
      case 'in_review':
        return <Badge variant="slate" size="sm">In Review</Badge>;
      case 'changes_requested':
        return <Badge variant="rose" size="sm">Changes Requested</Badge>;
      case 'approved':
        return <Badge variant="emerald" size="sm">Approved</Badge>;
      case 'released':
        return <Badge variant="emerald" size="sm" dot>Released</Badge>;
      default:
        return <Badge variant="slate" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="All Engineering Reports"
          description="Complete register of drafting, submitted, approved, and released compliance dossiers across your assigned assets."
        />
        <Link
          href="/engineer/reports/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Report</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, report code (e.g. REP-2026), project, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="ready_for_review">Ready for Review</option>
            <option value="in_review">In Review</option>
            <option value="changes_requested">Changes Requested</option>
            <option value="approved">Approved</option>
            <option value="released">Released</option>
          </select>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none font-medium"
          >
            <option value="lastSavedAt">Sort: Latest Activity</option>
            <option value="title">Sort: Title (A-Z)</option>
            <option value="period">Sort: Period</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Report Reference & Title</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Type & Period</th>
                <th className="py-3 px-4">Status & Ver.</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {report.reportNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 line-clamp-1 max-w-sm">
                        <Link
                          href={`/engineer/reports/${report.id}`}
                          className="hover:text-[#3B68DE] transition-colors"
                        >
                          {report.title}
                        </Link>
                      </h4>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 max-w-[200px]">
                      <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate font-medium">{report.projectName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 block truncate max-w-[180px]">
                        {report.reportType}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {report.periodFormatted}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div>{getStatusBadge(report.workflowStatus)}</div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {report.currentVersion}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-medium text-slate-800 block truncate max-w-[140px]">
                      {report.createdByName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Saved {report.lastSavedAt}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {report.workflowStatus === 'draft' || report.workflowStatus === 'changes_requested' ? (
                        <Link
                          href={`/engineer/reports/${report.id}/edit`}
                          className="px-2.5 py-1 rounded-md bg-[#001237] hover:bg-[#18243D] text-white font-semibold text-[11px] transition-colors"
                        >
                          Edit
                        </Link>
                      ) : (
                        <Link
                          href={`/engineer/reports/${report.id}`}
                          className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          Open
                        </Link>
                      )}

                      <Link
                        href={`/engineer/reports/${report.id}/preview`}
                        title="Preview & Print"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDuplicate(report)}
                        title="Duplicate as Draft"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-700">No Reports Found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      No reports match the selected filters or search query.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
