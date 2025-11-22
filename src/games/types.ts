// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type React from 'react';
import type { SessionItem } from '@/stores/session-store';

export type GameEvent = {
  type: 'start' | 'progress' | 'answer' | 'error' | 'pause' | 'resume' | 'end';
  payload: unknown;
  ts: number;
};

export type GameResult = {
  score: number;
  correct: number;
  incorrect: number;
  durationMs: number;
  meta: Record<string, unknown>;
};

export type GameProps = {
  config: Record<string, unknown>;
  seed?: string | number;
  onEvent: (e: GameEvent) => void;
  onComplete: (r: GameResult) => void;
};

export type GameAdapters = {
  fromSessionItem: (item: SessionItem) => { config: Record<string, unknown>; seed?: string | number };
  toSessionResult: (gr: GameResult) => { itemId: string; score: number; details: Record<string, unknown> };
};

export type GameSpec = {
  id: string;
  title: string;
  component: React.ComponentType<GameProps>;
  adapters: Partial<GameAdapters>;
  defaultConfig: Record<string, unknown>;
  tags: string[];
  description?: string;
};

export type GameRegistry = Map<string, GameSpec>;
