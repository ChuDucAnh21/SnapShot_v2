# REQUESTS-SPEC.md — Next.js 15 (App Router) + Axios + Zustand

A production-ready networking/auth layer for a Next.js 15 app using **Axios** and **Zustand**, with:

- JWT **access token** (short-lived) in memory (Zustand)
- **HttpOnly refresh token** cookie handled on the server (Route Handlers)
- **Auto-refresh** with single-flight request **queueing**
- **Max retries** (exponential backoff) for network/5xx/408/429
- **Typed errors** & consistent error handling
- **AbortController** support
- **SSR-safe**: cookies & mutations in Route Handlers/Server Actions; client uses Zustand only

---

## Directory Layout

```
src/
  app/
    api/
      auth/
        refresh/route.ts
        logout/route.ts
  lib/
    http/
      axios-client.ts
      retry.ts
      errors.ts
      auth-queue.ts
      token.ts
    auth/
      auth-store.ts
      auth-selectors.ts
  types/
    api.ts
  lib/
    http/__tests__/
      auth-queue.test.ts
      retry.test.ts
```

---

## Environment

- `NEXT_PUBLIC_API_BASE_URL` — your API base (for browser calls via Axios)
- `AUTH_BASE_URL` — your auth server base (used only in Route Handlers)

---

## Security Model

- **Access token**: short TTL (e.g., 5–15 min), **kept in memory** only.
- **Refresh token**: long‑lived (rotating), stored as **Secure + HttpOnly** cookie (`SameSite=Lax|Strict`).
- Refresh is done server‑side via **Route Handler** (`/api/auth/refresh`), which also rotates the cookie when backend returns a new refresh token.

---

## Flow Overview

1. Client request → Axios Request Interceptor injects `Authorization: Bearer <access>` (when present).

2. If response is `401` and request not yet retried:
   - Pause concurrent failing requests using **single-flight refresh lock**.
   - Call `POST /api/auth/refresh` (a Next Route Handler), which reads the refresh cookie and exchanges/rotates it with your auth server, then returns a **new access token**.
   - Replay the original request with the new header.

3. If refresh fails → **logout**: clear store, clear cookie server-side.

4. Network/5xx/408/429 errors → **retry up to 3x** with **exponential backoff**.

---

## Usage Examples

```ts
// src/lib/http/client.ts
'use client';
import { api } from './axios-client';

export type Todo = { id: string; title: string };
export async function getTodos(signal?: AbortSignal) {
  const res = await api.get<Todo[]>('/todos', { signal });
  return res.data;
}

export async function getPublic() {
  const res = await api.get('/public', { _authOptional: true });
  return res.data;
}
```

```ts
// in a component
const ac = new AbortController();
getTodos(ac.signal).catch((e) => {
  /* typed ApiError handling */
});
// later: ac.abort();
```

---

## Non‑Functional Requirements

- Retries: 3 max, exponential backoff; retry only network/408/429/5xx and **idempotent** requests by default.
- Timeouts: default 20s, overridable per request.
- Observability: logs retries in dev; ready for Sentry/Datadog breadcrumbs.
- CSP and secure cookies recommended.

---

# CODE

> Drop the following files into the paths shown above. All client‑side files include `'use client'` pragma where needed.

---

## `src/types/api.ts`

```ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiErrorPayload = {
  code?: string;
  message: string;
  details?: unknown;
};

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  isNetwork?: boolean;
  isRetryable?: boolean;
  constructor(init: Partial<ApiError> & { message: string }) {
    super(init.message);
    Object.assign(this, init);
  }
}
```

---

## `src/lib/auth/auth-store.ts`

```ts
'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type User = { id: string; email: string; name?: string };

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    accessToken: null,
    user: null,
    setAccessToken: t => set({ accessToken: t }),
    setUser: u => set({ user: u }),
    logout: async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } finally {
        set({ accessToken: null, user: null });
      }
    },
  })),
);
```

---

## `src/lib/auth/auth-selectors.ts`

```ts
import { useAuthStore } from './auth-store';

export const useAccessToken = () => useAuthStore(s => s.accessToken);
export const useAuthedUser = () => useAuthStore(s => s.user);
```

---

## `src/lib/http/auth-queue.ts`

```ts
// Ensures only one refresh runs; other callers await it.
let refreshPromise: Promise<string | null> | null = null;

export const getOrCreateRefresh = (factory: () => Promise<string | null>) => {
  if (!refreshPromise) {
    refreshPromise = factory().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};
```

---

## `src/lib/http/retry.ts`

