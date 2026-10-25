'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Clock,
  Eye,
  Lock,
  Globe,
  Monitor,
  CheckCircle2,
  Save,
  Key,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';

interface StakeholderSettingsProps {
  user: CivoraUser;
}

export function StakeholderSettings({ user }: StakeholderSettingsProps) {
  const [timezone, setTimezone] = useState('WAT');
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY');
  const [highContrast, setHighContrast] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Workspace Settings"
        description="Manage your institutional display preferences, regional time standards, and session security parameters."
      />


      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">Workspace configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Regional & Time Preferences */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-[#3B68DE]" />
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              Regional & Date Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Display Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium"
              >
                <option value="WAT">West Africa Time (WAT, UTC+1) — Lagos</option>
                <option value="GMT">Greenwich Mean Time (GMT, UTC+0) — London</option>
                <option value="EST">Eastern Standard Time (EST, UTC-5) — New York</option>
                <option value="CET">Central European Time (CET, UTC+1) — Frankfurt</option>
              </select>
              <p className="text-[11px] text-slate-400">
                All meeting schedules and report release stamps will display in this timezone.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Standard Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium"
              >
                <option value="DD MMM YYYY">25 Oct 2026 (British / Nigerian Standard)</option>
                <option value="YYYY-MM-DD">2026-10-25 (ISO 8601)</option>
                <option value="MM/DD/YYYY">10/25/2026 (US Standard)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Format applied across milestone schedules and transmittal registers.
              </p>
            </div>
          </div>
        </div>

        {/* Display & Accessibility */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Monitor className="w-5 h-5 text-[#3B68DE]" />
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              Display & Accessibility
            </h2>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                Enhanced High-Contrast Table Gridlines
              </span>
              <p className="text-[11px] text-slate-500">
                Increases border visibility and contrast for tabular document registers and milestone progress gates.
              </p>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
            />
          </div>
        </div>

        {/* Security & Inactivity Session Control */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-5 h-5 text-[#3B68DE]" />
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              Session Governance & Security
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Inactivity Auto-Lock Interval</label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium"
              >
                <option value="15">15 Minutes (High Security Mode)</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">60 Minutes</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Stakeholder session token automatically invalidates after this duration of inactivity.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Institutional Authenticator Status</label>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-700 font-medium">Multi-Factor Authentication (MFA)</span>
                <Badge variant="emerald" size="sm">
                  Active
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">
                Managed via corporate identity provider SSO integration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Apply Workspace Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
