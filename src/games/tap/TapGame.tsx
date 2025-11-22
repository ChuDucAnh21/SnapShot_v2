// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

'use client';

import type { GameProps } from '../types';
import * as React from 'react';
import { Button } from '@/components/ui/button';

type DragDropGameConfig = {
  game_type: string;
  instructions: string;
  problems: Array<{
    question: string;
    answer: string;
    options: string[]; // Các lựa chọn để kéo thả
  }>;
};

type DragDropGameState = {
  currentProblemIndex: number;
  draggedItem: string | null;
  matchedPairs: Array<{ question: string; answer: string; isMatched: boolean }>;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: number;
  answers: Array<{
    question: string;
    userAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
};

export default function DragDropGame({ config, seed: _seed, onEvent, onComplete }: GameProps) {
  const typedConfig = config as DragDropGameConfig;
  const problems = typedConfig.problems || [];

  const [state, setState] = React.useState<DragDropGameState>({
    currentProblemIndex: 0,
    draggedItem: null,
    matchedPairs: [],
    correctAnswers: 0,
    incorrectAnswers: 0,
    startTime: Date.now(),
    answers: [],
  });

  const currentProblem = problems[state.currentProblemIndex];
  const isLastProblem = state.currentProblemIndex === problems.length - 1;
  const progress = ((state.currentProblemIndex + 1) / problems.length) * 100;

  // Generate answer options for current problem
  const answerOptions = React.useMemo(() => {
    if (!currentProblem) {
      return [];
    }

    const correctAnswer = currentProblem.answer;
    const distractors = generateDistractors(correctAnswer, problems);

    // Shuffle options
    const options = [correctAnswer, ...distractors];
    return shuffleArray(options);
  }, [currentProblem, problems]);

  const handleDragStart = React.useCallback((e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
    setState(prev => ({ ...prev, draggedItem: item }));
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent, targetAnswer: string) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData('text/plain');

    if (!draggedItem || !currentProblem) {
      return;
    }

    const isCorrect = draggedItem === currentProblem.answer;

    setState(prev => ({
      ...prev,
      matchedPairs: [...prev.matchedPairs, {
        question: currentProblem.question,
        answer: targetAnswer,
        isMatched: isCorrect,
      }],
      draggedItem: null,
    }));

    onEvent({
      type: 'answer',
      payload: {
        question: currentProblem.question,
        userAnswer: draggedItem,
        correctAnswer: currentProblem.answer,
        isCorrect,
      },
      ts: Date.now(),
    });
  }, [currentProblem, onEvent]);

  const handleSubmitAnswer = React.useCallback(() => {
    if (!currentProblem) {
      return;
    }

    const lastMatch = state.matchedPairs[state.matchedPairs.length - 1];
    if (!lastMatch) {
      return;
    }

    const isCorrect = lastMatch.isMatched;
    const newAnswers = [...state.answers, {
      question: currentProblem.question,
      userAnswer: lastMatch.answer,
      correctAnswer: currentProblem.answer,
      isCorrect,
    }];

    setState(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
      answers: newAnswers,
    }));

    if (isLastProblem) {
      // Game complete
      const durationMs = Date.now() - state.startTime;
      const score = state.correctAnswers / problems.length;

      onEvent({ type: 'end', payload: { durationMs, score }, ts: Date.now() });
      onComplete({
        score,
        correct: state.correctAnswers,
        incorrect: state.incorrectAnswers,
        durationMs,
        meta: {
          totalProblems: problems.length,
          answers: newAnswers,
        },
      });
    } else {
      // Next problem
      setState(prev => ({
        ...prev,
        currentProblemIndex: prev.currentProblemIndex + 1,
        matchedPairs: [],
        draggedItem: null,
      }));
    }
  }, [state.matchedPairs, state.answers, state.correctAnswers, state.incorrectAnswers, state.startTime, currentProblem, isLastProblem, problems.length, onEvent, onComplete]);

  // Auto-start game
  React.useEffect(() => {
    onEvent({ type: 'start', payload: { problemsCount: problems.length }, ts: Date.now() });
  }, [onEvent, problems.length]);

  if (problems.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-red-500/50 bg-red-500/10">
        <p className="text-red-400">Không có câu hỏi nào trong game này</p>
      </div>
    );
  }

  const hasMatched = state.matchedPairs.length > 0;

  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6 text-white">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">🎯 Ghép Nối Đáp Án</h2>
          <span className="text-sm text-white/70">
            {state.currentProblemIndex + 1}
            /
            {problems.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      {typedConfig.instructions && (
        <div className="mb-4 rounded-lg border border-blue-500/50 bg-blue-500/10 p-3">
          <p className="text-sm text-blue-400">{typedConfig.instructions}</p>
        </div>
      )}

      {/* Question */}
      <div className="mb-6 flex-1">
        <h3 className="mb-6 text-xl font-bold text-center">{currentProblem?.question}</h3>

        {/* Drag and Drop Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Answer Options (Draggable) */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-center mb-4">📝 Kéo đáp án vào đây</h4>
            <div className="min-h-[200px] border-2 border-dashed border-blue-400/50 rounded-lg p-4 bg-blue-500/10">
              {answerOptions.map((option, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={e => handleDragStart(e, option)}
                  className={`mb-2 p-3 rounded-lg cursor-move transition-all duration-200 hover:scale-105 ${
                    state.draggedItem === option
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-center mb-4">🎯 Thả vào đây</h4>
            <div
              className="min-h-[200px] border-2 border-dashed border-green-400/50 rounded-lg p-4 bg-green-500/10 flex items-center justify-center"
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, currentProblem?.answer || '')}
            >
              {hasMatched
                ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {state.matchedPairs[state.matchedPairs.length - 1]?.isMatched ? '✅' : '❌'}
                    </div>
                    <p className="text-lg font-medium">
                      {state.matchedPairs[state.matchedPairs.length - 1]?.answer}
                    </p>
                    <p className="text-sm text-white/70 mt-2">
                      {state.matchedPairs[state.matchedPairs.length - 1]?.isMatched ? 'Đúng rồi!' : 'Sai rồi!'}
                    </p>
                  </div>
                )
                : (
                  <div className="text-center text-white/50">
                    <div className="text-4xl mb-2">🎯</div>
                    <p>Kéo đáp án vào đây</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmitAnswer}
        disabled={!hasMatched}
        className="w-full bg-[#6ac21a] text-white hover:bg-[#5aa017] disabled:opacity-50"
      >
        {isLastProblem ? '🏁 Hoàn thành' : '➡️ Câu tiếp theo'}
      </Button>
    </div>
  );
}

// Helper functions
function generateDistractors(correctAnswer: string, allProblems: Array<{ answer: string }>): string[] {
  const allAnswers = allProblems.map(p => p.answer).filter(a => a !== correctAnswer);
  const uniqueAnswers = [...new Set(allAnswers)];

  // Take up to 3 random distractors
  const shuffled = shuffleArray(uniqueAnswers);
  return shuffled.slice(0, Math.min(3, shuffled.length));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled;
}
