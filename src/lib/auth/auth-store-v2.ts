// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { tokenStorage } from '@/lib/http/storage';

type User = { 
  user_id: string
  full_name?: string
  sđt?: string,
  birth_date?: string,
  gender?: 'male' | 'female',
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (t: string | null, persist?: 'local' | 'session' | 'memory') => void;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const useAuthStoreV2 = create<AuthState>()(
  devtools(
    persist(  // lưu trữ vào localStorage (cả accessToken và user)
        set => ({
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
        }),
         {
             name: "auth-storage", // ← key cho Zustand persist
         }
    ),
  )
)
