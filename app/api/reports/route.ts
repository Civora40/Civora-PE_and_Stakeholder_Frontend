import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_REPORTS } from '@/lib/mock-data/fixtures';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    reports: DEMO_REPORTS,
  });
}
