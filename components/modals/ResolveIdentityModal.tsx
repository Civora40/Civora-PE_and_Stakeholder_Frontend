'use client';

import React, { useState } from 'react';
import { X, UserCheck, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Submission, Personnel, CivoraUser } from '@/types';
import { Button } from '@/components/ui/Button';

interface ResolveIdentityModalProps {
  submission: Submission;
  personnelList: Personnel[];
  currentUser: CivoraUser;
  onClose: () => void;
  onSuccess: (updatedSub: Submission) => void;
}

export function ResolveIdentityModal({
  submission,
  personnelList,
  currentUser,
  onClose,
  onSuccess,
}: ResolveIdentityModalProps) {
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPerson = personnelList.find((p) => p.id === selectedPersonnelId);

  const handleResolve = async () => {
    if (!selectedPersonnelId) {
      setError('Please select a verified field personnel record.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/submissions/${submission.id}/resolve-identity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personnelId: selectedPersonnelId,
          note: note.trim() || 'Verified and mapped by Project Engineer.',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resolve identity.');
      }

      onSuccess(data.submission);
      onClose();
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Error resolving sender identity.');
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
          <div className="p-2.5 rounded-xl bg-[#001237] text-[#4FAAA7] border border-slate-800">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Resolve Sender Identity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Attribute unverified submission <strong className="font-mono text-[#001237]">{submission.identifier}</strong> to an approved personnel record.
            </p>
          </div>
        </div>

        {/* Audit Warning */}
        <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-slate-900 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#4FAAA7] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-slate-900">Audited Verification Procedure:</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Never guess identity from message signatures or writing style. Verify against confirmed phone numbers or site contact rosters. All identity mappings are permanently logged in the Civora audit trail.
            </p>
          </div>
        </div>

        {/* Source Sender Information */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Inbound Channel:</span>
            <span className="font-semibold uppercase text-slate-700">{submission.sourceChannel || 'WhatsApp'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Masked Contact Reference:</span>
            <span className="font-mono font-bold text-slate-900">{submission.maskedContactReference || 'Unknown'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Current Status:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
              Identity Needs Verification
            </span>
          </div>
        </div>

        {/* Target Personnel Selection */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Select Verified Personnel Record:
          </label>
          <select
            value={selectedPersonnelId}
            onChange={(e) => setSelectedPersonnelId(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
          >
            <option value="">-- Choose verified personnel --</option>
            {personnelList.map((person) => (
              <option key={person.id} value={person.id}>
                {person.fullName} — {person.professionalTitle} ({person.organization})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Personnel Summary Preview */}
        {selectedPerson && (
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs space-y-1">
            <div className="font-bold text-[#001237]">{selectedPerson.fullName}</div>
            <div className="text-[11px] text-slate-600">
              Title: <strong>{selectedPerson.professionalTitle}</strong> &bull; Dept: {selectedPerson.department}
            </div>
            <div className="text-[10px] text-slate-500">
              Reporting Cadence: {selectedPerson.expectedReportingCadence} &bull; Supervisor: {selectedPerson.supervisorName || 'Marcus Vance, PE'}
            </div>
          </div>
        )}

        {/* Verification Rationale */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Verification Reason / Evidence Note:
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Confirmed phone number with site manager on morning call..."
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
            Resolver: <strong>{currentUser.name}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={onClose} variant="outline" size="sm" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleResolve}
              variant="teal"
              size="sm"
              disabled={isSubmitting || !selectedPersonnelId}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {isSubmitting ? 'Resolving...' : 'Confirm Identity'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
