'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  ChevronLeft,
  Calendar,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  FileCheck2,
  Download,
  AlertCircle,
  Layers,
  ArrowRight,
  Shield,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import {
  STAKEHOLDER_MILESTONES,
  STAKEHOLDER_UPDATES,
  STAKEHOLDER_RELEASED_REPORTS,
  StakeholderProjectMilestone,
  StakeholderReleasedReport,
  StakeholderUpdateItem,
} from '@/lib/mock-data/stakeholder';
import { Badge } from '@/components/ui/Badge';

interface ProjectDetailViewProps {
  user: CivoraUser;
  project: Project;
  initialTab?: 'overview' | 'milestones' | 'reports' | 'updates';
}

export function ProjectDetailView({
  user,
  project,
  initialTab = 'overview',
}: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'reports' | 'updates'>(
    initialTab
  );

  // Filter project-specific stakeholder data
  const projectMilestones = STAKEHOLDER_MILESTONES.filter((m) => m.projectId === project.id);
  const projectReports = STAKEHOLDER_RELEASED_REPORTS.filter((r) => r.projectId === project.id);
  const projectUpdates = STAKEHOLDER_UPDATES.filter((u) => u.projectId === project.id);

  // Report Modal / Download state
  const [selectedReport, setSelectedReport] = useState<StakeholderReleasedReport | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownload = (report: StakeholderReleasedReport) => {
    setDownloadNotice(`Downloading ${report.reportNumber} (${report.fileSize})...`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const completedMilestonesCount = projectMilestones.filter((m) => m.status === 'completed').length;
  const milestonePercent =
    projectMilestones.length > 0
      ? Math.round((completedMilestonesCount / projectMilestones.length) * 100)
      : 0;

  const lastUpdate = projectUpdates.length > 0 ? projectUpdates[0].timestamp : 'No updates yet';

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Toast Notice */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Download className="w-4 h-4 text-[#4FAAA7] animate-bounce" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1 hover:text-[#001237] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>My Projects</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-slate-700">{project.code}</span>
      </div>

      {/* Header (Section 8) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#4FAAA7] bg-[#001237] px-2 py-0.5 rounded">
                {project.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {project.status.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Authorized Stakeholder Scope
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
              {project.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Client: {project.client}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Last Update: {lastUpdate}
              </span>
            </div>
          </div>

          {/* Approved Progress Measure */}
          <div className="w-full lg:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Approved Progress
              </span>
              <span className="font-mono font-bold text-base text-[#001237]">
                {project.progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4FAAA7] to-[#3B68DE] rounded-full"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Verified physical inspection progress baseline.
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Section 8) */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Briefcase },
            {
              id: 'milestones',
              label: `Milestones (${projectMilestones.length})`,
              icon: CheckCircle2,
            },
            {
              id: 'reports',
              label: `Released Reports (${projectReports.length})`,
              icon: FileCheck2,
            },
            {
              id: 'updates',
              label: `Updates (${projectUpdates.length})`,
              icon: Clock,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#001237] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Project Overview & Summary
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.name} represents a major capital infrastructure asset currently undergoing
                rigorous phased construction and continuous structural assurance. All milestones,
                specifications, and material testing results undergo strict independent engineering
                sign-off prior to publication in stakeholder summaries.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Project Location
                  </span>
                  <p className="text-xs font-semibold text-slate-900">{project.location}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Project Owner / Client
                  </span>
                  <p className="text-xs font-semibold text-slate-900">{project.client}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Current Execution Status
                  </span>
                  <p className="text-xs font-semibold text-emerald-700 capitalize">
                    {project.status.replace('_', ' ')} Phase
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Assurance Governance
                  </span>
                  <p className="text-xs font-semibold text-slate-900">
                    ISO 19650 Quality & Evidence Standard
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Milestones preview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Key Milestones Snapshot
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('milestones')}
                  className="text-xs font-bold text-[#3B68DE] hover:underline"
                >
                  View all ({projectMilestones.length})
                </button>
              </div>

              <div className="space-y-2">
                {projectMilestones.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{m.name}</span>
                      <p className="text-[11px] text-slate-400">Target Date: {m.targetDate}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        m.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : m.status === 'on_schedule'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Quick info cards */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#4FAAA7]" />
                <h3 className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Stakeholder Access Scope
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have authorized read-only visibility for this project. All displayed dates,
                milestones, and reports are official released records. Internal draft notes, raw
                field submittals, and engineer credentials are intentionally hidden.
              </p>
            </div>

            <div className="bg-[#001237] text-white p-5 rounded-2xl shadow-md space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4FAAA7] font-bold">
                Project Assurance Dossier
              </span>
              <h4 className="text-sm font-bold font-['Encode_Sans_Condensed',sans-serif]">
                Latest Released Report
              </h4>
              {projectReports.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-300 font-semibold">{projectReports[0].title}</p>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Released: {projectReports[0].releaseDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedReport(projectReports[0])}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-[#4FAAA7] hover:bg-[#4FAAA7]/90 text-[#001237] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Open Latest Report</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No released reports for this project yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Milestones (Section 8 & 7.5) */}
      {activeTab === 'milestones' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Project Milestones & Deliverables
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized milestone timeline distinguishing target dates from verified completion
              dates.
            </p>
          </div>

          {projectMilestones.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-slate-200 rounded-xl bg-slate-50">
              No visible milestones recorded for this project yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
              {projectMilestones.map((m) => (
                <div
                  key={m.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          m.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : m.status === 'on_schedule'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : m.status === 'past_target_date'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {m.status === 'past_target_date' ? 'Past target date' : m.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{m.projectName}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Target Date</span>
                      <span className="font-semibold text-slate-700">{m.targetDate}</span>
                    </div>
                    {m.completionDate && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Completed On</span>
                        <span className="font-bold text-emerald-700">{m.completionDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reports (Section 8 & 9) */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Released Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official reports that have completed the rigorous sign-off process and are released for
              stakeholder review.
            </p>
          </div>

          {projectReports.length === 0 ? (
            <div className="p-10 text-center space-y-2 border border-slate-200 rounded-xl bg-slate-50">
              <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No reports released yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                When an authorized project team releases a report for this project, it will appear
                here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-[#4FAAA7]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#001237]">
                        {report.reportNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {report.version} &bull; Released
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{report.title}</h4>
                    <p className="text-xs text-slate-500">
                      Period: {report.period} &bull; Released: {report.releaseDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Open Report
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(report)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
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
      )}

      {/* Tab 4: Updates (Section 8 & 7.3) */}
      {activeTab === 'updates' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Published Project Updates
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of information released to your stakeholder workspace.
            </p>
          </div>

          {projectUpdates.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-slate-200 rounded-xl bg-slate-50">
              There are no new project updates to show. New updates will appear here when they are
              released to you.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
              {projectUpdates.map((u) => (
                <div key={u.id} className="p-4 space-y-1.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{u.title}</span>
                    <span className="text-[11px] font-mono text-slate-400">{u.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{u.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001237]/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                    {selectedReport.reportNumber}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedReport.version} &bull; Released Snapshot
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedReport.title}</h4>
                <p className="text-slate-500 mt-0.5">
                  Project: <strong>{selectedReport.projectName}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Reporting Period:</span>
                  <span className="font-bold text-[#001237]">{selectedReport.period}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Release Date:</span>
                  <span className="font-bold text-[#001237]">{selectedReport.releaseDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 block text-xs">
                  Approved Executive Summary:
                </span>
                <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {selectedReport.executiveSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(selectedReport);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Download PDF ({selectedReport.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
