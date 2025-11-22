// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import type { Activity, SubmitActivityResultReq } from '@/features/sessions/types';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useSessionFlowStore } from '@/stores/session-flow-store';

type ActivityQuizProps = {
  readonly activity: Activity;
  readonly onSubmit: (result: SubmitActivityResultReq) => void;
  readonly onNext: () => void;
  readonly isSubmitting: boolean;
};

type QuizItem = {
  question: string;
  options?: string[];
  correct?: string;
  // Legacy support
  id?: string;
  prompt?: string;
  input?: 'mcq' | 'short_text';
  choices?: string[];
  correct_choice_index?: number;
  answer_key?: string;
};

export default function ActivityQuiz({ activity, onSubmit, onNext, isSubmitting }: ActivityQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const markActivityStart = useSessionFlowStore(state => state.markActivityStart);
  const getActivityTimeSpent = useSessionFlowStore(state => state.getActivityTimeSpent);

  // Mark activity start time
  React.useEffect(() => {
    markActivityStart(activity.activity_id);
  }, [activity.activity_id, markActivityStart]);

  const questions: QuizItem[] = React.useMemo(() => {
    const content = typeof activity.content === 'object' ? activity.content : {};
    // Support both "questions" (new backend format) and "items" (legacy)
    if (Array.isArray(content?.questions)) {
      return content.questions;
    }
    if (Array.isArray(content?.items)) {
      return content.items;
    }
    return [];
  }, [activity.content]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSelectAnswer = React.useCallback((option: string) => {
    setSelectedAnswer(option);
  }, []);

  const handleNextQuestion = React.useCallback(() => {
    if (selectedAnswer) {
      setAnswers(prev => ({ ...prev, [currentQuestionIndex]: selectedAnswer }));
      setSelectedAnswer(null);

      if (isLastQuestion) {
        // Calculate score and submit
        const allAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer };
        let correctCount = 0;

        questions.forEach((q, idx) => {
          const userAnswer = allAnswers[idx];

          // New backend format: check if answer matches "correct" field
          if (q.correct && userAnswer) {
            if (userAnswer.trim() === q.correct.trim()) {
              correctCount++;
            }
          }
          // Legacy format: MCQ with correct_choice_index
          else if (q.input === 'mcq' && q.correct_choice_index !== undefined && q.choices) {
            const correctChoice = q.choices[q.correct_choice_index];
            if (userAnswer === correctChoice) {
              correctCount++;
            }
          }
          // Legacy format: short text with answer_key
          else if (q.input === 'short_text' && q.answer_key) {
            if (userAnswer?.toLowerCase().trim() === q.answer_key.toLowerCase().trim()) {
              correctCount++;
            }
          }
        });

        const finalScore = correctCount / totalQuestions;
        setScore(finalScore);

        const timeSpent = getActivityTimeSpent(activity.activity_id);
        const result: SubmitActivityResultReq = {
          completed: true,
          score: finalScore,
          time_spent: timeSpent,
          answer: allAnswers,
        };

        setSubmitted(true);
        onSubmit(result);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  }, [
    selectedAnswer,
    currentQuestionIndex,
    isLastQuestion,
    answers,
    questions,
    totalQuestions,
    getActivityTimeSpent,
    activity.activity_id,
    onSubmit,
  ]);

  const handleNext = React.useCallback(() => {
    setSubmitted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers({});
    setScore(0);
    onNext();
  }, [onNext]);

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-center">
        <p className="text-yellow-600">No quiz questions available</p>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round(score * 100);
    const isPassed = score >= 0.6;

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-sm">
        <div className="mb-6 text-center">
          <div className={`mb-4 text-6xl font-bold ${isPassed ? 'text-green-600' : 'text-yellow-600'}`}>
            {percentage}
            %
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">{isPassed ? 'Tuyệt vời! 🎉' : 'Cố gắng lên! 💪'}</h2>
          <p className="text-gray-600">
            Bạn trả lời đúng
            {' '}
            {Math.round(score * totalQuestions)}
            /
            {totalQuestions}
            {' '}
            câu hỏi
          </p>
        </div>

        <Button onClick={handleNext} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
          Tiếp tục →
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-sm">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>
            Câu hỏi
            {' '}
            {currentQuestionIndex + 1}
            /
            {totalQuestions}
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
            {activity.phase}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="mb-6 text-xl font-bold text-gray-800">
          {currentQuestion?.question || currentQuestion?.prompt}
        </h2>

        {/* Options or Input */}
        {/* Support both new format (options) and legacy format (choices with input === 'mcq') */}
        {(currentQuestion?.options || (currentQuestion?.input === 'mcq' && currentQuestion?.choices))
          ? (
            <div className="space-y-3">
              {(currentQuestion.options || currentQuestion.choices || []).map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isSubmitting}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          )
          : (
            <input
              type="text"
              value={selectedAnswer || ''}
              onChange={e => setSelectedAnswer(e.target.value)}
              placeholder="Nhập câu trả lời..."
              className="w-full rounded-lg border border-gray-300 bg-white p-4 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isSubmitting}
            />
          )}
      </div>

      {/* Actions */}
      <Button
        onClick={handleNextQuestion}
        disabled={!selectedAnswer || isSubmitting}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Đang gửi...' : isLastQuestion ? 'Hoàn thành' : 'Câu tiếp theo'}
      </Button>
    </div>
  );
}
