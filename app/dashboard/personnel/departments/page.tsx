import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { DEMO_PERSONNEL } from '@/lib/mock-data/fixtures';
import { Users2 } from 'lucide-react';
import { PersonnelDirectory } from '@/features/personnel/components/PersonnelDirectory';

export const metadata = {
  title: 'Departments & Cadres | Civora Control Plane',
};

export default async function PersonnelDepartmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Group personnel by department
  const departments = Array.from(new Set(DEMO_PERSONNEL.map((p) => p.department)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments & Engineering Cadres"
        description="Structured breakdown of field submitters, reporting cadres, and professional titles across civil engineering disciplines."
        badge={<Badge variant="teal" size="sm">{departments.length} Departments</Badge>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {departments.map((dept) => {
          const count = DEMO_PERSONNEL.filter((p) => p.department === dept).length;
          return (
            <div
              key={dept}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                  {dept}
                </span>
                <Users2 className="w-4 h-4 text-[#4FAAA7]" />
              </div>
              <div className="text-xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif]">
                {count} Personnel
              </div>
            </div>
          );
        })}
      </div>

      <PersonnelDirectory user={user} initialPersonnel={DEMO_PERSONNEL} />
    </div>
  );
}
