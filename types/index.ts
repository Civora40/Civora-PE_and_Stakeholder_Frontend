export type UserRole = 'platform_admin' | 'project_engineer' | 'read_only_stakeholder';

export interface CivoraUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  assignedProjects: string[]; // Project IDs, or ['*'] for all
  avatarUrl?: string;
  // Extended profile and workspace context fields
  firstName?: string;
  lastName?: string;
  displayName?: string;
  organization?: string;
  jobTitle?: string;
  phone?: string;
  timeZone?: string;
  department?: string;
  primaryResponsibility?: string;
  defaultProject?: string;
  reportingPreferences?: string[];
  // Nigerian Construction & Regulatory Context
  corenNumber?: string;
  corenStatus?: string;
  cacNumber?: string;
  officeState?: string;
  geopoliticalZone?: string;
  projectCategory?: string;
  standardsBaseline?: string[];
  testingLab?: string;
  reviewSlaDays?: number;
  rfiEscalationTier?: string;
  reportingCadence?: string;
  lasbcaPermitNumber?: string;
  eiaApprovalStatus?: string;
  // Onboarding & Access State
  onboardingCompletedAt?: number | null;
  onboardingStep?: number; // 1 through 10
  accountStatus?: 'active' | 'pending' | 'suspended';
  invitationCode?: string;
  emailVerifiedAt?: number | null;
}

export interface SessionData {
  user: CivoraUser;
  accessToken?: string;
  refreshToken?: string;
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
  | 'personnel:read'
  | 'personnel:manage'
  | 'performance:read'
  | 'performance:manage'
  | 'integrations:manage'
  | 'policies:manage'
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
  // Extended Project Initiation Metadata
  projectType?: string;
  description?: string;
  contractRef?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  country?: string;
  state?: string;
  city?: string;
  siteAddress?: string;
  coordinates?: string;
  startDate?: string;
  completionDate?: string;
  scopeSummary?: string;
  deliverables?: string[];
  milestonesList?: { id: string; title: string; targetDate: string }[];
  constraints?: string;
  contractor?: string;
  clientRep?: string;
  stakeholders?: string[];
  assignedTeam?: string[];
  escalationContact?: string;
  reportingCadence?: string;
  submissionChannels?: string[];
  reportingCategories?: string[];
  stakeholderReviewRequired?: boolean;
  requireLabBreakCert?: boolean;
  requireGeotaggedPhotos?: boolean;
  governanceNotes?: string;
}

export type SubmissionStatus =
  | 'received'
  | 'pending_review'
  | 'needs_information'
  | 'approved'
  | 'rejected'
  | 'needs_verification';

export type AIFlagStatus = 'advisory_discrepancy' | 'spec_compliant' | 'unverified';

export type SourceChannel = 'whatsapp' | 'telegram' | 'portal';

export type IdentityVerificationStatus = 'verified' | 'needs_verification' | 'flagged';

export type ControlledCategory =
  | 'Site Work / Daily Progress'
  | 'Health & Safety'
  | 'Quality / Inspection'
  | 'Materials & Deliveries'
  | 'Equipment / Plant'
  | 'Workforce / Attendance'
  | 'Delays / Blockers'
  | 'Testing / Commissioning'
  | 'Environmental / Housekeeping'
  | 'General Update';

export interface VerifiedContactMethod {
  id: string;
  personnelId: string;
  type: 'phone' | 'telegram' | 'whatsapp';
  value: string;
  maskedValue: string;
  verifiedAt: string;
  verifiedBy: string;
  isActive: boolean;
}

export interface Personnel {
  id: string;
  fullName: string;
  email: string;
  professionalTitle: string; // Professional title or discipline (SEPARATE from Civora RBAC)
  department: string;
  organization: string;
  civoraRole?: UserRole; // System RBAC role if user has a Civora account
  assignedProjects: string[];
  assignedProjectNames?: string[];
  verifiedContacts: VerifiedContactMethod[];
  verificationStatus: IdentityVerificationStatus;
  expectedReportingCadence: 'daily' | 'twice_weekly' | 'weekly' | 'biweekly';
  supervisorId?: string;
  supervisorName?: string;
  activeStatus: 'active' | 'inactive' | 'on_leave';
  effectiveFrom: string;
  avatarUrl?: string;
  notes?: string;
}

export interface FileAttachment {
  id: string;
  submissionId: string;
  projectId: string;
  senderPersonnelId?: string;
  sourceChannel: SourceChannel;
  providerMediaId?: string;
  originalFilename: string;
  storageKey: string; // Private object storage key
  mimeType: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  checksum: string;
  captureTime?: string;
  receivedTime: string;
  downloadUrl: string; // Authenticated / short-lived signed URL
  thumbnailUrl?: string;
  processingStatus: 'ready' | 'processing' | 'failed';
  errorMessage?: string;
  category?: 'drawing' | 'test_report' | 'site_photo' | 'sensor_log' | 'spec_sheet' | 'document';
}

export interface EvidenceItem {
  id: string;
  type: 'drawing' | 'test_report' | 'site_photo' | 'sensor_log' | 'spec_sheet';
  title: string;
  filename: string;
  size: string;
  timestamp: string;
  verified: boolean;
}

export interface InformationRequest {
  id: string;
  submissionId: string;
  recipient: string;
  recipientContactMasked?: string;
  channel: SourceChannel;
  requestedBy: string;
  requestedAt: string;
  queryText: string;
  dueDate?: string;
  status: 'open' | 'resolved' | 'cancelled';
  resolutionNotes?: string;
}

export interface SubmissionHistoryEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  note?: string;
}

