// Rules applied: style/brace-style:1tbs

import type { DashboardRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function getDashboard(learnerId: string, signal?: AbortSignal) {
  const r = await api.get<DashboardRes>(`/dashboard/${learnerId}`, { signal });
  return r.data;
}
