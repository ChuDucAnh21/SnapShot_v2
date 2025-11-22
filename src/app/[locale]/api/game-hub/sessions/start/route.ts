/**
 * POST /api/game-hub/sessions/start
 * Khởi tạo game session
 */

import type { NextRequest } from 'next/server';
import type { GameSession } from '@/lib/game-hub/protocol';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    // TODO: Replace with actual BE API call
    // const apiUrl = process.env.API_BASE_URL || '';
    // const response = await fetch(`${apiUrl}/sessions/start`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ gameId }),
    // });
    // const session = await response.json();

    // For now, generate mock session
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const launchToken = `token-${Math.random().toString(36).slice(2, 20)}`;
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    const session: GameSession = {
      sessionId,
      launchToken,
      expiry,
      playerId: 'player-123', // TODO: Get from auth
    };

    return NextResponse.json(session);
  } catch (error) {
    console.error('Failed to start session:', error);
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}
