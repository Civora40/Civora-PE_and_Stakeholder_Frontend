'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Bell,
  LayoutGrid,
  MoreVertical,
  LogOut,
  User,
  Settings,
  ChevronRight,
  CheckCheck,
  Clock,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { CivoraUser, UserRole } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';
import { getNotificationsForRole } from '@/lib/mock-data/notifications';

interface AppHeaderProps {
  user: CivoraUser;
  onOpenMobileSidebar: () => void;
}

export function AppHeader({ user, onOpenMobileSidebar }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const roleInfo = ROLE_LABELS[user.role] || {
    badge: 'Admin',
    title: 'Platform Administrator',
  };

  // Strictly role-isolated notifications for header preview
  const roleNotifications = getNotificationsForRole(user.role);
  const recentNotifications = roleNotifications.slice(0, 4);
  const unreadCount = roleNotifications.filter((n) => !n.isRead).length;

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  // Generate clean breadcrumb labels matching active workspace section
  const getBreadcrumbs = () => {
    if (user.role === 'read_only_stakeholder') {
      if (pathname.includes('/projects/')) return { parent: 'Stakeholder Workspace', current: 'Project Overview' };
      if (pathname.includes('/projects')) return { parent: 'Stakeholder Workspace', current: 'My Projects' };
      if (pathname.includes('/reports/')) return { parent: 'Stakeholder Workspace', current: 'Report Details' };
      if (pathname.includes('/reports')) return { parent: 'Stakeholder Workspace', current: 'Released Reports' };
      if (pathname.includes('/notifications')) return { parent: 'Stakeholder Workspace', current: 'Notifications' };
      if (pathname.includes('/profile') || pathname.includes('/settings')) return { parent: 'Stakeholder Workspace', current: 'My Profile' };
      return { parent: 'Stakeholder Workspace', current: 'Overview' };
    }

    if (pathname.includes('/notifications')) return { parent: 'Control Plane', current: 'Notifications & Alerts' };
    if (pathname.includes('/overview/projects')) return { parent: 'Overview', current: 'All Projects' };
    if (pathname.includes('/submissions/pending')) return { parent: 'Field Submissions', current: 'Pending Review' };
    if (pathname.includes('/submissions/profession')) return { parent: 'Field Submissions', current: 'By Profession' };
    if (pathname.includes('/submissions/attachments')) return { parent: 'Field Submissions', current: 'Evidence Attachments' };
    if (pathname.includes('/submissions')) return { parent: 'Field Submissions', current: 'All Submissions' };
    if (pathname.includes('/projects/new')) return { parent: 'Project Control', current: 'New Project' };
    if (pathname.includes('/projects/tasks')) return { parent: 'Project Control', current: 'Tasks & Actions' };
    if (pathname.includes('/projects/milestones')) return { parent: 'Project Control', current: 'Project Milestones' };
    if (pathname.includes('/projects')) return { parent: 'Project Control', current: 'Projects Directory' };
    if (pathname.includes('/reports/approvals')) return { parent: 'Quality & Reports', current: 'Approval Queue' };
    if (pathname.includes('/reports/published')) return { parent: 'Quality & Reports', current: 'Published Reports' };
    if (pathname.includes('/reports')) return { parent: 'Quality & Reports', current: 'All Reports' };
    if (pathname.includes('/performance/compliance')) return { parent: 'People & Compliance', current: 'Reporting Compliance' };
    if (pathname.includes('/performance')) return { parent: 'Overview', current: 'Key Metrics' };
    if (pathname.includes('/personnel/departments')) return { parent: 'People & Compliance', current: 'Departments & Cadres' };
    if (pathname.includes('/personnel')) return { parent: 'People & Compliance', current: 'Team Directory' };
    if (pathname.includes('/reviews/submissions')) return { parent: 'Reviews & Approvals', current: 'Submission Reviews' };
    if (pathname.includes('/reviews/reports')) return { parent: 'Reviews & Approvals', current: 'Report Approvals' };
    if (pathname.includes('/stakeholder/projects')) return { parent: 'Stakeholder Oversight', current: 'Capital Projects Audit' };
    if (pathname.includes('/stakeholder/compliance')) return { parent: 'Stakeholder Oversight', current: 'Statutory Compliance' };
    if (pathname.includes('/stakeholder/reports')) return { parent: 'Stakeholder Oversight', current: 'Inspection Sign-Offs' };
    if (pathname.includes('/stakeholder')) return { parent: 'Stakeholder Oversight', current: 'Executive Portfolio' };
    if (pathname.includes('/settings')) return { parent: 'System', current: 'Engineer Settings' };
    if (pathname.includes('/activity')) return { parent: 'Overview', current: 'Project Activity' };
    return { parent: 'Overview', current: 'Project Dashboard' };
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#F8FAFC]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between font-['Inter',sans-serif]">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 lg:hidden transition-colors"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail matching Reference UI: ⊞ Overview / Dashboard */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-normal">{breadcrumbs.parent}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">{breadcrumbs.current}</span>
        </nav>
      </div>

      {/* Right: Role Indicator, Notifications & User Menu */}
      <div className="flex items-center gap-2.5">
        {/* Active Role Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4FAAA7]" />
          <span>{roleInfo.title}</span>
        </div>

        {/* Notification Bell with interactive preview dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors cursor-pointer"
            title="Notifications & Alerts"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-[#F8FAFC]" />
            )}
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-2 text-xs text-slate-700 animate-fadeIn font-['Inter',sans-serif]">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                      Notifications
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
                      {unreadCount} unread
                    </span>
                  </div>
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-semibold text-[#3B68DE] hover:underline"
                  >
                    View Center
                  </Link>
                </div>

                {/* Notification Items List */}
                <div className="py-1 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {recentNotifications.map((notif) => (
                    <Link
                      key={notif.id}
                      href="/dashboard/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className={`block px-3 py-2.5 hover:bg-slate-50 transition-colors rounded-xl ${
                        !notif.isRead ? 'bg-slate-50/60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                              notif.severity === 'urgent'
                                ? 'bg-rose-500'
                                : notif.severity === 'warning'
                                ? 'bg-amber-500'
                                : notif.severity === 'success'
                                ? 'bg-emerald-500'
                                : 'bg-[#3B68DE]'
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-[#001237] line-clamp-1">
                              {notif.title}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {notif.message}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Footer link to full Notifications Page */}
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>Open Notifications Command Center</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#4FAAA7]" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* More Options Menu Button matching Reference UI ⋮ */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
            title="Options & settings"
            aria-label="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-1.5 text-xs text-slate-700 animate-fadeIn font-['Inter',sans-serif]">
                <div className="px-2.5 py-1.5 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">{roleInfo.title}</div>
                </div>
                <div className="py-1">
                  {user.role === 'read_only_stakeholder' ? (
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Settings</span>
                      </Link>
                      <Link
                        href="/dashboard/settings?tab=profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Profile</span>
                      </Link>
                    </>
                  )}
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
