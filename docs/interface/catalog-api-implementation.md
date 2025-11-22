# Catalog API Implementation

This document describes the implementation of the catalog API endpoints for the new UI.

## Overview

All catalog API endpoints are implemented following the project's feature module pattern:
- Types defined in `src/types/catalog-api.ts`
- API functions in `src/features/catalog/api.ts`
- React Query hooks in `src/features/catalog/hooks.ts`
- Dedicated axios client in `src/lib/http/catalog-api-client.ts`

## Base URL

All catalog APIs use the base URL:
```
https://iruka-learning-api-1037337851453.asia-southeast1.run.app
```

## Available Endpoints

### 1. Health Check
**Endpoint:** `GET /health`

**API Function:** `getHealth()`

**React Hook:** `useHealth()`

**Response Type:** `HealthResponse`

**Example:**
```typescript
import { useHealth } from '@/features/catalog';

const { data } = useHealth();
// data: { status: 'ok', db: '/app/toolkit/seed/learning_graph.sqlite' }
```

### 2. Get Subjects
**Endpoint:** `GET /subjects`

**API Function:** `getSubjects()`

**React Hook:** `useSubjects()`

**Response Type:** `SubjectsResponse` (array of `Subject`)

**Example:**
```typescript
import { useSubjects } from '@/features/catalog';

const { data } = useSubjects();
// data: [{ code: 'vi', name: 'VI' }, ...]
```

### 3. Get Courses
**Endpoint:** `GET /courses?subject={subject}`

**API Function:** `getCourses(subject: string)`

**React Hook:** `useCourses(subject: string)`

**Response Type:** `CoursesResponse` (array of `Course`)

**Example:**
```typescript
import { useCourses } from '@/features/catalog';

const { data } = useCourses('vi');
// data: [{ code: 'vi-34', name: 'vi-34', subject_code: 'vi', age_band: '34' }, ...]
```

### 4. Get Tracks
**Endpoint:** `GET /tracks?course={course}`

**API Function:** `getTracks(course: string)`

**React Hook:** `useTracks(course: string)`

**Response Type:** `TracksResponse` (array of `Track`)

**Example:**
```typescript
import { useTracks } from '@/features/catalog';

const { data } = useTracks('vi-34');
// data: [{ code: 'vi-34-sgk-be-lam-quen-voi-chu-cai', name: 'Bé làm quen với chữ cái' }, ...]
```

### 5. Get Track Path
**Endpoint:** `GET /tracks/{trackCode}/path`

**API Function:** `getTrackPath(trackCode: string)`

**React Hook:** `useTrackPath(trackCode: string)`

**Response Type:** `TrackPathResponse`

**Example:**
```typescript
import { useTrackPath } from '@/features/catalog';

const { data } = useTrackPath('vi-34-sgk-be-lam-quen-voi-chu-cai');
// data: { track_code: '...', units: [...], path_nodes: [...] }
```

### 6. Get Lesson Detail
**Endpoint:** `GET /lessons/{lessonCode}`

**API Function:** `getLessonDetail(lessonCode: string)`

**React Hook:** `useLessonDetail(lessonCode: string)`

**Response Type:** `LessonDetailResponse`

**Example:**
```typescript
import { useLessonDetail } from '@/features/catalog';

const { data } = useLessonDetail('vi-34-sgk-be-lam-quen-voi-chu-cai-l1');
// data: { code: '...', title: '...', summary: '...', objectives: '...', ... }
```

### 7. Get Anchor Equivalents
**Endpoint:** `GET /anchors/{anchorCode}/equivalents?course={course}`

**API Function:** `getAnchorEquivalents(anchorCode: string, course: string)`

**React Hook:** `useAnchorEquivalents(anchorCode: string, course: string)`

**Response Type:** `AnchorEquivalentsResponse` (array of `AnchorEquivalent`)

**Example:**
```typescript
import { useAnchorEquivalents } from '@/features/catalog';

const { data } = useAnchorEquivalents('letter-o', 'vi-34');
// data: [{ track_code: '...', lesson_code: '...', index_in_track: 2 }, ...]
```

### 8. Get Catalog Subjects (Overview)
**Endpoint:** `GET /catalog/subjects`

**API Function:** `getCatalogSubjects()`

**React Hook:** `useCatalogSubjects()`

**Response Type:** `CatalogSubjectsResponse` (array of `CatalogSubject`)

**Example:**
```typescript
import { useCatalogSubjects } from '@/features/catalog';

const { data } = useCatalogSubjects();
// data: [{ subject_code: 'vi', subject_name: 'VI', courses: [...] }, ...]
```

### 9. Get Catalog Track Overview
**Endpoint:** `GET /catalog/tracks/{trackCode}`

**API Function:** `getCatalogTrackOverview(trackCode: string)`

**React Hook:** `useCatalogTrackOverview(trackCode: string)`

**Response Type:** `CatalogTrackOverviewResponse`

**Example:**
```typescript
import { useCatalogTrackOverview } from '@/features/catalog';

const { data } = useCatalogTrackOverview('vi-34-sgk-be-lam-quen-voi-chu-cai');
// data: { code: '...', name: '...', units: [{ code: '...', title: '...', lessons: [...] }, ...] }
```

## Usage Examples

### Direct API Calls (Server-side or without React Query)

```typescript
import * as CatalogApi from '@/features/catalog';

// In a server component or API route
const subjects = await CatalogApi.getSubjects();
const courses = await CatalogApi.getCourses('vi');
const trackPath = await CatalogApi.getTrackPath('vi-34-sgk-be-lam-quen-voi-chu-cai');
```

### React Query Hooks (Client-side)

```typescript
import { useSubjects, useCourses, useTrackPath } from '@/features/catalog';

function MyComponent() {
  const { data: subjects, isLoading } = useSubjects();
  const { data: courses } = useCourses('vi');
  const { data: trackPath } = useTrackPath('vi-34-sgk-be-lam-quen-voi-chu-cai');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Render your UI */}
    </div>
  );
}
```

## TypeScript Types

All types are exported from `@/types/catalog-api` and re-exported from `@/features/catalog/types`:

- `HealthResponse`
- `Subject`, `SubjectsResponse`
- `Course`, `CoursesResponse`
- `Track`, `TracksResponse`
- `PathNodeType`, `PathNode`, `Unit`, `TrackPathResponse`
- `ActivityOutline`, `LessonDetail`, `LessonDetailResponse`
- `AnchorEquivalent`, `AnchorEquivalentsResponse`
- `CatalogCourse`, `CatalogSubject`, `CatalogSubjectsResponse`
- `CatalogLesson`, `CatalogUnit`, `CatalogTrackOverview`, `CatalogTrackOverviewResponse`

## Error Handling

All API calls use the same error handling mechanism as the main API client:
- Automatic retry with exponential backoff for network/5xx/408/429 errors
- Typed `ApiError` exceptions
- Error details available in the error object

## Script for Fetching API Responses

A script is available at `scripts/fetch-api-responses.mjs` to fetch all API responses and save them to JSON files for reference. Run it with:

```bash
node scripts/fetch-api-responses.mjs
```

The responses are saved to `scripts/api-responses/` directory.
