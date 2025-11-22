export type SurveyQuestionOption = {
  value: string;
  label: string;
  [key: string]: unknown;
};

export type SurveyQuestion = {
  question_id: string;
  text: string;
  required: boolean;
  type: string;
  options: SurveyQuestionOption[];
  [key: string]: unknown;
};

export type SurveyQuestionAxis = {
  axis_code: string;
  axis_name: string;
  questions: SurveyQuestion[];
  [key: string]: unknown;
};

export type SurveyMetadata = {
  id: string;
  title: string;
  locale?: string;
  [key: string]: unknown;
};

export type SurveyQuestionsResponse = {
  code: string;
  data: SurveyQuestionAxis[];
  message?: string;
  status_code?: number;
  survey_metadata: SurveyMetadata;
  user_tip?: string;
  [key: string]: unknown;
};

export type SurveyQuestionRequestPayload = {
  subject_id: string;
};

export type SurveyResultQuestion = {
  answers: string[];
} & SurveyQuestion;

export type SurveyResultAxis = {
  axis_code: string;
  axis_name: string;
  questions: SurveyResultQuestion[];
};

export type SubmitSurveyResultPayload = {
  child_id: string;
  locale: string;
  segment: string;
  subject_id: string;
  survey_id: string;
  survey_result: SurveyResultAxis[];
};

export type SubmitSurveyResultResponse = {
  submission_id: string;
  message?: string;
  [key: string]: unknown;
};
