# Assessment Flow - Đánh Giá Học Tập

## Tổng Quan

Màn hình assessment cho phép user đánh giá sở thích và năng lực học tập của học sinh để tạo personalized learning profile.

**Flow:** Survey → Submit Assessment → Generate Profile → Complete

---

## Files Involved

### Page Component
- `src/app/[locale]/assessment/page.tsx` - Layout wrapper
- `src/app/[locale]/assessment/AssessmentClient.tsx` - Main component

### Features
- `src/features/assessments/api.ts` - Assessment API
- `src/features/assessments/hooks.ts` - React Query hooks
- `src/features/profiles/api.ts` - Profile API
- `src/features/profiles/hooks.ts` - Profile hooks

---

## Component Structure

### AssessmentClient Component

```typescript:src/app/[locale]/assessment/AssessmentClient.tsx
export function AssessmentClient() {
  // Step management
  const [step, setStep] = useState<'survey' | 'profile' | 'complete'>('survey');

  // Selection state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // API hooks
  const surveysQuery = useSurveys('en');
  const submitAssessment = useSubmitAssessment();
  const generateProfile = useGenerateProfile();

  // Get learner ID
  const learnerId = user?.learner_id || meData?.learner.learner_id;
}
```

**Key States:**
- `step`: Current step in flow (survey → profile → complete)
- `selectedInterests`: Selected interest tags
- `learnerId`: From auth store or useMe hook

---

## Step 1: Survey (Khảo Sát)

### UI Flow

```typescript
if (step === 'survey') {
  return (
    // Survey card
    <Card>
      <CardHeader>
        <div>📝 Đánh giá học tập</div>
        <CardTitle>Hãy cho chúng tôi biết về sở thích học tập của bạn!</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Interest selection */}
        <div className="grid grid-cols-3">
          {interests.map(interest => (
            <Button
              selected={selectedInterests.includes(interest.key)}
              onClick={() => toggleInterest(interest.key)}
            >
              {interest.icon} {interest.label}
            </Button>
          ))}
        </div>

        {/* Submit button */}
        <Button onClick={handleSubmitAssessment}>
          🚀 Gửi đánh giá
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Interest Categories

Pre-defined interests:
- 🔢 Toán học (math)
- 🔬 Khoa học (science)
- 🎨 Nghệ thuật (art)
- 🎵 Âm nhạc (music)
- ⚽ Thể thao (sports)
- 📚 Đọc sách (reading)

### Submit Assessment

```typescript
const handleSubmitAssessment = async () => {
  await submitAssessment.mutateAsync({
    learner_id: learnerId,
    parent_survey: {
      interests: selectedInterests,
      learning_style: ['visual'],
      strengths: ['quick_learner'],
      weaknesses: [],
    },
    minigame_results: [{
      game_type: 'math',
      metadata: { score: 0.85, time_spent: 120 },
    }],
  });

  setStep('profile'); // Move to profile generation step
};
```

**API Call:**
```typescript
POST /api/assessments
{
  "learner_id": "uuid",
  "parent_survey": {...},
  "minigame_results": [...]
}
```

---

## Step 2: Profile Generation (Tạo Hồ Sơ)

### UI Flow

```typescript
if (step === 'profile') {
  return (
    <Card>
      <CardHeader>
        <div>🤖 Tạo hồ sơ cá nhân</div>
        <CardTitle>Tạo hồ sơ cá nhân</CardTitle>
        <CardDescription>
          Chúng tôi sẽ tạo hồ sơ học tập cá nhân dựa trên đánh giá của bạn
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          onClick={handleGenerateProfile}
          disabled={generateProfile.isPending}
        >
          {isLoading ? <Spinner /> : '⚡ Tạo hồ sơ cá nhân'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Generate Profile Logic

```typescript
const handleGenerateProfile = async () => {
  await generateProfile.mutateAsync({
    learner_id: learnerId
  });
  setStep('complete');
};
```

**API Call:**
```typescript
POST /api/profiles/generate
{
  "learner_id": "uuid"
}

// Response
{
  "profile": {
    "learner_id": "uuid",
    "abilities": ["math", "science"],
    "interests": ["visual_learning"],
    "strengths": ["quick_learner"],
    "weaknesses": ["needs_practice"],
    "learning_style": "visual"
  }
}
```

**Note:** Backend sẽ sử dụng assessment data để generate AI-powered profile.

---

## Step 3: Complete (Hoàn Tất)

### UI Flow

```typescript
if (step === 'complete') {
  return (
    <Card>
      <CardHeader>
        <div>🎉 Hoàn thành!</div>
        <CardTitle>Hồ sơ học tập cá nhân của bạn đã được tạo thành công!</CardTitle>
      </CardHeader>

      <CardContent>
        <Button onClick={() => router.push('/learn')}>
          🚀 Bắt đầu học tập
        </Button>
        <Button onClick={() => router.push('/profile')}>
          👤 Xem hồ sơ
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Navigation Options

- **Bắt đầu học tập** → Navigate to `/learn`
- **Xem hồ sơ** → Navigate to `/profile`

---

## API Integration

### useSurveys()

```typescript:src/features/assessments/hooks.ts
export function useSurveys(locale = 'en', enabled = true) {
  return useQuery({
    queryKey: ['surveys', locale],
    queryFn: ({ signal }) => AssessmentsApi.getSurveys(locale, signal),
    enabled,
    staleTime: 300_000,
  });
}
```

**API:** `GET /api/surveys?locale=en`

### useSubmitAssessment()

```typescript:src/features/assessments/hooks.ts
export function useSubmitAssessment() {
  return useMutation({
    mutationFn: (body: AssessmentReq) => AssessmentsApi.submitAssessment(body),
  });
}
```

**API:** `POST /api/assessments`

### useGenerateProfile()

```typescript:src/features/profiles/hooks.ts
export function useGenerateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GenerateProfileReq) => ProfilesApi.generateProfile(body),
    onSuccess: (res) => {
      qc.setQueryData(QK.profile(res.profile.learner_id), res);
    },
  });
}
```

**API:** `POST /api/profiles/generate`

**Note:** Profile được cache vào React Query cache sau khi generate.

---

## Access Control

### Check Authentication

```typescript
const learnerId = user?.learner_id || meData?.learner.learner_id;

