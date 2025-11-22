// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type { DashboardRes } from '@/features/dashboard/types';

// Mock dashboard data
const mockDashboards = new Map<string, any>();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDashboardData = {
  async getDashboard(learnerId: string): Promise<DashboardRes> {
    await delay(600);

    // Check if we already have dashboard data for this learner
    let dashboard = mockDashboards.get(learnerId);

    if (!dashboard) {
      // Generate initial dashboard data
      dashboard = {
        learner_id: learnerId,
        stats: {
          current_streak: 3,
          longest_streak: 7,
          total_lessons_completed: 12,
          total_time_spent: 1800, // 30 minutes
          average_score: 0.82,
          level: 'beginner',
          xp_earned: 450,
        },
        recent_activity: [
          {
            activity_id: 'activity-001',
            title: 'Number Recognition',
            subject: 'math',
            completed_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            score: 0.9,
            time_spent: 120,
          },
          {
            activity_id: 'activity-002',
            title: 'Counting Practice',
            subject: 'math',
            completed_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            score: 0.75,
            time_spent: 180,
          },
        ],
        achievements: [
          {
            achievement_id: 'first-lesson',
            title: 'First Steps',
            description: 'Completed your first lesson',
            icon: '🌟',
            unlocked_at: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
          },
          {
            achievement_id: 'streak-3',
            title: 'On a Roll',
            description: 'Completed 3 lessons in a row',
            icon: '🔥',
            unlocked_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
        ],
        recommended_next: [
          {
            node_id: 'node-003',
            title: 'Basic Addition',
            subject: 'math',
            difficulty: 'intermediate',
            estimated_duration: 25,
          },
          {
            node_id: 'node-004',
            title: 'Letter Recognition',
            subject: 'reading',
            difficulty: 'beginner',
            estimated_duration: 20,
          },
        ],
        weekly_progress: {
          monday: { lessons: 1, time: 300 },
          tuesday: { lessons: 2, time: 450 },
          wednesday: { lessons: 0, time: 0 },
          thursday: { lessons: 1, time: 180 },
          friday: { lessons: 1, time: 270 },
          saturday: { lessons: 0, time: 0 },
          sunday: { lessons: 1, time: 150 },
        },
      };

      mockDashboards.set(learnerId, dashboard);
    }

    return {
      status: 'success',
      dashboard,
    };
  },
};
