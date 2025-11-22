# Web App Hand-over Documentation

## Mục Đích

Tài liệu này cung cấp kiến thức cần thiết để phát triển tiếp web app learning flow, giúp thành viên team mới hiểu rõ architecture và implementation.

## Tài Liệu Bao Gồm

### 1. [Tổng Quan](./01_overview.md)
- Tech stack
- Project structure
- State management pattern
- API integration pattern
- Component architecture
- Common patterns

### 2. [Login Flow](./02_login.md)
- Đăng nhập/đăng ký
- Token management
- Auth store
- Navigation flow

### 3. [Assessment Flow](./03_assessment.md)
- Khảo sát sở thích học tập
- Submit assessment
- Profile generation
- Multi-step flow

### 4. [Profile System](./04_profile.md)
- Profile structure
- Profile generation API
- Profile caching
- Integration với other flows

### 5. [Learn Flow](./05_learn.md)
- Subject selection
- Path generation
- Path visualization
- Session generation
- Node selection

### 6. [Session Flow](./06_session.md)
- Activity rendering
- Activity submission
- Progress tracking
- Complete session flow

---

## User Journey

```
Login → Assessment → Profile → Learn → Session → Back to Learn
```

Chi tiết từng bước được document trong các file tương ứng.

---

## Quick Start

### Đọc Theo Thứ Tự

1. **Đọc tổng quan** để hiểu architecture
2. **Đọc từng flow** để hiểu implementation
3. **Reference code** khi cần implement thêm features

### Khi Muốn Thêm Feature

1. Xác định flow liên quan (Login/Assessment/...)
2. Đọc file tương ứng để hiểu pattern
3. Follow existing pattern để implement
4. Update documentation nếu cần

---

## Key Concepts

### Tech Stack
- **Next.js 15** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching
- **Axios** - HTTP client

### Patterns

#### Component Pattern
```typescript
// Page component
export function FeaturePageClient() {
  const { data, isLoading } = useQuery(...);
  return <UI />;
}

// Feature component
export function FeatureComponent({ data }) {
  return <PureUI />;
}
```

#### API Pattern
```typescript
// api.ts
export async function getData(): Promise<Data> {
  const r = await api.get<Data>('/endpoint');
  return r.data;
}

// hooks.ts
export function useData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: () => DataApi.getData(),
  });
}
```

#### State Management Pattern
```typescript
// Zustand store
export const useStore = create(set => ({
  data: null,
  setData: data => set({ data }),
}));

// Usage
const { data, setData } = useStore();
```

---

## File Organization

```
src/
├── app/[locale]/              # Routes
│   ├── login/
│   ├── assessment/
│   └── (shell)/learn/
├── components/                 # UI components
│   ├── ui/
│   ├── organisms/
│   └── sessions/
├── features/                   # Business logic
│   ├── auth/
│   ├── assessments/
│   ├── profiles/
│   ├── sessions/
│   ├── paths/
│   └── subjects/
├── stores/                     # Zustand stores
│   ├── auth-store.ts
│   └── session-flow-store.ts
└── lib/                        # Utilities
    ├── auth/
    └── http/
```

---

## Common Tasks

### Thêm API Endpoint

1. Add types in `features/{domain}/types.ts`
2. Add API function in `features/{domain}/api.ts`
3. Add React Query hook in `features/{domain}/hooks.ts`
4. Use hook in component

### Thêm Component

1. Create component in appropriate directory
2. Follow naming convention (PascalCase)
3. Use TypeScript interfaces for props
4. Use Tailwind CSS for styling

### Thêm Page

1. Create route in `app/[locale]`
2. Create page component
3. Create client component (nếu cần)
4. Add metadata

### Debug API

1. Check API endpoint in DevTools Network tab
2. Check response data
3. Check React Query cache
4. Check Zustand store state

---

## Testing

### Manual Testing Flow

```
1. /login → Register account
2. /assessment → Complete assessment
3. /learn → Select subject → Generate path
4. /learn → Click node → Generate session
5. /learn/session/[id] → Complete activities → Finish
6. /learn → Back to learn (check progress)
```

### Expected Behavior

- Token persists after refresh
- Profile generated after assessment
- Path generated after subject selection
- Session loads and navigates through activities
- Progress updated after completing session

---

## Troubleshooting

### Issue: Token Not Working

**Check:**
1. Token storage in Zustand store
2. Token injection in Axios interceptor
3. Backend API authentication

### Issue: Profile Not Generating

**Check:**
1. Assessment data submitted
2. Backend AI service running
3. React Query cache

### Issue: Path Not Loading

**Check:**
1. Subject selected
2. Backend path generation API
3. React Query cache
4. Profile exists

### Issue: Session Not Starting

**Check:**
1. Session data loaded
2. Activities array not empty
3. Start session API call
4. Zustand store state

---

## Resources

### Documentation
- Next.js: https://nextjs.org/docs
- React Query: https://tanstack.com/query
- Zustand: https://github.com/pmndrs/zustand
- Tailwind CSS: https://tailwindcss.com/docs

### Code References
- [API Usage Complete](../API_USAGE_COMPLETE.md)
- [Implementation Complete](../interface/IMPLEMENTATION_COMPLETE.md)
- [Session Flow Guide](../guides/README_SESSION_FLOW.md)

---

## Questions?

Nếu có câu hỏi:
1. Đọc lại file liên quan trong docs/hand-book
2. Check code trong src/
3. Ask team lead hoặc senior developer

---

**Happy Coding!** 🚀
