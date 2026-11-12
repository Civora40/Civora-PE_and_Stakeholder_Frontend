'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
  Search,
  TrendingUp,
  FileText,
  Users2,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  FileCheck2,
  Eye,
  Building,
  Plus,
  MapPin,
  Calendar,
  Lock,
} from 'lucide-react';
import { CivoraUser, Project, Submission, Personnel, Report } from '@/types';
import {
  canProjectAcceptFieldSubmissions,
  getProjectStatusBadgeInfo,
  getProjectSubmissionBlockReason,
} from '@/lib/projects/governance';
import {
  DEMO_PROJECTS,
  DEMO_SUBMISSIONS,
  DEMO_PERSONNEL,
  DEMO_REPORTS,
} from '@/lib/mock-data/fixtures';
import { can } from '@/lib/permissions/rbac';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface FolderDefinition {
  id: string;
  name: string;
  code: string;
  sector: string;
  specsReference: string;
  description: string;
  projectIds: string[];
  project: Project;
}

interface ProjectMonitoringFoldersProps {
  user: CivoraUser;
  initialProjects?: Project[];
  initialProjectId?: string;
  initialFolderId?: string;
}

export function ProjectMonitoringFolders({
  user,
  initialProjects,
  initialProjectId,
  initialFolderId,
}: ProjectMonitoringFoldersProps) {
  const canManageProjects = can(user, 'projects:manage');
  const [projects, setProjects] = useState<Project[]>(initialProjects || DEMO_PROJECTS);
  const [submissions, setSubmissions] = useState<Submission[]>(DEMO_SUBMISSIONS);
  const [personnel, setPersonnel] = useState<Personnel[]>(DEMO_PERSONNEL);
  const [reports, setReports] = useState<Report[]>(DEMO_REPORTS);

  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});

    fetch('/api/submissions')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
        }
      })
      .catch(() => {});

    fetch('/api/personnel')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.personnel)) {
          setPersonnel(data.personnel);
        }
      })
      .catch(() => {});

    fetch('/api/reports')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.reports)) {
          setReports(data.reports);
        }
      })
      .catch(() => {});
  }, []);

  // Automatically generate a Project Specification Folder for each created project
  const monitoringFolders = useMemo<FolderDefinition[]>(() => {
    return projects.map((proj) => {
      const specFolder = proj.specificationFolder;
      return {
        id: specFolder?.id || `fld_spec_${proj.id}`,
        name: specFolder?.name || `${proj.name} — Specification Folder`,
        code: specFolder?.code || `${proj.code}-SPEC`,
        sector: specFolder?.sector || proj.projectType || 'Infrastructure & Civil Works',
        specsReference:
          specFolder?.specsReference ||
          proj.specsReference ||
          'Eurocode 2 & FMWH Standard Specifications (C35/45)',
        description:
          specFolder?.description ||
          proj.scopeSummary ||
          proj.description ||
          `Project specification, deliverables, and QA governance folder for ${proj.name} (${proj.code}).`,
        projectIds: [proj.id],
        project: proj,
      };
    });
  }, [projects]);

  // Folder & Project isolation states
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    initialFolderId || null
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    initialProjectId || null
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectTab, setActiveProjectTab] = useState<
    'specs' | 'submissions' | 'personnel' | 'reports'
  >('specs');

  // Filter folders by search query
  const filteredFolders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return monitoringFolders;
    return monitoringFolders.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.sector.toLowerCase().includes(q) ||
        f.specsReference.toLowerCase().includes(q) ||
        f.project.name.toLowerCase().includes(q) ||
        f.project.code.toLowerCase().includes(q) ||
        f.project.client.toLowerCase().includes(q) ||
        f.project.location.toLowerCase().includes(q)
    );
  }, [monitoringFolders, searchQuery]);

  // Currently active folder object
  const activeFolder = useMemo(() => {
    if (selectedFolderId) {
      const found = monitoringFolders.find((f) => f.id === selectedFolderId);
      if (found) return found;
    }
    if (selectedProjectId) {
      return monitoringFolders.find((f) => f.projectIds.includes(selectedProjectId)) || null;
    }
    return null;
  }, [monitoringFolders, selectedFolderId, selectedProjectId]);

  // Currently active project object (when isolated)
  const activeProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  // Submissions strictly scoped to the active project
  const projectSubmissions = useMemo(() => {
    if (!activeProject) return [];
    return submissions.filter(
      (s) => s.projectId === activeProject.id || s.projectId === activeProject.code
    );
  }, [activeProject, submissions]);

  // Personnel strictly assigned to the active project
  const projectPersonnel = useMemo(() => {
    if (!activeProject) return [];
    return personnel.filter(
      (p) =>
        p.assignedProjects.includes(activeProject.id) ||
        p.assignedProjects.includes(activeProject.code) ||
        p.assignedProjects.includes('*')
    );
  }, [activeProject, personnel]);

  // Reports strictly associated with the active project
  const projectReports = useMemo(() => {
    if (!activeProject) return [];
    return reports.filter(
      (r) => r.projectId === activeProject.id || r.projectId === activeProject.code
    );
  }, [activeProject, reports]);

  // Select project and isolate details
  const handleSelectProject = (projectId: string, folderId?: string) => {
    if (folderId) setSelectedFolderId(folderId);
    setSelectedProjectId(projectId);
    setActiveProjectTab('specs');
  };

  // Back to folder view
  const handleBackToFolder = () => {
    setSelectedProjectId(null);
  };

  // Back to root folders list
  const handleBackToRoot = () => {
    setSelectedProjectId(null);
    setSelectedFolderId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Trail */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-2 text-xs text-slate-500 py-1"
      >
        <button
          type="button"
          onClick={handleBackToRoot}
          className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer ${
            !selectedFolderId && !selectedProjectId ? 'text-[#001237] font-semibold' : ''
          }`}
        >
          <Folder className="w-3.5 h-3.5 text-[#4FAAA7]" />
          <span>Project Specification Folders</span>
        </button>

        {activeFolder && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              type="button"
              onClick={handleBackToFolder}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${
                !selectedProjectId ? 'text-[#001237] font-semibold' : ''
              }`}
            >
              <span>{activeFolder.name}</span>
            </button>
          </>
        )}

        {activeProject && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[#3B68DE] font-semibold font-mono truncate max-w-xs sm:max-w-sm">
              {activeProject.code} ({activeProject.name})
            </span>
          </>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* SCENARIO 1: ISOLATED PROJECT DETAILS & SPECIFICATION DOSSIER             */}
      {/* ========================================================================= */}
      {activeProject ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Project Header Bar */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  onClick={activeFolder ? handleBackToFolder : handleBackToRoot}
                  className="text-xs shrink-0 mt-0.5"
                >
                  {activeFolder ? 'Back to Folder' : 'All Specification Folders'}
                </Button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#001237] px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {activeProject.code}
                    </span>
                    <Badge
                      variant={activeProject.status === 'active' ? 'teal' : 'slate'}
                      size="sm"
                    >
                      {activeProject.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {activeProject.projectType || 'Project Specification & Monitoring View'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide mt-1">
                    {activeProject.name}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{activeProject.location}</span>
                    <span className="text-slate-300">•</span>
                    <span>
                      Client:{' '}
                      <strong className="text-slate-800 font-semibold">
                        {activeProject.client}
                      </strong>
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 text-right shrink-0">
                <span className="text-[11px] text-slate-500">Authorized Program Budget</span>
                <span className="text-xl font-black font-mono text-slate-900">
                  {activeProject.budgetFormatted}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {activeProject.progressPercent}% Certified Progress
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar for this project only */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Lead Engineer</span>
                <span className="text-xs font-bold text-slate-900 block truncate mt-0.5">
                  {activeProject.leadEngineer}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Field Submissions</span>
                <span className="text-xs font-bold text-[#001237] font-mono block mt-0.5">
                  {projectSubmissions.length || activeProject.submissionsCount} submittals
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Assigned Personnel</span>
                <span className="text-xs font-bold text-slate-900 font-mono block mt-0.5">
                  {projectPersonnel.length} verified site agents
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Inspection Reports</span>
                <span className="text-xs font-bold text-[#3B68DE] font-mono block mt-0.5">
                  {projectReports.length || activeProject.reportsCount} releases
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for this single project */}
          <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'specs', label: 'Technical Specifications & Governance', icon: Layers },
              {
                id: 'submissions',
                label: `Field Submissions (${projectSubmissions.length})`,
                icon: FileText,
              },
              {
                id: 'personnel',
                label: `Assigned Personnel (${projectPersonnel.length})`,
                icon: Users2,
              },
              {
                id: 'reports',
                label: `Quality & Inspection Reports (${projectReports.length})`,
                icon: FileCheck2,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeProjectTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveProjectTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#001237] text-[#001237]'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Technical Specifications & Governance */}
          {activeProjectTab === 'specs' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#4FAAA7]" />
                    Project Specification & Governance Code
                  </h3>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500 shrink-0">Specification Folder Code:</span>
                      <span className="text-[#001237] font-mono font-bold">
                        {activeProject.specificationFolder?.code || `${activeProject.code}-SPEC`}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500 shrink-0">Governing Standard:</span>
                      <span className="text-slate-900 font-mono font-semibold text-right">
                        {activeProject.specsReference}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500 shrink-0">Infrastructure Category:</span>
                      <span className="text-slate-900 font-medium text-right">
                        {activeProject.projectType || 'Civil Infrastructure'}
                      </span>
                    </div>
                    {activeProject.contractRef && (
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500 shrink-0">Contract Reference:</span>
                        <span className="text-slate-900 font-mono text-right">
                          {activeProject.contractRef}
                        </span>
                      </div>
                    )}
                    {activeProject.contractor && (
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500 shrink-0">EPC / Main Contractor:</span>
                        <span className="text-slate-900 font-medium text-right">
                          {activeProject.contractor}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500 shrink-0">Reporting Cadence:</span>
                      <span className="text-emerald-700 font-mono font-bold uppercase">
                        {activeProject.reportingCadence || 'Daily'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500 shrink-0">QA Verification Rules:</span>
                      <span className="text-slate-900 font-mono text-right">
                        {activeProject.requireLabBreakCert !== false ? 'Lab Cert Required' : 'Standard'}
                        {activeProject.requireGeotaggedPhotos !== false ? ' • GPS Geotag' : ''}
                      </span>
                    </div>
                  </div>

                  {(activeProject.scopeSummary || activeProject.description) && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-semibold text-slate-800 block">
                        Project Scope & Technical Summary
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {activeProject.scopeSummary || activeProject.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#3B68DE]" />
                    Specification Deliverables & Milestones
                  </h3>

                  {activeProject.deliverables && activeProject.deliverables.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Key Engineering Deliverables ({activeProject.deliverables.length})
                      </span>
                      <div className="space-y-1.5">
                        {activeProject.deliverables.map((deliv, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2 text-slate-800"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAAA7] shrink-0" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeProject.milestonesList && activeProject.milestonesList.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Configured Milestones ({activeProject.milestonesList.length})
                      </span>
                      <div className="space-y-1.5">
                        {activeProject.milestonesList.map((ms) => (
                          <div
                            key={ms.id}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2"
                          >
                            <span className="font-medium text-slate-800">{ms.title}</span>
                            {ms.targetDate && (
                              <span className="text-[11px] font-mono text-slate-500 shrink-0">
                                {ms.targetDate}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-700 font-medium">Overall Certified Completion</span>
                          <span className="text-[#3B68DE] font-mono font-bold">
                            {activeProject.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#3B68DE] h-full rounded-full"
                            style={{ width: `${activeProject.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeProject.governanceNotes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                      <strong className="text-slate-800 block mb-0.5">Governance Directives:</strong>
                      {activeProject.governanceNotes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Field Submissions (Only for this project) */}
          {activeProjectTab === 'submissions' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                    Live Pour Cards & Test Break Submittals
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Field submissions strictly recorded under {activeProject.code}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#001237] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  {projectSubmissions.length} Registered Submissions
                </span>
              </div>

              {!canProjectAcceptFieldSubmissions(activeProject) && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Field Submissions Locked</span>
                      <span className="text-[11px] opacity-90">
                        {getProjectSubmissionBlockReason(activeProject)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/projects/${activeProject.id}`}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-[#001237] text-white text-[11px] font-bold hover:bg-[#18243D] transition-colors"
                  >
                    Manage Approval
                  </Link>
                </div>
              )}

              {projectSubmissions.length === 0 ? (
                <div className="rounded-2xl bg-white border border-slate-200/80 p-10 text-center text-slate-500 text-xs shadow-xs">
                  No submissions recorded for {activeProject.code} yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {projectSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#001237] font-bold">
                            {sub.identifier}
                          </span>
                          <Badge
                            variant={
                              sub.reviewStatus === 'approved'
                                ? 'teal'
                                : sub.reviewStatus === 'pending_review'
                                ? 'blue'
                                : 'slate'
                            }
                            size="sm"
                          >
                            {sub.reviewStatus.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-[11px] text-slate-400">{sub.receivedDate}</span>
                        </div>
                        <p className="text-slate-900 font-semibold">{sub.title}</p>
                        <p className="text-slate-500 text-[11px]">
                          Submitter:{' '}
                          <span className="text-slate-800 font-medium">
                            {sub.senderName || sub.submittedBy}
                          </span>{' '}
                          ({sub.senderRole || 'Site Personnel'}) • Channel:{' '}
                          <span className="uppercase text-slate-700 font-mono font-semibold">
                            {sub.sourceChannel || 'portal'}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/dashboard/submissions?submissionId=${sub.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors text-xs font-medium flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#4FAAA7]" />
                          <span>View Submittal</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Assigned Personnel (Only for this project) */}
          {activeProjectTab === 'personnel' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Verified Site Personnel Roster
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Engineers, lab analysts, and site agents authorized to submit logs for{' '}
                  {activeProject.name}
                </p>
              </div>

              {projectPersonnel.length === 0 ? (
                <div className="rounded-2xl bg-white border border-slate-200/80 p-10 text-center text-slate-500 text-xs shadow-xs">
                  No site personnel assigned to {activeProject.code} yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projectPersonnel.map((person) => (
                    <div
                      key={person.id}
                      className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{person.fullName}</span>
                        <Badge variant="teal" size="sm">
                          {person.verificationStatus.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-[11px]">{person.professionalTitle}</p>
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Department:</span>
                          <span className="text-slate-800 font-medium">{person.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cadence:</span>
                          <span className="text-slate-800 uppercase font-medium">
                            {person.expectedReportingCadence}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Quality & Inspection Reports (Only for this project) */}
          {activeProjectTab === 'reports' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Quality Assurance Releases & Verification Dossiers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Formal inspection releases published specifically for {activeProject.code}
                </p>
              </div>

              {projectReports.length === 0 ? (
                <div className="rounded-2xl bg-white border border-slate-200/80 p-10 text-center text-slate-500 text-xs shadow-xs">
                  No inspection dossiers filed under this project yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {projectReports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#001237] font-bold">
                            {report.reportNumber}
                          </span>
                          <Badge
                            variant={
                              report.status === 'released' || report.status === 'approved'
                                ? 'teal'
                                : 'slate'
                            }
                            size="sm"
                          >
                            {report.status.toUpperCase()}
                          </Badge>
                          <span className="text-[11px] text-slate-400">
                            {report.releasedAt || report.period}
                          </span>
                        </div>
                        <h4 className="text-slate-900 font-semibold mt-0.5">{report.title}</h4>
                        <p className="text-slate-500 text-[11px]">
                          Lead Sign-Off: {report.approvedBy || report.generatedBy}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/dashboard/reports?reportId=${report.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors text-xs font-medium flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#3B68DE]" />
                          <span>View Report</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : activeFolder ? (
        /* ========================================================================= */
        /* SCENARIO 2: INSIDE A SPECIFIC PROJECT SPECIFICATION FOLDER                */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={handleBackToRoot}
                    className="text-xs"
                  >
                    All Folders
                  </Button>
                  <span className="font-mono text-xs text-[#001237] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {activeFolder.code}
                  </span>
                  <Badge variant="blue" size="sm">
                    {activeFolder.sector}
                  </Badge>
                </div>
                <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide mt-1">
                  {activeFolder.name}
                </h1>
                <p className="text-xs text-slate-500 max-w-2xl">{activeFolder.description}</p>
                <p className="text-[11px] font-mono text-[#3B68DE] pt-1">
                  Governing Specification: {activeFolder.specsReference}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-500 block">Project Code</span>
                <span className="text-xl font-black font-mono text-slate-900">
                  {activeFolder.project.code}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Select the project below to open its full specification and monitoring workspace:</span>
              <span className="font-medium text-slate-700">
                {activeFolder.projectIds.length} Project Specification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects
                .filter((p) => activeFolder.projectIds.includes(p.id))
                .map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleSelectProject(project.id, activeFolder.id)}
                    className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs hover:border-[#4FAAA7]/60 hover:shadow-md transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#001237] group-hover:text-[#3B68DE] transition-colors">
                            {project.code}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#3B68DE] transition-colors mt-0.5">
                            {project.name}
                          </h3>
                        </div>
                        <Badge
                          variant={getProjectStatusBadgeInfo(project).variant}
                          size="sm"
                        >
                          {getProjectStatusBadgeInfo(project).label}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{project.location}</span>
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] font-mono text-slate-700">
                        {project.specsReference}
                      </div>

                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Budget</span>
                          <span className="text-slate-900 font-mono font-bold">
                            {project.budgetFormatted}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Submissions</span>
                          <span className="text-slate-900 font-mono font-bold">
                            {project.submissionsCount} submittals
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Completion</span>
                        <span className="text-slate-900 font-mono font-bold">
                          {project.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#3B68DE] to-[#4FAAA7] h-full rounded-full"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                      <div className="pt-1 flex items-center justify-end text-xs text-[#3B68DE] font-semibold group-hover:translate-x-0.5 transition-transform">
                        <span>Open Project Specification Details →</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SCENARIO 3: ROOT PROJECT SPECIFICATION FOLDERS DIRECTORY                  */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  All Monitored Projects
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#001237] text-[#4FAAA7]">
                  {monitoringFolders.length} Specification Folder{monitoringFolders.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Every created project automatically provisions a dedicated specification folder containing its governing standards, deliverables, and QA submittals.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Quick Search */}
              <div className="relative flex-1 sm:w-72">
                <Search className="pointer-events-none absolute inset-y-0 left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search project or spec folder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4FAAA7]"
                />
              </div>

              {canManageProjects && (
                <Button
                  href="/dashboard/projects/new"
                  variant="teal"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="shrink-0"
                >
                  New Project
                </Button>
              )}
            </div>
          </div>

          {/* Principle / Notice Box */}
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#4FAAA7] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-semibold block">
                Automated Project Specification Folders:
              </strong>
              <span className="text-[11px] text-slate-600">
                When an engineer creates a new project, Civora automatically generates its dedicated specification folder below. Click any folder to inspect its governing standard, deliverables, and field submissions.
              </span>
            </div>
          </div>

          {/* Quick Stats Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Project Specification Folders</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {monitoringFolders.length} {monitoringFolders.length === 1 ? 'Folder' : 'Folders'}
              </div>
              <p className="text-[11px] text-[#3B68DE] font-medium">
                Auto-provisioned per project specification
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Monitored Projects</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {projects.length} {projects.length === 1 ? 'Program' : 'Programs'}
              </div>
              <p className="text-[11px] text-slate-500">Registered in QA database</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Active Specifications</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {projects.filter((p) => p.status === 'active').length} Active
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">
                Active FMWH / COREN oversight
              </p>
            </div>
          </div>

          {/* Empty State if no projects have been created yet */}
          {monitoringFolders.length === 0 ? (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
              <FolderOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  No Project Specification Folders Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  There are currently no projects in this workspace. Create a new project and Civora will automatically generate its dedicated Project Specification Folder here.
                </p>
              </div>
              {canManageProjects && (
                <div className="pt-1">
                  <Button
                    href="/dashboard/projects/new"
                    variant="teal"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Create First Project
                  </Button>
                </div>
              )}
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-10 text-center space-y-3 shadow-xs">
              <Folder className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">
                No Specification Folders Match &ldquo;{searchQuery}&rdquo;
              </h3>
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            /* Folders Grid */
            <div className="space-y-4">
              <h2 className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-500">
                Project Specification Folders ({filteredFolders.length})
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {filteredFolders.map((folder) => {
                  const proj = folder.project;
                  return (
                    <div
                      key={folder.id}
                      className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-[#4FAAA7]/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#4FAAA7] group-hover:scale-105 transition-transform">
                            <Folder className="w-5 h-5" />
                          </div>
                          <Badge variant="teal" size="sm">
                            {folder.code}
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#3B68DE] transition-colors">
                            {folder.name}
                          </h3>
                          <p className="text-[11px] font-semibold text-[#3B68DE] uppercase tracking-wider mt-0.5">
                            {folder.sector}
                          </p>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                            {folder.description}
                          </p>
                        </div>

                        {/* Governing Specification Badge */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                            Governing Specification:
                          </span>
                          <span className="font-mono text-slate-800 font-medium block truncate">
                            {folder.specsReference}
                          </span>
                        </div>

                        {/* Contained Project Entry */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                            Monitored Project ({proj.code}):
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectProject(proj.id, folder.id)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between text-xs cursor-pointer"
                          >
                            <div className="truncate pr-2">
                              <span className="text-slate-900 font-semibold block truncate">
                                {proj.name}
                              </span>
                              <span className="text-[11px] text-slate-500 block truncate">
                                {proj.client} • {proj.location}
                              </span>
                            </div>
                            <span className="font-mono text-[#001237] font-bold text-[11px] shrink-0">
                              {proj.progressPercent}%
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Certified Progress</span>
                          <span className="text-slate-900 font-mono font-bold">
                            {proj.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#3B68DE] to-[#4FAAA7] h-full rounded-full"
                            style={{ width: `${proj.progressPercent}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFolderId(folder.id)}
                            className="w-full justify-center text-xs"
                          >
                            Open Folder
                          </Button>
                          <Button
                            variant="teal"
                            size="sm"
                            onClick={() => handleSelectProject(proj.id, folder.id)}
                            className="w-full justify-center text-xs"
                          >
                            Inspect Spec
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
