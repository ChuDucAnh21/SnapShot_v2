/**
 * GET /api/game-hub/leaderboard/[gameId]
 * Get leaderboard for a game
 */

import type { NextRequest } from 'next/server';
import type { LeaderboardEntry } from '@/lib/game-hub/protocol';
import { NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  try {
    const { gameId } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'weekly'; // daily, weekly, monthly, all-time

    // TODO: Replace with actual BE API call
    // const apiUrl = process.env.API_BASE_URL || '';
    // const response = await fetch(
    //   `${apiUrl}/leaderboard/${gameId}?period=${period}`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     },
    //   }
    // );
    // const leaderboard = await response.json();

    // For now, return mock leaderboard
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        playerId: 'player-1',
        playerName: 'Người chơi 1',
        score: 9500,
        rank: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        playerId: 'player-2',
        playerName: 'Người chơi 2',
        score: 8200,
        rank: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        playerId: 'player-3',
        playerName: 'Người chơi 3',
        score: 7800,
        rank: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ];

    return NextResponse.json({
      gameId,
      period,
      entries: mockLeaderboard,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
