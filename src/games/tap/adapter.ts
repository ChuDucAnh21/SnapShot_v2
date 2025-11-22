// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type { GameAdapters } from '../types';
import type { SessionItem } from '@/stores/session-store';

export const tapAdapter: Partial<GameAdapters> = {
  fromSessionItem: (item: SessionItem) => {
    const payload = (item.payload ?? {}) as Record<string, unknown>;

    return {
      config: {
        game_type: payload.game_type || 'tap',
        instructions: payload.instructions || 'Chọn đáp án đúng',
        problems: payload.problems || [],
      },
      seed: payload.seed as string | number | undefined,
    };
  },

  toSessionResult: (gameResult) => {
    return {
      itemId: 'tap-game',
      score: gameResult.score,
      details: {
        correct: gameResult.correct,
        incorrect: gameResult.incorrect,
        durationMs: gameResult.durationMs,
        totalProblems: gameResult.meta.totalProblems,
        answers: gameResult.meta.answers,
      },
    };
  },
};
