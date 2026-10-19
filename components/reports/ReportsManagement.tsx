'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  Lock,
  CheckCircle2,
  Clock,
  Shield,
  Eye,
  X,
} from 'lucide-react';
import { Report, CivoraUser, ReportStatus } from '@/types';
import { can } from '@/lib/permissions/rbac';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ReportsManagementProps {
  user: CivoraUser;
  reports: Report[];
}

export function ReportsManagement({ user, reports: initialReports }: ReportsManagementProps) {
  const [reportsList, setReportsList] = useState<Report[]>(initialReports);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const canRelease = can(user, 'reports:release');

  const filteredReports = reportsList.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            Quality & Compliance Reports
          </h1>
          <p className="text-xs text-slate-400">
            {canRelease
              ? 'Compile, approve, and authorize final release of compliance packages.'
              : 'Read-only access to approved and released quality compliance records.'}
          </p>
        </div>

        {actionNotice && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Governance Explanatory Banner: Submission Approval != Report Release */}
      <div className="rounded-xl bg-[#001237] border border-blue-500/30 p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#4FAAA7] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-white uppercase tracking-wider">
            Governance Standard: Separation of Physical Approval vs Executive Release
          </span>
          <p className="text-slate-300 leading-relaxed">
            Approving a contractor submittal on site confirms that physical materials meet engineering
            tolerances. Final report release authorizes distributing certified compliance packages to
            owners, city inspectors, and financial auditors. Each stage maintains an immutable audit trail.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-[#18243D] p-1 rounded-xl border border-slate-700/80 text-xs overflow-x-auto">
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
                ? 'bg-[#3B68DE] text-white'
                : 'text-slate-400 hover:text-white'
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
            className="rounded-2xl bg-[#18243D] border border-slate-700/80 p-6 space-y-4 hover:border-[#4FAAA7]/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#4FAAA7]">
                    {rep.reportNumber}
                  </span>
                  <h3 className="text-base font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase mt-0.5">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{rep.projectName}</p>
                </div>
                <Badge
                  variant={
                    rep.status === 'released'
                      ? 'emerald'
                      : rep.status === 'approved'
                      ? 'blue'
                      : rep.status === 'review'
                      ? 'amber'
                      : 'slate'
                  }
                  size="sm"
                  dot={rep.status === 'approved'}
                >
                  {rep.status.toUpperCase()}
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-[#001237] border border-slate-800 text-xs text-slate-300 line-clamp-2">
                {rep.executiveSummary}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#001237] border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Submittals Compiled:</span>
                  <span className="font-bold text-white">{rep.submissionCount} Records</span>
                </div>
                <div className="p-2 rounded bg-[#001237] border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Resolved Discrepancies:</span>
                  <span className="font-bold text-[#4FAAA7]">{rep.flagsResolvedCount} Documented</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Period: <span className="text-slate-200">{rep.period}</span>
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

      {/* Report Audit Trail & Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="rounded-2xl bg-[#18243D] border border-slate-700 max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
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
              <h2 className="text-xl font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                {selectedReport.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">{selectedReport.projectName}</p>
            </div>

            {/* Executive Summary */}
            <div className="p-4 rounded-xl bg-[#001237] border border-slate-800 text-xs text-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Executive Summary:
              </span>
              <p className="leading-relaxed">{selectedReport.executiveSummary}</p>
            </div>

            {/* Audit Trail */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#4FAAA7]" />
                <span>Deterministic Audit Trail ({selectedReport.auditTrail.length} Events)</span>
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedReport.auditTrail.map((aud) => (
                  <div
                    key={aud.id}
                    className="p-3 rounded-lg bg-[#001237] border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{aud.action}</span>
                      <span className="font-mono text-[10px] text-slate-400">{aud.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Actor: <strong>{aud.actor}</strong> ({aud.actorRole})
                    </div>
                    <div className="text-[11px] text-slate-400 italic">&ldquo;{aud.note}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                {selectedReport.status === 'approved' && !canRelease && (
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Read-only: Release requires explicit authorization.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedReport.status === 'approved' && canRelease && (
                  <Button
                    onClick={() => handleReleaseReport(selectedReport.id)}
                    variant="teal"
                    size="sm"
                    leftIcon={<FileCheck2 className="w-4 h-4" />}
                  >
                    Authorize Final Release
                  </Button>
                )}
                <Button onClick={() => setSelectedReport(null)} variant="outline" size="sm">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
