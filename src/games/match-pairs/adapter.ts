// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type { GameAdapters } from '../types';
import type { SessionItem } from '@/stores/session-store';

export const matchPairsAdapter: GameAdapters = {
  fromSessionItem: (item: SessionItem) => {
    const payload = (item.payload ?? {}) as Record<string, unknown>;

    return {
      config: {
        rows: payload.rows ?? 2,
        cols: payload.cols ?? 4,
        pairs: payload.pairs ?? ['1', '1', '2', '2', '3', '3', '4', '4'],
        colors: payload.colors ?? {},
        shuffleSeed: payload.shuffleSeed ?? payload.seed ?? Date.now().toString(),
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
        attempts: gr.meta.attempts,
      },
    };
  },
};
