// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import type { Activity, SubmitActivityResultReq } from '@/features/sessions/types';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useSessionFlowStore } from '@/stores/session-flow-store';

type ActivityQuestionProps = {
  readonly activity: Activity;
  readonly onSubmit: (result: SubmitActivityResultReq) => void;
  readonly onNext: () => void;
  readonly isSubmitting: boolean;
};

export default function ActivityQuestion({ activity, onSubmit, onNext, isSubmitting }: ActivityQuestionProps) {
  const [answer, setAnswer] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const markActivityStart = useSessionFlowStore(state => state.markActivityStart);
  const getActivityTimeSpent = useSessionFlowStore(state => state.getActivityTimeSpent);

  // Mark activity start time
  React.useEffect(() => {
    markActivityStart(activity.activity_id);
  }, [activity.activity_id, markActivityStart]);

  const handleSubmit = React.useCallback(() => {
    const timeSpent = getActivityTimeSpent(activity.activity_id);
    const content = typeof activity.content === 'string'
      ? { text: activity.content }
      : (activity.content || {});

    // Check if it's MCQ with correct_choice_id
    let isCorrect = false;
    let finalScore = 0;

    if (content.correct_choice_id && answer) {
      isCorrect = answer === content.correct_choice_id;
      finalScore = isCorrect ? 1 : 0;
      setFeedback(isCorrect ? '✓ Đúng rồi!' : content.rationale || 'Thử lại nhé!');
    } else {
      // Free text answer - always give full score for open-ended questions
      const hasAnswer = answer.trim().length > 0;
      finalScore = hasAnswer ? 1 : 0;
      if (hasAnswer) {
        setFeedback('✓ Cảm ơn câu trả lời của bạn!');
      }
    }

    const result: SubmitActivityResultReq = {
      completed: true,
      score: finalScore,
      time_spent: timeSpent,
      answer: answer.trim(),
    };

    setSubmitted(true);
    onSubmit(result);
  }, [answer, activity.activity_id, activity.content, getActivityTimeSpent, onSubmit]);

  const handleNext = React.useCallback(() => {
    setFeedback(null);
    setSubmitted(false);
    setAnswer('');
    onNext();
  }, [onNext]);

  // Handle both string and object content types
  const content = typeof activity.content === 'string'
    ? { text: activity.content }
    : (activity.content || {});

  const questionText = content.text || content.prompt || content.question || 'No question provided';
  const choices = content.choices || [];
  const inputType = content.input || (choices.length > 0 ? 'mcq' : 'free_text');

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-sm">
      {/* Phase Badge */}
      <div className="mb-4">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-600">
          {activity.phase}
        </span>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold text-gray-800">{questionText}</h2>
        <p className="text-sm text-gray-600">
          Thời gian:
          {activity.duration}
          {' '}
          phút
        </p>
      </div>

      {/* Answer Input */}
      {!submitted && (
        <div className="mb-6">
          {inputType === 'mcq' && choices.length > 0
            ? (
              <div className="space-y-3">
                {choices.map((choice: any) => {
                  const choiceId = choice.id || choice;
                  const choiceLabel = choice.label || choice;
                  return (
                    <button
                      key={choiceId}
                      type="button"
                      onClick={() => setAnswer(choiceId)}
                      disabled={isSubmitting}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                        answer === choiceId
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-gray-50'
                      } disabled:opacity-50`}
                    >
                      <span className="font-medium">{choiceLabel}</span>
                    </button>
                  );
                })}
              </div>
            )
            : (
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                className="w-full rounded-lg border border-gray-300 bg-white p-4 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                rows={4}
                disabled={isSubmitting}
              />
            )}
        </div>
      )}

      {/* Feedback */}
      {submitted && feedback && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">{feedback}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted
          ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !answer || (typeof answer === 'string' && answer.trim().length === 0)}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi câu trả lời'}
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
