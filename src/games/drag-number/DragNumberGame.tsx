// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

'use client';

import type { GameProps } from '../types';
import * as React from 'react';
import { Button } from '@/components/ui/button';

type DragNumberConfig = {
  range: [number, number];
  count: number;
  mode: 'asc' | 'desc';
};

export default function DragNumberGame({ config, seed, onEvent, onComplete }: GameProps) {
  const typedConfig = config as DragNumberConfig;
  const [numbers, setNumbers] = React.useState<number[]>([]);
  const [answer, setAnswer] = React.useState<number[]>([]);
  const [started, setStarted] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const t0 = React.useRef<number>(0);

  const mode = typedConfig.mode ?? 'asc';
  const count = typedConfig.count ?? 6;

  React.useEffect(() => {
    const [min, max] = typedConfig.range ?? [1, 20];
    const rng = seed ? () => ((Number(seed) * 9301 + 49297) % 233280) / 233280 : Math.random;

    const nums: number[] = [];
    const available = new Set<number>();
    for (let i = min; i <= max; i++) {
      available.add(i);
    }

    for (let i = 0; i < count; i++) {
      const arr = Array.from(available);
      const idx = Math.floor(rng() * arr.length);
      const num = arr[idx];
      if (num !== undefined) {
        nums.push(num);
        available.delete(num);
      }
    }

    setNumbers(nums);
    setAnswer([]);
  }, [typedConfig.range, count, seed]);

  const handleStart = React.useCallback(() => {
    setStarted(true);
    t0.current = Date.now();
    onEvent({ type: 'start', payload: {}, ts: Date.now() });
  }, [onEvent]);

  const handleAdd = React.useCallback(
    (num: number) => {
      setAnswer(prev => [...prev, num]);
      setNumbers(prev => prev.filter(n => n !== num));
      onEvent({ type: 'answer', payload: { added: num }, ts: Date.now() });
    },
    [onEvent],
  );

  const handleRemove = React.useCallback(
    (num: number) => {
      setAnswer(prev => prev.filter(n => n !== num));
      setNumbers(prev => [...prev, num]);
      onEvent({ type: 'answer', payload: { removed: num }, ts: Date.now() });
    },
    [onEvent],
  );

  const handleSubmit = React.useCallback(() => {
    const expected = [...answer].sort((a, b) => (mode === 'asc' ? a - b : b - a));
    const isCorrect = answer.every((n, i) => n === expected[i]);
    const durationMs = Date.now() - t0.current;

    setSubmitted(true);
    onEvent({ type: 'end', payload: { answer, expected, isCorrect }, ts: Date.now() });
    onComplete({
      score: isCorrect ? 1 : 0,
      correct: isCorrect ? 1 : 0,
      incorrect: isCorrect ? 0 : 1,
      durationMs,
      meta: { answer, expected, mode },
    });
  }, [answer, mode, onEvent, onComplete]);

  if (!started) {
    return (
      <div className="container mx-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">Drag & Drop Numbers</h2>
          <p className="mb-6 text-white/80">
            Arrange the numbers in
            {' '}
            {mode === 'asc' ? 'ascending' : 'descending'}
            {' '}
            order!
          </p>
          <Button onClick={handleStart} className="bg-[#6ac21a] text-white hover:bg-[#5aa017]">
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
        <h2 className="mb-4 text-xl font-bold">
          Order:
          {mode === 'asc' ? 'Ascending' : 'Descending'}
        </h2>

        <div className="mb-6 space-y-4">
          <div>
            <p className="mb-2 text-sm text-white/70">Available Numbers:</p>
            <div className="flex flex-wrap gap-2">
              {numbers.map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleAdd(num)}
                  className="rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-white/70">Your Order:</p>
            <div className="min-h-[60px] rounded-lg border-2 border-dashed border-white/30 p-3">
              <div className="flex flex-wrap gap-2">
                {answer.map((num, idx) => (
                  <button
                    key={`${num}-${idx}`}
                    type="button"
                    onClick={() => handleRemove(num)}
                    className="rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={answer.length !== count || submitted}
          className="w-full bg-[#6ac21a] text-white hover:bg-[#5aa017]"
        >
          {submitted ? 'Submitted!' : 'Submit Answer'}
        </Button>
      </div>
    </div>
  );
}
