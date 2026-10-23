'use client';

import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  CheckCircle2,
  FileText,
  Eye,
  Sparkles,
  Phone,
  Send,
  UserCheck,
  Link2,
  Clock,
} from 'lucide-react';
import { Submission, CivoraUser, SubmissionStatus } from '@/types';
import { can } from '@/lib/permissions/rbac';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';
import { ResolveIdentityModal } from '@/components/modals/ResolveIdentityModal';
import { LinkTaskModal } from '@/components/modals/LinkTaskModal';
import { RequestInfoModal } from '@/components/modals/RequestInfoModal';
import { SubmissionDetailDrawer } from '@/components/drawers/SubmissionDetailDrawer';
import { DEMO_PERSONNEL, DEMO_TASKS } from '@/lib/mock-data/fixtures';

const CONTROLLED_CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'Site Work / Daily Progress', label: 'Site Work / Daily Progress' },
  { value: 'Health & Safety', label: 'Health & Safety' },
  { value: 'Quality / Inspection', label: 'Quality / Inspection' },
  { value: 'Materials & Deliveries', label: 'Materials & Deliveries' },
  { value: 'Equipment / Plant', label: 'Equipment / Plant' },
  { value: 'Workforce / Attendance', label: 'Workforce / Attendance' },
  { value: 'Delays / Blockers', label: 'Delays / Blockers' },
  { value: 'Testing / Commissioning', label: 'Testing / Commissioning' },
  { value: 'Environmental / Housekeeping', label: 'Environmental / Housekeeping' },
  { value: 'General Update', label: 'General Update' },
];

const CHANNEL_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Channels' },
  { value: 'whatsapp', label: 'WhatsApp Business' },
  { value: 'telegram', label: 'Telegram Bot' },
  { value: 'portal', label: 'Civora Portal' },
];

interface SubmissionsInboxProps {
  user: CivoraUser;
  submissions: Submission[];
}

