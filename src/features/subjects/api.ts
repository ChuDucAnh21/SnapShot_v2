// Rules applied: style/brace-style:1tbs

import type { SubjectsRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function getSubjects(signal?: AbortSignal) {
  const r = await api.get<SubjectsRes>('/subjects', { signal });
  return r.data;
}
