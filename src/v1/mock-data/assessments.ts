// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type { AssessmentReq, AssessmentRes, GetSurveyDetailRes, GetSurveysRes } from '@/features/assessments/types';

// Mock surveys data
const mockSurveys = {
  'parent-survey-v1': {
    survey_key: 'parent-survey-v1',
    title: 'Parent Survey',
    description: 'Help us understand your child better',
    locale: 'en',
    questions: [
      {
        question_id: 'q1',
        question_text: 'What are your child\'s main interests?',
        question_type: 'multiple_choice' as const,
        options: ['Math', 'Reading', 'Science', 'Art', 'Music', 'Sports'],
      },
      {
        question_id: 'q2',
        question_text: 'How does your child learn best?',
        question_type: 'multiple_choice' as const,
        options: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'],
      },
      {
        question_id: 'q3',
        question_text: 'What are your child\'s strengths?',
        question_type: 'text' as const,
      },
      {
        question_id: 'q4',
        question_text: 'What areas would you like to improve?',
        question_type: 'text' as const,
      },
    ],
  },
};

// Mock assessments data
const mockAssessments = new Map<string, any>();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAssessmentsData = {
  async getSurveys(locale = 'en'): Promise<GetSurveysRes> {
    await delay(500);
    // Filter surveys by locale if needed, or return all
    return {
      status: 'success',
      surveys: Object.values(mockSurveys)
        .filter(s => !locale || s.locale === locale)
        .map(s => ({
          survey_key: s.survey_key,
          title: s.title,
          locale: s.locale,
        })),
    };
  },

  async getSurveyDetail(surveyKey: string, locale = 'en'): Promise<GetSurveyDetailRes> {
    await delay(500);
    const survey = mockSurveys[surveyKey as keyof typeof mockSurveys];
    if (!survey) {
      throw new Error(`Survey not found: ${surveyKey}`);
    }
    return {
      status: 'success',
      survey: { ...survey, locale },
    };
  },

  async submitAssessment(data: AssessmentReq): Promise<AssessmentRes> {
    await delay(2000);

    const assessment = {
      learner_id: data.learner_id,
      parent_survey: data.parent_survey,
      minigame_results: data.minigame_results,
      assessment_id: `assessment-${data.learner_id}-${Date.now()}`,
      submitted_at: new Date().toISOString(),
      status: 'completed',
      analysis: {
        learning_style: 'visual',
        attention_span: 'moderate',
        preferred_difficulty: 'beginner',
        interests: ['math', 'art'],
        strengths: ['pattern_recognition', 'creativity'],
        areas_for_improvement: ['focus', 'patience'],
        recommended_approach: 'game-based learning with visual aids',
      },
    };

    mockAssessments.set(data.learner_id, assessment);

    return {
      status: 'success',
      assessment_id: assessment.assessment_id,
      ready_for_profile: true,
    };
  },
};