export function SubmissionsInbox({ user, submissions: initialSubmissions }: SubmissionsInboxProps) {
  const [submissionsList, setSubmissionsList] = useState<Submission[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Review interaction state inside drawer
  const [engineerNotes, setEngineerNotes] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [retryingAttachmentId, setRetryingAttachmentId] = useState<string | null>(null);

  // Modals state
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isLinkTaskModalOpen, setIsLinkTaskModalOpen] = useState(false);
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);

  const canReview = can(user, 'submissions:review');

  // Filtered submissions list
  const filteredSubmissions = useMemo(() => {
    return submissionsList.filter((sub) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        sub.identifier.toLowerCase().includes(q) ||
        sub.title.toLowerCase().includes(q) ||
        sub.projectName.toLowerCase().includes(q) ||
        sub.subcontractor.toLowerCase().includes(q) ||
        (sub.senderName && sub.senderName.toLowerCase().includes(q)) ||
        (sub.senderRole && sub.senderRole.toLowerCase().includes(q)) ||
        (sub.description && sub.description.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'discrepancy'
          ? sub.aiFlag.status === 'advisory_discrepancy'
          : sub.reviewStatus === statusFilter;

      const matchesCategory =
        categoryFilter === 'all'
          ? true
          : sub.primaryCategory === categoryFilter || sub.reportingGroup === categoryFilter;

      const matchesChannel =
        channelFilter === 'all' ? true : sub.sourceChannel === channelFilter;

      const matchesVerification =
        verificationFilter === 'all'
          ? true
          : sub.senderVerificationStatus === verificationFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesChannel && matchesVerification;
    });
  }, [submissionsList, searchQuery, statusFilter, categoryFilter, channelFilter, verificationFilter]);

  // Tab counters
  const counts = useMemo(() => {
    return {
      all: submissionsList.length,
      pending: submissionsList.filter((s) => s.reviewStatus === 'pending_review').length,
      whatsapp: submissionsList.filter((s) => s.sourceChannel === 'whatsapp').length,
      telegram: submissionsList.filter((s) => s.sourceChannel === 'telegram').length,
      unverified: submissionsList.filter((s) => s.senderVerificationStatus === 'needs_verification').length,
      discrepancy: submissionsList.filter((s) => s.aiFlag.status === 'advisory_discrepancy').length,
    };
  }, [submissionsList]);

  const handleUpdateStatus = (newStatus: SubmissionStatus) => {
    if (!selectedSubmission || !canReview) return;

    const now = new Date().toISOString();
    const updated = submissionsList.map((s) => {
      if (s.id === selectedSubmission.id) {
        return {
          ...s,
          reviewStatus: newStatus,
          engineerNotes: engineerNotes || s.engineerNotes,
          reviewedBy: user.name,
          reviewedAt: now,
          history: [
            ...(s.history || []),
            {
              id: `h_${Date.now()}`,
              timestamp: now,
              actor: user.name,
              actorRole: user.role,
              action: `Review status updated to "${newStatus.replace('_', ' ')}". Note: ${engineerNotes || 'No notes added.'}`,
            },
          ],
        };
      }
      return s;
    });

    setSubmissionsList(updated);
    setSelectedSubmission((prev) =>
      prev
        ? {
            ...prev,
            reviewStatus: newStatus,
            engineerNotes: engineerNotes || prev.engineerNotes,
            reviewedBy: user.name,
            reviewedAt: now,
          }
        : null
    );

    setFeedbackMessage(`Submission ${selectedSubmission.identifier} updated to "${newStatus.replace('_', ' ')}".`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleRetryAttachment = async (attachmentId: string) => {
    if (!selectedSubmission) return;
    setRetryingAttachmentId(attachmentId);

    try {
      const res = await fetch(`/api/submissions/${selectedSubmission.id}/retry-attachment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attachmentId }),
      });
      const data = await res.json();
      if (res.ok && data.attachment) {
        // Update attachment in state
        const updatedSubs = submissionsList.map((s) => {
          if (s.id === selectedSubmission.id && s.attachments) {
            return {
              ...s,
              attachments: s.attachments.map((a) => (a.id === attachmentId ? data.attachment : a)),
            };
          }
          return s;
        });
        setSubmissionsList(updatedSubs);
        setSelectedSubmission((prev) => {
          if (!prev || !prev.attachments) return prev;
          return {
            ...prev,
            attachments: prev.attachments.map((a) => (a.id === attachmentId ? data.attachment : a)),
          };
        });
        setFeedbackMessage('Media attachment successfully retrieved from provider API.');
        setTimeout(() => setFeedbackMessage(null), 3500);
      }
    } catch {
      // ignore
    } finally {
      setRetryingAttachmentId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Field Submission & Messaging Inbox
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#001237] text-[#4FAAA7]">
              {counts.all} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {canReview
              ? 'Official ingestion pipeline for WhatsApp Business & Telegram field submissions. Review evidence, verify sender identity, and link to tasks.'
              : 'Read-only stakeholder inspection of incoming site reports, photographs, and laboratory test break sheets.'}
          </p>
        </div>

        {feedbackMessage && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-800 text-xs flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Quick Filter Chips Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => {
            setStatusFilter('all');
            setChannelFilter('all');
            setVerificationFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === 'all' && channelFilter === 'all' && verificationFilter === 'all'
              ? 'bg-[#001237] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Submissions</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-800 text-[10px]">
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter('pending_review');
            setChannelFilter('all');
            setVerificationFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === 'pending_review'
              ? 'bg-[#001237] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Awaiting Review</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
            {counts.pending}
          </span>
        </button>

        <button
          onClick={() => {
            setChannelFilter('whatsapp');
            setStatusFilter('all');
            setVerificationFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            channelFilter === 'whatsapp'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp Ingested</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 text-[10px]">
            {counts.whatsapp}
          </span>
        </button>

        <button
          onClick={() => {
            setChannelFilter('telegram');
            setStatusFilter('all');
            setVerificationFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            channelFilter === 'telegram'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-sky-600" />
          <span>Telegram Ingested</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 text-[10px]">
            {counts.telegram}
          </span>
        </button>

        <button
          onClick={() => {
            setVerificationFilter('needs_verification');
            setStatusFilter('all');
            setChannelFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            verificationFilter === 'needs_verification'
              ? 'bg-[#001237] text-[#4FAAA7] shadow-xs border border-[#4FAAA7]/50'
              : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-[#4FAAA7]" />
          <span>Identity Verification Queue</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#001237] text-[#4FAAA7] text-[10px] font-bold">
            {counts.unverified}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter('discrepancy');
            setChannelFilter('all');
            setVerificationFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === 'discrepancy'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#4FAAA7]" />
          <span>Advisory Discrepancies</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold">
            {counts.discrepancy}
          </span>
        </button>
      </div>

      {/* Main Filter Ribbon */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="pointer-events-none absolute inset-y-0 left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, sender, title, contractor, keywords..."
              className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Category dropdown */}
            <div className="w-60">
              <CustomSelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={CONTROLLED_CATEGORY_OPTIONS}
                variant="light"
              />
            </div>

            {/* Channel dropdown */}
            <div className="w-48">
              <CustomSelect
                value={channelFilter}
                onChange={setChannelFilter}
                options={CHANNEL_OPTIONS}
                variant="light"
              />
            </div>

            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || channelFilter !== 'all' || verificationFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setChannelFilter('all');
                  setVerificationFilter('all');
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submissions Table / Cards */}
      {filteredSubmissions.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Field Submittals Match Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, category classification, or channel filters to see matching submissions.
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
              setChannelFilter('all');
              setVerificationFilter('all');
            }}
            variant="outline"
            size="sm"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Submission & Channel</th>
                  <th className="p-3.5">Verified Sender & Discipline</th>
                  <th className="p-3.5">Project & Category</th>
                  <th className="p-3.5">Evidence & Files</th>
                  <th className="p-3.5">AI Advisory</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredSubmissions.map((sub) => {
                  const hasFailedAttachment = sub.attachments?.some((a) => a.processingStatus === 'failed');
                  const isUnverified = sub.senderVerificationStatus === 'needs_verification';

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setEngineerNotes(sub.engineerNotes || '');
                      }}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isUnverified ? 'bg-slate-50/80 border-l-2 border-l-[#4FAAA7]' : ''
                      }`}
                    >
                      {/* 1. Identifier & Channel */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#001237]">
                            {sub.identifier}
                          </span>
                          {sub.sourceChannel === 'whatsapp' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <Phone className="w-2.5 h-2.5 text-emerald-600" />
                              WhatsApp
                            </span>
                          ) : sub.sourceChannel === 'telegram' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                              <Send className="w-2.5 h-2.5 text-sky-600" />
                              Telegram
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                              Portal
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-900 mt-1 line-clamp-1">
                          {sub.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Received: {sub.receivedDate.slice(0, 16).replace('T', ' ')}</span>
                        </div>
                      </td>

                      {/* 2. Sender & Professional Role */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{sub.senderName || sub.submittedBy}</span>
                          {isUnverified ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                              Unverified
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {sub.senderRole || 'Field Professional'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sub.senderDepartment || sub.subcontractor} &bull; <span className="font-mono">{sub.maskedContactReference || 'Masked Phone'}</span>
                        </div>
                      </td>

                      {/* 3. Project & Category */}
                      <td className="p-3.5">
                        <div className="text-slate-800 font-medium line-clamp-1 max-w-xs">
                          {sub.projectName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="blue" size="sm">
                            {sub.primaryCategory || sub.reportingGroup}
                          </Badge>
                          {sub.isSuggestedCategory && (
                            <span className="text-[9px] text-[#4FAAA7] font-semibold italic">
                              AI Suggested
                            </span>
                          )}
                        </div>
                        {sub.linkedTaskTitle && (
                          <div className="text-[10px] text-indigo-700 font-semibold flex items-center gap-1 mt-1">
                            <Link2 className="w-3 h-3 text-indigo-500" />
                            <span className="line-clamp-1">Task: {sub.linkedTaskTitle}</span>
                          </div>
                        )}
                      </td>

                      {/* 4. Evidence & Files */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px]">
                            <FileText className="w-3.5 h-3.5 text-[#4FAAA7]" />
                            {sub.attachments?.length || sub.evidenceItems?.length || 0} Files
                          </span>
                          {hasFailedAttachment && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              Media Error
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Private Object Storage
                        </div>
                      </td>

                      {/* 5. AI Advisory */}
                      <td className="p-3.5">
                        {sub.aiFlag.status === 'advisory_discrepancy' ? (
                          <div className="flex flex-col gap-0.5">
                            <Badge variant="blue" size="sm" dot>
                              Spec Variance
                            </Badge>
                            <span className="text-[10px] text-slate-600 line-clamp-1 max-w-xs">
                              {sub.aiFlag.specRef}
                            </span>
                          </div>
                        ) : sub.aiFlag.status === 'unverified' ? (
                          <Badge variant="blue" size="sm" dot>
                            Identity Pending
                          </Badge>
                        ) : (
                          <Badge variant="emerald" size="sm">
                            Spec Compliant
                          </Badge>
                        )}
                      </td>

                      {/* 6. Status */}
                      <td className="p-3.5">
                        <Badge
                          variant={
                            sub.reviewStatus === 'approved'
                              ? 'emerald'
                              : sub.reviewStatus === 'needs_information'
                              ? 'rose'
                              : sub.reviewStatus === 'pending_review'
                              ? 'blue'
                              : sub.reviewStatus === 'needs_verification'
                              ? 'blue'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {sub.reviewStatus.replace('_', ' ')}
                        </Badge>
                      </td>

                      {/* 7. Action */}
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
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submission Detail Side Drawer */}
      <SubmissionDetailDrawer
        submission={selectedSubmission}
        user={user}
        canReview={canReview}
        engineerNotes={engineerNotes}
        setEngineerNotes={setEngineerNotes}
        retryingAttachmentId={retryingAttachmentId}
        onClose={() => setSelectedSubmission(null)}
        onOpenResolveModal={() => setIsResolveModalOpen(true)}
        onOpenLinkTaskModal={() => setIsLinkTaskModalOpen(true)}
        onOpenRequestInfoModal={() => setIsRequestInfoModalOpen(true)}
        onRetryAttachment={handleRetryAttachment}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Resolve Identity Modal */}
      {isResolveModalOpen && selectedSubmission && (
        <ResolveIdentityModal
          submission={selectedSubmission}
          personnelList={DEMO_PERSONNEL}
          currentUser={user}
          onClose={() => setIsResolveModalOpen(false)}
          onSuccess={(updatedSub) => {
            setSubmissionsList((prev) =>
              prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
            );
            setSelectedSubmission(updatedSub);
            setFeedbackMessage(`Identity successfully resolved for ${updatedSub.identifier}.`);
            setTimeout(() => setFeedbackMessage(null), 3500);
          }}
        />
      )}

      {/* Link Task Modal */}
      {isLinkTaskModalOpen && selectedSubmission && (
        <LinkTaskModal
          submission={selectedSubmission}
          tasks={DEMO_TASKS}
          currentUser={user}
          onClose={() => setIsLinkTaskModalOpen(false)}
          onSuccess={(updatedSub) => {
            setSubmissionsList((prev) =>
              prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
            );
            setSelectedSubmission(updatedSub);
            setFeedbackMessage(`Submission ${updatedSub.identifier} linked to task.`);
            setTimeout(() => setFeedbackMessage(null), 3500);
          }}
        />
      )}

      {/* Request Info Modal */}
      {isRequestInfoModalOpen && selectedSubmission && (
        <RequestInfoModal
          submission={selectedSubmission}
          currentUser={user}
          onClose={() => setIsRequestInfoModalOpen(false)}
          onSuccess={(updatedSub) => {
            setSubmissionsList((prev) =>
              prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
            );
            setSelectedSubmission(updatedSub);
            setFeedbackMessage(`Information request dispatched to submitter.`);
            setTimeout(() => setFeedbackMessage(null), 3500);
          }}
        />
      )}
    </div>
  );
}
