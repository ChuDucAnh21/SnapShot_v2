# Networking & Auth Implementation Summary

This document summarizes the complete networking and authentication layer implementation based on the spec in `docs/specs/api.md`.

## ✅ What Was Implemented

### Core HTTP Layer

1. **`src/types/api.ts`** - Typed error classes and interfaces
2. **`src/lib/http/storage.ts`** - Token persistence (localStorage/sessionStorage/memory)
3. **`src/lib/http/retry.ts`** - Exponential backoff retry logic with `Retry-After` support
4. **`src/lib/http/axios-client.ts`** - Main Axios client with request/response interceptors

### Authentication Store

1. **`src/lib/auth/auth-store.ts`** - Zustand store for auth state (token + user)
2. **`src/lib/auth/auth-selectors.ts`** - Convenient React hooks for accessing auth state

### Feature Modules (API Wrappers)

All feature modules follow the pattern: `types.ts` + `api.ts` + `index.ts`

1. **`src/features/auth/`** - Authentication (register, login, me) + service orchestrator
2. **`src/features/assessments/`** - Submit assessments
3. **`src/features/profiles/`** - Generate and retrieve learner profiles
4. **`src/features/subjects/`** - List available subjects
5. **`src/features/paths/`** - Generate and retrieve learning paths
6. **`src/features/sessions/`** - Session management (generate, start, submit results, complete)
7. **`src/features/dashboard/`** - Dashboard statistics

### Documentation & Examples

1. **`src/lib/http/README.md`** - HTTP client usage guide
2. **`src/features/README.md`** - Feature modules guide
3. **`src/examples/LoginExample.tsx`** - Login/logout example component
4. **`src/examples/LearningPathExample.tsx`** - Complete learning flow example

## 🎯 Key Features

### Security

- JWT access tokens stored in memory by default
- Optional persistence to localStorage/sessionStorage
- Automatic token injection via request interceptor
- Auto-logout on 401 responses

### Error Handling

- Typed `ApiError` class with metadata:
  - `status` - HTTP status code
  - `code` - Backend error code
  - `message` - Human-readable message
  - `details` - Additional error details
  - `isNetwork` - Network error flag
  - `isRetryable` - Retry eligibility flag

### Retry Logic

- Up to 3 automatic retries
- Exponential backoff: 100ms → 200ms → 400ms (+ jitter)
- Retries network errors and: 408, 429, 500, 502, 503, 504
- Honors `Retry-After` header for 429 (rate limiting)

### Developer Experience

- Fully typed request/response types
- AbortController support for request cancellation
- Barrel exports for clean imports
- SSR-safe (no window access during SSR)

## 📦 Dependencies

All required dependencies are already installed in `package.json`:

- `axios` (1.12.2)
- `axios-retry` (4.5.0)
- `zustand` (5.0.8)
- `axios-mock-adapter` (2.1.0) - for testing

## 🚀 Quick Start

### 1. Set Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_TIMEOUT_MS=20000  # optional, defaults to 20000
```

### 2. Login Example

```tsx
'use client';

import { doLogin } from '@/features/auth/service';
import { useAuthedUser } from '@/lib/auth/auth-selectors';

export function LoginForm() {
  const user = useAuthedUser();

  async function handleLogin(email: string, password: string) {
    await doLogin({ email, password }, 'local');
  }

  if (user) {
    return (
      <div>
        Welcome,
        {user.email}
        !
      </div>
    );
  }

  return <form>{/* ... */}</form>;
}
```

### 3. API Call Example

```tsx
import { SubjectsApi } from '@/features/subjects';
import { ApiError } from '@/types/api';

async function loadSubjects() {
  try {
    const { subjects } = await SubjectsApi.getSubjects();
    return subjects;
  } catch (err) {
    if (err instanceof ApiError) {
      console.error(`${err.status}: ${err.message}`);
    }
  }
}
```

### 4. Complete Flow Example

```tsx
import { doLogin } from '@/features/auth/service';
import { PathsApi } from '@/features/paths';
import { SessionsApi } from '@/features/sessions';
import { SubjectsApi } from '@/features/subjects';

