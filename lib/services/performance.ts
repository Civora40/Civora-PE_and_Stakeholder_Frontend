import {
  Personnel,
  ReportingPolicy,
  PerformanceAssessment,
  PerformanceException,
  Submission,
  ProjectTask,
  CivoraUser,
} from '../../types';
import {
  DEMO_PERFORMANCE_ASSESSMENTS,
  DEMO_PERFORMANCE_EXCEPTIONS,
  DEMO_REPORTING_POLICY,
  DEMO_TASKS,
  DEMO_SUBMISSIONS,
} from '../mock-data/fixtures';

const assessmentsStore: PerformanceAssessment[] = [...DEMO_PERFORMANCE_ASSESSMENTS];
const exceptionsStore: PerformanceException[] = [...DEMO_PERFORMANCE_EXCEPTIONS];
let policyStore: ReportingPolicy = { ...DEMO_REPORTING_POLICY };

/**
 * Returns required periods in a typical week based on reporting cadence.
 */
export function getRequiredPeriodsForCadence(cadence: string): number {
  switch (cadence) {
    case 'daily':
      return 6; // 6 working days (Mon-Sat typical construction week in Nigeria)
    case 'twice_weekly':
      return 2;
    case 'weekly':
      return 1;
    case 'biweekly':
      return 1;
    default:
      return 6;
  }
}

/**
 * Calculate Reporting Compliance %
 *
 * Formula:
 * (Qualifying required reporting periods completed ÷ Eligible required reporting periods) × 100
 *
 * Denominator = Max(1, Required periods - Approved exceptions count)
 * Flood prevention: Maximum 1 qualifying submission counts per daily/weekly slot.
 */
export function calculateReportingCompliance(
  personnel: Personnel,
  period: string,
  submissions: Submission[] = DEMO_SUBMISSIONS,
  exceptions: PerformanceException[] = exceptionsStore,
  policy: ReportingPolicy = policyStore
): PerformanceAssessment['reportingMetrics'] & { formulaExplanation: string } {
  const cadence = policy.cadenceByRole[personnel.professionalTitle] || personnel.expectedReportingCadence || 'daily';
  const requiredPeriods = getRequiredPeriodsForCadence(cadence);

  // Filter approved exceptions for this person & period
  const personExceptions = exceptions.filter(
    (e) => e.personnelId === personnel.id && (e.period === period || period.includes(e.period))
  );
  const approvedExceptionsCount = personExceptions.reduce((acc, curr) => acc + curr.excludedPeriodsCount, 0);

  // Eligible periods after approved exclusions
  const eligiblePeriods = Math.max(1, requiredPeriods - approvedExceptionsCount);

  // Qualifying submissions: must be verified sender, not rejected, attributed to personnel
  const validSubmissions = submissions.filter((s) => {
    const isPerson = s.senderPersonnelId === personnel.id || s.submittedBy.includes(personnel.fullName);
    const isVerified = s.senderVerificationStatus === 'verified';
    const isApprovedOrReviewed = s.reviewStatus === 'approved' || s.reviewStatus === 'pending_review' || s.reviewStatus === 'received';
    return isPerson && isVerified && isApprovedOrReviewed;
  });

  // Flood prevention: only up to eligiblePeriods qualifying slots count towards numerator
  const qualifyingSubmissionIds = validSubmissions.map((s) => s.id);
  const qualifyingPeriodsCompleted = Math.min(eligiblePeriods, qualifyingSubmissionIds.length);
  const missingPeriods = Math.max(0, eligiblePeriods - qualifyingPeriodsCompleted);

  const compliancePercentage = Math.min(
    100,
    Math.round((qualifyingPeriodsCompleted / eligiblePeriods) * 1000) / 10
  );

  const formulaExplanation = `${qualifyingPeriodsCompleted} qualifying periods ÷ (${requiredPeriods} required - ${approvedExceptionsCount} approved exceptions) = ${compliancePercentage}%`;

  return {
    requiredPeriods,
    qualifyingPeriodsCompleted,
    missingPeriods,
    approvedExceptionsCount,
    compliancePercentage,
    qualifyingSubmissionIds,
    formulaExplanation,
  };
}

/**
 * Calculate Task Completion %
 *
 * Formula:
 * (Tasks accepted as complete ÷ Eligible tasks due in period) × 100
 *
 * A message is evidence of communication, NOT automatic proof of task completion.
 */
