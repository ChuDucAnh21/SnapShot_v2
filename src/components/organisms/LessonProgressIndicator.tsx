// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { CheckCircle, Star } from 'lucide-react';
import * as React from 'react';
// import { useProgressStore } from '@/lib/store/progressStore';
import { cn } from '@/utils/cn';

// TODO: Implement progress store
const useProgressStore = () => ({
  getLessonProgress: (_lessonId: string) => ({ completed: false, score: 0, stars: 0, attempts: 0 }),
});

type LessonProgressIndicatorProps = {
  readonly lessonId: string;
  readonly className?: string;
};

export default function LessonProgressIndicator({ lessonId, className }: LessonProgressIndicatorProps) {
  const { getLessonProgress } = useProgressStore();
  const progress = getLessonProgress(lessonId);

  if (!progress) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="h-6 w-6 rounded-full bg-gray-500/30" />
        <span className="text-sm text-white/60">Chưa bắt đầu</span>
      </div>
    );
  }

  const { completed, stars, attempts } = progress;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Status Icon */}
      <div className="relative">
        {completed
          ? (
            <CheckCircle className="h-6 w-6 text-green-400" />
          )
          : (
            <div className="h-6 w-6 rounded-full bg-yellow-400/30" />
          )}

        {/* Stars overlay */}
        {stars > 0 && (
          <div className="absolute -top-1 -right-1 flex items-center gap-0.5">
            {Array.from({ length: Math.min(stars, 3) }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        )}
      </div>

      {/* Progress Text */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{completed ? 'Hoàn thành' : 'Đang học'}</span>
        {attempts > 0 && (
          <span className="text-xs text-white/60">
            {stars}
            {' '}
            sao •
            {attempts}
            {' '}
            lần thử
          </span>
        )}
      </div>
    </div>
  );
}
