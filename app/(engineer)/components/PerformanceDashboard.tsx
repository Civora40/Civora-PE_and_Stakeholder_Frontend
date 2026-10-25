'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  PerformanceAssessment,
  ReportingPolicy,
  CivoraUser,
  Personnel,
} from '@/types';
import { can } from '@/lib/permissions/rbac';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PerformanceExceptionModal } from '@/components/modals/PerformanceExceptionModal';
import { DEMO_PERSONNEL } from '@/lib/mock-data/fixtures';

interface PerformanceDashboardProps {
  user: CivoraUser;
  initialAssessments: PerformanceAssessment[];
  initialPolicy: ReportingPolicy;
}

export function PerformanceDashboard({
  user,
  initialAssessments,
  initialPolicy,
}: PerformanceDashboardProps) {
  const [assessments, setAssessments] = useState<PerformanceAssessment[]>(initialAssessments);
  const [policy] = useState<ReportingPolicy>(initialPolicy);
  const [selectedAssessment, setSelectedAssessment] = useState<PerformanceAssessment | null>(null);
  const [exceptionModalTarget, setExceptionModalTarget] = useState<Personnel | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const canManagePerformance = can(user, 'performance:manage');
  const isStakeholder = user.role === 'read_only_stakeholder';

  // Overall calculations
  const totalAssessed = assessments.length;
  const meetingThresholdCount = assessments.filter(
    (a) => a.thresholdConfig.status === 'meets_threshold'
  ).length;
  const avgReportingCompliance =
    totalAssessed === 0
      ? 0
      : Math.round(
          (assessments.reduce((acc, curr) => acc + curr.reportingMetrics.compliancePercentage, 0) /
            totalAssessed) *
            10
        ) / 10;
  const avgTaskCompletion =
    totalAssessed === 0
      ? 0
      : Math.round(
          (assessments.reduce((acc, curr) => acc + curr.taskMetrics.taskCompletionPercentage, 0) /
            totalAssessed) *
            10
        ) / 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Weekly & Monthly Performance Assessment
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#001237] text-[#4FAAA7]">
              Policy: {policy.complianceThresholdPercent}% Baseline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Independent evaluation of field reporting compliance and verified task outcomes with transparent mathematical formulas.
          </p>
        </div>

        {feedbackMessage && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Critical Legal & Policy Banner (Specification Section 9 & 16) */}
      <div className="rounded-2xl bg-teal-500/10 border border-teal-500/30 p-4 space-y-2 text-xs text-slate-900">
        <div className="flex items-center gap-2 font-bold text-[#001237]">
          <ShieldAlert className="w-4 h-4 text-[#4FAAA7]" />
          <span>Client Proposed Policy Guideline ({policy.complianceThresholdPercent}% Baseline) — Decoupled from Payroll</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {policy.payrollDecoupledNotice}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-600 border-t border-teal-500/20 pt-2 font-mono">
          <span>Formula: Compliance % = Qualifying Periods ÷ (Required - Approved Exceptions) × 100</span>
          <span>&bull; Flood Prevention: Active (Max 1 qualifying slot / day)</span>
          <span>&bull; Task Acceptance: Requires Certified Engineering Review</span>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Reporting Compliance */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            AVERAGE REPORTING COMPLIANCE
          </span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
              {avgReportingCompliance}%
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                avgReportingCompliance >= policy.complianceThresholdPercent
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              {avgReportingCompliance >= policy.complianceThresholdPercent ? 'Compliant' : 'Needs Review'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Across {totalAssessed} active field professionals this period.
          </p>
        </div>

        {/* Card 2: Average Task Completion */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            AVERAGE TASK COMPLETION
          </span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
              {avgTaskCompletion}%
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              Verified Work
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Distinct from communication frequency.
          </p>
        </div>

        {/* Card 3: Meeting Threshold */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            PERSONNEL MEETING THRESHOLD
          </span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
              {meetingThresholdCount} / {totalAssessed}
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
              {Math.round((meetingThresholdCount / (totalAssessed || 1)) * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Threshold: &ge; {policy.complianceThresholdPercent}% qualifying submittals.
          </p>
        </div>

        {/* Card 4: Audited Adjustments */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            APPROVED EXCEPTIONS (DENOMINATOR)
          </span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
              {assessments.reduce((acc, curr) => acc + curr.reportingMetrics.approvedExceptionsCount, 0)}
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              Audited
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Leave, weather delays, and site closures excluded.
          </p>
        </div>
      </div>

      {/* Main Performance Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide font-['Encode_Sans_Condensed',sans-serif]">
            Field Submitter Reporting & Task Breakdown — Week 42 (Oct 13 - Oct 19, 2026)
          </h3>
          <span className="text-xs text-slate-500">
            Click row for calculation proof & evidence links
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Personnel & Role</th>
                <th className="p-3.5">Project Scope</th>
                <th className="p-3.5">Cadence</th>
                <th className="p-3.5 text-center">Periods (Req / Qual / Exc)</th>
                <th className="p-3.5 text-center">Reporting Compliance</th>
                <th className="p-3.5 text-center">Task Completion</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {assessments.map((item) => {
                const rep = item.reportingMetrics;
                const tsk = item.taskMetrics;
                const meets = item.thresholdConfig.status === 'meets_threshold';

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedAssessment(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    {/* Personnel & Title */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{item.personnelName}</div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        {item.professionalTitle}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.department}</div>
                    </td>

                    {/* Project */}
                    <td className="p-3.5">
                      <div className="text-slate-800 font-medium line-clamp-1 max-w-[180px]">
                        {item.projectName}
                      </div>
                    </td>

                    {/* Cadence */}
                    <td className="p-3.5">
                      <span className="text-[11px] text-slate-600 capitalize">
                        {item.reportingCadence}
                      </span>
                    </td>

                    {/* Periods Breakdown */}
                    <td className="p-3.5 text-center">
                      <span className="font-mono font-semibold text-slate-800">
                        {rep.qualifyingPeriodsCompleted} / {rep.requiredPeriods}
                      </span>
                      {rep.approvedExceptionsCount > 0 && (
                        <div className="text-[10px] text-teal-700 font-medium">
                          (-{rep.approvedExceptionsCount} exc)
                        </div>
                      )}
                      {rep.missingPeriods > 0 && (
                        <div className="text-[10px] text-rose-600 font-medium">
                          {rep.missingPeriods} missing
                        </div>
                      )}
                    </td>

                    {/* Reporting Compliance % */}
                    <td className="p-3.5 text-center">
                      <div className="font-mono text-sm font-black text-slate-900">
                        {rep.compliancePercentage}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Goal: &ge; {policy.complianceThresholdPercent}%
                      </div>
                    </td>

                    {/* Task Completion % */}
                    <td className="p-3.5 text-center">
                      <div className="font-mono text-sm font-black text-slate-900">
                        {tsk.taskCompletionPercentage}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {tsk.tasksAccepted} of {tsk.tasksDue} accepted
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center">
                      <Badge variant={meets ? 'emerald' : 'blue'} size="sm">
                        {meets ? 'Meets Threshold' : 'Below Threshold'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {canManagePerformance && (
                          <Button
                            onClick={() => {
                              const p = DEMO_PERSONNEL.find((per) => per.id === item.personnelId);
                              if (p) setExceptionModalTarget(p);
                            }}
                            variant="outline"
                            size="sm"
                            title="Record audited exception for leave or site closures"
                          >
                            + Exception
                          </Button>
                        )}
                        <button
                          onClick={() => setSelectedAssessment(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Drawer (Calculation Proof & Evidence) */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 text-slate-900">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between sticky top-0 z-10">
              <div>
                <span className="font-mono text-xs font-bold text-[#4FAAA7]">
                  {selectedAssessment.period}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedAssessment.personnelName}
                </h2>
                <div className="text-xs text-slate-600">
                  {selectedAssessment.professionalTitle} &bull; {selectedAssessment.department}
                </div>
              </div>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Formula & Calculation Proof */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  CALCULATION FORMULA & MATHEMATICAL PROOF
                </span>
                <div className="p-3 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                  <div className="text-slate-500 text-[11px]">Formula:</div>
                  <div>Reporting Compliance % = Qualifying Periods ÷ (Required - Approved Exceptions) × 100</div>
                  <div className="text-teal-700 font-bold pt-1">
                    Proof: {selectedAssessment.reportingMetrics.qualifyingPeriodsCompleted} ÷ (
                    {selectedAssessment.reportingMetrics.requiredPeriods} -{' '}
                    {selectedAssessment.reportingMetrics.approvedExceptionsCount}) ={' '}
                    {selectedAssessment.reportingMetrics.compliancePercentage}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                  <div>Required Periods: <strong>{selectedAssessment.reportingMetrics.requiredPeriods}</strong></div>
                  <div>Qualifying Submittals: <strong>{selectedAssessment.reportingMetrics.qualifyingPeriodsCompleted}</strong></div>
                  <div>Missing Periods: <strong>{selectedAssessment.reportingMetrics.missingPeriods}</strong></div>
                  <div>Excluded Exceptions: <strong>{selectedAssessment.reportingMetrics.approvedExceptionsCount}</strong></div>
                </div>
              </div>

              {/* Task Completion Breakdown */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  TASK COMPLETION BREAKDOWN (VERIFIED WORK OUTCOMES)
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>Tasks Due in Period: <strong>{selectedAssessment.taskMetrics.tasksDue}</strong></div>
                  <div>Tasks Accepted: <strong className="text-emerald-700">{selectedAssessment.taskMetrics.tasksAccepted}</strong></div>
                  <div>Tasks Blocked: <strong className="text-rose-600">{selectedAssessment.taskMetrics.tasksBlocked}</strong></div>
                  <div>Tasks Overdue: <strong className="text-rose-600">{selectedAssessment.taskMetrics.tasksOverdue}</strong></div>
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  Note: A field message is proof of communication, not task completion. Tasks require certified engineering inspection.
                </div>
              </div>

              {/* Approved Exceptions List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Approved Denominator Exceptions ({selectedAssessment.exceptions.length})
                </span>
                {selectedAssessment.exceptions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-50 border border-slate-200">
                    No exceptions recorded for this period.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedAssessment.exceptions.map((exc) => (
                      <div key={exc.id} className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-teal-900 capitalize">{exc.type.replace('_', ' ')}</strong>
                          <span className="font-mono text-[10px] font-bold text-teal-800">
                            -{exc.excludedPeriodsCount} period(s)
                          </span>
                        </div>
                        <p className="text-slate-800">{exc.reason}</p>
                        <div className="text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Ref: {exc.supportingEvidenceRef || 'None'}</span>
                          <span>Approved by: {exc.approvedBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviewer Notes */}
              {!isStakeholder && selectedAssessment.reviewerNotes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    PROJECT ENGINEER REVIEW NOTES
                  </span>
                  <p className="text-slate-800">{selectedAssessment.reviewerNotes}</p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Calculated at {selectedAssessment.lastCalculatedAt.slice(0, 10)}
              </span>
              <Button onClick={() => setSelectedAssessment(null)} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Exception Modal */}
      {exceptionModalTarget && (
        <PerformanceExceptionModal
          personnel={exceptionModalTarget}
          period="Week 42 (Oct 13 - Oct 19, 2026)"
          currentUser={user}
          onClose={() => setExceptionModalTarget(null)}
          onSuccess={(newExc) => {
            // Recalculate local state
            setAssessments((prev) =>
              prev.map((a) => {
                if (a.personnelId === newExc.personnelId) {
                  const newExceptionsCount =
                    a.reportingMetrics.approvedExceptionsCount + newExc.excludedPeriodsCount;
                  const eligible = Math.max(1, a.reportingMetrics.requiredPeriods - newExceptionsCount);
                  const newComp = Math.min(
                    100,
                    Math.round((a.reportingMetrics.qualifyingPeriodsCompleted / eligible) * 1000) / 10
                  );
                  return {
                    ...a,
                    reportingMetrics: {
                      ...a.reportingMetrics,
                      approvedExceptionsCount: newExceptionsCount,
                      missingPeriods: Math.max(0, eligible - a.reportingMetrics.qualifyingPeriodsCompleted),
                      compliancePercentage: newComp,
                    },
                    thresholdConfig: {
                      ...a.thresholdConfig,
                      status: newComp >= policy.complianceThresholdPercent ? 'meets_threshold' : 'below_threshold',
                    },
                    exceptions: [...a.exceptions, newExc],
                  };
                }
                return a;
              })
            );
            setFeedbackMessage(`Exception recorded for ${newExc.personnelName}. Denominator updated.`);
            setTimeout(() => setFeedbackMessage(null), 3500);
          }}
        />
      )}
    </div>
  );
}
