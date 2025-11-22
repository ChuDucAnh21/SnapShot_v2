import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Simple CORS helpers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
  } as Record<string, string>;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'Missing url param' },
      { status: 400, headers: corsHeaders() },
    );
  }

  // Optional: allowlist hosts for safety (expand as needed)
  try {
    const parsed = new URL(url);
    const allowedHosts = new Set([
      'localhost:3002',
      '127.0.0.1:3002',
      // add more in env if needed
    ]);
    if (!allowedHosts.has(parsed.host)) {
      return NextResponse.json(
        { error: `Upstream host not allowed: ${parsed.host}` },
        { status: 400, headers: corsHeaders() },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid url param' },
      { status: 400, headers: corsHeaders() },
    );
  }

  try {
    const upstream = await fetch(url, { cache: 'no-store' });

    // Clone body as a stream/arrayBuffer to forward
    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const contentLength = upstream.headers.get('content-length') ?? undefined;
    const arrayBuffer = await upstream.arrayBuffer();

    const res = new NextResponse(arrayBuffer, {
      status: upstream.status,
      headers: {
        'content-type': contentType,
        ...(contentLength ? { 'content-length': contentLength } : {}),
        ...corsHeaders(),
      },
    });

    return res;
  } catch (err) {
    console.error('fetch upstream asset failed', err);
    return NextResponse.json(
      { error: 'Failed to fetch upstream asset' },
      { status: 502, headers: corsHeaders() },
    );
  }
}
