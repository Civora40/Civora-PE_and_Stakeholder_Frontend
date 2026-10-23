'use client';

import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  CheckCircle2,
  FileText,
  FileCheck2,
  Eye,
  X,
  Lock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Submission, CivoraUser, SubmissionStatus } from '@/types';
import { can } from '@/lib/permissions/rbac';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';

const REPORTING_GROUP_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Reporting Groups' },
  { value: 'Structural Concrete', label: 'Structural Concrete' },
  { value: 'Reinforcing Steel', label: 'Reinforcing Steel' },
  { value: 'Geotechnical / Shoring', label: 'Geotechnical / Shoring' },
  { value: 'Building Envelope', label: 'Building Envelope' },
  { value: 'Marine Geotechnical', label: 'Marine Geotechnical' },
];

interface SubmissionsInboxProps {
  user: CivoraUser;
  submissions: Submission[];
}

export function SubmissionsInbox({ user, submissions: initialSubmissions }: SubmissionsInboxProps) {
  const [submissionsList, setSubmissionsList] = useState<Submission[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Review interaction state inside drawer
  const [engineerNotes, setEngineerNotes] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const canReview = can(user, 'submissions:review');

  const filteredSubmissions = useMemo(() => {
    return submissionsList.filter((sub) => {
      const matchesSearch =
        sub.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subcontractor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ? true : sub.reviewStatus === statusFilter;

      const matchesGroup =
        groupFilter === 'all' ? true : sub.reportingGroup === groupFilter;

      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [submissionsList, searchQuery, statusFilter, groupFilter]);

  const handleUpdateStatus = (newStatus: SubmissionStatus) => {
    if (!selectedSubmission || !canReview) return;

    const updated = submissionsList.map((s) => {
      if (s.id === selectedSubmission.id) {
        return {
          ...s,
          reviewStatus: newStatus,
          engineerNotes: engineerNotes || s.engineerNotes,
          reviewedBy: user.name,
          reviewedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    setSubmissionsList(updated);
    setSelectedSubmission({
      ...selectedSubmission,
      reviewStatus: newStatus,
      engineerNotes: engineerNotes || selectedSubmission.engineerNotes,
      reviewedBy: user.name,
      reviewedAt: new Date().toISOString(),
    });

    setFeedbackMessage(`Submission ${selectedSubmission.identifier} updated to "${newStatus.replace('_', ' ')}".`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            Submittal Verification Inbox
          </h1>
          <p className="text-xs text-slate-500">
            {canReview
              ? 'Evaluate contractor lab reports, verify AI discrepancy advisories, and record engineering decisions.'
              : 'Read-only stakeholder audit inspection of field submissions and laboratory certifications.'}
          </p>
        </div>

        {feedbackMessage && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Filter Ribbon */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, contractor..."
              className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
              {[
                { label: 'All', value: 'all' },
                { label: 'Pending PE', value: 'pending_review' },
                { label: 'Received', value: 'received' },
                { label: 'Needs Info', value: 'needs_information' },
                { label: 'Approved', value: 'approved' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setStatusFilter(item.value)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === item.value
                      ? 'bg-[#001237] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Reporting Group dropdown */}
            <div className="w-56">
              <CustomSelect
                value={groupFilter}
                onChange={setGroupFilter}
                options={REPORTING_GROUP_OPTIONS}
                variant="light"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      {filteredSubmissions.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center space-y-3 shadow-sm">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Submittals Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or status filter to view available records.
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setGroupFilter('all');
            }}
            variant="outline"
            size="sm"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Identifier & Title</th>
                  <th className="p-3.5">Project Scope</th>
                  <th className="p-3.5">Reporting Group</th>
                  <th className="p-3.5">AI Advisory Flag</th>
                  <th className="p-3.5">Review Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setEngineerNotes(sub.engineerNotes || '');
                    }}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5">
                      <div className="font-mono text-xs font-bold text-[#4FAAA7]">
                        {sub.identifier}
                      </div>
                      <div className="font-semibold text-slate-900 mt-0.5">{sub.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Subcontractor: {sub.subcontractor}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 font-medium">{sub.projectName}</div>
                      <div className="text-[10px] text-slate-400">
                        Received: {sub.receivedDate.slice(0, 10)}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="blue" size="sm">
                        {sub.reportingGroup}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      {sub.aiFlag.status === 'advisory_discrepancy' ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant="amber" size="sm" dot>
                            AI Advisory: Discrepancy
                          </Badge>
                          <span className="text-[10px] text-amber-700 line-clamp-1 max-w-xs">
                            {sub.aiFlag.specRef}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="emerald" size="sm">
                          AI: Spec Compliant
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          sub.reviewStatus === 'approved'
                            ? 'emerald'
                            : sub.reviewStatus === 'needs_information'
                            ? 'rose'
                            : sub.reviewStatus === 'pending_review'
                            ? 'amber'
                            : 'slate'
                        }
                        size="sm"
                      >
                        {sub.reviewStatus.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubmission(sub);
                          setEngineerNotes(sub.engineerNotes || '');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#001237] hover:text-white text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspection Drawer / Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="rounded-2xl bg-white border border-slate-200 max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8 text-slate-900">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              aria-label="Close inspection view"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[#4FAAA7]">
                  {selectedSubmission.identifier}
                </span>
                <Badge variant="blue" size="sm">
                  {selectedSubmission.reportingGroup}
                </Badge>
                <Badge
                  variant={
                    selectedSubmission.reviewStatus === 'approved'
                      ? 'emerald'
                      : selectedSubmission.reviewStatus === 'needs_information'
                      ? 'rose'
                      : 'amber'
                  }
                  size="sm"
                >
                  Status: {selectedSubmission.reviewStatus.replace('_', ' ')}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                {selectedSubmission.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Project: {selectedSubmission.projectName} &bull; Subcontractor: {selectedSubmission.subcontractor}
              </p>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <span className="text-slate-500 block font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Submission Description:
              </span>
              <p>{selectedSubmission.description}</p>
            </div>

            {/* AI Flag / Advisory Box */}
            <div
              className={`p-4 rounded-xl border space-y-2 text-xs ${
                selectedSubmission.aiFlag.status === 'advisory_discrepancy'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-[#4FAAA7]" />
                <span>
                  {selectedSubmission.aiFlag.status === 'advisory_discrepancy'
                    ? 'AI Advisory Suggestion: Potential Specification Variance'
                    : 'AI Advisory Check: Within Tolerances'}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {selectedSubmission.aiFlag.message}
              </p>
              <div className="text-[11px] font-mono text-[#001237] font-semibold pt-1">
                Governing Spec: {selectedSubmission.aiFlag.specRef}
              </div>
              <div className="text-[10px] text-slate-500 border-t border-slate-200/80 pt-1.5 italic">
                {selectedSubmission.aiFlag.disclaimer}
              </div>
            </div>

            {/* Original Evidence Attachments */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Original Verified Evidence Files ({selectedSubmission.evidenceItems.length})
              </h3>
              <div className="space-y-2">
                {selectedSubmission.evidenceItems.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#4FAAA7]" />
                      <div>
                        <div className="font-medium text-slate-900">{ev.title}</div>
                        <div className="text-[10px] text-slate-500">
                          {ev.filename} &bull; {ev.size} &bull; Logged: {ev.timestamp}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-medium">
                      Checksum Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineer Notes Input */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Project Engineer Technical Rationale / Notes:</span>
              </label>
              <textarea
                disabled={!canReview}
                rows={3}
                value={engineerNotes}
                onChange={(e) => setEngineerNotes(e.target.value)}
                placeholder={
                  canReview
                    ? 'Enter engineering review notes or justification before approving...'
                    : 'Notes are read-only under current role credentials.'
                }
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-900 text-xs focus:bg-white focus:border-[#4FAAA7] focus:outline-none disabled:opacity-60"
              />
            </div>

            {/* Gated Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                {canReview ? (
                  <span>
                    Logged in as <strong className="text-slate-800">{user.name}</strong> ({user.role})
                  </span>
                ) : (
                  <span className="text-amber-800 flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Read-only: Technical review requires Project Engineer or Admin credentials.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {canReview && (
                  <>
                    <Button
                      onClick={() => handleUpdateStatus('needs_information')}
                      variant="outline"
                      size="sm"
                    >
                      Request Info
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus('rejected')}
                      variant="destructive"
                      size="sm"
                    >
                      Reject Submittal
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus('approved')}
                      variant="teal"
                      size="sm"
                      leftIcon={<FileCheck2 className="w-4 h-4" />}
                    >
                      Approve Submittal
                    </Button>
                  </>
                )}
                <Button onClick={() => setSelectedSubmission(null)} variant="outline" size="sm">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
