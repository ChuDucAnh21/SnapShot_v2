// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import ActivityHost from '@/components/sessions/ActivityHost';
import { Button } from '@/components/ui/button';
import { useCompleteSession, useSession, useStartSession, useSubmitActivityResult } from '@/features/sessions/hooks';
import { useCurrentIndex, useIsStarted, useSessionFlowStore } from '@/stores/session-flow-store';

type SessionClientProps = {
  readonly id: string;
};

export default function SessionClient({ id }: SessionClientProps) {
  const router = useRouter();

  // React Query hooks
  const sessionQuery = useSession(id);
  const startSessionMutation = useStartSession();
  const submitActivityMutation = useSubmitActivityResult();
  const completeSessionMutation = useCompleteSession();

  // Zustand store
  const currentIndex = useCurrentIndex();
  const isStarted = useIsStarted();
  const { setStarted, next, reset } = useSessionFlowStore();

  const [showCompleteModal, setShowCompleteModal] = React.useState(false);

  // Extract session data
  const session = sessionQuery.data?.session;
  const activities = session?.activities || [];
  const currentActivity = activities[currentIndex];
  const totalActivities = activities.length;
  const isLastActivity = currentIndex === totalActivities - 1;

  // Start session on mount (only once)
  React.useEffect(() => {
    if (session && !isStarted && !startSessionMutation.isPending) {
      startSessionMutation.mutate(id, {
        onSuccess: () => {
          setStarted(true);
        },
        onError: (error) => {
          console.error('Failed to start session:', error);
        },
      });
    }
  }, [session, isStarted, startSessionMutation, id, setStarted]);

  // Reset store on unmount
  React.useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Handle activity submission
  const handleActivitySubmit = React.useCallback(
    (resultBody: any) => {
      if (!currentActivity) {
        return;
      }

      submitActivityMutation.mutate(
        {
          sessionId: id,
          activityId: currentActivity.activity_id,
          body: resultBody,
        },
        {
          onSuccess: (response) => {
            console.warn('Activity submitted:', response);
          },
          onError: (error) => {
            console.error('Failed to submit activity:', error);
          },
        },
      );
    },
    [currentActivity, id, submitActivityMutation],
  );

  // Handle next activity
  const handleNext = React.useCallback(() => {
    if (isLastActivity) {
      setShowCompleteModal(true);
    } else {
      next(totalActivities);
    }
  }, [isLastActivity, next, totalActivities]);

  // Handle session completion
  const handleCompleteSession = React.useCallback(
    (feedback?: string) => {
      completeSessionMutation.mutate(
        {
          sessionId: id,
          body: { overall_feedback: feedback },
        },
        {
          onSuccess: (response) => {
            console.warn('Session completed:', response);
            router.replace('/learn');
          },
          onError: (error) => {
            console.error('Failed to complete session:', error);
          },
        },
      );
    },
    [id, completeSessionMutation, router],
  );

  // Loading state
  if (sessionQuery.isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-sm text-gray-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (sessionQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-red-600">Lỗi tải bài học</h2>
          <p className="mb-4 text-sm text-red-600">Không thể tải bài học. Vui lòng thử lại.</p>
          <div className="flex gap-3">
            <Button onClick={() => sessionQuery.refetch()} className="flex-1 bg-red-500 text-white hover:bg-red-600">
              Thử lại
            </Button>
            <Button onClick={() => router.back()} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No activities
  if (totalActivities === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="max-w-md rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-yellow-600">Không có hoạt động</h2>
          <p className="mb-4 text-sm text-yellow-600">Bài học này chưa có hoạt động nào.</p>
          <Button onClick={() => router.back()} className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="border-b-2 border-blue-400 bg-white shadow-md px-4 py-4">
        <div className="container mx-auto">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => router.back()} className="text-sm text-gray-600 hover:text-gray-800">
              ← Quay lại
            </button>
            <div className="text-sm text-gray-600">
              {currentIndex + 1}
              {' '}
              /
              {totalActivities}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalActivities) * 100}%` }}
            />
          </div>

          {/* Session Title */}
          <h1 className="text-lg font-bold text-gray-800">{session.skill_name}</h1>
        </div>
      </div>

      {/* Activity Content */}
      <div className="py-6">
        {currentActivity
          ? (
            <ActivityHost
              activity={currentActivity}
              onSubmit={handleActivitySubmit}
              onNext={handleNext}
              isSubmitting={submitActivityMutation.isPending}
            />
          )
          : (
            <div className="container mx-auto p-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600">
                Không tìm thấy hoạt động
              </div>
            </div>
          )}
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-6 text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">Hoàn thành bài học!</h2>
              <p className="text-sm text-gray-600">
                Bạn đã hoàn thành tất cả
                {totalActivities}
                {' '}
                hoạt động.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCompleteModal(false)}
                disabled={completeSessionMutation.isPending}
                className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Đóng
              </Button>
              <Button
                onClick={() => handleCompleteSession()}
                disabled={completeSessionMutation.isPending}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
              >
                {completeSessionMutation.isPending ? 'Đang xử lý...' : 'Hoàn tất'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
