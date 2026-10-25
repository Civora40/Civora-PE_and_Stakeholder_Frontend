import {
  StudioReport,
  ReportTemplate,
  ReportSection,
  ReportVersion,
  ReportReviewComment,
  AIAnalysisRun,
  AIAnalysisFinding,
  ReportingWorkflowStatus,
} from '@/lib/types/reporting-studio';
import {
  INITIAL_STUDIO_REPORTS,
  STARTER_REPORT_TEMPLATES,
  INITIAL_AI_ANALYSIS_RUNS,
} from '@/lib/mock-data/reporting-studio';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';

// Memory store for interactive session mutations
let reportsStore: StudioReport[] = [...INITIAL_STUDIO_REPORTS];
let templatesStore: ReportTemplate[] = [...STARTER_REPORT_TEMPLATES];
let aiRunsStore: AIAnalysisRun[] = [...INITIAL_AI_ANALYSIS_RUNS];

export function getStudioReports(userProjectIds?: string[]): StudioReport[] {
  if (!userProjectIds || userProjectIds.includes('*')) {
    return [...reportsStore];
  }
  const allowed = new Set(userProjectIds);
  return reportsStore.filter((r) => allowed.has(r.projectId));
}

export function getStudioReportById(reportId: string): StudioReport | null {
  return reportsStore.find((r) => r.id === reportId || r.reportNumber === reportId) || null;
}

export function getStudioDrafts(userProjectIds?: string[]): StudioReport[] {
  const reports = getStudioReports(userProjectIds);
  return reports.filter(
    (r) => r.workflowStatus === 'draft' || r.workflowStatus === 'changes_requested'
  );
}

export function getStudioTemplates(): ReportTemplate[] {
  return [...templatesStore];
}

export function getStudioTemplateById(templateId: string): ReportTemplate | null {
  return templatesStore.find((t) => t.id === templateId) || null;
}

export function createStudioReportDraft(params: {
  projectId: string;
  templateId?: string;
  title: string;
  reportingPeriodStart: string;
  reportingPeriodEnd: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  reference?: string;
  objective?: string;
  selectedEvidenceCount?: number;
}): StudioReport {
  const project = DEMO_PROJECTS.find((p) => p.id === params.projectId);
  const template = params.templateId ? getStudioTemplateById(params.templateId) : null;

  const count = reportsStore.length + 1;
  const year = new Date().getFullYear();
  const reportNumber = params.reference || `REP-${year}-M${String(count).padStart(2, '0')}`;
  const reportId = `rep_${Date.now()}`;

  // Build sections from template or default blank structure
  const sections: ReportSection[] = template
    ? template.sections.map((sec, idx) => ({
        id: sec.id,
        title: sec.title,
        content: sec.defaultContent || '',
        placeholder: sec.placeholder,
        guidance: sec.guidance,
        isRequired: sec.required,
        isCompleted: !!sec.defaultContent,
      }))
    : [
        {
          id: 'sec_executive_summary',
          title: 'Executive Summary',
          content: params.objective || '',
          placeholder: 'Provide high-level summary of work accomplished and strategic targets...',
          isRequired: true,
          isCompleted: !!params.objective,
        },
        {
          id: 'sec_work_packages',
          title: 'Physical Work Packages & Delivery Progress',
          content: '',
          placeholder: 'Itemize work completed across chainages, grids, and work orders...',
          isRequired: true,
          isCompleted: false,
        },
        {
          id: 'sec_quality_compliance',
          title: 'Quality Verification & Laboratory Testing',
          content: '',
          placeholder: 'Tabulate concrete break strengths, compaction checks, and inspection notes...',
          isRequired: true,
          isCompleted: false,
        },
      ];

  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newReport: StudioReport = {
    id: reportId,
    reportNumber,
    projectId: params.projectId,
    projectName: project ? project.name : 'Infrastructure Project',
    projectCode: project ? project.code : 'CIV-PRJ',
    title: params.title,
    reportType: template ? template.reportType : 'Structured Project Report',
    templateId: template?.id,
    templateVersion: template?.version,
    workflowStatus: 'draft',
    reportingPeriodStart: params.reportingPeriodStart,
    reportingPeriodEnd: params.reportingPeriodEnd,
    periodFormatted: `${params.reportingPeriodStart} to ${params.reportingPeriodEnd}`,
    createdById: params.authorId,
    createdByName: params.authorName,
    authorTitle: params.authorTitle,
    currentVersion: 'v1.0 (Draft)',
    executiveSummary: params.objective || 'Initial draft generated from template.',
    sections,
    versions: [],
    reviewComments: [],
    auditTrail: [
      {
        id: `aud_${Date.now()}`,
        action: 'Draft Created',
        actor: params.authorName,
        actorRole: 'Project Engineer',
        timestamp: now,
        note: template
          ? `Created draft from template: ${template.name} (v${template.version})`
          : 'Created blank structured report draft',
      },
    ],
    sourceSubmissionsCount: params.selectedEvidenceCount || 6,
    linkedEvidenceCount: params.selectedEvidenceCount || 2,
    lastSavedAt: now,
  };

  reportsStore = [newReport, ...reportsStore];
  return newReport;
}

