import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Clock } from 'lucide-react';

export const metadata = {
  title: 'Project Milestones & Phase Gates | Civora Control Plane',
};

interface Milestone {
  id: string;
  projectCode: string;
  projectName: string;
  phase: string;
  targetDate: string;
  progressPercent: number;
  status: 'completed' | 'on_schedule' | 'at_risk';
  leadEngineer: string;
}

const MILESTONES: Milestone[] = [];

export default async function ProjectMilestonesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Milestones & Critical Phase Gates"
        description="Track major structural completion milestones, design stage approvals, and field testing verification gates."
        badge={<Badge variant="teal" size="sm">{MILESTONES.length} Active Phase Gates</Badge>}
      />

      {MILESTONES.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center text-xs text-slate-500">
          No project milestones or phase gates recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MILESTONES.map((milestone) => (
            <div
              key={milestone.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#4FAAA7]">
                  {milestone.projectCode}
                </span>
                <Badge variant="teal" size="sm">
                  {milestone.status.replace('_', ' ')}
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  {milestone.phase}
                </h3>
                <p className="text-xs text-slate-500">{milestone.projectName}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Phase Progress</span>
                  <span className="font-mono font-bold text-[#001237]">{milestone.progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4FAAA7] rounded-full transition-all duration-500"
                    style={{ width: `${milestone.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Target: {milestone.targetDate}
                </span>
                <span>Lead: {milestone.leadEngineer}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