export function calculateTaskCompletion(
  personnelId: string,
  tasks: ProjectTask[] = DEMO_TASKS
): PerformanceAssessment['taskMetrics'] & { formulaExplanation: string } {
  const personTasks = tasks.filter((t) => t.assignedPersonnelId === personnelId);

  const tasksDue = personTasks.length;
  const tasksAccepted = personTasks.filter((t) => t.status === 'completed').length;
  const tasksBlocked = personTasks.filter((t) => t.status === 'blocked').length;
  const tasksOverdue = personTasks.filter(
    (t) => (t.status === 'assigned' || t.status === 'in_progress') && new Date(t.dueDate) < new Date()
  ).length;

  const taskCompletionPercentage =
    tasksDue === 0 ? 100 : Math.round((tasksAccepted / tasksDue) * 1000) / 10;

  const formulaExplanation = `${tasksAccepted} tasks accepted ÷ ${tasksDue} tasks due = ${taskCompletionPercentage}%`;

  return {
    tasksDue,
    tasksAccepted,
    tasksBlocked,
    tasksOverdue,
    taskCompletionPercentage,
    formulaExplanation,
  };
}

/**
 * Evaluates performance status against the client proposed policy threshold (e.g. 75% or 80%)
 */
export function evaluateAssessmentStatus(
  compliancePercent: number,
  thresholdPercent: number = policyStore.complianceThresholdPercent
): 'meets_threshold' | 'below_threshold' | 'pending_review' {
  if (compliancePercent >= thresholdPercent) {
    return 'meets_threshold';
  }
  return 'below_threshold';
}

/**
 * Record an audited performance adjustment/exception
 */
export function recordPerformanceException(
  exceptionData: Omit<PerformanceException, 'id' | 'approvedAt' | 'approvedBy'>,
  actor: CivoraUser
): { success: boolean; exception: PerformanceException } {
  const newException: PerformanceException = {
    ...exceptionData,
    id: `exc_${Date.now()}`,
    approvedBy: actor.name,
    approvedAt: new Date().toISOString(),
  };

  exceptionsStore.unshift(newException);

  // Recalculate assessment for affected personnel
  const assessIdx = assessmentsStore.findIndex(
    (a) => a.personnelId === newException.personnelId && a.period === newException.period
  );
  if (assessIdx !== -1) {
    const existing = assessmentsStore[assessIdx];
    const newExceptionsCount = existing.reportingMetrics.approvedExceptionsCount + newException.excludedPeriodsCount;
    const eligible = Math.max(1, existing.reportingMetrics.requiredPeriods - newExceptionsCount);
    const newCompliance = Math.min(
      100,
      Math.round((existing.reportingMetrics.qualifyingPeriodsCompleted / eligible) * 1000) / 10
    );

    assessmentsStore[assessIdx] = {
      ...existing,
      reportingMetrics: {
        ...existing.reportingMetrics,
        approvedExceptionsCount: newExceptionsCount,
        missingPeriods: Math.max(0, eligible - existing.reportingMetrics.qualifyingPeriodsCompleted),
        compliancePercentage: newCompliance,
      },
      thresholdConfig: {
        ...existing.thresholdConfig,
        status: evaluateAssessmentStatus(newCompliance, existing.thresholdConfig.thresholdPercent),
      },
      exceptions: [...existing.exceptions, newException],
      lastCalculatedAt: new Date().toISOString(),
    };
  }

  return { success: true, exception: newException };
}

/**
 * Update reporting policy thresholds
 */
export function updateReportingPolicy(
  updatedPolicy: Partial<ReportingPolicy>,
  actor: CivoraUser
): ReportingPolicy {
  policyStore = {
    ...policyStore,
    ...updatedPolicy,
    version: `${policyStore.version.split('-')[0]}.${Date.now().toString().slice(-2)}-Audited-by-${actor.name.replace(/\s+/g, '')}`,
    effectiveDate: new Date().toISOString().slice(0, 10),
  };
  return policyStore;
}

export function getReportingPolicy(): ReportingPolicy {
  return policyStore;
}

export function getPerformanceAssessments(): PerformanceAssessment[] {
  return assessmentsStore;
}

export function getPerformanceExceptions(): PerformanceException[] {
  return exceptionsStore;
}
