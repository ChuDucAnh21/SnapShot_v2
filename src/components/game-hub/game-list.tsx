/**
 * GameList - Display grid of available games
 */

'use client';

import type { GameManifest } from '@/lib/game-hub/protocol';
import { Clock, Play, Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

type GameListProps = {
  games: GameManifest[];
  onLaunch: (game: GameManifest) => void;
  className?: string;
};

export function GameList({ games, onLaunch, className }: GameListProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có game nào khả dụng</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
      {games.map(game => (
        <GameCard key={game.id} game={game} onLaunch={onLaunch} />
      ))}
    </div>
  );
}

type GameCardProps = {
  game: GameManifest;
  onLaunch: (game: GameManifest) => void;
};

function GameCard({ game, onLaunch }: GameCardProps) {
  const getDifficultyColor = (metadata?: Record<string, any>) => {
    const difficulty = metadata?.difficulty;
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'normal':
        return 'text-blue-600 bg-blue-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Badge: renders a small badge with icon and text
  const Badge = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span
      className={cn(
        'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-white/60 backdrop-blur border-gray-200',
        className,
      )}
    >
      {children}
    </span>
  );

  return (
    <div
      tabIndex={game.disabled ? -1 : 0}
      aria-disabled={game.disabled}
      onClick={() => {
        if (!game.disabled) {
          onLaunch(game);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !game.disabled) {
          onLaunch(game);
        }
      }}
      className={cn(
        // Responsive min width to fit 7-8/card per row (168px-180px)
        'bg-white rounded-lg transition-all duration-300 overflow-hidden group flex flex-col items-center cursor-pointer select-none outline-none',
        'p-3 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 active:scale-95',
        'focus-visible:ring-2 focus-visible:ring-pink-400',
        game.disabled && 'opacity-50 pointer-events-none grayscale cursor-not-allowed',
      )}
      style={{
        minWidth: 0,
      }}
    >
      {/* Top - Badges as a row around card, but visually above image */}
      <div className="flex flex-wrap gap-1 mb-2 w-full justify-center">
        {/* Difficulty */}
        {game.metadata?.difficulty && (
          <Badge className={getDifficultyColor(game.metadata)}>
            {game.metadata.difficulty}
          </Badge>
        )}
        {/* Estimated Time */}
        {game.metadata?.estimatedTime && (
          <Badge>
            <Clock className="h-3 w-3" />
            <span>
              {game.metadata.estimatedTime}
              {' '}
              phút
            </span>
          </Badge>
        )}
        {/* Version */}
        <Badge>
          <Star className="h-3 w-3" />
          <span>
            v
            {game.version}
          </span>
        </Badge>
        {/* Runtime */}
        <Badge>
          {game.runtime === 'iframe-html' ? 'iFrame' : 'ESM'}
        </Badge>
      </div>
      {/* Thumbnail */}
      <div className="flex items-center justify-center min-w-0 w-full">
        <div className={cn(
          'relative',
          'w-[110px] h-[110px]', // Square, fixed so many fit per row
          'rounded-md',
          'overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex-shrink-0',
        )}
        >
          {game.thumbnailUrl || game.iconUrl
            ? (
              <Image
                src={game.thumbnailUrl || game.iconUrl || ''}
                alt={game.title}
                fill
                className={cn(
                  'object-cover rounded-md transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
                  'group-hover:scale-[1.10] group-active:scale-105',
                )}
                sizes="110px"
              />
            )
            : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200">
                <Play className="h-10 w-10 text-white/50" />
              </div>
            )}
          {/* Overlay for disabled */}
          {game.disabled && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs text-gray-500 font-semibold">Không khả dụng</span>
            </div>
          )}
        </div>
      </div>
      {/* Content: Title + Desc */}
      <div className="flex flex-col flex-1 w-full pt-2">
        {/* Game Title */}
        <h3
          className={cn(
            'text-base font-semibold text-gray-900 text-center truncate',
            'mb-0.5',
          )}
          title={game.title}
        >
          {game.title}
        </h3>
        {/* Description */}
        {game.description && (
          <p className="text-xs text-gray-500 text-center line-clamp-2 mb-0.5 leading-tight" title={game.description}>
            {game.description}
          </p>
        )}
      </div>
    </div>
  );
}
