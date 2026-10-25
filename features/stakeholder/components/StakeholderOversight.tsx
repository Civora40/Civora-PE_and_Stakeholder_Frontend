'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Award,
  Bell,
  User,
  Calendar,
  Layers,
  MapPin,
  ChevronRight,
  Check,
  AlertCircle,
  FileCheck2,
  X,
  Eye,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
import {
  STAKEHOLDER_MILESTONES,
  STAKEHOLDER_UPDATES,
  STAKEHOLDER_RELEASED_REPORTS,
  StakeholderProjectMilestone,
  StakeholderReleasedReport,
} from '@/lib/mock-data/stakeholder';

interface StakeholderOversightProps {
  user: CivoraUser;
  initialTab?: string;
}

export function StakeholderOversight({ user, initialTab }: StakeholderOversightProps) {
  // 1. Resolve authorized assigned projects (Section 3.2: Project-level membership)
  const assignedProjects = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) {
      return [];
    }
    if (user.assignedProjects.includes('*')) {
      return DEMO_PROJECTS;
    }
    return DEMO_PROJECTS.filter((p) => user.assignedProjects.includes(p.id));
  }, [user.assignedProjects]);

  const assignedProjectIds = useMemo(
    () => new Set(assignedProjects.map((p) => p.id)),
    [assignedProjects]
  );

  // Filter milestones, updates, and reports strictly to assigned projects
  const authorizedMilestones = useMemo(() => {
    return STAKEHOLDER_MILESTONES.filter((m) => assignedProjectIds.has(m.projectId));
  }, [assignedProjectIds]);

  const authorizedUpdates = useMemo(() => {
    return STAKEHOLDER_UPDATES.filter((u) => assignedProjectIds.has(u.projectId));
  }, [assignedProjectIds]);

  const authorizedReports = useMemo(() => {
    return STAKEHOLDER_RELEASED_REPORTS.filter((r) => assignedProjectIds.has(r.projectId));
  }, [assignedProjectIds]);

  // Section 7.1: Summary Cards Metrics
  const activeProjectsCount = useMemo(() => {
    return assignedProjects.filter((p) => p.status === 'active').length;
  }, [assignedProjects]);

  const releasedReportsCount = authorizedReports.length;

  const completedMilestones = useMemo(() => {
    return authorizedMilestones.filter((m) => m.status === 'completed');
  }, [authorizedMilestones]);

  const milestoneCompletedPercent = useMemo(() => {
    if (authorizedMilestones.length === 0) return 0;
    return Math.round((completedMilestones.length / authorizedMilestones.length) * 100);
  }, [completedMilestones, authorizedMilestones]);

  const latestUpdateTimestamp = useMemo(() => {
    if (authorizedUpdates.length === 0) return 'No updates yet';
    return authorizedUpdates[0].timestamp;
  }, [authorizedUpdates]);

  // Project filtering state
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return assignedProjects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.location.toLowerCase().includes(projectSearch.toLowerCase());
      const matchesStatus =
        projectStatusFilter === 'all' || p.status === projectStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assignedProjects, projectSearch, projectStatusFilter]);

  // Report Modal / Toast state
  const [selectedReport, setSelectedReport] = useState<StakeholderReleasedReport | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownload = (report: StakeholderReleasedReport) => {
    setDownloadNotice(`Downloading ${report.reportNumber} (${report.fileSize})...`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 3500);
  };

  const firstName = user.firstName || (user.name ? user.name.split(' ')[0] : null);

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {/* Download / Notice Toast */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Download className="w-4 h-4 text-[#4FAAA7] animate-bounce" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Page Title & Greeting (Section 7) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider bg-[#001237] text-[#4FAAA7]">
              Stakeholder Workspace
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Authorized Read-Only Project Access
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
            Stakeholder overview
          </h1>

          {/* Subheading & Greeting */}
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {firstName ? `Welcome back, ${firstName}. ` : ''}
            A clear view of your assigned projects, recent updates, and released reports.
          </p>
        </div>

        {/* Quick Read-Only Header Actions (Section 7.6) */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <span>My Projects</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Released Reports</span>
          </Link>
          <Link
            href="/dashboard/notifications"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-[#3B68DE]" />
            <span>Notifications</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>My Profile</span>
          </Link>
        </div>
      </div>

      {/* 7.1 Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-500">
              Active Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#001237]">
              <Briefcase className="w-4 h-4 text-[#4FAAA7]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#001237] font-mono">
              {assignedProjects.length > 0 ? activeProjectsCount : '—'}
            </span>
            <span className="text-xs text-slate-500">
              of {assignedProjects.length} assigned
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Projects with active status and membership.
          </p>
        </div>

        {/* Card 2: Released Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-500">
              Released Reports
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#001237] font-mono">
              {releasedReportsCount > 0 ? releasedReportsCount : '—'}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">
              Verified Released
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Approved and published reports available to view.
          </p>
        </div>

        {/* Card 3: Milestones Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-500">
              Milestones Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#3B68DE]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#001237] font-mono">
              {authorizedMilestones.length > 0
                ? `${completedMilestones.length} of ${authorizedMilestones.length}`
                : '—'}
            </span>
            <span className="text-xs text-[#3B68DE] font-semibold">
              ({milestoneCompletedPercent}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Visible project milestones verified under project rules.
          </p>
        </div>

        {/* Card 4: Latest Update */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-500">
              Latest Update
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#001237] font-mono truncate">
              {latestUpdateTimestamp}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {authorizedUpdates[0]?.title || 'No updates yet recorded'}
          </p>
        </div>
      </div>

      {/* Main Grid: My Projects (7.2) & Upcoming Milestones (7.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7.2 My Projects (2 Columns on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                My projects
              </h2>
              <p className="text-xs text-slate-500">
                Open a project to review its current status and available reports.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4FAAA7]"
                />
              </div>

              <select
                value={projectStatusFilter}
                onChange={(e) => setProjectStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4FAAA7] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="planning">Planning</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Project List / Empty State */}
          {filteredProjects.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No projects assigned yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When a project administrator grants your account access, the project will appear here. If you believe you should already have access, contact the person who invited you.
              </p>
              <Link
                href="/access-pending"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>View access status</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredProjects.map((proj) => {
                // Find next visible milestone for this project
                const nextMilestone = authorizedMilestones.find(
                  (m) => m.projectId === proj.id && m.status !== 'completed'
                );

                return (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#001237] leading-snug">
                            {proj.name}
                          </h4>
                          <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {proj.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{proj.location}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            proj.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : proj.status === 'planning'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : proj.status === 'in_review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {proj.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Approved Progress Percentage */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Approved Overall Progress</span>
                        <span className="font-bold text-[#001237] font-mono">
                          {proj.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#001237] via-[#3B68DE] to-[#4FAAA7] rounded-full transition-all duration-300"
                          style={{ width: `${proj.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Metadata & Actions row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-3 text-[11px]">
                        {nextMilestone && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Next: <strong>{nextMilestone.name}</strong> ({nextMilestone.targetDate})</span>
                          </span>
                        )}
                        <span>Updated: {proj.lastActivity}</span>
                      </div>

                      <Link
                        href={`/dashboard/projects/${proj.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#3B68DE] hover:text-[#001237] transition-colors self-end sm:self-auto cursor-pointer"
                      >
                        <span>View project</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#4FAAA7]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 7.5 Upcoming Milestones (1 Column on large screens) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Upcoming milestones
            </h2>
            <p className="text-xs text-slate-500">
              Key dates currently recorded for your assigned projects.
            </p>
          </div>

          {authorizedMilestones.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No milestones recorded for your assigned projects.
            </div>
          ) : (
            <div className="space-y-3">
              {authorizedMilestones.map((m) => {
                const isCompleted = m.status === 'completed';
                const isOverdue = m.status === 'past_target_date';

                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#001237] leading-tight">
                          {m.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {m.projectName}
                        </p>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200'
                            : isOverdue
                            ? 'bg-amber-100/70 text-amber-800 border border-amber-200'
                            : 'bg-blue-100/70 text-[#001237] border border-blue-200'
                        }`}
                      >
                        {isCompleted
                          ? 'Completed'
                          : isOverdue
                          ? 'Past target date'
                          : 'On schedule'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50">
                      <span className="text-slate-500 font-mono">
                        {isCompleted
                          ? `Completed: ${m.completionDate || m.targetDate}`
                          : `Target Date: ${m.targetDate}`}
                      </span>

                      <Link
                        href="/dashboard/projects"
                        className="text-[11px] font-semibold text-[#3B68DE] hover:underline"
                      >
                        Project Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid 2: Recently Released Reports (7.4) & Recent Project Updates (7.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7.4 Recently released reports (2 Columns on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Recently released reports
              </h2>
              <p className="text-xs text-slate-500">
                Reports that have completed the required approval process and are available to you.
              </p>
            </div>

            <Link
              href="/dashboard/reports"
              className="text-xs font-semibold text-[#3B68DE] hover:text-[#001237] inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>All Released Reports</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {authorizedReports.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No reports released yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When an authorized project team releases a report for your project, it will appear here.
              </p>
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>View my projects</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {authorizedReports.map((report) => (
                <div
                  key={report.id}
                  className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2.5 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#001237]">
                        {report.reportNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Released
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {report.version}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {report.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span>Project: <strong>{report.projectName}</strong></span>
                      <span>Period: {report.period}</span>
                      <span>Released: {report.releaseDate}</span>
                    </div>
                  </div>

                  {/* Actions: Open report and Download PDF */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Open report</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(report)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#4FAAA7]" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7.3 Recent project updates (1 Column on large screens) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Recent project updates
            </h2>
            <p className="text-xs text-slate-500">
              The latest information released to your stakeholder workspace.
            </p>
          </div>

          {authorizedUpdates.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              There are no new project updates to show. New updates will appear here when they are released to you.
            </p>
          ) : (
            <div className="space-y-3.5">
              {authorizedUpdates.map((upd) => (
                <div key={upd.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    {upd.type === 'report_released' ? (
                      <FileText className="w-3.5 h-3.5 text-[#4FAAA7]" />
                    ) : upd.type === 'milestone_updated' ? (
                      <Award className="w-3.5 h-3.5 text-[#3B68DE]" />
                    ) : (
                      <Shield className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-[#001237] leading-tight">
                        {upd.title}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {upd.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {upd.summary}
                    </p>

                    <div className="pt-0.5 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium truncate">
                        {upd.projectName}
                      </span>
                      <Link
                        href={upd.linkUrl}
                        className="font-semibold text-[#3B68DE] hover:underline shrink-0"
                      >
                        {upd.linkLabel} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 7.6 Quick Actions Panel (Read-Only) */}
      <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-[#001237]">
              Stakeholder Quick Actions
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Read-only navigation shortcuts for your assigned construction workspaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/projects"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              View My Projects
            </Link>
            <Link
              href="/dashboard/reports"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              Browse Released Reports
            </Link>
            <Link
              href="/dashboard/notifications"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              Review Notifications
            </Link>
            <Link
              href="/dashboard/profile"
              className="px-3 py-1.5 rounded-xl bg-[#001237] text-white hover:bg-[#18243D] text-xs font-bold transition-all shadow-2xs"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                    {selectedReport.reportNumber}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedReport.version} &bull; Released Snapshot
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedReport.title}
                </h4>
                <p className="text-slate-500 mt-0.5">
                  Project: <strong>{selectedReport.projectName}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Reporting Period:</span>
                  <span className="font-bold text-[#001237]">{selectedReport.period}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Release Date:</span>
                  <span className="font-bold text-[#001237]">{selectedReport.releaseDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 block text-xs">
                  Approved Executive Summary:
                </span>
                <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {selectedReport.executiveSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Link
                href={`/dashboard/reports/${selectedReport.id}`}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Details</span>
              </Link>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(selectedReport);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Download PDF ({selectedReport.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
