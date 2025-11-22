// Rules applied: style/brace-style:1tbs
'use client';

import type { LoginReq, RegisterReq } from './types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as AuthApi from './api';

export function useMe(enabled = true) {
  return useQuery({
    queryKey: QK.me,
    queryFn: () => AuthApi.me(),
    enabled,
    staleTime: 60_000,
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterReq) => AuthApi.register(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginReq) => AuthApi.login(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}
