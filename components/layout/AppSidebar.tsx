'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Inbox,
  FileText,
  Settings,
  Shield,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import { Badge } from '@/components/ui/Badge';
import { ROLE_LABELS, can } from '@/lib/permissions/rbac';

interface AppSidebarProps {
  user: CivoraUser;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ user, isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const roleInfo = ROLE_LABELS[user.role];

  const navigationItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      permitted: can(user, 'dashboard:read'),
    },
    {
      name: 'Projects',
      href: '/dashboard/projects',
      icon: Briefcase,
      permitted: can(user, 'projects:read'),
      badge: '4 Active',
    },
    {
      name: 'Submissions',
      href: '/dashboard/submissions',
      icon: Inbox,
      permitted: can(user, 'submissions:read'),
      badge: '5 Awaiting',
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: FileText,
      permitted: can(user, 'reports:read'),
      badge: user.role === 'read_only_stakeholder' ? 'Read-only' : undefined,
    },
    {
      name: 'Settings & RBAC',
      href: '/dashboard/settings',
      icon: Settings,
      permitted: true, // Everyone can view their profile and inspect the RBAC matrix; admin tabs gated inside
      badge: user.role === 'platform_admin' ? 'Full Admin' : 'Profile',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#001237] border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="h-20 px-6 border-b border-slate-800 flex items-center justify-between">
          <CivoraLogo size="sm" showTagline={false} href="/dashboard" theme="dark" />
        </div>

        {/* User Scope / Role Chip */}
        <div className="px-4 py-3 bg-[#18243D]/60 border-b border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Active Clearance:</span>
            <Badge
              variant={
                user.role === 'platform_admin'
                  ? 'blue'
                  : user.role === 'project_engineer'
                  ? 'teal'
                  : 'amber'
              }
              size="sm"
            >
              {roleInfo.badge}
            </Badge>
          </div>
          <div className="text-[11px] text-slate-300 font-semibold truncate mt-1">
            {roleInfo.title}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Sidebar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Control Plane
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            if (!item.permitted) {
              return null;
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#18243D] text-[#4FAAA7] border border-[#4FAAA7]/30 shadow-sm'
                    : 'text-slate-300 hover:bg-[#18243D]/60 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#4FAAA7]' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-[#4FAAA7]/20 text-[#4FAAA7]'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Status Panel */}
        <div className="p-4 border-t border-slate-800 bg-[#001237] space-y-2">
          <div className="rounded-lg bg-[#18243D] border border-slate-800 p-2.5 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-[#4FAAA7] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>RBAC Enforced Server-Side</span>
            </div>
            <p className="text-slate-400 text-[10px] leading-tight">
              Actions gated by cryptographic session tokens.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
