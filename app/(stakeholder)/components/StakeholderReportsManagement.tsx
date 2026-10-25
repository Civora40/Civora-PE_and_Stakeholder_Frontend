'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  CheckCircle2,
  Eye,
  Download,
  Search,
  ArrowRight,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import {
  STAKEHOLDER_RELEASED_REPORTS,
  StakeholderReleasedReport,
} from '@/lib/mock-data/stakeholder';

interface StakeholderReportsManagementProps {
  user: CivoraUser;
}

export function StakeholderReportsManagement({ user }: StakeholderReportsManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Scoped strictly to assigned projects & released status for stakeholder (Section 3.3 & 9)
  const stakeholderReleasedReports = useMemo(() => {
    const assignedIds = new Set(
      user.assignedProjects?.includes('*')
        ? STAKEHOLDER_RELEASED_REPORTS.map((r) => r.projectId)
        : user.assignedProjects || []
    );
    return STAKEHOLDER_RELEASED_REPORTS.filter((r) => assignedIds.has(r.projectId));
  }, [user.assignedProjects]);

  const filteredStakeholderReports = useMemo(() => {
    return stakeholderReleasedReports.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.period.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [stakeholderReleasedReports, searchQuery]);

  const handleDownload = (report: StakeholderReleasedReport) => {
    setActionNotice(`Downloading ${report.reportNumber} PDF (${report.fileSize})...`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Header matching Section 9 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider bg-[#001237] text-[#4FAAA7]">
              Stakeholder Workspace
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            Released Reports
          </h1>
          <p className="text-xs text-slate-500">
            Access reports that have been approved and released for your projects.
          </p>
        </div>

        {actionNotice && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Stakeholder Released Reports View (Section 9) */}
      <div className="space-y-6">
        {/* Search bar */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search released reports by title, number, period..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            {filteredStakeholderReports.length} Released Snapshot{filteredStakeholderReports.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Empty state (Section 7.4 of Spec) */}
        {filteredStakeholderReports.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <FileCheck2 className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                No reports released yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                When an authorized project team releases a report for your project, it will appear here.
              </p>
            </div>
            <Link
              href="/stakeholder/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001237] text-white text-xs font-bold hover:bg-[#18243D] transition-colors"
            >
              <span>View my projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStakeholderReports.map((rep) => (
              <div
                key={rep.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 hover:border-[#4FAAA7]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#001237]">
                          {rep.reportNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {rep.version} &bull; Released
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                        {rep.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Project: {rep.projectName}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 line-clamp-3">
                    {rep.executiveSummary}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 block font-sans">Reporting Period</span>
                      <span className="font-bold text-slate-800">{rep.period}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 block font-sans">Release Date</span>
                      <span className="font-bold text-[#001237]">{rep.releaseDate}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions (Section 7.4 & 9) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/stakeholder/reports/${rep.id}`}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Open report</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDownload(rep)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#4FAAA7]" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