export function saveStudioDraft(
  reportId: string,
  updates: {
    title?: string;
    executiveSummary?: string;
    sections?: ReportSection[];
    internalNotes?: string;
    actorName?: string;
  }
): StudioReport | null {
  const report = getStudioReportById(reportId);
  if (!report) return null;

  // Cannot edit released reports in-place
  if (report.workflowStatus === 'released') {
    throw new Error('Released reports are immutable. Create a new revision version.');
  }

  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (updates.title) report.title = updates.title;
  if (updates.executiveSummary !== undefined) report.executiveSummary = updates.executiveSummary;
  if (updates.sections) report.sections = updates.sections;
  report.lastSavedAt = now;

  return report;
}

export function submitReportForReview(
  reportId: string,
  params: {
    actorName: string;
    authorNotes?: string;
  }
): StudioReport | null {
  const report = getStudioReportById(reportId);
  if (!report) return null;

  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const nextVer = `v${report.versions.length + 1}.0`;

  // Create immutable snapshot of submitted state
  const snapshot: ReportVersion = {
    id: `ver_${Date.now()}`,
    reportId: report.id,
    versionNumber: nextVer,
    workflowStatus: 'ready_for_review',
    sections: JSON.parse(JSON.stringify(report.sections)),
    executiveSummary: report.executiveSummary,
    changeSummary: params.authorNotes || 'Formal submission for engineering technical peer review.',
    createdAt: now,
    createdByName: params.actorName,
    isSubmittedSnapshot: true,
  };

  report.workflowStatus = 'ready_for_review';
  report.currentVersion = `${nextVer} (Submitted)`;
  report.versions = [snapshot, ...report.versions];
  report.auditTrail = [
    {
      id: `aud_${Date.now()}`,
      action: 'Submitted for Review',
      actor: params.actorName,
      actorRole: 'Authoring Engineer',
      timestamp: now,
      note: params.authorNotes || 'Locked for authoring; routed to review queue.',
    },
    ...report.auditTrail,
  ];

  return report;
}

export function requestChangesOnReport(
  reportId: string,
  params: {
    reviewerName: string;
    reviewerRole: string;
    comments: string;
  }
): StudioReport | null {
  const report = getStudioReportById(reportId);
  if (!report) return null;

  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newComment: ReportReviewComment = {
    id: `rev_comm_${Date.now()}`,
    reportId: report.id,
    versionNumber: report.currentVersion,
    reviewerName: params.reviewerName,
    reviewerRole: params.reviewerRole,
    status: 'changes_requested',
    comments: params.comments,
    timestamp: now,
  };

  report.workflowStatus = 'changes_requested';
  report.reviewComments = [newComment, ...report.reviewComments];
  report.auditTrail = [
    {
      id: `aud_${Date.now()}`,
      action: 'Changes Requested',
      actor: params.reviewerName,
      actorRole: params.reviewerRole,
      timestamp: now,
      note: params.comments,
    },
    ...report.auditTrail,
  ];

  return report;
}

