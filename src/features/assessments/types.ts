// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type SurveyQuestion = {
  question_id: string;
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'text' | 'scale';
  options?: string[];
  metadata?: Record<string, any>;
};

export type Survey = {
  survey_key: string;
  title: string;
  description: string;
  locale: string;
  questions: SurveyQuestion[];
};

export type GetSurveysRes = {
  status: 'success';
  surveys: Array<{
    survey_key: string;
    title: string;
    locale: string;
  }>;
};

export type GetSurveyDetailRes = {
  status: 'success';
  survey: Survey;
};

export type AssessmentReq = {
  learner_id: string;
  parent_survey: {
    interests: string[];
    learning_style: string[];
    strengths: string[];
    weaknesses: string[];
  };
  minigame_results: Array<{
    game_type: 'math' | 'language' | 'logic' | 'creativity';
    metadata: { score: number; time_spent: number };
    detail_results?: any[];
  }>;
};

export type AssessmentRes = {
  status: 'success';
  assessment_id: string;
  ready_for_profile: boolean;
};
