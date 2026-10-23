import { NextRequest, NextResponse } from 'next/server';
import { processInboundWebhook } from '@/lib/services/ingestion';
import { DEMO_INTEGRATION_CONFIG } from '@/lib/mock-data/fixtures';

/**
 * WhatsApp Business Platform Webhook Endpoint
 *
 * GET: Webhook verification challenge from Meta Cloud API
 * POST: Incoming messaging events, photos, break logs, and documents
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = DEMO_INTEGRATION_CONFIG.whatsapp.webhookVerifyToken;

  if (mode === 'subscribe' && token === expectedToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden: Invalid webhook verify token' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Standard Meta WhatsApp Cloud API payload format or normalized direct payload
    if (body.entry && Array.isArray(body.entry)) {
      const entry = body.entry[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      if (!message) {
        return NextResponse.json({ status: 'ignored_no_message' }, { status: 200 });
      }

      const providerMessageId = message.id;
      const providerEventId = entry.id || `evt_${Date.now()}`;
      const senderRaw = `+${message.from}`;
      const messageText = message.text?.body || message.caption || 'Field update with attached media';

      const attachments = [];
      if (message.image) {
        attachments.push({
          originalFilename: `field_photo_${Date.now().toString().slice(-4)}.jpg`,
          mimeType: message.image.mime_type || 'image/jpeg',
          fileSizeBytes: 2450000,
          providerMediaId: message.image.id,
          category: 'site_photo' as const,
        });
      }
      if (message.document) {
        attachments.push({
          originalFilename: message.document.filename || 'site_document.pdf',
          mimeType: message.document.mime_type || 'application/pdf',
          fileSizeBytes: 1200000,
          providerMediaId: message.document.id,
          category: 'test_report' as const,
        });
      }

      const result = processInboundWebhook({
        channel: 'whatsapp',
        providerEventId,
        providerMessageId,
        senderRaw,
        messageText,
        attachments,
      });

      return NextResponse.json(result, { status: 200 });
    }

    // Direct normalized ingestion simulation payload
    if (body.providerMessageId && body.senderRaw) {
      const result = processInboundWebhook({
        channel: 'whatsapp',
        providerEventId: body.providerEventId || `evt_${Date.now()}`,
        providerMessageId: body.providerMessageId,
        senderRaw: body.senderRaw,
        projectId: body.projectId,
        messageText: body.messageText || 'Field submission via WhatsApp',
        attachments: body.attachments,
      });

      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json({ error: 'Malformed webhook payload' }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal ingestion error', details: (error as Error)?.message },
      { status: 500 }
    );
  }
}