export function approveReport(
  reportId: string,
  params: {
    approverName: string;
    approverRole: string;
  }
): StudioReport | null {
  const report = getStudioReportById(reportId);
  if (!report) return null;

  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  report.workflowStatus = 'approved';
  report.auditTrail = [
    {
      id: `aud_${Date.now()}`,
      action: 'Report Approved',
      actor: params.approverName,
      actorRole: params.approverRole,
      timestamp: now,
      note: 'Technical approvals complete. Ready for formal stakeholder publication.',
    },
    ...report.auditTrail,
  ];

  return report;
}

export function releaseReportToStakeholders(
  reportId: string,
  params: {
    publisherName: string;
    publisherRole: string;
  }
): StudioReport | null {
  const report = getStudioReportById(reportId);
  if (!report) return null;

  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  report.workflowStatus = 'released';
  report.releasedAt = now;
  report.releasedByName = params.publisherName;
  report.auditTrail = [
    {
      id: `aud_${Date.now()}`,
      action: 'Released & Published to Stakeholders',
      actor: params.publisherName,
      actorRole: params.publisherRole,
      timestamp: now,
      note: 'Published as immutable compliance record in Stakeholder Workspace.',
    },
    ...report.auditTrail,
  ];

  return report;
}

export function getAIAnalysisRuns(projectId?: string): AIAnalysisRun[] {
  if (!projectId || projectId === 'all') return [...aiRunsStore];
  return aiRunsStore.filter((r) => r.projectId === projectId);
}

export function triggerAIAnalysisRun(params: {
  projectId: string;
  reportType: string;
  period: string;
  selectedSourcesCount: number;
}): AIAnalysisRun {
  const project = DEMO_PROJECTS.find((p) => p.id === params.projectId);
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newRun: AIAnalysisRun = {
    id: `ai_run_${Date.now()}`,
    projectId: params.projectId,
    projectName: project ? project.name : 'Infrastructure Asset',
    reportType: params.reportType,
    period: params.period,
    status: 'completed',
    sourcesCount: params.selectedSourcesCount,
    sourcesCoverage: `${params.selectedSourcesCount} Field Submittals, 2 Approved Milestones, 1 Statutory Cert`,
    createdAt: now,
    completedAt: now,
    findings: [
      {
        id: `fnd_${Date.now()}_1`,
        category: 'executive_summary',
        title: 'Synthesized Executive Summary Draft',
        content: `Comprehensive analysis of ${params.selectedSourcesCount} verified field records indicates high structural execution velocity. Key milestone gates achieved in accordance with specification standards.`,
        sourceReferences: [
          { recordId: 'sub_01', type: 'submission', label: 'Primary Field Pour Verification', date: now },
        ],
        isGrounded: true,
        status: 'suggested',
      },
      {
        id: `fnd_${Date.now()}_2`,
        category: 'progress_milestone',
        title: 'Delivery Progress & Milestone Verification',
        content: `Current work package delivery is running within ±2% of contractual baseline cadence. All concrete compressive tests meet BS 8110 / EN 1992 criteria.`,
        sourceReferences: [
          { recordId: 'mst_01', type: 'milestone', label: 'Contractual Milestone Gate Sign-Off', date: now },
        ],
        isGrounded: true,
        status: 'suggested',
      },
      {
        id: `fnd_${Date.now()}_3`,
        category: 'evidence_gap',
        title: 'Evidence Gap: Pending Independent Lab Stamped Break Certificate',
        content: 'Field ticket records 28-day break completed at third-party laboratory, but stamped certificate PDF has not yet been attached to the transmittal register.',
        sourceReferences: [],
        severity: 'medium',
        isGrounded: true,
        status: 'suggested',
      },
      {
        id: `fnd_${Date.now()}_4`,
        category: 'next_action',
        title: 'Recommended Follow-Up Actions',
        content: '1. Request official stamped 28-day cylinder crush sheet from testing laboratory.\n2. Confirm next site joint inspection gate with district building control agency.',
        sourceReferences: [],
        isGrounded: true,
        status: 'suggested',
      },
    ],
  };

  aiRunsStore = [newRun, ...aiRunsStore];
  return newRun;
}
