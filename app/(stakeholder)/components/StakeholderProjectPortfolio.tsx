'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  MapPin,
  FileText,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_MILESTONES, STAKEHOLDER_RELEASED_REPORTS } from '@/lib/mock-data/stakeholder';

interface StakeholderProjectPortfolioProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderProjectPortfolio({ user, projects }: StakeholderProjectPortfolioProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'planning' | 'on_hold' | 'completed'>('all');
  const [sortField, setSortField] = useState<'name' | 'progress' | 'code'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter projects by user assignment
  const authorizedProjects = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return [];
    if (user.assignedProjects.includes('*')) return projects;
    return projects.filter((p) => user.assignedProjects?.includes(p.id));
  }, [user.assignedProjects, projects]);

  // Compute portfolio metrics
  const totalCount = authorizedProjects.length;
  const activeCount = authorizedProjects.filter((p) => p.status === 'active').length;
  const planningCount = authorizedProjects.filter((p) => p.status === 'planning').length;
  const completedCount = authorizedProjects.filter((p) => p.status === 'completed').length;

  // Filter and sort
  const filteredProjects = useMemo(() => {
    return authorizedProjects
      .filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortField === 'code') cmp = a.code.localeCompare(b.code);
        else if (sortField === 'progress') cmp = (a.progressPercent || 0) - (b.progressPercent || 0);
        return sortOrder === 'asc' ? cmp : -cmp;
      });

  }, [authorizedProjects, searchQuery, statusFilter, sortField, sortOrder]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Portfolio"
        description="Consolidated portfolio-level comparison, approved delivery indicators, and critical phase gate status across assigned assets."
        badge={<Badge variant="teal" size="sm">{totalCount} Assigned Assets</Badge>}
      />

      {/* Portfolio Top-Level Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Total Portfolio</span>
            <Briefcase className="w-4 h-4 text-[#4FAAA7]" />
          </div>
          <div className="text-2xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">{totalCount} Projects</div>
          <p className="text-[11px] text-slate-500">Authorized under current oversight mandate</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Active Execution</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-['Encode_Sans_Condensed',sans-serif]">{activeCount} Sites Active</div>
          <p className="text-[11px] text-slate-500">Field engineering and construction active</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Planning & Gates</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-['Encode_Sans_Condensed',sans-serif]">{planningCount} Stage Gates</div>
          <p className="text-[11px] text-slate-500">Procurement & statutory approval in review</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">Completed Phases</span>
            <CheckCircle2 className="w-4 h-4 text-[#3B68DE]" />
          </div>
          <div className="text-2xl font-black text-[#3B68DE] font-['Encode_Sans_Condensed',sans-serif]">{completedCount} Delivered</div>
          <p className="text-[11px] text-slate-500">Final handover certificates archived</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by code, title, or location..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4FAAA7] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          {(['all', 'active', 'planning', 'completed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s
                  ? 'bg-[#001237] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Portfolio Table */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Projects Match Criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms or status filter. If you believe you should have access to other projects, contact your project lead.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (sortField === 'code') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('code'); setSortOrder('asc'); }
                      }}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Project Code <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (sortField === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('name'); setSortOrder('asc'); }
                      }}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Project Name & Location <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (sortField === 'progress') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('progress'); setSortOrder('asc'); }
                      }}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Physical Progress <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4">Next Target Milestone</th>
                  <th className="py-3 px-4">Latest Released Report</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => {
                  const milestones = STAKEHOLDER_MILESTONES.filter((m) => m.projectId === project.id);
                  const nextMilestone = milestones.find((m) => m.status === 'on_schedule' || m.status === 'upcoming');
                  const latestReport = STAKEHOLDER_RELEASED_REPORTS.find((r) => r.projectId === project.id);

                  return (
                    <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#001237]">
                        {project.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block text-xs font-semibold">{project.name}</strong>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#4FAAA7]" />
                          {project.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={project.status === 'active' ? 'emerald' : project.status === 'completed' ? 'blue' : 'slate'}
                          size="sm"
                        >
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 w-32">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Verified</span>
                            <span className="font-mono font-bold text-[#001237]">{project.progressPercent ?? 0}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#4FAAA7] rounded-full"
                              style={{ width: `${project.progressPercent ?? 0}%` }}
                            />
                          </div>

                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {nextMilestone ? (
                          <div className="text-[11px]">
                            <span className="font-medium text-slate-800 block truncate max-w-[200px]" title={nextMilestone.name}>
                              {nextMilestone.name}
                            </span>
                            <span className="text-slate-500 font-mono text-[10px]">Due {nextMilestone.targetDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">None pending</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {latestReport ? (
                          <div className="text-[11px]">
                            <span className="font-mono font-bold text-[#3B68DE] block">{latestReport.reportNumber}</span>
                            <span className="text-slate-500 text-[10px]">{latestReport.period}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Dossier pending</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/stakeholder/projects/${project.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#001237] text-slate-700 hover:text-white font-semibold text-[11px] transition-colors"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
