/**
 * GameStats - Display user statistics
 * Compact horizontal layout with session countdown timer
 */

'use client';

import { Clock, Play, Timer, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

export type GameStatsData = {
  totalGamesPlayed: number;
  totalScore: number;
  totalTimeSpent: number; // in seconds
  sessionExpiry?: number; // timestamp for countdown
};

type GameStatsProps = {
  stats: GameStatsData | null;
  className?: string;
};

export function GameStats({ stats, className }: GameStatsProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!stats?.sessionExpiry) {
      setTimeRemaining('24h');
      return;
    }

    const updateTimer = () => {
      const remaining = stats.sessionExpiry! - Date.now();
      if (remaining <= 0) {
        setTimeRemaining('Hết hạn');
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [stats?.sessionExpiry]);

  if (!stats) {
    return null;
  }

  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200', className)}>
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        {/* Mobile: 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {/* Session Timer */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium truncate">Phiên chơi</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {timeRemaining || '24h'}
              </p>
            </div>
          </div>

          {/* Games Played */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 flex-shrink-0">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium truncate">Lượt chơi</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {stats.totalGamesPlayed}
              </p>
            </div>
          </div>

          {/* Total Score */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-50 flex-shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium truncate">Tổng điểm</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {stats.totalScore.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Time Spent */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex-shrink-0">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium truncate">Thời gian</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {Math.floor(stats.totalTimeSpent / 60)}
                m
              </p>
            </div>
          </div>
        </div>

        {/* Tablet & Desktop: Horizontal Layout */}
        <div className="hidden sm:flex items-center justify-between gap-3 md:gap-6">
          {/* Session Timer */}
          <div className="flex items-center gap-2 md:gap-3 text-sm flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">Phiên chơi</p>
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {timeRemaining || '24h'}
              </p>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

          {/* Games Played */}
          <div className="flex items-center gap-2 md:gap-3 text-sm flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 flex-shrink-0">
              <Play className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">Lượt chơi</p>
              <p className="text-sm font-semibold text-gray-900">{stats.totalGamesPlayed}</p>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

          {/* Total Score */}
          <div className="flex items-center gap-2 md:gap-3 text-sm flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 flex-shrink-0">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">Tổng điểm</p>
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {stats.totalScore.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

          {/* Time Spent */}
          <div className="flex items-center gap-2 md:gap-3 text-sm flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 flex-shrink-0">
              <Timer className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">Thời gian</p>
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {Math.floor(stats.totalTimeSpent / 60)}
                m
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
