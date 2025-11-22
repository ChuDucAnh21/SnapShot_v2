// Rules applied: style/brace-style:1tbs
'use client';

import type { GenerateProfileReq } from './types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as ProfilesApi from './api';

export function useProfile(learnerId: string, enabled = true) {
  return useQuery({
    queryKey: QK.profile(learnerId),
    queryFn: () => ProfilesApi.getProfile(learnerId),
    enabled,
  });
}

export function useGenerateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GenerateProfileReq) => ProfilesApi.generateProfile(body),
    onSuccess: (res) => {
      const id = res.profile.learner_id;
      qc.setQueryData(QK.profile(id), res);
    },
  });
}