async function onboardingFlow(email: string, password: string) {
  // 1. Login
  const loginRes = await doLogin({ email, password });
  const learnerId = loginRes.user.learner_id;

  // 2. Get subjects
  const { subjects } = await SubjectsApi.getSubjects();
  const mathSubject = subjects.find(s => s.code === 'MATH');

  // 3. Generate learning path
  const { path } = await PathsApi.generatePath({
    learner_id: learnerId,
    subject_id: mathSubject.subject_id,
  });

  // 4. Start first available node
  const firstNode = path.nodes.find(n => n.status === 'available');
  const { session } = await SessionsApi.generateSession({
    learner_id: learnerId,
    node_id: firstNode.node_id,
  });

  await SessionsApi.startSession(session.session_id);

  return session;
}
```

## 📁 File Structure

```
src/
├── types/
│   └── api.ts                  # ApiError class
├── lib/
│   ├── http/
│   │   ├── axios-client.ts     # Main axios instance
│   │   ├── retry.ts            # Retry logic
│   │   ├── storage.ts          # Token storage
│   │   └── README.md           # Usage guide
│   └── auth/
│       ├── auth-store.ts       # Zustand auth store
│       └── auth-selectors.ts   # React hooks
├── features/
│   ├── auth/
│   │   ├── types.ts
│   │   ├── api.ts
│   │   ├── service.ts
│   │   └── index.ts
│   ├── assessments/
│   │   ├── types.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── profiles/
│   ├── subjects/
│   ├── paths/
│   ├── sessions/
│   ├── dashboard/
│   └── README.md               # Feature modules guide
└── examples/
    ├── LoginExample.tsx        # Login/logout demo
    └── LearningPathExample.tsx # Complete flow demo
```

## 🔧 Common Patterns

### Logout

```tsx
import { useAuthStore } from '@/lib/auth/auth-store';

function LogoutButton() {
  const logout = useAuthStore(s => s.logout);
  return <button onClick={logout}>Logout</button>;
}
```

### Request Cancellation

```tsx
const controller = new AbortController();

// Pass signal to API call
const data = await SubjectsApi.getSubjects(controller.signal);

// Cancel if needed
controller.abort();
```

### Error Handling

```tsx
import { ApiError } from '@/types/api';

try {
  await api.doSomething();
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      // Unauthorized - already handled, just redirect
      router.push('/login');
    } else if (err.status === 429) {
      // Rate limited - retry happens automatically
      toast.error('Too many requests, please wait');
    } else if (err.isNetwork) {
      // Network error
      toast.error('Connection error');
    } else {
      // Other error
      toast.error(err.message);
    }
  }
}
```

## 🧪 Testing

Example test with `axios-mock-adapter`:

```ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createAxiosClient } from '@/lib/http/axios-client';

describe('API Tests', () => {
  it('should login successfully', async () => {
    const client = createAxiosClient();
    const mock = new MockAdapter(client);

    mock.onPost('/api/auth/login').reply(200, {
      status: 'success',
      access_token: 'token-123',
      user: { user_id: 'user-1', learner_id: 'learner-1' },
    });

    // Test your API calls
  });
});
```

## 🎨 ESLint Compliance

All files follow project ESLint rules:

- ✅ `style/brace-style:1tbs` - One True Brace Style
- ✅ `ts/consistent-type-definitions:type` - Use `type` over `interface`
- ✅ `antfu/no-top-level-await:off` - Top-level await allowed
- ✅ No linter errors in any generated files

## 📝 Next Steps

1. **Set up environment variables** in `.env.local`
2. **Test the examples** in `src/examples/`
3. **Integrate auth** into your login/register pages
4. **Replace mock data** with real API calls using feature modules
5. **Add error boundaries** for better error UX
6. **Set up middleware** if you need route protection

## 🤝 Backend Requirements

Your Python backend should:

1. Return errors as: `{ status: 'error', message: string, error_code?: string }`
2. Return success as: `{ status: 'success', ... }`
3. Accept `Authorization: Bearer <token>` header
4. Return 401 when token is invalid/expired
5. (Optional) Return `Retry-After` header for 429 responses
6. Configure CORS for cross-origin requests

## 📚 Additional Resources

- HTTP Client Guide: `src/lib/http/README.md`
- Feature Modules Guide: `src/features/README.md`
- Original Spec: `docs/specs/api.md`
- Frontend-Backend Interface: `docs/interface/fe-be-interface-doc.md`

---

**Implementation Status**: ✅ Complete
**All Files**: No linting errors
**Dependencies**: Already installed
**Ready for**: Production use
