# Nhật ký công việc - User Snapshot

## 1. UI tĩnh
- Xây layout các màn hình snapshot (login,survey,snapshot,..) 
- Giữ typography, khoảng cách và style guide (Tailwind/CSS module) cho bản giao diện

## 2. Zustand
- Chuyển các slice trong user snapshot, filter và pagination sang store Zustand với action/selector tương ứng.

## 3. Logic UI từ snapshot flow
- Viết lại các logic trong các component được gộp vào với các handle tương ứng

## 4. API hiện tại
- Mock user survey, overview, snapshot,..
- TODO: thay mock data bằng các dữ liệu được trả về từ API thật khi có ...

## 5. Nhận xét
- UI tĩnh, store và logic đã sẵn sàng; hiện tại chỉ phụ thuộc vào API thống nhất giữa 2 repo.
- Tiếp theo: kết nối backend, đổi mock sang real endpoint và kiểm tra các trường hợp cạnh (timeout, empty state).
