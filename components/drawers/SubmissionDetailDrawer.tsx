'use client';

import React from 'react';
import {
  X,
  Phone,
  Send,
  UserCheck,
  ShieldAlert,
  Sparkles,
  FileText,
  RefreshCw,
  Download,
  Link2,
  MessageSquare,
  Lock,
  FileCheck2,
} from 'lucide-react';
import { Submission, CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SubmissionDetailDrawerProps {
  submission: Submission | null;
  user: CivoraUser;
  canReview: boolean;
  engineerNotes: string;
  setEngineerNotes: (notes: string) => void;
  retryingAttachmentId: string | null;
  onClose: () => void;
  onOpenResolveModal: () => void;
  onOpenLinkTaskModal: () => void;
  onOpenRequestInfoModal: () => void;
  onRetryAttachment: (attId: string) => void;
  onUpdateStatus: (status: 'approved' | 'rejected' | 'needs_information') => void;
}

export function SubmissionDetailDrawer({
  submission,
  user,
  canReview,
  engineerNotes,
  setEngineerNotes,
  retryingAttachmentId,
  onClose,
  onOpenResolveModal,
  onOpenLinkTaskModal,
  onOpenRequestInfoModal,
  onRetryAttachment,
  onUpdateStatus,
}: SubmissionDetailDrawerProps) {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 text-slate-900">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between sticky top-0 z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-[#001237]">
                {submission.identifier}
              </span>
              {submission.sourceChannel === 'whatsapp' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  WhatsApp Business
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  <Send className="w-3 h-3 text-sky-600" />
                  Telegram Bot
                </span>
              )}
              <Badge
                variant={
                  submission.reviewStatus === 'approved'
                    ? 'emerald'
                    : submission.reviewStatus === 'needs_information'
                    ? 'rose'
                    : 'blue'
                }
                size="sm"
              >
                Status: {submission.reviewStatus.replace('_', ' ')}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              {submission.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Project: <strong>{submission.projectName}</strong> &bull; Received:{' '}
              {submission.receivedDate.slice(0, 16).replace('T', ' ')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* 1. Verified Sender Panel */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                FIELD SUBMITTER IDENTITY
              </span>
              {submission.senderVerificationStatus === 'verified' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <UserCheck className="w-3.5 h-3.5" />
                  Verified Submitter
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Identity Needs Verification
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Full Name:</span>
                <strong className="text-slate-900 font-semibold">{submission.senderName || submission.submittedBy}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Professional Role / Discipline:</span>
                <strong className="text-slate-900 font-semibold">{submission.senderRole || 'Site Engineer / QA'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Department:</span>
                <span className="text-slate-700">{submission.senderDepartment || submission.subcontractor}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Civora System RBAC Role:</span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {submission.senderCivoraRole ? submission.senderCivoraRole : 'Field Submitter (No Direct Login)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Masked Verified Contact:</span>
                <span className="font-mono text-slate-800 font-semibold">{submission.maskedContactReference || 'Unregistered'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Platform Provider Message ID:</span>
                <span className="font-mono text-[10px] text-slate-500 truncate block">
                  {submission.providerMessageId || 'N/A'}
                </span>
              </div>
            </div>

            {submission.senderVerificationStatus === 'needs_verification' && canReview && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-medium">
                  Unmapped phone number detected.
                </span>
                <Button
                  onClick={onOpenResolveModal}
                  variant="teal"
                  size="sm"
                  leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                >
                  Resolve Identity
                </Button>
              </div>
            )}
          </div>

          {/* 2. Original Message & Caption */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Original Inbound Message (Immutable Field Communication)
            </span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
              {submission.description}
            </div>
          </div>

          {/* 3. AI Suggestions for Review */}
          <div
            className={`p-4 rounded-xl border space-y-2 text-xs ${
              submission.aiFlag.status === 'advisory_discrepancy'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-950'
                : submission.aiFlag.status === 'unverified'
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-950'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4FAAA7]" />
                <span>
                  {submission.aiFlag.status === 'advisory_discrepancy'
                    ? 'Suggestions for Review: Potential Specification Variance'
                    : submission.aiFlag.status === 'unverified'
                    ? 'Suggestions for Review: Unverified Field Contact'
                    : 'Suggestions for Review: Specification Compliant'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/60 font-mono">
                Confidence: {Math.round((submission.aiFlag.confidence || 0.9) * 100)}%
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {submission.aiFlag.message}
            </p>
            <div className="text-[11px] font-mono text-[#001237] font-semibold pt-1">
              Governing Baseline: {submission.aiFlag.specRef}
            </div>
            <div className="text-[10px] text-slate-500 border-t border-slate-200/80 pt-1.5 italic">
              {submission.aiFlag.disclaimer}
            </div>
          </div>

          {/* 4. Private Object Storage Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Private Evidence Storage ({submission.attachments?.length || submission.evidenceItems?.length || 0} Files)
              </span>
              <span className="text-[10px] text-slate-400">Authenticated Signed URLs</span>
            </div>

            <div className="space-y-2">
              {(submission.attachments || []).map((att) => (
                <div
                  key={att.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    att.processingStatus === 'failed'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {att.thumbnailUrl ? (
                      <img
                        src={att.thumbnailUrl}
                        alt={att.originalFilename}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500">
                        <FileText className="w-5 h-5 text-[#4FAAA7]" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900">{att.originalFilename}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {att.fileSizeFormatted} &bull; {att.mimeType} &bull; Key: {att.storageKey.slice(0, 24)}...
                      </div>
                      {att.errorMessage && (
                        <div className="text-[10px] text-rose-700 font-medium mt-0.5">
                          {att.errorMessage}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {att.processingStatus === 'failed' ? (
                      <Button
                        onClick={() => onRetryAttachment(att.id)}
                        variant="destructive"
                        size="sm"
                        disabled={retryingAttachmentId === att.id}
                        leftIcon={<RefreshCw className={`w-3 h-3 ${retryingAttachmentId === att.id ? 'animate-spin' : ''}`} />}
                      >
                        {retryingAttachmentId === att.id ? 'Retrying...' : 'Retry Download'}
                      </Button>
                    ) : (
                      <a
                        href={att.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#4FAAA7]" />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Linked Task Section */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ASSIGNED PROJECT TASK LINKAGE
              </span>
              {canReview && (
                <button
                  onClick={onOpenLinkTaskModal}
                  className="text-xs text-[#001237] hover:text-[#4FAAA7] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{submission.linkedTaskId ? 'Change Task Link' : 'Link to Task'}</span>
                </button>
              )}
            </div>

            {submission.linkedTaskTitle ? (
              <div className="text-xs space-y-1">
                <div className="font-semibold text-slate-900">{submission.linkedTaskTitle}</div>
                <div className="text-[11px] text-slate-500">
                  Task Reference: <strong className="font-mono text-[#001237]">{submission.linkedTaskId}</strong>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Not linked to any task. A submission represents communication evidence; linking connects it to project progress.
              </p>
            )}
          </div>

          {/* 6. Outstanding Information Requests */}
          {(submission.informationRequests?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Outstanding Information Requests
              </span>
              <div className="space-y-2">
                {submission.informationRequests?.map((req) => (
                  <div key={req.id} className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#001237]">Query via {req.channel.toUpperCase()}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#001237] text-[#4FAAA7] uppercase">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-800">{req.queryText}</p>
                    <div className="text-[10px] text-slate-500">
                      Requested by {req.requestedBy} on {req.requestedAt.slice(0, 10)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Traceable Review History */}
          {(submission.history?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Traceable Audit & Review History
              </span>
              <div className="space-y-1.5 border-l-2 border-slate-200 pl-3 ml-1">
                {submission.history?.map((h) => (
                  <div key={h.id} className="text-xs space-y-0.5">
                    <div className="text-[11px] font-semibold text-slate-900">{h.action}</div>
                    <div className="text-[10px] text-slate-500">
                      {h.actor} ({h.actorRole}) &bull; {h.timestamp.slice(0, 16).replace('T', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Engineer Notes Input */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#4FAAA7]" />
              <span>Project Engineer Review Notes:</span>
            </label>
            <textarea
              disabled={!canReview}
              rows={2}
              value={engineerNotes}
              onChange={(e) => setEngineerNotes(e.target.value)}
              placeholder={
                canReview
                  ? 'Record engineering evaluation notes or rationale...'
                  : 'Notes are read-only under current role credentials.'
              }
              className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-900 text-xs focus:bg-white focus:border-[#4FAAA7] focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
          <div className="text-[11px] text-slate-500">
            {canReview ? (
              <span>
                Logged in as <strong>{user.name}</strong> ({user.role})
              </span>
            ) : (
              <span className="text-slate-600 flex items-center gap-1 font-medium">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Read-only stakeholder mode.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {canReview && (
              <>
                <Button
                  onClick={onOpenRequestInfoModal}
                  variant="outline"
                  size="sm"
                >
                  Request Info
                </Button>
                <Button
                  onClick={() => onUpdateStatus('rejected')}
                  variant="destructive"
                  size="sm"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => onUpdateStatus('approved')}
                  variant="teal"
                  size="sm"
                  leftIcon={<FileCheck2 className="w-4 h-4" />}
                >
                  Approve Submittal
                </Button>
              </>
            )}
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
