// Rules applied: style/brace-style:1tbs
'use client';

import { useQuery } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as SubjectsApi from './api';

export function useSubjects() {
  return useQuery({
    queryKey: QK.subjects,
    queryFn: () => SubjectsApi.getSubjects(),
    staleTime: 5 * 60_000,
  });
}
