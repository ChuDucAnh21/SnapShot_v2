/**
 * GameStage - Vùng mount và hiển thị game
 */

'use client';

import type { GameEvent } from '@/lib/game-hub';
import type { GameManifest, LaunchContext } from '@/lib/game-hub/protocol';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { GameBridge } from '@/lib/game-hub';
import { useGameHubStore } from '@/stores/game-hub-store';
import { cn } from '@/utils/cn';

type GameStageProps = {
  manifest: GameManifest;
  context: LaunchContext;
  onEvent?: (event: GameEvent) => void;
  className?: string;
};

export function GameStage({ manifest, context, onEvent, className }: GameStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<GameBridge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { setGameReady, setScore, updateScore, setProgress, setGameError } = useGameHubStore();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let mounted = true;
    const container = containerRef.current;

    // Initialize bridge
    const initBridge = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setGameReady(false);

        const bridge = new GameBridge({
          manifest,
          context,
          onEvent: (event) => {
            if (!mounted) {
              return;
            }

            // Handle events
            switch (event.type) {
              case 'READY':
                setGameReady(true);
                setIsLoading(false);
                bridge.start();
                break;

              case 'LOADING':
                if (event.payload?.progress) {
                  setLoadingProgress(event.payload.progress);
                }
                break;

              case 'SCORE_UPDATE':
                if (event.payload?.score !== undefined) {
                  setScore(event.payload.score);
                }
                if (event.payload?.delta !== undefined) {
                  updateScore(event.payload.delta);
                }
                break;

              case 'PROGRESS':
                setProgress(event.payload);
                break;

              case 'COMPLETE':
                setIsLoading(false);
                break;

              case 'ERROR':{
                const errorMsg = event.payload?.message || 'Unknown error';
                setError(errorMsg);
                setGameError(errorMsg);
                setIsLoading(false);
                break; }
            }

            // Call custom handler
            if (onEvent) {
              onEvent(event);
            }
          },
        });

        await bridge.mount(container);
        bridgeRef.current = bridge;
      } catch (err) {
        if (!mounted) {
          return;
        }
        const errorMsg = err instanceof Error ? err.message : 'Failed to load game';
        setError(errorMsg);
        setGameError(errorMsg);
        setIsLoading(false);
      }
    };

    void initBridge();

    // Cleanup
    return () => {
      mounted = false;
      if (bridgeRef.current) {
        bridgeRef.current.dispose();
        bridgeRef.current = null;
      }
    };
  }, [manifest.id, context.sessionId]);

  // Handle visibility change (auto pause/resume)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!bridgeRef.current) {
        return;
      }

      if (document.hidden) {
        bridgeRef.current.pause();
      } else {
        bridgeRef.current.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div
      className={cn(
        'relative w-full h-full bg-gray-900 rounded-xl overflow-hidden',
        'max-w-full max-h-full',
        className,
      )}
      style={{
        contain: 'layout style paint',
      }}
    >
      {/* Loading overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-white text-lg font-medium mb-2">Đang tải game...</p>
          {loadingProgress > 0 && (
            <div className="w-64">
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm text-center mt-2">
                {loadingProgress}
                %
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error overlay */}
      {/* {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-white text-lg font-medium mb-2">Lỗi tải game</p>
          <p className="text-gray-400 text-sm text-center max-w-md px-4">{error}</p>
        </div>
      )} */}

      {/* Game container - Constrained to prevent overflow */}
      <div
        ref={containerRef}
        className="w-full h-full max-w-full max-h-full"
        style={{
          overflow: 'hidden',
          position: 'relative',
        }}
      />
    </div>
  );
}
