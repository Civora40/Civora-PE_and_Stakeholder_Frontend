'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Files,
  Search,
  Filter,
  Download,
  Eye,
  FileCheck2,
  Lock,
  Shield,
  Layers,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_DOCUMENTS, StakeholderSharedDocument } from '@/lib/mock-data/stakeholder';

interface StakeholderSharedDocumentsProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderSharedDocuments({ user, projects }: StakeholderSharedDocumentsProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
        d.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchCat && matchSearch;
    });
  }, [authorizedDocuments, selectedProject, selectedCategory, searchQuery]);

  const handleDownload = (doc: StakeholderSharedDocument) => {
    setDownloadNotice(`Authorizing secure download for ${doc.code} (SHA-256 Verified)...`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shared Project Documents"
        description="Encrypted repository of approved geotechnical investigations, environmental certificates, structural drawings, and quality manuals shared for stakeholder review."
        badge={<Badge variant="teal" size="sm">{filteredDocuments.length} Verified Files</Badge>}
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
            placeholder="Search document title or code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <Files className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Documents Match Search</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or category filter. Only documents approved by the superintending engineer appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#4FAAA7]/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#001237]">
                    {doc.code}
                  </span>
                  <Badge variant="teal" size="sm">
                    {doc.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {doc.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>{doc.fileType}</span>
                  <span>&bull;</span>
                  <span>{doc.fileSize}</span>
                  <span>&bull;</span>
                  <span>{doc.version}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                  {doc.projectName}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#001237] text-slate-700 hover:text-white font-semibold text-[11px] transition-colors"
                  >
                    <Download className="w-3 h-3 text-[#4FAAA7]" />
                    <span>Download</span>
                  </button>
                  <Link
                    href={`/stakeholder/documents/${doc.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#3B68DE] text-slate-700 hover:text-white font-semibold text-[11px] transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
