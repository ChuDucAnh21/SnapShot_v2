# Frontend-Backend Interface Specification

## POC Simplified Version

---

## Base Configuration

**Base URL**: `https://api.yourdomain.com` (Production) / `http://localhost:8000` (Development)

**Content-Type**: `application/json`

**Authentication**: JWT Bearer Token in header

```
Authorization: Bearer <access_token>
```

---

## API List (15 APIs)

### Phase 1: Authentication & Setup (3 APIs)

#### 1.1 Register Account -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Authentication**: None
- **Arguments**:
  ```json
  {
    "email": "string (required, email format)",
    "password": "string (required, min 8 chars)",
    "full_name": "string (required)",
    "child_name": "string (required)",
    "child_age": "integer (required, 3-12)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "access_token": "string (JWT)",
    "user": {
      "user_id": "string (UUID)",
      "email": "string",
      "full_name": "string"
    },
    "learner": {
      "learner_id": "string (UUID)",
      "name": "string",
      "age": "integer"
    }
  }
  ```

---

#### 1.2 Login -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Authentication**: None
- **Arguments**:
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "access_token": "string (JWT)",
    "user": {
      "user_id": "string (UUID)",
      "learner_id": "string (UUID)"
    }
  }
  ```

---

#### 1.3 Get User Info -> [OK]

- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Authentication**: Required (Bearer Token)
- **Arguments**: None (user identified from JWT token)
- **Response**:
  ```json
  {
    "status": "success",
    "user": {
      "user_id": "string (UUID)",
      "email": "string",
      "full_name": "string"
    },
    "learner": {
      "learner_id": "string (UUID)",
      "name": "string",
      "age": "integer",
      "profile_status": "string (incomplete|ready|complete)"
    }
  }
  ```

---

### Phase 2: Assessment & Profile (3 APIs)

#### 2.1 Submit Assessment Data -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/assessments`
- **Authentication**: Required
- **Arguments**:
  ```json
  {
    "learner_id": "string (required, UUID)",
    "parent_survey": {
      "interests": "array of strings (required)",
      "learning_style": "array of strings (required)",
      "strengths": "array of strings (required)",
      "weaknesses": "array of strings (required)"
    },
    "minigame_results": [
      {
        "game_type": "string (required, values: math|language|logic|creativity)",
        "metadata": {
          "score": "float (required, 0-100)",
          "time_spent": "integer (required, seconds)"
        },
        "detail_results": "array of objects (optional, game-specific data)"
      }
    ]
  }
  ```
- **Example Request**:
  ```json
  {
    "learner_id": "uuid-learner-456",
    "parent_survey": {
      "interests": ["art", "music", "science"],
      "learning_style": ["visual", "hands-on"],
      "strengths": ["creative", "curious", "patient"],
      "weaknesses": ["attention_span", "sitting_still"]
    },
    "minigame_results": [
      {
        "game_type": "math",
        "metadata": {
          "score": 85.5,
          "time_spent": 120
        },
        "detail_results": [
          {
            "question_id": "q1",
            "answer": "5",
            "correct": true,
            "time_taken": 8
          },
          {
            "question_id": "q2",
            "answer": "7",
            "correct": true,
            "time_taken": 12
          }
        ]
      },
      {
        "game_type": "language",
        "metadata": {
          "score": 72.0,
          "time_spent": 150
        },
        "detail_results": [
          {
            "word": "apple",
            "matched_correctly": true,
            "attempts": 1
          }
        ]
      },
      {
        "game_type": "logic",
        "metadata": {
          "score": 90.0,
          "time_spent": 100
        },
        "detail_results": []
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "assessment_id": "string (UUID)",
    "ready_for_profile": "boolean"
  }
  ```

---

#### 2.2 Generate Profile -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/profiles/generate`
- **Authentication**: Required
- **Arguments**:
  ```json
  {
    "learner_id": "string (required, UUID)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "profile": {
      "learner_id": "string (UUID)",
      "abilities": {
        "math": "integer (1-10)",
        "language": "integer (1-10)",
        "creativity": "integer (1-10)",
        "logic": "integer (1-10)"
      },
      "interests": "array of strings",
      "strengths": "array of strings",
      "weaknesses": "array of strings",
      "learning_style": "string (visual|auditory|kinesthetic)"
    }
  }
  ```

---

#### 2.3 Get Profile -> [OK]

- **Method**: `GET`
- **Endpoint**: `/api/profiles/{learner_id}`
- **Authentication**: Required
- **Path Parameters**:
  - `learner_id`: string (UUID)
- **Arguments**: None
- **Response**: Same as 2.2 Generate Profile

---

### Phase 3: Learning Path (3 APIs)

