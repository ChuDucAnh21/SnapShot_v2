// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

'use client';

import type { GameProps } from '../types';
import * as React from 'react';
import { Button } from '@/components/ui/button';

type MazeConfig = {
  rows: number;
  cols: number;
  obstacles: number;
};

export default function MazeGame({ config, seed, onEvent, onComplete }: GameProps) {
  const typedConfig = config as MazeConfig;
  const [position, setPosition] = React.useState({ row: 0, col: 0 });
  const [steps, setSteps] = React.useState(0);
  const [collisions, setCollisions] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  const rows = typedConfig.rows ?? 10;
  const cols = typedConfig.cols ?? 10;
  const goalRow = rows - 1;
  const goalCol = cols - 1;

  const obstacles = React.useMemo(() => {
    const count = Math.floor((typedConfig.obstacles ?? 0.1) * rows * cols);
    const set = new Set<string>();
    const rng = seed ? () => ((Number(seed) * 9301 + 49297) % 233280) / 233280 : Math.random;

    for (let i = 0; i < count; i++) {
      const r = Math.floor(rng() * rows);
      const c = Math.floor(rng() * cols);
      if (r === 0 && c === 0) {
        continue;
      }
      if (r === goalRow && c === goalCol) {
        continue;
      }
      set.add(`${r},${c}`);
    }
    return set;
  }, [rows, cols, typedConfig.obstacles, seed, goalRow, goalCol]);

  const handleStart = React.useCallback(() => {
    setStarted(true);
    onEvent({ type: 'start', payload: {}, ts: Date.now() });
  }, [onEvent]);

  const handleMove = React.useCallback(
    (dr: number, dc: number) => {
      setPosition((prev) => {
        const newRow = Math.max(0, Math.min(rows - 1, prev.row + dr));
        const newCol = Math.max(0, Math.min(cols - 1, prev.col + dc));

        if (obstacles.has(`${newRow},${newCol}`)) {
          setCollisions(c => c + 1);
          onEvent({ type: 'error', payload: { collision: true }, ts: Date.now() });
          return prev;
        }

        setSteps(s => s + 1);
        onEvent({ type: 'progress', payload: { row: newRow, col: newCol }, ts: Date.now() });
        return { row: newRow, col: newCol };
      });
    },
    [rows, cols, obstacles, onEvent],
  );

  React.useEffect(() => {
    if (position.row === goalRow && position.col === goalCol && steps > 0) {
      const score = Math.max(0, 1 - collisions / steps);
      onEvent({ type: 'end', payload: { steps, collisions }, ts: Date.now() });
      onComplete({
        score,
        correct: 1,
        incorrect: collisions,
        durationMs: 0,
        meta: { steps, collisions },
      });
    }
  }, [position, goalRow, goalCol, steps, collisions, onEvent, onComplete]);

  if (!started) {
    return (
      <div className="container mx-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">Maze Runner</h2>
          <p className="mb-6 text-white/80">Navigate from top-left to bottom-right!</p>
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
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-white/70">
              Steps:
              {steps}
            </span>
            <span className="ml-4 text-sm text-white/70">
              Collisions:
              {collisions}
            </span>
          </div>
        </div>

        <div
          className="grid gap-1 bg-black/20 p-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const isPlayer = r === position.row && c === position.col;
              const isGoal = r === goalRow && c === goalCol;
              const isObstacle = obstacles.has(`${r},${c}`);

              return (
                <div
                  key={`${r},${c}`}
                  className={`aspect-square rounded ${
                    isPlayer ? 'bg-blue-500' : isGoal ? 'bg-green-500' : isObstacle ? 'bg-red-500/50' : 'bg-white/10'
                  }`}
                />
              );
            }),
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div />
          <Button onClick={() => handleMove(-1, 0)}>↑</Button>
          <div />
          <Button onClick={() => handleMove(0, -1)}>←</Button>
          <div />
          <Button onClick={() => handleMove(0, 1)}>→</Button>
          <div />
          <Button onClick={() => handleMove(1, 0)}>↓</Button>
          <div />
        </div>
      </div>
    </div>
  );
}
