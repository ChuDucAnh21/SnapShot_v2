# React Query Integration Implementation

This document describes the React Query layer added on top of the networking foundation for optimal client-side data management.

## ✅ What Was Implemented

### React Query Setup (2 files)

- **`src/app/query-provider.tsx`** - QueryClient provider with optimized defaults
- **`src/lib/react-query/keys.ts`** - Centralized, type-safe query keys

### Feature Hooks (7 modules)

Each feature module now has a `hooks.ts` file with typed React Query hooks:

1. **`src/features/auth/hooks.ts`**
   - `useMe()` - Get current user
   - `useLogin()` - Login mutation
   - `useRegister()` - Register mutation

2. **`src/features/subjects/hooks.ts`**
   - `useSubjects()` - List all subjects

3. **`src/features/profiles/hooks.ts`**
   - `useProfile(learnerId)` - Get profile
   - `useGenerateProfile()` - Generate profile mutation

4. **`src/features/paths/hooks.ts`**
   - `usePath(learnerId, subjectId)` - Get learning path
   - `useGeneratePath()` - Generate path mutation

5. **`src/features/sessions/hooks.ts`**
   - `useSession(sessionId)` - Get session
   - `useGenerateSession()` - Generate session mutation
   - `useStartSession()` - Start session mutation
   - `useSubmitActivityResult()` - Submit activity mutation
   - `useCompleteSession()` - Complete session mutation

6. **`src/features/assessments/hooks.ts`**
   - `useSubmitAssessment()` - Submit assessment mutation

7. **`src/features/dashboard/hooks.ts`**
   - `useDashboard(learnerId)` - Get dashboard data

### Updated Barrel Exports

All feature `index.ts` files now export their hooks for easy imports.

### Example Components (3 files)

- **`src/examples/SubjectsExample.tsx`** - Simple query usage
- **`src/examples/PathExample.tsx`** - Query + mutation with conditional fetching
- **`src/examples/SessionExample.tsx`** - Complex mutation workflow

## 🎯 Key Features

### Automatic Caching

- **Queries** cached for 1 minute by default (customizable per hook)
- **Background refetch** disabled (opt-in as needed)
- **Garbage collection** after 5 minutes of inactivity

### Smart Retry Logic

- **Queries**: 1 retry at React Query layer (axios-retry handles network/5xx)
- **Mutations**: 0 retries (avoid double-retry on non-idempotent ops)

### Optimistic Updates

- Mutations automatically invalidate related queries
- Some mutations set cache data directly (e.g., `useGenerateProfile`)

### Type Safety

- All hooks are fully typed
- Request/response types flow from feature modules
- Query keys are type-safe constants

## 🚀 Installation

```bash
npm install @tanstack/react-query
```

## 📦 Setup

### 1. Wrap your app with QueryProvider

Update your root layout or app wrapper:

```tsx
import QueryProvider from './query-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

### 2. Use hooks in components

```tsx
'use client';

import { useSubjects } from '@/features/subjects/hooks';

export function SubjectList() {
  const { data, isLoading, error } = useSubjects();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    );
  }

  return (
    <ul>
      {data?.subjects.map(s => (
        <li key={s.subject_id}>{s.name}</li>
      ))}
    </ul>
  );
}
```

## 💡 Usage Patterns

### Query with Conditional Fetching

```tsx
import { useProfile } from '@/features/profiles/hooks';

function ProfileCard({ learnerId }: { learnerId?: string }) {
  const { data, isLoading } = useProfile(
    learnerId || '',
    !!learnerId, // only fetch if learnerId exists
  );

  // ...
}
```

### Mutation with Callback

```tsx
import { useGeneratePath } from '@/features/paths/hooks';

function GeneratePathButton({ learnerId, subjectId }: Props) {
  const generatePath = useGeneratePath();

  async function handleClick() {
    try {
      const result = await generatePath.mutateAsync({
        learner_id: learnerId,
        subject_id: subjectId,
      });
      console.log('Path generated:', result.path);
    } catch (err) {
      console.error('Failed:', err);
    }
  }

  return (
    <button onClick={handleClick} disabled={generatePath.isPending}>
      {generatePath.isPending ? 'Generating...' : 'Generate Path'}
    </button>
  );
}
```

### Complex Workflow (Multi-step)

```tsx
import { useGenerateSession, useStartSession } from '@/features/sessions/hooks';

