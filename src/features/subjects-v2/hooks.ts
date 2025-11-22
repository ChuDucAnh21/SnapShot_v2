'use client';

import type { SubjectListResponse, SubjectOverviewResponse } from './type';
import { useQuery } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as SubjectsApi from './api';

export function useSubjectList(enabled = true) {
  return useQuery<SubjectListResponse>({
    queryKey: QK.subjectsV2,
    queryFn: ({ signal }) => SubjectsApi.getSubjectList(signal),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useSubjectOverview(subjectId: string, enabled = Boolean(subjectId)) {
  return useQuery<SubjectOverviewResponse>({
    queryKey: QK.subjectOverview(subjectId),
    queryFn: ({ signal }) => SubjectsApi.getSubjectOverview(subjectId, signal),
    enabled,
    staleTime: 5 * 60_000,
  });
}
