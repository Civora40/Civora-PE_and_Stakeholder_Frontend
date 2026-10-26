import {
  StudioReport,
  ReportTemplate,
  ReportSection,
  ReportVersion,
  ReportReviewComment,
  AIAnalysisRun,
  AIAnalysisFinding,
  ReportingWorkflowStatus,
  ReportLayoutSettings,
  ReportFigure,
  ReportTableBlock,
  ReportAppendix,
  DocumentControl,
  CoverPreset,
} from '../types/reporting-studio';
import {
  INITIAL_STUDIO_REPORTS,
  STARTER_REPORT_TEMPLATES,
  INITIAL_AI_ANALYSIS_RUNS,
} from '../mock-data/reporting-studio';
import { DEMO_PROJECTS } from '../mock-data/fixtures';

export const DEFAULT_REPORT_LAYOUT_SETTINGS: ReportLayoutSettings = {
  paperSize: 'A4',
  orientation: 'PORTRAIT',
  margins: {
    preset: 'standard',
    top: 25,
    right: 25,
    bottom: 25,
    left: 25,
  },
  typography: {
    fontFamily: 'Inter',
    fontSizePt: 11,
    lineSpacing: 1.25,
    paragraphSpacingPt: 8,
  },
  coverPage: {
    enabled: true,
    preset: 'architectural_dark',
    showLogo: true,
    showClientLogo: true,
    showLocation: true,
    showConfidentiality: true,
    confidentialityLabel: 'CONFIDENTIAL — CIVORA PROJECT SPECIFICATION',
    showReviewers: true,
    showProjectImage: true,
    projectImageUrl: '/images/curved_glass_facade.jpg',
    customTagline: 'Intelligent Construction. Clearer Control.',
    periodYearDisplay: '2025/26',
    headlinePrimary: 'ANNUAL\nREPORT',
    headlineSecondary: 'Construction Progress &\nPerformance',
  },
  watermark: {
    enabled: true,
    type: 'civora_official',
    customText: 'CIVORA CONTROL PLANE • OFFICIAL AUDIT',
    opacity: 0.055,
    showOnCover: false,
  },
  tableOfContents: {
    enabled: true,
    title: 'Table of Contents',
    maxHeadingLevel: 3,
    showPageNumbers: true,
    showLeaders: true,
    showListOfFigures: true,
    showListOfTables: true,
  },
  headerFooter: {
    headerType: 'title',
    footerType: 'confidential',
    pageNumberStyle: 'page_of_total',
    pageNumberPosition: 'right',
    hideOnCover: true,
    startPageNumber: 1,
  },
  themeVersion: '2.4.0',
};


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
  const found = reportsStore.find((r) => r.id === reportId || r.reportNumber === reportId);
  if (found) return found;

  // Auto-recovery for any dynamic or client-created draft ID (e.g. rep_1792909361398)
  if (reportId.startsWith('rep_')) {
    const now = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const fallbackReport: StudioReport = {
      id: reportId,
      reportNumber: `REP-2026-DRAFT`,
      projectId: 'prj_metro_01',
      projectName: 'Lekki Free Zone Infrastructure Phase 2',
      projectCode: 'LFZ-PRJ-01',
      title: 'Weekly Construction Progress Report — Active Site Draft',
      reportType: 'Weekly Construction Progress Report',
      templateId: 'tmpl_weekly_progress',
      templateVersion: '2.1',
      workflowStatus: 'draft',
      reportingPeriodStart: '2026-10-15',
      reportingPeriodEnd: '2026-10-22',
      periodFormatted: '15 Oct 2026 to 22 Oct 2026',
      createdById: 'usr_eng_02',
      createdByName: 'Marcus Vance, PE',
      authorTitle: 'Project Engineer',
      currentVersion: 'v1.0 (Draft)',
      executiveSummary:
        'This working draft documents construction execution, QA/QC testing, and critical path milestones for the active cycle.',
      sections: [
        {
          id: 'sec_executive_summary',
          title: 'Executive Summary',
          content:
            'This draft documents progress for the current reporting period. Concrete pours and earthwork stabilization continue on schedule.',
          placeholder: 'Provide high-level summary of work accomplished...',
          guidance:
            'Summarize work completed, percentage of plan achieved, and any immediate blockers.',
          isRequired: true,
          isCompleted: true,
        },
        {
          id: 'sec_work_packages',
          title: 'Physical Work Packages & Delivery Progress',
          content:
            'Work Package 04 (Substructure & Foundation Piling): 94% complete. 12 of 14 bored piles certified. Reinforcement cage placement for Pier P-03 underway.',
          placeholder: 'Itemize work completed across chainages, grids, and work orders...',
          guidance: 'Detail physical progress against planned schedule by work package.',
          isRequired: true,
          isCompleted: true,
        },
        {
          id: 'sec_qa_qc',
          title: 'QA/QC Compliance & Laboratory Break Verification',
          content:
            'Standard 28-day cylinder compressive strength tests conducted for Pour #42 (C35/45 mix). Result: 44.8 MPa (Compliant with BS EN 12390-3).',
          placeholder: 'Summarize cylinder break tests, slump tests, and non-conformance reports...',
          guidance: 'List lab break reports, batch plant tickets, and slump test logs.',
          isRequired: true,
          isCompleted: true,
        },
        {
          id: 'sec_hse',
          title: 'HSE Incident & Hazard Log',
          content:
            'Zero Lost Time Incidents (LTI) recorded across 1,840 man-hours. 4 toolbox safety briefings conducted covering excavation shoring and high-voltage perimeter clearance.',
          placeholder: 'Record toolbox talks, hazard observations, and PPE compliance...',
          guidance: 'Report LTI, near-misses, safety walk findings, and toolbox talk logs.',
          isRequired: true,
          isCompleted: true,
        },
        {
          id: 'sec_risks',
          title: 'Look-Ahead Schedule & Critical Path Risks',
          content:
            'Monsoon drainage mitigation scheduled for Week 44. Procurement of high-tensile 32mm rebar remains on critical path; expediting shipment from coastal depot.',
          placeholder: 'Document upcoming milestones, potential delays, and material shortages...',
          guidance: 'Highlight critical path dependencies for the next 7-14 calendar days.',
          isRequired: true,
          isCompleted: false,
        },
      ],
      versions: [],
      reviewComments: [],
      auditTrail: [
        {
          id: `aud_${Date.now()}`,
          action: 'Draft Initialized',
          actor: 'Marcus Vance, PE',
          actorRole: 'Project Engineer',
          timestamp: now,
          note: 'Initialized from institutional template standard',
        },
      ],
      sourceSubmissionsCount: 6,
      linkedEvidenceCount: 2,
      lastSavedAt: now,
      layoutSettings: DEFAULT_REPORT_LAYOUT_SETTINGS,
      documentControl: {
        docRef: `REP-2026-DRAFT`,
        version: 'v1.0',
        status: 'Draft',
        preparedBy: 'Marcus Vance, PE',
        preparedDate: now,
        revisionSummary: 'Initial institutional draft created',
      },
      figures: [
        {
          id: 'fig_01',
          figureNumber: 1,
          title: 'Pier P-03 Reinforcement & Formwork Pre-Pour Inspection',
          caption:
            'Chainage 14+200: Verification of high-tensile 32mm rebar spacing and cover blocks prior to casting.',
          altText: 'Concrete pier formwork with rebar cage inspection',
          pageNumber: 3,
        },
      ],
      tables: [
        {
          id: 'tbl_01',
          tableNumber: 1,
          title: 'Summary of 28-Day Compressive Cube Break Test Results',
          caption: 'Tested in accordance with BS EN 12390-3 at Central Geotechnical Laboratory.',
          headers: [
            'Sample ID',
            'Location / Element',
            'Cast Date',
            'Test Date',
            'Curing (Days)',
            'Target (MPa)',
            'Achieved (MPa)',
            'Compliance',
          ],
          rows: [
            ['CB-42-01', 'Pier P-03 Stem', '2026-09-24', '2026-10-22', '28', '40.0', '44.8', 'PASSED'],
            ['CB-42-02', 'Pier P-03 Stem', '2026-09-24', '2026-10-22', '28', '40.0', '45.2', 'PASSED'],
            ['CB-42-03', 'Abutment A1 Kickers', '2026-09-25', '2026-10-23', '28', '35.0', '39.1', 'PASSED'],
          ],
          pageNumber: 4,
        },
      ],
      appendices: [
        {
          id: 'app_a',
          letter: 'A',
          title: 'Certified Independent Laboratory Cube Break Certificates (Batch #42)',
          content: 'Attached official stamped sheets from Federal Ministry of Works accredited testing lab.',
          fileRef: 'CERT-2026-LAB-042.pdf',
        },
        {
          id: 'app_b',
          letter: 'B',
          title: 'Daily Site Weather & Workforce Muster Sheets (W42)',
          content: 'Archived daily WhatsApp field check-ins and safety toolbox rosters.',
          fileRef: 'MUSTER-W42-SHEETS.pdf',
        },
      ],
    };
    reportsStore = [fallbackReport, ...reportsStore];
    return fallbackReport;
  }

  return null;
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
  coverPreset?: CoverPreset;
  periodYearDisplay?: string;
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
    layoutSettings: {
      ...DEFAULT_REPORT_LAYOUT_SETTINGS,
      coverPage: {
        ...DEFAULT_REPORT_LAYOUT_SETTINGS.coverPage,
        ...(params.coverPreset ? { preset: params.coverPreset } : {}),
        ...(params.periodYearDisplay ? { periodYearDisplay: params.periodYearDisplay } : {}),
      },
    },
    documentControl: {
      docRef: reportNumber,
      version: 'v1.0',
      status: 'Draft',
      preparedBy: params.authorName,
      preparedDate: now,
      revisionSummary: template
        ? `Created from template: ${template.name} (v${template.version})`
        : 'Created blank structured report draft',
    },
    figures: [],
    tables: [],
    appendices: [],
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
    layoutSettings: report.layoutSettings ? JSON.parse(JSON.stringify(report.layoutSettings)) : DEFAULT_REPORT_LAYOUT_SETTINGS,
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

