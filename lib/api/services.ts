import { CivoraUser, Project, Submission, Report } from '@/types';

/**
 * Typed Service Interfaces
 *
 * Designed to cleanly decouple the frontend components from the backend PostgreSQL / REST / GraphQL services.
 * In development, these return isolated mock fixtures. In production, these will bind to verified backend API contracts.
 */

export interface DashboardSummaryResponse {
  activeProjectsCount: number;
  pendingSubmissionsCount: number;
  flaggedDiscrepanciesCount: number;
  reportsAwaitingRelease: number;
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
}

export interface ReportsService {
  getReports(user: CivoraUser, projectId?: string): Promise<Report[]>;
  releaseReport(reportId: string, user: CivoraUser): Promise<Report>;
}
