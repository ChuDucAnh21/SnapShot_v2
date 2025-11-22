# Login Flow - Đăng Nhập

## Tổng Quan

Màn hình đăng nhập/đăng ký là entry point của ứng dụng. User có thể toggle giữa login và register mode.

---

## Files Involved

### Page Component
- `src/app/[locale]/login/page.tsx` - Server component (layout)
- `src/app/[locale]/login/LoginClient.tsx` - Client component (logic + UI)

### Features
- `src/features/auth/api.ts` - API calls
- `src/features/auth/hooks.ts` - React Query hooks
- `src/features/auth/service.ts` - Service layer (save token + user)

### State Management
- `src/lib/auth/auth-store.ts` - Zustand auth store

---

## Components

### LoginClient Component

```typescript:src/app/[locale]/login/LoginClient.tsx
export function LoginClient() {
  // State
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({...});

  // Mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    if (isRegisterMode) {
      await doRegister({...});
    } else {
      await doLogin({...});
    }
    router.push('/assessment');
  };
}
```

**Key Logic:**
- Toggle giữa login/register mode với `isRegisterMode` state
- Form validation: email, password (required), thêm full_name, child_name, child_age cho register
- Gọi `doRegister()` hoặc `doLogin()` service functions
- Redirect đến `/assessment` sau khi thành công

---

## Service Functions

### doRegister()

```typescript:src/features/auth/service.ts
export async function doRegister(payload, persist = 'local') {
  // 1. Call API
  const res = await AuthApi.register(payload);

  // 2. Save token to store
  useAuthStore.getState().setAccessToken(res.access_token, persist);

  // 3. Save user info to store
  useAuthStore.getState().setUser({
    user_id: res.user.user_id,
    email: res.user.email,
    full_name: res.user.full_name,
    learner_id: res.learner.learner_id,
  });

  return res;
}
```

**Flow:**
1. POST `/api/auth/register` với payload
2. Nhận JWT token + user info + learner info
3. Lưu token vào Zustand store (persist vào localStorage)
4. Lưu user info vào store

### doLogin()

```typescript:src/features/auth/service.ts
export async function doLogin(payload, persist = 'local') {
  const res = await AuthApi.login(payload);
  useAuthStore.getState().setAccessToken(res.access_token, persist);
  useAuthStore.getState().setUser({
    user_id: res.user.user_id,
    learner_id: res.user.learner_id
  });
  return res;
}
```

**Similar to register nhưng không trả về full user details**

---

## API Calls

### API Layer

```typescript:src/features/auth/api.ts
export async function register(body: RegisterReq): Promise<RegisterRes> {
  const r = await api.post<RegisterRes>('/auth/register', body);
  return r.data;
}

export async function login(body: LoginReq): Promise<LoginRes> {
  const r = await api.post<LoginRes>('/auth/login', body);
  return r.data;
}
```

**Endpoints:**
- POST `/api/auth/register` - Register new user + learner
- POST `/api/auth/login` - Login existing user

---

## Zustand Store

### Auth Store Structure

```typescript:src/lib/auth/auth-store.ts
type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token, persist) => void;
  setUser: (user) => void;
  logout: () => void;
};
```

**Key Points:**
- Token được persist vào localStorage
- User info được lưu trong memory (Zustand state)
- Logout sẽ clear cả token và user

### Using Store

``` typescript
// Read state
const { user, accessToken } = useAuthStore();

// Get actions
const { setAccessToken, setUser, logout } = useAuthStore();
```

---

## UI Components

### Form Fields

**Login Mode:**
- Email input
- Password input
- Submit button
- Toggle to register button

**Register Mode:**
- Email input
- Password input
- Full name input (parent)
- Child name input
- Child age input (3-12)
- Submit button
- Toggle to login button

### Styling
- Dark theme với gradient background
- Card-based layout
- Animations với emoji icons
- Responsive design

---

## Error Handling

### Display Errors

```typescript
const [error, setError] = useState('');

try {
  await doLogin({...});
} catch (err) {
  setError(err?.message || 'Authentication failed');
}

// Render error
{error && (
  <div className="bg-red-500/20 text-red-500">
    😔 {error}
  </div>
)}
```

---

## Navigation Flow

```
Login → Submit → API Success → Token Saved → Redirect to /assessment
```

**Redirect Logic:**
```typescript
router.push('/assessment'); // After successful auth
```

---

## Token Injection

Token được tự động inject vào tất cả API requests thông qua Axios interceptor:

```typescript:src/lib/http/axios-client.ts
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Testing Flow

### Manual Test

1. Navigate to `/login`
2. Toggle to register mode
3. Fill form: email, password, full_name, child_name (3-12), child_age
4. Submit → Should redirect to `/assessment`
5. Refresh page → Token persists → User stays logged in

### Expected API Calls

```bash
POST /api/auth/register
POST /api/auth/login (on next login)
```

---

## Common Issues

### Issue 1: Token Not Persisting
**Cause:** `persist` parameter not set correctly
**Fix:** Ensure `doRegister/doLogin` called với `persist: 'local'`

### Issue 2: Redirect Loop
**Cause:** Token stored but invalid
**Fix:** Check token validation, logout và re-login

### Issue 3: Learner ID Missing
**Cause:** Register response không có learner.learner_id
**Fix:** Check backend response structure

---

## Next Flow

Sau khi đăng nhập thành công:
- User được redirect đến `/assessment`
- Token được lưu và auto-inject vào mọi API call
- Các pages sau sẽ sử dụng `learner_id` từ auth store

**→ [Assessment Flow](./03_assessment.md)**
