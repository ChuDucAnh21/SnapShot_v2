// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type { GameAdapters } from '../types';
import type { SessionItem } from '@/stores/session-store';

export const roadCycleAdapter: GameAdapters = {
  fromSessionItem: (item: SessionItem) => {
    const payload = (item.payload ?? {}) as Record<string, unknown>;

    return {
      config: {
        speed: payload.speed ?? 1,
        traffic: payload.traffic ?? 'medium',
        laps: payload.laps ?? 3,
      },
      seed: payload.seed as string | number | undefined,
    };
  },

  toSessionResult: (gr) => {
    return {
      itemId: '',
      score: gr.score,
      details: {
        laps: gr.meta.laps,
        hits: gr.meta.hits,
        durationMs: gr.durationMs,
      },
    };
  },
};
