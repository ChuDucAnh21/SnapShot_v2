# Feature Modules

This directory contains feature-based API modules that provide typed access to backend endpoints.

## Structure

Each feature module follows this pattern:

```
features/
  <feature-name>/
    types.ts    # TypeScript types for requests/responses
    api.ts      # API functions that call endpoints
    hooks.ts    # React Query hooks for queries/mutations
    service.ts  # (optional) Higher-level orchestration
```

## Base URL Configuration

The axios client is configured with:
- Base URL: `${NEXT_PUBLIC_API_BASE_URL}/api/v1`
- All endpoints are relative to this base
- Authorization: Automatic `Bearer ${token}` injection via interceptor

## Available Modules

### Auth (`/auth`)

Authentication and user management.

**Endpoints:**

- `POST /auth/register` - Register new user + learner
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

**Usage:**

```ts
import * as AuthApi from '@/features/auth/api';
import { useLogin, useMe, useRegister } from '@/features/auth/hooks';
import { doLogin, doRegister } from '@/features/auth/service';

// Register (service auto-updates auth store)
await doRegister({
  email: 'user@example.com',
  password: 'password',
  full_name: 'John Doe',
  child_name: 'Emma',
  child_age: 7,
});

// Login (service auto-updates auth store)
await doLogin({ email: 'user@example.com', password: 'password' });

// React Query hooks
const { data: userData } = useMe();
const loginMutation = useLogin();
const registerMutation = useRegister();
```

### Assessments (`/assessments`)

Manage surveys and submit assessment data.

**Endpoints:**

- `GET /surveys?locale=en` - Get available surveys
- `GET /surveys/:surveyKey?locale=en` - Get survey details
- `POST /assessments` - Submit assessment results

**Usage:**

```ts
import * as AssessmentsApi from '@/features/assessments/api';
import { useSubmitAssessment, useSurveyDetail, useSurveys } from '@/features/assessments/hooks';

// Get surveys
const { data } = useSurveys('en');

// Get survey detail
const { data: surveyDetail } = useSurveyDetail('parent-survey-v1', 'en');

// Submit assessment
const submitMutation = useSubmitAssessment();
await submitMutation.mutateAsync({
  learner_id: 'learner-123',
  parent_survey: { interests: ['math', 'art'], learning_style: ['visual'], strengths: [], weaknesses: [] },
  minigame_results: [{ game_type: 'math', metadata: { score: 0.8, time_spent: 120 } }],
});
```

### Profiles (`/profiles`)

Generate and retrieve learner profiles using AI.

**Endpoints:**

- `POST /profiles/generate` - Generate profile from assessment (AI Core)
- `GET /profiles/:learnerId` - Get existing profile

**Usage:**

```ts
import * as ProfilesApi from '@/features/profiles/api';
import { useGenerateProfile, useProfile } from '@/features/profiles/hooks';

// Generate profile
const generateMutation = useGenerateProfile();
await generateMutation.mutateAsync({ learner_id: 'learner-123' });

// Retrieve profile
const { data: profileData } = useProfile('learner-123');
```

### Subjects (`/subjects`)

List available subjects.

**Endpoints:**

- `GET /subjects` - Get all subjects

**Usage:**

```ts
import * as SubjectsApi from '@/features/subjects/api';
import { useSubjects } from '@/features/subjects/hooks';

// Direct API
const { subjects } = await SubjectsApi.getSubjects();

// React Query hook
const { data } = useSubjects();
const subjects = data?.subjects;
```

### Paths (`/paths`)

Generate and retrieve personalized learning paths using AI.

**Endpoints:**

- `POST /paths/generate` - Generate personalized learning path (AI Core)
- `GET /paths/:learnerId/:subjectId` - Get existing path

**Usage:**

```ts
import * as PathsApi from '@/features/paths/api';
import { useGeneratePath, usePath } from '@/features/paths/hooks';

// Generate path
const generateMutation = useGeneratePath();
await generateMutation.mutateAsync({
  learner_id: 'learner-123',
  subject_id: 'math',
});

// Retrieve path
const { data } = usePath('learner-123', 'math');
const path = data?.path;
```

### Sessions (`/sessions`)

Manage learning sessions and activities.

