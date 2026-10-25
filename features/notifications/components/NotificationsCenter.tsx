'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  Clock,
  Shield,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Star,
  Check,
  CheckCheck,
  Send,
  Phone,
  HardHat,
  Sliders,
  ChevronRight,
  Archive,
  RefreshCw,
  X,
  Info,
  Building2,
  Landmark,
  FileText,
  Award,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import {
  NotificationItem,
  NotificationSeverity,
  NotificationChannel,
} from '@/types/notifications';
import {
  ENGINEER_NOTIFICATIONS,
  STAKEHOLDER_NOTIFICATIONS,
} from '@/lib/mock-data/notifications';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';

interface NotificationsCenterProps {
  user: CivoraUser;
}

export function NotificationsCenter({ user }: NotificationsCenterProps) {
  const isStakeholder = user.role === 'read_only_stakeholder';
  const isPlatformAdmin = user.role === 'platform_admin';

  // For platform admin only, allow switching between engineer and stakeholder views.
  // For regular roles, strictly lock to their respective role.
  const [adminPerspective, setAdminPerspective] = useState<'engineer' | 'stakeholder'>(
    isStakeholder ? 'stakeholder' : 'engineer'
  );

  const activeRoleView = isPlatformAdmin
    ? adminPerspective
    : isStakeholder
    ? 'stakeholder'
    : 'engineer';

  // Role-isolated notifications state
  const [engineerNotifs, setEngineerNotifs] = useState<NotificationItem[]>(
    ENGINEER_NOTIFICATIONS
  );
  const [stakeholderNotifs, setStakeholderNotifs] = useState<NotificationItem[]>(
    STAKEHOLDER_NOTIFICATIONS
  );

  const currentRoleNotifications =
    activeRoleView === 'stakeholder' ? stakeholderNotifs : engineerNotifs;

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Acknowledge Modal state (strictly for engineers only)
  const [acknowledgingItem, setAcknowledgingItem] = useState<NotificationItem | null>(null);
  const [acknowledgeNote, setAcknowledgeNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle Read Status
  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeRoleView === 'stakeholder') {
      setStakeholderNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
      );
    } else {
      setEngineerNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
      );
    }
  };

  // Toggle Starred
  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeRoleView === 'stakeholder') {
      setStakeholderNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isStarred: !n.isStarred } : n))
      );
    } else {
      setEngineerNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isStarred: !n.isStarred } : n))
      );
    }
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    if (activeRoleView === 'stakeholder') {
      setStakeholderNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } else {
      setEngineerNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
    showToast('All notifications marked as read');
  };

  // Archive / Dismiss
  const handleArchive = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeRoleView === 'stakeholder') {
      setStakeholderNotifs((prev) => prev.filter((n) => n.id !== id));
    } else {
      setEngineerNotifs((prev) => prev.filter((n) => n.id !== id));
    }
    showToast('Notification archived');
  };

  // Confirm Acknowledgement (Engineer only)
  const handleConfirmAcknowledge = () => {
    if (!acknowledgingItem) return;
    setEngineerNotifs((prev) =>
      prev.map((n) => (n.id === acknowledgingItem.id ? { ...n, isRead: true } : n))
    );
    showToast(
      `Technical acknowledgment recorded for ${acknowledgingItem.title.slice(0, 35)}...`
    );
    setAcknowledgingItem(null);
    setAcknowledgeNote('');
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return currentRoleNotifications.filter((item) => {
      // Category matching
      if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false;
      }

      // Status filter
      if (statusFilter === 'unread' && item.isRead) return false;
      if (statusFilter === 'starred' && !item.isStarred) return false;

      // Project filter
      if (selectedProjectId !== 'all' && item.projectId !== selectedProjectId) {
        return false;
      }

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMsg = item.message.toLowerCase().includes(q);
        const matchesProj = item.projectName?.toLowerCase().includes(q);
        const matchesSubId = item.metadata?.submittalId?.toLowerCase().includes(q);
        const matchesPermit = item.metadata?.permitCode?.toLowerCase().includes(q);

        if (!matchesTitle && !matchesMsg && !matchesProj && !matchesSubId && !matchesPermit) {
          return false;
        }
      }

      return true;
    });
  }, [currentRoleNotifications, selectedCategory, statusFilter, selectedProjectId, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const unread = currentRoleNotifications.filter((n) => !n.isRead).length;
    const urgent = currentRoleNotifications.filter((n) => n.severity === 'urgent' && !n.isRead).length;
    const statutory = currentRoleNotifications.filter((n) => n.category === 'statutory').length;
    const submissions = currentRoleNotifications.filter((n) => n.category === 'submission').length;
    const fiduciary = currentRoleNotifications.filter((n) => n.category === 'fiduciary').length;
    const quality = currentRoleNotifications.filter((n) => n.category === 'quality').length;
    return { unread, urgent, statutory, submissions, fiduciary, quality };
  }, [currentRoleNotifications]);

  // Severity styling
  const getSeverityBadge = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {activeRoleView === 'stakeholder' ? 'Safety Hold' : 'Urgent SLA'}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
            {activeRoleView === 'stakeholder' ? 'Statutory Notice' : 'Technical Advisory'}
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Check className="w-2.5 h-2.5 text-emerald-600" />
            {activeRoleView === 'stakeholder' ? 'Certified Milestone' : 'Verified'}
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Info className="w-2.5 h-2.5 text-[#3B68DE]" />
            {activeRoleView === 'stakeholder' ? 'Governance Filing' : 'Notice'}
          </span>
        );
    }
  };

  // Channel Icon & Badge
  const getChannelBadge = (channel?: NotificationChannel) => {
    switch (channel) {
      case 'regulatory':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100/70 text-[#001237] border border-[#4FAAA7]/30">
            <Shield className="w-2.5 h-2.5 text-[#4FAAA7]" />
            Statutory Authority
          </span>
        );
      case 'portal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#3B68DE] border border-blue-200">
            <Landmark className="w-2.5 h-2.5 text-[#3B68DE]" />
            Executive Ledger
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200">
            <Phone className="w-2.5 h-2.5 text-emerald-600" />
            WhatsApp Ingestion
          </span>
        );
      case 'telegram':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100/70 text-sky-800 border border-sky-200">
            <Send className="w-2.5 h-2.5 text-sky-600" />
            Telegram Bot
          </span>
        );
      case 'lab':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100/70 text-purple-800 border border-purple-200">
            <FileCheck2 className="w-2.5 h-2.5 text-purple-600" />
            Testing Laboratory
          </span>
        );
      case 'system':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-2.5 h-2.5 text-slate-500" />
            SLA Monitor
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#001237] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#4FAAA7]/40 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#4FAAA7]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#001237] text-white flex items-center justify-center shadow-xs">
              {activeRoleView === 'stakeholder' ? (
                <Shield className="w-5 h-5 text-[#3B68DE]" />
              ) : (
                <Bell className="w-5 h-5 text-[#4FAAA7]" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
                {activeRoleView === 'stakeholder'
                  ? 'Executive Oversight Notifications & Compliance Signals'
                  : 'Project Engineering Alerts & SLA Monitor'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeRoleView === 'stakeholder'
                  ? 'Statutory environmental filings, certified milestone deliverables, and sovereign capital governance records.'
                  : 'Real-time submittal turnaround SLAs, field evidence ingestion, laboratory test advisories, and site sensor telemetry.'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Admin Perspective Toggle (only visible to platform_admin) */}
          {isPlatformAdmin && (
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAdminPerspective('engineer');
                  setSelectedCategory('all');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  adminPerspective === 'engineer'
                    ? 'bg-[#001237] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HardHat className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Engineer View</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminPerspective('stakeholder');
                  setSelectedCategory('all');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  adminPerspective === 'stakeholder'
                    ? 'bg-[#001237] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#3B68DE]" />
                <span>Stakeholder View</span>
              </button>
            </div>
          )}

          {/* Action: Mark All Read */}
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={stats.unread === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#4FAAA7]" />
            <span>Mark All Read</span>
          </button>

          {/* Action: Settings link (for engineers) or Statutory audit link (for stakeholders) */}
          {activeRoleView === 'stakeholder' ? (
            <Link
              href="/dashboard/stakeholder/compliance"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#3B68DE]" />
              <span className="hidden sm:inline">Statutory Registry</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/settings?tab=notifications"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Channel Settings</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Key KPI Metric Cards (Strictly Role Tailored) */}
      {activeRoleView === 'stakeholder' ? (
        /* Stakeholder KPI Cards: Zero Engineer Details */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-teal-200/80 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                Statutory Clearances
              </span>
              <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-[#4FAAA7]">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001237] font-mono">{stats.statutory}</span>
              <span className="text-xs text-[#4FAAA7] font-semibold">Active Permits</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              LASBCA, FMEnv EIA authorizations & FCDA filings.
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                Certified Milestones
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[#3B68DE]">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001237] font-mono">{stats.fiduciary}</span>
              <span className="text-xs text-[#3B68DE] font-semibold">Capital Deliverables</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Quay wall bathymetric & viaduct pour certifications.
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                Governance Dossiers
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <FileText className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001237] font-mono">Q3 Published</span>
              <span className="text-xs text-slate-600 font-semibold">REP-2026</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Executive civil engineering quality & statutory assurance.
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                Safety & Telemetry Hold
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-600 font-mono">1</span>
              <span className="text-xs text-rose-700 font-medium">Cofferdam Active</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Sensor INC-04 deflection exceeding statutory threshold.
            </div>
          </div>
        </div>
      ) : (
        /* Engineer KPI Cards: Strictly Operational Technical Details */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                Turnaround SLA Alerts
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-600 font-mono">{stats.urgent}</span>
              <span className="text-xs text-rose-700 font-medium">Critical (&lt; 2h SLA)</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Ready-mix batch dispatch & pour card review deadlines.
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                Field Ingestion Queue
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Phone className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001237] font-mono">{stats.submissions}</span>
              <span className="text-xs text-emerald-700 font-semibold">WhatsApp & CAD</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Compression logs, shop drawings & site verification items.
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                Lab Material Advisories
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001237] font-mono">{stats.quality}</span>
              <span className="text-xs text-amber-800 font-semibold">Discrepancy Holds</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Rebar tensile yield & cube strength curing schedules.
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                Telegram Dispatch Bot
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001237] font-mono">14 Site Staff</span>
              <span className="text-xs text-sky-700 font-semibold">Online</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              @CivoraControlBot webhook active for submittal dispatch.
            </div>
          </div>
        </div>
      )}

      {/* 3. Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#001237] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              All ({currentRoleNotifications.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('unread')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'unread'
                  ? 'bg-[#001237] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Unread ({stats.unread})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('starred')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'starred'
                  ? 'bg-[#001237] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Starred</span>
            </button>
          </div>

          {/* Search & Project Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Project Filter */}
            <div className="w-full sm:w-56">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#4FAAA7] cursor-pointer"
              >
                <option value="all">All Infrastructure Projects</option>
                {DEMO_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  activeRoleView === 'stakeholder'
                    ? 'Search permits, authorities...'
                    : 'Search package #, codes, logs...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4FAAA7]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills Tailored to Role */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          {(activeRoleView === 'stakeholder'
            ? [
                { id: 'all', label: 'All Signals' },
                { id: 'statutory', label: 'Statutory & Permits' },
                { id: 'fiduciary', label: 'Capital Milestones' },
                { id: 'quality', label: 'Safety & Geotechnical' },
              ]
            : [
                { id: 'all', label: 'All Signals' },
                { id: 'sla', label: 'SLA Deadlines' },
                { id: 'submission', label: 'Submissions & Evidence' },
                { id: 'quality', label: 'Quality & Telemetry' },
                { id: 'integration', label: 'Bot & Webhook Sync' },
              ]
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#4FAAA7]/15 text-[#001237] border border-[#4FAAA7]/40 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Active Role Context Banner */}
      <div className="rounded-xl bg-slate-100/70 border border-slate-200/80 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4FAAA7]" />
          <span>
            {activeRoleView === 'stakeholder' ? (
              <>
                Showing <strong className="text-slate-900">Executive Statutory & Capital Oversight</strong> notices. Internal engineer operations and field notes are omitted per governance policy.
              </>
            ) : (
              <>
                Showing <strong className="text-slate-900">Project Engineering Operational Signals</strong>. Confidential stakeholder board disbursements and fiduciary records are omitted.
              </>
            )}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {filteredNotifications.length} of {currentRoleNotifications.length} loaded
        </span>
      </div>

      {/* 5. Notification Cards Feed */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-[#4FAAA7]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No notifications match your current filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no pending notices in this category or project view.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setStatusFilter('all');
                setSelectedProjectId('all');
                setSearchQuery('');
              }}
              className="mt-4 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isUnread = !item.isRead;

            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-2xl border transition-all duration-150 p-4 sm:p-5 shadow-2xs hover:shadow-xs ${
                  isUnread
                    ? 'border-slate-300/90 bg-slate-50/40 ring-1 ring-slate-200/60'
                    : 'border-slate-200/80'
                } ${
                  item.severity === 'urgent'
                    ? 'border-l-4 border-l-rose-500'
                    : item.severity === 'warning'
                    ? 'border-l-4 border-l-amber-500'
                    : item.severity === 'success'
                    ? 'border-l-4 border-l-emerald-500'
                    : 'border-l-4 border-l-[#3B68DE]'
                }`}
              >
                {/* Header row of the card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Unread Indicator */}
                    {isUnread && (
                      <span
                        className="w-2 h-2 rounded-full bg-rose-500 shrink-0"
                        title="Unread alert"
                      />
                    )}

                    {/* Severity Badge */}
                    {getSeverityBadge(item.severity)}

                    {/* Channel Badge */}
                    {getChannelBadge(item.channel)}

                    {/* Project Tag */}
                    {item.projectName && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#001237] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
                        <Building2 className="w-2.5 h-2.5 text-slate-400" />
                        <span className="max-w-[200px] truncate">{item.projectName}</span>
                        {item.projectCode && (
                          <span className="font-mono text-[10px] text-slate-400">
                            ({item.projectCode})
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Timestamp & Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className="text-[11px] font-mono text-slate-400 font-medium">
                      {item.timestamp}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleStar(item.id, e)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors"
                      title={item.isStarred ? 'Unstar' : 'Star notification'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          item.isStarred ? 'text-amber-500 fill-amber-500' : ''
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleArchive(item.id, e)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Archive notification"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="pt-3 space-y-1.5">
                  <h4 className="text-sm font-bold text-[#001237] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                    {item.message}
                  </p>

                  {/* Metadata Chips: strictly role relevant */}
                  {item.metadata && (
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      {/* Stakeholder Metadata: Permit Code & Authority only */}
                      {activeRoleView === 'stakeholder' && item.metadata.permitCode && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#001237] bg-teal-50 px-2 py-0.5 rounded border border-[#4FAAA7]/30">
                          Permit Ref: <strong>{item.metadata.permitCode}</strong>
                        </span>
                      )}
                      {activeRoleView === 'stakeholder' && item.metadata.authority && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Authority: <strong>{item.metadata.authority}</strong>
                        </span>
                      )}

                      {/* Engineer Metadata: Submittal ID, Hours Left, Sender, Discrepancy */}
                      {activeRoleView === 'engineer' && item.metadata.submittalId && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#001237] bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200">
                          Package: <strong>{item.metadata.submittalId}</strong>
                        </span>
                      )}
                      {activeRoleView === 'engineer' && item.metadata.hoursRemaining && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <Clock className="w-3 h-3 text-rose-500" />
                          <span>Turnaround SLA: {item.metadata.hoursRemaining}h left</span>
                        </span>
                      )}
                      {activeRoleView === 'engineer' && item.metadata.discrepancy && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Lab Alert: {item.metadata.discrepancy}
                        </span>
                      )}
                      {activeRoleView === 'engineer' && item.metadata.sourceSender && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Field Mobile: {item.metadata.sourceSender}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Controls & Link */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3.5 mt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {/* Mark Read/Unread */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(item.id, e)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {isUnread ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#4FAAA7]" />
                          <span>Mark as Read</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full border border-slate-400" />
                          <span>Mark as Unread</span>
                        </>
                      )}
                    </button>

                    {/* Acknowledge Button: strictly for engineers on technical warnings */}
                    {activeRoleView === 'engineer' &&
                      (item.severity === 'urgent' || item.severity === 'warning') && (
                        <button
                          type="button"
                          onClick={() => setAcknowledgingItem(item)}
                          className="text-xs font-semibold text-[#001237] hover:text-[#4FAAA7] flex items-center gap-1 ml-2 transition-colors cursor-pointer"
                        >
                          <HardHat className="w-3.5 h-3.5 text-[#4FAAA7]" />
                          <span>Log Technical Acknowledgement</span>
                        </button>
                      )}
                  </div>

                  {/* Primary Deep-Link CTA Button */}
                  {item.actionUrl && (
                    <Link
                      href={item.actionUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs group/btn cursor-pointer"
                    >
                      <span>{item.actionLabel || 'Inspect Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#4FAAA7] group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Channel / Registry Status Strip (Strictly Role Relevant) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        {activeRoleView === 'stakeholder' ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Landmark className="w-4 h-4 text-[#3B68DE]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Statutory Authorities & Fiduciary Portals
                </div>
                <div className="text-[11px] text-slate-500">
                  Direct statutory synchronization with official Nigerian infrastructure regulatory registries.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-[#4FAAA7]/30 text-[#001237] font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4FAAA7]" />
                <span>LASBCA Verification: Connected</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>FMEnv EIA Registry: Validated</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B68DE]" />
                <span>NPA Hydrographic Clearance: Verified</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <RefreshCw className="w-4 h-4 text-[#4FAAA7]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Field Messaging Channels & Ingestion Status
                </div>
                <div className="text-[11px] text-slate-500">
                  Continuous inbound monitoring across construction field messaging channels and testing lab queues.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>WhatsApp Cloud API: Active</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>Telegram Bot: Syncing (@CivoraControlBot)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4FAAA7]" />
                <span>SLA Monitor: 5m Interval</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. Technical Acknowledgement Modal (Engineer only) */}
      {activeRoleView === 'engineer' && acknowledgingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HardHat className="w-5 h-5 text-[#4FAAA7]" />
                <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
                  Log Technical Acknowledgement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAcknowledgingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Technical Alert
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-[#001237]">{acknowledgingItem.title}</div>
                <div className="text-slate-600">{acknowledgingItem.message}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Engineering Action / Mitigation Notes:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Reviewed 7-day cube logs, contacted site QA technician; priority batch approved for deck pour."
                value={acknowledgeNote}
                onChange={(e) => setAcknowledgeNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4FAAA7]"
              />
              <div className="text-[11px] text-slate-400">
                Acknowledged by {user.name} ({user.title}) • Timestamped in project audit registry.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAcknowledgingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAcknowledge}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Confirm Acknowledgement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
