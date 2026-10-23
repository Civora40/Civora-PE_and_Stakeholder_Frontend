import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { retryAttachmentDownload } from '@/lib/services/ingestion';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { attachmentId } = body;

  if (!attachmentId) {
    return NextResponse.json({ error: 'attachmentId is required' }, { status: 400 });
  }

  const result = retryAttachmentDownload(id, attachmentId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
