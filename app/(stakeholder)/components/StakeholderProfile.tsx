'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Bell,
  CheckCircle2,
  Lock,
  Building,
  Briefcase,
  Phone,
  Mail,
  Globe,
  Save,
  LogOut,
  Clock,
  KeyRound,
  Check,
  AlertCircle,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';

interface StakeholderProfileProps {
  user: CivoraUser;
  defaultTab?: 'profile' | 'notifications' | 'security';
}

export function StakeholderProfile({
  user,
  defaultTab = 'profile',
}: StakeholderProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>(defaultTab);

  // Profile state (Section 11: Personal details)
  const [fullName, setFullName] = useState(user.name || 'Elena Rostova');
  const [organization, setOrganization] = useState(
    user.organization || 'Aegis Capital & Infrastructure Partners'
  );
  const [jobTitle, setJobTitle] = useState(
    user.title || 'Managing Partner / Project Sponsor'
  );
  const [phone, setPhone] = useState('+44 20 7946 0912');
  const [timezone, setTimezone] = useState('Europe/London (GMT+0 / UTC+1)');

  // Notification preferences (Section 11: Notification preferences)
  const [notifyReleasedReports, setNotifyReleasedReports] = useState(true);
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [notifyAnnouncements, setNotifyAnnouncements] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelInApp, setChannelInApp] = useState(true);

  // Security state (Section 11: Security)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback states
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('Preferences updated successfully.');

  const roleInfo = ROLE_LABELS[user.role] || {
    badge: 'Stakeholder',
    title: 'Authorized Read-Only Stakeholder',
    description: 'Read-only visibility into approved capital project summaries, milestones, and released reports.',
  };

  const assignedProjectsCount = user.assignedProjects?.includes('*')
    ? DEMO_PROJECTS.length
    : user.assignedProjects?.length || 0;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setSaveMessage('Profile information saved successfully.');
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setSaveMessage('Notification preferences updated successfully.');
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    setIsSaved(true);
    setSaveMessage('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-4xl font-['Inter',sans-serif]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider bg-[#001237] text-[#4FAAA7]">
              Stakeholder Workspace
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {assignedProjectsCount} Assigned Project{assignedProjectsCount === 1 ? '' : 's'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            My Profile & Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal details, update notification settings, and maintain account security.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Navigation Tabs (Section 11) */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Personal Details', icon: User },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
          { id: 'security', label: 'Security & Credentials', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#001237] text-[#001237]'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Verified work email</label>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Job title / Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Project Owner, Funder, Executive"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Timezone preference</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Notification Preferences (Section 11) */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Update Subscriptions
            </h2>
            <p className="text-xs text-slate-500">
              Configure which updates trigger notifications in your stakeholder workspace.
            </p>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Released report notifications</span>
                  <span className="text-[11px] text-slate-500">
                    Receive an immediate alert when monthly, compliance, or structural reports are officially published.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyReleasedReports}
                  onChange={(e) => setNotifyReleasedReports(e.target.checked)}
                  className="w-4 h-4 accent-[#001237] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Milestone status updates</span>
                  <span className="text-[11px] text-slate-500">
                    Notifies when key project milestones transition to completed or shift target dates.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyMilestones}
                  onChange={(e) => setNotifyMilestones(e.target.checked)}
                  className="w-4 h-4 accent-[#001237] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Important project announcements</span>
                  <span className="text-[11px] text-slate-500">
                    High-level communications and statutory advisories issued by project sponsors.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyAnnouncements}
                  onChange={(e) => setNotifyAnnouncements(e.target.checked)}
                  className="w-4 h-4 accent-[#001237] rounded cursor-pointer"
                />
              </label>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                  <span className="text-slate-700 font-medium">Email notifications</span>
                  <input
                    type="checkbox"
                    checked={channelEmail}
                    onChange={(e) => setChannelEmail(e.target.checked)}
                    className="w-4 h-4 accent-[#001237] rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                  <span className="text-slate-700 font-medium">In-app notifications</span>
                  <input
                    type="checkbox"
                    checked={channelInApp}
                    onChange={(e) => setChannelInApp(e.target.checked)}
                    className="w-4 h-4 accent-[#001237] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Save Notification Preferences</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Credentials (Section 11) */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <form onSubmit={handleUpdatePassword}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Change Password
              </h2>

              <div className="space-y-3 text-xs max-w-md">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={!currentPassword || !newPassword}
                  className="px-5 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#4FAAA7]" />
                  <span>Update Password</span>
                </button>
              </div>
            </div>
          </form>

          {/* Active Session & Sign out */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Active Session & Authentication
            </h2>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900">Current Web Session</span>
                <p className="text-slate-500 text-[11px]">
                  Logged in as <strong className="text-slate-700">{user.email}</strong> &bull; Role: Read-Only Stakeholder
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active Now
              </span>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Civora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
