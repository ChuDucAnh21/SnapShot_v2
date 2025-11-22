// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs
'use client';

import type { Activity, SubmitActivityResultReq } from '@/features/sessions/types';
import type { GameEvent, GameResult } from '@/games/types';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { get as getGame } from '@/games/manager';
import { useSessionFlowStore } from '@/stores/session-flow-store';

type ActivityGameProps = {
  readonly activity: Activity;
  readonly onSubmit: (result: SubmitActivityResultReq) => void;
  readonly onNext: () => void;
  readonly isSubmitting: boolean;
};

export default function ActivityGame({ activity, onSubmit, onNext, isSubmitting }: ActivityGameProps) {
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameCompleted, setGameCompleted] = React.useState(false);
  const [gameResult, setGameResult] = React.useState<GameResult | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const markActivityStart = useSessionFlowStore(state => state.markActivityStart);
  const getActivityTimeSpent = useSessionFlowStore(state => state.getActivityTimeSpent);

  // Mark activity start time
  React.useEffect(() => {
    markActivityStart(activity.activity_id);
  }, [activity.activity_id, markActivityStart]);

  // Extract game type from content
  const gameContent = typeof activity.content === 'object' ? activity.content : {};
  const gameName = gameContent.game_type || gameContent.name || 'tap';
  const gameSpec = getGame(gameName);
  const GameComponent = gameSpec?.component;
  const gameInstructions = gameContent.instructions || '';
  const gameProblems = gameContent.problems || [];

  const handleStartGame = React.useCallback(() => {
    setGameStarted(true);
  }, []);

  const handleGameEvent = React.useCallback((event: GameEvent) => {
    console.warn('[ActivityGame] Game event:', event);
  }, []);

  const handleGameComplete = React.useCallback((result: GameResult) => {
    console.warn('[ActivityGame] Game complete:', result);
    setGameCompleted(true);
    setGameResult(result);
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (!gameResult) {
      return;
    }

    const timeSpent = getActivityTimeSpent(activity.activity_id);

    const result: SubmitActivityResultReq = {
      completed: true,
      score: gameResult.score,
      time_spent: timeSpent,
      answer: {
        gameName,
        score: gameResult.score,
        correct: gameResult.correct,
        incorrect: gameResult.incorrect,
        durationMs: gameResult.durationMs,
      },
    };

    setSubmitted(true);
    onSubmit(result);
  }, [activity.activity_id, getActivityTimeSpent, gameResult, gameName, onSubmit]);

  const handleNext = React.useCallback(() => {
    setGameStarted(false);
    setGameCompleted(false);
    setGameResult(null);
    setSubmitted(false);
    onNext();
  }, [onNext]);

  // Game not found - allow skipping with default score
  if (!GameComponent) {
    return (
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-center">
        <div className="mb-4 text-4xl">⚠️</div>
        <p className="mb-2 text-lg font-semibold text-yellow-600">Game không tìm thấy</p>
        <p className="mb-4 text-sm text-yellow-600">
          Game type:
          {gameName}
        </p>
        {gameInstructions && <p className="mb-4 text-sm text-gray-600">{gameInstructions}</p>}
        <Button
          onClick={() => {
            // Submit a default passing score to allow progression
            const timeSpent = getActivityTimeSpent(activity.activity_id);
            onSubmit({
              completed: true,
              score: 0.7,
              time_spent: timeSpent,
              answer: { gameName, skipped: true },
            });
            setSubmitted(true);
          }}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Bỏ qua activity này →
        </Button>
      </div>
    );
  }

  if (submitted) {
    const percentage = gameResult ? Math.round(gameResult.score * 100) : 0;
    const isPassed = gameResult && gameResult.score >= 0.6;

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-sm">
        <div className="mb-6 text-center">
          <div className={`mb-4 text-6xl font-bold ${isPassed ? 'text-green-600' : 'text-yellow-600'}`}>
            {percentage}
            %
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">{isPassed ? 'Hoàn thành! 🎮' : 'Cố gắng lên! 💪'}</h2>
          <p className="text-gray-600">
            Đúng:
            {' '}
            {gameResult?.correct || 0}
            {' '}
            / Sai:
            {' '}
            {gameResult?.incorrect || 0}
          </p>
        </div>

        <Button onClick={handleNext} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
          Tiếp tục →
        </Button>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-sm">
        {/* Phase Badge */}
        <div className="mb-4">
          <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold uppercase text-pink-600">
            {activity.phase}
          </span>
        </div>

        {/* Game Info */}
        <div className="mb-6 text-center">
          <div className="mb-4 text-6xl">🎮</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">{gameSpec?.title || 'Mini Game'}</h2>

          {/* Show backend instructions if available */}
          {gameInstructions && (
            <p className="mb-2 text-lg text-gray-700">{gameInstructions}</p>
          )}

          <p className="text-sm text-gray-600">{gameSpec?.description || `Game type: ${gameName}`}</p>

          {/* Show problem count if available */}
          {gameProblems.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {gameProblems.length}
              {' '}
              câu hỏi
            </p>
          )}

          <p className="mt-2 text-sm text-gray-500">
            Thời gian:
            {' '}
            {activity.duration}
            {' '}
            phút
          </p>
        </div>

        <Button onClick={handleStartGame} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
          Bắt đầu chơi
        </Button>
      </div>
    );
  }

  if (gameStarted && !gameCompleted) {
    // Pass the full content object to the game component
    const gameConfig = typeof activity.content === 'object' ? activity.content : {};

    return (
      <div className="rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-sm">
        <GameComponent
          config={gameConfig}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-sm">
      {/* Game Complete */}
      <div className="mb-6 text-center">
        <div className="mb-4 text-6xl">✨</div>
        <h2 className="mb-2 text-xl font-bold text-gray-800">Game hoàn thành!</h2>
        <p className="text-gray-600">
          Điểm số:
          {gameResult ? Math.round(gameResult.score * 100) : 0}
          %
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi kết quả'}
      </Button>
    </div>
  );
}
