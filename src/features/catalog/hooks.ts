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
} from './types';
import { useQuery } from '@tanstack/react-query';
import * as CatalogApi from './api';

// Health query
export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: ['catalog', 'health'],
    queryFn: () => CatalogApi.getHealth(),
  });
}

// Subjects query
export function useSubjects() {
  return useQuery<SubjectsResponse>({
    queryKey: ['catalog', 'subjects'],
    queryFn: () => CatalogApi.getSubjects(),
  });
}

// Courses query
export function useCourses(subject: string) {
  return useQuery<CoursesResponse>({
    queryKey: ['catalog', 'courses', subject],
    queryFn: () => CatalogApi.getCourses(subject),
    enabled: !!subject,
  });
}

// Tracks query
export function useTracks(course: string) {
  return useQuery<TracksResponse>({
    queryKey: ['catalog', 'tracks', course],
    queryFn: () => CatalogApi.getTracks(course),
    enabled: !!course,
  });
}

// Track path query
export function useTrackPath(trackCode: string) {
  return useQuery<TrackPathResponse>({
    queryKey: ['catalog', 'track-path', trackCode],
    queryFn: () => CatalogApi.getTrackPath(trackCode),
    enabled: !!trackCode,
  });
}

// Lesson detail query
export function useLessonDetail(lessonCode: string) {
  return useQuery<LessonDetailResponse>({
    queryKey: ['catalog', 'lesson', lessonCode],
    queryFn: () => CatalogApi.getLessonDetail(lessonCode),
    enabled: !!lessonCode,
  });
}

// Anchor equivalents query
export function useAnchorEquivalents(anchorCode: string, course: string) {
  return useQuery<AnchorEquivalentsResponse>({
    queryKey: ['catalog', 'anchor-equivalents', anchorCode, course],
    queryFn: () => CatalogApi.getAnchorEquivalents(anchorCode, course),
    enabled: !!anchorCode && !!course,
  });
}

// Catalog subjects query
export function useCatalogSubjects() {
  return useQuery<CatalogSubjectsResponse>({
    queryKey: ['catalog', 'catalog-subjects'],
    queryFn: () => CatalogApi.getCatalogSubjects(),
  });
}

// Catalog track overview query
export function useCatalogTrackOverview(trackCode: string) {
  return useQuery<CatalogTrackOverviewResponse>({
    queryKey: ['catalog', 'catalog-track-overview', trackCode],
    queryFn: () => CatalogApi.getCatalogTrackOverview(trackCode),
    enabled: !!trackCode,
  });
}
