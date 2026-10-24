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

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role === 'read_only_stakeholder') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (body.whatsapp) {
      DEMO_INTEGRATION_CONFIG.whatsapp = {
        ...DEMO_INTEGRATION_CONFIG.whatsapp,
        ...body.whatsapp,
      };
    }

    if (body.telegram) {
      DEMO_INTEGRATION_CONFIG.telegram = {
        ...DEMO_INTEGRATION_CONFIG.telegram,
        ...body.telegram,
      };
    }

    return NextResponse.json({
      success: true,
      config: DEMO_INTEGRATION_CONFIG,
      message: 'Integration configurations successfully updated.',
    });
  } catch (error) {
    console.error('Error updating integrations:', error);
    return NextResponse.json({ error: 'Failed to update integration settings' }, { status: 500 });
  }
}

