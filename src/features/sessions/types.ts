// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type ActivityPhase = 'warm_up' | 'main' | 'practice' | 'reflection';
export type ActivityType = 'question' | 'game' | 'quiz' | 'video';

export type Activity = {
  activity_id: string;
  phase: ActivityPhase;
  type: ActivityType;
  content: any; // keep wide to allow BE variation
  duration: number; // minutes
};

export type Session = {
  session_id: string;
  learner_id: string;
  node_id: string;
  skill_name: string;
  duration: number; // minutes
  activities: Activity[];
};

export type GenerateSessionReq = {
  learner_id: string;
  node_id: string;
};

export type GenerateSessionRes = {
  status: 'success';
  session_id: string;
  session: Session;
};

export type GetSessionRes = GenerateSessionRes;

export type StartSessionRes = {
  status: 'success';
  session_id: string;
  started_at: string;
};

export type SubmitActivityResultReq = {
  completed: boolean;
  score: number; // 0..1
  time_spent: number; // seconds
  answer?: any;
};

export type SubmitActivityResultRes = {
  status: 'success';
  activity_id: string;
  is_correct?: boolean;
  feedback?: string;
};

export type CompleteSessionReq = {
  overall_feedback?: string;
};

export type CompleteSessionRes = {
  status: 'success';
  session_summary: {
    total_activities: number;
    completed: number;
    average_score: number;
    time_spent: number;
  };
  progress: { node_completed: boolean; next_node_unlocked: boolean; profile_updated: boolean };
  feedback: { strengths_shown: string[]; areas_to_practice: string[]; next_recommendation: string };
};
