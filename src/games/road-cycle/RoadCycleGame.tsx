// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

'use client';

import type { GameProps } from '../types';
import * as React from 'react';
import { Button } from '@/components/ui/button';

type RoadCycleConfig = {
  speed: number;
  traffic: 'low' | 'medium' | 'high';
  laps: number;
};

export default function RoadCycleGame({ config, seed: _seed, onEvent, onComplete }: GameProps) {
  const typedConfig = config as RoadCycleConfig;
  const [started, setStarted] = React.useState(false);
  const [position, setPosition] = React.useState(50);
  const [laps, setLaps] = React.useState(0);
  const [hits, setHits] = React.useState(0);
  const [obstacles, setObstacles] = React.useState<Array<{ id: number; lane: number; y: number }>>([]);
  const t0 = React.useRef<number>(0);
  const nextId = React.useRef(0);

  const targetLaps = typedConfig.laps ?? 3;
  const speed = typedConfig.speed ?? 1;
  const traffic = typedConfig.traffic ?? 'medium';
  const spawnRate = traffic === 'low' ? 2000 : traffic === 'high' ? 500 : 1000;

  const handleStart = React.useCallback(() => {
    setStarted(true);
    t0.current = Date.now();
    onEvent({ type: 'start', payload: {}, ts: Date.now() });
  }, [onEvent]);

  const handleMove = React.useCallback(
    (direction: 'left' | 'right') => {
      setPosition(prev => Math.max(0, Math.min(100, prev + (direction === 'left' ? -20 : 20))));
      onEvent({ type: 'answer', payload: { direction }, ts: Date.now() });
    },
    [onEvent],
  );

  // Spawn obstacles
  React.useEffect(() => {
    if (!started) {
      return;
    }

    const interval = setInterval(() => {
      setObstacles(prev => [
        ...prev,
        {
          id: nextId.current++,
          lane: Math.floor(Math.random() * 5) * 20 + 10,
          y: 0,
        },
      ]);
    }, spawnRate);

    return () => clearInterval(interval);
  }, [started, spawnRate]);

  // Move obstacles
  React.useEffect(() => {
    if (!started) {
      return;
    }

    const interval = setInterval(() => {
      setObstacles((prev) => {
        const updated = prev.map(o => ({ ...o, y: o.y + speed * 2 })).filter(o => o.y < 120);

        // Check collision
        const playerLane = position;
        const collision = updated.some(
          o => o.lane >= playerLane - 10 && o.lane <= playerLane + 10 && o.y >= 80 && o.y <= 100,
        );

        if (collision) {
          setHits(h => h + 1);
          onEvent({ type: 'error', payload: { collision: true }, ts: Date.now() });
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [started, speed, position, onEvent]);

  // Complete lap
  React.useEffect(() => {
    if (!started) {
      return;
    }

    const interval = setInterval(() => {
      setLaps((prev) => {
        const next = prev + 1;
        onEvent({ type: 'progress', payload: { lap: next }, ts: Date.now() });
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [started, onEvent]);

  // Check completion
  React.useEffect(() => {
    if (laps >= targetLaps && started) {
      const durationMs = Date.now() - t0.current;
      const score = Math.max(0, 1 - hits / (targetLaps * 3));

      onEvent({ type: 'end', payload: { laps, hits }, ts: Date.now() });
      onComplete({
        score,
        correct: targetLaps,
        incorrect: hits,
        durationMs,
        meta: { laps, hits },
      });
    }
  }, [laps, targetLaps, hits, started, onEvent, onComplete]);

  if (!started) {
    return (
      <div className="container mx-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">Road Cycle Car</h2>
          <p className="mb-6 text-white/80">
            Avoid obstacles and complete
            {targetLaps}
            {' '}
            laps!
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
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-white/70">
              Laps:
              {' '}
              {laps}
              /
              {targetLaps}
            </span>
            <span className="ml-4 text-sm text-white/70">
              Hits:
              {hits}
            </span>
          </div>
        </div>

        <div className="relative h-[400px] overflow-hidden rounded-lg bg-gray-800">
          {/* Road */}
          <div className="absolute inset-0 bg-gray-700">
            {/* Lane markers */}
            {[20, 40, 60, 80].map(x => (
              <div key={x} className="absolute h-full w-[2px] bg-white/30" style={{ left: `${x}%` }} />
            ))}
          </div>

          {/* Obstacles */}
          {obstacles.map(o => (
            <div
              key={o.id}
              className="absolute h-8 w-8 rounded-full bg-red-500"
              style={{ left: `${o.lane}%`, top: `${o.y}%`, transform: 'translate(-50%, -50%)' }}
            />
          ))}

          {/* Player car */}
          <div
            className="absolute h-12 w-12 rounded-lg bg-blue-500"
            style={{ left: `${position}%`, top: '90%', transform: 'translate(-50%, -50%)' }}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => handleMove('left')} className="flex-1">
            ← Left
          </Button>
          <Button onClick={() => handleMove('right')} className="flex-1">
            Right →
          </Button>
        </div>
      </div>
    </div>
  );
}
