'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Lock,
  CheckCircle2,
  Clock,
  Shield,
  Eye,
  X,
  Download,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { Report, CivoraUser, ReportStatus } from '@/types';
import { can } from '@/lib/permissions/rbac';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  STAKEHOLDER_RELEASED_REPORTS,
  StakeholderReleasedReport,
} from '@/lib/mock-data/stakeholder';

interface ReportsManagementProps {
  user: CivoraUser;
  reports: Report[];
}

export function ReportsManagement({ user, reports: initialReports }: ReportsManagementProps) {
  const isStakeholder = user.role === 'read_only_stakeholder';
  const canRelease = can(user, 'reports:release');

  const [reportsList, setReportsList] = useState<Report[]>(initialReports);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [selectedStakeholderReport, setSelectedStakeholderReport] =
    useState<StakeholderReleasedReport | null>(null);

  // Scoped strictly to assigned projects & released status for stakeholder (Section 3.3 & 9)
  const stakeholderReleasedReports = useMemo(() => {
    if (!isStakeholder) return [];
    const assignedIds = new Set(
      user.assignedProjects?.includes('*')
        ? STAKEHOLDER_RELEASED_REPORTS.map((r) => r.projectId)
        : user.assignedProjects || []
    );
    return STAKEHOLDER_RELEASED_REPORTS.filter((r) => assignedIds.has(r.projectId));
  }, [isStakeholder, user.assignedProjects]);

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

  const filteredReports = useMemo(() => {
    return reportsList.filter((r) => {
      if (statusFilter === 'all') return true;
      return r.status === statusFilter;
    });
  }, [reportsList, statusFilter]);

  const handleDownload = (report: StakeholderReleasedReport) => {
    setActionNotice(`Downloading ${report.reportNumber} PDF (${report.fileSize})...`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleReleaseReport = (reportId: string) => {
    if (!canRelease) return;

    const updated = reportsList.map((r) => {
      if (r.id === reportId) {
        const newAuditEntry = {
          id: `aud_${Date.now()}`,
          action: 'Official Executive Release',
          actor: user.name,
          actorRole: user.role,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note: 'Cryptographically signed and released to external stakeholder portal.',
        };

        return {
          ...r,
          status: 'released' as ReportStatus,
          releasedBy: user.name,
          releasedAt: new Date().toISOString(),
          auditTrail: [...r.auditTrail, newAuditEntry],
        };
      }
      return r;
    });

    setReportsList(updated);

    if (selectedReport && selectedReport.id === reportId) {
      const match = updated.find((u) => u.id === reportId);
      if (match) setSelectedReport(match);
    }

    setActionNotice(`Report ${reportId} officially released to stakeholder portal.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Header matching Section 9 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isStakeholder && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider bg-[#001237] text-[#4FAAA7]">
                Stakeholder Workspace
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            {isStakeholder ? 'Released Reports' : 'Quality & Compliance Reports'}
          </h1>
          <p className="text-xs text-slate-500">
            {isStakeholder
              ? 'Access reports that have been approved and released for your projects.'
              : canRelease
              ? 'Compile, approve, and authorize final release of compliance packages.'
              : 'Read-only access to approved and released quality compliance records.'}
          </p>
        </div>

        {actionNotice && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Engineer Governance Explanatory Banner */}
      {!isStakeholder && (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 flex items-start gap-3 shadow-xs">
          <Shield className="w-5 h-5 text-[#4FAAA7] flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Governance Standard: Separation of Physical Approval vs Executive Release
            </span>
            <p className="text-slate-600 leading-relaxed">
              Approving a contractor submittal on site confirms that physical materials meet engineering
              tolerances. Final report release authorizes distributing certified compliance packages to
              owners, city inspectors, and financial auditors. Each stage maintains an immutable audit trail.
            </p>
          </div>
        </div>
      )}

      {/* Stakeholder Released Reports View (Section 9) */}
      {isStakeholder ? (
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
                href="/dashboard/projects"
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
                      href={`/dashboard/reports/${rep.id}`}
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
      ) : (
        /* Engineer Reports View */
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
            {[
              { label: 'All Reports', value: 'all' },
              { label: 'Released', value: 'released' },
              { label: 'Approved (Pending Release)', value: 'approved' },
              { label: 'Under Review', value: 'review' },
              { label: 'Draft', value: 'draft' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === tab.value
                    ? 'bg-[#001237] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 hover:border-[#4FAAA7]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-[#4FAAA7]">
                        {rep.reportNumber}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase mt-0.5">
                        {rep.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{rep.projectName}</p>
                    </div>
                    <Badge
                      variant={
                        rep.status === 'released'
                          ? 'emerald'
                          : rep.status === 'approved'
                          ? 'blue'
                          : rep.status === 'review'
                          ? 'teal'
                          : 'slate'
                      }
                      size="sm"
                      dot={rep.status === 'approved'}
                    >
                      {rep.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 line-clamp-2">
                    {rep.executiveSummary}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Submittals Compiled:</span>
                      <span className="font-bold text-slate-900">{rep.submissionCount} Records</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Resolved Discrepancies:</span>
                      <span className="font-bold text-[#4FAAA7]">{rep.flagsResolvedCount} Documented</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Period: <span className="text-slate-800 font-medium">{rep.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {rep.status === 'approved' && canRelease && (
                      <Button
                        onClick={() => handleReleaseReport(rep.id)}
                        variant="teal"
                        size="sm"
                        leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
                      >
                        Release Report
                      </Button>
                    )}
                    <Button
                      onClick={() => setSelectedReport(rep)}
                      variant="outline"
                      size="sm"
                      rightIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect Audit Trail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engineer Audit Trail Modal */}
      {!isStakeholder && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="rounded-2xl bg-white border border-slate-200 max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8 text-slate-900">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#4FAAA7]">
                  {selectedReport.reportNumber}
                </span>
                <Badge
                  variant={selectedReport.status === 'released' ? 'emerald' : 'blue'}
                  size="sm"
                >
                  Status: {selectedReport.status.toUpperCase()}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                {selectedReport.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{selectedReport.projectName}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
                Executive Summary:
              </span>
              <p className="leading-relaxed">{selectedReport.executiveSummary}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <Button onClick={() => setSelectedReport(null)} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
