'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Sliders,
  Users2,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { can, ROLE_LABELS } from '@/lib/permissions/rbac';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { Badge } from '@/components/ui/Badge';

interface SettingsViewProps {
  user: CivoraUser;
}

export function SettingsView({ user }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'rbac' | 'platform' | 'users'>('profile');

  const canManageSettings = can(user, 'settings:manage');
  const canManageUsers = can(user, 'users:manage');
  const roleInfo = ROLE_LABELS[user.role];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
          Account & Platform Governance
        </h1>
        <p className="text-xs text-slate-400">
          Inspect your active session permissions, evaluate the RBAC matrix, and manage platform
          settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#18243D] p-1 rounded-xl border border-slate-700/80 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#3B68DE] text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Scope</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'rbac'
              ? 'bg-[#3B68DE] text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>RBAC Matrix Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('platform')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'platform'
              ? 'bg-[#3B68DE] text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Platform Settings</span>
          {!canManageSettings && <Lock className="w-3 h-3 text-amber-400" />}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#3B68DE] text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>User Provisioning</span>
          {!canManageUsers && <Lock className="w-3 h-3 text-amber-400" />}
        </button>
      </div>

      {/* Tab 1: Profile & Scope */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl bg-[#18243D] border border-slate-700/80 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Active User Profile
              </h2>
              <p className="text-xs text-slate-400">
                Credentials verified via server-side session token.
              </p>
            </div>
            <Badge variant="teal" size="md">
              {roleInfo.title}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#001237] border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Full Name:
              </span>
              <span className="text-sm font-bold text-white">{user.name}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#001237] border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Email Address:
              </span>
              <span className="text-sm font-mono text-[#4FAAA7]">{user.email}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#001237] border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Professional Title:
              </span>
              <span className="text-sm text-slate-200">{user.title}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#001237] border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Assigned Project Scopes:
              </span>
              <span className="text-sm font-mono text-white">
                {user.assignedProjects.includes('*')
                  ? 'All Enterprise Projects (*)'
                  : user.assignedProjects.join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Matrix Inspector */}
      {activeTab === 'rbac' && (
        <div className="rounded-2xl bg-[#18243D] border border-slate-700/80 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
              Role-Based Access Control (RBAC) Specification Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Direct verification of capabilities per role. Column with blue highlight denotes
              your currently authenticated role.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#001237] text-slate-300 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">Capability</th>
                  <th
                    className={`p-3 ${
                      user.role === 'platform_admin' ? 'bg-[#3B68DE]/20 text-white' : ''
                    }`}
                  >
                    Platform Admin
                  </th>
                  <th
                    className={`p-3 ${
                      user.role === 'project_engineer' ? 'bg-[#4FAAA7]/20 text-white' : ''
                    }`}
                  >
                    Project Engineer
                  </th>
                  <th
                    className={`p-3 ${
                      user.role === 'read_only_stakeholder' ? 'bg-amber-500/20 text-white' : ''
                    }`}
                  >
                    Read-only Stakeholder
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {[
                  {
                    cap: 'View dashboard overview',
                    admin: 'Yes',
                    eng: 'Yes',
                    stake: 'Yes',
                  },
                  {
                    cap: 'View authorized projects',
                    admin: 'Yes',
                    eng: 'Yes',
                    stake: 'Yes',
                  },
                  {
                    cap: 'Manage project configuration',
                    admin: 'Yes',
                    eng: 'Assigned scope only',
                    stake: 'No',
                  },
                  {
                    cap: 'View submittals & lab evidence',
                    admin: 'Yes',
                    eng: 'Authorized projects',
                    stake: 'Authorized projects',
                  },
                  {
                    cap: 'Review / approve submittals',
                    admin: 'If authorized',
                    eng: 'Assigned projects',
                    stake: 'No',
                  },
                  {
                    cap: 'View compliance reports',
                    admin: 'Yes',
                    eng: 'Authorized projects',
                    stake: 'Authorized projects',
                  },
                  {
                    cap: 'Create / edit report drafts',
                    admin: 'If authorized',
                    eng: 'Assigned projects',
                    stake: 'No',
                  },
                  {
                    cap: 'Release final reports',
                    admin: 'Explicit permission only',
                    eng: 'Explicit permission only',
                    stake: 'No',
                  },
                  {
                    cap: 'Manage users & roles',
                    admin: 'Yes',
                    eng: 'No',
                    stake: 'No',
                  },
                  {
                    cap: 'Platform settings & configuration',
                    admin: 'Yes',
                    eng: 'No',
                    stake: 'No',
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-white">{row.cap}</td>
                    <td
                      className={`p-3 ${
                        user.role === 'platform_admin' ? 'bg-[#3B68DE]/10 font-semibold' : ''
                      }`}
                    >
                      {row.admin}
                    </td>
                    <td
                      className={`p-3 ${
                        user.role === 'project_engineer' ? 'bg-[#4FAAA7]/10 font-semibold' : ''
                      }`}
                    >
                      {row.eng}
                    </td>
                    <td
                      className={`p-3 ${
                        user.role === 'read_only_stakeholder' ? 'bg-amber-500/10 font-semibold' : ''
                      }`}
                    >
                      {row.stake}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Settings (Permission-Gated) */}
      {activeTab === 'platform' && (
        <div className="rounded-2xl bg-[#18243D] border border-slate-700/80 p-6 space-y-6">
          {!canManageSettings ? (
            <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/40 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">
                Permission Denied: settings:manage Required
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Platform configuration and enterprise governance settings are restricted to
                Platform Administrators. Your active role is{' '}
                <strong className="text-amber-300">{roleInfo.title}</strong>.
              </p>
              <div className="text-[11px] text-slate-400">
                To test platform settings, switch to the <strong>Platform Admin</strong> role using
                the top bar switcher.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Enterprise Platform Settings
                  </h2>
                  <p className="text-xs text-slate-400">
                    Governing parameters for AI spec ingestion, OCR thresholds, and audit locks.
                  </p>
                </div>
                <Badge variant="emerald" size="sm">
                  Full Administrative Clearance
                </Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-[#001237] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Audit Trail Cryptographic Hashing</div>
                    <div className="text-slate-400 text-[11px]">
                      Enforces immutable SHA-256 event chaining on all submittal actions.
                    </div>
                  </div>
                  <Badge variant="teal" size="sm">
                    Active & Enforced
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-[#001237] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">AI Discrepancy Sensitivity Threshold</div>
                    <div className="text-slate-400 text-[11px]">
                      Flags compressive test or sensor deflections exceeding 5% variance from contract spec.
                    </div>
                  </div>
                  <Badge variant="blue" size="sm">
                    Tolerance: 5.0%
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-[#001237] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Two-Person Release Verification</div>
                    <div className="text-slate-400 text-[11px]">
                      Requires separate approval actor and release actor for final reports.
                    </div>
                  </div>
                  <Badge variant="emerald" size="sm">
                    Mandated
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: User Provisioning (Permission-Gated) */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-[#18243D] border border-slate-700/80 p-6 space-y-6">
          {!canManageUsers ? (
            <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/40 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">
                Permission Denied: users:manage Required
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                User role assignment and security provisioning requires Platform Administrator
                clearance. Current role: <strong className="text-amber-300">{roleInfo.title}</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Active Provisioned Roster
                  </h2>
                  <p className="text-xs text-slate-400">
                    Personnel authorized for project scopes and submittal review.
                  </p>
                </div>
                <Badge variant="blue" size="sm">
                  3 Enterprise Accounts
                </Badge>
              </div>

              <div className="rounded-xl border border-slate-700/60 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#001237] text-slate-300 font-semibold border-b border-slate-700">
                    <tr>
                      <th className="p-3">User & Title</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Assigned Role</th>
                      <th className="p-3">Authorized Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {Object.values(DEMO_USERS).map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="p-3">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.title}</div>
                        </td>
                        <td className="p-3 font-mono text-[#4FAAA7]">{u.email}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              u.role === 'platform_admin'
                                ? 'blue'
                                : u.role === 'project_engineer'
                                ? 'teal'
                                : 'amber'
                            }
                            size="sm"
                          >
                            {ROLE_LABELS[u.role].badge}
                          </Badge>
                        </td>
                        <td className="p-3 font-mono text-slate-300 text-[11px]">
                          {u.assignedProjects.includes('*')
                            ? 'All Projects (*)'
                            : u.assignedProjects.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
