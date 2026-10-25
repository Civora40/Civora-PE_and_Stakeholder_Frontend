'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Mail,
  ShieldCheck,
  Star,
  Building,
  Filter,
  Search,
  MessageSquare,
  Award,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_TEAM, StakeholderTeamMember } from '@/lib/mock-data/stakeholder';

interface StakeholderProjectTeamProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderProjectTeam({ user, projects }: StakeholderProjectTeamProps) {
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

  const authorizedMembers = useMemo(() => {
    return STAKEHOLDER_TEAM.filter((m) => authorizedProjectIds.has(m.projectId));
  }, [authorizedProjectIds]);

  const filteredMembers = useMemo(() => {
    return authorizedMembers.filter((m) => {
      const matchProj = selectedProject === 'all' || m.projectId === selectedProject;
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchSearch;
    });
  }, [authorizedMembers, selectedProject, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Team & Engineering Directory"
        description="Approved project contacts, superintending COREN-registered engineers, and client liaison officers authorized for stakeholder communication."
        badge={<Badge variant="teal" size="sm">{filteredMembers.length} Authorized Contacts</Badge>}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Filter by Project:</span>
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

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contact or role..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 font-['Encode_Sans_Condensed',sans-serif] uppercase">No Team Members Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No contacts match your active filter. Adjust your project selector or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className={`p-5 rounded-2xl bg-white border transition-all space-y-4 ${
                member.isLead
                  ? 'border-[#4FAAA7]/50 shadow-xs'
                  : 'border-slate-200/80 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#001237] text-white flex items-center justify-center font-bold text-sm shrink-0 font-mono">
                    {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        {member.name}
                      </h3>
                      {member.isLead && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4FAAA7] bg-[#4FAAA7]/10 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-current" /> Lead Contact
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{member.title}</p>
                  </div>
                </div>
              </div>

              {/* Responsibility block */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4FAAA7]" />
                  <span>Approved Scope of Responsibility</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {member.responsibility}
                </p>
              </div>

              {/* Footer with project & official contact channel */}
              <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 gap-2">
                <span className="font-mono text-[11px] text-[#4FAAA7] font-semibold">
                  {member.projectName}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/stakeholder/communications/contacts?recipient=${encodeURIComponent(member.name)}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#001237] text-white hover:bg-[#18243D] text-[11px] font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Send Query</span>
                  </Link>
                  <a
                    href={`mailto:${member.permittedContact}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title={`Email ${member.permittedContact}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
