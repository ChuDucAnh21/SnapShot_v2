## Hướng dẫn import và sử dụng Icon SVG trong dự án

### 1. Cài đặt cấu hình SVG cho TypeScript

File `declared-types.d.ts` đã được cấu hình như sau, giúp bạn có thể import file `.svg` như một React Component:

```ts
// declared-types.d.ts
declare module '*.svg' {
  import type { FC, SVGProps } from 'react';

  const content: FC<SVGProps<SVGElement>>;
  export default content;
}
```

> **Lưu ý:** Không cần chỉnh sửa file này. Đảm bảo file tồn tại ở gốc dự án hoặc đã được khai báo bên trong `tsconfig.json` ở mục `include`.

---

### 2. Import icon trong code

Tất cả icon SVG nằm trong thư mục `src/assets`. Để sử dụng icon, import từ file `src/assets/index.ts`. Ví dụ:

```tsx
import { FriendIcon, HomeIcon } from '@/assets';

export default function Demo() {
  return (
    <div>
      <HomeIcon className="w-6 h-6 text-primary" />
      <FriendIcon width={32} height={32} />
    </div>
  );
}
```

---

### 3. Thêm icon SVG mới

1. **Copy SVG vào đúng thư mục**:
   Ví dụ: `src/assets/navbar-icon/newicon.svg`

2. **Khai báo trong `src/assets/index.ts`**:

   ```ts
   import NewIcon from './navbar-icon/newicon.svg';

   export {
     // ... các icon khác
     NewIcon,
   };
   ```

3. **Sử dụng như hướng dẫn ở trên**:

   ```tsx
   import { NewIcon } from '@/assets';

   <NewIcon className="w-6 h-6" />;;;;;;;;;;
   ```

---

### 4. Ghi chú về sử dụng Tailwind & Props

- Các icon được import dưới dạng React Component nên bạn có thể dùng mọi prop của `<svg>` và class Tailwind.
- Ví dụ:
  `<HomeIcon className="w-8 h-8 text-red-500" />`
  hoặc
  `<FriendIcon width={40} height={40} style={{ color: 'blue' }} />`

---

### 5. Lỗi thường gặp

- **Import sai đường dẫn:** Chỉ import từ `'@/assets'`. Không import trực tiếp file svg.
- **Quên đăng ký icon mới ở `index.ts`:** Nếu import nhưng báo undefined, hãy kiểm tra lại `index.ts` đã export icon đó chưa.

---

### Tóm tắt

- Import icon từ `'@/assets'`
- Sử dụng như React Component
- Thêm icon mới: copy vào `src/assets`, khai báo ở `index.ts`, import và dùng

---
