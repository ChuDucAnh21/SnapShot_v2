# V1 Mock Data System

This directory contains a comprehensive mock data system for the Iruka Edu App that allows testing and development without requiring a backend connection.

## 🏗️ Architecture

The V1 system consists of several key components:

- **Mock Data**: Realistic test data for all features
- **Mock Router**: Routes API calls to mock data

## 📁 Structure

```
src/v1/
├── mock-data/           # Mock data for each feature
│   ├── auth.ts         # Authentication mock data
│   ├── subjects.ts     # Subjects mock data
│   ├── profiles.ts     # Profiles mock data
│   ├── paths.ts        # Learning paths mock data
│   ├── sessions.ts     # Learning sessions mock data
│   ├── dashboard.ts    # Dashboard mock data
│   ├── assessments.ts  # Assessments mock data
│   └── index.ts        # Export all mock data
├── mock-router.ts      # Routes API calls to mock data
└── README.md          # This file
```

## 🚀 Quick Start

### 1. Enable Mock Mode

Set the environment variable to enable mock data:

```bash
# In your .env.local file
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### 2. Use the V1 API

```typescript
import { v1Api } from '@/v1';

// Use the API as you would normally
const subjects = await v1Api.subjects.getSubjects();
const user = await v1Api.auth.login({ email, password });
```

### 3. Switch Between Mock and Real API

```typescript
import { isMockModeEnabled, setMockMode } from '@/v1';

// Enable mock mode
setMockMode(true);

// Disable mock mode (use real API)
setMockMode(false);

// Check current mode
console.log('Mock mode:', isMockModeEnabled());
```

## 📚 Available APIs

### Authentication (`v1Api.auth`)

- `register(data)` - Register new user
- `login(data)` - Login user
- `getMe(token)` - Get current user info

### Subjects (`v1Api.subjects`)

- `getSubjects()` - Get all available subjects

### Profiles (`v1Api.profiles`)

- `generateProfile(data)` - Generate learner profile
- `getProfile(learnerId)` - Get existing profile

### Paths (`v1Api.paths`)

- `generatePath(data)` - Generate learning path
- `getPath(learnerId, subjectId)` - Get existing path

### Sessions (`v1Api.sessions`)

- `generateSession(data)` - Generate learning session
- `getSession(sessionId)` - Get session details
- `startSession(sessionId)` - Start session
- `submitActivityResult(sessionId, activityId, data)` - Submit activity result
- `completeSession(sessionId, data)` - Complete session

### Dashboard (`v1Api.dashboard`)

- `getDashboard(learnerId)` - Get dashboard data

### Assessments (`v1Api.assessments`)

- `submitAssessment(data)` - Submit assessment results

## ⚙️ Configuration

The system uses environment-based configuration:

```typescript
import { v1Config } from '@/v1/config';

// Get current configuration
const config = v1Config.get();

// Update configuration
v1Config.set({
  useMockData: true,
  mockDelay: 1000,
  logRequests: true,
  fallbackToRealApi: true,
});

// Reset to defaults
v1Config.reset();
```

### Environment Configurations

- **Development**: Mock data enabled, logging enabled, fallback to real API
- **Test**: Mock data enabled, no logging, no fallback to real API
- **Production**: Mock data disabled, no logging, no fallback

## 🧪 Testing

Run the integration tests to verify everything works:

```typescript
import { runAllTests } from '@/v1/test-integration';

// Or run individual tests
import { testApiSwitching, testConfiguration, testV1Integration } from '@/v1/test-integration';

// Run all tests
await runAllTests();

await testV1Integration();
await testApiSwitching();
testConfiguration();
```

## 🔄 How It Works

1. **API Call Made**: Your code calls `v1Api.auth.login(data)`
2. **Interceptor Checks**: The interceptor checks if mock mode is enabled
3. **Route Decision**:
   - If mock mode: Routes to mock data
   - If real mode: Routes to real API
   - If fallback enabled: Tries mock first, falls back to real API
4. **Response**: Returns the appropriate response

## 🎯 Benefits

- **Development**: Work without backend dependency
- **Testing**: Consistent test data across environments
- **Demo**: Show app functionality without backend
- **Fallback**: Graceful degradation when backend is unavailable
- **Type Safety**: Full TypeScript support with proper types

## 🔧 Customization

### Adding New Mock Data

1. Create a new file in `mock-data/` directory
2. Export mock functions that return realistic data
3. Add the mock to `mock-router.ts`
4. Create interceptors in `api-interceptors.ts`
5. Add to feature wrappers in `feature-wrappers.ts`

### Custom Configuration

```typescript
import { v1Config } from '@/v1/config';

// Set custom configuration
v1Config.set({
  useMockData: true,
  mockDelay: 2000, // 2 second delay
  logRequests: false,
  fallbackToRealApi: false,
  apiBaseUrl: 'https://api.example.com',
});
```

## 🚨 Error Handling

The system provides consistent error handling:

```typescript
import { ApiError } from '@/v1/api-interceptors';

try {
  const result = await v1Api.auth.login(data);
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.status, error.message);
  } else {
    console.log('Unknown error:', error);
  }
}
```

## 📝 Best Practices

1. **Use Environment Variables**: Control mock mode via environment variables
2. **Test Both Modes**: Test with both mock and real API
3. **Realistic Data**: Keep mock data realistic and up-to-date
4. **Error Handling**: Always handle API errors gracefully
5. **Type Safety**: Use proper TypeScript types for all data

## 🔍 Debugging

Enable request logging to see what's happening:

```typescript
import { v1Config } from '@/v1/config';

v1Config.set({ logRequests: true });
```

This will log all API calls to the console, showing whether they're using mock or real data.
