'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarRange,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Layers,
  Calendar as CalendarIcon,
  ListFilter,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_MILESTONES, StakeholderProjectMilestone } from '@/lib/mock-data/stakeholder';

interface StakeholderProjectTimelineProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderProjectTimeline({ user, projects }: StakeholderProjectTimelineProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  // Authorize projects
  const authorizedProjectIds = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return new Set<string>();
    if (user.assignedProjects.includes('*')) return new Set(projects.map((p) => p.id));
    return new Set(user.assignedProjects);
  }, [user.assignedProjects, projects]);

  const authorizedMilestones = useMemo(() => {
    return STAKEHOLDER_MILESTONES.filter((m) => authorizedProjectIds.has(m.projectId));
  }, [authorizedProjectIds]);

  const filteredMilestones = useMemo(() => {
    return authorizedMilestones.filter((m) => {
      const matchProj = selectedProject === 'all' || m.projectId === selectedProject;
      const matchStatus = selectedStatus === 'all' || m.status === selectedStatus;
      return matchProj && matchStatus;
    });
  }, [authorizedMilestones, selectedProject, selectedStatus]);

  const assignedProjectsList = useMemo(() => {
    return projects.filter((p) => authorizedProjectIds.has(p.id));
  }, [projects, authorizedProjectIds]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Timeline & Schedules"
        description="Chronological schedule of critical structural phase gates, independent testing validations, and approved milestone dates."
        badge={<Badge variant="teal" size="sm">{filteredMilestones.length} Milestones Tracked</Badge>}
      />

      {/* Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Selector */}
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

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 focus:outline-none focus:border-[#4FAAA7]"
            >
              <option value="all">All Milestone States</option>
              <option value="completed">Completed</option>
              <option value="on_schedule">On Schedule</option>
              <option value="past_target_date">Past Target Date</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'timeline'
                ? 'bg-white text-[#001237] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5 text-[#4FAAA7]" />
            <span>Timeline</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-[#001237] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-[#3B68DE]" />
            <span>List Table</span>
          </button>
        </div>
      </div>

      {filteredMilestones.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Milestones in Selected Filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No milestones match the selected project or status. Reset your filter to view full project timeline gates.
          </p>
        </div>
      ) : viewMode === 'timeline' ? (
        /* Timeline View */
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredMilestones.map((milestone) => {
            const isCompleted = milestone.status === 'completed';
            const isOverdue = milestone.status === 'past_target_date';
            const isOnSchedule = milestone.status === 'on_schedule';

            return (
              <div key={milestone.id} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                      : isOverdue
                      ? 'bg-rose-50 border-rose-500 text-rose-600'
                      : 'bg-white border-[#4FAAA7] text-[#4FAAA7]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isOverdue ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 group-hover:border-[#4FAAA7]/50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#4FAAA7]">
                        {milestone.projectName}
                      </span>
                      {milestone.phase && (
                        <span className="text-[11px] text-slate-400 block font-medium">
                          {milestone.phase}
                        </span>
                      )}
                    </div>
                    <Badge
                      variant={isCompleted ? 'emerald' : isOverdue ? 'rose' : isOnSchedule ? 'teal' : 'slate'}
                      size="sm"
                    >
                      {milestone.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                      {milestone.name}
                    </h3>
                    {milestone.evidenceSummary && (
                      <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#4FAAA7] shrink-0 mt-0.5" />
                        <span>{milestone.evidenceSummary}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-3 font-mono">
                      <span>Target: <strong className="text-slate-700">{milestone.targetDate}</strong></span>
                      {milestone.completionDate && (
                        <span>Verified: <strong className="text-emerald-600">{milestone.completionDate}</strong></span>
                      )}
                    </div>
                    <Link
                      href={`/stakeholder/projects/${milestone.projectId}?tab=milestones`}
                      className="text-[#3B68DE] hover:text-[#001237] font-semibold inline-flex items-center gap-1"
                    >
                      <span>Project Gate</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Accessible List View */
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                <th className="py-3 px-4">Milestone Gate</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verification Evidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMilestones.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <strong className="text-slate-900 block font-semibold">{m.name}</strong>
                    <span className="text-[11px] text-slate-500">{m.phase || 'General Phase'}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{m.projectName}</td>
                  <td className="py-3.5 px-4 font-mono">{m.targetDate}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={m.status === 'completed' ? 'emerald' : m.status === 'past_target_date' ? 'rose' : 'teal'}
                      size="sm"
                    >
                      {m.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={m.evidenceSummary}>
                    {m.evidenceSummary || 'Pending stage verification'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/stakeholder/projects/${m.projectId}?tab=milestones`}
                      className="text-[#3B68DE] font-semibold hover:underline"
                    >
                      View
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