export function updateReportLayoutSettings(
  reportId: string,
  settings: Partial<ReportLayoutSettings>
): StudioReport | null {
  const report = getStudioReportById(reportId);
  if (!report) return null;

  report.layoutSettings = {
    ...(report.layoutSettings || DEFAULT_REPORT_LAYOUT_SETTINGS),
    ...settings,
  };
  report.lastSavedAt = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return report;
}

export const approveStudioReport = approveReport;
export const releaseStudioReport = releaseReportToStakeholders;

export function updateReportDocumentControl(
  reportId: string,
  docControl: Partial<DocumentControl>
): StudioReport | null {
  const report = getStudioReportById(reportId);
  if (!report) return null;

  report.documentControl = {
    ...(report.documentControl || {
      docRef: report.reportNumber,
      version: report.currentVersion,
      status: report.workflowStatus,
      preparedBy: report.createdByName,
      preparedDate: report.lastSavedAt || new Date().toISOString(),
    }),
    ...docControl,
  };
  report.lastSavedAt = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return report;
}

export interface PreflightIssue {
  id: string;
  type: 'blocking' | 'warning';
  category: 'metadata' | 'section' | 'layout' | 'evidence' | 'document_control';
  message: string;
  sectionId?: string;
  fixActionLabel?: string;
}

