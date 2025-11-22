import type { SubjectListResponse, SubjectOverviewResponse } from './type';
import { autoFetch } from '@/lib/http/autoFetchApi';

export async function getSubjectList(signal?: AbortSignal): Promise<SubjectListResponse> {
  return autoFetch<SubjectListResponse>('/api/get_subject_list', {
    method: 'GET',
    signal,
  });
}

export async function getSubjectOverview(
  subject_id: string,
  signal?: AbortSignal,
): Promise<SubjectOverviewResponse> {
  return autoFetch<SubjectOverviewResponse>(`/api/surveys/overview?subject_id=${subject_id}`, {
    method: 'GET',
    signal,
  });
}

export const SubjectService = {
  getSubjectList,
  getSubjectOverview,
};
