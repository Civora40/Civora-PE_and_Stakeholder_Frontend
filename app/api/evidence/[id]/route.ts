import { NextRequest, NextResponse } from 'next/server';
import { GET as streamFile } from './download/route';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Delegate directly to the download streaming handler
  return streamFile(req, context);
}
