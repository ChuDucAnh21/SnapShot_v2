// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type { GameAdapters } from '../types';

export const dragMatchAdapter: GameAdapters = {
  fromSessionItem: (item) => {
    const payload = (item.payload ?? {}) as Record<string, unknown>;

    return {
      config: {
        goal: payload.goal ?? 'Kéo số khớp với số lượng đồ vật',
        items: payload.items ?? [],
        rules: payload.rules ?? [],
        scoring: payload.scoring ?? { per_correct: 1, target: 6, bonus_perfect: 2 },
        win_condition: payload.win_condition,
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
        matches: gr.meta.matches,
      },
    };
  },
};
