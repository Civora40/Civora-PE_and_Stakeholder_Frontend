import { NextRequest, NextResponse } from 'next/server';
import { CIVORA_BACKEND_URL } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const backendBase = (
    process.env.CIVORA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    CIVORA_BACKEND_URL
  ).replace(/\/$/, '');

  const headers: Record<string, string> = {};
  if (session.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }
  if (session.user.organization) {
    headers['X-Organization-ID'] = session.user.organization;
  }

  try {
    const upstreamRes = await fetch(`${backendBase}/evidence/upload/`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await upstreamRes.json();
    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Evidence upload proxy failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
