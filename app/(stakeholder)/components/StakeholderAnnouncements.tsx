'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Search,
  Filter,
  Pin,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_ANNOUNCEMENTS, StakeholderAnnouncement } from '@/lib/mock-data/stakeholder';

interface StakeholderAnnouncementsProps {
  user: CivoraUser;
  projects: Project[];
  activeAnnouncementId?: string;
}

export function StakeholderAnnouncements({
  user,
  projects,
  activeAnnouncementId,
}: StakeholderAnnouncementsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  // Announcements can be enterprise-wide (no projectId) or project-specific
  const authorizedAnnouncements = useMemo(() => {
    return STAKEHOLDER_ANNOUNCEMENTS.filter((anc) => {
      if (!anc.projectId) return true; // Global stakeholder announcement
      return authorizedProjectIds.has(anc.projectId);
    });
  }, [authorizedProjectIds]);

  const activeAnnouncement = useMemo(() => {
    if (!activeAnnouncementId) return null;
    return authorizedAnnouncements.find((a) => a.id === activeAnnouncementId) || null;
  }, [authorizedAnnouncements, activeAnnouncementId]);

  const filteredAnnouncements = useMemo(() => {
    return authorizedAnnouncements.filter((anc) => {
      const matchCat = selectedCategory === 'all' || anc.category === selectedCategory;
      const matchProj =
        selectedProject === 'all' ||
        (!anc.projectId && selectedProject === 'global') ||
        anc.projectId === selectedProject;
      const matchSearch =
        anc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anc.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchProj && matchSearch;
    });
  }, [authorizedAnnouncements, selectedCategory, selectedProject, searchQuery]);

  // Detail view
  if (activeAnnouncement) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <Link
            href="/stakeholder/communications/announcements"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Announcements Feed</span>
          </Link>
        </div>

        <article className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
            {activeAnnouncement.isPinned && (
              <Badge variant="teal" size="sm" className="gap-1">
                <Pin className="w-3 h-3" />
                Pinned
              </Badge>
            )}
            <Badge variant="slate" size="sm">
              {activeAnnouncement.category}
            </Badge>
            {activeAnnouncement.projectName ? (
              <span className="font-mono text-xs font-bold text-[#001237]">
                {activeAnnouncement.projectName}
              </span>
            ) : (
              <span className="font-mono text-xs font-bold text-slate-500">
                Civora Portfolio Wide
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-mono ml-auto flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {activeAnnouncement.date}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-condensed tracking-tight">
              {activeAnnouncement.title}
            </h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              {activeAnnouncement.summary}
            </p>
          </div>

          <div className="prose prose-sm text-slate-700 leading-relaxed max-w-none space-y-4">
            <p>{activeAnnouncement.content}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>Published by <strong className="text-slate-800">{activeAnnouncement.author}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorized Stakeholder Release</span>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Announcements"
        description="Formal corporate disclosures, regulatory notices, and project bulletins released for stakeholder visibility."
      />


      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search announcements by title, keyword, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20 focus:border-[#3B68DE] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold px-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="Regulatory">Regulatory</option>
            <option value="Executive">Executive</option>
            <option value="Site Notice">Site Notice</option>
            <option value="Security">Security</option>
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20 font-medium"
          >
            <option value="all">All Scopes</option>
            <option value="global">Portfolio Wide Only</option>
            {assignedProjectsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.map((anc) => (
          <article
            key={anc.id}
            className={`p-5 rounded-2xl bg-white border transition-all hover:border-[#3B68DE]/40 hover:shadow-sm ${
              anc.isPinned ? 'border-teal-200/90 bg-teal-50/20' : 'border-slate-200/80'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {anc.isPinned && (
                  <Badge variant="teal" size="sm" className="gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </Badge>
                )}
                <Badge variant="slate" size="sm">
                  {anc.category}
                </Badge>

                {anc.projectName ? (
                  <span className="text-xs font-mono font-semibold text-[#001237] flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    {anc.projectName}
                  </span>
                ) : (
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Civora Portfolio Wide
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {anc.date}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight mb-1.5">
              <Link
                href={`/stakeholder/communications/announcements/${anc.id}`}
                className="hover:text-[#3B68DE] transition-colors"
              >
                {anc.title}
              </Link>
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
              {anc.summary}
            </p>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                Author: <strong className="text-slate-700 font-medium">{anc.author}</strong>
              </span>
              <Link
                href={`/stakeholder/communications/announcements/${anc.id}`}
                className="inline-flex items-center gap-1 text-[#3B68DE] font-semibold text-xs hover:underline"
              >
                <span>Read Full Announcement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Announcements Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are no released announcements matching your filter parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
