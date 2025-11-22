/**
 * useHubSession Hook
 * Quản lý phiên chơi Game Hub 24h với localStorage persistence
 */

'use client';

import { useEffect, useState } from 'react';
import { useGameHubStore } from '@/stores/game-hub-store';

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SESSION_KEY = 'iruka_hub_session';

export type HubSession = {
  sessionId: string;
  startTime: number; // timestamp
  expiryTime: number; // startTime + 24h
  stats: {
    totalGamesPlayed: number;
    totalScore: number;
    totalTimeSpent: number; // in seconds
    gamesHistory: Array<{
      gameId: string;
      score: number;
      timeMs: number;
      timestamp: number;
    }>;
  };
};

export function useHubSession() {
  const [session, setSession] = useState<HubSession | null>(null);
  const { setHubSession } = useGameHubStore();

  // Initialize or restore session
  useEffect(() => {
    const initSession = () => {
      const stored = localStorage.getItem(SESSION_KEY);

      if (stored) {
        try {
          const parsed: HubSession = JSON.parse(stored);

          // Check if expired
          if (Date.now() < parsed.expiryTime) {
            setSession(parsed);
            setHubSession(parsed);
            return;
          }
        } catch (e) {
          console.error('Failed to parse session:', e);
        }
      }

      // Create new session
      const newSession: HubSession = {
        sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        startTime: Date.now(),
        expiryTime: Date.now() + SESSION_DURATION,
        stats: {
          totalGamesPlayed: 0,
          totalScore: 0,
          totalTimeSpent: 0,
          gamesHistory: [],
        },
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      setHubSession(newSession);
    };

    initSession();
  }, [setHubSession]);

  // Update session stats
  const updateSessionStats = (gameResult: {
    gameId: string;
    score: number;
    timeMs: number;
  }) => {
    if (!session) {
      return;
    }

    const updatedSession: HubSession = {
      ...session,
      stats: {
        totalGamesPlayed: session.stats.totalGamesPlayed + 1,
        totalScore: session.stats.totalScore + gameResult.score,
        totalTimeSpent: session.stats.totalTimeSpent + Math.floor(gameResult.timeMs / 1000),
        gamesHistory: [
          ...session.stats.gamesHistory,
          {
            ...gameResult,
            timestamp: Date.now(),
          },
        ],
      },
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
    setSession(updatedSession);
    setHubSession(updatedSession);
  };

  // Reset session manually
  const resetSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setHubSession(null);
    window.location.reload();
  };

  // Get time remaining in milliseconds
  const getTimeRemaining = () => {
    if (!session) {
      return 0;
    }
    return Math.max(0, session.expiryTime - Date.now());
  };

  return {
    session,
    updateSessionStats,
    resetSession,
    getTimeRemaining,
  };
}
