// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import type { GameProps } from '../types';
import * as React from 'react';
import { Button } from '@/components/ui/button';

type DragMatchItem = {
  id: string;
  target: string;
  sprites: string[];
};

type DragMatchConfig = {
  goal?: string;
  items: DragMatchItem[];
  rules?: string[];
  scoring?: {
    per_correct: number;
    target: number;
    bonus_perfect?: number;
  };
  win_condition?: string;
};

export default function DragMatchGame({ config, onEvent, onComplete }: GameProps) {
  const dragConfig = config as DragMatchConfig;
  const items = dragConfig.items || [];
  const [matches, setMatches] = React.useState<Record<string, string>>({});
  const [availableNumbers, setAvailableNumbers] = React.useState<string[]>([]);
  const [startTime] = React.useState(Date.now());
  const [completed, setCompleted] = React.useState(false);

  // Initialize available numbers from items
  React.useEffect(() => {
    const numbers = items.map(item => item.target);
    setAvailableNumbers(numbers);

    onEvent({
      type: 'start',
      payload: { config: dragConfig },
      ts: Date.now(),
    });
  }, [items, onEvent, dragConfig]);

  const handleNumberClick = React.useCallback(
    (itemId: string, number: string) => {
      setMatches(prev => ({ ...prev, [itemId]: number }));
      setAvailableNumbers(prev => prev.filter(n => n !== number));

      onEvent({
        type: 'answer',
        payload: { itemId, number },
        ts: Date.now(),
      });
    },
    [onEvent],
  );

  const handleRemoveMatch = React.useCallback(
    (itemId: string) => {
      const number = matches[itemId];
      if (number) {
        setAvailableNumbers(prev => [...prev, number].sort());
        setMatches((prev) => {
          const newMatches = { ...prev };
          delete newMatches[itemId];
          return newMatches;
        });
      }
    },
    [matches],
  );

  const handleSubmit = React.useCallback(() => {
    const durationMs = Date.now() - startTime;
    let correct = 0;
    let incorrect = 0;

    items.forEach((item) => {
      if (matches[item.id] === item.target) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = items.length > 0 ? correct / items.length : 0;

    setCompleted(true);

    onEvent({
      type: 'end',
      payload: { correct, incorrect, score },
      ts: Date.now(),
    });

    onComplete({
      score,
      correct,
      incorrect,
      durationMs,
      meta: { matches, items },
    });
  }, [items, matches, startTime, onEvent, onComplete]);

  const allMatched = items.length > 0 && items.every(item => matches[item.id]);

  if (completed) {
    return (
      <div className="p-6 text-center text-white">
        <div className="mb-4 text-4xl">✅</div>
        <p className="text-lg font-semibold">Hoàn thành!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 text-white">
      {/* Goal */}
      {dragConfig.goal && (
        <div className="rounded-lg border border-white/20 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white/90">{dragConfig.goal}</p>
        </div>
      )}

      {/* Available Numbers */}
      <div className="rounded-lg border border-white/20 bg-white/5 p-4">
        <p className="mb-3 text-sm font-semibold text-white/70">Số có sẵn:</p>
        <div className="flex flex-wrap gap-2">
          {availableNumbers.length === 0
            ? (
              <p className="text-sm text-white/50">Tất cả số đã được sử dụng</p>
            )
            : (
              availableNumbers.map(num => (
                <span
                  key={num}
                  className="rounded-lg border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-lg font-bold text-blue-400"
                >
                  {num}
                </span>
              ))
            )}
        </div>
      </div>

      {/* Items Grid */}
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="rounded-lg border border-white/20 bg-white/5 p-4">
            {/* Sprites Display */}
            <div className="mb-3 flex flex-wrap gap-2">
              {item.sprites.map((sprite, idx) => (
                <span key={idx} className="text-3xl">
                  {sprite}
                </span>
              ))}
            </div>

            {/* Drop Zone */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">Số lượng:</span>
              {matches[item.id]
                ? (
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-green-500/50 bg-green-500/20 px-6 py-2 text-2xl font-bold text-green-400">
                      {matches[item.id]}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMatch(item.id)}
                      className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/70 hover:bg-white/10"
                    >
                      Xóa
                    </button>
                  </div>
                )
                : (
                  <div className="flex flex-wrap gap-2">
                    {availableNumbers.map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleNumberClick(item.id, num)}
                        className="rounded-lg border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-lg font-bold text-blue-400 hover:bg-blue-500/20"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!allMatched}
        className="w-full bg-[#6ac21a] text-white hover:bg-[#5aa017] disabled:opacity-50"
      >
        {allMatched ? 'Kiểm tra kết quả' : `Còn ${items.length - Object.keys(matches).length} câu`}
      </Button>

      {/* Rules */}
      {dragConfig.rules && dragConfig.rules.length > 0 && (
        <div className="rounded-lg border border-white/20 bg-white/5 p-4">
          <p className="mb-2 text-sm font-semibold text-white/70">Hướng dẫn:</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-white/60">
            {dragConfig.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
