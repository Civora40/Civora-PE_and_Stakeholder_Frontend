import {
  CivoraUser,
  Project,
  Submission,
  Report,
  Personnel,
  ProjectTask,
  ActivityRecord,
  PerformanceAssessment,
  PerformanceException,
  ReportingPolicy,
  ChannelIntegrationConfig,
  IntegrationEvent,
  SourceChannel,
} from '@/types';

/**
 * Typed Service Interfaces
 *
 * Designed to cleanly decouple the frontend components from the backend PostgreSQL / REST / GraphQL services.
 * In development, these return isolated mock fixtures and in-memory stores. In production, these bind to verified backend API contracts.
 */

export interface DashboardSummaryResponse {
  activeProjectsCount: number;
  pendingSubmissionsCount: number;
  flaggedDiscrepanciesCount: number;
  reportsAwaitingRelease: number;
  unverifiedSendersCount: number;
  activeIntegrationsCount: number;
  overallComplianceAvg: number;
}

export interface ProjectsService {
  getProjects(user: CivoraUser): Promise<Project[]>;
  getProjectById(projectId: string, user: CivoraUser): Promise<Project | null>;
}

export interface SubmissionsService {
  getSubmissions(user: CivoraUser, projectId?: string): Promise<Submission[]>;
  getSubmissionById(submissionId: string, user: CivoraUser): Promise<Submission | null>;
  reviewSubmission(
    submissionId: string,
    status: Submission['reviewStatus'],
    notes: string,
    user: CivoraUser
  ): Promise<Submission>;
  resolveSenderIdentity(
    submissionId: string,
    personnelId: string,
    user: CivoraUser,
    note?: string
  ): Promise<Submission>;
  linkToTask(
    submissionId: string,
    taskId: string,
    user: CivoraUser,
    note?: string
  ): Promise<Submission>;
  requestInformation(
    submissionId: string,
    queryText: string,
    channel: SourceChannel,
    user: CivoraUser,
    dueDate?: string
  ): Promise<Submission>;
}

export interface PersonnelService {
  getPersonnel(user: CivoraUser, projectId?: string): Promise<Personnel[]>;
  getPersonnelById(personnelId: string, user: CivoraUser): Promise<Personnel | null>;
  verifyContactMethod(
    personnelId: string,
    contactMethodId: string,
    user: CivoraUser
  ): Promise<Personnel>;
}

export interface TasksService {
  getTasks(user: CivoraUser, projectId?: string): Promise<ProjectTask[]>;
  getActivities(user: CivoraUser, projectId?: string): Promise<ActivityRecord[]>;
  updateTaskStatus(
    taskId: string,
    status: ProjectTask['status'],
    notes: string,
    user: CivoraUser
  ): Promise<ProjectTask>;
}

export interface PerformanceService {
  getAssessments(user: CivoraUser, period?: string): Promise<PerformanceAssessment[]>;
  getReportingPolicy(user: CivoraUser): Promise<ReportingPolicy>;
  recordException(
    exceptionData: Omit<PerformanceException, 'id' | 'approvedAt'>,
    user: CivoraUser
  ): Promise<PerformanceException>;
  updatePolicyThreshold(
    thresholdPercent: number,
    user: CivoraUser
  ): Promise<ReportingPolicy>;
}

export interface IntegrationsService {
  getConfig(user: CivoraUser): Promise<ChannelIntegrationConfig>;
  getEvents(user: CivoraUser): Promise<IntegrationEvent[]>;
  simulateInbound(
    payload: Record<string, unknown>,
    user: CivoraUser
  ): Promise<Record<string, unknown>>;
}

export interface ReportsService {
  getReports(user: CivoraUser, projectId?: string): Promise<Report[]>;
  releaseReport(reportId: string, user: CivoraUser): Promise<Report>;
}
