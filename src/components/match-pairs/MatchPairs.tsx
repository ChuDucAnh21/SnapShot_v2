// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { CardVM, MatchPairsProps, MatchPairsState } from './types';
import * as React from 'react';
import { BlackboardFrame } from './BlackboardFrame';
import { Card } from './Card';
import { ClassroomBackground } from './ClassroomBackground';
import { HUD } from './HUD';

export function MatchPairs({ item, onComplete, onTelemetry }: MatchPairsProps) {
  const [cards, setCards] = React.useState<CardVM[]>(() => buildCardsFromItem(item));
  const [first, setFirst] = React.useState<number | null>(null);
  const [second, setSecond] = React.useState<number | null>(null);
  const [matchedCount, setMatchedCount] = React.useState(0);
  const [attempts, setAttempts] = React.useState(0);
  const [state, setState] = React.useState<MatchPairsState>('INIT');
  const t0 = React.useRef(performance.now());

  // Initialize game
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setState('READY');
    onTelemetry?.({
      type: 'question_view',
      lessonId: '-',
      itemId: item.id,
      ts: new Date().toISOString(),
    });
  }, [item.id, onTelemetry]);

  // Helper functions
  const flipUp = React.useCallback((idx: number) => {
    setCards(prev => prev.map((card, i) => (i === idx ? { ...card, state: 'faceUp' as const } : card)));
  }, []);

  const flipDown = React.useCallback((indices: number[]) => {
    setCards(prev => prev.map((card, i) => (indices.includes(i) ? { ...card, state: 'faceDown' as const } : card)));
  }, []);

  const markMatched = React.useCallback((indices: number[]) => {
    setCards(prev => prev.map((card, i) => (indices.includes(i) ? { ...card, state: 'matched' as const } : card)));
  }, []);

  // Card tap handler
  const onTap = React.useCallback(
    (idx: number) => {
      const c = cards[idx];
      if (!c || c.state !== 'faceDown' || second !== null) {
        return;
      } // lock if resolving

      flipUp(idx);

      if (first === null) {
        setFirst(idx);
        setState('FIRST_FLIP');
        return;
      }

      setSecond(idx);
      setState('SECOND_FLIP');

      // Start checking
      const prevIndex = first;
      if (prevIndex === null) {
        return;
      }
      const a = cards[prevIndex];
      if (!a) {
        return;
      }
      const b = c;
      onTelemetry?.({
        type: 'answer_submit',
        lessonId: '-',
        itemId: item.id,
        attempt: attempts + 1,
        payload: { aIndex: first, bIndex: idx, aValue: a.value, bValue: b.value },
        ts: new Date().toISOString(),
      });

      const isCorrect = a.value === b.value;
      setAttempts(x => x + 1);
      setState('CHECKING');

      setTimeout(() => {
        if (isCorrect) {
          markMatched([first, idx]);
          setMatchedCount(m => m + 2);
          setState('RESOLVE_MATCH');
        } else {
          flipDown([first, idx]);
          setState('RESOLVE_MISMATCH');
        }

        onTelemetry?.({
          type: 'answer_result',
          lessonId: '-',
          itemId: item.id,
          isCorrect,
          latencyMs: Math.round(performance.now() - t0.current),
          ts: new Date().toISOString(),
        });

        setFirst(null);
        setSecond(null);
        setState('READY');
      }, 650);
    },
    [cards, first, second, attempts, flipUp, flipDown, markMatched, item.id, onTelemetry],
  );

  // Check completion
  React.useEffect(() => {
    if (matchedCount === cards.length) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setState('COMPLETE');
      onComplete?.({
        attempts,
        timeMs: Math.round(performance.now() - t0.current),
        mistakes: attempts - cards.length / 2,
      });
    }
  }, [matchedCount, cards.length, attempts, onComplete]);

  return (
    <div className="relative mx-auto aspect-video max-w-[1366px] min-w-[320px] overflow-hidden bg-[#FDE1EC]">
      <ClassroomBackground />

      <BlackboardFrame>
        <div className="grid grid-cols-4 grid-rows-2 gap-7 p-8">
          {cards.map((c, i) => (
            <Card key={c.id} vm={c} onTap={() => onTap(i)} disabled={state === 'CHECKING'} />
          ))}
        </div>
      </BlackboardFrame>

      <HUD />
    </div>
  );
}

// Helper function to build cards from item
function buildCardsFromItem(item: MatchPairsProps['item']): CardVM[] {
  const { pairs, colors, grid } = item.meta;
  const totalCards = grid.rows * grid.cols;

  return pairs.slice(0, totalCards).map((value, index) => ({
    id: `card-${index}`,
    value,
    color: colors[value] || 'green',
    state: 'faceDown' as const,
    index,
  }));
}
