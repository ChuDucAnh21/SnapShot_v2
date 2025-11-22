// Rules applied: brace-style:1tbs, react/prefer-destructuring-assignment:off

'use client';

import type { GeneratedItem } from '@/types/math-core';
import { useState } from 'react';
import Confetti from '@/components/atoms/Confetti';
import ShakeAnimation from '@/components/atoms/ShakeAnimation';
import { LessonProgress } from '@/components/molecules/LessonProgress';
import { MathItemRenderer } from '@/components/molecules/MathItemRenderer';
// import { evaluateAnswer } from '@/data/mock-content';

// TODO: Implement evaluateAnswer function
const evaluateAnswer = (item: GeneratedItem, answer: string) => {
  // Simple mock evaluation - compare with answerKey
  if (Array.isArray(item.answerKey)) {
    return item.answerKey.includes(answer);
  }
  return answer === item.answerKey.toString();
};

type LessonSessionProps = {
  items: GeneratedItem[];
  onComplete: (results: LessonResults) => void;
  onExit?: () => void;
};

export type LessonResults = {
  totalItems: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeSpent: number;
  stars: 0 | 1 | 2 | 3;
};

type AnswerResult = {
  itemId: string;
  isCorrect: boolean;
  userAnswer: unknown;
  timestamp: number;
};

export function LessonSession({ items, onComplete, onExit }: LessonSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [hearts, setHearts] = useState(3);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime] = useState(Date.now());
  const [isAnimating, setIsAnimating] = useState(false);

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex === items.length - 1;

  const handleLessonComplete = () => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = answers.length - correctAnswers;
    const accuracy = answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0;
    const timeSpent = Date.now() - startTime;

    // Calculate stars based on accuracy and hearts remaining
    let stars: 0 | 1 | 2 | 3 = 0;
    if (accuracy >= 80 && hearts > 0) {
      stars = 3;
    } else if (accuracy >= 60 && hearts > 0) {
      stars = 2;
    } else if (accuracy >= 40) {
      stars = 1;
    }

    const results: LessonResults = {
      totalItems: items.length,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      timeSpent,
      stars,
    };

    onComplete(results);
  };

  const handleAnswer = (userAnswer: unknown) => {
    if (isAnimating) {
      return;
    }

    const isCorrect = evaluateAnswer(currentItem!, String(userAnswer));
    const timestamp = Date.now();

    const result: AnswerResult = {
      itemId: currentItem!.id,
      isCorrect,
      userAnswer,
      timestamp,
    };

    setAnswers(prev => [...prev, result]);
    setShowFeedback(true);
    setIsAnimating(true);

    if (isCorrect) {
      setFeedbackType('correct');
    } else {
      setFeedbackType('incorrect');
      setHearts(prev => Math.max(0, prev - 1));
    }

    // Auto-advance after feedback
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackType(null);
      setIsAnimating(false);

      if (isLastItem) {
        handleLessonComplete();
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1500);
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
  };

  if (!currentItem) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Không có bài tập nào</p>
          <button type="button" onClick={handleExit} className="mt-4">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <button type="button" onClick={handleExit}>
              ← Thoát
            </button>
            <h1 className="text-lg font-semibold">Bài học</h1>
            <div className="w-16" />
            {' '}
            {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <LessonProgress
          currentItemIndex={currentIndex}
          totalItems={items.length}
          correctAnswers={answers.filter(a => a.isCorrect).length}
          incorrectAnswers={answers.filter(a => !a.isCorrect).length}
          hearts={hearts}
        />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 pb-8">
        <div className="relative">
          {/* Feedback Animations */}
          {showFeedback && (
            <>
              {feedbackType === 'correct' && (
                <Confetti
                  trigger={showFeedback}
                  duration={1500}
                  className="pointer-events-none absolute inset-0 z-10"
                />
              )}
              {feedbackType === 'incorrect' && (
                <ShakeAnimation
                  trigger={showFeedback}
                  duration={1500}
                  className="pointer-events-none absolute inset-0 z-10"
                >
                  <div className="mb-4 text-6xl text-green-500">🎉</div>
                </ShakeAnimation>
              )}
            </>
          )}

          {/* Item Renderer */}
          <MathItemRenderer item={currentItem} onAnswer={handleAnswer} disabled={isAnimating} />

          {/* Feedback Overlay */}
          {showFeedback && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div
                className={`rounded-lg px-8 py-4 text-xl font-semibold text-white ${
                  feedbackType === 'correct' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {feedbackType === 'correct' ? 'Đúng rồi! 🎉' : 'Sai rồi! 😔'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
