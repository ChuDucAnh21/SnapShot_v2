/**
 * GET /api/game-hub/progress/[gameId]/load
 * Load game progress
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  try {
    const { gameId: _gameId } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // TODO: Replace with actual BE API call
    // const apiUrl = process.env.API_BASE_URL || '';
    // const response = await fetch(
    //   `${apiUrl}/progress/${gameId}/load?sessionId=${sessionId}`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     },
    //   }
    // );
    // const progress = await response.json();

    // For now, return mock data or 404
    // In production, retrieve from DB
    return NextResponse.json(
      { error: 'No saved progress found' },
      { status: 404 },
    );
  } catch (error) {
    console.error('Failed to load progress:', error);
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 });
  }
}
