'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Flag,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_MILESTONES, StakeholderProjectMilestone } from '@/lib/mock-data/stakeholder';

interface StakeholderMilestonesProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderMilestones({ user, projects }: StakeholderMilestonesProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
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

  const authorizedMilestones = useMemo(() => {
    return STAKEHOLDER_MILESTONES.filter((m) => authorizedProjectIds.has(m.projectId));
  }, [authorizedProjectIds]);

  const filteredMilestones = useMemo(() => {
    return authorizedMilestones.filter((m) => {
      const matchProj = selectedProject === 'all' || m.projectId === selectedProject;
      const matchStatus = selectedStatus === 'all' || m.status === selectedStatus;
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchStatus && matchSearch;
    });
  }, [authorizedMilestones, selectedProject, selectedStatus, searchQuery]);

  const completedCount = authorizedMilestones.filter((m) => m.status === 'completed').length;
  const onScheduleCount = authorizedMilestones.filter((m) => m.status === 'on_schedule').length;
  const overdueCount = authorizedMilestones.filter((m) => m.status === 'past_target_date').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Milestones & Phase Gates"
        description="Authoritative project delivery milestones, concrete pour stage gates, and verified statutory compliance sign-offs."
        badge={<Badge variant="teal" size="sm">{filteredMilestones.length} Milestone Gates</Badge>}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Completed Gates</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-['Encode_Sans_Condensed',sans-serif]">{completedCount} Verified</div>
          <p className="text-[11px] text-slate-500">100% formal sign-off completed</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">On Track Execution</span>
            <Clock className="w-4 h-4 text-[#4FAAA7]" />
          </div>
          <div className="text-2xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">{onScheduleCount} Active</div>
          <p className="text-[11px] text-slate-500">Progressing within approved schedule buffer</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Attention Required</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-['Encode_Sans_Condensed',sans-serif]">{overdueCount} Critical Buffer</div>
          <p className="text-[11px] text-slate-500">Testing re-sampling or permit clearance pending</p>
        </div>
      </div>

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

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>
      </div>

      {/* Milestones Cards */}
      {filteredMilestones.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <Flag className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Milestones Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or project filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMilestones.map((milestone) => (
            <div
              key={milestone.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#001237]">
                    {milestone.projectName}
                  </span>
                  <Badge
                    variant={
                      milestone.status === 'completed'
                        ? 'emerald'
                        : milestone.status === 'past_target_date'
                        ? 'rose'
                        : 'teal'
                    }
                    size="sm"
                  >
                    {milestone.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  {milestone.name}
                </h3>
                {milestone.phase && (
                  <p className="text-xs text-slate-400 font-medium">{milestone.phase}</p>
                )}

                {milestone.evidenceSummary && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-[#4FAAA7] shrink-0 mt-0.5" />
                    <span>{milestone.evidenceSummary}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-3 font-mono">
                  <span>Target: <strong className="text-slate-800">{milestone.targetDate}</strong></span>
                  {milestone.completionDate && (
                    <span>Done: <strong className="text-emerald-600">{milestone.completionDate}</strong></span>
                  )}
                </div>

                <Link
                  href={`/stakeholder/projects/${milestone.projectId}?tab=milestones`}
                  className="text-[#3B68DE] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Project Tab</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
