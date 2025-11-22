// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { Percent, Star, Target } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/utils/cn';

export type ProfileProgressSummaryProps = {
  readonly completedLessons: number;
  readonly totalStars: number;
  readonly completionPercentage: number;
  readonly className?: string;
};

export default function ProfileProgressSummary({
  completedLessons,
  totalStars,
  completionPercentage,
  className,
}: ProfileProgressSummaryProps) {
  return (
    <section className={cn('mt-6', className)}>
      <h2 className="mb-3 text-lg font-semibold text-gray-800">Learning Progress</h2>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target size={16} className="text-blue-500" aria-hidden />
              Completed Lessons
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-800">{completedLessons}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star size={16} className="text-yellow-500" aria-hidden />
              Total Stars
            </div>
            <div className="mt-1 text-2xl font-semibold text-green-600">{totalStars}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Percent size={16} className="text-purple-500" aria-hidden />
              Completion
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-800">
              {completionPercentage}
              %
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
