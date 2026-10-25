'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Archive,
  Search,
  Filter,
  FileText,
  Download,
  ArrowRight,
  Clock,
  History,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_RELEASED_REPORTS, StakeholderReleasedReport } from '@/lib/mock-data/stakeholder';

interface StakeholderReportArchiveProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderReportArchive({ user, projects }: StakeholderReportArchiveProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Authorize projects
  const authorizedProjectIds = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return new Set<string>();
    if (user.assignedProjects.includes('*')) return new Set(projects.map((p) => p.id));
    return new Set(user.assignedProjects);
  }, [user.assignedProjects, projects]);

  const assignedProjectsList = useMemo(() => {
    return projects.filter((p) => authorizedProjectIds.has(p.id));
  }, [projects, authorizedProjectIds]);

  // All reports including archived/superseded ones
  const authorizedReports = useMemo(() => {
    return STAKEHOLDER_RELEASED_REPORTS.filter((r) => authorizedProjectIds.has(r.projectId));
  }, [authorizedProjectIds]);

  const filteredReports = useMemo(() => {
    return authorizedReports.filter((r) => {
      const matchProj = selectedProject === 'all' || r.projectId === selectedProject;
      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.period.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchSearch;
    });
  }, [authorizedReports, selectedProject, searchQuery]);

  const handleDownload = (report: StakeholderReleasedReport) => {
    setDownloadNotice(`Downloading immutable archive ${report.reportNumber} (${report.fileSize})...`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Archive & Version History"
        description="Searchable immutable repository of previously released reporting dossiers, superseded engineering packages, and quarterly compliance records."
        badge={<Badge variant="teal" size="sm">{filteredReports.length} Historical Packages</Badge>}
      />

      {/* Download Toast Notification */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Download className="w-4 h-4 text-[#4FAAA7] animate-bounce" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Filter by Project:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 focus:outline-none focus:border-[#4FAAA7]"
          >
            <option value="all">All Assigned Projects ({assignedProjectsList.length})</option>
            {assignedProjectsList.map((p) => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archive by title or code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <Archive className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Archived Reports Match</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Adjust your project selector or search query to find previous reporting periods.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                <th className="py-3 px-4">Report Code & Title</th>
                <th className="py-3 px-4">Project Context</th>
                <th className="py-3 px-4">Reporting Period</th>
                <th className="py-3 px-4">Version & Status</th>
                <th className="py-3 px-4">Release Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#001237] block">
                      {report.reportNumber}
                    </span>
                    <strong className="text-slate-900 block font-semibold text-xs mt-0.5">
                      {report.title}
                    </strong>
                    <span className="text-[11px] text-slate-400 font-mono">{report.fileSize}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {report.projectName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{report.period}</td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] font-bold text-slate-700 block">
                        {report.version}
                      </span>
                      <Badge
                        variant={report.status === 'released' ? 'emerald' : 'slate'}
                        size="sm"
                      >
                        {report.status === 'released' ? 'Current Release' : 'Superseded'}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{report.releaseDate}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(report)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#001237] text-slate-700 hover:text-white font-semibold text-[11px] transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3 h-3 text-[#4FAAA7]" />
                      <span>PDF</span>
                    </button>
                    <Link
                      href={`/stakeholder/reports/${report.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#3B68DE] text-slate-700 hover:text-white font-semibold text-[11px] transition-colors"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
