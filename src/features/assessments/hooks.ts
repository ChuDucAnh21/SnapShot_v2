// Rules applied: style/brace-style:1tbs
'use client';

import type { AssessmentReq } from './types';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as AssessmentsApi from './api';

export function useSurveys(locale = 'en', enabled = true) {
  return useQuery({
    queryKey: ['surveys', locale],
    queryFn: ({ signal }) => AssessmentsApi.getSurveys(locale, signal),
    enabled,
    staleTime: 300_000,
  });
}
//enabled : dùng để bât/tắt việc thực thi query 
// signal : dùng để hủy bỏ request khi component unmount hoặc khi query bị vô hiệu hóa
export function useSurveyDetail(surveyKey: string, locale = 'en', enabled = true) {
  return useQuery({
    queryKey: ['surveys', surveyKey, locale],
    queryFn: ({ signal }) => AssessmentsApi.getSurveyDetail(surveyKey, locale, signal),
    enabled,
    staleTime: 300_000,
  })
}

export function useSubmitAssessment() {
  return useMutation({
    mutationFn: (body: AssessmentReq) => AssessmentsApi.submitAssessment(body),
  });
}
