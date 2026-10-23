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
        <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
          Account & Platform Governance
        </h1>
        <p className="text-xs text-slate-500">
          Inspect your active session permissions, evaluate the RBAC matrix, and manage platform
          settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#001237] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Scope</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'rbac'
              ? 'bg-[#001237] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>RBAC Matrix Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('platform')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'platform'
              ? 'bg-[#001237] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Platform Settings</span>
          {!canManageSettings && <Lock className="w-3 h-3 text-amber-500" />}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#001237] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>User Provisioning</span>
          {!canManageUsers && <Lock className="w-3 h-3 text-amber-500" />}
        </button>
      </div>

      {/* Tab 1: Profile & Scope */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                Active User Profile
              </h2>
              <p className="text-xs text-slate-500">
                Credentials verified via server-side session token.
              </p>
            </div>
            <Badge variant="teal" size="md">
              {roleInfo.title}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
                Full Name:
              </span>
              <span className="text-sm font-bold text-slate-900">{user.name}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
                Email Address:
              </span>
              <span className="text-sm font-mono text-[#001237] font-semibold">{user.email}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
                Professional Title:
              </span>
              <span className="text-sm text-slate-800">{user.title}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
                Assigned Project Scopes:
              </span>
              <span className="text-sm font-mono text-slate-900 font-medium">
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
        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
              Role-Based Access Control (RBAC) Specification Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Direct verification of capabilities per role. Column with blue highlight denotes
              your currently authenticated role.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Capability</th>
                  <th
                    className={`p-3.5 ${
                      user.role === 'platform_admin' ? 'bg-[#001237] text-white' : ''
                    }`}
                  >
                    Platform Admin
                  </th>
                  <th
                    className={`p-3.5 ${
                      user.role === 'project_engineer' ? 'bg-[#001237] text-white' : ''
                    }`}
                  >
                    Project Engineer
                  </th>
                  <th
                    className={`p-3.5 ${
                      user.role === 'read_only_stakeholder' ? 'bg-[#001237] text-white' : ''
                    }`}
                  >
                    Read-only Stakeholder
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
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
                  <tr key={i} className="hover:bg-slate-50/70">
                    <td className="p-3.5 font-medium text-slate-900">{row.cap}</td>
                    <td
                      className={`p-3.5 ${
                        user.role === 'platform_admin' ? 'bg-blue-50/80 font-bold text-[#001237]' : ''
                      }`}
                    >
                      {row.admin}
                    </td>
                    <td
                      className={`p-3.5 ${
                        user.role === 'project_engineer' ? 'bg-teal-50/80 font-bold text-[#001237]' : ''
                      }`}
                    >
                      {row.eng}
                    </td>
                    <td
                      className={`p-3.5 ${
                        user.role === 'read_only_stakeholder' ? 'bg-amber-50/80 font-bold text-[#001237]' : ''
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
        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-sm">
          {!canManageSettings ? (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="text-base font-bold text-amber-900">
                Permission Denied: settings:manage Required
              </h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                Platform configuration and enterprise governance settings are restricted to
                Platform Administrators. Your active role is{' '}
                <strong className="text-amber-950 font-bold">{roleInfo.title}</strong>.
              </p>
              <div className="text-[11px] text-amber-700">
                To test platform settings, switch to the <strong>Platform Admin</strong> role using
                the top bar switcher.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Enterprise Platform Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Governing parameters for AI spec ingestion, OCR thresholds, and audit locks.
                  </p>
                </div>
                <Badge variant="emerald" size="sm">
                  Full Administrative Clearance
                </Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">Audit Trail Cryptographic Hashing</div>
                    <div className="text-slate-500 text-[11px]">
                      Enforces immutable SHA-256 event chaining on all submittal actions.
                    </div>
                  </div>
                  <Badge variant="teal" size="sm">
                    Active & Enforced
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">AI Discrepancy Sensitivity Threshold</div>
                    <div className="text-slate-500 text-[11px]">
                      Flags compressive test or sensor deflections exceeding 5% variance from contract spec.
                    </div>
                  </div>
                  <Badge variant="blue" size="sm">
                    Tolerance: 5.0%
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">Two-Person Release Verification</div>
                    <div className="text-slate-500 text-[11px]">
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
        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-6 shadow-sm">
          {!canManageUsers ? (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="text-base font-bold text-amber-900">
                Permission Denied: users:manage Required
              </h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                User role assignment and security provisioning requires Platform Administrator
                clearance. Current role: <strong className="text-amber-950 font-bold">{roleInfo.title}</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                    Active Provisioned Roster
                  </h2>
                  <p className="text-xs text-slate-500">
                    Personnel authorized for project scopes and submittal review.
                  </p>
                </div>
                <Badge variant="blue" size="sm">
                  3 Enterprise Accounts
                </Badge>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">User & Title</th>
                      <th className="p-3.5">Email Address</th>
                      <th className="p-3.5">Assigned Role</th>
                      <th className="p-3.5">Authorized Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {Object.values(DEMO_USERS).map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500">{u.title}</div>
                        </td>
                        <td className="p-3.5 font-mono text-[#001237] font-semibold">{u.email}</td>
                        <td className="p-3.5">
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
                        <td className="p-3.5 font-mono text-slate-600 text-[11px]">
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
