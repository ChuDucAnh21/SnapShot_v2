// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { CheckCircle, RotateCcw, XCircle } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export type SummaryScreenProps = {
  lessonId: string;
  totalQuestions: number;
  correctAnswers: number;
  skippedQuestions: number;
  onRestart: () => void;
  onFinish: () => void;
};

export default function SummaryScreen({
  lessonId,
  totalQuestions,
  correctAnswers,
  skippedQuestions,
  onRestart,
  onFinish,
}: SummaryScreenProps) {
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const xpEarned = correctAnswers * 10;

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8 px-8 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Lesson Complete!</h1>
          <p className="text-lg text-gray-300">
            Great job on Lesson
            {lessonId}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 rounded-lg bg-white/10 p-6">
          <div className="space-y-2">
            <CheckCircle className="mx-auto h-8 w-8 text-green-400" />
            <p className="text-2xl font-bold text-white">{correctAnswers}</p>
            <p className="text-sm text-gray-300">Correct</p>
          </div>

          <div className="space-y-2">
            <XCircle className="mx-auto h-8 w-8 text-gray-400" />
            <p className="text-2xl font-bold text-white">{skippedQuestions}</p>
            <p className="text-sm text-gray-300">Skipped</p>
          </div>

          <div className="space-y-2">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400">
              <span className="text-sm font-bold text-black">XP</span>
            </div>
            <p className="text-2xl font-bold text-white">
              +
              {xpEarned}
            </p>
            <p className="text-sm text-gray-300">Earned</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg text-white">
            Accuracy:
            {accuracy}
            %
          </p>
          <div className="h-2 w-full rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-green-400 transition-all duration-1000"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onRestart} className="h-12 min-w-[150px]">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart
        </Button>

        <Button onClick={onFinish} className="h-12 min-w-[150px]">
          Finish
        </Button>
      </div>
    </div>
  );
}
