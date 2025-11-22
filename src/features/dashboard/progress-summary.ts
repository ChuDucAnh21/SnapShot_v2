'use client';

import { useQuery } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';

export type ProgressSummaryHearts = {
  readonly current: number;
  readonly max: number;
};

export type ProgressSummary = {
  readonly learner_id: string;
  readonly total_stars: number;
  readonly total_lessons: number;
  readonly completed_lessons: number;
  readonly current_streak: number;
  readonly hearts: ProgressSummaryHearts;
  readonly last_activity_at: string;
};

export type ProgressSummaryRes = {
  status: 'success';
  summary: ProgressSummary;
};

const MOCK_SUMMARY: ProgressSummary = {
  learner_id: 'learner-001',
  total_stars: 128,
  total_lessons: 34,
  completed_lessons: 21,
  current_streak: 5,
  hearts: {
    current: 3,
    max: 5,
  },
  last_activity_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
};

const MOCK_DELAY_MS = 450;

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout>;
    const cancel = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    timer = setTimeout(() => {
      if (signal) {
        signal.removeEventListener('abort', cancel);
      }
      resolve();
    }, ms);

    if (signal?.aborted) {
      cancel();
      return;
    }
    signal?.addEventListener('abort', cancel, { once: true });
  });
}

/**
 * Temporary mock implementation for the learner progress summary.
 * Replace the body of this function with a real API call when the endpoint is available.
 */
export async function getProgressSummary(learnerId: string, signal?: AbortSignal): Promise<ProgressSummaryRes> {
  await delay(MOCK_DELAY_MS, signal);

  return {
    status: 'success',
    summary: {
      ...MOCK_SUMMARY,
      learner_id: learnerId,
      last_activity_at: new Date().toISOString(),
    },
  };
}

export function useProgressSummary(learnerId: string, enabled = true) {
  return useQuery({
    queryKey: QK.progressSummary(learnerId),
    queryFn: () => getProgressSummary(learnerId),
    enabled: Boolean(learnerId) && enabled,
    staleTime: 60_000,
  });
}
