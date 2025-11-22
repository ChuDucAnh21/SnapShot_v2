// Rules applied: style/brace-style:1tbs

import type {
  AnchorEquivalentsResponse,
  CatalogSubjectsResponse,
  CatalogTrackOverviewResponse,
  CoursesResponse,
  HealthResponse,
  LessonDetailResponse,
  SubjectsResponse,
  TrackPathResponse,
  TracksResponse,
} from '@/types/catalog-api';
import { catalogApi } from '@/lib/http/catalog-api-client';

// Health endpoint
export async function getHealth(signal?: AbortSignal) {
  const r = await catalogApi.get<HealthResponse>('/health', { signal });
  return r.data;
}

// Subjects endpoint
export async function getSubjects(signal?: AbortSignal) {
  const r = await catalogApi.get<SubjectsResponse>('/subjects', { signal });
  return r.data;
}

// Courses endpoint
export async function getCourses(subject: string, signal?: AbortSignal) {
  const r = await catalogApi.get<CoursesResponse>('/courses', {
    params: { subject },
    signal,
  });
  return r.data;
}

// Tracks endpoint
export async function getTracks(course: string, signal?: AbortSignal) {
  const r = await catalogApi.get<TracksResponse>('/tracks', {
    params: { course },
    signal,
  });
  return r.data;
}

// Track path endpoint
export async function getTrackPath(trackCode: string, signal?: AbortSignal) {
  const r = await catalogApi.get<TrackPathResponse>(`/tracks/${trackCode}/path`, { signal });
  return r.data;
}

// Lesson detail endpoint
export async function getLessonDetail(lessonCode: string, signal?: AbortSignal) {
  const r = await catalogApi.get<LessonDetailResponse>(`/lessons/${lessonCode}`, { signal });
  return r.data;
}

// Anchor equivalents endpoint
export async function getAnchorEquivalents(anchorCode: string, course: string, signal?: AbortSignal) {
  const r = await catalogApi.get<AnchorEquivalentsResponse>(`/anchors/${anchorCode}/equivalents`, {
    params: { course },
    signal,
  });
  return r.data;
}

// Catalog subjects endpoint
export async function getCatalogSubjects(signal?: AbortSignal) {
  const r = await catalogApi.get<CatalogSubjectsResponse>('/catalog/subjects', { signal });
  return r.data;
}

// Catalog track overview endpoint
export async function getCatalogTrackOverview(trackCode: string, signal?: AbortSignal) {
  const r = await catalogApi.get<CatalogTrackOverviewResponse>(`/catalog/tracks/${trackCode}`, { signal });
  return r.data;
}
