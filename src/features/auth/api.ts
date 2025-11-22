// Rules applied: style/brace-style:1tbs

import type { LoginReq, LoginRes, MeRes, RegisterReq, RegisterRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function register(body: RegisterReq, signal?: AbortSignal) {
  const r = await api.post<RegisterRes>('/auth/register', body, {
    signal,
  });
  return r.data;
}

export async function login(body: LoginReq, signal?: AbortSignal) {
  const r = await api.post<LoginRes>('/auth/login', body, {
    signal,
  });
  return r.data;
}

export async function me(signal?: AbortSignal) {
  const r = await api.get<MeRes>('/auth/me', { signal });
  return r.data;
}

export type { LoginReq, LoginRes, MeRes, RegisterReq, RegisterRes };
