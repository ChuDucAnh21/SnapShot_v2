// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';
import AchievementCard from '@molecules/AchievementCard';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';

// TODO: Define Achievement type properly
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress?: [number, number];
  unlockedAt?: string;
};

export type AchievementsSectionProps = {
  readonly achievements: Achievement[];
  readonly onViewAll?: () => void;
};

/**
 * AchievementsSection — Organism
 * Displays list of achievements with header
 * Composes AchievementCard molecules
 */
export default function AchievementsSection({ achievements, onViewAll }: AchievementsSectionProps) {
  return (
    <section className="mt-6">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Achievements</h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm text-purple-600 transition-colors hover:text-purple-700 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-purple-400/60"
          >
            VIEW ALL
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Achievements List */}
      <div className="grid gap-3">
        {achievements.length > 0
          ? (
            achievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                title={achievement.title}
                icon={achievement.icon}
                progress={achievement.progress || [0, 1]}
              />
            ))
          )
          : (
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-8 text-center text-gray-600 shadow-sm">
              No achievements yet. Keep learning!
            </div>
          )}
      </div>
    </section>
  );
}