```ts
import type { AxiosInstance } from 'axios';
import axiosRetry, { exponentialDelay, isNetworkError } from 'axios-retry';

export function attachRetry(client: AxiosInstance) {
  axiosRetry(client, {
    retries: 3,
    retryDelay: exponentialDelay,
    retryCondition: (error) => {
      const status = error.response?.status;
      return isNetworkError(error) || (status !== undefined && [408, 429, 500, 502, 503, 504].includes(status));
    },
    onRetry: (retryCount, error, cfg) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[axios-retry] #${retryCount} ${cfg?.method?.toUpperCase()} ${cfg?.url}`, error?.message);
      }
    },
  });
}
```

---

## `src/lib/http/errors.ts`

```ts
import type { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

export function toApiError(err: unknown): ApiError {
  const e = err as AxiosError<any> & { status?: number };
  const status = e.response?.status ?? (e as any).status;
  const payload = e.response?.data as { message?: string; code?: string; details?: unknown } | undefined;
  const isNetwork = (!!e.code && ['ECONNABORTED'].includes(e.code)) || !e.response;
  return new ApiError({
    message: payload?.message || e.message || 'Request failed',
    status,
    code: payload?.code,
    details: payload?.details,
    isNetwork,
    isRetryable: isNetwork || (status ? [408, 429, 500, 502, 503, 504].includes(status) : false),
  });
}
```

---

## `src/lib/http/token.ts`

```ts
export function bearer(token: string) {
  return `Bearer ${token}`;
}

export function parseJwtExp(token: string): number | null {
  try {
    const [, payload] = token.split('.');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp : null;
  } catch {
    return null;
  }
}
```

---

## `src/lib/http/axios-client.ts`

```ts
'use client';
import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import { useAuthStore } from '@/lib/auth/auth-store';
import { ApiError } from '@/types/api';
import { getOrCreateRefresh } from './auth-queue';
import { attachRetry } from './retry';

declare module 'axios' {
  export type AxiosRequestConfig = {
    _retry?: boolean;
    _authOptional?: boolean;
  };
}

function normalizeError(err: AxiosError<any>) {
  const status = err.response?.status;
  const isNetwork = (!!err.code && ['ECONNABORTED'].includes(err.code)) || !err.response;
  return new ApiError({
    message: err.response?.data?.message || err.message || 'Request failed',
    status,
    code: err.response?.data?.code,
    details: err.response?.data?.details,
    isNetwork,
    isRetryable: isNetwork || (status ? [408, 429, 500, 502, 503, 504].includes(status) : false),
  });
}

export function createAxiosClient(baseURL = process.env.NEXT_PUBLIC_API_BASE_URL): AxiosInstance {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 20_000,
  });

  attachRetry(client);

  // Attach Authorization when we have an access token
  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config._authOptional) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
    return config;
  });

  // Handle 401 -> refresh once -> replay
  client.interceptors.response.use(
    res => res,
    async (err) => {
      const original = err.config!;
      const status = err.response?.status;

      if (status === 401 && !original._retry && !original.url?.includes('/auth/refresh')) {
        original._retry = true;
        const newToken = await getOrCreateRefresh(async () => {
          const r = await fetch('/api/auth/refresh', { method: 'POST' });
          if (!r.ok) {
            return null;
          }
          const { accessToken } = await r.json();
          useAuthStore.getState().setAccessToken(accessToken);
          return accessToken;
        });

        if (newToken) {
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
          return client(original);
        }

        await useAuthStore.getState().logout();
      }

      throw normalizeError(err);
    },
  );

  return client;
}

export const api = createAxiosClient();
```

---

## External BE (Python) — No Next Route Handlers needed

> FE calls BE **directly** for both refresh and logout. Keep `withCredentials: true` and ensure BE CORS/cookies are correct.

### Updated `src/lib/http/axios-client.ts` (direct refresh to BE)

```ts
'use client';
import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import { useAuthStore } from '@/lib/auth/auth-store';
import { ApiError } from '@/types/api';
import { getOrCreateRefresh } from './auth-queue';
import { attachRetry } from './retry';

declare module 'axios' {
  export type AxiosRequestConfig = {
    _retry?: boolean;
    _authOptional?: boolean;
  };
}

const REFRESH_BASE = process.env.NEXT_PUBLIC_AUTH_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
// Bare client for refresh only (no interceptors to avoid loops)
const refreshClient = axios.create({
  baseURL: REFRESH_BASE,
  withCredentials: true,
  timeout: 20_000,
});

function toApiError(err: AxiosError<any>) {
  const status = err.response?.status;
  const isNetwork = (!!err.code && ['ECONNABORTED'].includes(err.code)) || !err.response;
  return new ApiError({
    message: err.response?.data?.message || err.message || 'Request failed',
    status,
    code: err.response?.data?.code,
    details: err.response?.data?.details,
    isNetwork,
    isRetryable: isNetwork || (status ? [408, 429, 500, 502, 503, 504].includes(status) : false),
  });
}