#### 3.1 Get Available Subjects -> [OK]

- **Method**: `GET`
- **Endpoint**: `/api/subjects`
- **Authentication**: Required
- **Arguments**: None
- **Response**:
  ```json
  {
    "status": "success",
    "subjects": [
      {
        "subject_id": "string (UUID)",
        "name": "string",
        "code": "string (for frontend icon mapping)"
      }
    ]
  }
  ```
- **Example Response**:
  ```json
  {
    "status": "success",
    "subjects": [
      {
        "subject_id": "math_001",
        "name": "Toán học",
        "code": "math"
      },
      {
        "subject_id": "vietnamese_001",
        "name": "Tiếng Việt",
        "code": "vietnamese"
      },
      {
        "subject_id": "english_001",
        "name": "Tiếng Anh",
        "code": "english"
      }
    ]
  }
  ```
- **Frontend Icon Mapping**:

  ```javascript
  // Frontend handles icon mapping
  const SUBJECT_ICONS = {
    math: '🔢',
    vietnamese: '📖',
    english: '🔤',
    science: '🔬',
  };

  // Usage
  const icon = SUBJECT_ICONS[subject.code];
  ```

---

#### 3.2 Generate Learning Path -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/paths/generate`
- **Authentication**: Required
- **Arguments**:
  ```json
  {
    "learner_id": "string (required, UUID)",
    "subject_id": "string (required, UUID)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "path_id": "string (UUID)",
    "path": {
      "learner_id": "string (UUID)",
      "subject": "string",
      "total_nodes": "integer",
      "nodes": [
        {
          "node_id": "string (UUID)",
          "skill_name": "string",
          "order": "integer",
          "status": "string (available|locked|in_progress|completed)",
          "dependencies": "array of strings (node_ids)",
          "estimated_sessions": "integer"
        }
      ]
    }
  }
  ```

---

#### 3.3 Get Learning Path -> [OK]

- **Method**: `GET`
- **Endpoint**: `/api/paths/{learner_id}/{subject_id}`
- **Authentication**: Required
- **Path Parameters**:
  - `learner_id`: string (UUID, required)
  - `subject_id`: string (UUID, required)
- **Arguments**: None
- **Example Request**:
  ```
  GET /api/paths/uuid-learner-456/math_001
  ```
- **Response**: Same as 3.2 Generate Learning Path
  ```json
  {
    "status": "success",
    "path_id": "string (UUID)",
    "path": {
      "learner_id": "string (UUID)",
      "subject": "string",
      "total_nodes": "integer",
      "nodes": [
        {
          "node_id": "string (UUID)",
          "skill_name": "string",
          "order": "integer",
          "status": "string (available|locked|in_progress|completed)",
          "dependencies": "array of strings (node_ids)",
          "estimated_sessions": "integer"
        }
      ]
    }
  }
  ```

---

### Phase 4: Learning Sessions (6 APIs)

#### 4.1 Generate Session -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/sessions/generate`
- **Authentication**: Required
- **Arguments**:
  ```json
  {
    "learner_id": "string (required, UUID)",
    "node_id": "string (required, UUID)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "session_id": "string (UUID)",
    "session": {
      "session_id": "string (UUID)",
      "learner_id": "string (UUID)",
      "node_id": "string (UUID)",
      "skill_name": "string",
      "duration": "integer (minutes)",
      "activities": [
        {
          "activity_id": "string (UUID)",
          "phase": "string (warm_up|main|practice|reflection)",
          "type": "string (question|game|quiz|video)",
          "content": "object or string (structure varies by type)",
          "duration": "integer (minutes)"
        }
      ]
    }
  }
  ```

---

#### 4.2 Get Session -> [OK]

- **Method**: `GET`
- **Endpoint**: `/api/sessions/{session_id}`
- **Authentication**: Required
- **Path Parameters**:
  - `session_id`: string (UUID)
- **Arguments**: None
- **Response**: Same as 4.1 Generate Session

---

#### 4.3 Start Session -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/sessions/{session_id}/start`
- **Authentication**: Required
- **Path Parameters**:
  - `session_id`: string (UUID)
- **Arguments**: None (empty body)
- **Response**:
  ```json
  {
    "status": "success",
    "session_id": "string (UUID)",
    "started_at": "string (ISO 8601 datetime)"
  }
  ```

---

#### 4.4 Submit Activity Result -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/sessions/{session_id}/activities/{activity_id}/result`
- **Authentication**: Required
- **Path Parameters**:
  - `session_id`: string (UUID)
  - `activity_id`: string (UUID)
