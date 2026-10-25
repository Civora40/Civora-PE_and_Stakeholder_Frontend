'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_RISKS, StakeholderRisk } from '@/lib/mock-data/stakeholder';

interface StakeholderRisksIssuesProps {
  user: CivoraUser;
  projects: Project[];
  activeRiskId?: string;
}

export function StakeholderRisksIssues({
  user,
  projects,
  activeRiskId,
}: StakeholderRisksIssuesProps) {
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

  const authorizedRisks = useMemo(() => {
    return STAKEHOLDER_RISKS.filter((r) => authorizedProjectIds.has(r.projectId));
  }, [authorizedProjectIds]);

  const activeRisk = useMemo(() => {
    if (!activeRiskId) return null;
    return authorizedRisks.find((r) => r.id === activeRiskId) || null;
  }, [authorizedRisks, activeRiskId]);

  const filteredRisks = useMemo(() => {
    return authorizedRisks.filter((r) => {
      const matchProj = selectedProject === 'all' || r.projectId === selectedProject;
      const matchStatus = selectedStatus === 'all' || r.status === selectedStatus;
      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.mitigation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchStatus && matchSearch;
    });
  }, [authorizedRisks, selectedProject, selectedStatus, searchQuery]);

  // Detail view
  if (activeRisk) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <Link
            href="/stakeholder/progress/risks"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Risks & Issues Register</span>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
            <span className="font-mono text-xs font-bold text-[#001237]">
              {activeRisk.projectName}
            </span>
            <Badge variant="teal" size="sm">
              {activeRisk.category}
            </Badge>
            <Badge
              variant={activeRisk.status === 'Resolved' ? 'emerald' : activeRisk.status === 'Mitigated' ? 'blue' : 'rose'}
              size="sm"
            >
              {activeRisk.status}
            </Badge>
            <span className="text-[11px] text-slate-400 font-mono ml-auto">
              Updated {activeRisk.lastUpdated}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
            {activeRisk.title}
          </h1>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
            <p className="font-bold text-slate-900 uppercase font-['Encode_Sans_Condensed',sans-serif]">
              Approved Technical Impact Summary
            </p>
            <p>{activeRisk.summary}</p>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-slate-800 leading-relaxed space-y-2">
            <p className="font-bold text-[#001237] uppercase font-['Encode_Sans_Condensed',sans-serif] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4FAAA7]" />
              <span>Adopted Mitigation Strategy</span>
            </p>
            <p>{activeRisk.mitigation}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Next Action Gate: <strong className="text-slate-800">{activeRisk.nextAction}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stakeholder Risks & Mitigation Oversight"
        description="Formal register of technical, environmental, and supply chain risks authorized for client and institutional stakeholder visibility."
        badge={<Badge variant="teal" size="sm">{filteredRisks.length} Approved Items</Badge>}
      />

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
              <option value="all">All States</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search risks or mitigations..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>
      </div>

      {filteredRisks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">
            No Active Risks or Issues
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All active work packages are advancing within normal parameters, and no critical issues are flagged for stakeholder attention.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#4FAAA7]/50 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#001237]">
                    {risk.projectName}
                  </span>
                  <Badge variant="teal" size="sm">
                    {risk.category}
                  </Badge>
                  <Badge
                    variant={
                      risk.status === 'Resolved'
                        ? 'emerald'
                        : risk.status === 'Mitigated'
                        ? 'blue'
                        : 'rose'
                    }
                    size="sm"
                  >
                    {risk.status}
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Updated: {risk.lastUpdated}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  {risk.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {risk.summary}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <strong className="text-slate-900 block font-semibold mb-0.5">Mitigation Protocol:</strong>
                <p>{risk.mitigation}</p>
              </div>

              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Next Gate: <strong className="text-slate-700">{risk.nextAction}</strong>
                </span>

                <Link
                  href={`/stakeholder/progress/risks/${risk.id}`}
                  className="text-[#3B68DE] font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Full Risk Record</span>
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
