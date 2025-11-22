# Web App Hand-over Guide - Tổng Quan

## Mục Tiêu Tài Liệu
Tài liệu này nhằm bàn giao các phần web app chính cho thành viên team mới, giúp hiểu rõ cách hoạt động của hệ thống và có thể tiếp tục phát triển.

## Scope
- **Web App**: Các màn hình learning flow chính
- **Không bao gồm**: Game Hub (documentation riêng)

## User Journey - Luồng Người Dùng

```
┌─────────┐    ┌──────────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐
│  LOGIN  │───▶│  ASSESSMENT  │───▶│ PROFILE  │───▶│  LEARN  │───▶│ SESSION │
└─────────┘    └──────────────┘    └──────────┘    └─────────┘    └─────────┘
    ↓                ↓                    ↓              ↓              ↓
 Đăng nhập      Khảo sát học tập    Tạo profile    Chọn môn      Làm bài tập
  / Đăng ký      và interest       cá nhân        và path       các activity
```

### Chi Tiết Từng Bước

#### 1. **Login** (`/login`)
- Chức năng: Đăng nhập hoặc đăng ký tài khoản
- Files: `src/app/[locale]/login/LoginClient.tsx`
- Output: Token JWT + User info → lưu vào Zustand store

#### 2. **Assessment** (`/assessment`)
- Chức năng: Khảo sát sở thích và năng lực học tập của học sinh
- Files: `src/app/[locale]/assessment/AssessmentClient.tsx`
- Output: Assessment data → Profile generation

#### 3. **Profile** (tự động sau assessment)
- Chức năng: Tạo hồ sơ học tập cá nhân AI-powered
- Files: `src/features/profiles/`
- Output: Personalized learning profile

#### 4. **Learn** (`/learn`)
- Chức năng: Chọn môn học và xem learning path
- Files: `src/app/[locale]/(shell)/learn/LearnPageClient.tsx`
- Output: Learning path với các nodes/lessons

#### 5. **Session** (`/learn/session/[id]`)
- Chức năng: Học các activity trong một session
- Files: `src/app/[locale]/(shell)/learn/session/[id]/SessionClient.tsx`
- Output: Completed activities → Back to Learn

---

## Tech Stack

### Core Technologies
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (State management)
- **React Query** (Data fetching & caching)
- **Axios** (HTTP client)

### Project Structure

```
src/
├── app/[locale]/              # Routes & pages
│   ├── login/                 # Auth pages
│   ├── assessment/            # Assessment flow
│   └── (shell)/learn/         # Learning pages
│       ├── page.tsx           # Subject selection
│       └── session/[id]/      # Session detail
├── components/                # UI components
│   ├── ui/                    # Base components (shadcn/ui)
│   ├── organisms/             # Complex components
│   └── sessions/               # Activity components
├── features/                  # Business logic & API
│   ├── auth/                  # Authentication
│   ├── assessments/           # Assessments
│   ├── profiles/              # Learner profiles
│   ├── sessions/              # Learning sessions
│   ├── paths/                # Learning paths
│   └── subjects/              # Subjects
├── stores/                    # Zustand stores
│   ├── auth-store.ts         # Auth state
│   └── session-flow-store.ts # Session state
└── lib/                       # Utilities
    ├── auth/                  # Auth helpers
    └── http/                  # HTTP client config
```

---

## State Management

### Zustand Stores

#### 1. **Auth Store** (`src/lib/auth/auth-store.ts`)
Quản lý authentication state:
- `accessToken`: JWT token
- `user`: User info (user_id, learner_id, email, full_name)
- Actions: `setAccessToken()`, `setUser()`, `logout()`

#### 2. **Session Flow Store** (`src/stores/session-flow-store.ts`)
Quản lý session flow state:
- `currentIndex`: Activity hiện tại
- `started`: Session đã start hay chưa
- `activityStartTimes`: Track thời gian làm activity
- Actions: `setStarted()`, `next()`, `reset()`, `markActivityStart()`

### React Query

Tất cả API calls được quản lý bằng React Query hooks:
- Auto caching
- Refetching
- Loading/error states
- Optimistic updates

---

## API Integration Pattern

### Structure
```
features/
└── {domain}/
    ├── api.ts       # API functions (Axios calls)
    ├── hooks.ts     # React Query hooks
    └── types.ts     # TypeScript types
```

### Example: Auth

```typescript
// api.ts - API calls
export async function login(body: LoginReq) {
  const r = await api.post<LoginRes>('/auth/login', body);
  return r.data;
}

// hooks.ts - React Query hooks
export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginReq) => AuthApi.login(body),
  });
}

// Usage in component
const loginMutation = useLogin();
await loginMutation.mutateAsync({ email, password });
```

---

## Routing & Navigation

### App Router Structure
- `app/[locale]/` - All routes với i18n support
- `(shell)` - Layout wrapper cho authenticated pages
- `(game-hub)` - Game hub routes (out of scope)
- `(studio)` - Admin/studio pages (out of scope)

### Navigation Flow
- `router.push('/login')` - Navigate to login
- `router.push('/assessment')` - Navigate to assessment
- `router.push('/learn')` - Navigate to learn
- `router.push('/learn/session/[id]')` - Navigate to session
- `router.replace('/learn')` - Replace (back button)

---

## Component Architecture

### Component Hierarchy

#### Page Components
- Client components (use 'use client')
- Handle data fetching với React Query
- Handle navigation với useRouter
- Pass data to child components

#### Feature Components
- Pure UI components
- Receive props, emit events
- No business logic

#### Layout Components
- Shell layout với sidebar
- Right rail với dynamic sections
- Responsive navigation

---

## Styling

### Tailwind CSS
- Utility-first approach
- Custom color scheme (Iruka brand)
- Dark theme only
- Responsive breakpoints: `sm:`, `md:`, `lg:`

### Design System
- Shadcn/ui components
- Consistent spacing scale
- Card-based layouts
- Gradient backgrounds

---

## Important Files To Understand

### Entry Points
1. `src/app/[locale]/login/page.tsx` - Login entry
2. `src/app/[locale]/assessment/page.tsx` - Assessment entry
3. `src/app/[locale]/(shell)/learn/page.tsx` - Learn entry

### Key Hooks
1. `src/hooks/useProfileStatusCheck.ts` - Check profile exists
2. `src/hooks/useNodeSessionGenerator.ts` - Generate session from node
3. `src/hooks/useSessionNavigator.ts` - Navigate session flow

### Core Components
1. `src/components/organisms/LearnLanding.tsx` - Learn path visualization
2. `src/components/sessions/ActivityHost.tsx` - Activity router
3. `src/components/ui/*` - Base UI components

---

## Next Steps

📖 Đọc tiếp các files:
- [Login Flow](./02_login.md)
- [Assessment Flow](./03_assessment.md)
- [Profile System](./04_profile.md)
- [Learn Flow](./05_learn.md)
- [Session Flow](./06_session.md)

---

## Common Patterns

### 1. Check Authentication
```typescript
const { user } = useAuthStore();
const { data: meData } = useMe();

if (!user && !meData) {
  router.push('/login');
}
```

### 2. Get Learner ID
```typescript
const learnerId = user?.learner_id || meData?.learner.learner_id;
```

### 3. API Call với React Query
```typescript
const { data, isLoading, isError } = useQuery({
  queryKey: ['key'],
  queryFn: () => api.getData(),
});
```

### 4. Mutation
```typescript
const mutation = useMutation({
  mutationFn: data => api.postData(data),
});

await mutation.mutateAsync(data);
```

---

**Questions?** Check individual flow docs for detailed explanations.
