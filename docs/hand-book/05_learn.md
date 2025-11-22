# Learn Flow - Trang Học Tập

## Tổng Quan

Màn hình Learn cho phép user:
1. Chọn môn học
2. Generate learning path (nếu chưa có)
3. Xem learning path visualization
4. Click vào node để generate session

**Route:** `/learn`

---

## Files Involved

### Pages
- `src/app/[locale]/(shell)/learn/page.tsx` - Layout + metadata
- `src/app/[locale]/(shell)/learn/LearnPageClient.tsx` - Main logic
- `src/app/[locale]/(shell)/learn/LearnLandingContainer.tsx` - Path container
- `src/app/[locale]/(shell)/learn/LearnLanding.tsx` - Path visualization

### Features
- `src/features/subjects/api.ts` - Subjects API
- `src/features/subjects/hooks.ts` - Subjects hooks
- `src/features/paths/api.ts` - Paths API
- `src/features/paths/hooks.ts` - Paths hooks

### Components
- `src/components/organisms/LearnLanding.tsx` - Path visualization
- `src/components/organisms/PathProgressMap.tsx` - Progress map
- `src/components/molecules/ResponsiveNavBar.tsx` - Navigation bar

### Hooks
- `src/hooks/useNodeSessionGenerator.ts` - Generate session from node

---

## Component Hierarchy

```
LearnPageClient
├── Check auth & profile
├── SubjectSelection UI (if no subject selected)
├── PathGeneration UI (if generating path)
└── LearnLandingContainer
    └── LearnLanding
        ├── PathProgressMap
        └── useNodeSessionGenerator
```

---

## LearnPageClient Component

### Structure

```typescript:src/app/[locale]/(shell)/learn/LearnPageClient.tsx
export function LearnPageClient() {
  // Auth
  const { user } = useAuthStore();
  const { data: meData, isLoading: meLoading } = useMe(true);
  const { isLoading: profileCheckLoading } = useProfileStatusCheck();

  // State
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  // API Hooks
  const subjectsQuery = useSubjects();
  const pathQuery = usePath(learnerId, selectedSubject, Boolean(learnerId && selectedSubject));
  const generatePathMutation = useGeneratePath();

  // Derived
  const learnerId = user?.learner_id || meData?.learner.learner_id;
}
```

### Render States

#### 1. Loading State
```typescript
if (meLoading || profileCheckLoading || !learnerId) {
  return <Spinner />;
}
```

#### 2. Generating Path State
```typescript
if (generatePathMutation.isPending) {
  return (
    <Card>
      <CardTitle>Setting Up Your Learning</CardTitle>
      <Spinner />
      <p>Generating your learning path...</p>
    </Card>
  );
}
```

#### 3. Subject Selection UI
```typescript
if (!selectedSubject || pathError || (!pathLoading && !pathData)) {
  return (
    <Card>
      <CardTitle>🎯 Chọn Môn Học Của Bạn</CardTitle>
      <div className="grid grid-cols-3">
        {subjects.map(subject => (
          <Button onClick={() => setSelectedSubject(subject.subject_id)}>
            {subject.code} {subject.name}
          </Button>
        ))}
      </div>
    </Card>
  );
}
```

#### 4. Path Display
```typescript
return <LearnLandingContainer learnerId={learnerId} subjectId={selectedSubject} />;
```

---

## Subject Selection

### UI Flow

```
┌────────────────────┐
│   Subject Grid     │
│   📚 📖 🔬 🎨     │
│  [Math] [Eng] [...]│
└──────────┬─────────┘
            │ Click
            ▼
┌────────────────────┐
│ selectedSubject    │
│  = "math"         │
└──────────┬─────────┘
            │
            ▼
┌────────────────────┐
│  Generate Path     │
│  (Auto or Manual) │
└────────────────────┘
```

### Subjects Data

```typescript
const { data: subjectsData } = useSubjects();

// subjectsData structure:
{
  subjects: [
    { subject_id: 'math', name: 'Math', code: '📚' },
    { subject_id: 'english', name: 'English', code: '📖' },
    { subject_id: 'science', name: 'Science', code: '🔬' },
  ];
}
```

### Select Subject

```typescript
<Button onClick={() => setSelectedSubject(subject.subject_id)}>
  {subject.code} {subject.name}
</Button>
```

---

## Path Generation

### Auto-Generation Logic

```typescript
useEffect(() => {
  if (selectedSubject && learnerId && !pathLoading && !pathData && !generatePathMutation.isPending) {
    generatePathMutation.mutate({
      learner_id: learnerId,
      subject_id: selectedSubject,
    });
  }
}, [selectedSubject, learnerId, pathLoading, pathData, generatePathMutation]);
```

**Condition:** Only generate nếu chưa có path data.

### Manual Generation

```typescript
const handleGeneratePath = async () => {
  await generatePathMutation.mutateAsync({
    learner_id: learnerId,
    subject_id: selectedSubject,
  });
};
```

### Generate Path API

```typescript
POST /api/paths/generate
{
  "learner_id": "uuid",
  "subject_id": "math"
}

// Response
{
  "path": {
    "path_id": "uuid",
    "learner_id": "uuid",
    "subject_id": "math",
    "nodes": [...]
  }
}
```

---

## LearnLandingContainer

