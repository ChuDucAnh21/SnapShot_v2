# Phase 2.2 - Leaderboard System

## 🏆 Overview

Hệ thống bảng xếp hạng (leaderboard) cho phép người chơi:
- Xem top scores của mỗi game
- So sánh với bạn bè và toàn cầu
- Theo dõi rank cá nhân
- Tạo động lực cạnh tranh lành mạnh

---

## 1. Data Model

### LeaderboardEntry

```typescript
type LeaderboardEntry = {
  playerId: string;
  playerName: string;
  playerAvatar?: string;
  score: number;
  rank: number;
  timestamp: string; // ISO 8601
  gameId: string;
  sessionId?: string;
  metadata?: {
    accuracy?: number;
    timeMs?: number;
    level?: number;
    difficulty?: string;
  };
};
```

### LeaderboardResponse

```typescript
type LeaderboardResponse = {
  gameId: string;
  gameName: string;
  scope: 'global' | 'friends' | 'today' | 'week' | 'month' | 'alltime';
  entries: LeaderboardEntry[];
  total: number;
  playerEntry?: LeaderboardEntry; // Current player's entry
  updatedAt: string;
};
```

---

## 2. API Routes

### 2.1 Get Leaderboard

**Endpoint**: `GET /api/game-hub/leaderboard/[gameId]`

**Query Params**:
- `scope`: 'global' | 'friends' | 'today' | 'week' | 'month' | 'alltime' (default: 'alltime')
- `limit`: number (default: 100, max: 500)
- `offset`: number (default: 0)

**Response**:
```json
{
  "gameId": "math-blitz",
  "gameName": "Math Blitz",
  "scope": "alltime",
  "entries": [
    {
      "playerId": "player-123",
      "playerName": "Nguyễn Văn A",
      "playerAvatar": "https://...",
      "score": 5000,
      "rank": 1,
      "timestamp": "2025-10-26T10:30:00Z",
      "metadata": {
        "accuracy": 95,
        "timeMs": 120000
      }
    }
    // ... more entries
  ],
  "total": 1234,
  "playerEntry": {
    "playerId": "player-456",
    "playerName": "Me",
    "score": 2500,
    "rank": 42
    // ...
  },
  "updatedAt": "2025-10-26T12:00:00Z"
}
```

