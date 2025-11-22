'use client';

import type {
  SubmitSurveyResultPayload,
  SubmitSurveyResultResponse,
  SurveyQuestionRequestPayload,
  SurveyQuestionsResponse,
} from './type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as SurveyApi from './api';

export function useSurveyQuestions(payload: SurveyQuestionRequestPayload, enabled = Boolean(payload.subject_id)) {
  return useQuery<SurveyQuestionsResponse>({
    queryKey: QK.surveyQuestions(payload.subject_id),
    queryFn: ({ signal }) => SurveyApi.getSurveyQuestions(payload, signal),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useSubmitSurveyResult() {
  const queryClient = useQueryClient();

  return useMutation<SubmitSurveyResultResponse, unknown, SubmitSurveyResultPayload>({
    mutationFn: body => SurveyApi.submitSurveyResult(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] === 'survey-questions',
      });
    },
  });
}
