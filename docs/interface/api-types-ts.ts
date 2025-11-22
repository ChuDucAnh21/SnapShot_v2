// ============================================
// Common Types & Enums
// ============================================

type UUID = string;
type ISODateTime = string;
type Email = string;

enum Status {
  SUCCESS = 'success',
  ERROR = 'error',
}

enum ProfileStatus {
  INCOMPLETE = 'incomplete',
  READY = 'ready',
  COMPLETE = 'complete',
}

enum NodeStatus {
  AVAILABLE = 'available',
  LOCKED = 'locked',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

enum GameType {
  MATH = 'math',
  LANGUAGE = 'language',
  LOGIC = 'logic',
  CREATIVITY = 'creativity',
}

enum ActivityPhase {
  WARM_UP = 'warm_up',
  MAIN = 'main',
  PRACTICE = 'practice',
  REFLECTION = 'reflection',
}

enum ActivityType {
  QUESTION = 'question',
  GAME = 'game',
  QUIZ = 'quiz',
  VIDEO = 'video',
}

enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  KINESTHETIC = 'kinesthetic',
}

enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// ============================================
// Base Response Types
// ============================================

type BaseSuccessResponse = {
  status: Status.SUCCESS;
};

type ErrorResponse = {
  status: Status.ERROR;
  error_code: ErrorCode;
  message: string;
  details?: Record<string, any>;
};

type ApiResponse<T> = T | ErrorResponse;

// ============================================
// Authentication Types
// ============================================

// 1.1 Register Account
type RegisterRequest = {
  email: Email;
  password: string; // min 8 chars
  full_name: string;
  child_name: string;
  child_age: number; // 3-12
};

type RegisterResponse = {
  access_token: string;
  user: {
    user_id: UUID;
    email: Email;
    full_name: string;
  };
  learner: {
    learner_id: UUID;
    name: string;
    age: number;
  };
} & BaseSuccessResponse;

// 1.2 Login
type LoginRequest = {
  email: Email;
  password: string;
};

type LoginResponse = {
  access_token: string;
  user: {
    user_id: UUID;
    learner_id: UUID;
  };
} & BaseSuccessResponse;

// 1.3 Get User Info
type GetUserInfoResponse = {
  user: {
    user_id: UUID;
    email: Email;
    full_name: string;
  };
  learner: {
    learner_id: UUID;
    name: string;
    age: number;
    profile_status: ProfileStatus;
  };
} & BaseSuccessResponse;

// ============================================
// Assessment & Profile Types
// ============================================

// 2.1 Submit Assessment Data
type MinigameResult = {
  game_type: GameType;
  metadata: {
    score: number; // 0-100
    time_spent: number; // seconds
  };
  detail_results?: Array<Record<string, any>>; // game-specific data
};

type SubmitAssessmentRequest = {
  learner_id: UUID;
  parent_survey: {
    interests: string[];
    learning_style: string[];
    strengths: string[];
    weaknesses: string[];
  };
  minigame_results: MinigameResult[];
};

// Example detail_results for different game types
type MathDetailResult = {
  question_id: string;
  answer: string;
  correct: boolean;
  time_taken: number;
};

type LanguageDetailResult = {
  word: string;
  matched_correctly: boolean;
  attempts: number;
};

type SubmitAssessmentResponse = {
  assessment_id: UUID;
  ready_for_profile: boolean;
} & BaseSuccessResponse;

// 2.2 Generate Profile
type GenerateProfileRequest = {
  learner_id: UUID;
};

type ProfileData = {
  learner_id: UUID;
  abilities: {
    math: number; // 1-10
    language: number; // 1-10
    creativity: number; // 1-10
    logic: number; // 1-10
  };
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  learning_style: LearningStyle;
};

type GenerateProfileResponse = {
  profile: ProfileData;
} & BaseSuccessResponse;

// 2.3 Get Profile (same response as Generate Profile)
type GetProfileResponse = GenerateProfileResponse;

