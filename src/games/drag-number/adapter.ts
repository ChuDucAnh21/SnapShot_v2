// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type { GameAdapters } from '../types';
import type { SessionItem } from '@/stores/session-store';

export const dragNumberAdapter: GameAdapters = {
  fromSessionItem: (item: SessionItem) => {
    const payload = (item.payload ?? {}) as Record<string, unknown>;

    return {
      config: {
        range: (payload.range as [number, number]) ?? [1, 20],
        count: payload.count ?? 6,
        mode: payload.mode ?? 'asc',
      },
      seed: payload.seed as string | number | undefined,
    };
  },

  toSessionResult: (gr) => {
    return {
      itemId: '',
      score: gr.score,
      details: {
        correct: gr.correct,
        incorrect: gr.incorrect,
        durationMs: gr.durationMs,
        answer: gr.meta.answer,
        expected: gr.meta.expected,
        mode: gr.meta.mode,
      },
    };
  },
};