if (!learnerId) {
  return (
    <Card>
      <CardTitle>🔐 Cần đăng nhập</CardTitle>
      <Button onClick={() => router.push('/login')}>
        Đi đến đăng nhập
      </Button>
    </Card>
  );
}
```

**Behavior:**
- Redirect to login nếu chưa authenticated
- Show assessment nếu đã authenticated

---

## Loading States

### Survey Loading

```typescript
{surveysQuery.isLoading && (
  <div className="text-center">
    <Spinner />
    <p>Đang tải câu hỏi...</p>
  </div>
)}
```

### Profile Generation Loading

```typescript
{generateProfile.isPending ? (
  <>
    <Spinner className="mr-3" />
    Đang tạo hồ sơ...
  </>
) : (
  '⚡ Tạo hồ sơ cá nhân'
)}
```

---

## Error Handling

### Display Errors

```typescript
try {
  await submitAssessment.mutateAsync({...});
  setStep('profile');
} catch (error) {
  console.error('Failed to submit assessment:', error);
  // Error state managed by React Query
}
```

**React Query automatically handles:**
- Network errors
- API errors (4xx, 5xx)
- Loading states
- Retry logic

---

## Flow Diagram

```
┌─────────────┐
│   Survey    │
│  (Select    │
│  Interests) │
└──────┬──────┘
       │ submitAssessment.mutateAsync()
       ▼
┌─────────────┐
│   Submit    │
│ Assessment  │
│  (API Call) │
└──────┬──────┘
       │ Success
       ▼
┌─────────────┐
│   Profile   │
│ Generation  │
│  (Generate) │
└──────┬──────┘
       │ generateProfile.mutateAsync()
       ▼
┌─────────────┐
│  Complete   │
│  (Navigate  │
│   to /learn)│
└─────────────┘
```

---

## Common Issues

### Issue 1: Profile Already Exists
**Symptom:** API returns error "Profile already exists"
**Fix:** Check existing profile before generating:
```typescript
const { data: existingProfile } = useProfile(learnerId);
if (existingProfile) {
  // Skip generation, go to complete
  setStep('complete');
}
```

### Issue 2: Selected Interests Empty
**Symptom:** Cannot submit without interests
**Fix:** Validation prevents submission:
```typescript
disabled={selectedInterests.length === 0}
```

### Issue 3: Backend Timeout
**Symptom:** Profile generation takes too long
**Fix:** Add timeout handling:
```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 30000);
```

---

## Next Flow

Sau khi hoàn thành assessment:
- Profile đã được tạo và cached
- User được redirect đến `/learn`
- Learning path generation sử dụng profile data

**→ [Learn Flow](./05_learn.md)**
