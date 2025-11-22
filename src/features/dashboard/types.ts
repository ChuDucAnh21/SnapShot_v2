// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type DashboardRes = {
  status: 'success';
  dashboard: {
    learner: { name: string; age: number };
    stats: {
      total_sessions: number;
      total_hours: number;
      current_streak: number;
      skills_mastered: number;
      total_xp: number;
      total_lessons_completed: number;
      total_time_spent: number;
      average_score: number;
      level: string;
      xp_earned: number;
      recent_activity: Array<{
        activity_id: string;
        title: string;
        subject: string;
        completed_at: string;
        score: number;
        time_spent: number;
      }>;
      achievements: Array<{
        achievement_id: string;
        title: string;
        description: string;
        icon: string;
        unlocked_at: string;
      }>;
      sessions_completed: number;
    };
    current_paths: Array<{ subject: string; progress: number; next_session_available: boolean }>;
    recent_sessions: Array<{
      session_id: string;
      skill_name: string;
      completed_at: string;
      score: number;
    }>;
  };
};
