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
} from 'lucide-react';
import { CivoraUser, UserRole } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';

interface AppHeaderProps {
  user: CivoraUser;
  onOpenMobileSidebar: () => void;
}

export function AppHeader({ user, onOpenMobileSidebar }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const roleInfo = ROLE_LABELS[user.role] || {
    badge: 'Admin',
    title: 'Platform Administrator',
  };

  const handleRoleSwitch = async (newRole: UserRole) => {
    if (newRole === user.role) return;
    setIsSwitchingRole(true);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsSwitchingRole(false);
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  // Generate clean breadcrumb labels matching active workspace section
  const getBreadcrumbs = () => {
    if (pathname.includes('/overview/projects')) return { parent: 'Overview', current: 'All Projects' };
    if (pathname.includes('/submissions/pending')) return { parent: 'Field Submissions', current: 'Pending Review' };
    if (pathname.includes('/submissions/profession')) return { parent: 'Field Submissions', current: 'By Profession' };
    if (pathname.includes('/submissions/attachments')) return { parent: 'Field Submissions', current: 'Evidence Attachments' };
    if (pathname.includes('/submissions')) return { parent: 'Field Submissions', current: 'All Submissions' };
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

      {/* Right: Quick Role Switcher, Notifications & More Menu */}
      <div className="flex items-center gap-2.5">
        {/* Live Role Switcher (Compact pill for fast switching across Engineer and Stakeholder roles) */}
        <div className="hidden md:flex items-center bg-white p-0.5 rounded-xl border border-slate-200/90 shadow-2xs text-[11px]">
          <button
            type="button"
            onClick={() => handleRoleSwitch('project_engineer')}
            disabled={isSwitchingRole}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              user.role === 'project_engineer'
                ? 'bg-[#001237] text-white shadow-2xs'
                : 'text-slate-500 hover:text-[#001237]'
            }`}
          >
            Engineer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('read_only_stakeholder')}
            disabled={isSwitchingRole}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              user.role === 'read_only_stakeholder'
                ? 'bg-[#001237] text-white shadow-2xs'
                : 'text-slate-500 hover:text-[#001237]'
            }`}
          >
            Stakeholder
          </button>
        </div>

        {/* Notification Bell matching reference UI */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-[#F8FAFC]" />
        </button>

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
