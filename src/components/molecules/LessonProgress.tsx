// Rules applied: brace-style:1tbs, react/prefer-destructuring-assignment:off

'use client';

import { useMemo } from 'react';
import ProgressTrack from '@/components/atoms/ProgressTrack';
import HeartCounter from '@/components/molecules/HeartCounter';

type LessonProgressProps = {
  currentItemIndex: number;
  totalItems: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hearts: number;
  maxHearts?: number;
};

export function LessonProgress({
  currentItemIndex,
  totalItems,
  correctAnswers,
  incorrectAnswers,
  hearts,
  maxHearts = 3,
}: LessonProgressProps) {
  const progress = totalItems > 0 ? (currentItemIndex / totalItems) * 100 : 0;
  const accuracy
    = correctAnswers + incorrectAnswers > 0 ? (correctAnswers / (correctAnswers + incorrectAnswers)) * 100 : 0;
  const displayHearts = useMemo(() => {
    return Math.min(hearts, maxHearts);
  }, [hearts, maxHearts]);

  return (
    <div className="w-full space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Câu
            {currentItemIndex + 1}
            {' '}
            /
            {totalItems}
          </span>
          <span>
            {Math.round(accuracy)}
            % chính xác
          </span>
        </div>
        <ProgressTrack value={(progress / 100) as any} ariaLabel="Lesson progress" />
      </div>

      {/* Hearts Counter */}
      <div className="flex justify-center">
        <HeartCounter count={displayHearts} size="md" />
      </div>

      {/* Stats */}
      <div className="flex justify-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <span className="text-green-500">✓</span>
          <span>{correctAnswers}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-red-500">✗</span>
          <span>{incorrectAnswers}</span>
        </div>
      </div>
    </div>
  );
}
