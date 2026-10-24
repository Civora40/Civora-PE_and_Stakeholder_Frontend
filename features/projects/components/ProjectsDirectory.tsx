'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Briefcase,
  Building,
  ExternalLink,
  Lock,
  X,
} from 'lucide-react';
import { Project, CivoraUser } from '@/types';
import { can } from '@/lib/permissions/rbac';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ProjectsDirectoryProps {
  user: CivoraUser;
  projects: Project[];
}

export function ProjectsDirectory({ user, projects: initialProjects }: ProjectsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_review' | 'planning'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectsList] = useState<Project[]>(initialProjects);

  const canManage = can(user, 'projects:manage');

  const filteredProjects = useMemo(() => {
    return projectsList.filter((proj) => {
      const matchesSearch =
        proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.leadEngineer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ? true : proj.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projectsList, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            Project Scope Directory
          </h1>
          <p className="text-xs text-slate-500">
            {canManage
              ? 'Authorized to inspect and manage project configurations within active scope.'
              : 'Read-only stakeholder audit access across authorized capital infrastructure projects.'}
          </p>
        </div>

        <div>
          {canManage ? (
            <Button
              href="/dashboard/projects/new"
              variant="teal"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Project
            </Button>
          ) : (
            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700"
              title="Stakeholder roles have read-only access"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Project Creation Gated</span>
            </div>
          )}
        </div>
      </div>

      {/* Functional Search & Filter Bar */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by code, name, client..."
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
                    ? 'bg-[#001237] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center space-y-3 shadow-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
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
                      <span>{proj.client}</span>
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

                <div className="text-xs text-slate-500 line-clamp-1">
                  Location: {proj.location}
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Field Progress</span>
                    <span className="font-semibold text-slate-900">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4FAAA7] to-[#3B68DE] rounded-full"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics ribbon */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 block">Submittals</span>
                    <span className="font-bold text-slate-900">{proj.submissionsCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 block">Pending PE</span>
                    <span className="font-bold text-[#001237]">{proj.pendingReviewsCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 block">Reports</span>
                    <span className="font-bold text-emerald-600">{proj.reportsCount}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Lead: <strong className="text-slate-800">{proj.leadEngineer}</strong>
                </span>
                <Button
                  onClick={() => setSelectedProject(proj)}
                  variant="outline"
                  size="sm"
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Inspect Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Details Modal / Drawer */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-white border border-slate-200 max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-xs font-semibold text-[#4FAAA7]">
                {selectedProject.code}
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                {selectedProject.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Client: {selectedProject.client}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Budget Allocation:</span>
                <span className="text-base font-bold text-slate-900">{selectedProject.budgetFormatted}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Lead Structural PE:</span>
                <span className="text-base font-bold text-[#4FAAA7]">{selectedProject.leadEngineer}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-slate-600 block font-semibold uppercase tracking-wider">
                Governing Technical Standards:
              </span>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
                {selectedProject.specsReference}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                href={`/dashboard/submissions?project=${selectedProject.id}`}
                variant="teal"
                size="sm"
              >
                View Project Submittals ({selectedProject.submissionsCount})
              </Button>
              <Button onClick={() => setSelectedProject(null)} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
