'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_MILESTONES, STAKEHOLDER_UPDATES } from '@/lib/mock-data/stakeholder';

interface StakeholderProgressOverviewProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderProgressOverview({ user, projects }: StakeholderProgressOverviewProps) {
  // Authorize projects
  const authorizedProjects = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return [];
    if (user.assignedProjects.includes('*')) return projects;
    return projects.filter((p) => user.assignedProjects?.includes(p.id));
  }, [user.assignedProjects, projects]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    authorizedProjects[0]?.id || ''
  );

  const activeProject = useMemo(() => {
    return authorizedProjects.find((p) => p.id === selectedProjectId) || authorizedProjects[0] || null;
  }, [authorizedProjects, selectedProjectId]);

  const projectMilestones = useMemo(() => {
    if (!activeProject) return [];
    return STAKEHOLDER_MILESTONES.filter((m) => m.projectId === activeProject.id);
  }, [activeProject]);

  const projectUpdates = useMemo(() => {
    if (!activeProject) return [];
    return STAKEHOLDER_UPDATES.filter((u) => u.projectId === activeProject.id);
  }, [activeProject]);

  const completedMilestones = projectMilestones.filter((m) => m.status === 'completed');
  const onScheduleMilestones = projectMilestones.filter((m) => m.status === 'on_schedule');
  const delayedMilestones = projectMilestones.filter((m) => m.status === 'past_target_date');

  if (!activeProject) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
        <Building className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Assigned Projects</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          You currently have no authorized project memberships assigned to your profile. Please contact your Civora administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Progress & Verification Overview"
        description="Transparent progress telemetry computed from verified structural inspection records, material test logs, and approved stage gates."
        badge={<Badge variant="teal" size="sm">Audited Telemetry</Badge>}
      />

      {/* Project Selector Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Select Active Asset:</span>
          <select
            value={activeProject.id}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 font-bold font-['Encode_Sans_Condensed',sans-serif] focus:outline-none focus:border-[#4FAAA7]"
          >
            {authorizedProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <Info className="w-3.5 h-3.5 text-[#4FAAA7]" />
          <span>Data as of 25 Oct 2026, 06:00 UTC &bull; Verified COREN R.48201</span>
        </div>
      </div>

      {/* Main Delivery Health Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#001237]">{activeProject.code}</span>
              <Badge variant="emerald" size="sm">{activeProject.status}</Badge>
            </div>
            <h2 className="text-xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
              {activeProject.name}
            </h2>
            <p className="text-xs text-slate-500">{activeProject.location}</p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold font-['Encode_Sans_Condensed',sans-serif]">
              Verified Physical Progress
            </span>
            <div className="text-3xl font-black text-[#001237] font-mono mt-0.5">
              {activeProject.progressPercent ?? 0}%
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">On Schedule Cadence</span>
          </div>
        </div>

        {/* Progress Bar with Milestones */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Cumulative Work Package Verification</span>
            <span className="font-mono font-bold text-[#001237]">{activeProject.progressPercent ?? 0}% Completed</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-[#3B68DE] to-[#4FAAA7] rounded-full transition-all duration-700"
              style={{ width: `${activeProject.progressPercent ?? 0}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            * Methodology: Progress metric is computed strictly from verified stage gate completions and concrete volume sign-offs. Estimations without laboratory test verification are excluded.
          </p>
        </div>

        {/* Phase Gate Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Completed Gates</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">{completedMilestones.length} Gates</div>
            <p className="text-[11px] text-slate-500">Formally stamped and certified</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Active Critical Gates</span>
              <Clock className="w-4 h-4 text-[#4FAAA7]" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">{onScheduleMilestones.length} In Progress</div>
            <p className="text-[11px] text-slate-500">Advancing within targeted buffer</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Schedule Variance</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
              {delayedMilestones.length > 0 ? `${delayedMilestones.length} Attention` : '0 Critical Variance'}
            </div>
            <p className="text-[11px] text-slate-500">Derived from approved baseline target dates</p>
          </div>
        </div>
      </div>

      {/* Recent Published Updates */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
            Recent Verified Stage Releases for this Asset
          </h3>
          <Link
            href="/stakeholder/progress/updates"
            className="text-xs text-[#3B68DE] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>All Updates</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {projectUpdates.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No updates recorded for this project yet.</p>
        ) : (
          <div className="space-y-3">
            {projectUpdates.map((u) => (
              <div key={u.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{u.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{u.summary}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">{u.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