- **Arguments**:
  ```json
  {
    "completed": "boolean (required)",
    "score": "float (required, 0-1)",
    "time_spent": "integer (required, seconds)",
    "answer": "string or object (optional, varies by activity type)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "activity_id": "string (UUID)",
    "is_correct": "boolean",
    "feedback": "string"
  }
  ```

---

#### 4.5 Complete Session -> [OK]

- **Method**: `POST`
- **Endpoint**: `/api/sessions/{session_id}/complete`
- **Authentication**: Required
- **Path Parameters**:
  - `session_id`: string (UUID)
- **Arguments**:
  ```json
  {
    "overall_feedback": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "session_summary": {
      "total_activities": "integer",
      "completed": "integer",
      "average_score": "float (0-1)",
      "time_spent": "integer (minutes)"
    },
    "progress": {
      "node_completed": "boolean",
      "next_node_unlocked": "boolean",
      "profile_updated": "boolean"
    },
    "feedback": {
      "strengths_shown": "array of strings",
      "areas_to_practice": "array of strings",
      "next_recommendation": "string"
    }
  }
  ```

---

#### 4.6 Get Dashboard Summary -> [OK]

- **Method**: `GET`
- **Endpoint**: `/api/dashboard/{learner_id}`
- **Authentication**: Required
- **Path Parameters**:
  - `learner_id`: string (UUID)
- **Arguments**: None
- **Response**:
  ```json
  {
    "status": "success",
    "dashboard": {
      "learner": {
        "name": "string",
        "age": "integer"
      },
      "stats": {
        "total_sessions": "integer",
        "total_hours": "float",
        "current_streak": "integer",
        "skills_mastered": "integer"
      },
      "current_paths": [
        {
          "subject": "string",
          "progress": "float (0-1)",
          "next_session_available": "boolean"
        }
      ],
      "recent_sessions": [
        {
          "session_id": "string (UUID)",
          "skill_name": "string",
          "completed_at": "string (ISO 8601 datetime)",
          "score": "float (0-1)"
        }
      ]
    }
  }
  ```

---

## Error Response Format

All APIs return errors in this format:

```json
{
  "status": "error",
  "error_code": "string (ERROR_CODE)",
  "message": "string (human readable message)",
  "details": "object (optional, additional error info)"
}
```

### Common Error Codes:

- `INVALID_INPUT`: Request body validation failed
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Missing or invalid authentication token
- `FORBIDDEN`: User doesn't have permission
- `AI_SERVICE_ERROR`: AI Core service error
- `INTERNAL_ERROR`: Server internal error

---

## API Call Flow Summary

```
1. Registration/Login
   POST /api/auth/register or POST /api/auth/login
   → Save access_token

2. Get User Info (optional)
   GET /api/auth/me

3. Assessment
   POST /api/assessments

4. Generate Profile
   POST /api/profiles/generate
   GET /api/profiles/{learner_id}

5. Choose Subject
   GET /api/subjects

6. Generate Path
   POST /api/paths/generate
   GET /api/paths/{learner_id}

7. Learning Session (repeat)
   POST /api/sessions/generate
   POST /api/sessions/{id}/start
   POST /api/sessions/{id}/activities/{id}/result (x N activities)
   POST /api/sessions/{id}/complete

8. View Progress
   GET /api/dashboard/{learner_id}
```

---

## Notes for Frontend Developers

### 1. Token Management

- Store `access_token` in `localStorage` or `sessionStorage`
- Include token in all authenticated requests
- Handle 401 errors by redirecting to login

### 2. Error Handling

- Always check `status` field in response
- Display `message` field to users
- Log `error_code` and `details` for debugging

### 3. Loading States

- AI operations (generate profile, path, session) may take 5-15 seconds
- Show loading indicators during these operations

### 4. Data Caching

- Cache profile and path data locally
- Refresh when profile_updated = true

### 5. Activity Content Structure

Activity `content` varies by `type`:

**type: "question"**

```json
{
  "content": "string (question text)"
}
```

**type: "game"**

```json
{
  "content": {
    "game_type": "string (drag_drop|matching|puzzle)",
    "problems": "array of objects"
  }
}
```

**type: "quiz"**

```json
{
  "content": {
    "questions": [
      {
        "question": "string",
        "options": "array of strings",
        "correct": "string"
      }
    ]
  }
}
```

**type: "video"**

```json
{
  "content": {
    "video_url": "string",
    "duration": "integer"
  }
}
```

---

## Rate Limiting

- **Free tier**: 100 requests/hour per user
- **Premium tier**: 1000 requests/hour per user
- Rate limit headers returned in response:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1234567890
  ```

---

## Versioning

Current API version: **v1**

All endpoints are prefixed with `/api/` which implicitly means `/api/v1/`

Future versions will use `/api/v2/`, `/api/v3/`, etc.
