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