export function createAxiosClient(baseURL = process.env.NEXT_PUBLIC_API_BASE_URL): AxiosInstance {
  const client = axios.create({ baseURL, withCredentials: true, timeout: 20_000 });

  attachRetry(client);

  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config._authOptional) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
    return config;
  });

  client.interceptors.response.use(
    res => res,
    async (err) => {
      const original = err.config!;
      const status = err.response?.status;

      if (status === 401 && !original._retry && !original.url?.includes('/auth/refresh')) {
        original._retry = true;
        const newToken = await getOrCreateRefresh(async () => {
          try {
            const r = await refreshClient.post('/auth/refresh', {});
            const { accessToken } = r.data as { accessToken: string };
            useAuthStore.getState().setAccessToken(accessToken);
            return accessToken;
          } catch {
            return null;
          }
        });

        if (newToken) {
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
          return client(original);
        }

        await useAuthStore.getState().logout();
      }

      throw toApiError(err);
    },
  );

  return client;
}

export const api = createAxiosClient();
```

### Updated `src/lib/auth/auth-store.ts` (direct logout to BE)

```ts
'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type User = { id: string; email: string; name?: string };

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(set => ({
    accessToken: null,
    user: null,
    setAccessToken: t => set({ accessToken: t }),
    setUser: u => set({ user: u }),
    logout: async () => {
      try {
        const base = process.env.NEXT_PUBLIC_AUTH_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
        await fetch(`${base}/auth/logout`, { method: 'POST', credentials: 'include' });
      } finally {
        set({ accessToken: null, user: null });
      }
    },
  })),
);
```

---

## Minimal Tests (Vitest)

> Add `vitest` as a dev dependency and run with `npx vitest`.

### `package.json` (snippet)

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "axios": "^1.7.0",
    "axios-retry": "^4.0.0",
    "zustand": "^4.5.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.5.0"
  },
  "vitest": { "globals": true }
}
```

### `src/lib/http/__tests__/auth-queue.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { getOrCreateRefresh } from '../auth-queue';

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

describe('auth-queue', () => {
  it('runs refresh only once for concurrent callers', async () => {
    let runs = 0;
    const factory = async () => {
      runs++;
      await delay(50);
      return 'token';
    };

    const [a, b, c] = await Promise.all([
      getOrCreateRefresh(factory),
      getOrCreateRefresh(factory),
      getOrCreateRefresh(factory),
    ]);

    expect(runs).toBe(1);
    expect(a).toBe('token');
    expect(b).toBe('token');
    expect(c).toBe('token');
  });
});
```

### `src/lib/http/__tests__/retry.test.ts`

```ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, expect, it, vi } from 'vitest';
import { attachRetry } from '../retry';

function makeClient() {
  const client = axios.create();
  attachRetry(client);
  return client;
}

describe('retry', () => {
  it('retries on 500 up to 3 times', async () => {
    const client = makeClient();
    const mock = new MockAdapter(client);
    mock.onGet('/boom').replyOnce(500).onGet('/boom').replyOnce(500).onGet('/boom').reply(200, { ok: true });

    const res = await client.get('/boom');

    expect(res.status).toBe(200);
    expect(res.data.ok).toBe(true);
  });
});
```

> Note: Add `axios-mock-adapter` as a dev dependency for the test above or replace with your preferred mocking approach.

---

## Middleware (optional)

If you want coarse protection, add a `middleware.ts` to redirect non‑authed users away from certain routes. The networking stack above already handles token injection and refresh; middleware is optional and depends on your routing policy.

---

## Migration Tips

- Replace your old API layer with `api` from `axios-client.ts`.
- Ensure your backend supports refresh token rotation and CORS (if cross‑origin).
- Start by protecting a single route; expand gradually.

---

## Checklist / QA

- Access token expires → first protected request returns 401 → exactly **one** refresh call → all queued requests replay and succeed.
- Refresh fails (invalid/expired refresh token) → cookie cleared → store reset → user redirected to login UX.
- Network/5xx/408/429 → up to 3 retries with backoff → success or surfaced typed `ApiError`.
- AbortController aborts in‑flight requests without memory leaks.

---

**End of Spec**

---

## External Backend Integration (Cross‑Origin)

### Base URLs (BE Python)

- **Public API base**: `https://api.iruka.app/v1` (example)
- **Auth base**: same as API base or a dedicated domain, e.g. `https://auth.iruka.app`
- **Frontend env**:
  - `NEXT_PUBLIC_API_BASE_URL=https://api.iruka.app/v1`
  - `NEXT_PUBLIC_AUTH_BASE_URL=https://auth.iruka.app`

### CORS expectations on BE

