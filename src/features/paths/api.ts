// Rules applied: style/brace-style:1tbs

import type { GeneratePathReq, GeneratePathRes, GetPathRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function generatePath(body: GeneratePathReq, signal?: AbortSignal) {
  const r = await api.post<GeneratePathRes>('/paths/generate', body, { signal });
  return r.data;
}

export async function getPath(learnerId: string, subjectId: string, signal?: AbortSignal) {
  const r = await api.get<GetPathRes>(`/paths/${learnerId}/${subjectId}`, { signal });
  return r.data;
}
