// Rules applied: style/brace-style:1tbs

export const QK = {
  me: ['auth', 'me'] as const,
  subjects: ['subjects', 'all'] as const,
  profile: (learnerId: string) => ['profiles', learnerId] as const,
  path: (learnerId: string, subjectId: string) => ['paths', learnerId, subjectId] as const,
  session: (sessionId: string) => ['sessions', sessionId] as const,
  dashboard: (learnerId: string) => ['dashboard', learnerId] as const,
  progressSummary: (learnerId: string) => ['progress-summary', learnerId] as const,
  children: (parentId: string) => ['children', parentId] as const,
  subjectsV2: ['subjects-v2'] as const,
  subjectOverview: (subjectId: string) => ['subject-overview', subjectId] as const,
  surveyQuestions: (subjectId: string) => ['survey-questions', subjectId] as const,
  snapshots: (subjectId: string) => ['snapshots', subjectId] as const,
};
