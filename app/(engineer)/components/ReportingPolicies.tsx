'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { ReportingPolicy, CivoraUser } from '@/types';
import { can } from '@/lib/permissions/rbac';
import { Button } from '@/components/ui/Button';

interface ReportingPoliciesProps {
  user: CivoraUser;
  initialPolicy: ReportingPolicy;
}

export function ReportingPolicies({
  user,
  initialPolicy,
}: ReportingPoliciesProps) {
  const [policy, setPolicy] = useState<ReportingPolicy>(initialPolicy);
  const [threshold, setThreshold] = useState<number>(initialPolicy.complianceThresholdPercent);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const canManagePolicies = can(user, 'policies:manage');

  const handleSavePolicy = async () => {
    if (!canManagePolicies) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/performance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complianceThresholdPercent: threshold,
        }),
      });

      const data = await res.json();
      if (res.ok && data.policy) {
        setPolicy(data.policy);
        setFeedbackMessage(`Reporting policy updated to ${threshold}% baseline (Version: ${data.policy.version}).`);
        setTimeout(() => setFeedbackMessage(null), 3500);
      }
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            Reporting & Compliance Policy Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure client proposed compliance thresholds, role-specific reporting cadences, and approved exclusion categories.
          </p>
        </div>

        {feedbackMessage && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Legal & Payroll Decoupling Notice */}
      <div className="rounded-2xl bg-teal-500/10 border border-teal-500/30 p-4 space-y-2 text-xs text-slate-900">
        <div className="flex items-center gap-2 font-bold text-[#001237]">
          <ShieldAlert className="w-4 h-4 text-[#4FAAA7]" />
          <span>Statutory Governance & Payroll Decoupling Notice</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {policy.payrollDecoupledNotice}
        </p>
      </div>

      {/* Threshold Setting Card */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Compliance Threshold Setting
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Client proposed guideline range: 75% to 80%.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded border border-teal-200">
            Version: {policy.version}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-700">Baseline Compliance Target:</label>
            <span className="font-mono text-lg font-black text-slate-900">{threshold}%</span>
          </div>

          <input
            type="range"
            min={50}
            max={100}
            step={5}
            disabled={!canManagePolicies}
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#001237]"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>50% (Lenient)</span>
            <span className="text-teal-700 font-bold">75% (Client Proposed Standard)</span>
            <span className="text-slate-700 font-bold">80% (Strict)</span>
            <span>100% (Strict Daily)</span>
          </div>
        </div>

        {canManagePolicies && (
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <Button
              onClick={handleSavePolicy}
              variant="teal"
              size="sm"
              disabled={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              {isSaving ? 'Updating Policy...' : 'Save Policy Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Expected Cadence by Discipline */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm">
          Reporting Cadence Expectations by Discipline
        </h3>
        <p className="text-xs text-slate-500">
          Determines the weekly denominator (e.g. daily = 6 working periods/week).
        </p>

        <div className="divide-y divide-slate-100 text-xs">
          {Object.entries(policy.cadenceByRole).map(([role, cadence]) => (
            <div key={role} className="py-2.5 flex items-center justify-between">
              <span className="font-semibold text-slate-800">{role}</span>
              <span className="font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                {cadence.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Approved Exception Categories */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm">
          Approved Denominator Exclusion Categories
        </h3>
        <p className="text-xs text-slate-500">
          Legitimate events that subtract periods from the calculation denominator when verified by a Project Engineer.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {policy.approvedExceptionTypes.map((type) => (
            <div key={type} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-800 capitalize">
                {type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
