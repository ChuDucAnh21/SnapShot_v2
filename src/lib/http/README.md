# HTTP Client & Auth Layer

Production-ready networking layer for Next.js 15 with JWT authentication, automatic retries, and typed error handling.

## Features

- ✅ JWT access token (memory-based, with localStorage/sessionStorage persistence)
- ✅ Auto-retry with exponential backoff for network/5xx/408/429 errors
- ✅ Typed API errors with retry metadata
- ✅ Zustand state management for auth
- ✅ AbortController support
- ✅ SSR-safe

## Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_TIMEOUT_MS=20000  # optional
```

## Architecture

```
src/
  lib/
    http/
      axios-client.ts   # Main axios instance with interceptors
      retry.ts          # Retry logic with exponential backoff
      storage.ts        # Token persistence (local/session/memory)
    auth/
      auth-store.ts     # Zustand store for auth state
      auth-selectors.ts # Convenient selectors
  features/
    auth/               # Auth API & service layer
    assessments/        # Assessment endpoints
    profiles/           # Profile endpoints
    subjects/           # Subjects endpoints
    paths/              # Learning paths endpoints
    sessions/           # Session management
    dashboard/          # Dashboard data
```

## Usage

### 1. Basic API Call

```ts
import { api } from '@/lib/http/axios-client';

// With auth (default)
const response = await api.get('/api/protected-resource');

// Without auth (public endpoint)
const response = await api.get('/api/public', { _authOptional: true });

// With AbortController
const controller = new AbortController();
const response = await api.get('/api/data', { signal: controller.signal });
```

### 2. Using Feature Modules

```ts
import * as AuthApi from '@/features/auth/api';

// Login
try {
  const result = await AuthApi.login({
    email: 'user@example.com',
    password: 'password123',
  });
  console.log(result.access_token);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`${error.status}: ${error.message}`);
    if (error.isRetryable) {
      // Could retry manually if needed
    }
  }
}
```

### 3. Auth Service (Recommended)

```ts
import { doLogin, doRegister } from '@/features/auth/service';

// Login (automatically updates Zustand store)
await doLogin(
  { email: 'user@example.com', password: 'pass' },
  'local', // persist to localStorage
);

// Register
await doRegister(
  {
    email: 'user@example.com',
    password: 'pass',
    full_name: 'John Doe',
    child_name: 'Jane',
    child_age: 8,
  },
  'session', // persist to sessionStorage only
);
```

### 4. Using Auth Store in Components

```tsx
'use client';

import { useAccessToken, useAuthedUser } from '@/lib/auth/auth-selectors';
import { useAuthStore } from '@/lib/auth/auth-store';

export function ProfileButton() {
  const user = useAuthedUser();
  const logout = useAuthStore(s => s.logout);

  if (!user) {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return <a href="/login">Login</a>;
  }

  return (
    <div>
      <span>{user.email}</span>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
```

### 5. Complete Flow Example

```tsx
'use client';

import { useState } from 'react';
import { doLogin } from '@/features/auth/service';
import * as SubjectsApi from '@/features/subjects/api';
import { ApiError } from '@/types/api';

export function OnboardingFlow() {
  const [error, setError] = useState<string>();

  async function handleLogin(email: string, password: string) {
    try {
      setError(undefined);
      await doLogin({ email, password });

      // After login, fetch subjects
      const subjects = await SubjectsApi.getSubjects();
      console.log(subjects.subjects);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.status === 401) {
          // Invalid credentials
        } else if (err.isNetwork) {
          // Network error
        }
      }
    }
  }

  return <div>{/* your form */}</div>;
}
```

## Error Handling

All API errors are normalized to `ApiError` instances:

```ts
import { ApiError } from '@/types/api';

try {
  await api.get('/api/data');
} catch (err) {
  if (err instanceof ApiError) {
    console.log(err.status); // HTTP status code
    console.log(err.code); // Backend error code (if provided)
    console.log(err.message); // Human-readable message
    console.log(err.details); // Additional details
    console.log(err.isNetwork); // true if network error
    console.log(err.isRetryable); // true if retryable (408, 429, 5xx)
  }
}
```

## Retry Behavior

- **Retries**: Up to 3 attempts
- **Conditions**: Network errors, 408, 429, 500, 502, 503, 504
- **Delay**: Exponential backoff (100ms, 200ms, 400ms) + jitter
- **429 (Rate Limit)**: Honors `Retry-After` header if present

## 401 Handling

When a 401 (Unauthorized) is received:

1. Token is cleared from storage
2. Auth store is reset (`accessToken` and `user` set to `null`)
3. Error is thrown for UI to handle (typically redirect to login)

## Token Persistence

```ts
import { useAuthStore } from '@/lib/auth/auth-store';

// Persist to localStorage (default, survives browser restart)
useAuthStore.getState().setAccessToken(token, 'local');

// Persist to sessionStorage only (cleared when tab closes)
useAuthStore.getState().setAccessToken(token, 'session');

// Memory only (cleared on page refresh)
useAuthStore.getState().setAccessToken(token, 'memory');
```

## Testing

Use `axios-mock-adapter` for tests:

```ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createAxiosClient } from '@/lib/http/axios-client';

const client = createAxiosClient();
const mock = new MockAdapter(client);

mock.onGet('/api/test').reply(200, { data: 'success' });
```

## Security Notes

- Access tokens are stored in memory by default
- Optional persistence to localStorage/sessionStorage
- No HttpOnly cookies (since backend is external Python service)
- Always use HTTPS in production
- Set appropriate CORS headers on backend
