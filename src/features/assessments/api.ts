// Rules applied: style/brace-style:1tbs

import type { AssessmentReq, AssessmentRes, GetSurveyDetailRes, GetSurveysRes } from './types';
import { api, apiWithoutPrefix } from '@/lib/http/axios-client';

export async function getSurveys(locale = 'en', signal?: AbortSignal) {
  const r = await apiWithoutPrefix.get<GetSurveysRes>('/surveys', { params: { locale }, signal });
  return r.data;
}

export async function getSurveyDetail(surveyKey: string, locale = 'en', signal?: AbortSignal) {
  const r = await apiWithoutPrefix.get<GetSurveyDetailRes>(`/surveys/${surveyKey}`, { params: { locale }, signal });
  return r.data;
}

export async function submitAssessment(body: AssessmentReq, signal?: AbortSignal) {
  const r = await api.post<AssessmentRes>('/assessments', body, { signal });
  return r.data;
}
