// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
import Image from 'next/image';
import * as React from 'react';
import { cn } from '@/utils/cn';

export type AchievementCardProps = {
  readonly title: string;
  readonly icon: string;
  readonly progress: [number, number];
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * AchievementCard — Molecule
 * Displays achievement thumbnail, title, and progress
 * Composition of Image + Text elements
 */
export default function AchievementCard({ title, icon, progress, className, ...rest }: AchievementCardProps) {
  const [current, total] = progress;
  const isCompleted = current >= total;

  return (
    <article
      className={cn(
        'grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-gray-50',
        className,
      )}
      {...rest}
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={icon}
          alt={title}
          width={64}
          height={64}
          className="object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="font-medium text-gray-800">{title}</div>
      <div className={cn('text-sm', isCompleted ? 'text-green-600' : 'text-gray-600')}>
        {current}
        {' '}
        /
        {total}
      </div>
    </article>
  );
}
