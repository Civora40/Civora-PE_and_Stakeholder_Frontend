import { NextRequest, NextResponse } from 'next/server';
import { processInboundWebhook } from '@/lib/services/ingestion';

/**
 * Telegram Bot Webhook Endpoint
 *
 * POST: Handles Telegram Update objects (message, document, photo, voice)
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Standard Telegram Bot API Update payload
    if (body.update_id && body.message) {
      const msg = body.message;
      const providerMessageId = `tg_msg_${msg.chat.id}_${msg.message_id}`;
      const providerEventId = `evt_tg_${body.update_id}`;
      const senderRaw = msg.from?.username ? `@${msg.from.username}` : `tg_user_${msg.from?.id}`;
      const messageText = msg.text || msg.caption || 'Field telemetry via Telegram Bot';

      const attachments = [];
      if (msg.photo && Array.isArray(msg.photo)) {
        const bestPhoto = msg.photo[msg.photo.length - 1];
        attachments.push({
          originalFilename: `tg_photo_${bestPhoto.file_unique_id}.jpg`,
          mimeType: 'image/jpeg',
          fileSizeBytes: bestPhoto.file_size || 1500000,
          providerMediaId: bestPhoto.file_id,
          category: 'site_photo' as const,
        });
      }
      if (msg.document) {
        attachments.push({
          originalFilename: msg.document.file_name || 'telegram_document.pdf',
          mimeType: msg.document.mime_type || 'application/pdf',
          fileSizeBytes: msg.document.file_size || 950000,
          providerMediaId: msg.document.file_id,
          category: 'sensor_log' as const,
        });
      }

      const result = processInboundWebhook({
        channel: 'telegram',
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
        channel: 'telegram',
        providerEventId: body.providerEventId || `evt_${Date.now()}`,
        providerMessageId: body.providerMessageId,
        senderRaw: body.senderRaw,
        projectId: body.projectId,
        messageText: body.messageText || 'Field telemetry submission via Telegram',
        attachments: body.attachments,
      });

      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json({ error: 'Malformed Telegram update payload' }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal Telegram ingestion error', details: (error as Error)?.message },
      { status: 500 }
    );
  }
}
