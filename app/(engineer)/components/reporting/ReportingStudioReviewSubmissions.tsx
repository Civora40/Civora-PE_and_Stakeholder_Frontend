'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Send,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  FileEdit,
  ArrowRight,
  MessageSquare,
  Building,
  User,
  ShieldCheck,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
  getStudioReports,
  requestChangesOnReport,
  approveReport,
  releaseReportToStakeholders,
} from '@/lib/services/reporting-studio-service';
import { StudioReport, ReportingWorkflowStatus } from '@/lib/types/reporting-studio';

interface ReportingStudioReviewSubmissionsProps {
  user: CivoraUser;
  projects: Project[];
}

export function ReportingStudioReviewSubmissions({
  user,
  projects,
}: ReportingStudioReviewSubmissionsProps) {
  const [reports, setReports] = useState<StudioReport[]>(() =>
    getStudioReports(user.assignedProjects)
  );

  const [activeTab, setActiveTab] = useState<'pending' | 'changes' | 'approved' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Review action modal
  const [reviewReport, setReviewReport] = useState<StudioReport | null>(null);
  const [reviewMode, setReviewMode] = useState<'approve' | 'request_changes'>('request_changes');
  const [reviewComments, setReviewComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter reviews
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchTab =
        activeTab === 'all' ||
        (activeTab === 'pending' && (r.workflowStatus === 'ready_for_review' || r.workflowStatus === 'in_review')) ||
        (activeTab === 'changes' && r.workflowStatus === 'changes_requested') ||
        (activeTab === 'approved' && (r.workflowStatus === 'approved' || r.workflowStatus === 'released'));

      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.createdByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.projectName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [reports, activeTab, searchQuery]);

  const handleExecuteReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewReport) return;

    setIsProcessing(true);
    setTimeout(() => {
      if (reviewMode === 'request_changes') {
        requestChangesOnReport(reviewReport.id, {
          reviewerName: user.name,
          reviewerRole: user.title || 'Senior Peer Reviewer',
          comments: reviewComments,
        });
      } else {
        approveReport(reviewReport.id, {
          approverName: user.name,
          approverRole: user.title || 'Superintending Lead Engineer',
        });
      }

      setReports(getStudioReports(user.assignedProjects));
      setIsProcessing(false);
      setReviewReport(null);
      setReviewComments('');
    }, 600);
  };

  const handleRelease = (reportId: string) => {
    if (confirm('Are you sure you want to formally release and publish this report to the Stakeholder Workspace? This action is immutable.')) {
      releaseReportToStakeholders(reportId, {
        publisherName: user.name,
        publisherRole: user.title || 'Superintending Engineer',
      });
      setReports(getStudioReports(user.assignedProjects));
    }
  };

  const getStatusBadge = (status: ReportingWorkflowStatus) => {
    switch (status) {
      case 'ready_for_review':
        return <Badge variant="teal" size="sm">Ready for Review</Badge>;
      case 'in_review':
        return <Badge variant="slate" size="sm">In Review</Badge>;
      case 'changes_requested':
        return <Badge variant="rose" size="sm">Changes Requested</Badge>;
      case 'approved':
        return <Badge variant="emerald" size="sm">Approved</Badge>;
      case 'released':
        return <Badge variant="emerald" size="sm" dot>Released</Badge>;
      default:
        return <Badge variant="slate" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review & Submission Gateways"
        description="Track submitted compliance dossiers, assess technical peer reviews, and authorize publication to the Stakeholder Workspace."
      />

      {/* Tabs and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'changes'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Changes Requested
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'approved'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved & Released
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Submissions
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search submitted reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4 hover:border-[#3B68DE]/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">
                  {report.reportNumber}
                </span>
                {getStatusBadge(report.workflowStatus)}
                <span className="font-mono text-[11px] text-slate-400">
                  {report.currentVersion}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-700">
                  {report.projectName}
                </span>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                {report.periodFormatted}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                <Link href={`/engineer/reports/${report.id}`} className="hover:text-[#3B68DE]">
                  {report.title}
                </Link>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {report.executiveSummary}
              </p>
            </div>

            {/* Review Comments banner if Changes Requested */}
            {report.reviewComments.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/70 text-xs text-rose-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                    Reviewer Feedback ({report.reviewComments[0].reviewerName}):
                  </span>
                  <span className="text-[10px] text-rose-600 font-mono">
                    {report.reviewComments[0].timestamp}
                  </span>
                </div>
                <p className="text-rose-800 text-[11px] leading-relaxed">
                  {report.reviewComments[0].comments}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Author: <strong className="text-slate-800 font-medium">{report.createdByName}</strong> ({report.authorTitle})
              </span>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Link
                  href={`/engineer/reports/${report.id}/preview`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Preview PDF
                </Link>

                {/* If Author with changes requested: Edit & Resubmit */}
                {report.workflowStatus === 'changes_requested' && (
                  <Link
                    href={`/engineer/reports/${report.id}/edit`}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-2xs"
                  >
                    Edit & Resubmit
                  </Link>
                )}

                {/* If Pending Review: Lead reviewer can approve or request changes */}
                {(report.workflowStatus === 'ready_for_review' || report.workflowStatus === 'in_review') && (
                  <button
                    onClick={() => {
                      setReviewReport(report);
                      setReviewMode('approve');
                      setReviewComments('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#001237] hover:bg-[#18243D] text-white font-semibold shadow-2xs"
                  >
                    Assess Submission
                  </button>
                )}

                {/* If Approved: Release to stakeholders */}
                {report.workflowStatus === 'approved' && (
                  <button
                    onClick={() => handleRelease(report.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Publish to Stakeholders</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-500">
            No report submissions found in this review queue tab.
          </div>
        )}
      </div>

      {/* Review Assessment Modal */}
      {reviewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleExecuteReview}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                  Assess Technical Submission
                </h3>
                <p className="text-slate-500">{reviewReport.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewReport(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">Review Decision</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReviewMode('approve')}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    reviewMode === 'approve'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-2xs'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Approve Content
                  </span>
                  <span className="text-[10px] font-normal text-slate-500 block mt-1">
                    Sign off content as compliant for stakeholder release.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewMode('request_changes')}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    reviewMode === 'request_changes'
                      ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-2xs'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Request Changes
                  </span>
                  <span className="text-[10px] font-normal text-slate-500 block mt-1">
                    Return to author with specific revision notes.
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                Reviewer Evaluation Notes
              </label>
              <textarea
                rows={4}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder={
                  reviewMode === 'approve'
                    ? 'State any concluding remarks or sign-off notes...'
                    : 'Detail exact discrepancies, missing test sheets, or corrections required...'
                }
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 leading-relaxed"
                required={reviewMode === 'request_changes'}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewReport(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className={`px-5 py-2 rounded-xl text-white font-semibold shadow-2xs transition-colors ${
                  reviewMode === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isProcessing
                  ? 'Recording Decision...'
                  : reviewMode === 'approve'
                  ? 'Confirm Technical Approval'
                  : 'Return with Changes Requested'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
