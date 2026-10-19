export type UserRole = 'platform_admin' | 'project_engineer' | 'read_only_stakeholder';

export interface CivoraUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  assignedProjects: string[]; // Project IDs, or ['*'] for all
  avatarUrl?: string;
}

export interface SessionData {
  user: CivoraUser;
  createdAt: number;
  expiresAt: number;
}

export type Permission =
  | 'dashboard:read'
  | 'projects:read'
  | 'projects:manage'
  | 'submissions:read'
  | 'submissions:review'
  | 'reports:read'
  | 'reports:manage'
  | 'reports:release'
  | 'users:manage'
  | 'settings:manage';

export type ProjectStatus = 'active' | 'planning' | 'in_review' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  leadEngineer: string;
  progressPercent: number;
  submissionsCount: number;
  pendingReviewsCount: number;
  reportsCount: number;
  lastActivity: string;
  budgetFormatted: string;
  specsReference: string;
}

export type SubmissionStatus =
  | 'received'
  | 'pending_review'
  | 'needs_information'
  | 'approved'
  | 'rejected';

export type AIFlagStatus = 'advisory_discrepancy' | 'spec_compliant' | 'unverified';

export interface EvidenceItem {
  id: string;
  type: 'drawing' | 'test_report' | 'site_photo' | 'sensor_log' | 'spec_sheet';
  title: string;
  filename: string;
  size: string;
  timestamp: string;
  verified: boolean;
}

export interface Submission {
  id: string;
  identifier: string; // e.g. SUB-2026-0842
  projectId: string;
  projectName: string;
  reportingGroup: string; // e.g. Structural Concrete, MEP Rough-in, Earthwork
  title: string;
  description: string;
  receivedDate: string;
  submittedBy: string;
  subcontractor: string;
  reviewStatus: SubmissionStatus;
  aiFlag: {
    status: AIFlagStatus;
    message: string;
    confidence: number;
    specRef: string;
    disclaimer: string;
  };
  evidenceItems: EvidenceItem[];
  engineerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type ReportStatus = 'draft' | 'review' | 'approved' | 'released';

export interface ReportAuditEntry {
  id: string;
  action: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  note: string;
}

export interface Report {
  id: string;
  reportNumber: string; // e.g. REP-2026-Q3-01
  projectId: string;
  projectName: string;
  title: string;
  status: ReportStatus;
  period: string;
  generatedBy: string;
  approvedBy?: string;
  releasedBy?: string;
  releasedAt?: string;
  submissionCount: number;
  flagsResolvedCount: number;
  executiveSummary: string;
  auditTrail: ReportAuditEntry[];
}
