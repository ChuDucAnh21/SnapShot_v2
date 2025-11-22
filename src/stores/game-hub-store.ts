/**
 * Zustand store for Game Hub session management
 */

import type { HubSession } from '@/hooks/useHubSession';
import type { GameManifest, GameSession, LaunchContext } from '@/lib/game-hub/protocol';
import { create } from 'zustand';

export type GameHubState = {
  // Games
  games: GameManifest[];
  currentGame: GameManifest | null;
  isLoadingGames: boolean;
  gamesError: string | null;

  // Session
  currentSession: GameSession | null;
  launchContext: LaunchContext | null;
  isStartingSession: boolean;
  sessionError: string | null;

  // Game state
  score: number;
  progress: any;
  isGameReady: boolean;
  isGamePaused: boolean;
  gameError: string | null;

  // Hub Session
  hubSession: HubSession | null;

  // Actions - Games
  setGames: (games: GameManifest[]) => void;
  setCurrentGame: (game: GameManifest | null) => void;
  setLoadingGames: (loading: boolean) => void;
  setGamesError: (error: string | null) => void;

  // Actions - Session
  setCurrentSession: (session: GameSession | null) => void;
  setLaunchContext: (context: LaunchContext | null) => void;
  setStartingSession: (starting: boolean) => void;
  setSessionError: (error: string | null) => void;

  // Actions - Game state
  setScore: (score: number) => void;
  updateScore: (delta: number) => void;
  setProgress: (progress: any) => void;
  setGameReady: (ready: boolean) => void;
  setGamePaused: (paused: boolean) => void;
  setGameError: (error: string | null) => void;

  // Actions - Hub Session
  setHubSession: (session: HubSession | null) => void;

  // Actions - Combined
  reset: () => void;
  resetGame: () => void;
};

const initialState = {
  games: [],
  currentGame: null,
  isLoadingGames: false,
  gamesError: null,
  currentSession: null,
  launchContext: null,
  isStartingSession: false,
  sessionError: null,
  score: 0,
  progress: null,
  isGameReady: false,
  isGamePaused: false,
  gameError: null,
  hubSession: null,
};

export const useGameHubStore = create<GameHubState>(set => ({
  ...initialState,

  // Games
  setGames: games => set({ games }),
  setCurrentGame: game => set({ currentGame: game }),
  setLoadingGames: loading => set({ isLoadingGames: loading }),
  setGamesError: error => set({ gamesError: error }),

  // Session
  setCurrentSession: session => set({ currentSession: session }),
  setLaunchContext: context => set({ launchContext: context }),
  setStartingSession: starting => set({ isStartingSession: starting }),
  setSessionError: error => set({ sessionError: error }),

  // Game state
  setScore: score => set({ score }),
  updateScore: delta => set(state => ({ score: state.score + delta })),
  setProgress: progress => set({ progress }),
  setGameReady: ready => set({ isGameReady: ready }),
  setGamePaused: paused => set({ isGamePaused: paused }),
  setGameError: error => set({ gameError: error }),

  // Hub Session
  setHubSession: session => set({ hubSession: session }),

  // Combined
  reset: () => set(initialState),
  resetGame: () =>
    set({
      currentGame: null,
      currentSession: null,
      launchContext: null,
      score: 0,
      progress: null,
      isGameReady: false,
      isGamePaused: false,
      gameError: null,
    }),
}));
