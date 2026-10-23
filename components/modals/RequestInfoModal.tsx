'use client';

import React, { useState } from 'react';
import { X, Send, AlertTriangle, MessageSquare, Phone } from 'lucide-react';
import { Submission, SourceChannel, CivoraUser } from '@/types';
import { Button } from '@/components/ui/Button';

interface RequestInfoModalProps {
  submission: Submission;
  currentUser: CivoraUser;
  onClose: () => void;
  onSuccess: (updatedSub: Submission) => void;
}

export function RequestInfoModal({
  submission,
  currentUser,
  onClose,
  onSuccess,
}: RequestInfoModalProps) {
  const [channel, setChannel] = useState<SourceChannel>(submission.sourceChannel || 'whatsapp');
  const [queryText, setQueryText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!queryText.trim()) {
      setError('Please specify the information or document required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/submissions/${submission.id}/request-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryText: queryText.trim(),
          channel,
          dueDate: dueDate || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch request.');
      }

      onSuccess(data.submission);
      onClose();
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Error dispatching request for information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="rounded-2xl bg-white border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Request Missing Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send technical clarification request to submitter via approved messaging channel.
            </p>
          </div>
        </div>

        {/* Recipient Card */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-semibold">Recipient:</span>
            <span className="font-bold text-slate-900">{submission.senderName || submission.submittedBy}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Verified Contact:</span>
            <span className="font-mono">{submission.maskedContactReference || 'Masked Mobile'}</span>
          </div>
        </div>

        {/* Channel Selection */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">Outbound Notification Channel:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                channel === 'whatsapp'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Business</span>
            </button>
            <button
              type="button"
              onClick={() => setChannel('telegram')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                channel === 'telegram'
                  ? 'bg-sky-50 border-sky-500 text-sky-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>Telegram Bot</span>
            </button>
          </div>
        </div>

        {/* Query Input */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Information / Clarification Required:
          </label>
          <textarea
            rows={3}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="e.g. Please provide 14-day compressive break curve and confirm curing water temperature..."
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
          />
        </div>

        {/* Optional Due Date */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">Response Deadline (Optional):</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
          />
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            Requester: <strong>{currentUser.name}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={onClose} variant="outline" size="sm" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              variant="destructive"
              size="sm"
              disabled={isSubmitting || !queryText.trim()}
              leftIcon={<Send className="w-4 h-4" />}
            >
              {isSubmitting ? 'Sending...' : 'Dispatch Request'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
