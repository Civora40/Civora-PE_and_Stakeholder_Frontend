'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Send,
  Lock,
  RotateCcw,
  Check,
  UserCheck,
  Calendar,
  Building,
  Eye,
} from 'lucide-react';

import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StudioReport, ReportReviewComment } from '@/lib/types/reporting-studio';
import {
  submitReportForReview,
  requestChangesOnReport,
  approveStudioReport,
  releaseStudioReport,
  getStudioReportById,
} from '@/lib/services/reporting-studio-service';

interface ReportingStudioReportReviewProps {
  user: CivoraUser;
  report: StudioReport;
}

export function ReportingStudioReportReview({
  user,
  report: initialReport,
}: ReportingStudioReportReviewProps) {
  const router = useRouter();
  const [report, setReport] = useState<StudioReport>(initialReport);

  // Author resubmission state
  const [resubmitNotes, setResubmitNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reviewer comment state
  const [reviewerComment, setReviewerComment] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Author submit/resubmit action
  const handleAuthorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const updated = submitReportForReview(report.id, {
        actorName: user.name,
        authorNotes: resubmitNotes.trim() || 'Author resubmission addressing technical review comments.',
      });

      if (updated) {
        setReport({ ...updated });
        showSuccess('Report successfully submitted for engineering review!');
        setResubmitNotes('');
      }
      setIsSubmitting(false);
    }, 500);
  };

  // Reviewer approve action
  const handleApprove = () => {
    setIsReviewing(true);
    setTimeout(() => {
      const updated = approveStudioReport(report.id, {
        approverName: user.name,
        approverRole: 'Senior Supervising Structural Engineer (COREN Registered)',
      });

      if (updated) {
        setReport({ ...updated });
        showSuccess('Report approved! Ready for formal release.');
      }
      setIsReviewing(false);
    }, 500);
  };

  // Reviewer request changes action
  const handleRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerComment.trim()) return;

    setIsReviewing(true);
    setTimeout(() => {
      const updated = requestChangesOnReport(report.id, {
        reviewerName: user.name,
        reviewerRole: 'Project Technical Reviewer',
        comments: reviewerComment.trim(),
      });

      if (updated) {
        setReport({ ...updated });
        showSuccess('Revision comments returned to report author.');
        setReviewerComment('');
      }
      setIsReviewing(false);
    }, 500);
  };

  // Publisher release action
  const handleRelease = () => {
    setIsReviewing(true);
    setTimeout(() => {
      const updated = releaseStudioReport(report.id, {
        publisherName: user.name,
        publisherRole: 'Chief Project Engineer / Statutory Authority',
      });

      if (updated) {
        setReport({ ...updated });
        showSuccess('Report officially released and published to stakeholders!');
      }
      setIsReviewing(false);
    }, 500);
  };

  const isAuthor = user.id === report.createdById;
  const isDraftOrChanges = report.workflowStatus === 'draft' || report.workflowStatus === 'changes_requested';
  const isUnderReview = report.workflowStatus === 'ready_for_review' || report.workflowStatus === 'in_review';
  const isApproved = report.workflowStatus === 'approved';
  const isReleased = report.workflowStatus === 'released';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/engineer/reports" className="hover:text-slate-900 transition-colors">
              Reporting Studio
            </Link>
            <span>/</span>
            <Link href={`/engineer/reports/${report.id}/edit`} className="hover:text-slate-900 transition-colors">
              {report.reportNumber}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Review & Submission Status</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-condensed">
            Technical Review & Workflow Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track submission readiness, inspect reviewer comments, log structural revisions, and execute formal release.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/engineer/reports/${report.id}/edit`}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            Open in Editor
          </Link>
          <Link
            href={`/engineer/reports/${report.id}/preview`}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Print Preview</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Lifecycle Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 font-mono uppercase">Report Reference</span>
            <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
          </div>
          <Badge
            variant={
              isReleased ? 'emerald' : isApproved ? 'teal' : isUnderReview ? 'amber' : 'blue'
            }
            size="md"
          >
            {report.workflowStatus.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Multi-step progress visual */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs pt-2">
          {[
            { step: '1', label: 'Drafting', active: true, done: !isDraftOrChanges },
            {
              step: '2',
              label: 'Ready for Review',
              active: report.workflowStatus !== 'draft',
              done: isUnderReview || isApproved || isReleased,
            },
            {
              step: '3',
              label: 'In Technical Review',
              active: isUnderReview || isApproved || isReleased,
              done: isApproved || isReleased,
            },
            {
              step: '4',
              label: 'Approved',
              active: isApproved || isReleased,
              done: isReleased,
            },
            {
              step: '5',
              label: 'Released & Published',
              active: isReleased,
              done: isReleased,
            },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-2.5 rounded-xl border transition-all ${
                s.done
                  ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900 font-semibold'
                  : s.active
                  ? 'border-[#001237] bg-slate-50 text-slate-900 font-bold shadow-2xs'
                  : 'border-slate-200 bg-slate-50/30 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono mb-0.5">Stage {s.step}</div>
              <div className="text-xs truncate">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Review Actions & Comment Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Review Comments Stream */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900 font-condensed">Reviewer Comments & Revisions</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {report.reviewComments.length} Recorded Comments
            </span>
          </div>

          {report.reviewComments.length > 0 ? (
            <div className="space-y-3">
              {report.reviewComments.map((comm) => (
                <div key={comm.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{comm.reviewerName}</span>
                      <span className="text-[10px] text-slate-400">({comm.reviewerRole})</span>
                    </div>
                    <Badge variant={comm.status === 'approved' ? 'emerald' : 'amber'} size="sm">
                      {comm.status === 'approved' ? 'Approved' : 'Changes Requested'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{comm.comments}</p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">{comm.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
              No technical review comments recorded yet for this report.
            </div>
          )}
        </div>

        {/* Right Column: Workflow Action Forms */}
        <div className="lg:col-span-5 space-y-6">
          {/* Author Resubmit Form */}
          {isDraftOrChanges && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-condensed uppercase tracking-wider">
                  Author Submission Action
                </h4>
                <p className="text-[11px] text-slate-500">
                  Lock draft and submit immutable snapshot to the engineering review queue.
                </p>
              </div>

              <form onSubmit={handleAuthorSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  value={resubmitNotes}
                  onChange={(e) => setResubmitNotes(e.target.value)}
                  placeholder="Summarize changes made or specific areas requesting peer reviewer focus..."
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 leading-relaxed outline-none focus:ring-1 focus:ring-slate-900"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Snapshot for Review'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Technical Reviewer Assessment Form */}
          {isUnderReview && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-condensed uppercase tracking-wider">
                  Technical Peer Review Assessment
                </h4>
                <p className="text-[11px] text-slate-500">
                  Assess technical accuracy, verified test cubes, and statutory compliance.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isReviewing}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isReviewing ? 'Processing...' : 'Approve Report Content'}</span>
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white px-2 text-slate-400 font-bold">Or Request Revisions</span>
                  </div>
                </div>

                <form onSubmit={handleRequestChanges} className="space-y-3">
                  <textarea
                    rows={3}
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder="Itemize missing cube break attachments, calculation errors, or requested narrative revisions..."
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 leading-relaxed outline-none focus:ring-1 focus:ring-slate-900"
                    required
                  />

                  <button
                    type="submit"
                    disabled={isReviewing || !reviewerComment.trim()}
                    className="w-full py-2 rounded-xl border border-amber-600 text-amber-700 bg-amber-50 hover:bg-amber-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return with Requested Changes</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Release & Publishing Block */}
          {isApproved && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-900 font-condensed uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Approved — Ready for Statutory Release</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Approved reports can be released as immutable records into the Stakeholder Workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRelease}
                disabled={isReviewing}
                className="w-full py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Publish to Stakeholders</span>
              </button>
            </div>
          )}

          {/* Formally Released Confirmation */}
          {isReleased && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-emerald-900">Formally Released & Published</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Released on {report.releasedAt} by {report.releasedByName}. This version is cryptographically locked and immutable.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
