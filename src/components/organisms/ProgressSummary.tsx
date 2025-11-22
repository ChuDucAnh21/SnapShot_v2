'use client';

import { Star, Target, Trophy } from 'lucide-react';
import * as React from 'react';
import IconText from '@/components/atoms/IconText';
import HeartCounter from '@/components/molecules/HeartCounter';
import { useProgressSummary } from '@/features/dashboard/progress-summary';
import { cn } from '@/utils/cn';

type ProgressSummaryProps = {
  readonly className?: string;
  readonly learnerId?: string;
  readonly enabled?: boolean;
};

const DEFAULT_LEARNER_ID = 'learner-001';
const numberFormatter = new Intl.NumberFormat('en-US');

export default function ProgressSummary({ className, learnerId, enabled = true }: ProgressSummaryProps) {
  const activeLearnerId = learnerId ?? DEFAULT_LEARNER_ID;
  const { data, isLoading, isError } = useProgressSummary(activeLearnerId, enabled);
  const summary = data?.summary;

  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-lg bg-gray-50 border border-gray-200 p-4 text-center text-sm font-medium text-gray-600',
          className,
        )}
      >
        Loading progress...
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div
        className={cn(
          'rounded-lg bg-gray-50 border border-gray-200 p-4 text-center text-sm font-medium text-gray-600',
          className,
        )}
      >
        Progress data is not available yet.
      </div>
    );
  }

  const totalStars = numberFormatter.format(summary.total_stars);
  const totalLessons = summary.total_lessons;
  const completedLessons = summary.completed_lessons;
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const heartsRemaining = summary.hearts.current;
  const heartsMax = summary.hearts.max;

  return (
    <div className={cn('rounded-lg bg-white border border-gray-200 p-4 shadow-sm', className)}>
      <div className="mb-3 text-center">
        <h3 className="text-lg font-semibold text-gray-800">Tiến trình học tập</h3>
      </div>

      <div className="space-y-3">
        <IconText
          icon={<Star className="h-5 w-5 text-yellow-500" />}
          text={`${totalStars} sao thu thập được`}
          className="text-gray-700"
          textClassName="text-sm font-medium text-gray-700"
        />

        <IconText
          icon={<Target className="h-5 w-5 text-blue-500" />}
          text={`${completedLessons}/${totalLessons} bài học (${completionPercentage}%)`}
          className="text-gray-700"
          textClassName="text-sm font-medium text-gray-700"
        />

        <IconText
          icon={<Trophy className="h-5 w-5 text-orange-500" />}
          text={`Chuỗi ${summary.current_streak} ngày`}
          className="text-gray-700"
          textClassName="text-sm font-medium text-gray-700"
        />

        <div className="flex flex-col items-center gap-1">
          <HeartCounter
            count={heartsRemaining}
            size="sm"
            className="justify-center text-gray-700"
            textClassName="text-sm font-semibold text-gray-700"
          />
          <span className="text-xs text-gray-600">
            {heartsRemaining}
            /
            {heartsMax}
            {' '}
            lives remaining
          </span>
        </div>
      </div>
    </div>
  );
}
