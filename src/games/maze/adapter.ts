// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type { GameAdapters } from '../types';
import type { SessionItem } from '@/stores/session-store';

export const mazeAdapter: GameAdapters = {
  fromSessionItem: (item: SessionItem) => {
    const payload = (item.payload ?? {}) as Record<string, unknown>;

    return {
      config: {
        rows: payload.rows ?? 10,
        cols: payload.cols ?? 10,
        obstacles: payload.obstacles ?? 0.1,
      },
      seed: payload.seed as string | number | undefined,
    };
  },

  toSessionResult: (gr) => {
    return {
      itemId: '',
      score: gr.score,
      details: {
        steps: gr.meta.steps,
        collisions: gr.meta.collisions,
        durationMs: gr.durationMs,
      },
    };
  },
};
