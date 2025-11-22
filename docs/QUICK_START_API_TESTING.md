# Quick Start: Testing All APIs

## Prerequisites

1. Backend server running at `http://localhost:8000`
2. Environment variables set:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT_MS=20000
```

## Complete Test Flow (10 minutes)

### 1. Authentication (2 min)

**Register New User**
```
1. Open http://localhost:3000/en/login
2. Click "Don't have an account? Register"
3. Fill form:
   - Email: test@example.com
   - Password: password123
   - Your Full Name: John Doe
   - Child's Name: Emma
   - Child's Age: 7
4. Click "Register"
```

**APIs Called:**
- ✅ `POST /auth/register`
- ✅ `GET /auth/me` (automatic)

**Expected Result:**
- Redirects to `/learn`
- Token stored in localStorage
- User info in auth store

---

### 2. Path Generation (2 min)

**Generate Learning Path**
```
1. You should see "Choose Your Learning Path" screen
2. Subject buttons displayed (API call: GET /subjects)
3. Select "Math" or any subject
4. Click "Generate Learning Path"
```

**APIs Called:**
- ✅ `GET /subjects`
- ✅ `POST /paths/generate` (on button click)
- ✅ `GET /paths/{learner_id}/{subject_id}` (loads generated path)

**Expected Result:**
- Path generated with nodes
- Visual path map displayed
- Nodes show: locked/available/completed status

---

### 3. Session Generation & Completion (5 min)

**Start a Learning Session**
```
1. Click any available node on the path
2. Loading modal: "Generating your lesson..."
3. Session page loads
```

**APIs Called:**
- ✅ `POST /sessions/generate` (creates session from node)
- ✅ `GET /sessions/{session_id}` (loads session data)
- ✅ `POST /sessions/{session_id}/start` (marks as started, automatic)

**Complete Activities**
```
1. Answer/complete first activity
2. Click "Next" or "Continue"
3. Repeat for each activity (warm_up, main, practice, reflection)
```

**APIs Called (per activity):**
- ✅ `POST /sessions/{session_id}/activities/{activity_id}/result`

**Finish Session**
```
1. After last activity, modal appears: "Hoàn thành bài học!"
2. Click "Hoàn tất" button
```

**APIs Called:**
- ✅ `POST /sessions/{session_id}/complete`

**Expected Result:**
- Returns to `/learn`
- Path refreshes with progress updated
- Node shows completed/in-progress status

---

### 4. Assessment Flow (Optional, 2 min)

**Complete Assessment**
```
1. Navigate to http://localhost:3000/en/assessment
2. Survey list loads (API: GET /surveys)
3. Select interests (math, science, art, etc.)
4. Click "Submit Assessment"
5. Click "Generate Profile"
```

**APIs Called:**
- ✅ `GET /surveys?locale=en`
- ✅ `GET /surveys/{survey_key}?locale=en` (if survey detail needed)
- ✅ `POST /assessments`
- ✅ `POST /profiles/generate`

**Expected Result:**
- Profile generated
- "Profile Complete!" message
- Can view profile info

---

### 5. Dashboard (1 min)

**View Stats**
```
1. Navigate to http://localhost:3000/en/dashboard
2. Stats displayed
```

**APIs Called:**
- ✅ `GET /dashboard/{learner_id}`

**Expected Result:**
- Current Streak: X days
- Total XP: X points
- Sessions Completed: X sessions

---

## Network Tab Verification

Open Chrome DevTools → Network tab and verify these calls:

### Registration Flow
```
POST /api/v1/auth/register
GET  /api/v1/auth/me
```

### Path Flow
```
GET  /api/v1/subjects
POST /api/v1/paths/generate
GET  /api/v1/paths/{learner_id}/{subject_id}
```

### Session Flow
```
POST /api/v1/sessions/generate
GET  /api/v1/sessions/{session_id}
POST /api/v1/sessions/{session_id}/start
POST /api/v1/sessions/{session_id}/activities/{activity_id}/result (multiple)
POST /api/v1/sessions/{session_id}/complete
```

### Other
```
GET  /api/v1/surveys?locale=en
GET  /api/v1/surveys/{survey_key}?locale=en
POST /api/v1/assessments
POST /api/v1/profiles/generate
GET  /api/v1/profiles/{learner_id}
GET  /api/v1/dashboard/{learner_id}
```

---

## Troubleshooting

### "No QueryClient set" Error
**Fixed:** QueryProvider now wraps the app in `[locale]/layout.tsx`

### 401 Unauthorized
- Check token in localStorage: `localStorage.getItem('auth-storage')`
- Verify Authorization header in Network tab: `Bearer {token}`
- Re-login if token expired

### CORS Errors
- Backend must allow `http://localhost:3000`
- Check backend CORS configuration

### API Not Found (404)
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check backend is running on correct port
- Confirm endpoint paths match backend routes

### TypeScript Errors
- Run `pnpm install` to ensure all dependencies installed
- Check `src/types/api.ts` for type definitions

---

## Success Criteria

After completing the test flow, you should have:

- ✅ Registered/logged in user
- ✅ Generated learning path with visible nodes
- ✅ Generated and completed at least 1 session
- ✅ All 17 API endpoints called at least once
- ✅ No console errors
- ✅ Proper loading states displayed
- ✅ Success/error messages shown appropriately

---

## Next Steps

1. **Backend Integration:** Connect to actual backend API
2. **Error Handling:** Test error scenarios (network failures, validation errors)
3. **Performance:** Monitor API response times
4. **Testing:** Add E2E tests with Playwright
5. **Monitoring:** Set up error tracking (Sentry, etc.)

---

**All 17 APIs Integrated:** ✅
**Ready for Testing:** ✅
**Production Ready:** Pending backend integration
