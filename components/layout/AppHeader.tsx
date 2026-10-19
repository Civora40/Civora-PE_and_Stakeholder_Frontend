'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { CivoraUser, UserRole } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';
import { DemoDataIndicator } from '@/components/ui/DemoDataIndicator';
import { Badge } from '@/components/ui/Badge';

interface AppHeaderProps {
  user: CivoraUser;
  onOpenMobileSidebar: () => void;
}

export function AppHeader({ user, onOpenMobileSidebar }: AppHeaderProps) {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const roleInfo = ROLE_LABELS[user.role];

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

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#001237]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-mono text-[#4FAAA7] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4FAAA7] inline-block" />
            CIVORA CONTROL PLANE
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Intelligent Construction. Clearer Control.
          </span>
        </div>
      </div>

      {/* Center: Live Role Switcher (Crucial for Reviewers to test all 3 roles!) */}
      <div className="flex items-center bg-[#18243D] p-1 rounded-xl border border-slate-700/80 text-xs">
        <span className="hidden xl:inline-block px-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          Test Role:
        </span>
        <button
          onClick={() => handleRoleSwitch('platform_admin')}
          disabled={isSwitchingRole}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            user.role === 'platform_admin'
              ? 'bg-[#3B68DE] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Switch to Platform Administrator"
        >
          Admin
        </button>
        <button
          onClick={() => handleRoleSwitch('project_engineer')}
          disabled={isSwitchingRole}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            user.role === 'project_engineer'
              ? 'bg-[#4FAAA7] text-[#001237] font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Switch to Project Engineer"
        >
          Engineer
        </button>
        <button
          onClick={() => handleRoleSwitch('read_only_stakeholder')}
          disabled={isSwitchingRole}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            user.role === 'read_only_stakeholder'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Switch to Read-only Stakeholder"
        >
          Stakeholder
        </button>
      </div>

      {/* Right: Demo Badge & User Menu */}
      <div className="flex items-center gap-3">
        {/* Required Demo Data Indicator */}
        <DemoDataIndicator className="hidden md:inline-block" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#18243D] transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18243D] border border-slate-700 flex items-center justify-center text-[#4FAAA7] font-bold text-xs">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400">{roleInfo.badge}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#18243D] border border-slate-700 shadow-2xl z-50 p-2 text-xs text-slate-200">
                <div className="p-2 border-b border-slate-800">
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1">
                    <Badge variant="teal" size="sm">
                      {roleInfo.title}
                    </Badge>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push('/dashboard/settings');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#001237] text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Account & RBAC Settings</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-500/10 text-rose-300 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out of Civora</span>
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
