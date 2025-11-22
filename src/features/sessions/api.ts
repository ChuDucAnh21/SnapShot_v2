// Rules applied: style/brace-style:1tbs

import type {
  CompleteSessionReq,
  CompleteSessionRes,
  GenerateSessionReq,
  GenerateSessionRes,
  GetSessionRes,
  StartSessionRes,
  SubmitActivityResultReq,
  SubmitActivityResultRes,
} from './types';
import { api } from '@/lib/http/axios-client';

export async function generateSession(body: GenerateSessionReq, signal?: AbortSignal) {
  const r = await api.post<GenerateSessionRes>('/sessions/generate', body, { signal });
  return r.data;
}

export async function getSession(sessionId: string, signal?: AbortSignal) {
  const r = await api.get<GetSessionRes>(`/sessions/${sessionId}`, { signal });
  return r.data;
}

export async function startSession(sessionId: string, signal?: AbortSignal) {
  const r = await api.post<StartSessionRes>(`/sessions/${sessionId}/start`, {}, { signal });
  return r.data;
}

export async function submitActivityResult(
  sessionId: string,
  activityId: string,
  body: SubmitActivityResultReq,
  signal?: AbortSignal,
) {
  const r = await api.post<SubmitActivityResultRes>(
    `/sessions/${sessionId}/activities/${activityId}/result`,
    body,
    { signal },
  );
  return r.data;
}

export async function completeSession(sessionId: string, body: CompleteSessionReq, signal?: AbortSignal) {
  const r = await api.post<CompleteSessionRes>(`/sessions/${sessionId}/complete`, body, {
    signal,
  });
  return r.data;
}
