// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import StatCard from '@atoms/StatCard';
import { Flame, Shield, Star, Trophy } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/utils/cn';

export type StatsGridProps = {
  readonly streak: number;
  readonly totalXP: number;
  readonly currentLeague: string;
  readonly top3Finishes: number;
};

/**
 * StatsGrid — Organism
 * Displays 2x2 grid of user statistics
 * Composes StatCard atoms with specific data
 */
export default function StatsGrid({ streak, totalXP, currentLeague, top3Finishes }: StatsGridProps) {
  return (
    <section className={cn('grid grid-cols-1 gap-4 md:grid-cols-2')}>
      <StatCard icon={Flame} title="Day streak" value={streak} iconColor="text-orange-500" isEmpty={streak === 0} />
      <StatCard icon={Star} title="Total XP" value={totalXP} iconColor="text-purple-500" isEmpty={totalXP === 0} />
      <StatCard
        icon={Shield}
        title="Current league"
        value={currentLeague}
        iconColor={currentLeague === 'None' ? 'text-gray-400' : 'text-blue-500'}
        isEmpty={currentLeague === 'None'}
      />
      <StatCard
        icon={Trophy}
        title="Top 3 finishes"
        value={top3Finishes}
        iconColor="text-pink-500"
        isEmpty={top3Finishes === 0}
      />
    </section>
  );
}