// ============================================
// Learning Path Types
// ============================================

// 3.1 Get Available Subjects
type Subject = {
  subject_id: UUID;
  name: string;
  code: string; // for frontend icon mapping
};

type GetSubjectsResponse = {
  subjects: Subject[];
} & BaseSuccessResponse;

// 3.2 Generate Learning Path
type GenerateLearningPathRequest = {
  learner_id: UUID;
  subject_id: UUID;
};

type PathNode = {
  node_id: UUID;
  skill_name: string;
  order: number;
  status: NodeStatus;
  dependencies: UUID[]; // node_ids
  estimated_sessions: number;
};

type LearningPathData = {
  learner_id: UUID;
  subject: string;
  total_nodes: number;
  nodes: PathNode[];
};

type GenerateLearningPathResponse = {
  path_id: UUID;
  path: LearningPathData;
} & BaseSuccessResponse;

// 3.3 Get Learning Path (same response as Generate Learning Path)
type GetLearningPathResponse = GenerateLearningPathResponse;

// ============================================
// Session Types
// ============================================

// Activity Content Types
type QuestionContent = {
  content: string; // question text
};

type GameContent = {
  content: {
    game_type: 'drag_drop' | 'matching' | 'puzzle';
    problems: Array<Record<string, any>>;
  };
};

type QuizContent = {
  content: {
    questions: Array<{
      question: string;
      options: string[];
      correct: string;
    }>;
  };
};

type VideoContent = {
  content: {
    video_url: string;
    duration: number;
  };
};

type ActivityContent = QuestionContent | GameContent | QuizContent | VideoContent;

type Activity = {
  activity_id: UUID;
  phase: ActivityPhase;
  type: ActivityType;
  content: any; // varies by type
  duration: number; // minutes
};

// 4.1 Generate Session
type GenerateSessionRequest = {
  learner_id: UUID;
  node_id: UUID;
};

type SessionData = {
  session_id: UUID;
  learner_id: UUID;
  node_id: UUID;
  skill_name: string;
  duration: number; // minutes
  activities: Activity[];
};

type GenerateSessionResponse = {
  session_id: UUID;
  session: SessionData;
} & BaseSuccessResponse;

// 4.2 Get Session (same response as Generate Session)
type GetSessionResponse = GenerateSessionResponse;

// 4.3 Start Session
type StartSessionResponse = {
  session_id: UUID;
  started_at: ISODateTime;
} & BaseSuccessResponse;

// 4.4 Submit Activity Result
type SubmitActivityResultRequest = {
  completed: boolean;
  score: number; // 0-1
  time_spent: number; // seconds
  answer?: string | Record<string, any>; // varies by activity type
};

type SubmitActivityResultResponse = {
  activity_id: UUID;
  is_correct: boolean;
  feedback: string;
} & BaseSuccessResponse;

// 4.5 Complete Session
type CompleteSessionRequest = {
  overall_feedback?: string;
};

type CompleteSessionResponse = {
  session_summary: {
    total_activities: number;
    completed: number;
    average_score: number; // 0-1
    time_spent: number; // minutes
  };
  progress: {
    node_completed: boolean;
    next_node_unlocked: boolean;
    profile_updated: boolean;
  };
  feedback: {
    strengths_shown: string[];
    areas_to_practice: string[];
    next_recommendation: string;
  };
} & BaseSuccessResponse;

// 4.6 Get Dashboard Summary
type DashboardResponse = {
  dashboard: {
    learner: {
      name: string;
      age: number;
    };
    stats: {
      total_sessions: number;
      total_hours: number;
      current_streak: number;
      skills_mastered: number;
    };
    current_paths: Array<{
      subject: string;
      progress: number; // 0-1
      next_session_available: boolean;
    }>;
    recent_sessions: Array<{
      session_id: UUID;
      skill_name: string;
      completed_at: ISODateTime;
      score: number; // 0-1
    }>;
  };
} & BaseSuccessResponse;

