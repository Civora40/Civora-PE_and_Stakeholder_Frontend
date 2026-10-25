'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Filter,
  ArrowRight,
  Clock,
  User,
  ShieldCheck,
  Building,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_UPDATES, StakeholderUpdateItem } from '@/lib/mock-data/stakeholder';

interface StakeholderUpdatesFeedProps {
  user: CivoraUser;
  projects: Project[];
  activeUpdateId?: string;
}

export function StakeholderUpdatesFeed({
  user,
  projects,
  activeUpdateId,
}: StakeholderUpdatesFeedProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Authorize projects
  const authorizedProjectIds = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return new Set<string>();
    if (user.assignedProjects.includes('*')) return new Set(projects.map((p) => p.id));
    return new Set(user.assignedProjects);
  }, [user.assignedProjects, projects]);

  const assignedProjectsList = useMemo(() => {
    return projects.filter((p) => authorizedProjectIds.has(p.id));
  }, [projects, authorizedProjectIds]);

  const authorizedUpdates = useMemo(() => {
    return STAKEHOLDER_UPDATES.filter((u) => authorizedProjectIds.has(u.projectId));
  }, [authorizedProjectIds]);

  const activeUpdate = useMemo(() => {
    if (!activeUpdateId) return null;
    return authorizedUpdates.find((u) => u.id === activeUpdateId) || null;
  }, [authorizedUpdates, activeUpdateId]);

  const filteredUpdates = useMemo(() => {
    return authorizedUpdates.filter((u) => {
      const matchProj = selectedProject === 'all' || u.projectId === selectedProject;
      const matchSearch =
        u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.author && u.author.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchProj && matchSearch;
    });
  }, [authorizedUpdates, selectedProject, searchQuery]);

  // If viewing a single update detail
  if (activeUpdate) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <Link
            href="/stakeholder/progress/updates"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Updates</span>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
            <span className="font-mono text-xs font-bold text-[#001237]">
              {activeUpdate.projectName}
            </span>
            <Badge variant="teal" size="sm">
              {activeUpdate.category || 'General Update'}
            </Badge>
            <span className="text-[11px] text-slate-400 font-mono ml-auto">
              Published {activeUpdate.timestamp}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
            {activeUpdate.title}
          </h1>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
            <p className="font-semibold text-slate-900">Summary:</p>
            <p>{activeUpdate.summary}</p>
          </div>

          {activeUpdate.content && (
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed pt-2">
              <p className="font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Narrative Progress Statement
              </p>
              <p>{activeUpdate.content}</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <User className="w-4 h-4 text-[#4FAAA7]" />
              <span>Released by: <strong className="text-slate-800">{activeUpdate.author || 'Project Lead'}</strong></span>
            </div>

            <Link
              href={activeUpdate.linkUrl}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#001237] text-white hover:bg-[#18243D] font-semibold text-xs transition-colors"
            >
              <span>{activeUpdate.linkLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Feed View
  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Updates & Field Narrative Feed"
        description="Chronological stream of authorized narrative updates, structural sign-offs, and critical field milestones released to stakeholders."
        badge={<Badge variant="teal" size="sm">{filteredUpdates.length} Published Updates</Badge>}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search updates..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>
      </div>

      {/* Feed list */}
      {filteredUpdates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Updates Match Filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or project filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <div
              key={update.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#4FAAA7]/50 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#001237]">
                    {update.projectName}
                  </span>
                  <Badge variant="teal" size="sm">
                    {update.category || 'Site Update'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{update.timestamp}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  {update.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {update.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  By {update.author || 'Superintending Engineer'}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/stakeholder/progress/updates/${update.id}`}
                    className="text-[#3B68DE] font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Read Full Note</span>
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
