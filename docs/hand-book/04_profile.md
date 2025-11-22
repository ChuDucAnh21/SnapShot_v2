# Profile System - Hệ Thống Hồ Sơ

## Tổng Quan

Profile system quản lý learner profiles được AI-generated dựa trên assessment data. Profile chứa thông tin về abilities, interests, strengths, weaknesses, và learning style.

**Note:** Profile được tạo tự động sau khi submit assessment, không có UI riêng biệt (chỉ có optional profile view page).

---

## Files Involved

### Features
- `src/features/profiles/api.ts` - Profile API
- `src/features/profiles/hooks.ts` - React Query hooks
- `src/features/profiles/types.ts` - TypeScript types

### Hooks
- `src/hooks/useProfileStatusCheck.ts` - Check if profile exists

---

## Profile Types

### Profile Structure

```typescript:src/features/profiles/types.ts
export type Profile = {
  learner_id: string;
  abilities: string[]; // ["math", "reading", "science"]
  interests: string[]; // ["visual_learning", "hands_on"]
  strengths: string[]; // ["quick_learner", "focused"]
  weaknesses: string[]; // ["needs_practice", "distracted"]
  learning_style: string; // "visual" | "auditory" | "kinesthetic"
};
```

### Generate Profile Request

```typescript
export type GenerateProfileReq = {
  learner_id: string;
};
```

### Generate Profile Response

```typescript
export type GenerateProfileRes = {
  profile: Profile;
};
```

---

## API Integration

### API Functions

```typescript:src/features/profiles/api.ts
export async function getProfile(learnerId: string): Promise<ProfileRes> {
  const r = await api.get<ProfileRes>(`/profiles/${learnerId}`);
  return r.data;
}

export async function generateProfile(body: GenerateProfileReq): Promise<GenerateProfileRes> {
  const r = await api.post<GenerateProfileRes>('/profiles/generate', body);
  return r.data;
}
```

**Endpoints:**
- `GET /api/profiles/:learnerId` - Get existing profile
- `POST /api/profiles/generate` - Generate new profile (AI-powered)

---

## React Query Hooks

### useProfile()

```typescript:src/features/profiles/hooks.ts
export function useProfile(learnerId: string, enabled = true) {
  return useQuery({
    queryKey: QK.profile(learnerId),
    queryFn: () => ProfilesApi.getProfile(learnerId),
    enabled,
  });
}
```

**Usage:**
```typescript
const { data, isLoading, isError } = useProfile(learnerId);
const profile = data?.profile;
```

### useGenerateProfile()

```typescript:src/features/profiles/hooks.ts
export function useGenerateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GenerateProfileReq) => ProfilesApi.generateProfile(body),
    onSuccess: (res) => {
      // Cache profile after generation
      qc.setQueryData(QK.profile(res.profile.learner_id), res);
    },
  });
}
```

**Usage:**
```typescript
const generateProfile = useGenerateProfile();

await generateProfile.mutateAsync({ learner_id });
```

---

## Profile Status Check

### Hook Implementation

```typescript:src/hooks/useProfileStatusCheck.ts
export function useProfileStatusCheck() {
  const { user } = useAuthStore();
  const { data: meData } = useMe();
  const learnerId = user?.learner_id || meData?.learner.learner_id;

  const { data: profile, isLoading } = useProfile(learnerId || '', Boolean(learnerId));

  return {
    hasProfile: Boolean(profile),
    isLoading,
    profile: profile?.profile,
  };
}
```

**Usage:**
```typescript
const { hasProfile, isLoading, profile } = useProfileStatusCheck();

if (!hasProfile) {
  // Redirect to assessment
}
```

---

## Profile Usage

### In Learn Flow

Profile được sử dụng để:
1. **Generate Learning Path** - Backend sử dụng profile để generate personalized path
2. **Recommend Content** - Filter content based on learning style
3. **Track Progress** - Match abilities với completed lessons

### Profile Data Flow

```
┌──────────────┐
│  Assessment  │ ───▶ Submit assessment data
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Backend    │ ───▶ AI generates profile
│   (AI)       │      based on assessment
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Frontend   │ ───▶ Cache profile in React Query
│   (React     │      Use profile for path generation
│    Query)    │
└──────────────┘
```

---

## Profile View (Optional)

### Page Component

Có thể tạo page để view profile (out of scope cho flow chính):

```typescript
// src/app/[locale]/(shell)/profile/page.tsx
export default function ProfilePage() {
  const { profile, isLoading } = useProfileStatusCheck();

  if (!profile) {
    return <Redirect to="/assessment" />;
  }

  return (
    <div>
      <h1>Your Profile</h1>
      <div>Abilities: {profile.abilities.join(', ')}</div>
      <div>Interests: {profile.interests.join(', ')}</div>
      <div>Learning Style: {profile.learning_style}</div>
    </div>
  );
}
```

---

## Integration Points

### 1. Assessment Flow

Profile được generate sau assessment:

```typescript
// In AssessmentClient
const handleGenerateProfile = async () => {
  await generateProfile.mutateAsync({ learner_id });
  setStep('complete');
};
```

### 2. Learn Flow

Profile được check trước khi generate path:

```typescript
// In LearnPageClient or useProfileStatusCheck
const { hasProfile } = useProfileStatusCheck();

if (!hasProfile) {
  router.push('/assessment');
}

// Generate path uses profile data (backend-side)
await generatePathMutation.mutateAsync({
  learner_id,
  subject_id,
  // Backend uses profile internally
});
```

### 3. Session Flow

Profile có thể được dùng để adapt session content:

```typescript
// Backend uses profile to adjust:
// - Difficulty level
// - Content style (visual vs text)
// - Hint frequency
```

---

## Caching Strategy

### React Query Cache

Profile được cache sau generation:

```typescript
onSuccess: (res) => {
  qc.setQueryData(QK.profile(res.profile.learner_id), res);
};
```

**Key:** `['profile', learnerId]`

**Stale Time:** Default (no custom stale time)

**Invalidation:** Manual hoặc khi regenerate profile

---

## API Contract

### Get Profile

**Request:**
```bash
GET /api/profiles/:learnerId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "profile": {
    "learner_id": "uuid",
    "abilities": ["math", "reading"],
    "interests": ["visual_learning"],
    "strengths": ["quick_learner"],
    "weaknesses": [],
    "learning_style": "visual"
  }
}
```

### Generate Profile

**Request:**
```bash
POST /api/profiles/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "learner_id": "uuid"
}
```

**Response:**
```json
{
  "profile": {
    "learner_id": "uuid",
    "abilities": ["math", "science"],
    "interests": ["hands_on"],
    "strengths": ["focused"],
    "weaknesses": ["needs_practice"],
    "learning_style": "kinesthetic"
  }
}
```

---

## Common Issues

### Issue 1: Profile Not Found

**Symptom:** `GET /profiles/:learnerId` returns 404
**Cause:** Profile chưa được generate sau assessment
**Fix:** Ensure assessment flow calls `generateProfile()`

### Issue 2: Profile Caching Issue

**Symptom:** Old profile data shown
**Cause:** React Query cache not invalidated
**Fix:** Invalidate cache after regenerate:
```typescript
qc.invalidateQueries({ queryKey: QK.profile(learnerId) });
```

### Issue 3: Profile Generation Failure

**Symptom:** Generation returns error
**Cause:** Backend AI service unavailable hoặc insufficient assessment data
**Fix:** Check backend logs, ensure assessment data is complete

---

## Next Flow

Profile được sử dụng trong learn flow để generate personalized learning paths.

**→ [Learn Flow](./05_learn.md)**
