// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

export type SessionState = 'welcome' | 'question' | 'summary' | 'loading' | 'error';
export type QuestionState = 'idle' | 'submitting' | 'feedback' | 'completed';

export type ExerciseResult = {
  exerciseId: string;
  correct: boolean;
  skipped: boolean;
  submittedAt: number;
};

export type SessionData = {
  lessonId: string;
  currentIndex: number;
  results: ExerciseResult[];
  startTime: number;
  state: SessionState;
};

const SESSION_KEY = 'lesson-session';

export function useLessonSession(lessonId: string, exercises: any[]) {
  const [sessionData, setSessionData] = React.useState<SessionData>(() => {
    // Try to restore from sessionStorage
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.lessonId === lessonId) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse saved session:', e);
        }
      }
    }

    // Initialize new session
    return {
      lessonId,
      currentIndex: 0,
      results: [],
      startTime: Date.now(),
      state: 'welcome',
    };
  });

  const [questionState, setQuestionState] = React.useState<QuestionState>('idle');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [lastSubmitTime, setLastSubmitTime] = React.useState(0);

  // Save session to sessionStorage whenever it changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    }
  }, [sessionData]);

  // Anti-double-submit guard
  const canSubmit = React.useCallback(() => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    return !isSubmitting && timeSinceLastSubmit > 1000; // 1 second cooldown
  }, [isSubmitting, lastSubmitTime]);

  const submitAnswer = React.useCallback(
    async (correct: boolean) => {
      if (!canSubmit()) {
        console.warn('Submit blocked: too soon or already submitting');
        return;
      }

      setIsSubmitting(true);
      setLastSubmitTime(Date.now());
      setQuestionState('submitting');

      try {
        // Mock API call - replace with actual validation later
        await new Promise(resolve => setTimeout(resolve, 500));

        const result: ExerciseResult = {
          exerciseId: exercises[sessionData.currentIndex]?.id || '',
          correct,
          skipped: false,
          submittedAt: Date.now(),
        };

        setSessionData(prev => ({
          ...prev,
          results: [...prev.results, result],
          currentIndex: prev.currentIndex + 1,
          state: prev.currentIndex + 1 >= exercises.length ? 'summary' : 'question',
        }));

        setQuestionState('feedback');

        // Show feedback for 1.5 seconds before moving to next
        setTimeout(() => {
          setQuestionState('idle');
        }, 1500);
      } catch (error) {
        console.error('Submit error:', error);
        setQuestionState('idle');
      } finally {
        setIsSubmitting(false);
      }
    },
    [canSubmit, exercises, sessionData.currentIndex],
  );

  const skipQuestion = React.useCallback(async () => {
    if (!canSubmit()) {
      console.warn('Skip blocked: too soon or already submitting');
      return;
    }

    setIsSubmitting(true);
    setLastSubmitTime(Date.now());
    setQuestionState('submitting');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const result: ExerciseResult = {
        exerciseId: exercises[sessionData.currentIndex]?.id || '',
        correct: false,
        skipped: true,
        submittedAt: Date.now(),
      };

      setSessionData(prev => ({
        ...prev,
        results: [...prev.results, result],
        currentIndex: prev.currentIndex + 1,
        state: prev.currentIndex + 1 >= exercises.length ? 'summary' : 'question',
      }));

      setQuestionState('completed');

      setTimeout(() => {
        setQuestionState('idle');
      }, 1000);
    } catch (error) {
      console.error('Skip error:', error);
      setQuestionState('idle');
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, exercises, sessionData.currentIndex]);

  const nextQuestion = React.useCallback(() => {
    if (sessionData.currentIndex < exercises.length) {
      setSessionData(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        state: prev.currentIndex + 1 >= exercises.length ? 'summary' : 'question',
      }));
    }
  }, [exercises.length, sessionData.currentIndex]);

  const finishLesson = React.useCallback(async () => {
    setSessionData(prev => ({ ...prev, state: 'summary' }));

    // Mock final submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear session storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch (error) {
      console.error('Finish error:', error);
    }
  }, []);

  const startLesson = React.useCallback(() => {
    setSessionData(prev => ({ ...prev, state: 'question' }));
  }, []);

  const resetSession = React.useCallback(() => {
    setSessionData({
      lessonId,
      currentIndex: 0,
      results: [],
      startTime: Date.now(),
      state: 'welcome',
    });
    setQuestionState('idle');
    setIsSubmitting(false);
    setLastSubmitTime(0);
  }, [lessonId]);

  const currentExercise = exercises[sessionData.currentIndex];
  const isLastQuestion = sessionData.currentIndex >= exercises.length - 1;
  const progress = exercises.length > 0 ? sessionData.currentIndex / exercises.length : 0;

  return {
    // State
    sessionData,
    questionState,
    isSubmitting,
    currentExercise,
    isLastQuestion,
    progress,

    // Actions
    submitAnswer,
    skipQuestion,
    nextQuestion,
    finishLesson,
    startLesson,
    resetSession,

    // Computed
    canSubmit: canSubmit(),
    totalQuestions: exercises.length,
    completedQuestions: sessionData.results.length,
    correctAnswers: sessionData.results.filter(r => r.correct).length,
    skippedQuestions: sessionData.results.filter(r => r.skipped).length,
  };
}