export interface Submission {
  id: string;
  identifier: string; // e.g. SUB-2026-0842 or SUB-WA-2026-0912
  projectId: string;
  projectName: string;
  reportingGroup: string; // e.g. Structural Concrete, MEP Rough-in, Earthwork
  title: string;
  description: string;
  receivedDate: string; // ISO string
  submittedBy: string;
  subcontractor: string;
  reviewStatus: SubmissionStatus;
  aiFlag: {
    status: AIFlagStatus;
    message: string;
    confidence: number;
    specRef: string;
    disclaimer: string;
    suggestedCategory?: ControlledCategory;
  };
  evidenceItems: EvidenceItem[];
  engineerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;

  // Specification Extensions: Ingestion, Verified Identity & File Management
  sourceChannel?: SourceChannel;
  providerMessageId?: string;
  providerEventId?: string;
  platformTimestamp?: string;
  senderPersonnelId?: string;
  senderName?: string;
  senderRole?: string; // Professional title or discipline
  senderDepartment?: string;
  senderCivoraRole?: UserRole; // Separate RBAC role display
  senderVerificationStatus?: IdentityVerificationStatus;
  maskedContactReference?: string;
  primaryCategory?: ControlledCategory;
  secondaryTags?: string[];
  isSuggestedCategory?: boolean;
  attachments?: FileAttachment[];
  linkedTaskId?: string;
  linkedTaskTitle?: string;
  informationRequests?: InformationRequest[];
  history?: SubmissionHistoryEvent[];
}

export type TaskStatus =
  | 'assigned'
  | 'in_progress'
  | 'blocked'
  | 'submitted_for_review'
  | 'completed'
  | 'reopened'
  | 'cancelled';

export interface ProjectTask {
  id: string;
  code: string; // e.g. TSK-LAMATA-401
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assignedPersonnelId: string;
  assignedPersonnelName: string;
  assignedPersonnelRole?: string;
  category: ControlledCategory;
  status: TaskStatus;
  dueDate: string;
  linkedSubmissions: string[];
  acceptedBy?: string;
  acceptedAt?: string;
  acceptanceNotes?: string;
  blockedReason?: string;
}

export interface ActivityRecord {
  id: string;
  projectId: string;
  projectName: string;
  personnelId: string;
  personnelName: string;
  date: string;
  taskReference?: string;
  taskTitle?: string;
  activityDescription: string;
  submissionIds: string[];
  status: 'logged' | 'verified' | 'disputed';
  reviewerOutcome?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type ExceptionType =
  | 'approved_leave'
  | 'site_closure'
  | 'reassigned_duty'
  | 'weather_delay'
  | 'data_correction'
  | 'other_approved_reason';

export interface PerformanceException {
  id: string;
  personnelId: string;
  personnelName: string;
  period: string; // e.g. "Week 42 (Oct 13 - Oct 19, 2026)" or "October 2026"
  type: ExceptionType;
  reason: string;
  excludedPeriodsCount: number;
  approvedBy: string;
  approvedAt: string;
  supportingEvidenceRef?: string;
}

export interface ReportingPolicy {
  id: string;
  name: string;
  effectiveDate: string;
  version: string;
  complianceThresholdPercent: number; // Client proposed 75% or 80%
  cadenceByRole: Record<string, string>;
  approvedExceptionTypes: ExceptionType[];
  isClientProposedGuideline: boolean; // Flag indicating unfinalized operational policy
  payrollDecoupledNotice: string; // Clear policy notice decoupling compliance from automated payroll deduction
}

export interface PerformanceAssessment {
  id: string;
  personnelId: string;
  personnelName: string;
  professionalTitle: string;
  department: string;
  projectId: string;
  projectName: string;
  period: string;
  reportingCadence: string;
  reportingMetrics: {
    requiredPeriods: number;
    qualifyingPeriodsCompleted: number;
    missingPeriods: number;
    approvedExceptionsCount: number;
    compliancePercentage: number;
    qualifyingSubmissionIds: string[];
  };
  taskMetrics: {
    tasksDue: number;
    tasksAccepted: number;
    tasksBlocked: number;
    tasksOverdue: number;
    taskCompletionPercentage: number;
  };
  thresholdConfig: {
    thresholdPercent: number;
    status: 'meets_threshold' | 'below_threshold' | 'pending_review';
    policyVersion: string;
  };
  exceptions: PerformanceException[];
  reviewerNotes?: string;
  lastCalculatedAt: string;
}

export interface ChannelIntegrationConfig {
  whatsapp: {
    enabled: boolean;
    phoneNumberId: string;
    displayPhoneNumber: string;
    webhookVerifyToken: string;
    webhookSecretMasked: string;
    status: 'connected' | 'degraded' | 'disconnected';
    groupIngestionSupported: boolean;
    groupNotice: string;
    totalIngested: number;
    duplicatesBlocked: number;
    lastEventTime: string;
  };
  telegram: {
    enabled: boolean;
    botUsername: string;
    botTokenMasked: string;
    webhookUrl: string;
    status: 'connected' | 'degraded' | 'disconnected';
    allowedChatIds: string[];
    totalIngested: number;
    duplicatesBlocked: number;
    lastEventTime: string;
  };
}

export interface IntegrationEvent {
  id: string;
  channel: SourceChannel;
  providerEventId: string;
  providerMessageId: string;
  status: 'success' | 'duplicate_blocked' | 'identity_pending' | 'media_failed' | 'retry_scheduled';
  receivedAt: string;
  senderRaw: string;
  senderIdentity?: string;
  payloadSummary: string;
  errorMessage?: string;
  retryCount?: number;
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
  complianceSnapshot?: {
    overallReportingCompliance: number;
    overallTaskCompletion: number;
    thresholdPercent: number;
    eligiblePersonnelCount: number;
  };
}
