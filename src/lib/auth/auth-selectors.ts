// Rules applied: style/brace-style:1tbs

import { useAuthStore } from './auth-store';

export const useAccessToken = () => useAuthStore(s => s.accessToken);
export const useAuthedUser = () => useAuthStore(s => s.user);