export interface PreflightCheckResult {
  isValid: boolean;
  canSubmit: boolean;
  blockingCount: number;
  warningCount: number;
  issues: PreflightIssue[];
}

export function runReportPreflightCheck(report: StudioReport): PreflightCheckResult {
  const issues: PreflightIssue[] = [];

  // 1. Metadata checks
  if (!report.title || report.title.trim().length < 5) {
    issues.push({
      id: 'err_title',
      type: 'blocking',
      category: 'metadata',
      message: 'Report title is missing or too short (minimum 5 characters).',
      fixActionLabel: 'Edit Report Title',
    });
  }

  if (!report.reportingPeriodStart || !report.reportingPeriodEnd) {
    issues.push({
      id: 'err_period',
      type: 'blocking',
      category: 'metadata',
      message: 'Reporting period start or end date is not defined.',
      fixActionLabel: 'Define Reporting Period',
    });
  }

  // 2. Required section content checks
  report.sections.forEach((sec) => {
    if (sec.isRequired && !sec.isNotApplicable) {
      if (!sec.content || sec.content.trim().length < 20) {
        issues.push({
          id: `err_sec_${sec.id}`,
          type: 'blocking',
          category: 'section',
          sectionId: sec.id,
          message: `Mandatory section "${sec.title}" is empty or has insufficient content.`,
          fixActionLabel: `Complete ${sec.title}`,
        });
      }

      // Check for unresolved bracketed placeholders like [Project Name] or [Insert
      if (/\[(?:Project|Insert|TBD|Date|Engineer|Reviewer)[\w\s]*\]/i.test(sec.content)) {
        issues.push({
          id: `err_placeholder_${sec.id}`,
          type: 'blocking',
          category: 'section',
          sectionId: sec.id,
          message: `Section "${sec.title}" contains unresolved template placeholder tags.`,
          fixActionLabel: 'Resolve Placeholders',
        });
      }
    } else if (!sec.isRequired && (!sec.content || sec.content.trim().length === 0)) {
      issues.push({
        id: `warn_sec_${sec.id}`,
        type: 'warning',
        category: 'section',
        sectionId: sec.id,
        message: `Optional section "${sec.title}" is blank. Consider completing or marking as N/A.`,
        fixActionLabel: 'Review Section',
      });
    }
  });

  // 3. Layout settings verification
  const layout = report.layoutSettings || DEFAULT_REPORT_LAYOUT_SETTINGS;
  if (layout.margins.top < 10 || layout.margins.bottom < 10 || layout.margins.left < 10 || layout.margins.right < 10) {
    issues.push({
      id: 'warn_margins',
      type: 'warning',
      category: 'layout',
      message: 'Configured margins are under 10mm and may clip during physical printing.',
      fixActionLabel: 'Adjust Margins',
    });
  }

  // 4. Evidence citations verification
  const totalCitations = report.sections.reduce(
    (acc, sec) => acc + (sec.sourceReferences ? sec.sourceReferences.length : 0),
    0
  );
  if (totalCitations === 0) {
    issues.push({
      id: 'warn_citations',
      type: 'warning',
      category: 'evidence',
      message: 'No verified field evidence records (submittals, milestones, cube breaks) are cited in this report.',
      fixActionLabel: 'Link Field Evidence',
    });
  }

  // 5. Document Control verification for formal review
  if (report.workflowStatus === 'approved' && !report.documentControl?.approvedBy) {
    issues.push({
      id: 'err_doc_control_approval',
      type: 'blocking',
      category: 'document_control',
      message: 'Approved status requires formal approver name and sign-off date in Document Control.',
      fixActionLabel: 'Update Document Control',
    });
  }

  const blockingCount = issues.filter((i) => i.type === 'blocking').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;

  return {
    isValid: blockingCount === 0,
    canSubmit: blockingCount === 0,
    blockingCount,
    warningCount,
    issues,
  };
}