- `Access-Control-Allow-Origin: https://app.iruka.app` (exact origin; do **not** use `*` with credentials)
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET,POST,PATCH,PUT,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key, X-Request-ID`
- `Access-Control-Max-Age: 600` (optional)

### Cookies for refresh (set by BE only)

- `refresh_token` cookie attributes: `HttpOnly; Secure; SameSite=None; Path=/` (+ `Domain=api.iruka.app` if needed)
- Rotate cookie on each refresh; clear on logout.

---

## FE Notes (axios)

- **Direct calls from FE → BE Python**. No Next Route Handlers required.
- `withCredentials: true` is **on** in the shared axios client, so the browser sends/receives the BE’s HttpOnly refresh cookie automatically when CORS is configured.
- `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_AUTH_BASE_URL` are both available on the client; if you only have one base, you can omit `NEXT_PUBLIC_AUTH_BASE_URL`.

---

# How to Add a New Feature (FE Only)

(unchanged — use the same scaffold and patterns; your endpoints now point **directly** to the BE base URLs.)

---

# FE Implementation Spec for Provided Python BE POC (JWT‑only, no refresh)

> Source interface: See **fe-be-interface-doc.md** (Auth/Login/Me, Assessments, Profiles, Subjects, Paths, Sessions, Dashboard, Error shape). FE will call BE **directly** using Bearer JWT; **no refresh** token per POC.

## A. Summary (what changed from earlier draft)

- Removed refresh‑token flow & cookies. On **401** ⇒ clear token & navigate to `/login`.
- `withCredentials` is **false** (no cookies cross‑site).
- Response interceptor treats HTTP 200 with `{ status: 'error' }` as a thrown error.
- Keep `axios-retry` + special handling for `429` via `Retry-After`.

## B. Environment

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
# optional
NEXT_PUBLIC_API_TIMEOUT_MS=20000
```

## C. File layout (FE)

```
src/
  lib/
    http/
      axios-client.ts      # axios instance (no refresh), error normalization
      retry.ts             # retry with Retry-After support
      storage.ts           # access_token persistence (local/session/memory)
    auth/
      auth-store.ts        # Zustand store (token + user)
  features/
    auth/
      types.ts
      api.ts               # /api/auth/*
      service.ts           # orchestrates login/register & store updates
    assessments/
      types.ts
      api.ts               # /api/assessments
    profiles/
      types.ts
      api.ts               # /api/profiles/*
    subjects/
      types.ts
      api.ts               # /api/subjects
    paths/
      types.ts
      api.ts               # /api/paths/*
    sessions/
      types.ts
      api.ts               # /api/sessions/*
    dashboard/
      types.ts
      api.ts               # /api/dashboard/*
```

## D. Core primitives

### D1. `src/types/api.ts`

```ts
export type ProblemLikeError = {
  status?: 'error' | 'success';
  error_code?: string;
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  isNetwork?: boolean;
  isRetryable?: boolean;
  constructor(init: Partial<ApiError> & { message: string }) {
    super(init.message);
    Object.assign(this, init);
  }
}
```

### D2. `src/lib/http/storage.ts`

```ts
export type TokenLocation = 'local' | 'session' | 'memory';
let memToken: string | null = null;
export const tokenStorage = {
  get() {
    if (memToken) {
      return memToken;
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    }
    return null;
  },
  set(token: string | null, where: TokenLocation = 'local') {
    memToken = token;
    if (typeof window === 'undefined') {
      return;
    }
    if (where === 'local') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
      sessionStorage.removeItem('access_token');
    } else if (where === 'session') {
      if (token) {
        sessionStorage.setItem('access_token', token);
      } else {
        sessionStorage.removeItem('access_token');
      }
      localStorage.removeItem('access_token');
    }
  },
  clear() {
    this.set(null);
  },
};
```

### D3. `src/lib/http/retry.ts`

```ts
import type { AxiosInstance } from 'axios';
import axiosRetry, { isNetworkError } from 'axios-retry';

export function attachRetry(client: AxiosInstance) {
  axiosRetry(client, {
    retries: 3,
    retryDelay: (retryCount, error) => {
      const ra = error.response?.headers?.['retry-after'];
      if (ra) {
        const sec = Number(ra);
        if (!Number.isNaN(sec)) {
          return sec * 1000;
        }
      }
      const base = 2 ** retryCount * 100; // 100, 200, 400
      const jitter = Math.random() * 100;
      return base + jitter;
    },
    retryCondition: (error) => {
      const s = error.response?.status;
      return isNetworkError(error) || (s !== undefined && [408, 429, 500, 502, 503, 504].includes(s));
    },
  });
}
```

### D4. `src/lib/http/axios-client.ts`

