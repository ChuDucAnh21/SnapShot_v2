// Rules applied: style/brace-style:1tbs

import { useAuthStore } from '@/lib/auth/auth-store';
import * as AuthApi from './api';

export async function doRegister(payload: AuthApi.RegisterReq, persist: 'local' | 'session' | 'memory' = 'local') {
  const res = await AuthApi.register(payload);
  useAuthStore.getState().setAccessToken(res.access_token, persist);
  useAuthStore.getState().setUser({
    user_id: res.user.user_id,
    email: res.user.email,
    full_name: res.user.full_name,
    learner_id: res.learner.learner_id,
  });
  return res;
}

export async function doLogin(payload: AuthApi.LoginReq, persist: 'local' | 'session' | 'memory' = 'local') {
  const res = await AuthApi.login(payload);
  useAuthStore.getState().setAccessToken(res.access_token, persist);
  useAuthStore.getState().setUser({
    user_id: res.user.user_id,
    learner_id: res.user.learner_id ?? undefined,
  });
  return res;
}

