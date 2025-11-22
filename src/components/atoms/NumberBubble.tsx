// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type NumberBubbleProps = {
  readonly number: number;
  readonly state: 'idle' | 'selected' | 'correct' | 'incorrect';
  readonly onClick?: (number: number) => void;
  readonly disabled?: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
};

const stateClasses = {
  idle: 'bg-white/20 text-white hover:bg-white/30',
  selected: 'bg-blue-500 text-white ring-2 ring-blue-300',
  correct: 'bg-green-500 text-white',
  incorrect: 'bg-red-500 text-white animate-pulse',
};

export default function NumberBubble({ number, state, onClick, disabled = false, size = 'md' }: NumberBubbleProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(number)}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center rounded-full font-bold transition-all',
        sizeClasses[size],
        stateClasses[state],
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      aria-label={`Number ${number}`}
    >
      {number}
    </button>
  );
}
