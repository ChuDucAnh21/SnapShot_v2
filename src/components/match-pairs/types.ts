// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

export type MatchPairsProps = {
  readonly item: GeneratedItem & { type: 'match_pairs' };
  readonly onComplete: (summary: { attempts: number; timeMs: number; mistakes: number }) => void;
  readonly onTelemetry?: (e: TelemetryEvent) => void;
};

export type CardState = 'faceDown' | 'flipping' | 'faceUp' | 'matched';

export type CardVM = {
  readonly id: string; // stable key
  readonly value: string; // "2" | "5" | ...
  readonly color?: 'green' | 'blue' | 'red' | string;
  readonly state: CardState;
  readonly index: number; // position in grid
};

export type TelemetryEvent = {
  readonly type: 'question_view' | 'answer_submit' | 'answer_result' | 'lesson_complete';
  readonly lessonId: string;
  readonly itemId: string;
  readonly attempt?: number;
  readonly payload?: Record<string, any>;
  readonly isCorrect?: boolean;
  readonly latencyMs?: number;
  readonly ts: string;
};

export type GeneratedItem = {
  readonly id: string;
  readonly type: 'match_pairs';
  readonly prompt: string;
  readonly ui: { input: string; autoSubmit: boolean };
  readonly difficulty: number;
  readonly skillId: string;
  readonly answerKey: string[][];
  readonly meta: {
    readonly grid: { rows: number; cols: number };
    readonly pairs: string[];
    readonly colors: Record<string, string>;
    readonly shuffleSeed: string;
  };
};

export type MatchPairsState
  = | 'INIT'
    | 'READY'
    | 'FIRST_FLIP'
    | 'SECOND_FLIP'
    | 'CHECKING'
    | 'RESOLVE_MATCH'
    | 'RESOLVE_MISMATCH'
    | 'COMPLETE';