// ============================================
// API Client Interface
// ============================================

type ApiClient = {
  // Authentication
  register: (data: RegisterRequest) => Promise<ApiResponse<RegisterResponse>>;
  login: (data: LoginRequest) => Promise<ApiResponse<LoginResponse>>;
  getUserInfo: () => Promise<ApiResponse<GetUserInfoResponse>>;

  // Assessment & Profile
  submitAssessment: (data: SubmitAssessmentRequest) => Promise<ApiResponse<SubmitAssessmentResponse>>;
  generateProfile: (data: GenerateProfileRequest) => Promise<ApiResponse<GenerateProfileResponse>>;
  getProfile: (learnerId: UUID) => Promise<ApiResponse<GetProfileResponse>>;

  // Learning Path
  getSubjects: () => Promise<ApiResponse<GetSubjectsResponse>>;
  generateLearningPath: (data: GenerateLearningPathRequest) => Promise<ApiResponse<GenerateLearningPathResponse>>;
  getLearningPath: (learnerId: UUID, subjectId: UUID) => Promise<ApiResponse<GetLearningPathResponse>>;

  // Sessions
  generateSession: (data: GenerateSessionRequest) => Promise<ApiResponse<GenerateSessionResponse>>;
  getSession: (sessionId: UUID) => Promise<ApiResponse<GetSessionResponse>>;
  startSession: (sessionId: UUID) => Promise<ApiResponse<StartSessionResponse>>;
  submitActivityResult: (
    sessionId: UUID,
    activityId: UUID,
    data: SubmitActivityResultRequest,
  ) => Promise<ApiResponse<SubmitActivityResultResponse>>;
  completeSession: (sessionId: UUID, data: CompleteSessionRequest) => Promise<ApiResponse<CompleteSessionResponse>>;
  getDashboard: (learnerId: UUID) => Promise<ApiResponse<DashboardResponse>>;
};

// ============================================
// Rate Limit Headers
// ============================================

type RateLimitHeaders = {
  'X-RateLimit-Limit': number;
  'X-RateLimit-Remaining': number;
  'X-RateLimit-Reset': number; // Unix timestamp
};

// ============================================
// Subject Icon Mapping (for frontend)
// ============================================

const SUBJECT_ICONS: Record<string, string> = {
  math: '🔢',
  vietnamese: '📖',
  english: '🔤',
  science: '🔬',
};

// ============================================
// Export all types
// ============================================

export type {
  // Sessions
  Activity,
  ActivityContent,
  // Client
  ApiClient,
  ApiResponse,
  BaseSuccessResponse,
  CompleteSessionRequest,
  CompleteSessionResponse,
  DashboardResponse,
  Email,
  ErrorResponse,
  GameContent,
  GenerateLearningPathRequest,
  GenerateLearningPathResponse,
  GenerateProfileRequest,
  GenerateProfileResponse,
  GenerateSessionRequest,
  GenerateSessionResponse,
  GetLearningPathResponse,
  GetProfileResponse,
  GetSessionResponse,
  GetSubjectsResponse,
  GetUserInfoResponse,
  ISODateTime,
  LanguageDetailResult,
  LearningPathData,
  LoginRequest,
  LoginResponse,
  // Detail Results
  MathDetailResult,
  // Assessment & Profile
  MinigameResult,
  PathNode,
  ProfileData,
  QuestionContent,
  QuizContent,
  RateLimitHeaders,
  // Authentication
  RegisterRequest,
  RegisterResponse,
  SessionData,
  StartSessionResponse,
  // Learning Path
  Subject,
  SubmitActivityResultRequest,
  SubmitActivityResultResponse,
  SubmitAssessmentRequest,
  SubmitAssessmentResponse,

  // Common
  UUID,
  VideoContent,
};

export {
  ActivityPhase,
  ActivityType,
  ErrorCode,
  GameType,
  LearningStyle,
  NodeStatus,
  ProfileStatus,
  Status,
  SUBJECT_ICONS,
};