### Component Logic

```typescript:src/app/[locale]/(shell)/learn/LearnLandingContainer.tsx
export default function LearnLandingContainer({ learnerId, subjectId }) {
  const { data, isPending, isFetching } = usePath(learnerId, subjectId, Boolean(learnerId && subjectId));
  const path = (data?.path ?? null) as PathWithMeta | null;

  if (isPending || isFetching) {
    return <Spinner />;
  }

  if (!path) {
    return <div>Unable to load learning path</div>;
  }

  return <LearnLanding path={path} />;
}
```

**Purpose:** Fetch path data và pass to LearnLanding component.

---

## LearnLanding Component

### Path Data Structure

```typescript
type PathWithMeta = {
  path_id: string;
  learner_id: string;
  subject_id: string;
  subject: string;
  nodes: PathNodeWithMeta[];
  progress?: {
    completed_nodes: string[];
    total_nodes: number;
  };
};

type PathNodeWithMeta = {
  node_id: string;
  unit_title: string;
  label: string;
  order: number;
  status: 'completed' | 'in_progress' | 'locked';
  progress: number; // 0-100
  icon?: string;
  jumpAvailable?: boolean;
};
```

### buildSections() Logic

```typescript:src/components/organisms/LearnLanding.tsx
function buildSections(path: PathWithMeta): SectionsResult {
  const nodes = Array.isArray(path.nodes) ? [...path.nodes] : [];

  // Group by unit_title
  const grouped = nodes.reduce<Map<string, LessonNode[]>>((acc, lesson) => {
    const list = acc.get(lesson.unitTitle);
    if (list) {
      list.push(lesson);
    } else {
      acc.set(lesson.unitTitle, [lesson]);
    }
    return acc;
  }, new Map());

  // Convert to sections
  const sections = Array.from(grouped.entries()).map(([title, lessons], idx) => ({
    level: idx + 1,
    title,
    description: `${title} - ${lessons.length} lessons`,
    nodes: lessons.map(lesson => ({
      ...lesson,
      level: idx + 1,
    })),
  }));

  return { sections, meta: {...} };
}
```

**Purpose:** Transform path data thành sections for visualization.

---

## Path Progress Map

### Component Structure

```typescript
<PathProgressMap
  sections={sections}
  onJumpToSession={handleNodeSelect}
  onSelectSession={handleNodeSelect}
/>
```

**Props:**
- `sections`: Grouped lessons by unit
- `onJumpToSession`: Jump to specific session
- `onSelectSession`: Select session to start

### Node Selection

```typescript
const handleNodeSelect = async (nodeId: string) => {
  await generateAndNavigate(nodeId);
};
```

**Flow:** Click node → Generate session → Navigate to session.

---

## Session Generation (useNodeSessionGenerator)

### Hook Implementation

```typescript:src/hooks/useNodeSessionGenerator.ts
export function useNodeSessionGenerator() {
  const router = useRouter();
  const generateSession = useGenerateSession();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAndNavigate = async (nodeId: string) => {
    setIsGenerating(true);
    try {
      const result = await generateSession.mutateAsync({
        learner_id: learnerId,
        node_id: nodeId,
      });

      const sessionId = result.session_id || result.session?.session_id;
      router.push(`/learn/session/${sessionId}`);
    } catch (err) {
      setError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateAndNavigate, isGenerating, error };
}
```

### Generate Session API

```typescript
POST /api/sessions/generate
{
  "learner_id": "uuid",
  "node_id": "node-123"
}

// Response
{
  "session": {
    "session_id": "uuid",
    "node_id": "node-123",
    "activities": [...]
  }
}
```

---

## Loading & Error States

### Loading Overlay

```typescript
{isGenerating && (
  <div className="fixed inset-0 z-100 bg-black/50">
    <div className="rounded-2xl bg-[#1a1a2e] p-6">
      <Spinner />
      <p>Generating your lesson...</p>
    </div>
  </div>
)}
```

### Error Toast

```typescript
{error && (
  <div className="fixed bottom-6 z-100 bg-red-500 px-6 py-3 text-white rounded-lg">
    {error.message}
  </div>
)}
```

---

## Navigation Flow

```
/learn
├── Check auth → Redirect to /login if not authenticated
├── Check profile → Redirect to /assessment if no profile
├── Select subject (if no subject selected)
├── Generate path (if no path exists)
└── Show path visualization
    └── Click node
        └── Generate session
            └── Navigate to /learn/session/[id]
```

---

## Common Issues

### Issue 1: Path Not Generating

**Symptom:** Path never loads
**Cause:** API call fails hoặc backend doesn't have path data
**Fix:** Check backend API, ensure profile exists

### Issue 2: Session Generation Fails

**Symptom:** Cannot start session from node
**Cause:** Node data missing hoặc API timeout
**Fix:** Check backend logs, retry generation

### Issue 3: Wrong Subject Selected

**Symptom:** Path shows wrong subject content
**Fix:** Clear path cache, regenerate:
```typescript
qc.invalidateQueries({ queryKey: QK.path(learnerId, subjectId) });
```

---

## Next Flow

Sau khi click node và generate session:
- User được navigate đến `/learn/session/[id]`
- Session page load và start session
- User làm các activities trong session

**→ [Session Flow](./06_session.md)**
