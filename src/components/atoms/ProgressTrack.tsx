// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/cn';

export type ClampedNumber = number & { __clampedBrand: never }; // must be between 0 and 1 (inclusive), e.g., 0, 1, 0.1, 0.12

export type ProgressTrackProps = {
  readonly value: ClampedNumber;
  readonly ariaLabel?: string;
  readonly className?: string;
};

export default function ProgressTrack({ value, ariaLabel = 'Lesson progress', className }: ProgressTrackProps) {
  const progressValue = Math.round(value * 100);

  return (
    <div className={cn('relative', className)}>
      <Progress
        value={progressValue}
        className="bg-white/20 h-4 rounded-full"
        aria-label={ariaLabel}
        style={{
          '--progress-indicator-bg': '#6ac21a',
        } as React.CSSProperties}
      />
    </div>
  );
}
