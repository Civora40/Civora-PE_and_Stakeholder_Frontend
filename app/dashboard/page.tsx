import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Inbox,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';
import { can, ROLE_LABELS } from '@/lib/permissions/rbac';
import { DEMO_PROJECTS, DEMO_SUBMISSIONS, DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const roleInfo = ROLE_LABELS[user.role];

  // Metric counts
  const activeProjectsCount = DEMO_PROJECTS.filter((p) => p.status === 'active').length;
  const pendingSubmissionsCount = DEMO_SUBMISSIONS.filter(
    (s) => s.reviewStatus === 'pending_review' || s.reviewStatus === 'received'
  ).length;
  const flaggedDiscrepanciesCount = DEMO_SUBMISSIONS.filter(
    (s) => s.aiFlag.status === 'advisory_discrepancy'
  ).length;
  const reportsAwaitingRelease = DEMO_REPORTS.filter((r) => r.status === 'approved').length;

  return (
    <div className="space-y-8">
      {/* Welcome & Role Context Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#18243D] via-[#18243D]/80 to-[#001237] border border-slate-700/80 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Welcome back, {user.name}
            </h1>
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
          <p className="text-xs text-slate-300">
            {roleInfo.title} &bull; {roleInfo.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {can(user, 'projects:manage') && (
            <Button
              href="/dashboard/projects"
              variant="teal"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Manage Projects
            </Button>
          )}
          {can(user, 'submissions:review') ? (
            <Button
              href="/dashboard/submissions"
              variant="primary"
              size="sm"
              leftIcon={<Inbox className="w-4 h-4" />}
            >
              Review Submittals
            </Button>
          ) : (
            <Button href="/dashboard/submissions" variant="outline" size="sm">
              View Read-Only Inbox
            </Button>
          )}
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl bg-[#18243D] border border-slate-700/80 p-5 space-y-2 hover:border-[#4FAAA7]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="p-2 rounded-lg bg-[#001237] text-[#4FAAA7]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-['Encode_Sans_Condensed',sans-serif]">
            {activeProjectsCount}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>4 Total in Workspace</span>
            <span className="text-[#4FAAA7] font-semibold">100% Tracked</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl bg-[#18243D] border border-slate-700/80 p-5 space-y-2 hover:border-[#3B68DE]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Submissions in Triage</span>
            <div className="p-2 rounded-lg bg-[#001237] text-blue-400">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-['Encode_Sans_Condensed',sans-serif]">
            {pendingSubmissionsCount}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>2 Awaiting PE Action</span>
            <span className="text-amber-400 font-semibold">Immediate Priority</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl bg-[#18243D] border border-amber-500/30 p-5 space-y-2 hover:border-amber-500/60 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-amber-300">
              Advisory Discrepancies
            </span>
            <div className="p-2 rounded-lg bg-[#001237] text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300 font-['Encode_Sans_Condensed',sans-serif]">
            {flaggedDiscrepanciesCount}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>AI Suggested Flags</span>
            <span className="text-slate-300 font-medium">Non-Binding Checks</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl bg-[#18243D] border border-slate-700/80 p-5 space-y-2 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Reports Ready to Release</span>
            <div className="p-2 rounded-lg bg-[#001237] text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-['Encode_Sans_Condensed',sans-serif]">
            {reportsAwaitingRelease}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>PE Approved Package</span>
            <span className="text-blue-300 font-semibold">Gated Release</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Submissions & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Submissions Table */}
        <div className="lg:col-span-2 rounded-2xl bg-[#18243D] border border-slate-700/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Recent Submittal Ingestion Activity
              </h2>
              <p className="text-xs text-slate-400">
                Incoming field logs and laboratory testing packages awaiting verification.
              </p>
            </div>
            <Link
              href="/dashboard/submissions"
              className="text-xs font-semibold text-[#4FAAA7] hover:underline inline-flex items-center gap-1"
            >
              View All Submissions &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#001237] text-slate-300 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">ID & Title</th>
                  <th className="p-3">Reporting Group</th>
                  <th className="p-3">AI Advisory Status</th>
                  <th className="p-3">Review Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {DEMO_SUBMISSIONS.slice(0, 4).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-mono text-[11px] text-[#4FAAA7] font-semibold">
                        {sub.identifier}
                      </div>
                      <div className="font-medium text-white line-clamp-1">{sub.title}</div>
                      <div className="text-[10px] text-slate-400">{sub.projectName}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="blue" size="sm">
                        {sub.reportingGroup}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {sub.aiFlag.status === 'advisory_discrepancy' ? (
                        <Badge variant="amber" size="sm" dot>
                          AI Flag: Discrepancy
                        </Badge>
                      ) : (
                        <Badge variant="emerald" size="sm">
                          AI: Spec Compliant
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          sub.reviewStatus === 'approved'
                            ? 'emerald'
                            : sub.reviewStatus === 'needs_information'
                            ? 'rose'
                            : sub.reviewStatus === 'pending_review'
                            ? 'amber'
                            : 'slate'
                        }
                        size="sm"
                      >
                        {sub.reviewStatus.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/dashboard/submissions?id=${sub.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#001237] hover:bg-slate-800 text-[#4FAAA7] font-medium border border-slate-700"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Active Project Scopes */}
        <div className="rounded-2xl bg-[#18243D] border border-slate-700/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Active Project Scopes
            </h2>
            <Link
              href="/dashboard/projects"
              className="text-xs font-semibold text-[#4FAAA7] hover:underline"
            >
              All Projects &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl bg-[#001237] border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-[#4FAAA7] font-semibold">
                      {proj.code}
                    </span>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{proj.name}</h3>
                    <p className="text-[11px] text-slate-400">{proj.client}</p>
                  </div>
                  <Badge
                    variant={proj.status === 'active' ? 'teal' : 'slate'}
                    size="sm"
                  >
                    {proj.status}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Progress: {proj.progressPercent}%</span>
                    <span>Lead: {proj.leadEngineer}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4FAAA7] to-[#3B68DE] rounded-full"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