**File**: `src/app/[locale]/api/game-hub/leaderboard/[gameId]/route.ts`

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const { gameId } = params;
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get('scope') || 'alltime';
  const limit = Number.parseInt(searchParams.get('limit') || '100', 10);
  const offset = Number.parseInt(searchParams.get('offset') || '0', 10);

  // TODO: Get playerId from session
  const playerId = 'player-123';

  try {
    // TODO: Fetch from database
    const leaderboard = await fetchLeaderboard({
      gameId,
      scope,
      limit,
      offset,
      playerId,
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
```

---

### 2.2 Get Player Rank

**Endpoint**: `GET /api/game-hub/leaderboard/[gameId]/player/[playerId]`

**Query Params**:
- `scope`: same as above

**Response**:
```json
{
  "playerId": "player-456",
  "playerName": "Me",
  "score": 2500,
  "rank": 42,
  "totalPlayers": 1234,
  "percentile": 96.5,
  "gameId": "math-blitz",
  "scope": "alltime"
}
```

**File**: `src/app/[locale]/api/game-hub/leaderboard/[gameId]/player/[playerId]/route.ts`

---

### 2.3 Submit Score

**Endpoint**: `POST /api/game-hub/leaderboard/[gameId]/submit`

**Body**:
```json
{
  "sessionId": "session-123",
  "score": 2500,
  "metadata": {
    "accuracy": 85,
    "timeMs": 120000,
    "level": 5,
    "difficulty": "normal"
  }
}
```

**Response**:
```json
{
  "success": true,
  "entry": {
    "playerId": "player-456",
    "score": 2500,
    "rank": 42,
    "improvement": 5, // Moved up 5 ranks
    "personalBest": true
  }
}
```

**File**: `src/app/[locale]/api/game-hub/leaderboard/[gameId]/submit/route.ts`

```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const { gameId } = params;
  const body = await request.json();
  const { sessionId, score, metadata } = body;

  // TODO: Verify session token
  // TODO: Validate score (anti-cheat)

  try {
    const entry = await submitScore({
      gameId,
      sessionId,
      score,
      metadata,
    });

    return NextResponse.json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error('Failed to submit score:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}
```

---

## 3. Frontend Components

### 3.1 LeaderboardModal

**Full-screen modal hiển thị bảng xếp hạng**

```tsx
type LeaderboardModalProps = {
  gameId: string;
  gameName: string;
  isOpen: boolean;
  onClose: () => void;
  initialScope?: LeaderboardScope;
};

export function LeaderboardModal({
  gameId,
  gameName,
  isOpen,
  onClose,
  initialScope = 'alltime',
}: LeaderboardModalProps) {
  const [scope, setScope] = useState<LeaderboardScope>(initialScope);
  const { data, isLoading, error } = useLeaderboard(gameId, scope);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            🏆 Bảng xếp hạng -
            {gameName}
          </DialogTitle>
        </DialogHeader>

        {/* Scope selector */}
        <Tabs value={scope} onValueChange={setScope}>
          <TabsList>
            <TabsTrigger value="today">Hôm nay</TabsTrigger>
            <TabsTrigger value="week">Tuần này</TabsTrigger>
            <TabsTrigger value="month">Tháng này</TabsTrigger>
            <TabsTrigger value="alltime">Tất cả</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Leaderboard list */}
        {isLoading
          ? (
            <LeaderboardSkeleton />
          )
          : error
            ? (
              <ErrorMessage error={error} />
            )
            : (
              <LeaderboardList
                entries={data.entries}
                playerEntry={data.playerEntry}
              />
            )}
      </DialogContent>
    </Dialog>
  );
}
```

**File**: `src/components/game-hub/leaderboard-modal.tsx` ⛔ DEFERRED

---

### 3.2 LeaderboardList

**Danh sách entries với highlight cho player**

```tsx
type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  playerEntry?: LeaderboardEntry;
};

export function LeaderboardList({ entries, playerEntry }: LeaderboardListProps) {
  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <LeaderboardRow
          key={entry.playerId}
          entry={entry}
          isPlayer={entry.playerId === playerEntry?.playerId}
          showMedal={index < 3}
        />
      ))}

      {/* Player entry (if not in top list) */}
      {playerEntry && !entries.some(e => e.playerId === playerEntry.playerId) && (
        <>
          <Separator className="my-4" />
          <LeaderboardRow
            entry={playerEntry}
            isPlayer={true}
            showMedal={false}
          />
        </>
      )}
    </div>
  );
}
```

---

### 3.3 LeaderboardRow

**Single entry trong leaderboard**

```tsx
type LeaderboardRowProps = {
  entry: LeaderboardEntry;
  isPlayer: boolean;
  showMedal: boolean;
};

export function LeaderboardRow({ entry, isPlayer, showMedal }: LeaderboardRowProps) {
  const medalEmoji = ['🥇', '🥈', '🥉'][entry.rank - 1];

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg transition-colors',
        isPlayer ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
      )}
    >
      {/* Rank */}
      <div className="text-center min-w-[3rem]">
        {showMedal
          ? (
            <span className="text-2xl">{medalEmoji}</span>
          )
          : (
            <span className="text-lg font-bold text-gray-600">
              #
              {entry.rank}
            </span>
          )}
      </div>

      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={entry.playerAvatar} />
        <AvatarFallback>{entry.playerName[0]}</AvatarFallback>
      </Avatar>

      {/* Name */}
      <div className="flex-1">
        <p className={cn('font-semibold', isPlayer && 'text-blue-700')}>
          {entry.playerName}
          {isPlayer && <span className="ml-2 text-xs">(You)</span>}
        </p>
        {entry.metadata?.timeMs && (
          <p className="text-xs text-gray-500">
            ⏱️
            {' '}
            {formatTime(entry.metadata.timeMs)}
          </p>
        )}
      </div>

      {/* Score */}
      <div className="text-right">
        <p className="text-xl font-bold text-gray-900">{entry.score}</p>
        {entry.metadata?.accuracy && (
          <p className="text-xs text-gray-500">
            {entry.metadata.accuracy}
            % chính xác
          </p>
        )}
      </div>
    </div>
  );
}
```

---

### 3.4 LeaderboardWidget

**Mini widget hiển thị trong game card**

```tsx
type LeaderboardWidgetProps = {
  gameId: string;
  scope?: LeaderboardScope;
  limit?: number;
};

