/**
 * Game Hub Main Page
 * Danh sách games và launcher
 */

'use client';

import type { GameManifest, GameSession, LaunchContext } from '@/lib/game-hub/protocol';
import { ExternalLink, Gamepad2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GameLauncher } from '@/components/game-hub/game-launcher';
import { GameList } from '@/components/game-hub/game-list';
import { GameStats } from '@/components/game-hub/game-stats';
import { Button } from '@/components/ui/button';
import { useHubSession } from '@/hooks/useHubSession';
import { SDK_VERSION } from '@/lib/game-hub/protocol';
import { useGameHubStore } from '@/stores/game-hub-store';

const SNAPSHOT_URL = 'https://child-snapshot.vercel.app/';

export default function GameHubPage() {
  const [currentGame, setCurrentGame] = useState<GameManifest | null>(null);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [launchContext, setLaunchContext] = useState<LaunchContext | null>(null);

  const { games, setGames, isLoadingGames, setLoadingGames, gamesError, setGamesError }
    = useGameHubStore();

  const { session, updateSessionStats } = useHubSession();

  // Load games on mount
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoadingGames(true);
        setGamesError(null);

        const response = await fetch('/api/game-hub/games?platform=web');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }

        const gamesData: GameManifest[] = await response.json();
        setGames(gamesData);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load games';
        setGamesError(message);
      } finally {
        setLoadingGames(false);
      }
    };

    void loadGames();
  }, []);

  // Launch game
  const handleLaunch = async (game: GameManifest) => {
    try {
      // Start session
      const response = await fetch('/api/game-hub/sessions/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: game.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const session: GameSession = await response.json();

      // Create launch context
      const context: LaunchContext = {
        sdkVersion: SDK_VERSION,
        playerId: session.playerId || 'player-123',
        sessionId: session.sessionId,
        gameId: game.id,
        locale: 'vi-VN', // TODO: Get from i18n
        difficulty: (game.metadata?.difficulty as any) || 'normal',
        seed: Math.floor(Math.random() * 1000000),
        launchToken: session.launchToken,
        sizeHint: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
        },
      };

      setCurrentGame(game);
      setCurrentSession(session);
      setLaunchContext(context);
    } catch (error) {
      console.error('Failed to launch game:', error);
      console.warn('Không thể khởi chạy game. Vui lòng thử lại.');
    }
  };

  // Handle back from game
  const handleBack = async () => {
    if (currentSession && currentGame) {
      // Finish session
      try {
        await fetch(`/api/game-hub/sessions/${currentSession.sessionId}/finish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: 0, // TODO: Get actual score
            timeMs: 0, // TODO: Track time
          }),
        });
      } catch (error) {
        console.error('Failed to finish session:', error);
      }
    }

    setCurrentGame(null);
    setCurrentSession(null);
    setLaunchContext(null);
  };

  // Handle game complete
  const handleComplete = async (data: { score: number; timeMs: number }) => {
    if (currentSession && currentGame) {
      try {
        await fetch(`/api/game-hub/sessions/${currentSession.sessionId}/finish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        // Update hub session stats
        updateSessionStats({
          gameId: currentGame.id,
          score: data.score,
          timeMs: data.timeMs,
        });
      } catch (error) {
        console.error('Failed to finish session:', error);
      }
    }

    // Show completion dialog or navigate back
    setTimeout(() => {
      handleBack();
    }, 2000);
  };

  // If game is launched, show launcher
  if (currentGame && currentSession && launchContext) {
    return (
      <GameLauncher
        game={currentGame}
        session={currentSession}
        context={launchContext}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    );
  }

  // Show game list
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-7 w-7 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-800">Game Hub</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a href={SNAPSHOT_URL} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
              <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                <ExternalLink className="h-4 w-4" />
                Xem Snapshot
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Compact Stats */}
        <GameStats
          stats={
            session
              ? {
                totalGamesPlayed: session.stats.totalGamesPlayed,
                totalScore: session.stats.totalScore,
                totalTimeSpent: session.stats.totalTimeSpent,
                sessionExpiry: session.expiryTime,
              }
              : null
          }
          className="mb-6"
        />

        {/* Loading state */}
        {isLoadingGames && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải games...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {gamesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">
              <strong>Lỗi:</strong>
              {' '}
              {gamesError}
            </p>
          </div>
        )}

        {/* Games list */}
        {!isLoadingGames && !gamesError && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Games khả dụng</h2>
              <p className="text-gray-600 text-sm mt-1">Chọn một game để bắt đầu</p>
            </div>
            <GameList games={games} onLaunch={handleLaunch} />
          </>
        )}
      </main>
    </div>
  );
}
