'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Bell,
  Mail,
  Shield,
  FileCheck2,
  Calendar,
  Megaphone,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';

interface StakeholderNotificationPreferencesProps {
  user: CivoraUser;
}

export function StakeholderNotificationPreferences({ user }: StakeholderNotificationPreferencesProps) {
  // Preference States
  const [inAppReportReleases, setInAppReportReleases] = useState(true);
  const [inAppMilestoneUpdates, setInAppMilestoneUpdates] = useState(true);
  const [inAppAnnouncements, setInAppAnnouncements] = useState(true);
  const [inAppMeetingReminders, setInAppMeetingReminders] = useState(true);

  const [emailReportReleases, setEmailReportReleases] = useState(true);
  const [emailMilestoneUpdates, setEmailMilestoneUpdates] = useState(false);
  const [emailAnnouncements, setEmailAnnouncements] = useState(true);
  const [emailMeetingReminders, setEmailMeetingReminders] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Notification Preferences"
        description="Configure automated alerting delivery channels for released reports, milestone changes, and executive meetings."
      />


      <form onSubmit={handleSave} className="space-y-6">
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">Preferences saved successfully. Alerts will be dispatched according to your rules.</span>
          </div>
        )}

        {/* In-App Notifications */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-[#3B68DE]" />
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              In-App Notification Feed
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                  Released Report Publications
                </span>
                <p className="text-[11px] text-slate-500">
                  Notify when a new compliance or progress report is signed off and released for viewing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppReportReleases}
                onChange={(e) => setInAppReportReleases(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Milestone Gate Updates
                </span>
                <p className="text-[11px] text-slate-500">
                  Notify upon schedule changes, completion sign-offs, or regulatory clearance notices.
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppMilestoneUpdates}
                onChange={(e) => setInAppMilestoneUpdates(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Megaphone className="w-3.5 h-3.5 text-slate-400" />
                  Corporate & Site Announcements
                </span>
                <p className="text-[11px] text-slate-500">
                  Bulletins concerning regulatory notices, weather advisories, or portfolio alerts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppAnnouncements}
                onChange={(e) => setInAppAnnouncements(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Meeting Invitations & Rescheduling
                </span>
                <p className="text-[11px] text-slate-500">
                  Notify when a stakeholder milestone briefing or virtual session is scheduled or revised.
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppMeetingReminders}
                onChange={(e) => setInAppMeetingReminders(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#3B68DE]" />
              <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                Email Dispatch Notifications
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Target: {user.email}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-bold text-slate-800">
                  Email Summary for Released Reports
                </span>
                <p className="text-[11px] text-slate-500">
                  Dispatch email executive summary and direct download link immediately upon report release.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailReportReleases}
                onChange={(e) => setEmailReportReleases(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-bold text-slate-800">
                  Milestone Critical Schedule Alerts
                </span>
                <p className="text-[11px] text-slate-500">
                  Dispatch urgent email notification if an approved milestone exceeds target date buffer.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailMilestoneUpdates}
                onChange={(e) => setEmailMilestoneUpdates(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-bold text-slate-800">
                  Regulatory & Executive Briefing Dispatches
                </span>
                <p className="text-[11px] text-slate-500">
                  Dispatch full announcement memo to your email address.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAnnouncements}
                onChange={(e) => setEmailAnnouncements(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-bold text-slate-800">
                  Calendar Invites (.ics) for Stakeholder Reviews
                </span>
                <p className="text-[11px] text-slate-500">
                  Attach standard iCalendar calendar invites to your mailbox.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailMeetingReminders}
                onChange={(e) => setEmailMeetingReminders(e.target.checked)}
                className="w-4 h-4 text-[#3B68DE] rounded border-slate-300 focus:ring-[#3B68DE]"
              />
            </div>
          </div>
        </div>

        {/* Mandatory Governance Notifications */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
          <Shield className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800">
              Mandatory Security & Access Alerts
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Security alerts, credential verification requests, session authentications, and statutory data audit notices cannot be disabled and are always routed to {user.email}.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Notification Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
