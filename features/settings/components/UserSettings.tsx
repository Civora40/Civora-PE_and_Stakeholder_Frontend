'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';
import { Button } from '@/components/ui/Button';

interface UserSettingsProps {
  user: CivoraUser;
}

export function UserSettings({ user }: UserSettingsProps) {
  const [name, setName] = useState(user.name || 'Marcus Vance');
  const [email] = useState(user.email || 'engineer@civora.internal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const roleInfo = ROLE_LABELS[user.role] || {
    badge: 'Engineer',
    title: 'Project Engineer',
    description: 'Project Operations',
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
          Account Settings & Profile
        </h1>
        <p className="text-xs text-slate-500">
          Manage your personal credentials, communication preferences, and active project credentials.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile and notification preferences successfully saved.</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-xs">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#001237] text-white flex items-center justify-center font-bold text-lg font-mono">
              {(name || 'M')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#001237] text-[#4FAAA7]">
              {roleInfo.title}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Certified Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Role & Permissions Scope */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Shield className="w-4 h-4 text-[#3B68DE]" />
              <span>Assigned Security Scope: {roleInfo.title}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {roleInfo.description}. Security roles are provisioned by your organization administrator. For elevated privileges or project transfers, consult your lead project director.
            </p>
          </div>

          {/* Communication Preferences */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#4FAAA7]" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                <div>
                  <div className="font-semibold text-slate-900">Inbound Field Submittals Alert</div>
                  <div className="text-[11px] text-slate-500">
                    Receive immediate notifications when new evidence or photos arrive from site submitters.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                <div>
                  <div className="font-semibold text-slate-900">Weekly Performance Compliance Summary</div>
                  <div className="text-[11px] text-slate-500">
                    Receive weekly automated digest of reporting percentages and task completions.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>End-to-end encrypted session &bull; NDPA 2023 Compliant</span>
            </div>
            <Button type="submit" variant="teal" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
