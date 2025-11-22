// Rules applied: style/brace-style:1tbs
'use client';

import type { GeneratePathReq } from './types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as PathsApi from './api';

export function usePath(learnerId: string, subjectId: string, enabled = true) {
  return useQuery({
    queryKey: QK.path(learnerId, subjectId),
    queryFn: () => PathsApi.getPath(learnerId, subjectId),
    enabled,
  });
}

export function useGeneratePath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GeneratePathReq) => PathsApi.generatePath(body),
    onSuccess: (res, variables) => {
      const { learner_id } = res.path;
      const subjectKey
        = res.path.subject ?? (res.path as any).subject_id ?? variables.subject_id;
      if (subjectKey) {
        qc.setQueryData(QK.path(learner_id, subjectKey), res);
      }
    },
  });
}
