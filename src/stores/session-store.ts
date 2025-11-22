// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import { create } from 'zustand';

export type SessionType = 'quiz' | 'practice' | 'video' | 'reading' | 'game';
export type SessionItemType = 'mcq' | 'fill' | 'dragdrop' | 'step' | 'content' | 'game';

export type SessionItem = {
  id: string;
  type: SessionItemType;
  payload: unknown;
  difficulty?: 'easy' | 'medium' | 'hard' | number;
  timeLimitSec?: number | null;
};

export type Session = {
  session_id: string;
  subject_id: string;
  type: SessionType;
  title: string;
  description: string;
  items: SessionItem[];
  meta?: Record<string, unknown>;
};

type SessionState = {
  currentSession: Session | null;
  currentIndex: number;
  results: Array<Record<string, unknown>>;
  loading: boolean;
  error: string | null;
};

type SessionActions = {
  setSession: (session: Session) => void;
  nextItem: () => void;
  pushResult: (result: Record<string, unknown>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>(set => ({
  currentSession: null,
  currentIndex: 0,
  results: [],
  loading: false,
  error: null,

  setSession: session => set({ currentSession: session, currentIndex: 0, results: [], error: null }),
  nextItem: () => set(state => ({ currentIndex: state.currentIndex + 1 })),
  pushResult: result => set(state => ({ results: [...state.results, result] })),
  setLoading: loading => set({ loading }),
  setError: error => set({ error, loading: false }),
  reset: () => set({ currentSession: null, currentIndex: 0, results: [], error: null, loading: false }),
}));

// Convenience hooks
export const useSession = () => {
  const currentSession = useSessionStore(state => state.currentSession);
  const loading = useSessionStore(state => state.loading);
  const error = useSessionStore(state => state.error);
  return { currentSession, loading, error };
};

export const useSessionActions = () => {
  const setSession = useSessionStore(state => state.setSession);
  const nextItem = useSessionStore(state => state.nextItem);
  const pushResult = useSessionStore(state => state.pushResult);
  const setLoading = useSessionStore(state => state.setLoading);
  const setError = useSessionStore(state => state.setError);
  const reset = useSessionStore(state => state.reset);
  return { setSession, nextItem, pushResult, setLoading, setError, reset };
};

export const useCurrentItem = (): SessionItem | null => {
  const currentSession = useSessionStore(state => state.currentSession);
  const currentIndex = useSessionStore(state => state.currentIndex);

  if (!currentSession || !currentSession.items[currentIndex]) {
    return null;
  }

  return currentSession.items[currentIndex];
};

export const useProgress = (): { current: number; total: number } => {
  const currentSession = useSessionStore(state => state.currentSession);
  const currentIndex = useSessionStore(state => state.currentIndex);

  return {
    current: currentIndex + 1,
    total: currentSession?.items.length ?? 0,
  };
};
