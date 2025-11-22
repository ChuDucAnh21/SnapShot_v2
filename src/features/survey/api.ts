import type {
  SubmitSurveyResultPayload,
  SubmitSurveyResultResponse,
  SurveyQuestionRequestPayload,
  SurveyQuestionsResponse,
} from './type';
import { apiWithoutPrefix } from '@/lib/http/axios-client';

export async function getSurveyQuestions(
  payload: SurveyQuestionRequestPayload,
  signal?: AbortSignal,
): Promise<SurveyQuestionsResponse> {
  const r = await apiWithoutPrefix.get<SurveyQuestionsResponse>(
    `/api/surveys/questions?subject_id=${payload.subject_id}`,

    { signal },
  );
  return r.data;
}

export async function submitSurveyResult(
  payload: SubmitSurveyResultPayload,
  signal?: AbortSignal,
): Promise<SubmitSurveyResultResponse> {
  const r = await apiWithoutPrefix.post<SubmitSurveyResultResponse>('/api/surveys/results', payload, {
    signal,
  });
  return r.data;
}

export const SurveyService = {
  getSurveyQuestions,
  submitSurveyResult,
};
