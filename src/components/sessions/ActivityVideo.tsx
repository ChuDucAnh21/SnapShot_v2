// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import type { Activity, SubmitActivityResultReq } from '@/features/sessions/types';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useSessionFlowStore } from '@/stores/session-flow-store';

type ActivityVideoProps = {
  readonly activity: Activity;
  readonly onSubmit: (result: SubmitActivityResultReq) => void;
  readonly onNext: () => void;
  readonly isSubmitting: boolean;
};

export default function ActivityVideo({ activity, onSubmit, onNext, isSubmitting }: ActivityVideoProps) {
  const [watched, setWatched] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const markActivityStart = useSessionFlowStore(state => state.markActivityStart);
  const getActivityTimeSpent = useSessionFlowStore(state => state.getActivityTimeSpent);

  // Mark activity start time
  React.useEffect(() => {
    markActivityStart(activity.activity_id);
  }, [activity.activity_id, markActivityStart]);

  const videoUrl = activity.content?.video_url || activity.content?.url || '';
  const videoDescription = activity.content?.description || '';

  const handleWatchComplete = React.useCallback(() => {
    setWatched(true);
  }, []);

  const handleSubmit = React.useCallback(() => {
    const timeSpent = getActivityTimeSpent(activity.activity_id);

    const result: SubmitActivityResultReq = {
      completed: true,
      score: 1, // Video is considered complete once watched
      time_spent: timeSpent,
      answer: { watched: true, videoUrl },
    };

    setSubmitted(true);
    onSubmit(result);
  }, [activity.activity_id, getActivityTimeSpent, onSubmit, videoUrl]);

  const handleNext = React.useCallback(() => {
    setWatched(false);
    setSubmitted(false);
    onNext();
  }, [onNext]);

  // Auto-mark as watched after simulated duration (in real app, use video player events)
  React.useEffect(() => {
    if (!videoUrl) {
      return;
    }

    const timer = setTimeout(() => {
      setWatched(true);
    }, 5000); // Simulate 5 seconds watching

    return () => clearTimeout(timer);
  }, [videoUrl]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-sm">
      {/* Phase Badge */}
      <div className="mb-4">
        <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
          {activity.phase}
        </span>
      </div>

      {/* Video Title */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-bold text-gray-800">Video Lesson</h2>
        {videoDescription && <p className="text-sm text-gray-600">{videoDescription}</p>}
      </div>

      {/* Video Player Placeholder */}
      <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
        {videoUrl
          ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-4xl">🎬</div>
                <p className="mb-2 text-sm text-gray-600">Video Player</p>
                <p className="text-xs text-gray-500">{videoUrl}</p>
                {!watched && (
                  <Button onClick={handleWatchComplete} className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
                    Mark as Watched
                  </Button>
                )}
              </div>
            </div>
          )
          : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No video available</p>
            </div>
          )}
      </div>

      {/* Watch Status */}
      {watched && !submitted && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">✓ Video đã xem xong!</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted
          ? (
            <Button
              onClick={handleSubmit}
              disabled={!watched || isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang gửi...' : 'Hoàn thành'}
            </Button>
          )
          : (
            <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
              Tiếp tục →
            </Button>
          )}
      </div>
    </div>
  );
}