```ts
'use client';
import type { AxiosInstance } from 'axios';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/auth/auth-store';
import { ApiError } from '@/types/api';
import { attachRetry } from './retry';
import { tokenStorage } from './storage';

declare module 'axios' {
  export type AxiosRequestConfig = { _authOptional?: boolean };
}

function toApiError(err: AxiosError<any>): ApiError {
  const status = err.response?.status;
  const payload = err.response?.data;
  const isNetwork = (!!err.code && ['ECONNABORTED'].includes(err.code)) || !err.response;
  return new ApiError({
    message: payload?.message || err.message || 'Request failed',
    status,
    code: payload?.error_code,
    details: payload?.details,
    isNetwork,
    isRetryable: isNetwork || (status ? [408, 429, 500, 502, 503, 504].includes(status) : false),
  });
}

export function createAxiosClient(
  baseURL = process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS) || 20_000,
): AxiosInstance {
  const client = axios.create({ baseURL, timeout, withCredentials: false });
  attachRetry(client);

  client.interceptors.request.use((config) => {
    if (!config._authOptional) {
      const token = useAuthStore.getState().accessToken || tokenStorage.get();
      if (token) {
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => {
      const d = res.data;
      if (d && typeof d === 'object' && d.status === 'error') {
        throw new ApiError({
          message: d.message || 'Request error',
          status: res.status,
          code: d.error_code,
          details: d.details,
        });
      }
      return res;
    },
    (err) => {
      const status = err.response?.status;
      if (status === 401) {
        tokenStorage.clear();
        useAuthStore.getState().setAccessToken(null);
        useAuthStore.getState().setUser(null);
      }
      throw toApiError(err);
    },
  );

  return client;
}

export const api = createAxiosClient();
```

### D5. `src/lib/auth/auth-store.ts`

```ts
'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { tokenStorage } from '@/lib/http/storage';

type User = { user_id: string; email?: string; full_name?: string; learner_id?: string };

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (t: string | null, persist?: 'local' | 'session' | 'memory') => void;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(set => ({
    accessToken: null,
    user: null,
    setAccessToken: (t, persist = 'local') => {
      tokenStorage.set(t, persist);
      set({ accessToken: t || null });
    },
    setUser: u => set({ user: u }),
    logout: () => {
      tokenStorage.clear();
      set({ accessToken: null, user: null });
    },
  })),
);
```

---

## E. Feature modules mapped to BE endpoints

Below are **types** + **API functions** per the provided POC. All functions **return `data`** and accept optional `{ signal }`.

### E1. Auth (`/api/auth/*`)

**types.ts**

```ts
export type RegisterReq = {
  email: string;
  password: string;
  full_name: string;
  child_name: string;
  child_age: number;
};
export type RegisterRes = {
  status: 'success';
  access_token: string;
  user: { user_id: string; email: string; full_name: string };
  learner: { learner_id: string; name: string; age: number };
};

export type LoginReq = { email: string; password: string };
export type LoginRes = {
  status: 'success';
  access_token: string;
  user: { user_id: string; learner_id: string };
};

export type MeRes = {
  status: 'success';
  user: { user_id: string; email: string; full_name: string };
  learner: {
    learner_id: string;
    name: string;
    age: number;
    profile_status: 'incomplete' | 'ready' | 'complete';
  };
};
```

**api.ts**

```ts
import type { LoginReq, LoginRes, MeRes, RegisterReq, RegisterRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function register(body: RegisterReq, signal?: AbortSignal) {
  const r = await api.post<RegisterRes>('/api/auth/register', body, {
    signal,
    _authOptional: true,
  });
  return r.data;
}
export async function login(body: LoginReq, signal?: AbortSignal) {
  const r = await api.post<LoginRes>('/api/auth/login', body, { signal, _authOptional: true });
  return r.data;
}
export async function me(signal?: AbortSignal) {
  const r = await api.get<MeRes>('/api/auth/me', { signal });
  return r.data;
}
```

**service.ts** (optional orchestrator)

```ts
import { useAuthStore } from '@/lib/auth/auth-store';
import * as AuthApi from './api';

export async function doRegister(payload: AuthApi.RegisterReq, persist: 'local' | 'session' | 'memory' = 'local') {
  const res = await AuthApi.register(payload);
  useAuthStore.getState().setAccessToken(res.access_token, persist);
  useAuthStore.getState().setUser({
    user_id: res.user.user_id,
    email: res.user.email,
    full_name: res.user.full_name,
    learner_id: res.learner.learner_id,
  });
  return res;
}

export async function doLogin(payload: AuthApi.LoginReq, persist: 'local' | 'session' | 'memory' = 'local') {
  const res = await AuthApi.login(payload);
  useAuthStore.getState().setAccessToken(res.access_token, persist);
  useAuthStore.getState().setUser({ user_id: res.user.user_id, learner_id: res.user.learner_id });
  return res;
}
```

### E2. Assessments (`POST /api/assessments`)

**types.ts**

```ts
export type AssessmentReq = {
  learner_id: string;
  parent_survey: {
    interests: string[];
    learning_style: string[];
    strengths: string[];
    weaknesses: string[];
  };
  minigame_results: Array<{
    game_type: 'math' | 'language' | 'logic' | 'creativity';
    metadata: { score: number; time_spent: number };
    detail_results?: any[];
  }>;
};
export type AssessmentRes = {
  status: 'success';
  assessment_id: string;
  ready_for_profile: boolean;
};
```

**api.ts**

