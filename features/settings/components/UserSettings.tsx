'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  CheckCircle2,
  Lock,
  FileText,
  Check,
  Clock,
  Phone,
  Building,
  Sliders,
  KeyRound,
  AlertTriangle,
  Award,
  Layers,
  Save,
  MessageSquare,
  Send,
  Smartphone,
  Copy,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Wifi,
  Sparkles,
  Radio,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';
import { DEMO_PROJECTS, DEMO_INTEGRATION_CONFIG } from '@/lib/mock-data/fixtures';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface UserSettingsProps {
  user: CivoraUser;
}

export function UserSettings({ user }: UserSettingsProps) {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'projects' | 'integrations' | 'notifications' | 'security'
  >('profile');

  // Profile Form State
  const [fullName, setFullName] = useState(user.name || 'Marcus Vance, PE');
  const [jobTitle, setJobTitle] = useState(user.title || 'Senior Structural Project Engineer');
  const [department, setDepartment] = useState(user.department || 'Structural Engineering');
  const [organization, setOrganization] = useState(user.organization || 'Civora Infrastructure Ltd');
  const [corenNumber, setCorenNumber] = useState('COREN/R.52941');
  const [nseNumber, setNseNumber] = useState('NSE/M.18492');
  const [phoneContact, setPhoneContact] = useState('+234 803 555 0192');

  // Review Scope & SLA Settings
  const [reviewSla, setReviewSla] = useState<'24h' | '48h' | '72h'>('24h');
  const [defaultSpec, setDefaultSpec] = useState('Eurocode 2 / FMWH Civil Standards');
  const [requireLabBreakCert, setRequireLabBreakCert] = useState(true);
  const [requireGeotaggedPhotos, setRequireGeotaggedPhotos] = useState(true);
  const [autoFlagLowStrength, setAutoFlagLowStrength] = useState(true);

  // WhatsApp Integration Settings State
  const [waEnabled, setWaEnabled] = useState(DEMO_INTEGRATION_CONFIG.whatsapp.enabled);
  const [waPhone, setWaPhone] = useState(DEMO_INTEGRATION_CONFIG.whatsapp.displayPhoneNumber);
  const [waPhoneId, setWaPhoneId] = useState(DEMO_INTEGRATION_CONFIG.whatsapp.phoneNumberId);
  const [waVerifyToken, setWaVerifyToken] = useState(DEMO_INTEGRATION_CONFIG.whatsapp.webhookVerifyToken);
  const [waSecret, setWaSecret] = useState(DEMO_INTEGRATION_CONFIG.whatsapp.webhookSecretMasked);
  const [showWaSecret, setShowWaSecret] = useState(false);
  const [copiedWaWebhook, setCopiedWaWebhook] = useState(false);
  const [waStats, setWaStats] = useState({
    ingested: DEMO_INTEGRATION_CONFIG.whatsapp.totalIngested,
    duplicates: DEMO_INTEGRATION_CONFIG.whatsapp.duplicatesBlocked,
    lastEvent: DEMO_INTEGRATION_CONFIG.whatsapp.lastEventTime,
  });

  // Telegram Integration Settings State
  const [tgEnabled, setTgEnabled] = useState(DEMO_INTEGRATION_CONFIG.telegram.enabled);
  const [tgBotUsername, setTgBotUsername] = useState(DEMO_INTEGRATION_CONFIG.telegram.botUsername);
  const [tgBotToken, setTgBotToken] = useState(DEMO_INTEGRATION_CONFIG.telegram.botTokenMasked);
  const [showTgToken, setShowTgToken] = useState(false);
  const [tgWebhookUrl, setTgWebhookUrl] = useState(DEMO_INTEGRATION_CONFIG.telegram.webhookUrl);
  const [tgAllowedChats, setTgAllowedChats] = useState<string[]>(
    DEMO_INTEGRATION_CONFIG.telegram.allowedChatIds
  );
  const [newChatInput, setNewChatInput] = useState('');
  const [copiedTgWebhook, setCopiedTgWebhook] = useState(false);
  const [tgStats, setTgStats] = useState({
    ingested: DEMO_INTEGRATION_CONFIG.telegram.totalIngested,
    duplicates: DEMO_INTEGRATION_CONFIG.telegram.duplicatesBlocked,
    lastEvent: DEMO_INTEGRATION_CONFIG.telegram.lastEventTime,
  });

  // Simulation & Action State
  const [isSimulating, setIsSimulating] = useState<'whatsapp' | 'telegram' | null>(null);
  const [simAlert, setSimAlert] = useState<{ channel: string; message: string; success: boolean } | null>(null);
  const [isSavingIntegrations, setIsSavingIntegrations] = useState(false);

  // Notification Preferences
  const [inboundSubmissionsAlert, setInboundSubmissionsAlert] = useState(true);
  const [whatsappPushAlerts, setWhatsappPushAlerts] = useState(true);
  const [telegramBotAlerts, setTelegramBotAlerts] = useState(true);
  const [criticalDiscrepancyAlerts, setCriticalDiscrepancyAlerts] = useState(true);
  const [weeklyComplianceDigest, setWeeklyComplianceDigest] = useState(true);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState('1h');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('Settings updated successfully.');

  const roleInfo = ROLE_LABELS[user.role] || {
    badge: 'Engineer',
    title: 'Project Engineer',
    description: 'Technical reviews, submittal inspection, and discrepancy verification in assigned projects.',
  };

  const assignedProjects = DEMO_PROJECTS.filter((p) =>
    user.assignedProjects?.includes('*') ? true : user.assignedProjects?.includes(p.id)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setSaveMessage('Engineer dashboard configurations successfully saved.');
    setTimeout(() => setIsSaved(false), 3500);
  };

  const copyToClipboard = (text: string, type: 'wa' | 'tg') => {
    navigator.clipboard.writeText(text);
    if (type === 'wa') {
      setCopiedWaWebhook(true);
      setTimeout(() => setCopiedWaWebhook(false), 2000);
    } else {
      setCopiedTgWebhook(true);
      setTimeout(() => setCopiedTgWebhook(false), 2000);
    }
  };

  const handleAddChatId = () => {
    if (newChatInput.trim() && !tgAllowedChats.includes(newChatInput.trim())) {
      setTgAllowedChats([...tgAllowedChats, newChatInput.trim()]);
      setNewChatInput('');
    }
  };

  const handleRemoveChatId = (chatId: string) => {
    setTgAllowedChats(tgAllowedChats.filter((id) => id !== chatId));
  };

  const handleSaveIntegrations = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingIntegrations(true);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp: {
            enabled: waEnabled,
            displayPhoneNumber: waPhone,
            phoneNumberId: waPhoneId,
            webhookVerifyToken: waVerifyToken,
            webhookSecretMasked: waSecret,
          },
          telegram: {
            enabled: tgEnabled,
            botUsername: tgBotUsername,
            botTokenMasked: tgBotToken,
            webhookUrl: tgWebhookUrl,
            allowedChatIds: tgAllowedChats,
          },
        }),
      });

      if (res.ok) {
        setIsSaved(true);
        setSaveMessage('WhatsApp & Telegram integration settings updated.');
        setTimeout(() => setIsSaved(false), 3500);
      }
    } finally {
      setIsSavingIntegrations(false);
    }
  };

  const handleSimulatePing = async (channel: 'whatsapp' | 'telegram') => {
    setIsSimulating(channel);
    setSimAlert(null);

    try {
      const res = await fetch('/api/integrations/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          projectId: 'prj_metro_01',
          messageText:
            channel === 'whatsapp'
              ? 'Real-time test submission via field simulation: Slump test card verification 142mm'
              : 'Technical site survey log dispatch: GPS elevation benchmark 24.18m verified',
        }),
      });

      const data = await res.json();

      if (channel === 'whatsapp') {
        setWaStats((prev) => ({
          ...prev,
          ingested: prev.ingested + 1,
          lastEvent: 'Just now',
        }));
      } else {
        setTgStats((prev) => ({
          ...prev,
          ingested: prev.ingested + 1,
          lastEvent: 'Just now',
        }));
      }

      setSimAlert({
        channel: channel === 'whatsapp' ? 'WhatsApp' : 'Telegram',
        message: `Inbound webhook simulation received: Normalized submission ${data.submission?.identifier || 'SUB-TEST'} generated.`,
        success: true,
      });
    } catch {
      setSimAlert({
        channel: channel === 'whatsapp' ? 'WhatsApp' : 'Telegram',
        message: 'Simulation webhook test failed.',
        success: false,
      });
    } finally {
      setIsSimulating(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl font-['Inter',sans-serif]">
      {/* Header Bar matching standard App UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Engineer Dashboard Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#001237] text-[#4FAAA7]">
              {roleInfo.title}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure your professional engineering seal, review turnaround SLA, messaging integrations, submittal notification channels, and active project preferences.
          </p>
        </div>

        <Button
          onClick={handleSave}
          variant="teal"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          className="text-xs shrink-0"
        >
          Save All Changes
        </Button>
      </div>

      {/* Success Banner */}
      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Engineer Profile & Credentials', icon: User },
          { id: 'projects', label: 'Project Review Scope & SLA', icon: Layers },
          { id: 'integrations', label: 'WhatsApp & Telegram Integrations', icon: MessageSquare },
          { id: 'notifications', label: 'Field Ingestion & Alerts', icon: Bell },
          { id: 'security', label: 'Security & Active Sessions', icon: Shield },
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
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Engineer Profile & Credentials */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-xs">
            {/* Profile Avatar Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#001237] text-white flex items-center justify-center font-bold text-xl font-mono shadow-xs">
                  {fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{fullName}</h2>
                    <Badge variant="teal" size="sm">
                      COREN VERIFIED
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{jobTitle}</p>
                  <p className="text-[11px] font-mono text-[#3B68DE] mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-slate-800">
                  {corenNumber}
                </span>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Full Name (with Honorific)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Professional Engineering Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">COREN Registration Number</label>
                <input
                  type="text"
                  value={corenNumber}
                  onChange={(e) => setCorenNumber(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">NSE Professional Membership</label>
                <input
                  type="text"
                  value={nseNumber}
                  onChange={(e) => setNseNumber(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Engineering Firm / Organization</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Cadre / Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                />
              </div>
            </div>

            {/* Verified Digital Seal Notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#4FAAA7] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="text-slate-900 font-semibold block">COREN Digital Inspection Seal Status: Active</strong>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  All test break reviews, slump verification notes, and inspection report sign-offs completed under this profile are stamped with your certified COREN token ({corenNumber}).
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="teal" size="sm">
                Save Profile
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Project Review Scope & SLA */}
      {activeTab === 'projects' && (
        <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Review Turnaround SLA & Governance Defaults</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your default review thresholds, laboratory test criteria, and assigned project responsibilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Engineering Review Turnaround SLA</label>
                <select
                  value={reviewSla}
                  onChange={(e) => setReviewSla(e.target.value as any)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                >
                  <option value="24h">24 Hours (Standard Technical SLA)</option>
                  <option value="48h">48 Hours (High Volume Expedited)</option>
                  <option value="72h">72 Hours (Extended Complex Scope)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Default Governing Standard</label>
                <select
                  value={defaultSpec}
                  onChange={(e) => setDefaultSpec(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                >
                  <option value="Eurocode 2 / FMWH Civil Standards">Eurocode 2 & FMWH Standard Spec (C35/45)</option>
                  <option value="BS 8110 Structural Concrete">BS 8110 Structural Use of Concrete</option>
                  <option value="BS 6349 Maritime Structures">BS 6349 Maritime & Coastal Revetment</option>
                  <option value="AASHTO Bridge Design Manual">AASHTO LRFD Bridge Design & Highway Manual</option>
                </select>
              </div>
            </div>

            {/* Quality Enforcement Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quality Inspection Enforcement
              </h3>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">Enforce Certified Lab Break Certificate</div>
                    <div className="text-[11px] text-slate-500">
                      Block approval of 7-day and 28-day concrete cube breaks unless an official signed laboratory sheet is attached.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireLabBreakCert}
                    onChange={(e) => setRequireLabBreakCert(e.target.checked)}
                    className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">Require GPS Geotagging on Pour Card Media</div>
                    <div className="text-[11px] text-slate-500">
                      Verify that site photographs submitted via WhatsApp or Telegram match the assigned project coordinates.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireGeotaggedPhotos}
                    onChange={(e) => setRequireGeotaggedPhotos(e.target.checked)}
                    className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">Automated Concrete Strength Discrepancy Flagging</div>
                    <div className="text-[11px] text-slate-500">
                      Automatically raise an advisory discrepancy when 28-day compressive break results fall below 45 MPa.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoFlagLowStrength}
                    onChange={(e) => setAutoFlagLowStrength(e.target.checked)}
                    className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Assigned Scope List */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Project Engineering Clearances ({assignedProjects.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-[11px] font-bold text-[#001237] mr-1.5">{p.code}</span>
                      <span className="font-semibold text-slate-900">{p.name}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.client}</p>
                    </div>
                    <Badge variant="teal" size="sm">
                      ASSIGNED
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="teal" size="sm">
                Save Review Preferences
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: WhatsApp & Telegram Messaging Integrations */}
      {activeTab === 'integrations' && (
        <form onSubmit={handleSaveIntegrations} className="space-y-6 animate-in fade-in duration-150">
          {/* Simulation Alert Banner */}
          {simAlert && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center justify-between shadow-xs border ${
                simAlert.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#4FAAA7] shrink-0" />
                <span>
                  <strong>[{simAlert.channel} Live Simulation]</strong> {simAlert.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSimAlert(null)}
                className="text-xs font-bold hover:opacity-75 p-1"
              >
                ×
              </button>
            </div>
          )}

          {/* Section Introduction */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Field Messaging Ingestion Webhooks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage verified Meta WhatsApp Cloud API credentials, Telegram bot token authorization, and automated webhook endpoints.
              </p>
            </div>

            <Button
              type="submit"
              variant="teal"
              size="sm"
              isLoading={isSavingIntegrations}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Integration Settings
            </Button>
          </div>

          {/* 1. WHATSAPP BUSINESS CLOUD API GATEWAY */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      WhatsApp Business Cloud API
                    </h3>
                    <Badge variant="teal" size="sm" dot>
                      CONNECTED
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Official Meta Graph API webhook gateway for field site daily progress and photo submittals.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSimulatePing('whatsapp')}
                  isLoading={isSimulating === 'whatsapp'}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-500" />}
                >
                  Simulate Submittal Ping
                </Button>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <span className="text-xs font-semibold text-slate-700">Active</span>
                  <input
                    type="checkbox"
                    checked={waEnabled}
                    onChange={(e) => setWaEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4FAAA7] focus:ring-[#4FAAA7] accent-[#4FAAA7]"
                  />
                </label>
              </div>
            </div>

            {/* WhatsApp Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Submittals Ingested
                </div>
                <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
                  {waStats.ingested}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Duplicates Blocked
                </div>
                <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
                  {waStats.duplicates}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Idempotency Engine
                </div>
                <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Last Inbound Activity
                </div>
                <div className="font-mono text-xs text-slate-700 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {waStats.lastEvent}
                </div>
              </div>
            </div>

            {/* WhatsApp Config Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Verified Business Display Phone
                </label>
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+234 (1) 800-CIVORA"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 font-mono text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Meta Phone Number ID
                </label>
                <input
                  type="text"
                  value={waPhoneId}
                  onChange={(e) => setWaPhoneId(e.target.value)}
                  placeholder="109283749102834"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 font-mono text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Webhook Verify Token
                </label>
                <input
                  type="text"
                  value={waVerifyToken}
                  onChange={(e) => setWaVerifyToken(e.target.value)}
                  placeholder="civora_wh_token_88921a"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 font-mono text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>App Secret / Signing Key</span>
                  <button
                    type="button"
                    onClick={() => setShowWaSecret(!showWaSecret)}
                    className="text-[11px] text-[#3B68DE] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showWaSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showWaSecret ? 'Hide' : 'Reveal'}
                  </button>
                </label>
                <input
                  type={showWaSecret ? 'text' : 'password'}
                  value={waSecret}
                  onChange={(e) => setWaSecret(e.target.value)}
                  placeholder="whsec_••••••••••••94f2"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 font-mono text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                />
              </div>
            </div>

            {/* Webhook Callback Endpoint Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-[#4FAAA7]" /> Inbound Webhook Callback URL
                </span>
                <span className="text-[10px] text-slate-400 font-mono">HTTPS POST / Payload V2</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800">
                <span className="truncate">https://api.civora.com/api/webhooks/whatsapp</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('https://api.civora.com/api/webhooks/whatsapp', 'wa')}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-sans font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                >
                  {copiedWaWebhook ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy URL
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Group Chat Governance Note */}
            <div className="text-[11px] text-slate-500 bg-slate-50/60 border border-slate-200/60 p-3 rounded-xl flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-[#4FAAA7] shrink-0 mt-0.5" />
              <p>
                <strong>Architecture Safeguard:</strong> Standard WhatsApp Cloud API does not ingest arbitrary group chat messages without an approved Co-existence / On-Premise Partner setup. Personnel submit directly to the verified Civora Business number or through dedicated Telegram bots.
              </p>
            </div>
          </div>

          {/* 2. TELEGRAM BOT INGESTION GATEWAY */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Telegram Bot Ingestion Gateway
                    </h3>
                    <Badge variant="blue" size="sm" dot>
                      CONNECTED
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    High-volume technical updates, sensor data logs, and project channel submittals.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSimulatePing('telegram')}
                  isLoading={isSimulating === 'telegram'}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-500" />}
                >
                  Simulate Telegram Ping
                </Button>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <span className="text-xs font-semibold text-slate-700">Active</span>
                  <input
                    type="checkbox"
                    checked={tgEnabled}
                    onChange={(e) => setTgEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3B68DE] focus:ring-[#3B68DE] accent-[#3B68DE]"
                  />
                </label>
              </div>
            </div>

            {/* Telegram Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Messages Processed
                </div>
                <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
                  {tgStats.ingested}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Duplicates Prevented
                </div>
                <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
                  {tgStats.duplicates}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Authorized Chat Scope
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 mt-1">
                  {tgAllowedChats.length} Active Channels
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Last Sync Event
                </div>
                <div className="font-mono text-xs text-slate-700 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {tgStats.lastEvent}
                </div>
              </div>
            </div>

            {/* Telegram Config Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Bot Username</label>
                <input
                  type="text"
                  value={tgBotUsername}
                  onChange={(e) => setTgBotUsername(e.target.value)}
                  placeholder="@CivoraControlBot"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 font-mono text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>Bot API Token</span>
                  <button
                    type="button"
                    onClick={() => setShowTgToken(!showTgToken)}
                    className="text-[11px] text-[#3B68DE] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showTgToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showTgToken ? 'Hide' : 'Reveal'}
                  </button>
                </label>
                <input
                  type={showTgToken ? 'text' : 'password'}
                  value={tgBotToken}
                  onChange={(e) => setTgBotToken(e.target.value)}
                  placeholder="7920192834:••••••••••••••••••••••••••••••••3aB"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 font-mono text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                />
              </div>
            </div>

            {/* Authorized Site Groups & Chat IDs */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-slate-700 block">
                Authorized Project Site Group Chat IDs
              </label>
              <div className="flex flex-wrap gap-2">
                {tgAllowedChats.map((id) => (
                  <div
                    key={id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs"
                  >
                    <span>{id}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChatId(id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newChatInput}
                  onChange={(e) => setNewChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChatId();
                    }
                  }}
                  placeholder="Enter Telegram Group ID (e.g. -1004928172910)..."
                  className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 font-mono text-slate-900 text-xs focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                />
                <Button
                  type="button"
                  onClick={handleAddChatId}
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Chat ID
                </Button>
              </div>
            </div>

            {/* Telegram Webhook Callback URL */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-[#3B68DE]" /> Telegram Webhook Dispatch URL
                </span>
                <span className="text-[10px] text-slate-400 font-mono">HTTPS POST / Updates API</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800">
                <span className="truncate">{tgWebhookUrl}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(tgWebhookUrl, 'tg')}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-sans font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                >
                  {copiedTgWebhook ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy URL
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="teal"
              size="sm"
              isLoading={isSavingIntegrations}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save All Integration Configurations
            </Button>
          </div>
        </form>
      )}

      {/* TAB 4: Field Ingestion & Alerts */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Communication & Ingestion Channels</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Control notifications and dispatch alerts across connected WhatsApp and Telegram bot webhooks.
              </p>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                <div>
                  <div className="font-semibold text-slate-900">Inbound Submissions Push Alerts</div>
                  <div className="text-[11px] text-slate-500">
                    Receive immediate notifications when new field submittals, test cylinders, or rebar certificates arrive.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={inboundSubmissionsAlert}
                  onChange={(e) => setInboundSubmissionsAlert(e.target.checked)}
                  className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                <div>
                  <div className="font-semibold text-slate-900">WhatsApp Dispatch Channel Notifications</div>
                  <div className="text-[11px] text-slate-500">
                    Forward urgent information requests to submitters via Civora verified WhatsApp business gateway.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappPushAlerts}
                  onChange={(e) => setWhatsappPushAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                <div>
                  <div className="font-semibold text-slate-900">Telegram Bot Notifications (@CivoraControlBot)</div>
                  <div className="text-[11px] text-slate-500">
                    Broadcast daily batch summaries and media download statuses to Telegram channel subscribers.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={telegramBotAlerts}
                  onChange={(e) => setTelegramBotAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                <div>
                  <div className="font-semibold text-slate-900">Critical Material Discrepancy SMS / Urgent Push</div>
                  <div className="text-[11px] text-slate-500">
                    Send high-priority SMS alerts if an unverified batch delivery or out-of-spec slump is reported.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={criticalDiscrepancyAlerts}
                  onChange={(e) => setCriticalDiscrepancyAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                <div>
                  <div className="font-semibold text-slate-900">Weekly Subcontractor Reporting Digest</div>
                  <div className="text-[11px] text-slate-500">
                    Automated Monday morning digest calculating cadence percentage and missing period summaries.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyComplianceDigest}
                  onChange={(e) => setWeeklyComplianceDigest(e.target.checked)}
                  className="w-4 h-4 rounded text-[#001237] accent-[#001237] cursor-pointer"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="teal" size="sm">
                Save Alert Settings
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 5: Security & Active Sessions */}
      {activeTab === 'security' && (
        <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Authentication & Session Security</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your credentials, two-factor token authentication, and active browser sessions.
              </p>
            </div>

            {/* Change Password */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Update Password
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                  />
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Requires a time-based authenticator code (TOTP) when accessing from unfamiliar devices.
                  </p>
                </div>
                <Badge variant="teal" size="sm">
                  ACTIVE
                </Badge>
              </div>
            </div>

            {/* Session Information */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Session & Audit Fingerprint
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Device:</span>
                  <span className="text-slate-900 font-medium">Chrome on macOS (Apple Silicon)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gateway Location:</span>
                  <span className="text-slate-900 font-mono">Lagos, Nigeria (102.89.44.18)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Protocol:</span>
                  <span className="text-slate-900 font-mono">TLS 1.3 / AES-256 GCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Inactivity Timeout:</span>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour (Recommended)</option>
                    <option value="4h">4 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="teal" size="sm">
                Save Security Credentials
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
