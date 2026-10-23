'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  Inbox,
  Briefcase,
  Users2,
  FileText,
  Settings,
  Search,
  ChevronDown,
  ChevronsUpDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Shield,
  Check,
  UserPlus,
  History,
  Activity,
  Award,
} from 'lucide-react';
import { CivoraUser, UserRole } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';
import { CivoraLogo } from '@/components/brand/CivoraLogo';

interface AppSidebarProps {
  user: CivoraUser;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({
  user,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [submissionsOpen, setSubmissionsOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const roleInfo = ROLE_LABELS[user.role] || {
    badge: 'Admin',
    title: 'Platform Administrator',
    description: 'System-wide governance',
  };

  // Workspace label strictly matching Section 4 of the Civora MD specification
  const workspaceLabel =
    user.role === 'platform_admin'
      ? 'Platform Administration'
      : user.role === 'project_engineer'
      ? 'Project Workspace'
      : 'Project Updates';

  const initials = (user.name || 'Marcus Vance')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
        setUserMenuOpen(false);
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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#18243D] border-r border-slate-700/70 flex flex-col transition-all duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header with Official Civora Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2">
            {!isCollapsed ? (
              <CivoraLogo size="sm" showTagline={false} href="/dashboard" theme="dark" />
            ) : (
              <CivoraLogo size="sm" variant="mark" href="/dashboard" theme="dark" />
            )}
          </div>

          {/* Sidebar Collapse Toggle Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Workspace Context Chip matching Civora MD specification */}
        {!isCollapsed && (
          <div className="px-4 py-2 bg-[#001237]/60 border-b border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Workspace:
            </span>
            <span className="font-bold text-[#4FAAA7] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              {workspaceLabel}
            </span>
          </div>
        )}

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search submittals, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#001237]/70 border border-slate-700/70 rounded-xl pl-8 pr-11 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4FAAA7] focus:border-[#4FAAA7] shadow-inner transition-all"
              />
              <div className="absolute right-2.5 flex items-center gap-0.5 text-[10px] font-medium text-slate-400 bg-[#18243D] px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Navigation Groups by Role (MD Specification Section 4) */}
        <div className="flex-1 px-3 py-3 space-y-4 overflow-y-auto font-['Inter',sans-serif]">
          {/* NAVIGATION LINKS */}
          <div>
            {!isCollapsed && (
              <div className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400/90">
                CONTROL PLANE
              </div>
            )}
            <nav className="space-y-0.5">
              {/* 1. Overview */}
              <Link
                href="/dashboard"
                onClick={onClose}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/dashboard'
                    ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Overview"
              >
                <LayoutGrid
                  className={`w-4 h-4 ${
                    pathname === '/dashboard' ? 'text-[#4FAAA7]' : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && <span>Overview</span>}
              </Link>

              {/* 2. Platform Admin Navigation */}
              {user.role === 'platform_admin' && (
                <>
                  <Link
                    href="/dashboard/settings?tab=users"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      pathname.includes('/settings') && pathname.includes('tab=users')
                        ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Users & Access"
                  >
                    <Users2 className={`w-4 h-4 ${pathname.includes('tab=users') ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>Users & Access</span>}
                  </Link>

                  <Link
                    href="/dashboard/settings?tab=invitations"
                    onClick={onClose}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    title="Invitations"
                  >
                    <UserPlus className="w-4 h-4 text-slate-400" />
                    {!isCollapsed && <span>Invitations</span>}
                  </Link>

                  <Link
                    href="/dashboard/projects"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      pathname.startsWith('/dashboard/projects')
                        ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Projects"
                  >
                    <Briefcase className={`w-4 h-4 ${pathname.startsWith('/dashboard/projects') ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>Projects</span>}
                  </Link>

                  <Link
                    href="/dashboard/reports"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      pathname.startsWith('/dashboard/reports')
                        ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Reports"
                  >
                    <FileText className={`w-4 h-4 ${pathname.startsWith('/dashboard/reports') ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>Reports</span>}
                  </Link>

                  <Link
                    href="/dashboard/settings?tab=audit"
                    onClick={onClose}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    title="Audit Trail"
                  >
                    <History className="w-4 h-4 text-slate-400" />
                    {!isCollapsed && <span>Audit Trail</span>}
                  </Link>
                </>
              )}

              {/* 3. Project Engineer Navigation */}
              {user.role === 'project_engineer' && (
                <>
                  <Link
                    href="/dashboard/projects"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      pathname.startsWith('/dashboard/projects')
                        ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Projects"
                  >
                    <Briefcase className={`w-4 h-4 ${pathname.startsWith('/dashboard/projects') ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>Projects</span>}
                  </Link>

                  {/* Submissions (with tree) */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setSubmissionsOpen(!submissionsOpen)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        pathname.startsWith('/dashboard/submissions')
                          ? 'text-white font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      title="Submissions"
                    >
                      <div className="flex items-center gap-3">
                        <Inbox className={`w-4 h-4 ${pathname.startsWith('/dashboard/submissions') ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                        {!isCollapsed && <span>Submissions</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                            submissionsOpen ? 'rotate-0' : '-rotate-90'
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu Tree matching Reference UI */}
                    {!isCollapsed && submissionsOpen && (
                      <div className="ml-5 pl-3 border-l border-slate-700 space-y-0.5 mt-0.5 pt-0.5">
                        <Link
                          href="/dashboard/submissions"
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:text-[#4FAAA7] hover:bg-white/5 transition-colors"
                        >
                          All / My Queue
                        </Link>
                        <Link
                          href="/dashboard/submissions?status=pending_review"
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:text-[#4FAAA7] hover:bg-white/5 transition-colors"
                        >
                          Awaiting Review
                        </Link>
                        <Link
                          href="/dashboard/submissions?status=needs_information"
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:text-[#4FAAA7] hover:bg-white/5 transition-colors"
                        >
                          Advisory Discrepancies
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/dashboard/reports"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      pathname.startsWith('/dashboard/reports')
                        ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Reports"
                  >
                    <FileText className={`w-4 h-4 ${pathname.startsWith('/dashboard/reports') ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>Reports</span>}
                  </Link>

                  <a
                    href="#activity"
                    onClick={onClose}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    title="Project Activity"
                  >
                    <Activity className="w-4 h-4 text-slate-400" />
                    {!isCollapsed && <span>Project Activity</span>}
                  </a>
                </>
              )}

              {/* 4. Read-Only Stakeholder Navigation */}
              {user.role === 'read_only_stakeholder' && (
                <>
                  <Link
                    href="/dashboard/projects"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      pathname.startsWith('/dashboard/projects')
                        ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="My Projects"
                  >
                    <Briefcase className={`w-4 h-4 ${pathname.startsWith('/dashboard/projects') ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>My Projects</span>}
                  </Link>

                  <Link
                    href="/dashboard/reports"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      pathname.startsWith('/dashboard/reports')
                        ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Released Reports"
                  >
                    <FileText className={`w-4 h-4 ${pathname.startsWith('/dashboard/reports') ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>Released Reports</span>}
                  </Link>

                  <a
                    href="#activity"
                    onClick={onClose}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    title="Project Activity"
                  >
                    <Activity className="w-4 h-4 text-slate-400" />
                    {!isCollapsed && <span>Project Activity</span>}
                  </a>
                </>
              )}
            </nav>
          </div>

          {/* GOVERNANCE & SETTINGS SECTION */}
          <div>
            {!isCollapsed && (
              <div className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400/90">
                GOVERNANCE & SETTINGS
              </div>
            )}
            <nav className="space-y-0.5">
              <Link
                href="/dashboard/settings?tab=profile"
                onClick={onClose}
                className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                title="Engineering Profile"
              >
                <Award className="w-4 h-4 text-slate-400" />
                {!isCollapsed && <span>COREN Profile</span>}
              </Link>

              <Link
                href="/dashboard/settings"
                onClick={onClose}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/dashboard/settings'
                    ? 'bg-[#001237] text-white font-semibold shadow-xs border-l-2 border-[#4FAAA7]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Settings & RBAC"
              >
                <Settings className={`w-4 h-4 ${pathname === '/dashboard/settings' ? 'text-[#4FAAA7]' : 'text-slate-400'}`} />
                {!isCollapsed && <span>Settings & RBAC</span>}
              </Link>
            </nav>
          </div>
        </div>

        {/* User Profile Pill */}
        <div className="p-3 border-t border-slate-700/60 relative bg-[#18243D]">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-700/70 bg-[#001237]/50 hover:bg-[#001237] transition-colors cursor-pointer text-left shadow-sm group"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar with Green Status Dot */}
              <div className="relative w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span>{initials}</span>
                )}
                <span className="w-2.5 h-2.5 rounded-full bg-[#008751] ring-2 ring-[#18243D] absolute -bottom-0.5 -right-0.5" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                    {user.name || 'Engr. Marcus Vance'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {user.email || 'engineer@civora.internal'}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronsUpDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 shrink-0 ml-1.5" />
            )}
          </button>

          {/* User Popover Menu */}
          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute bottom-full left-3 right-3 mb-2 rounded-2xl bg-[#18243D] border border-slate-700 shadow-2xl z-50 p-2.5 space-y-2 text-xs text-white animate-fadeIn">
                <div className="px-2 py-1 border-b border-slate-700/60">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#001237] text-[10px] font-semibold text-[#4FAAA7] border border-slate-700">
                    <Shield className="w-3 h-3 text-[#4FAAA7]" />
                    <span>{roleInfo.title}</span>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="px-2 py-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Switch Clearance Role:
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch('platform_admin')}
                      disabled={isSwitchingRole}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        user.role === 'platform_admin'
                          ? 'bg-[#001237] text-white font-semibold border border-blue-500/40'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>Platform Admin</span>
                      {user.role === 'platform_admin' && <Check className="w-3.5 h-3.5 text-[#3B68DE]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch('project_engineer')}
                      disabled={isSwitchingRole}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        user.role === 'project_engineer'
                          ? 'bg-[#001237] text-[#4FAAA7] font-semibold border border-[#4FAAA7]/40'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>Project Engineer (PE)</span>
                      {user.role === 'project_engineer' && <Check className="w-3.5 h-3.5 text-[#4FAAA7]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch('read_only_stakeholder')}
                      disabled={isSwitchingRole}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        user.role === 'read_only_stakeholder'
                          ? 'bg-[#001237] text-amber-300 font-semibold border border-amber-500/40'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>Stakeholder (Read-Only)</span>
                      {user.role === 'read_only_stakeholder' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-700/60 space-y-0.5">
                  <Link
                    href="/dashboard/settings?tab=profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
