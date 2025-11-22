// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import type { Activity, SubmitActivityResultReq } from '@/features/sessions/types';

import * as React from 'react';
import ActivityGame from './ActivityGame';
import ActivityQuestion from './ActivityQuestion';
import ActivityQuiz from './ActivityQuiz';
import ActivityVideo from './ActivityVideo';

type ActivityHostProps = {
  readonly activity: Activity;
  readonly onSubmit: (result: SubmitActivityResultReq) => void;
  readonly onNext: () => void;
  readonly isSubmitting: boolean;
};

export default function ActivityHost({ activity, onSubmit, onNext, isSubmitting }: ActivityHostProps) {
  const handleSubmit = React.useCallback(
    (result: SubmitActivityResultReq) => {
      onSubmit(result);
    },
    [onSubmit],
  );

  // Render appropriate component based on activity type
  switch (activity.type) {
    case 'question':
      return (
        <div className="container mx-auto space-y-4 p-4">
          <ActivityQuestion activity={activity} onSubmit={handleSubmit} onNext={onNext} isSubmitting={isSubmitting} />
        </div>
      );

    case 'quiz':
      return (
        <div className="container mx-auto space-y-4 p-4">
          <ActivityQuiz activity={activity} onSubmit={handleSubmit} onNext={onNext} isSubmitting={isSubmitting} />
        </div>
      );

    case 'video':
      return (
        <div className="container mx-auto space-y-4 p-4">
          <ActivityVideo activity={activity} onSubmit={handleSubmit} onNext={onNext} isSubmitting={isSubmitting} />
        </div>
      );

    case 'game':
      return (
        <div className="container mx-auto space-y-4 p-4">
          <ActivityGame activity={activity} onSubmit={handleSubmit} onNext={onNext} isSubmitting={isSubmitting} />
        </div>
      );

    default:
      return (
        <div className="container mx-auto p-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">
              Unknown activity type:
              {activity.type}
            </p>
          </div>
        </div>
      );
  }
}
