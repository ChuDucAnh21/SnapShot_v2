// Rules applied: style/brace-style:1tbs
'use client';

import type { CompleteSessionReq, GenerateSessionReq, SubmitActivityResultReq } from './types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as SessionsApi from './api';

export function useSession(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: QK.session(sessionId),
    queryFn: () => SessionsApi.getSession(sessionId),
    enabled,
  });
}

export function useGenerateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GenerateSessionReq) => SessionsApi.generateSession(body),
    onSuccess: (res) => {
      qc.setQueryData(QK.session(res.session.session_id), res);
    },
  });
}

export function useStartSession() {
  return useMutation({
    mutationFn: (sessionId: string) => SessionsApi.startSession(sessionId),
  });
}

export function useSubmitActivityResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { sessionId: string; activityId: string; body: SubmitActivityResultReq }) =>
      SessionsApi.submitActivityResult(p.sessionId, p.activityId, p.body),
    onSuccess: (_res, vars) => {
      // Optionally refetch session to update progress
      qc.invalidateQueries({ queryKey: QK.session(vars.sessionId) });
    },
  });
}

export function useCompleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { sessionId: string; body: CompleteSessionReq }) =>
      SessionsApi.completeSession(p.sessionId, p.body),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: QK.session(vars.sessionId) });
    },
  });
}
