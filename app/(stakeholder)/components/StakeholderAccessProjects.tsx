'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';

interface StakeholderAccessProjectsProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderAccessProjects({ user, projects }: StakeholderAccessProjectsProps) {
  // Authorize projects
  const authorizedProjectIds = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return new Set<string>();
    if (user.assignedProjects.includes('*')) return new Set(projects.map((p) => p.id));
    return new Set(user.assignedProjects);
  }, [user.assignedProjects, projects]);

  const assignedProjectsList = useMemo(() => {
    return projects.filter((p) => authorizedProjectIds.has(p.id));
  }, [projects, authorizedProjectIds]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access & Assigned Projects"
        description="Verify your institutional authorization tier, permissions scope, and assigned project memberships."
      />


      {/* Role and Permissions Overview Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Current Role Profile
              </span>
              <Badge variant="teal" size="sm">
                Authorized Stakeholder
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-condensed tracking-tight">
              {user.role === 'read_only_stakeholder' ? 'Institutional Oversight & Client Representative' : user.role}
            </h2>
            <p className="text-xs text-slate-500">
              Identity verified via {user.email} • Assigned Organization: {user.department || 'Aegis Infrastructure Capital'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-right">
            <span className="text-[11px] text-slate-400 block font-mono">Access Status</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active & In Good Standing
            </span>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Permitted Capabilities Matrix
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Executive Reports</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Read-only access to formally released and signed-off monthly compliance dossiers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Delivery Milestones</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Full schedule inspection, approved completion certificates, and delay tracking.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Shared Documents</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Secure download of authorized structural drawings, environmental permits, and test logs.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Published Risks</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Transparent view of stakeholder-approved risks, mitigations, and schedule impacts.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Direct Inquiries</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Formal communication channel directly routed to assigned superintending project engineers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Restricted Engineering Tools</span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-snug">
                No access to draft submissions, internal cost ledgers, contractor approvals, or field revisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Authorized Projects List */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              Assigned Project Memberships ({assignedProjectsList.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Projects where your credentials have been certified for stakeholder oversight.
            </p>
          </div>
          <Badge variant="slate" size="sm">
            Continuous Institutional Access
          </Badge>

        </div>

        <div className="divide-y divide-slate-100">
          {assignedProjectsList.map((project) => (
            <div
              key={project.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 p-3 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {project.code || project.id}
                  </span>
                  <Badge variant="teal" size="sm">
                    {project.status || 'Active'}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{project.name}</h4>
                <p className="text-xs text-slate-500">
                  Location: {project.location || 'Lagos, Nigeria'} • Category: Infrastructure / Civil
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/stakeholder/projects/${project.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white hover:border-[#3B68DE]/40 transition-colors"
                >
                  <span>Project Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/stakeholder/projects/${project.id}/reports`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001237] text-xs font-semibold text-white hover:bg-[#18243D] transition-colors"
                >
                  <span>Released Reports</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}

          {assignedProjectsList.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No project memberships currently assigned. Please contact the Civora access administrator.
            </div>
          )}
        </div>
      </div>

      {/* Discrepancy Notice */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Missing a Project or Require Supplementary Seats?</span>
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
            Stakeholder memberships are provisioned through verified corporate mandate letters. To request access to additional project dossiers or update your organization’s authorized observers, submit a support request.
          </p>
        </div>
        <Link
          href="/stakeholder/account/support"
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors whitespace-nowrap shadow-2xs"
        >
          Contact Access Support
        </Link>
      </div>
    </div>
  );
}
