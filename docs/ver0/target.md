## Target

- Clone FrontEnd của Duolingo
  - Với nội dung là môn Math (Thay vì Language)
  - Fix cứng data để Demo khi hết sprint
  - Available để ghép nối ver1 của service với dữ liệu cơ bản
    - Định nghĩa template data-json
    - Định nghĩa khung API

- Define requirements cho các bên liên quan
  - Designer:
    - Cung cấp BRD + Demo
    - Thiết kế từng màn hình chức năng
      - Core concepts
      - Design rule to follow
    - Output: thiết kế chi tiết trên figma của từng màn hình
  - Content:
    - Cung cấp BRD + Demo
    - Content-template của từng loại chức năng
      - User-Snapshot: chân dung khách hàng
      - Learning-Path: lộ trình học tập
      - Learning-Session: bài học cụ thể
        - Các hình thức học:
          - Ôn tập kiến thức
          - Luyện tập thực hành
          - Liên tưởng liên kết
          - Thi đua - cạnh tranh
          - ...

## Detail modules

### 1. User-snapshot

- Parent: chân dung phụ huynh (thiết lập mục tiêu)
  - Account: đăng kí, đăng nhập tài khoản
  - Payment: trả chi phí cho quá trình học
  - Evaluate:
    - thiết lập mục tiêu học
    - đánh giá chất lượng học tập, tiến bộ
    - Đồng hành tương tác trong 1 số loại session (chơi trò chơi tương tác, đố vui, kiểm tra nhỏ, ...)

- Child: chân dung con trẻ (học sinh chính)
  - Account: parent tạo account cho từng bé
  - Learning-Subject: môn học mà bé có thể lựa chọn và tham gia
  - Learning-Path: lộ trình học của subject mà bé chọn
    - Dẫn dắt bé đạt được target năng lực mong muốn ở môn học
    - Duy trì hứng thú, tạo ra hiệu quả trong quá trình học tập, và ảnh hưởng tích cực tới năng lực tổng thể của bé

### 2. Learning-path

### 3. Learning-session

### 4. Evaluator

- Bộ chỉ tiêu đánh giá năng lực cho bé trong 1 context cụ thể
  - Skill
  - Subject
  - Path
  - Session

- Khung chuẩn
  - Chuẩn thế giới
  - Chuẩn quốc gia
  - Chuẩn văn hóa mềm

- Kĩ năng từ phía góc nhìn của founder

- Kĩ năng tư duy
  - Tiếp nhận + nhận thức
    - Nhận diện
    - Quan sát
    - Tập trung
  - Ghi nhớ + lưu trữ
    - Ghi nhớ
    - Truy xuất
    - Biến đổi
  - Phân tích + xử lý
    - Phân tích
    - So sánh
    - Tổng hợp
    - Lý luận
    - Trừu tượng hóa
  - Sáng tạo + ra quyết định
    - Sáng tạo
    - Tưởng tượng
    - Lựa chọn
    - Ra quyết định
    - Dự đoán
    - Thuyết phục

- Mô hình xử lý thông tin
  - Bộ nhớ giác quan
  - Trí nhớ
    - Ngắn hạn
    - Dài hạn
  - Hành động
    - Phản xạ vô thức
    - Ý thức chủ đích