function StartSessionFlow({ learnerId, nodeId }: Props) {
  const generateSession = useGenerateSession();
  const startSession = useStartSession();

  async function handleStart() {
    // Step 1: Generate session
    const session = await generateSession.mutateAsync({
      learner_id: learnerId,
      node_id: nodeId,
    });

    // Step 2: Start it
    await startSession.mutateAsync(session.session.session_id);
  }

  return (
    <button onClick={handleStart} disabled={generateSession.isPending || startSession.isPending}>
      Start Session
    </button>
  );
}
```

### Manual Cache Updates

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { QK } from '@/lib/react-query/keys';

function MyComponent() {
  const qc = useQueryClient();

  function updateCache() {
    // Invalidate to trigger refetch
    qc.invalidateQueries({ queryKey: QK.subjects });

    // Or set data directly
    qc.setQueryData(QK.subjects, { subjects: [...] });
  }
}
```

## 🔑 Query Keys Reference

All query keys are centralized in `src/lib/react-query/keys.ts`:

```ts
QK.me; // ['auth', 'me']
QK.subjects; // ['subjects', 'all']
QK.profile(learnerId); // ['profiles', learnerId]
QK.path(learnerId, subjectId); // ['paths', learnerId, subjectId]
QK.session(sessionId); // ['sessions', sessionId]
QK.dashboard(learnerId); // ['dashboard', learnerId]
```

## ⚙️ Configuration

Default settings in `query-provider.tsx`:

```ts
{
  queries: {
    staleTime: 60_000,           // 1 minute
    gcTime: 5 * 60_000,          // 5 minutes
    retry: 1,                    // Light retry
    refetchOnWindowFocus: false, // Opt-in
  },
  mutations: {
    retry: 0,                    // No retry for mutations
  },
}
```

### Per-Hook Customization

```tsx
export function useSubjects() {
  return useQuery({
    queryKey: QK.subjects,
    queryFn: () => SubjectsApi.getSubjects(),
    staleTime: 5 * 60_000, // 5 minutes (subjects rarely change)
  });
}

export function useDashboard(learnerId: string) {
  return useQuery({
    queryKey: QK.dashboard(learnerId),
    queryFn: () => DashboardApi.getDashboard(learnerId),
    staleTime: 30_000, // 30 seconds (dashboard updates frequently)
  });
}
```

## 🧪 DevTools (Optional)

Install React Query DevTools for debugging:

```bash
npm install @tanstack/react-query-devtools
```

Add to your provider:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        /* ... */
      }),
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 🔄 Migration from Direct API Calls

**Before (direct API):**

```tsx
import * as SubjectsApi from '@/features/subjects/api';

function MyComponent() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    SubjectsApi.getSubjects()
      .then(res => setSubjects(res.subjects))
      .finally(() => setLoading(false));
  }, []);
}
```

**After (React Query):**

```tsx
import { useSubjects } from '@/features/subjects/hooks';

function MyComponent() {
  const { data, isLoading } = useSubjects();
  // Automatic caching, refetching, error handling!
}
```

## 📊 Benefits Over Direct API Calls

1. **Automatic Caching** - No duplicate requests
2. **Background Refetch** - Data stays fresh (when enabled)
3. **Loading & Error States** - Built-in state management
4. **Optimistic Updates** - UI feels instant
5. **Request Deduplication** - Multiple components, one request
6. **Garbage Collection** - Automatic memory cleanup
7. **DevTools** - Inspect cache, queries, mutations

## 📝 Notes

- Hooks **don't hide** axios errors - all errors are normalized `ApiError` instances
- Query retry is light (1x) to avoid duplication with axios-retry
- Mutations have 0 retry by default (only retry if backend supports idempotency)
- All hooks are `'use client'` - React Query is client-side only

## 🎓 Examples in Codebase

Check these files for complete working examples:

- `src/examples/SubjectsExample.tsx` - Simple query
- `src/examples/PathExample.tsx` - Conditional query + mutation
- `src/examples/SessionExample.tsx` - Multi-step mutation workflow
- `src/examples/LoginExample.tsx` - Auth without React Query (Zustand only)
- `src/examples/LearningPathExample.tsx` - Full flow without React Query

## 🔗 Additional Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [React Query Error Handling](https://tkdodo.eu/blog/react-query-error-handling)

---

**Implementation Status**: ✅ Complete
**All Files**: Ready for linting check
**Dependencies**: Requires `@tanstack/react-query`
**Ready for**: Production use with optimized caching
