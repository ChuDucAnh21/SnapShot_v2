// Rules applied: style/brace-style:1tbs

import type { GenerateProfileReq, GenerateProfileRes, GetProfileRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function generateProfile(body: GenerateProfileReq, signal?: AbortSignal) {
  const r = await api.post<GenerateProfileRes>('/profiles/generate', body, { signal });
  return r.data;
}

export async function getProfile(learnerId: string, signal?: AbortSignal) {
  const r = await api.get<GetProfileRes>(`/profiles/${learnerId}`, { signal });
  return r.data;
}
