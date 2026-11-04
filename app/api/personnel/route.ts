import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getCurrentUser, getSessionData } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { getPersonnelStore } from '@/lib/services/ingestion';
import { CivoraUser, Personnel } from '@/types';

export async function GET(req: NextRequest) {
  const session = await getSessionData();
  const user = session?.user ?? (await getCurrentUser());
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!can(user, 'personnel:read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  let personnel: Personnel[] = [...getPersonnelStore()];

  if (session?.accessToken) {
    const res = await fetchBackend<CivoraUser[]>('/users/', {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      const mapped: Personnel[] = res.data.map((u) => ({
        id: u.id,
        fullName: u.name || u.displayName || u.email,
        email: u.email,
        professionalTitle: u.jobTitle || u.title || 'Project Engineer',
        department: u.department || 'Civil & Structural Engineering',
        organization: u.organization || '',
        civoraRole: u.role,
        assignedProjects: Array.isArray(u.assignedProjects) ? u.assignedProjects : [],
        verifiedContacts: u.phone
          ? [
              {
                id: `cnt_${u.id}`,
                personnelId: u.id,
                type: 'whatsapp',
                value: u.phone,
                maskedValue: u.phone,
                verifiedAt: '2026-01-01',
                verifiedBy: 'Civora Identity Verification',
                isActive: true,
              },
            ]
          : [],
        verificationStatus: 'verified',
        expectedReportingCadence: 'daily',
        activeStatus: u.accountStatus === 'suspended' ? 'inactive' : 'active',
        effectiveFrom: '2026-01-01',
      }));
      const backendIds = new Set(mapped.map((m) => m.id));
      personnel = [...mapped, ...personnel.filter((p) => !backendIds.has(p.id))];
    }
  }

  if (projectId && projectId !== 'all') {
    personnel = personnel.filter(
      (p) => p.assignedProjects.includes('*') || p.assignedProjects.includes(projectId)
    );
  }

  return NextResponse.json({
    personnel,
    totalCount: personnel.length,
  });
}
