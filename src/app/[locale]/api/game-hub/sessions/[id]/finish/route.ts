/**
 * POST /api/game-hub/sessions/[id]/finish
 * Kết thúc game session
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { score, timeMs, progress: _progress } = body;

    // TODO: Replace with actual BE API call
    // const apiUrl = process.env.API_BASE_URL || '';
    // const response = await fetch(`${apiUrl}/sessions/${sessionId}/finish`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ score, timeMs, progress }),
    // });
    // const result = await response.json();

    // For now, return success
    return NextResponse.json({
      success: true,
      sessionId,
      score,
      timeMs,
    });
  } catch (error) {
    console.error('Failed to finish session:', error);
    return NextResponse.json({ error: 'Failed to finish session' }, { status: 500 });
  }
}