**Endpoints:**

- `POST /sessions/generate` - Generate new session (AI Core)
- `GET /sessions/:sessionId` - Get session details
- `POST /sessions/:sessionId/start` - Start session
- `POST /sessions/:sessionId/activities/:activityId/result` - Submit activity result
- `POST /sessions/:sessionId/complete` - Complete session

**Usage:**

```ts
import * as SessionsApi from '@/features/sessions/api';
import {
  useCompleteSession,
  useGenerateSession,
  useSession,
  useStartSession,
  useSubmitActivityResult,
} from '@/features/sessions/hooks';

// Generate session
const generateMutation = useGenerateSession();
const { session } = await generateMutation.mutateAsync({
  learner_id: 'learner-123',
  node_id: 'node-456',
});

// Get session
const { data } = useSession(session.session_id);

// Start session
const startMutation = useStartSession();
await startMutation.mutateAsync(session.session_id);

// Submit activity result
const submitMutation = useSubmitActivityResult();
await submitMutation.mutateAsync({
  sessionId: session.session_id,
  activityId: 'activity-789',
  body: { completed: true, score: 0.85, time_spent: 120 },
});

// Complete session
const completeMutation = useCompleteSession();
await completeMutation.mutateAsync({
  sessionId: session.session_id,
  body: { overall_feedback: 'Great job!' },
});
```

### Dashboard (`/dashboard`)

Retrieve learner dashboard data and statistics.

**Endpoints:**

- `GET /dashboard/:learnerId` - Get dashboard stats

**Usage:**

```ts
import * as DashboardApi from '@/features/dashboard/api';
import { useDashboard } from '@/features/dashboard/hooks';

// Direct API
const { dashboard } = await DashboardApi.getDashboard('learner-123');
console.log(dashboard.stats.current_streak);

// React Query hook
const { data } = useDashboard('learner-123');
const stats = data?.dashboard.stats;
```

## Patterns

### All API functions:

1. **Accept `signal?: AbortSignal`** for cancellation:

   ```ts
   const controller = new AbortController();
   const data = await api.getData(controller.signal);
   // Later: controller.abort()
   ```

2. **Return typed data** directly:

   ```ts
   const { subjects } = await SubjectsApi.getSubjects();
   // No need to access .data property
   ```

3. **Throw `ApiError`** on failure:
   ```ts
   try {
     await api.something();
   } catch (err) {
     if (err instanceof ApiError) {
       console.log(err.status, err.message);
     }
   }
   ```

## Adding New Features

1. Create directory: `src/features/<name>/`
2. Add `types.ts`:

   ```ts
   export type MyRequest = {
     /* ... */
   };
   export type MyResponse = { status: 'success'; data: any };
   ```

3. Add `api.ts`:

   ```ts
   import type { MyRequest, MyResponse } from './types';
   import { api } from '@/lib/http/axios-client';

   export async function doSomething(body: MyRequest, signal?: AbortSignal) {
     const r = await api.post<MyResponse>('/api/my-endpoint', body, { signal });
     return r.data;
   }
   ```

4. (Optional) Add `service.ts` for orchestration logic that touches multiple APIs or manages state.

## Type Safety

All request/response types are derived from the backend API spec. Keep these types in sync with backend changes for full type safety across your app.

## Complete API Summary

### Phase 1: Authentication (3 endpoints)
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Phase 2: Assessment & Profile (5 endpoints)
- `GET /surveys?locale=en`
- `GET /surveys/:surveyKey?locale=en`
- `POST /assessments`
- `POST /profiles/generate`
- `GET /profiles/:learnerId`

### Phase 3: Learning Path (3 endpoints)
- `GET /subjects`
- `POST /paths/generate`
- `GET /paths/:learnerId/:subjectId`

### Phase 4: Learning Sessions (5 endpoints)
- `POST /sessions/generate`
- `GET /sessions/:sessionId`
- `POST /sessions/:sessionId/start`
- `POST /sessions/:sessionId/activities/:activityId/result`
- `POST /sessions/:sessionId/complete`

### Additional (1 endpoint)
- `GET /dashboard/:learnerId`

**Total: 17 core endpoints** across all features, all with typed request/response interfaces and React Query hooks.
