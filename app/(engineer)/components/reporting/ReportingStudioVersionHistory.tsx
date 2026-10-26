'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Lock,
  RotateCcw,
  Eye,
  GitCompare,
  Layers,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StudioReport, ReportVersion } from '@/lib/types/reporting-studio';

interface ReportingStudioVersionHistoryProps {
  user: CivoraUser;
  report: StudioReport;
}

export function ReportingStudioVersionHistory({
  user,
  report,
}: ReportingStudioVersionHistoryProps) {
  const router = useRouter();

  // Selected versions for comparison
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    report.versions.length > 0 ? report.versions[0].id : 'current'
  );
  const [compareVersionId, setCompareVersionId] = useState<string>('current');

  const selectedVersion = report.versions.find((v) => v.id === selectedVersionId) || null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/engineer/reports" className="hover:text-slate-900 transition-colors">
              Reporting Studio
            </Link>
            <span>/</span>
            <Link href={`/engineer/reports/${report.id}/edit`} className="hover:text-slate-900 transition-colors">
              {report.reportNumber}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Version History & Snapshots</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-condensed">
            Report Version History & Audit Snapshots
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect immutable snapshots of submitted, approved, and released report versions with structural diff comparison.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/engineer/reports/${report.id}/edit`}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            Return to Editor
          </Link>
          <Link
            href={`/engineer/reports/${report.id}/preview`}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Print Preview</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Timeline + Comparison Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Timeline Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-condensed">Snapshot Timeline</h3>
            <span className="text-xs text-slate-400 font-mono">
              {report.versions.length + 1} Recorded States
            </span>
          </div>

          <div className="space-y-3">
            {/* Current Working Draft Card */}
            <div
              onClick={() => setSelectedVersionId('current')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedVersionId === 'current'
                  ? 'border-[#001237] bg-slate-50/70 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">Current Working Draft</span>
                  <Badge variant="blue" size="sm">Active</Badge>
                </div>
                <span className="text-[10px] text-slate-400">{report.lastSavedAt}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                Latest live edits by {report.createdByName}.
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                <span>{report.sections.length} Sections</span>
                <span>•</span>
                <span>{report.currentVersion}</span>
              </div>
            </div>

            {/* Historical Version Snapshots */}
            {report.versions.map((ver) => {
              const isSelected = selectedVersionId === ver.id;
              return (
                <div
                  key={ver.id}
                  onClick={() => setSelectedVersionId(ver.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#001237] bg-slate-50/70 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 font-mono">{ver.versionNumber}</span>
                      {ver.isReleasedSnapshot ? (
                        <Badge variant="emerald" size="sm">Released</Badge>
                      ) : ver.isSubmittedSnapshot ? (
                        <Badge variant="teal" size="sm">Submitted</Badge>
                      ) : (
                        <Badge variant="slate" size="sm">Snapshot</Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{ver.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {ver.changeSummary || 'Version snapshot recorded during workflow state transition.'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-1 border-t border-slate-100">
                    <span>By {ver.createdByName}</span>
                    <span className="font-mono text-[10px]">{ver.sections.length} Sections</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Snapshot Details & Content Diff Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-condensed">
                {selectedVersionId === 'current'
                  ? 'Current Working Draft Details'
                  : `Snapshot Details: ${selectedVersion?.versionNumber}`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedVersionId === 'current'
                  ? 'Active in-memory document state currently open in the CMS Editor.'
                  : `Recorded on ${selectedVersion?.createdAt} by ${selectedVersion?.createdByName}.`}
              </p>
            </div>

            {selectedVersion && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Immutable Snapshot</span>
              </span>
            )}
          </div>

          {/* Snapshot Metadata Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Workflow Status</span>
              <p className="font-semibold text-slate-800 capitalize mt-0.5">
                {selectedVersion ? selectedVersion.workflowStatus.replace('_', ' ') : report.workflowStatus.replace('_', ' ')}
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Page Layout</span>
              <p className="font-semibold text-slate-800 mt-0.5 font-mono">
                {selectedVersion?.layoutSettings
                  ? `${selectedVersion.layoutSettings.paperSize} (${selectedVersion.layoutSettings.orientation})`
                  : `${report.layoutSettings?.paperSize || 'A4'} (${report.layoutSettings?.orientation || 'PORTRAIT'})`}
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Sections Count</span>
              <p className="font-semibold text-slate-800 mt-0.5 font-mono">
                {selectedVersion ? selectedVersion.sections.length : report.sections.length} Sections
              </p>
            </div>
          </div>

          {/* Section Content Preview */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 font-condensed uppercase tracking-wider">
              Snapshot Sections Breakdown
            </h4>

            <div className="space-y-3">
              {(selectedVersion ? selectedVersion.sections : report.sections).map((sec) => (
                <div key={sec.id} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-800">{sec.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sec.content.length} chars
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {sec.content || <span className="italic text-slate-400">Empty section content.</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
