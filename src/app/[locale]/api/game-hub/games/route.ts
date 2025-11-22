/**
 * GET /api/game-hub/games
 * Proxy to backend để lấy danh sách games
 */

import type { NextRequest } from 'next/server';
import type { GameManifest } from '@/lib/game-hub/protocol';
import { NextResponse } from 'next/server';

// Mock data for development - using local paths
const MOCK_GAMES: GameManifest[] = [
  {
    id: 'math-blitz',
    slug: 'math-blitz',
    title: 'Math Blitz',
    description: 'Giải toán nhanh trong 60 giây - Bạn giải được bao nhiêu phép tính?',
    version: '1.0.0',
    runtime: 'iframe-html',
    entryUrl: '/games/math-blitz/index.html',
    iconUrl: '/images/cover.webp',
    thumbnailUrl: '/images/cover.webp',
    capabilities: ['score', 'telemetry'],
    minHubVersion: '1.0.0',
    rolloutPercentage: 100,
    disabled: false,
    metadata: {
      difficulty: 'normal',
      estimatedTime: 2,
      category: 'math',
    },
  },
  {
    id: 'word-scramble',
    slug: 'word-scramble',
    title: 'Word Scramble',
    description: 'Sắp xếp các chữ cái để tạo thành từ đúng',
    version: '1.0.0',
    runtime: 'iframe-html',
    entryUrl: '/games/word-scramble/index.html',
    iconUrl: '/images/cover.webp',
    thumbnailUrl: '/images/cover.webp',
    capabilities: ['score', 'hints', 'telemetry'],
    minHubVersion: '1.0.0',
    rolloutPercentage: 100,
    disabled: false,
    metadata: {
      difficulty: 'normal',
      estimatedTime: 5,
      category: 'word',
    },
  },
  {
    id: 'memory-match-pro',
    slug: 'memory-match-pro',
    title: 'Memory Match Pro',
    description: 'Lật thẻ và tìm các cặp hình giống nhau - Nâng cao trí nhớ',
    version: '1.0.0',
    runtime: 'esm-module',
    entryUrl: '/api/games/memory-match-pro/entry.js',
    iconUrl: '/images/cover.webp',
    thumbnailUrl: '/images/cover.webp',
    capabilities: ['score', 'levels', 'telemetry'],
    minHubVersion: '1.0.0',
    rolloutPercentage: 100,
    disabled: false,
    metadata: {
      difficulty: 'easy',
      estimatedTime: 3,
      category: 'memory',
    },
  },
  {
    id: 'number-ninja',
    slug: 'number-ninja',
    title: 'Number Ninja',
    description: 'Tap các số theo thứ tự nhanh nhất có thể',
    version: '1.0.0',
    runtime: 'iframe-html',
    entryUrl: '/games/number-ninja/index.html',
    iconUrl: '/images/cover.webp',
    thumbnailUrl: '/images/cover.webp',
    capabilities: ['score', 'telemetry'],
    minHubVersion: '1.0.0',
    rolloutPercentage: 100,
    disabled: false,
    metadata: {
      difficulty: 'easy',
      estimatedTime: 2,
      category: 'logic',
    },
  },
  {
    id: 'chicken-game',
    slug: 'chicken-game',
    title: 'Chicken Game',
    description: 'Trò chơi điều khiển gà vượt qua các chướng ngại vật.',
    version: '1.0.0',
    runtime: 'iframe-html',
    entryUrl: '/games/chicken-game/index.html',
    iconUrl: '/images/cover.webp',
    thumbnailUrl: '/images/cover.webp',
    capabilities: ['score', 'telemetry'],
    minHubVersion: '1.0.0',
    rolloutPercentage: 100,
    disabled: false,
    metadata: {
      difficulty: 'easy',
      estimatedTime: 2,
      category: 'arcade',
    },
  },
  {
    id: 'frog-game',
    slug: 'frog-game',
    title: 'Frog Game',
    description: 'Giúp chú ếch băng qua đường và sông an toàn.',
    version: '1.0.0',
    runtime: 'iframe-html',
    entryUrl: '/games/frog-game/index.html',
    iconUrl: '/images/cover.webp',
    thumbnailUrl: '/images/cover.webp',
    capabilities: ['score', 'telemetry'],
    minHubVersion: '1.0.0',
    rolloutPercentage: 100,
    disabled: false,
    metadata: {
      difficulty: 'medium',
      estimatedTime: 3,
      category: 'arcade',
    },
  },
];

export async function GET(_request: NextRequest) {
  try {
    // const { searchParams } = new URL(request.url);
    // const platform = searchParams.get('platform') || 'web';

    // TODO: Replace with actual BE API call
    // const apiUrl = process.env.API_BASE_URL || '';
    // const response = await fetch(`${apiUrl}/games?platform=${platform}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });
    // const games = await response.json();

    // For now, return mock data
    const games = MOCK_GAMES.filter(game => !game.disabled);

    return NextResponse.json(games);
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
