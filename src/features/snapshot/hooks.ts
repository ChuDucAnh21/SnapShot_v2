'use client';

import type { SnapshotGeneratePayload, SnapshotGenerateResponse } from './type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as SnapshotApi from './api';

export function useGenerateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation<SnapshotGenerateResponse, unknown, SnapshotGeneratePayload>({
    mutationFn: payload => SnapshotApi.generateSnapshot(payload),
    onSuccess: (data) => {
      // optionally cache or invalidate dependent queries
      queryClient.invalidateQueries({ queryKey: QK.snapshots(data.subject_id) });
    },
  });
}
