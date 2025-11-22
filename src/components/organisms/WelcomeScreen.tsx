// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { Play } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export type WelcomeScreenProps = {
  lessonId: string;
  totalQuestions: number;
  onStart: () => void;
};

export default function WelcomeScreen({ lessonId, totalQuestions, onStart }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8 px-8 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Lesson
          {lessonId}
        </h1>
        <p className="text-lg text-gray-300">
          {totalQuestions}
          {' '}
          questions to complete
        </p>
        <p className="text-sm text-gray-400">Answer correctly to earn XP, skip if you need help</p>
      </div>

      <Button onClick={onStart} size="lg" className="h-14 min-w-[200px] text-lg">
        <Play className="mr-2 h-5 w-5" />
        Start Lesson
      </Button>
    </div>
  );
}