```ts
import type { AssessmentReq, AssessmentRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function submitAssessment(body: AssessmentReq, signal?: AbortSignal) {
  const r = await api.post<AssessmentRes>('/api/assessments', body, { signal });
  return r.data;
}
```

### E3. Profiles (`/api/profiles/*`)

**types.ts**

```ts
export type GenerateProfileReq = { learner_id: string };
export type Profile = {
  learner_id: string;
  abilities: { math: number; language: number; creativity: number; logic: number };
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  learning_style: 'visual' | 'auditory' | 'kinesthetic';
};
export type GenerateProfileRes = { status: 'success'; profile: Profile };
export type GetProfileRes = GenerateProfileRes;
```

**api.ts**

```ts
import type { GenerateProfileReq, GenerateProfileRes, GetProfileRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function generateProfile(body: GenerateProfileReq, signal?: AbortSignal) {
  const r = await api.post<GenerateProfileRes>('/api/profiles/generate', body, { signal });
  return r.data;
}
export async function getProfile(learnerId: string, signal?: AbortSignal) {
  const r = await api.get<GetProfileRes>(`/api/profiles/${learnerId}`, { signal });
  return r.data;
}
```

### E4. Subjects (`GET /api/subjects`)

**types.ts**

```ts
export type Subject = { subject_id: string; name: string; code: string };
export type SubjectsRes = { status: 'success'; subjects: Subject[] };
```

**api.ts**

```ts
import type { SubjectsRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function getSubjects(signal?: AbortSignal) {
  const r = await api.get<SubjectsRes>('/api/subjects', { signal });
  return r.data;
}
```

### E5. Paths (`/api/paths/*`)

**types.ts**

```ts
export type GeneratePathReq = { learner_id: string; subject_id: string };
export type PathNode = {
  node_id: string;
  skill_name: string;
  order: number;
  status: 'available' | 'locked' | 'in_progress' | 'completed';
  dependencies: string[];
  estimated_sessions: number;
};
export type Path = {
  learner_id: string;
  subject: string;
  total_nodes: number;
  nodes: PathNode[];
};
export type GeneratePathRes = { status: 'success'; path_id: string; path: Path };
export type GetPathRes = GeneratePathRes;
```

**api.ts**

```ts
import type { GeneratePathReq, GeneratePathRes, GetPathRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function generatePath(body: GeneratePathReq, signal?: AbortSignal) {
  const r = await api.post<GeneratePathRes>('/api/paths/generate', body, { signal });
  return r.data;
}
export async function getPath(learnerId: string, subjectId: string, signal?: AbortSignal) {
  const r = await api.get<GetPathRes>(`/api/paths/${learnerId}/${subjectId}`, { signal });
  return r.data;
}
```

### E6. Sessions (`/api/sessions/*`)

**types.ts**

```ts
export type ActivityPhase = 'warm_up' | 'main' | 'practice' | 'reflection';
export type ActivityType = 'question' | 'game' | 'quiz' | 'video';
export type Activity = {
  activity_id: string;
  phase: ActivityPhase;
  type: ActivityType;
  content: any; // keep wide to allow BE variation
  duration: number; // minutes
};
export type Session = {
  session_id: string;
  learner_id: string;
  node_id: string;
  skill_name: string;
  duration: number; // minutes
  activities: Activity[];
};

export type GenerateSessionReq = { learner_id: string; node_id: string };
export type GenerateSessionRes = { status: 'success'; session_id: string; session: Session };
export type GetSessionRes = GenerateSessionRes;

export type StartSessionRes = { status: 'success'; session_id: string; started_at: string };

export type SubmitActivityResultReq = {
  completed: boolean;
  score: number; // 0..1
  time_spent: number; // seconds
  answer?: any;
};
export type SubmitActivityResultRes = {
  status: 'success';
  activity_id: string;
  is_correct?: boolean;
  feedback?: string;
};

export type CompleteSessionReq = { overall_feedback?: string };
export type CompleteSessionRes = {
  status: 'success';
  session_summary: {
    total_activities: number;
    completed: number;
    average_score: number;
    time_spent: number;
  };
  progress: { node_completed: boolean; next_node_unlocked: boolean; profile_updated: boolean };
  feedback: { strengths_shown: string[]; areas_to_practice: string[]; next_recommendation: string };
};
```

**api.ts**

