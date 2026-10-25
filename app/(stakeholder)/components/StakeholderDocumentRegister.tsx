'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ListChecks,
  Search,
  Filter,
  Download,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  ArrowUpDown,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_DOCUMENTS, StakeholderSharedDocument } from '@/lib/mock-data/stakeholder';

interface StakeholderDocumentRegisterProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderDocumentRegister({ user, projects }: StakeholderDocumentRegisterProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Authorize projects
  const authorizedProjectIds = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return new Set<string>();
    if (user.assignedProjects.includes('*')) return new Set(projects.map((p) => p.id));
    return new Set(user.assignedProjects);
  }, [user.assignedProjects, projects]);

  const assignedProjectsList = useMemo(() => {
    return projects.filter((p) => authorizedProjectIds.has(p.id));
  }, [projects, authorizedProjectIds]);

  const authorizedDocuments = useMemo(() => {
    return STAKEHOLDER_DOCUMENTS.filter((d) => authorizedProjectIds.has(d.projectId));
  }, [authorizedProjectIds]);

  const categories = useMemo(() => {
    return Array.from(new Set(authorizedDocuments.map((d) => d.category)));
  }, [authorizedDocuments]);

  const filteredDocuments = useMemo(() => {
    return authorizedDocuments.filter((d) => {
      const matchProj = selectedProject === 'all' || d.projectId === selectedProject;
      const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
      const matchSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchCat && matchSearch;
    });
  }, [authorizedDocuments, selectedProject, selectedCategory, searchQuery]);

  const handleExportCSV = () => {
    setExportNotice('Exporting verified document register ledger (CSV format)...');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Document Register & Controlled Records"
          description="Formal auditable transmittal register of all approved engineering drawings, statutory permits, and QA certifications."
          badge={<Badge variant="teal" size="sm">{filteredDocuments.length} Registered Entries</Badge>}
        />
        <button
          type="button"
          onClick={handleExportCSV}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#001237] text-white hover:bg-[#18243D] text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#4FAAA7]" />
          <span>Export Register (CSV)</span>
        </button>
      </div>

      {/* Export Toast Notification */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Download className="w-4 h-4 text-[#4FAAA7] animate-bounce" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Project:</span>
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 focus:outline-none focus:border-[#4FAAA7]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or owner..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>
      </div>

      {/* Register Table */}
      {filteredDocuments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <ListChecks className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Register Entries Match</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Adjust your project selector or category filter to inspect the full transmittal record.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                <th className="py-3 px-4">Document Ref Code</th>
                <th className="py-3 px-4">Title & Discipline</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Revision</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Release Date</th>
                <th className="py-3 px-4">Authorizing Sign-off</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#001237]">
                    {doc.code}
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="text-slate-900 block font-semibold text-xs">{doc.title}</strong>
                    <span className="text-[11px] text-slate-400 font-mono">{doc.category} &bull; {doc.fileSize}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{doc.projectName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{doc.version}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={doc.status === 'approved' ? 'emerald' : 'teal'} size="sm">
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{doc.releaseDate}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">{doc.uploadedBy}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/stakeholder/documents/${doc.id}`}
                      className="text-[#3B68DE] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Record</span>
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
