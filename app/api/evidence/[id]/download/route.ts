import { NextRequest, NextResponse } from 'next/server';
import { CIVORA_BACKEND_URL } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionData();
  const { id } = await params;

  const backendBase = (
    process.env.CIVORA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    CIVORA_BACKEND_URL
  ).replace(/\/$/, '');

  const targetUrl = `${backendBase}/evidence/${id}/download/`;

  const headers: Record<string, string> = {};
  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }
  if (session?.user?.organization) {
    headers['X-Organization-ID'] = session.user.organization;
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: 'Unable to stream evidence file from backend repository.' },
        { status: upstreamRes.status }
      );
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition =
      upstreamRes.headers.get('content-disposition') || `attachment; filename="evidence_${id}"`;

    const blob = await upstreamRes.arrayBuffer();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Evidence stream failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
