// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import { create } from 'zustand';

type SessionFlowState = {
  currentIndex: number;
  started: boolean;
  activityStartTimes: Record<string, number>; // activityId -> timestamp
};

type SessionFlowActions = {
  setStarted: (started: boolean) => void;
  next: (total: number) => void;
  reset: () => void;
  markActivityStart: (activityId: string) => void;
  getActivityTimeSpent: (activityId: string) => number;
};

type SessionFlowStore = SessionFlowState & SessionFlowActions;

export const useSessionFlowStore = create<SessionFlowStore>((set, get) => ({
  currentIndex: 0,
  started: false,
  activityStartTimes: {},

  setStarted: started => set({ started }),

  next: total =>
    set(state => ({
      currentIndex: Math.min(state.currentIndex + 1, total - 1),
    })),

  reset: () =>
    set({
      currentIndex: 0,
      started: false,
      activityStartTimes: {},
    }),

  markActivityStart: activityId =>
    set(state => ({
      activityStartTimes: {
        ...state.activityStartTimes,
        [activityId]: Date.now(),
      },
    })),

  getActivityTimeSpent: (activityId: string) => {
    const times = get().activityStartTimes;
    const startTime = times[activityId];
    if (!startTime) {
      return 0;
    }
    return Math.floor((Date.now() - startTime) / 1000); // seconds
  },
}));

// Convenience selectors
export const useCurrentIndex = () => useSessionFlowStore(state => state.currentIndex);
export const useIsStarted = () => useSessionFlowStore(state => state.started);
