# Mock Authentication

Hệ thống mock authentication cho phép bạn bypass login và sử dụng token giả để phát triển và test các tính năng khác mà không cần đăng nhập thật.

## Cách hoạt động

Mock auth sẽ tự động được kích hoạt khi:
- Ở **development mode** (`NODE_ENV=development`)
- Hoặc khi set biến môi trường `NEXT_PUBLIC_USE_MOCK_AUTH=true`

## Mock Data

Token và user data giả được định nghĩa trong `src/lib/auth/mock-auth.ts`:

```typescript
{
  token: 'mock-dev-token-1234567890abcdefghijklmnopqrstuvwxyz',
  user: {
    user_id: 'mock-user-id-001',
    email: 'dev@iruka.edu',
    full_name: 'Dev User',
    learner_id: 'mock-learner-id-001',
  }
}
```

## Sử dụng

### Tự động (Mặc định)

Mock auth sẽ tự động được khởi tạo khi app chạy trong development mode. Không cần làm gì thêm!

### Thủ công

Nếu muốn khởi tạo mock auth thủ công:

```typescript
import { initMockAuth } from '@/lib/auth/mock-auth';

// Khởi tạo mock auth
initMockAuth();
```

### Kiểm tra trạng thái

```typescript
import { useAuthStore } from '@/lib/auth/auth-store';

function MyComponent() {
  const { accessToken, user } = useAuthStore();

  console.log('Token:', accessToken);
  console.log('User:', user);
}
```

### Xóa mock auth

```typescript
import { clearMockAuth } from '@/lib/auth/mock-auth';

// Xóa mock auth (logout)
clearMockAuth();
```

## Tùy chỉnh

### Thay đổi mock data

Chỉnh sửa `mockAuthData` trong `src/lib/auth/mock-auth.ts`:

```typescript
export const mockAuthData = {
  token: 'your-custom-token',
  user: {
    user_id: 'your-user-id',
    email: 'your@email.com',
    full_name: 'Your Name',
    learner_id: 'your-learner-id',
  },
};
```

### Tắt mock auth

Để tắt mock auth trong development:

1. Set biến môi trường: `NEXT_PUBLIC_USE_MOCK_AUTH=false`
2. Hoặc comment out `MockAuthProvider` trong `src/app/[locale]/layout.tsx`

## Lưu ý

- Mock auth chỉ hoạt động ở client-side
- Token sẽ được lưu vào localStorage
- Mock auth sẽ không override nếu đã có token/user thật
- Trong production, mock auth sẽ tự động bị tắt

## Troubleshooting

### Mock auth không hoạt động?

1. Kiểm tra console log - bạn sẽ thấy: `🔧 Mock auth initialized`
2. Kiểm tra `NODE_ENV` có phải `development` không
3. Kiểm tra localStorage có token không: `localStorage.getItem('access_token')`
4. Xóa localStorage và reload: `localStorage.clear()`

### Muốn reset mock auth?

```typescript
import { clearMockAuth, initMockAuth } from '@/lib/auth/mock-auth';

clearMockAuth();
initMockAuth();
```
