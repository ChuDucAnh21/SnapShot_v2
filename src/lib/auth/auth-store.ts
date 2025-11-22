// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { tokenStorage } from '@/lib/http/storage';

type User = { 
  user_id: string; 
  email?: string; 
  full_name?: string;
  learner_id?: string 
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (t: string | null, persist?: 'local' | 'session' | 'memory') => void;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(set => ({
    accessToken: null,
    user: null,
    setAccessToken: (t, persist = 'local') => {
      tokenStorage.set(t, persist);
      set({ accessToken: t || null });
    },
    setUser: u => set({ user: u }),
    logout: () => {
      tokenStorage.clear();
      set({ accessToken: null, user: null });
    },
  })),
);