export function LeaderboardWidget({
  gameId,
  scope = 'alltime',
  limit = 3,
}: LeaderboardWidgetProps) {
  const { data } = useLeaderboard(gameId, scope, limit);

  if (!data?.entries?.length) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Trophy className="h-4 w-4" />
        Top
        {' '}
        {limit}
      </h4>
      <div className="space-y-1">
        {data.entries.map((entry, idx) => (
          <div key={entry.playerId} className="flex justify-between text-xs">
            <span className="truncate">
              {idx + 1}
              .
              {entry.playerName}
            </span>
            <span className="font-semibold">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File**: `src/components/game-hub/leaderboard-widget.tsx`

---

### 3.5 RankBadge

**Badge hiển thị rank của player**

```tsx
type RankBadgeProps = {
  rank: number;
  totalPlayers?: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentile?: boolean;
};

export function RankBadge({
  rank,
  totalPlayers,
  size = 'md',
  showPercentile = false,
}: RankBadgeProps) {
  const percentile = totalPlayers
    ? Math.round(((totalPlayers - rank) / totalPlayers) * 100)
    : null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={cn('inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-full', sizeClasses[size])}>
      <Trophy className="h-4 w-4 text-yellow-600" />
      <span className="font-bold text-yellow-800">
        #
        {rank}
        {showPercentile && percentile && (
          <span className="ml-1 text-xs font-normal">
            (Top
            {' '}
            {percentile}
            %)
          </span>
        )}
      </span>
    </div>
  );
}
```

**File**: `src/components/game-hub/rank-badge.tsx`

---

## 4. React Query Hooks

### useLeaderboard

```typescript
export function useLeaderboard(
  gameId: string,
  scope: LeaderboardScope = 'alltime',
  limit = 100
) {
  return useQuery({
    queryKey: ['leaderboard', gameId, scope, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/game-hub/leaderboard/${gameId}?scope=${scope}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      return response.json() as Promise<LeaderboardResponse>;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
  });
}
```

### usePlayerRank

```typescript
export function usePlayerRank(
  gameId: string,
  playerId: string,
  scope: LeaderboardScope = 'alltime'
) {
  return useQuery({
    queryKey: ['player-rank', gameId, playerId, scope],
    queryFn: async () => {
      const response = await fetch(
        `/api/game-hub/leaderboard/${gameId}/player/${playerId}?scope=${scope}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch player rank');
      }
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}
```

### useSubmitScore

```typescript
export function useSubmitScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gameId,
      sessionId,
      score,
      metadata,
    }: {
      gameId: string;
      sessionId: string;
      score: number;
      metadata?: any;
    }) => {
      const response = await fetch(
        `/api/game-hub/leaderboard/${gameId}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, score, metadata }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate leaderboard queries
      queryClient.invalidateQueries({
        queryKey: ['leaderboard', variables.gameId],
      });
      queryClient.invalidateQueries({
        queryKey: ['player-rank', variables.gameId],
      });
    },
  });
}
```

**File**: `src/hooks/useLeaderboard.ts`

---

## 5. Store Integration

### Update GameHubStore

```typescript
// Add to game-hub-store.ts
export type GameHubState = {
  // ... existing state

  // Leaderboard
  leaderboards: Record<string, LeaderboardResponse>;
  playerRanks: Record<string, LeaderboardEntry>;

  // Actions
  setLeaderboard: (gameId: string, data: LeaderboardResponse) => void;
  setPlayerRank: (gameId: string, entry: LeaderboardEntry) => void;
};
```

---

## 6. Integration with Game Results

### Auto-submit score after game complete

```tsx
// In GameLauncher component
const handleComplete = async (data: { score: number; timeMs: number }) => {
  // Submit score to leaderboard
  const submitScore = useSubmitScore();

  try {
    const result = await submitScore.mutateAsync({
      gameId: game.id,
      sessionId: currentSession.sessionId,
      score: data.score,
      metadata: {
        timeMs: data.timeMs,
        accuracy: calculateAccuracy(), // From game
      },
    });

    // Show results modal with rank
    setResultsData({
      ...data,
      rank: result.entry.rank,
      improvement: result.entry.improvement,
      personalBest: result.entry.personalBest,
    });
    setShowResults(true);
  } catch (error) {
    console.error('Failed to submit score:', error);
    // Still show results, just without rank
  }
};
```

---

## 7. Mock Data for Development

```typescript
// src/lib/game-hub/mock-leaderboard.ts

export const MOCK_LEADERBOARD: LeaderboardResponse = {
  gameId: 'math-blitz',
  gameName: 'Math Blitz',
  scope: 'alltime',
  entries: [
    {
      playerId: 'player-001',
      playerName: 'Nguyễn Văn A',
      playerAvatar: 'https://i.pravatar.cc/150?img=1',
      score: 5000,
      rank: 1,
      timestamp: '2025-10-26T10:00:00Z',
      gameId: 'math-blitz',
      metadata: { accuracy: 98, timeMs: 120000 },
    },
    {
      playerId: 'player-002',
      playerName: 'Trần Thị B',
      playerAvatar: 'https://i.pravatar.cc/150?img=2',
      score: 4800,
      rank: 2,
      timestamp: '2025-10-26T09:30:00Z',
      gameId: 'math-blitz',
      metadata: { accuracy: 95, timeMs: 130000 },
    },
    // ... more mock data
  ],
  total: 1234,
  playerEntry: {
    playerId: 'player-456',
    playerName: 'You',
    score: 2500,
    rank: 42,
    timestamp: '2025-10-26T11:00:00Z',
    gameId: 'math-blitz',
    metadata: { accuracy: 85, timeMs: 150000 },
  },
  updatedAt: '2025-10-26T12:00:00Z',
};
```

---

## 8. Anti-Cheat Measures

### Score Validation

```typescript
// Validate score is within reasonable bounds
function validateScore(
  gameId: string,
  score: number,
  metadata: any
): boolean {
  const game = getGameManifest(gameId);
  const maxPossibleScore = game.metadata?.maxScore || 10000;

  if (score > maxPossibleScore) {
    console.warn('Score exceeds maximum:', score);
    return false;
  }

  // Check time vs score ratio
  if (metadata?.timeMs) {
    const minTimeForScore = (score / 100) * 1000; // 100 points per second max
    if (metadata.timeMs < minTimeForScore) {
      console.warn('Score too high for time spent');
      return false;
    }
  }

  return true;
}
```

### Rate Limiting

```typescript
// Limit submissions per player per game
const RATE_LIMIT = {
  maxSubmissions: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
};

// Track in Redis or memory
const submissions = new Map<string, number[]>();

function checkRateLimit(playerId: string, gameId: string): boolean {
  const key = `${playerId}:${gameId}`;
  const now = Date.now();
  const playerSubmissions = submissions.get(key) || [];

  // Remove old submissions
  const recentSubmissions = playerSubmissions.filter(
    ts => now - ts < RATE_LIMIT.windowMs
  );

  if (recentSubmissions.length >= RATE_LIMIT.maxSubmissions) {
    return false; // Rate limit exceeded
  }

  recentSubmissions.push(now);
  submissions.set(key, recentSubmissions);
  return true;
}
```

---

## 9. Implementation Checklist

### Phase 2.2.1 - API Routes
- [ ] Create `GET /api/game-hub/leaderboard/[gameId]/route.ts`
- [ ] Create `GET /api/game-hub/leaderboard/[gameId]/player/[playerId]/route.ts`
- [ ] Create `POST /api/game-hub/leaderboard/[gameId]/submit/route.ts`
- [ ] Add mock data for development
- [ ] Implement score validation
- [ ] Add rate limiting

### Phase 2.2.2 - Frontend Components
- [ ] Create `LeaderboardModal`
- [ ] Create `LeaderboardList`
- [ ] Create `LeaderboardRow`
- [ ] Create `LeaderboardWidget`
- [ ] Create `RankBadge`
- [ ] Add loading skeletons

### Phase 2.2.3 - Hooks & State
- [ ] Create `useLeaderboard` hook
- [ ] Create `usePlayerRank` hook
- [ ] Create `useSubmitScore` hook
- [ ] Update `game-hub-store.ts`

### Phase 2.2.4 - Integration
- [ ] Integrate with `GameResultsModal`
- [ ] Add leaderboard button to `GameCard`
- [ ] Auto-submit scores on game complete
- [ ] Show rank improvements

### Phase 2.2.5 - Testing
- [ ] Test all API routes
- [ ] Test components with mock data
- [ ] Test rank updates
- [ ] Test error handling

---

**Next**: [3_mini_games_specs.md](./3_mini_games_specs.md)
