'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  FileText,
  Users2,
  CheckSquare,
  Activity,
  FolderArchive,
  Shield,
  FileCheck2,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Check,
  ChevronsUpDown,
  User,
} from 'lucide-react';
import { CivoraUser, UserRole } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import { getWorkspaceNavigation } from '@/lib/navigation/workspace-navigation';
import { NavigationSection, NavigationSubItem } from '@/lib/navigation/types';
import { DEMO_SUBMISSIONS, DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { getNotificationsForRole } from '@/lib/mock-data/notifications';

interface AppSidebarProps {
  user: CivoraUser;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  LayoutDashboard,
  Inbox,
  Briefcase,
  FileText,
  Users2,
  CheckSquare,
  Activity,
  FolderArchive,
  Shield,
  FileCheck2,
};

export function AppSidebar({
  user,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation sections filtered by user permission
  const sections = useMemo(() => getWorkspaceNavigation(user), [user]);

  // Check whether an item is currently active without false-positive prefix matching on siblings
  const hasExactMatchInNav = useMemo(() => {
    if (pathname === '/dashboard/settings') return true;
    return sections.some((sec) => sec.items.some((it) => it.href === pathname));
  }, [sections, pathname]);

  const isItemActive = (itemHref: string) => {
    if (hasExactMatchInNav) {
      return pathname === itemHref;
    }
    if (itemHref === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(itemHref + '/');
  };

  // Collapsible section state, initialized with whichever section contains the active route
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec) => {
      initial[sec.id] = true; // Keep visible by default for smooth UX
    });
    return initial;
  });

  // Ensure active section expands when pathname changes
  useEffect(() => {
    sections.forEach((sec) => {
      const hasActive = sec.items.some((it) => isItemActive(it.href));
      if (hasActive) {
        setOpenSections((prev) => ({ ...prev, [sec.id]: true }));
      }
    });
  }, [pathname, sections, hasExactMatchInNav]);

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  // Real data counts for badge indicators
  const realCounts = useMemo(() => ({
    pendingSubmissions: DEMO_SUBMISSIONS.filter(
      (s) => s.reviewStatus === 'pending_review' || s.reviewStatus === 'needs_verification'
    ).length,
    pendingReports: DEMO_REPORTS.filter(
      (r) => r.status === 'review' || r.status === 'draft'
    ).length,
    unverifiedSenders: DEMO_SUBMISSIONS.filter(
      (s) => s.senderVerificationStatus === 'needs_verification'
    ).length,
    openTasks: 3,
    unreadAlerts: getNotificationsForRole(user.role).filter((n) => !n.isRead).length,
  }), [user.role]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const initials = (user.name || 'Marcus Vance')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const roleInfo = ROLE_LABELS[user.role] || {
    badge: 'Engineer',
    title: 'Project Engineer',
    description: 'Project Operations',
  };

  // Filter sections by quick search query if entered
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map((sec) => ({
        ...sec,
        items: sec.items.filter(
          (it) => it.name.toLowerCase().includes(q) || sec.name.toLowerCase().includes(q)
        ),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [sections, searchQuery]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#18243D] border-r border-slate-700/70 flex flex-col transition-all duration-200 lg:translate-x-0 no-scrollbar sidebar-scroll ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2">
            {!isCollapsed ? (
              <CivoraLogo
                size="sm"
                showTagline={false}
                href="/dashboard"
                theme="dark"
              />
            ) : (
              <CivoraLogo
                size="sm"
                variant="mark"
                href="/dashboard"
                theme="dark"
              />
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Label for Stakeholder per Spec Section 6 */}
        {!isCollapsed && user.role === 'read_only_stakeholder' && (
          <div className="px-4 py-2 border-b border-slate-700/50 bg-[#001237]/60 flex items-center justify-between">
            <span className="text-[11px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-[#4FAAA7]">
              Stakeholder Workspace
            </span>
            <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase">
              Read-Only
            </span>
          </div>
        )}

        {/* Quick Filter Input */}
        {!isCollapsed && (
          <div className="px-3 py-2 shrink-0">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#001237]/70 text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-lg border border-slate-700/60 focus:outline-none focus:border-[#4FAAA7] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Navigation Section List */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-2 space-y-3 focus:outline-none no-scrollbar sidebar-scroll"
          aria-label="Main Navigation"
        >
          {filteredSections.map((section: NavigationSection) => {
            const Icon = SECTION_ICONS[section.iconName] || LayoutDashboard;
            const isSectionOpen = openSections[section.id] ?? true;

            const isSectionActive = section.items.some((item) => isItemActive(item.href));

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header Button */}
                {!isCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors cursor-pointer group"
                    aria-expanded={isSectionOpen}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-3.5 h-3.5 transition-colors ${
                          isSectionActive ? 'text-[#4FAAA7]' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span>{section.name}</span>
                    </div>
                    {isSectionOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                ) : (
                  <div
                    className="flex justify-center py-2"
                    title={section.name}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                )}

                {/* Sub-links (Max 4-5 items) */}
                {(!isCollapsed ? isSectionOpen : true) && (
                  <div className="space-y-0.5 pl-1 sm:pl-2">
                    {section.items.map((item: NavigationSubItem) => {
                      const isActive = isItemActive(item.href);

                      const count = item.countKey ? realCounts[item.countKey] : undefined;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => {
                            if (isOpen && onClose) onClose();
                          }}
                          className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[#3B68DE] text-white font-semibold shadow-xs'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          } ${isCollapsed ? 'justify-center px-2' : ''}`}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <span className="truncate">{!isCollapsed ? item.name : item.name[0]}</span>

                          {!isCollapsed && count !== undefined && count > 0 && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                                isActive
                                  ? 'bg-white text-[#001237]'
                                  : 'bg-[#4FAAA7]/20 text-[#4FAAA7] border border-[#4FAAA7]/30'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Settings Navigation Action */}
        <div className="px-3 py-1.5 border-t border-slate-700/60 shrink-0">
          <Link
            href="/dashboard/settings"
            onClick={() => {
              if (isOpen && onClose) onClose();
            }}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              pathname === '/dashboard/settings'
                ? 'bg-[#3B68DE] text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <Settings className={`w-4 h-4 shrink-0 ${pathname === '/dashboard/settings' ? 'text-white' : 'text-slate-400'}`} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-slate-700/60 bg-[#141E33] shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              aria-label="User Profile Menu"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#001237] border border-slate-700 flex items-center justify-center text-xs font-bold text-[#4FAAA7] shrink-0">
                  {initials}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{roleInfo.title}</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              )}
            </button>

            {/* Quick Switcher Dropdown */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setUserMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-[#18243D] border border-slate-700 rounded-xl shadow-2xl p-2 text-xs text-slate-200 space-y-2 animate-in fade-in duration-150">
                  <div className="px-2.5 py-2 border-b border-slate-700/80">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-[#4FAAA7] font-mono mt-0.5 truncate">{roleInfo.title}</p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-xs cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    {user.role !== 'read_only_stakeholder' && (
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-xs cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Engineer Settings</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors font-medium text-xs cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
