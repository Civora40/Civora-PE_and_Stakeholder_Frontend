'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
  RefreshCw,
  Activity,
  History,
  Check,
  ChevronDown,
  Lock,
  Send,
  XCircle,
  MessageSquarePlus,
} from 'lucide-react';
import { CivoraUser, Project, ProjectActivity, ProjectDepartment, ProjectStatus } from '@/types';
import {
  resolveApprovalStatus,
  isProjectAdminApproved,
  canProjectAcceptFieldSubmissions,
  getProjectSubmissionBlockReason,
} from '@/lib/projects/governance';
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
  initialTab?: 'overview' | 'disciplines' | 'wbs' | 'history' | 'milestones' | 'reports' | 'updates';
}

const ALLOWED_PROJECT_TRANSITIONS: Record<string, string[]> = {
  draft: ['setup', 'archived'],
  pending_approval: ['draft', 'archived'],
  setup: ['active', 'on_hold', 'archived'],
  active: ['on_hold', 'completed'],
  on_hold: ['active', 'archived'],
  completed: ['archived'],
  rejected: ['draft', 'archived'],
  archived: [],
  planning: ['setup', 'active', 'on_hold', 'archived'],
  in_review: ['active', 'completed', 'on_hold'],
};

export function ProjectDetailView({
  user,
  project: initialProject,
  initialTab = 'overview',
}: ProjectDetailViewProps) {
  const [project, setProject] = useState<Project>(initialProject);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'disciplines' | 'wbs' | 'history' | 'milestones' | 'reports' | 'updates'
  >(initialTab);

  // Departments & Activities state
  const [departments, setDepartments] = useState<ProjectDepartment[]>(initialProject.departments || []);
  const [activities, setActivities] = useState<ProjectActivity[]>(initialProject.activities || []);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Status Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [selectedTargetStatus, setSelectedTargetStatus] = useState<string>('');
  const [transitionReason, setTransitionReason] = useState<string>('');
  const [transitionError, setTransitionError] = useState<string | null>(null);

  // Admin Approval Submission state
  const [isSubmittingForApproval, setIsSubmittingForApproval] = useState(false);

  // Quick Field Submission modal state (gated until Admin approval + active)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [subTitle, setSubTitle] = useState('');
  const [subDescription, setSubDescription] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [subChannel, setSubChannel] = useState<'portal' | 'whatsapp' | 'telegram'>('portal');
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  // New Department modal state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [isCreatingDept, setIsCreatingDept] = useState(false);
  const [deptError, setDeptError] = useState<string | null>(null);

  // New WBS Activity modal state
  const [showActModal, setShowActModal] = useState(false);
  const [newActCode, setNewActCode] = useState('');
  const [newActName, setNewActName] = useState('');
  const [newActWbs, setNewActWbs] = useState('');
  const [newActZone, setNewActZone] = useState('');
  const [newActDeptId, setNewActDeptId] = useState('');
  const [isCreatingAct, setIsCreatingAct] = useState(false);
  const [actError, setActError] = useState<string | null>(null);

  // Stakeholder milestones, reports, updates
  const projectMilestones = STAKEHOLDER_MILESTONES.filter((m) => m.projectId === project.id);
  const projectReports = STAKEHOLDER_RELEASED_REPORTS.filter((r) => r.projectId === project.id);
  const projectUpdates = STAKEHOLDER_UPDATES.filter((u) => u.projectId === project.id);

  // Report Modal / Download state
  const [selectedReport, setSelectedReport] = useState<StakeholderReleasedReport | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const handleDownload = (report: StakeholderReleasedReport) => {
    showToast(`Downloading ${report.reportNumber} (${report.fileSize})...`);
  };

  // Fetch departments & activities on mount
  useEffect(() => {
    async function loadProjectDetails() {
      try {
        const [deptRes, actRes] = await Promise.all([
          fetch(`/api/projects/${project.id}/departments`),
          fetch(`/api/projects/${project.id}/activities`),
        ]);
        if (deptRes.ok) {
          const dData = await deptRes.json();
          if (Array.isArray(dData.departments)) {
            setDepartments(dData.departments);
          }
        }
        if (actRes.ok) {
          const aData = await actRes.json();
          if (Array.isArray(aData.activities)) {
            setActivities(aData.activities);
          }
        }
      } catch {
        // Fall back to initial props
      }
    }
    loadProjectDetails();
  }, [project.id]);

  // Fetch history when tab is clicked
  useEffect(() => {
    if (activeTab === 'history') {
      setIsLoadingHistory(true);
      fetch(`/api/projects/${project.id}/activity-history`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.history)) {
            setActivityHistory(data.history);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingHistory(false));
    }
  }, [activeTab, project.id]);

  // Handle Lifecycle Status Transition
  const handleExecuteTransition = async () => {
    if (!selectedTargetStatus) return;
    setIsTransitioning(true);
    setTransitionError(null);

    try {
      const res = await fetch(`/api/projects/${project.id}/transition-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedTargetStatus,
          reason: transitionReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to transition status');
      }

      setProject((prev) => ({
        ...prev,
        ...(data.project || {}),
        status: (data.project?.status || selectedTargetStatus) as ProjectStatus,
      }));
      setShowTransitionModal(false);
      setTransitionReason('');
      showToast(`Project status transitioned to '${selectedTargetStatus}'`);
    } catch (err: any) {
      setTransitionError(err.message || 'Status transition rejected.');
    } finally {
      setIsTransitioning(false);
    }
  };

  // Handle Engineer Submission for Platform Administrator Approval
  const handleSubmitForApproval = async () => {
    setIsSubmittingForApproval(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/submit-for-approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: 'Submitted from Project Workspace for Platform Administrator review.',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit project for approval.');
      }
      setProject((prev) => ({
        ...prev,
        ...(data.project || {}),
        status: 'pending_approval',
        approvalStatus: 'pending_review',
      }));
      showToast('Project submitted to Platform Administrator for review and approval.');
    } catch (err: any) {
      showToast(err.message || 'Could not submit project for approval.');
    } finally {
      setIsSubmittingForApproval(false);
    }
  };

  // Handle Logging a Field Submission (only unlocked after Admin approval)
  const handleCreateFieldSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTitle.trim()) return;
    setIsSubmittingLog(true);
    setSubError(null);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: subTitle.trim(),
          description: subDescription.trim(),
          location: subLocation.trim() || project.location,
          sourceChannel: subChannel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Field submission rejected.');
      }
      setProject((prev) => ({
        ...prev,
        submissionsCount: (prev.submissionsCount || 0) + 1,
        pendingReviewsCount: (prev.pendingReviewsCount || 0) + 1,
      }));
      setShowSubmissionModal(false);
      setSubTitle('');
      setSubDescription('');
      setSubLocation('');
      showToast('Field submission recorded and queued for QA verification.');
    } catch (err: any) {
      setSubError(err.message || 'Failed to record field submission.');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Handle Create Department
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) return;

    setIsCreatingDept(true);
    setDeptError(null);

    try {
      const res = await fetch(`/api/projects/${project.id}/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDeptName.trim(),
          code: newDeptCode.trim().toUpperCase(),
          description: newDeptDesc.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create department');
      }

      setDepartments((prev) => [...prev, data.department]);
      setShowDeptModal(false);
      setNewDeptName('');
      setNewDeptCode('');
      setNewDeptDesc('');
      showToast(`Discipline '${data.department.code}' added.`);
    } catch (err: any) {
      setDeptError(err.message || 'Failed to create department');
    } finally {
      setIsCreatingDept(false);
    }
  };

  // Handle Create WBS Activity
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActCode.trim() || !newActName.trim()) return;

    setIsCreatingAct(true);
    setActError(null);

    try {
      const res = await fetch(`/api/projects/${project.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newActCode.trim().toUpperCase(),
          name: newActName.trim(),
          wbsReference: newActWbs.trim(),
          locationZone: newActZone.trim(),
          departmentId: newActDeptId || undefined,
          status: 'planned',
          progressPercent: 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create activity');
      }

      setActivities((prev) => [...prev, data.activity]);
      setShowActModal(false);
      setNewActCode('');
      setNewActName('');
      setNewActWbs('');
      setNewActZone('');
      setNewActDeptId('');
      showToast(`WBS Activity '${data.activity.code}' created.`);
    } catch (err: any) {
      setActError(err.message || 'Failed to create activity');
    } finally {
      setIsCreatingAct(false);
    }
  };

  // Handle Quick Activity Progress Update
  const handleUpdateActivityProgress = async (actId: string, nextStatus: 'in_progress' | 'completed', percent: number) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/activities/${actId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, progressPercent: percent }),
      });
      if (res.ok) {
        setActivities((prev) =>
          prev.map((a) => (a.id === actId ? { ...a, status: nextStatus, progressPercent: percent } : a))
        );
        showToast(`Activity updated to ${nextStatus} (${percent}%)`);
      }
    } catch {
      showToast('Failed to update activity.');
    }
  };

  const isStakeholder = user.role === 'read_only_stakeholder';
  const isPlatformAdmin = user.role === 'platform_admin';
  const approvalStatus = resolveApprovalStatus(project);
  const adminApproved = isProjectAdminApproved(project);
  const canAcceptSubmissions = canProjectAcceptFieldSubmissions(project);
  const submissionBlockReason = getProjectSubmissionBlockReason(project);

  const rawAllowedTransitions = ALLOWED_PROJECT_TRANSITIONS[project.status] || [];
  const allowedTransitions =
    !isPlatformAdmin && !adminApproved
      ? rawAllowedTransitions.filter((st) => st !== 'active')
      : rawAllowedTransitions;

  const lastUpdate = projectUpdates.length > 0 ? projectUpdates[0].timestamp : 'Just now';

  // Status badge coloring
  const getStatusBadgeStyle = (st: string) => {
    switch (st) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending_approval':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-300';
      case 'setup':
      case 'planning':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'on_hold':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'archived':
        return 'bg-slate-200 text-slate-800 border-slate-400';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getApprovalBadgeStyle = () => {
    switch (approvalStatus) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'changes_requested':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-300';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#4FAAA7]" />
          <span>{toastNotice}</span>
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

      {/* Header with Project Lifecycle State Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#4FAAA7] bg-[#001237] px-2 py-0.5 rounded">
                {project.code}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(
                  project.status
                )}`}
              >
                {project.status.replace(/_/g, ' ')}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getApprovalBadgeStyle()}`}
              >
                {approvalStatus === 'approved'
                  ? 'ADMIN APPROVED'
                  : approvalStatus === 'changes_requested'
                  ? 'CHANGES REQUESTED'
                  : approvalStatus === 'rejected'
                  ? 'REJECTED BY ADMIN'
                  : 'PENDING ADMIN REVIEW'}
              </span>

              {/* Status Transition Button for Engineers/Admins */}
              {!isStakeholder && allowedTransitions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTargetStatus(allowedTransitions[0]);
                    setShowTransitionModal(true);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[10px] font-bold text-[#001237] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Transition Status</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}

              {/* Submit for Admin Approval Button for Engineers when Draft/Setup/Rejected/Changes Requested */}
              {!isStakeholder && !adminApproved && project.status !== 'pending_approval' && (
                <button
                  type="button"
                  disabled={isSubmittingForApproval}
                  onClick={handleSubmitForApproval}
                  className="px-3 py-0.5 rounded-full bg-[#001237] hover:bg-[#18243D] text-white text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3 h-3 text-[#4FAAA7]" />
                  <span>
                    {isSubmittingForApproval
                      ? 'Submitting...'
                      : approvalStatus === 'changes_requested' || approvalStatus === 'rejected'
                      ? 'Resubmit for Admin Approval'
                      : 'Submit for Admin Approval'}
                  </span>
                </button>
              )}

              {/* Log Field Submission CTA (Locked until Admin Approval) */}
              {!isStakeholder && (
                <button
                  type="button"
                  disabled={!canAcceptSubmissions}
                  title={submissionBlockReason || 'Log verified site/field submission'}
                  onClick={() => {
                    setSubError(null);
                    setShowSubmissionModal(true);
                  }}
                  className={`px-3 py-0.5 rounded-full text-[10px] font-bold transition-colors flex items-center gap-1 ${
                    canAcceptSubmissions
                      ? 'bg-[#4FAAA7] hover:bg-[#3e8e8b] text-[#001237] cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  {canAcceptSubmissions ? (
                    <MessageSquarePlus className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                  <span>{canAcceptSubmissions ? 'Log Field Submission' : 'Field Submissions Locked'}</span>
                </button>
              )}
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

        {/* Platform Administrator Approval & Field Submission Governance Banner */}
        {!canAcceptSubmissions ? (
          <div
            className={`rounded-xl p-3.5 border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              approvalStatus === 'rejected' || project.status === 'rejected'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {approvalStatus === 'rejected' || project.status === 'rejected' ? (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold block">
                  {approvalStatus === 'rejected' || project.status === 'rejected'
                    ? 'Project Rejected — Field Submissions Locked'
                    : approvalStatus === 'changes_requested'
                    ? 'Administrator Requested Changes Before Approval'
                    : adminApproved
                    ? `Project Status '${project.status}' — Field Submissions Paused`
                    : 'Awaiting Platform Administrator Review & Approval'}
                </span>
                <p className="text-[11px] opacity-90">
                  {submissionBlockReason ||
                    'Field submissions cannot begin until a Platform Administrator reviews and approves this project.'}
                </p>
                {project.reviewNotes && (
                  <p className="text-[11px] font-medium pt-1">
                    Admin Feedback: <span className="underline">{project.reviewNotes}</span>
                  </p>
                )}
              </div>
            </div>
            {!isStakeholder && !adminApproved && project.status !== 'pending_approval' && (
              <button
                type="button"
                disabled={isSubmittingForApproval}
                onClick={handleSubmitForApproval}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>
                  {isSubmittingForApproval ? 'Submitting...' : 'Submit for Admin Approval'}
                </span>
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl p-3 bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Admin Approved:</strong> Field submissions are unlocked
                {project.reviewedByName ? ` (reviewed by ${project.reviewedByName})` : ''}.
              </span>
            </div>
            {!isStakeholder && (
              <button
                type="button"
                onClick={() => {
                  setSubError(null);
                  setShowSubmissionModal(true);
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>New Field Submission</span>
              </button>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Briefcase },
            { id: 'disciplines', label: `Disciplines (${departments.length})`, icon: Layers },
            { id: 'wbs', label: `WBS Activities (${activities.length})`, icon: Activity },
            { id: 'history', label: 'Project History', icon: History },
            { id: 'milestones', label: `Milestones (${projectMilestones.length})`, icon: CheckCircle2 },
            { id: 'reports', label: `Released Reports (${projectReports.length})`, icon: FileCheck2 },
            { id: 'updates', label: `Updates (${projectUpdates.length})`, icon: Clock },
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
                Project Overview & Governance Summary
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.description ||
                  `${project.name} represents a major capital infrastructure asset currently undergoing rigorous phased construction and continuous structural assurance under Civora multi-tenant governance.`}
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
                    Contract Budget
                  </span>
                  <p className="text-xs font-semibold text-[#001237] font-mono">
                    {project.budgetFormatted || '₦0'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Permit / LASBCA Ref
                  </span>
                  <p className="text-xs font-semibold text-slate-900 font-mono">
                    {project.lasbcaPermitNumber || 'Permit Verified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Specification Folder Card */}
            {project.specificationFolder && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#4FAAA7]" />
                    <h3 className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                      Specification Folder: {project.specificationFolder.code}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {project.specificationFolder.sector}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {project.specificationFolder.description}
                </p>
                <div className="text-[11px] font-mono text-slate-500 pt-1">
                  Standard: <strong>{project.specificationFolder.specsReference}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Right column: Quick info cards */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#4FAAA7]" />
                <h3 className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Project Governance & Lifecycle
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Project state is strictly controlled: <code className="text-slate-800 font-mono">Draft → Setup → Active → On Hold → Completed → Archived</code>.
                Arbitrary transitions are rejected by server-side state machine business rules.
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 block text-[10px]">Lead Engineer:</span>
                <span className="font-semibold text-slate-800">{project.leadEngineer}</span>
              </div>
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

      {/* Tab: Disciplines & Departments */}
      {activeTab === 'disciplines' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Engineering Disciplines & Departments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specialized professional disciplines and functional departments configured for {project.code}.
              </p>
            </div>
            {!isStakeholder && (
              <button
                type="button"
                onClick={() => setShowDeptModal(true)}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Add Discipline</span>
              </button>
            )}
          </div>

          {departments.length === 0 ? (
            <div className="p-10 text-center space-y-2 border border-slate-200 rounded-xl bg-slate-50">
              <Layers className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No departments configured yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Add specialized disciplines (e.g. Highway, Geotechnical, QA/QC, MEP) to organize activities and field submissions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-[#4FAAA7]/50 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#001237] bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {d.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Active Discipline'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                  {d.description && <p className="text-xs text-slate-500 leading-relaxed">{d.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: WBS Activities */}
      {activeTab === 'wbs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Work Breakdown Structure (WBS) Activities
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical construction packages, task execution baselines, and certified progress milestones.
              </p>
            </div>
            {!isStakeholder && (
              <button
                type="button"
                onClick={() => setShowActModal(true)}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Add WBS Activity</span>
              </button>
            )}
          </div>

          {activities.length === 0 ? (
            <div className="p-10 text-center space-y-2 border border-slate-200 rounded-xl bg-slate-50">
              <Activity className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No WBS activities initialized</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Create structured construction packages to link field submissions and monitor completion.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-[#4FAAA7]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#001237] bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {a.code}
                      </span>
                      {a.wbsReference && (
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {a.wbsReference}
                        </span>
                      )}
                      {a.departmentCode && (
                        <span className="font-mono text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {a.departmentCode}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          a.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : a.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {a.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{a.name}</h4>
                    {a.locationZone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        Zone: {a.locationZone}
                      </p>
                    )}
                  </div>

                  {/* Progress & Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-32 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-bold text-[#001237]">{a.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[#4FAAA7] rounded-full"
                          style={{ width: `${a.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {!isStakeholder && a.status !== 'completed' && (
                      <div className="flex items-center gap-1">
                        {a.status === 'planned' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateActivityProgress(a.id, 'in_progress', 50)}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                          >
                            Start
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleUpdateActivityProgress(a.id, 'completed', 100)}
                          className="px-2.5 py-1 rounded-lg bg-[#001237] hover:bg-[#18243D] text-[11px] font-semibold text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Complete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Project History & Audit Timeline */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Immutable Project Activity History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only audit trail recording status transitions, discipline additions, member assignments, and governance events.
            </p>
          </div>

          {isLoadingHistory ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading audit trail...</div>
          ) : activityHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-slate-200 rounded-xl bg-slate-50">
              No audit log entries recorded for this project yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
              {activityHistory.map((item, idx) => (
                <div key={item.id || idx} className="p-4 space-y-1.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {item.action}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        by <strong className="text-slate-800">{item.actorEmail || item.actor_email}</strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description || JSON.stringify(item.metadata || {})}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Project Milestones & Deliverables
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized milestone timeline distinguishing target dates from verified completion dates.
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
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
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

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Released Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official reports that have completed the rigorous sign-off process and are released for stakeholder review.
            </p>
          </div>

          {projectReports.length === 0 ? (
            <div className="p-10 text-center space-y-2 border border-slate-200 rounded-xl bg-slate-50">
              <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No reports released yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                When an authorized project team releases a report for this project, it will appear here.
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

      {/* Tab: Updates */}
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
              There are no new project updates to show. New updates will appear here when they are released to you.
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

      {/* Status Transition Modal */}
      {showTransitionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001237]/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                Transition Project Lifecycle
              </h3>
              <button
                type="button"
                onClick={() => setShowTransitionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {transitionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{transitionError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Status</label>
                <span className="font-mono font-bold text-slate-800 uppercase bg-slate-100 px-2 py-1 rounded">
                  {project.status}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Status</label>
                <select
                  value={selectedTargetStatus}
                  onChange={(e) => setSelectedTargetStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#001237] focus:outline-none"
                >
                  {allowedTransitions.map((st) => (
                    <option key={st} value={st}>
                      {st.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Notes</label>
                <textarea
                  value={transitionReason}
                  onChange={(e) => setTransitionReason(e.target.value)}
                  placeholder="e.g. Site mobilization approved, weather delay encountered..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTransitionModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isTransitioning || !selectedTargetStatus}
                onClick={handleExecuteTransition}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isTransitioning ? 'Transitioning...' : 'Confirm Transition'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001237]/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateDepartment}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                Add Engineering Discipline
              </h3>
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {deptError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{deptError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Discipline Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Highway & Concrete Pavement Engineering"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Unique Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HWY-CIV"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                  placeholder="Scope of professional engineering discipline..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingDept}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isCreatingDept ? 'Creating...' : 'Create Discipline'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add WBS Activity Modal */}
      {showActModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001237]/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateActivity}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                Add WBS Construction Activity
              </h3>
              <button
                type="button"
                onClick={() => setShowActModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {actError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{actError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Activity Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACT-001"
                    value={newActCode}
                    onChange={(e) => setNewActCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:border-[#001237] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WBS Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. WBS-1.1.2"
                    value={newActWbs}
                    onChange={(e) => setNewActWbs(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-[#001237] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subgrade Stabilization & Geotextile Placement"
                  value={newActName}
                  onChange={(e) => setNewActName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location Zone</label>
                <input
                  type="text"
                  placeholder="e.g. CH 12+000 to CH 14+500"
                  value={newActZone}
                  onChange={(e) => setNewActZone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Discipline</label>
                <select
                  value={newActDeptId}
                  onChange={(e) => setNewActDeptId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#001237] focus:outline-none"
                >
                  <option value="">General Project Activity</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} — {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowActModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingAct}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isCreatingAct ? 'Creating...' : 'Create Activity'}
              </button>
            </div>
          </form>
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

      {/* Field Submission Modal (Only accessible once Admin Approved & Active) */}
      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001237]/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateFieldSubmission}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                  Log Field Submission ({project.code})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Admin approval verified &mdash; submit site inspection or break log.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmissionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {subError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{subError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Submission Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CH 12+400 C35/45 Pour & Cylinder Break Log"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Channel</label>
                <select
                  value={subChannel}
                  onChange={(e) => setSubChannel(e.target.value as 'portal' | 'whatsapp' | 'telegram')}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#001237] focus:outline-none"
                >
                  <option value="portal">Civora Web Portal</option>
                  <option value="whatsapp">WhatsApp Business Bridge</option>
                  <option value="telegram">Telegram Field Bot</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Zone / Chainage Location</label>
                <input
                  type="text"
                  placeholder={project.location || 'e.g. Span 3 Pier 2'}
                  value={subLocation}
                  onChange={(e) => setSubLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Observation / Test Results</label>
                <textarea
                  rows={3}
                  placeholder="Record concrete slump, strength MPa, rebar checks, or inspection notes..."
                  value={subDescription}
                  onChange={(e) => setSubDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSubmissionModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingLog || !subTitle.trim()}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSubmittingLog ? 'Submitting...' : 'Submit Field Log'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
