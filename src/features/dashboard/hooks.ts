// Rules applied: style/brace-style:1tbs
'use client';

import { useQuery } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as DashboardApi from './api';

export function useDashboard(learnerId: string, enabled = true) {
  return useQuery({
    queryKey: QK.dashboard(learnerId),
    queryFn: () => DashboardApi.getDashboard(learnerId),
    enabled,
    staleTime: 30_000,
  });
}
