import { Project, ProjectApprovalStatus } from '@/types';

/**
 * Shared governance helpers for evaluating Platform Admin review state and
 * determining whether field submissions are unlocked for a project.
 */
export function resolveApprovalStatus(project: Partial<Project>): ProjectApprovalStatus {
  const raw = project.approvalStatus || project.approval_status;
  if (
    raw === 'approved' ||
    raw === 'changes_requested' ||
    raw === 'rejected' ||
    raw === 'pending_review'
  ) {
    return raw;
  }
  if (project.status === 'rejected') return 'rejected';
  if (
    project.status === 'active' ||
    project.status === 'on_hold' ||
    project.status === 'completed' ||
    project.status === 'archived'
  ) {
    return 'approved';
  }
  return 'pending_review';
}

export function isProjectAdminApproved(project: Partial<Project>): boolean {
  if (typeof project.isAdminApproved === 'boolean') return project.isAdminApproved;
  if (typeof project.is_admin_approved === 'boolean') return project.is_admin_approved;
  return resolveApprovalStatus(project) === 'approved';
}

export function canProjectAcceptFieldSubmissions(project: Partial<Project>): boolean {
  if (typeof project.canAcceptFieldSubmissions === 'boolean') {
    return project.canAcceptFieldSubmissions;
  }
  if (typeof project.can_accept_field_submissions === 'boolean') {
    return project.can_accept_field_submissions;
  }
  return isProjectAdminApproved(project) && project.status === 'active';
}

export function getProjectSubmissionBlockReason(project: Partial<Project>): string | null {
  const backendReason = project.fieldSubmissionBlockReason ?? project.field_submission_block_reason;
  if (backendReason) return backendReason;
  if (canProjectAcceptFieldSubmissions(project)) return null;

  const approvalStatus = resolveApprovalStatus(project);
  const code = project.code || 'Project';
  if (approvalStatus === 'rejected' || project.status === 'rejected') {
    const notes = project.reviewNotes ? ` Reason: ${project.reviewNotes}` : '';
    return `Field submissions are locked: ${code} was rejected during Platform Administrator review.${notes}`;
  }
  if (approvalStatus === 'changes_requested') {
    const notes = project.reviewNotes ? ` Admin notes: ${project.reviewNotes}` : '';
    return `Field submissions are locked: Platform Administrator requested changes before ${code} can be activated.${notes}`;
  }
  if (!isProjectAdminApproved(project)) {
    return `Field submissions are locked until a Platform Administrator reviews and approves ${code}.`;
  }
  return `Field submissions require ${code} to be in 'active' status (currently '${project.status}').`;
}

export function getProjectStatusBadgeInfo(project: Partial<Project>): {
  label: string;
  variant: 'teal' | 'amber' | 'rose' | 'blue' | 'slate';
} {
  switch (project.status) {
    case 'active':
      return { label: 'ACTIVE', variant: 'teal' };
    case 'pending_approval':
      return { label: 'PENDING ADMIN APPROVAL', variant: 'amber' };
    case 'rejected':
      return { label: 'REJECTED', variant: 'rose' };
    case 'on_hold':
      return { label: 'ON HOLD', variant: 'amber' };
    case 'setup':
    case 'planning':
      return {
        label:
          resolveApprovalStatus(project) === 'changes_requested'
            ? 'CHANGES REQUESTED'
            : String(project.status).toUpperCase(),
        variant: resolveApprovalStatus(project) === 'changes_requested' ? 'rose' : 'blue',
      };
    case 'draft':
      return {
        label: resolveApprovalStatus(project) === 'changes_requested' ? 'CHANGES REQUESTED' : 'DRAFT',
        variant: resolveApprovalStatus(project) === 'changes_requested' ? 'rose' : 'slate',
      };
    case 'completed':
      return { label: 'COMPLETED', variant: 'blue' };
    case 'archived':
      return { label: 'ARCHIVED', variant: 'slate' };
    default:
      return { label: String(project.status || 'UNKNOWN').replace(/_/g, ' ').toUpperCase(), variant: 'slate' };
  }
}
