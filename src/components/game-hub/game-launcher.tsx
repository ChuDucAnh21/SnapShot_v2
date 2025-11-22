/**
 * GameLauncher - Component để khởi chạy game session
 */

'use client';

import type { GameEvent, GameManifest, GameSession, LaunchContext } from '@/lib/game-hub/protocol';
import { ArrowLeft, Pause, Play, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGameHubStore } from '@/stores/game-hub-store';
import { cn } from '@/utils/cn';
import { GameStage } from './game-stage';

type GameLauncherProps = {
  game: GameManifest;
  session: GameSession;
  context: LaunchContext;
  onBack: () => void;
  onComplete?: (data: { score: number; timeMs: number }) => void;
  className?: string;
};

export function GameLauncher({
  game,
  session: _session,
  context,
  onBack,
  onComplete,
  className,
}: GameLauncherProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const { score, isGameReady, gameError } = useGameHubStore();

  useEffect(() => {
    console.warn('gameError', gameError);
  }, [gameError]);

  const handleEvent = (event: GameEvent) => {
    if (event.type === 'COMPLETE' && onComplete) {
      onComplete(event.payload);
    }
  };

  const handleQuit = () => {
    setShowQuitConfirm(true);
  };

  const confirmQuit = () => {
    onBack();
  };

  return (
    <div className={cn('flex flex-col h-screen bg-gray-900 overflow-hidden', className)}>
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex-shrink-0">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left - Back button */}
          <button
            onClick={handleQuit}
            className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          {/* Center - Game title */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">{game.title}</h1>
            {isGameReady && (
              <p className="text-sm text-gray-400">
                Điểm:
                {' '}
                <span className="font-semibold text-white">{score}</span>
              </p>
            )}
          </div>

          {/* Right - Controls */}
          <div className="flex items-center space-x-2">
            {isGameReady && (
              <>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </button>

                <button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Restart"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </>
            )}

            <button
              onClick={handleQuit}
              className="p-2 hover:bg-red-600 rounded-lg transition-colors"
              title="Quit"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Game Stage - Constrained to prevent overflow */}
      <main className="flex-1 overflow-hidden p-4">
        <div className="w-full h-full max-w-full max-h-full flex items-center justify-center bg-gray-900">
          <GameStage
            manifest={game}
            context={context}
            onEvent={handleEvent}
            className="w-full h-full max-w-full max-h-full"
          />
        </div>
      </main>

      {/* Quit Confirmation Dialog */}
      {showQuitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Thoát game?</h2>
            <p className="text-gray-600 mb-6">
              Tiến độ của bạn đã được lưu. Bạn có chắc muốn thoát không?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmQuit}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error notification */}
      {/* {gameError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-md">
          <p className="font-medium">Lỗi game</p>
          <p className="text-sm">{gameError}</p>
        </div>
      )} */}
    </div>
  );
}
