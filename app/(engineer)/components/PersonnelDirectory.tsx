'use client';

import React, { useState } from 'react';
import {
  Phone,
  Send,
  Search,
  Shield,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Personnel, CivoraUser } from '@/types';
import { can } from '@/lib/permissions/rbac';

interface PersonnelDirectoryProps {
  user: CivoraUser;
  initialPersonnel: Personnel[];
}

export function PersonnelDirectory({
  user,
  initialPersonnel,
}: PersonnelDirectoryProps) {
  const [personnelList] = useState<Personnel[]>(initialPersonnel);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const canManage = can(user, 'personnel:manage');

  const departments = Array.from(new Set(personnelList.map((p) => p.department)));

  const filteredPersonnel = personnelList.filter((person) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      person.fullName.toLowerCase().includes(q) ||
      person.professionalTitle.toLowerCase().includes(q) ||
      person.department.toLowerCase().includes(q) ||
      person.organization.toLowerCase().includes(q);

    const matchesDept = departmentFilter === 'all' ? true : person.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Verified Personnel & Field Submitters
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#001237] text-[#4FAAA7]">
              {personnelList.length} Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized directory of accredited field submitters, verified WhatsApp/Telegram contacts, and assigned reporting expectations.
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              Directory Management Active
            </span>
          </div>
        )}
      </div>

      {/* Role Separation Notice */}
      <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-950 flex items-start gap-3">
        <Shield className="w-4 h-4 text-[#4FAAA7] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block">Separation of Professional Job Titles and Civora RBAC Roles:</strong>
          <span className="text-[11px] text-slate-700">
            Professional titles (e.g. &ldquo;Senior Structural QA Engineer&rdquo;, &ldquo;Lead Geotechnical Specialist&rdquo;) designate accredited engineering disciplines on site. System access roles (e.g. &ldquo;project_engineer&rdquo;, &ldquo;read_only_stakeholder&rdquo;) govern Civora platform credentials. Field personnel submit evidence entirely through messaging channels without requiring direct software login credentials.
          </span>
        </div>
      </div>

      {/* Search & Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute inset-y-0 left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, title, department..."
            className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
          <button
            onClick={() => setDepartmentFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              departmentFilter === 'all'
                ? 'bg-[#001237] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Departments
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                departmentFilter === dept
                  ? 'bg-[#001237] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPersonnel.map((person) => (
          <div
            key={person.id}
            className="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              {/* Top info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {person.fullName}
                  </h3>
                  <div className="text-xs font-semibold text-[#001237] mt-0.5">
                    {person.professionalTitle}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {person.department} &bull; {person.organization}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified
                </span>
              </div>

              {/* Verified Contact Methods */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  VERIFIED CONTACT METHODS
                </span>
                {person.verifiedContacts.map((cnt) => (
                  <div key={cnt.id} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      {cnt.type === 'whatsapp' || cnt.type === 'phone' ? (
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Send className="w-3.5 h-3.5 text-sky-600" />
                      )}
                      <span className="capitalize">{cnt.type}:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{cnt.maskedValue}</span>
                  </div>
                ))}
                <div className="text-[10px] text-slate-400 border-t border-slate-200/60 pt-1">
                  Verified by: {person.verifiedContacts[0]?.verifiedBy || 'Civora Compliance Desk'}
                </div>
              </div>

              {/* Project & Reporting Cadence Details */}
              <div className="text-xs space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#4FAAA7]" />
                    Reporting Cadence:
                  </span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {person.expectedReportingCadence.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#4FAAA7]" />
                    Assigned Project:
                  </span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]">
                    {person.assignedProjectNames?.[0] || 'Lagos Rail Blue Line'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer / Status */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Active since {person.effectiveFrom}</span>
              <span className="font-mono text-[10px] text-slate-500">
                Civora RBAC: {person.civoraRole || 'Field Submitter'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
