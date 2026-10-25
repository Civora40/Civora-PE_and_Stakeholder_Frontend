'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { Project, CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { STAKEHOLDER_MILESTONES, STAKEHOLDER_UPDATES } from '@/lib/mock-data/stakeholder';

interface StakeholderProjectsDirectoryProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderProjectsDirectory({ user, projects: initialProjects }: StakeholderProjectsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_review' | 'planning'>('all');

  // Scoped strictly to assigned projects (Section 3.2 & 8)
  const scopedProjects = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return [];
    if (user.assignedProjects.includes('*')) return initialProjects;
    return initialProjects.filter((p) => user.assignedProjects?.includes(p.id));
  }, [initialProjects, user.assignedProjects]);

  const filteredProjects = useMemo(() => {
    return scopedProjects.filter((proj) => {
      const matchesSearch =
        proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.client.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ? true : proj.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [scopedProjects, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Header Bar matching Section 8 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider bg-[#001237] text-[#4FAAA7]">
              Stakeholder Workspace
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Authorized Scope ({scopedProjects.length})
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            My Projects
          </h1>
          <p className="text-xs text-slate-500">
            View the construction projects currently shared with your account.
          </p>
        </div>
      </div>

      {/* Functional Search & Filter Bar */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assigned projects by name, code, location..."
            className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:inline-block" />
          <span className="text-xs text-slate-500 hidden sm:inline-block">Status:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto text-xs">
            {(['all', 'active', 'in_review', 'planning'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded font-medium transition-colors uppercase text-[10px] tracking-wider cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#001237] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State when no assigned projects (Section 7.2 of Spec) */}
      {scopedProjects.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
              No projects assigned yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              When a project administrator grants your account access, the project will appear here. If you believe you should already have access, contact the person who invited you.
            </p>
          </div>
          <Link
            href="/access-pending"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001237] text-white text-xs font-bold hover:bg-[#18243D] transition-colors"
          >
            <span>View access status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        /* Filter Empty State */
        <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Projects Match Your Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or reset the status filter to view available projects.
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            variant="outline"
            size="sm"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => {
            const projMilestones = STAKEHOLDER_MILESTONES.filter((m) => m.projectId === proj.id);
            const nextMilestone =
              projMilestones.find((m) => m.status === 'on_schedule' || m.status === 'upcoming') ||
              projMilestones[0];
            const projUpdates = STAKEHOLDER_UPDATES.filter((u) => u.projectId === proj.id);
            const lastUpdate = projUpdates.length > 0 ? projUpdates[0].timestamp : 'No updates yet';

            return (
              <div
                key={proj.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 hover:border-[#4FAAA7]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-[#4FAAA7]">
                        {proj.code}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Client: {proj.client}</span>
                      </p>
                    </div>
                    <Badge
                      variant={
                        proj.status === 'active'
                          ? 'teal'
                          : proj.status === 'in_review'
                          ? 'blue'
                          : 'slate'
                      }
                      size="sm"
                    >
                      {proj.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{proj.location}</span>
                  </div>

                  {/* Approved Progress Bar (Section 7.2) */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Approved Progress</span>
                      <span className="font-semibold text-slate-900 font-mono">
                        {proj.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4FAAA7] to-[#3B68DE] rounded-full"
                        style={{ width: `${proj.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs">
                    {nextMilestone && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">Next Milestone:</span>
                        <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[180px]">
                          {nextMilestone.name} ({nextMilestone.targetDate})
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Latest Update:</span>
                      <span className="font-mono text-[10px] text-slate-600">
                        {lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions (Section 7.2: CTA View project) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <Link
                    href={`/stakeholder/projects/${proj.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <span>View project</span>
                    <ArrowRight className="w-3 h-3 text-[#4FAAA7]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
