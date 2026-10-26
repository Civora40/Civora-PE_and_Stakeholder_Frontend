import { ReportStatus, ReportAuditEntry } from '@/types';

export type ReportingWorkflowStatus =
  | 'draft'
  | 'ready_for_review'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'released';

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  placeholder?: string;
  guidance?: string;
  isRequired: boolean;
  isCompleted: boolean;
  isNotApplicable?: boolean;
  naReason?: string;
  internalNotes?: string;
  sourceReferences?: {
    recordId: string;
    type: 'submission' | 'milestone' | 'inspection' | 'lab_result';
    label: string;
    date: string;
  }[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  reportType: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Event-Driven' | 'Milestone-Gate';
  version: string;
  isActive: boolean;
  sections: {
    id: string;
    title: string;
    placeholder: string;
    guidance: string;
    required: boolean;
    defaultContent?: string;
  }[];
}

export interface ReportReviewComment {
  id: string;
  reportId: string;
  versionNumber: string;
  reviewerName: string;
  reviewerRole: string;
  status: 'changes_requested' | 'approved';
  comments: string;
  timestamp: string;
  resolvedAt?: string;
}

export type PaperSize = 'A4' | 'A3' | 'LETTER' | 'LEGAL' | 'A5';
export type PageOrientation = 'PORTRAIT' | 'LANDSCAPE';
export type MarginPreset = 'standard' | 'narrow' | 'wide' | 'custom';
export type CoverPreset = 'architectural_dark' | 'civora_standard' | 'project_image' | 'technical_report' | 'executive_brief';

export interface PageMargins {
  preset: MarginPreset;
  top: number; // in mm
  right: number; // in mm
  bottom: number; // in mm
  left: number; // in mm
}

export interface DocumentTypography {
  fontFamily: 'Inter' | 'Encode Sans Condensed' | 'Roboto' | 'Courier';
  fontSizePt: number;
  lineSpacing: number;
  paragraphSpacingPt: number;
}

export interface CoverPageConfig {
  enabled: boolean;
  preset: CoverPreset;
  showLogo: boolean;
  showClientLogo: boolean;
  showLocation: boolean;
  showConfidentiality: boolean;
  confidentialityLabel: string;
  showReviewers: boolean;
  showProjectImage: boolean;
  projectImageUrl?: string;
  customTagline?: string;
  periodYearDisplay?: string; // e.g. "2025/26" or "2026"
  headlinePrimary?: string; // e.g. "ANNUAL REPORT" or "CONSTRUCTION PROGRESS REPORT"
  headlineSecondary?: string; // e.g. "Construction Progress & Performance"
}

export interface WatermarkConfig {
  enabled: boolean;
  type: 'civora_official' | 'draft_confidential' | 'custom';
  customText?: string;
  opacity: number; // e.g. 0.04
  showOnCover: boolean;
}

export interface TableOfContentsConfig {
  enabled: boolean;
  title: string;
  maxHeadingLevel: 1 | 2 | 3;
  showPageNumbers: boolean;
  showLeaders: boolean;
  showListOfFigures: boolean;
  showListOfTables: boolean;
}

export interface HeaderFooterConfig {
  headerType: 'none' | 'title' | 'project' | 'reference' | 'custom';
  headerCustomText?: string;
  footerType: 'none' | 'confidential' | 'reference' | 'date_version' | 'custom';
  footerCustomText?: string;
  pageNumberStyle: 'arabic' | 'page_of_total' | 'roman';
  pageNumberPosition: 'left' | 'center' | 'right';
  hideOnCover: boolean;
  startPageNumber: number;
}

export interface ReportLayoutSettings {
  paperSize: PaperSize;
  orientation: PageOrientation;
  margins: PageMargins;
  typography: DocumentTypography;
  coverPage: CoverPageConfig;
  watermark?: WatermarkConfig;
  tableOfContents: TableOfContentsConfig;
  headerFooter: HeaderFooterConfig;
  themeVersion: string;
}

export interface ReportFigure {
  id: string;
  figureNumber: number;
  title: string;
  caption: string;
  imageUrl?: string;
  sourceRef?: string;
  altText: string;
  pageNumber?: number;
}

export interface ReportTableBlock {
  id: string;
  tableNumber: number;
  title: string;
  caption?: string;
  headers: string[];
  rows: string[][];
  pageNumber?: number;
}

export interface ReportAppendix {
  id: string;
  letter: string;
  title: string;
  content: string;
  fileRef?: string;
}

export interface DocumentControl {
  docRef: string;
  version: string;
  status: string;
  preparedBy: string;
  preparedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  revisionSummary?: string;
}

export interface ReportVersion {
  id: string;
  reportId: string;
  versionNumber: string; // e.g. "v1.0", "v1.1", "v2.0"
  workflowStatus: ReportingWorkflowStatus;
  sections: ReportSection[];
  executiveSummary: string;
  changeSummary?: string;
  createdAt: string;
  createdByName: string;
  layoutSettings?: ReportLayoutSettings;
  isSubmittedSnapshot?: boolean;
  isReleasedSnapshot?: boolean;
}

export interface StudioReport {
  id: string;
  reportNumber: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  title: string;
  reportType: string;
  templateId?: string;
  templateVersion?: string;
  workflowStatus: ReportingWorkflowStatus;
  reportingPeriodStart: string;
  reportingPeriodEnd: string;
  periodFormatted: string;
  createdById: string;
  createdByName: string;
  authorTitle: string;
  currentVersion: string;
  executiveSummary: string;
  sections: ReportSection[];
  versions: ReportVersion[];
  reviewComments: ReportReviewComment[];
  auditTrail: ReportAuditEntry[];
  sourceSubmissionsCount: number;
  linkedEvidenceCount: number;
  lastSavedAt: string;
  layoutSettings?: ReportLayoutSettings;
  figures?: ReportFigure[];
  tables?: ReportTableBlock[];
  appendices?: ReportAppendix[];
  documentControl?: DocumentControl;
  releasedAt?: string;
  releasedByName?: string;
  complianceScore?: number;
}

export interface AIAnalysisFinding {
  id: string;
  category:
    | 'executive_summary'
    | 'progress_milestone'
    | 'key_observation'
    | 'risk_issue'
    | 'evidence_gap'
    | 'conflict'
    | 'next_action';
  title: string;
  content: string;
  sourceReferences: {
    recordId: string;
    type: string;
    label: string;
    date: string;
  }[];
  severity?: 'low' | 'medium' | 'high';
  isGrounded: boolean;
  status: 'suggested' | 'accepted' | 'dismissed';
}

export interface AIAnalysisRun {
  id: string;
  projectId: string;
  projectName: string;
  reportType: string;
  period: string;
  status: 'queued' | 'processing' | 'completed' | 'completed_with_warnings' | 'failed';
  sourcesCount: number;
  sourcesCoverage: string;
  findings: AIAnalysisFinding[];
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}
