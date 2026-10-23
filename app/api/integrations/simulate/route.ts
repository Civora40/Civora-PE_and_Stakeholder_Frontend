import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { processInboundWebhook } from '@/lib/services/ingestion';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role === 'read_only_stakeholder') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const {
    channel = 'whatsapp',
    senderRaw,
    messageText,
    projectId,
    isDuplicate = false,
    simulateUnknownSender = false,
    simulateMediaFailure = false,
  } = body;

  const providerMessageId = isDuplicate
    ? 'wamid.HBgLMjM0ODAzNDE5MjA4NBUCABEYEjQxOEQ2QTQ3QzA5MkU3OEQ2NwA=' // Known duplicate from Tunde
    : `${channel === 'whatsapp' ? 'wamid.HBgL' : 'tg_msg_'}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const finalSenderRaw = simulateUnknownSender
    ? '+2348199990011' // Unregistered number
    : senderRaw || (channel === 'whatsapp' ? '+2348034192084' : '@chidinma_geo_lead');

  const result = processInboundWebhook({
    channel,
    providerEventId: `sim_evt_${Date.now()}`,
    providerMessageId,
    senderRaw: finalSenderRaw,
    projectId: projectId || 'prj_metro_01',
    messageText: messageText || 'Real-time test submission via field simulation',
    attachments: [
      {
        originalFilename: channel === 'whatsapp' ? 'live_test_photo.jpg' : 'live_sensor_log.csv',
        mimeType: channel === 'whatsapp' ? 'image/jpeg' : 'text/csv',
        fileSizeBytes: 1850000,
        providerMediaId: `med_sim_${Date.now()}`,
        category: channel === 'whatsapp' ? 'site_photo' : 'sensor_log',
        simulateFailure: simulateMediaFailure,
      },
    ],
  });

  return NextResponse.json(result, { status: 200 });
}
