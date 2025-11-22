// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type ChoiceCardProps = {
  readonly text: string;
  readonly selected?: boolean;
  readonly correct?: boolean;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly variant?: 'default' | 'large';
};

const variantClasses = {
  default: 'h-12 px-4 text-base',
  large: 'h-16 px-6 text-lg',
};

export default function ChoiceCard({
  text,
  selected = false,
  correct = false,
  onClick,
  disabled = false,
  variant = 'default',
}: ChoiceCardProps) {
  const getStateClasses = () => {
    if (correct) {
      return 'bg-green-500 text-white border-green-400';
    }
    if (selected) {
      return 'bg-blue-500 text-white border-blue-400';
    }
    return 'bg-white/20 text-white border-white/30 hover:bg-white/30';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center rounded-lg border-2 font-medium transition-all',
        variantClasses[variant],
        getStateClasses(),
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      aria-label={`Option: ${text}`}
    >
      {text}
    </button>
  );
}
