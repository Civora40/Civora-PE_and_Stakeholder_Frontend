import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { DEMO_SUBMISSIONS } from '@/lib/mock-data/fixtures';
import { SubmissionsInbox } from '@/app/(engineer)/components/SubmissionsInbox';
import { HardHat, Compass, ShieldCheck, Layers } from 'lucide-react';

export const metadata = {
  title: 'Submissions by Profession | Civora Control Plane',
};

const CADRES = [
  { name: 'Site Engineering', icon: HardHat, filter: 'Site Engineering' },
  { name: 'QA / QC Materials Testing', icon: ShieldCheck, filter: 'Quality / Inspection' },
  { name: 'Surveying & Geotechnical', icon: Compass, filter: 'Survey' },
  { name: 'Structural & Concrete', icon: Layers, filter: 'Site Work' },
];

export default async function SubmissionsByProfessionPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Field Submissions by Professional Discipline"
        description="Filter and evaluate field evidence grouped across professional engineering cadres."
        badge={<Badge variant="teal" size="sm">Cadre Grouped</Badge>}
      />

      {/* Cadre Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CADRES.map((cadre) => {
          const Icon = cadre.icon;
          const count = DEMO_SUBMISSIONS.filter(
            (s) =>
              s.senderRole?.toLowerCase().includes(cadre.filter.toLowerCase()) ||
              s.primaryCategory?.toLowerCase().includes(cadre.filter.toLowerCase()) ||
              s.title.toLowerCase().includes(cadre.filter.toLowerCase())
          ).length;

          return (
            <div
              key={cadre.name}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                  {cadre.name}
                </span>
                <Icon className="w-4 h-4 text-[#4FAAA7]" />
              </div>
              <div className="text-xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
                {count > 0 ? `${count} Records` : 'Active'}
              </div>
            </div>
          );
        })}
      </div>

      <SubmissionsInbox user={user} submissions={DEMO_SUBMISSIONS} />
    </div>
  );
}
