### **Các kiến thức cần bổ sung**
- Cú pháp của typeScript - vẫn hay nhớ sang cú pháp của JavaScript
- React Query - cần tìm hiểu rõ về cách hoạt động
- Tìm hiểu thêm về cách lưu trữ Zustand (tương tự redux trong js)

*References*:
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [The battle of state management: Redux vs Zustand](https://dev.to/ingeniouswebster/the-battle-of-state-management-redux-vs-zustand-6k4)
---

### **Learn path**
**Vấn đề** : Chưa rõ leanring path

**Câu hỏi chính**:
- Mỗi lộ trình chưa các node
- Khi nhấn vào mỗi node chứa các bài học ? và trong một bài học chứa các hoạt động cụ thể ?
=>> Reference: Đọc kỹ lại file readme mô tả flow của learn và session + đọc lại type của session và activity
[Learn Flow](./05_learn.md)
- Subject selection
- Path generation
- Path visualization
- Session generation
- Node selection

[Session Flow](./06_session.md)
- Activity rendering
- Activity submission
- Progress tracking
- Complete session flow

=>> Learning path gồm một list các session, mỗi session gồm một list các activity
=>> Activity gồm các loại: question, quiz, video, game
=>> Dựa vào mỗi type của activity, sẽ render ra component tương ứng
=>> xem trong file [ActivityHost.tsx](../../../src/components/sessions/ActivityHost.tsx)
=>> xem trong file [ActivityQuestion.tsx](../../../src/components/sessions/ActivityQuestion.tsx)
=>> xem trong file [ActivityQuiz.tsx](../../../src/components/sessions/ActivityQuiz.tsx)
=>> xem trong file [ActivityVideo.tsx](../../../src/components/sessions/ActivityVideo.tsx)
=>> xem trong file [ActivityGame.tsx](../../../src/components/sessions/ActivityGame.tsx)
=>> game definition trong file [bootstrap.ts](../../../src/games/bootstrap.ts)

---

### **Khi 2 repo khác nhau về login**
**Vấn đề**: repo snapshpot login bằng SĐT còn repo chung là login bằng mail?

**Câu hỏi chính**:
- Làm sao để có thể chuyển, gộp lại khi 2 repo có BE khác nhau
=>> Reference: Đọc kỹ lại file readme mô tả flow của login và đăng ký + đọc lại type của user
[Login Flow](../02_login.md)
```
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
```

-> tạo đầu api mới + request/response type mới theo logic nghiệp vụ login mới: [api.ts](../../../src/features/auth/api.ts)
-> cập nhật service layer và hook để gọi api mới: [service.ts](../../../src/features/auth/service.ts)
-> cập nhật hooks để gọi api mới: [hooks.ts](../../../src/features/auth/hooks.ts)
-> cập nhật auth store để lưu token và user: [auth-store.ts](../../../src/lib/auth/auth-store.ts)
-> cập nhật component để render UI tương ứng: [LoginClient.tsx](../../../src/app/[locale]/login/LoginClient.tsx)

# IMPORTANT: KHÔNG ĐƯỢC XÓA, THAY ĐỔI CÁC CHỨC NĂNG CỦA CÁC FILE NÀY, CHỈ ĐƯỢC THÊM, KHÔNG XÓA
-> [api.ts](../../../src/features/auth/api.ts)
-> [service.ts](../../../src/features/auth/service.ts)
-> [hooks.ts](../../../src/features/auth/hooks.ts)
-> [auth-store.ts](../../../src/lib/auth/auth-store.ts)
# IMPORTANT: KHÔNG ĐƯỢC XÓA, THAY ĐỔI CÁC CODE CŨ FILE NÀY, CHỈ ĐƯỢC THÊM, KHÔNG XÓA

Đọc kỹ file README.md để clone file .env.local từ .env
=>> cập nhật lại API URL trong file .env.local
```
NEXT_PUBLIC_API_BASE_URL=localhost:3002
```

---

### **Token Refresh & Authentication Flow**
**Vấn đề**: Khi JWT token hết hạn, xử lý như thế nào, không thấy refresToken?

**Câu hỏi chính**:
- Có refresh token mechanism không? Nếu có, refresh như thế nào?
- Khi nào nhận được 401 từ API, làm gì? (Auto retry? Re-login?)

``` Khi nào nhận được 401 từ API? => Hỏi ngược lại khi nào nhận được 401 ? ```

=>> Chưa có logic refresh token
=>> Chưa có logic refresh token => Chưa có logic xử lý 401
---

###  **Progress Tracking: Lưu Ở Đâu & Khi Nào Sync?**
**Vấn đề**: Completion status & progress không rõ cách quản lý

**Câu hỏi chính**:
- Activity completion status lưu ở đâu? (Client? Server? Both?)
- Nếu user reload page giữa chừng session, progress có mất không?

=>> Reference: Đọc lại type của CompleteSessionRes
[CompleteSessionRes](../../../src/features/sessions/types.ts)

```
export type CompleteSessionRes = {
  status: 'success';
  session_summary: {
    total_activities: number;
    completed: number;
    average_score: number;
    time_spent: number;
  };
  progress: { node_completed: boolean; next_node_unlocked: boolean; profile_updated: boolean };
  feedback: { strengths_shown: string[]; areas_to_practice: string[]; next_recommendation: string };
};
```
---

###  **về React Query?**
**Vấn đề**: Khi nào dùng React Query?
**Câu hỏi chính**:
- Sử dụng React Query để gọi API và cache dữ liệu, cache như vậy có tác dụng gì ?

=>> Chưa cần hiểu sâu về React Query

=>> Bám sát vào các feature trong folder [features](../../../src/features)
Tuân thủ theo cấu trúc folder và file như trong file [REACT_QUERY_IMPLEMENTATION.md](../guides/REACT_QUERY_IMPLEMENTATION.md)
VD:
- features/sessions/api.ts       // API calls
- features/sessions/hooks.ts    // React Query hooks
- features/sessions/index.ts    // Barrel exports
- features/sessions/types.ts    // Request/response types
- features/sessions/service.ts    // Service layer

---

ĐỌC KỸ FILE README.md
