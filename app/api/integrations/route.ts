import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_INTEGRATION_CONFIG } from '@/lib/mock-data/fixtures';
import { getIntegrationEventsStore } from '@/lib/services/ingestion';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Both platform_admin and project_engineer can inspect integration telemetry in Civora
  if (user.role === 'read_only_stakeholder') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const events = getIntegrationEventsStore();

  return NextResponse.json({
    config: DEMO_INTEGRATION_CONFIG,
    events,
  });
}