```ts
import type {
  CompleteSessionReq,
  CompleteSessionRes,
  GenerateSessionReq,
  GenerateSessionRes,
  GetSessionRes,
  StartSessionRes,
  SubmitActivityResultReq,
  SubmitActivityResultRes,
} from './types';
import { api } from '@/lib/http/axios-client';

export async function generateSession(body: GenerateSessionReq, signal?: AbortSignal) {
  const r = await api.post<GenerateSessionRes>('/api/sessions/generate', body, { signal });
  return r.data;
}
export async function getSession(sessionId: string, signal?: AbortSignal) {
  const r = await api.get<GetSessionRes>(`/api/sessions/${sessionId}`, { signal });
  return r.data;
}
export async function startSession(sessionId: string, signal?: AbortSignal) {
  const r = await api.post<StartSessionRes>(`/api/sessions/${sessionId}/start`, {}, { signal });
  return r.data;
}
export async function submitActivityResult(
  sessionId: string,
  activityId: string,
  body: SubmitActivityResultReq,
  signal?: AbortSignal,
) {
  const r = await api.post<SubmitActivityResultRes>(
    `/api/sessions/${sessionId}/activities/${activityId}/result`,
    body,
    { signal },
  );
  return r.data;
}
export async function completeSession(sessionId: string, body: CompleteSessionReq, signal?: AbortSignal) {
  const r = await api.post<CompleteSessionRes>(`/api/sessions/${sessionId}/complete`, body, {
    signal,
  });
  return r.data;
}
```

### E7. Dashboard (`GET /api/dashboard/{learner_id}`)

**types.ts**

```ts
export type DashboardRes = {
  status: 'success';
  dashboard: {
    learner: { name: string; age: number };
    stats: {
      total_sessions: number;
      total_hours: number;
      current_streak: number;
      skills_mastered: number;
    };
    current_paths: Array<{ subject: string; progress: number; next_session_available: boolean }>;
    recent_sessions: Array<{
      session_id: string;
      skill_name: string;
      completed_at: string;
      score: number;
    }>;
  };
};
```

**api.ts**

```ts
import type { DashboardRes } from './types';
import { api } from '@/lib/http/axios-client';

export async function getDashboard(learnerId: string, signal?: AbortSignal) {
  const r = await api.get<DashboardRes>(`/api/dashboard/${learnerId}`, { signal });
  return r.data;
}
```

---

## F. Usage patterns & guidelines

- All API wrappers **accept `{ signal? }`** and **return typed `data`**.
- **401** anywhere ⇒ `auth-store.logout()` is already triggered by interceptor; UI should redirect to `/login`.
- **429** honored with `Retry-After`; long‑running endpoints (generate profile/path/session) should show spinners.
- Keep DTOs close to BE spec; if BE adds fields, extend the types.

## G. What to hand to Cursor AI

1. Paste the **file layout** and all **code blocks** above.
2. Ask Cursor to **create missing folders/files** and wire **barrel exports** per folder (optional).
3. Generate **tests** using `axios-mock-adapter` for: success, {status:'error'} body, 401, 429 with `Retry-After`.
4. Create 2 example screens consuming the modules: **Onboarding (register/login + me)** and **Learning Flow (subjects → generate path → generate/start session)**.

**End of FE POC Spec (JWT‑only, direct BE calls)**

---

# React Query Integration (Client‑side Data Layer)

> Adds **barrel exports** and **typed hooks** using `@tanstack/react-query` for all provided BE endpoints. FE continues calling BE **directly** via axios client (JWT only).

## 0) Install

```bash
npm i @tanstack/react-query
```

---

## 1) Provider setup (App Router)

**`src/app/query-provider.tsx`**

```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // 1m default; tune per feature
            gcTime: 5 * 60_000, // 5m cache
            retry: 1, // light retry at RQ layer; axios-retry already handles network/5xx
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0, // avoid double retry on non-idempotent ops
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

**`src/app/layout.tsx`** (wrap children)

```tsx
// ... existing imports
import QueryProvider from './query-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

---

## 2) Barrel exports per feature

Create `index.ts` inside each feature folder to centralize imports.

Examples:

**`src/features/auth/index.ts`**

```ts
export * as AuthApi from './api';
export * from './hooks';
export * from './service';
export * from './types';
```

**`src/features/sessions/index.ts`**

```ts
export * as SessionsApi from './api';
export * from './hooks';
export * from './types';
```

(Do the same for: `assessments`, `profiles`, `subjects`, `paths`, `dashboard`.)

---

## 3) Query Keys (stable & typed)

**`src/lib/react-query/keys.ts`**

```ts
export const QK = {
  me: ['auth', 'me'] as const,
  subjects: ['subjects', 'all'] as const,
  profile: (learnerId: string) => ['profiles', learnerId] as const,
  path: (learnerId: string, subjectId: string) => ['paths', learnerId, subjectId] as const,
  session: (sessionId: string) => ['sessions', sessionId] as const,
  dashboard: (learnerId: string) => ['dashboard', learnerId] as const,
};
```

---

## 4) Hooks for each feature

### 4.1 Auth hooks

**`src/features/auth/hooks.ts`**

```ts
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth/auth-store';
import { QK } from '@/lib/react-query/keys';
import * as AuthApi from './api';

export function useMe(enabled = true) {
  return useQuery({
    queryKey: QK.me,
    queryFn: () => AuthApi.me(),
    enabled,
    staleTime: 60_000,
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AuthApi.RegisterReq) => AuthApi.register(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AuthApi.LoginReq) => AuthApi.login(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}
```

