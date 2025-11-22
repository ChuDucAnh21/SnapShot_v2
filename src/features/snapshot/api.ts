import type { SnapshotGeneratePayload, SnapshotGenerateResponse } from './type';
import { apiWithoutPrefix } from '@/lib/http/axios-client';

export async function generateSnapshot(
  payload: SnapshotGeneratePayload,
  signal?: AbortSignal,
): Promise<SnapshotGenerateResponse> {
  const r = await apiWithoutPrefix.post<SnapshotGenerateResponse>(
    '/api/snapshot/generate',
    payload,
    { signal },
  );
  return r.data;
}

export const SnapshotService = {
  generateSnapshot,
};
