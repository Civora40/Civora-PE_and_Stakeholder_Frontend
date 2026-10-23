'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { Personnel, ExceptionType, CivoraUser, PerformanceException } from '@/types';
import { Button } from '@/components/ui/Button';

interface PerformanceExceptionModalProps {
  personnel: Personnel;
  period: string;
  currentUser: CivoraUser;
  onClose: () => void;
  onSuccess: (newException: PerformanceException) => void;
}

export function PerformanceExceptionModal({
  personnel,
  period,
  currentUser,
  onClose,
  onSuccess,
}: PerformanceExceptionModalProps) {
  const [type, setType] = useState<ExceptionType>('approved_leave');
  const [reason, setReason] = useState('');
  const [excludedPeriodsCount, setExcludedPeriodsCount] = useState<number>(1);
  const [supportingEvidenceRef, setSupportingEvidenceRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a documented justification for this adjustment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personnelId: personnel.id,
          personnelName: personnel.fullName,
          period,
          type,
          reason: reason.trim(),
          excludedPeriodsCount,
          supportingEvidenceRef: supportingEvidenceRef.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record performance exception.');
      }

      onSuccess(data.exception);
      onClose();
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Error recording exception.');
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
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-[#4FAAA7] border border-teal-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Record Performance Adjustment / Exception
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exclude legitimate absences, site closures, or reassignments from the compliance denominator.
            </p>
          </div>
        </div>

        {/* Subject Information */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-semibold">Personnel:</span>
            <span className="font-bold text-slate-900">{personnel.fullName}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Professional Title:</span>
            <span>{personnel.professionalTitle}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#4FAAA7]" />
              Reporting Period:
            </span>
            <span className="font-medium text-slate-800">{period}</span>
          </div>
        </div>

        {/* Exception Category */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">Approved Adjustment Category:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ExceptionType)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
          >
            <option value="approved_leave">Approved Leave / Technical Training</option>
            <option value="site_closure">Site Closure / Public Holiday</option>
            <option value="reassigned_duty">Reassigned Off-Site Engineering Duty</option>
            <option value="weather_delay">Severe Weather / Force Majeure Event</option>
            <option value="data_correction">Telemetry Data Correction</option>
            <option value="other_approved_reason">Other Approved Operational Reason</option>
          </select>
        </div>

        {/* Excluded Periods Count */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Number of Periods to Exclude from Denominator:
          </label>
          <input
            type="number"
            min={1}
            max={7}
            value={excludedPeriodsCount}
            onChange={(e) => setExcludedPeriodsCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
          />
          <span className="text-[10px] text-slate-400">
            This value will be subtracted from the required reporting periods denominator.
          </span>
        </div>

        {/* Reason / Explanation */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Documented Justification / Reason:
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Formal approval by lead engineer for annual structural symposium..."
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
          />
        </div>

        {/* Supporting Evidence Reference */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Supporting Document / Memo Ref (Optional):
          </label>
          <input
            type="text"
            value={supportingEvidenceRef}
            onChange={(e) => setSupportingEvidenceRef(e.target.value)}
            placeholder="e.g. MEMO-HR-2026-081 or MET-LOG-LAGOS-1014"
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
            Approver: <strong>{currentUser.name}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={onClose} variant="outline" size="sm" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="teal"
              size="sm"
              disabled={isSubmitting || !reason.trim()}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {isSubmitting ? 'Recording...' : 'Approve & Apply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