### 4.2 Subjects hooks

**`src/features/subjects/hooks.ts`**

```ts
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
```

### 4.3 Profiles hooks

**`src/features/profiles/hooks.ts`**

```ts
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as ProfilesApi from './api';

export function useProfile(learnerId: string, enabled = true) {
  return useQuery({
    queryKey: QK.profile(learnerId),
    queryFn: () => ProfilesApi.getProfile(learnerId),
    enabled,
  });
}

export function useGenerateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProfilesApi.GenerateProfileReq) => ProfilesApi.generateProfile(body),
    onSuccess: (res) => {
      const id = res.profile.learner_id;
      qc.setQueryData(QK.profile(id), res);
    },
  });
}
```

### 4.4 Paths hooks

**`src/features/paths/hooks.ts`**

```ts
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as PathsApi from './api';

export function usePath(learnerId: string, subjectId: string, enabled = true) {
  return useQuery({
    queryKey: QK.path(learnerId, subjectId),
    queryFn: () => PathsApi.getPath(learnerId, subjectId),
    enabled,
  });
}

export function useGeneratePath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PathsApi.GeneratePathReq) => PathsApi.generatePath(body),
    onSuccess: (res) => {
      const { learner_id } = res.path;
      const { subject } = res.path;
      qc.setQueryData(QK.path(learner_id, subject), res);
    },
  });
}
```

### 4.5 Sessions hooks

**`src/features/sessions/hooks.ts`**

```ts
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';
import * as SessionsApi from './api';

export function useSession(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: QK.session(sessionId),
    queryFn: () => SessionsApi.getSession(sessionId),
    enabled,
  });
}

export function useGenerateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SessionsApi.GenerateSessionReq) => SessionsApi.generateSession(body),
    onSuccess: (res) => {
      qc.setQueryData(QK.session(res.session.session_id), res);
    },
  });
}

export function useStartSession() {
  return useMutation({ mutationFn: (sessionId: string) => SessionsApi.startSession(sessionId) });
}

export function useSubmitActivityResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { sessionId: string; activityId: string; body: SessionsApi.SubmitActivityResultReq }) =>
      SessionsApi.submitActivityResult(p.sessionId, p.activityId, p.body),
    onSuccess: (_res, vars) => {
      // Optionally refetch session to update progress
      qc.invalidateQueries({ queryKey: QK.session(vars.sessionId) });
    },
  });
}

export function useCompleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { sessionId: string; body: SessionsApi.CompleteSessionReq }) =>
      SessionsApi.completeSession(p.sessionId, p.body),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: QK.session(vars.sessionId) });
    },
  });
}
```

### 4.6 Assessments hooks

**`src/features/assessments/hooks.ts`**

```ts
'use client';
import { useMutation } from '@tanstack/react-query';
import * as AssessmentsApi from './api';

export function useSubmitAssessment() {
  return useMutation({
    mutationFn: (body: AssessmentsApi.AssessmentReq) => AssessmentsApi.submitAssessment(body),
  });
}
```

### 4.7 Dashboard hooks

**`src/features/dashboard/hooks.ts`**

```ts
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
```

---

## 5) Example usage (pages/components)

**`src/app/(app)/subjects/page.tsx`**

```tsx
'use client';
import { useSubjects } from '@/features/subjects/hooks';

export default function SubjectsPage() {
  const { data, isLoading, error } = useSubjects();
  if (isLoading) {
    return <div>Đang tải môn học…</div>;
  }
  if (error) {
    return <div>Lỗi tải môn học</div>;
  }
  return (
    <ul>
      {data?.subjects?.map(s => (
        <li key={s.subject_id}>{s.name}</li>
      ))}
    </ul>
  );
}
```

**`src/app/(app)/learn/[learnerId]/[subjectId]/path/page.tsx`**

```tsx
'use client';
import { useParams } from 'next/navigation';
import { usePath } from '@/features/paths/hooks';

export default function PathPage() {
  const { learnerId, subjectId } = useParams<{ learnerId: string; subjectId: string }>();
  const { data, isLoading } = usePath(learnerId, subjectId);
  if (isLoading) {
    return <div>Đang tải lộ trình…</div>;
  }
  return <pre>{JSON.stringify(data?.path, null, 2)}</pre>;
}
```

---

## 6) Notes

- Hooks **không** ẩn axios errors: mọi lỗi đều là `ApiError` đã chuẩn hoá.
- `QueryClient` retry set thấp (1) để tránh trùng với axios‑retry; bạn có thể tăng `staleTime`/`gcTime` per hook.
- Với thao tác **không idempotent** (start/complete/submit), retry ở hook = 0 (theo default). Nếu muốn retry, chỉ thực hiện khi BE hỗ trợ idempotency.

**End — React Query Integration & Hooks**
