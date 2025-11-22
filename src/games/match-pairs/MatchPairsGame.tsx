// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

'use client';

import type { GameProps } from '../types';
import * as React from 'react';
import { MatchPairs } from '@/components/match-pairs/MatchPairs';

type MatchPairsConfig = {
  rows: number;
  cols: number;
  pairs: string[];
  colors: Record<string, string>;
  shuffleSeed: string;
};

export default function MatchPairsGame({ config, seed, onEvent, onComplete }: GameProps) {
  const typedConfig = config as MatchPairsConfig;

  const item = React.useMemo(
    () => ({
      id: `match-pairs-${seed ?? Date.now()}`,
      type: 'match_pairs' as const,
      prompt: 'Match the pairs!',
      ui: { input: 'tap', autoSubmit: true },
      difficulty: 1,
      skillId: 'match',
      answerKey: [] as string[][],
      meta: {
        grid: { rows: typedConfig.rows ?? 2, cols: typedConfig.cols ?? 4 },
        pairs: typedConfig.pairs ?? ['1', '1', '2', '2', '3', '3', '4', '4'],
        colors: typedConfig.colors ?? {},
        shuffleSeed: seed?.toString() ?? Date.now().toString(),
      },
    }),
    [typedConfig, seed],
  );

  const handleComplete = React.useCallback(
    (summary: { attempts: number; timeMs: number; mistakes: number }) => {
      const totalPairs = item.meta.pairs.length / 2;
      const score = Math.max(0, 1 - summary.mistakes / totalPairs);

      onEvent({ type: 'end', payload: summary, ts: Date.now() });
      onComplete({
        score,
        correct: totalPairs,
        incorrect: summary.mistakes,
        durationMs: summary.timeMs,
        meta: { attempts: summary.attempts },
      });
    },
    [item.meta.pairs.length, onEvent, onComplete],
  );

  const handleTelemetry = React.useCallback(
    (e: any) => {
      onEvent({
        type: e.type === 'answer_submit' ? 'answer' : 'progress',
        payload: e,
        ts: Date.now(),
      });
    },
    [onEvent],
  );

  React.useEffect(() => {
    onEvent({ type: 'start', payload: {}, ts: Date.now() });
  }, [onEvent]);

  return <MatchPairs item={item} onComplete={handleComplete} onTelemetry={handleTelemetry} />;
}
