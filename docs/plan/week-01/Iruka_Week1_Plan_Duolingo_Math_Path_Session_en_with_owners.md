# Week 1 Plan — Duolingo Math Clone (Learning Path & Session)

**Scope:** Ship a functional PWA demo for Learning Path and Learning Session (Math).

---

## Owners & Estimates

- FE-Path → Front-end (Learning Path)
- FE-Session → Front-end (Learning Session)
- Content → Content (VN)
- QA → QA/Release

## Table Tasks

| Title (ngắn, rõ)                               | Outcome (Kết quả mong đợi – cụ thể, đo được)                                                                                                                                                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Learning Path UI – Duolingo-style curve**    | Hoàn thiện đường cong (bezier) + layout timeline; component **Node** (Lesson/Checkpoint) với trạng thái locked/available/completed; màu sắc/mascot thống nhất brand; **responsive 390–960px**; scroll mượt; **CLS < 0.1**, không lỗi console.                                                    |
| **Lecture/Roadmap Taxonomy & Node Model**      | Chuẩn hoá **age bands 4–8**; định nghĩa topic tree (number 1–10, unit, operator add/sub, puzzle, shape…); schema **Node** (type, state, unlock rule); seed **dataset “Number 1–10”** đủ cho 5–7 node (lesson/challenge/milestone).                                                               |
| **Session Core Flow & State Machine**          | Tuyến **welcome → questions → summary** chạy ổn; state **next/submit/feedback**; guard lỗi (anti double-submit); lưu tiến độ tạm (sessionStorage) để **resume**; tất cả route không lỗi console.                                                                                                 |
| **Question UI Framework & Shared Controls**    | Khung câu hỏi dùng chung: header tiến độ + **hearts/streak**, vùng nội dung, vùng điều khiển; **keypad số** thân thiện mobile; lưới lựa chọn ảnh/text; tiêu chuẩn **focus/ARIA** cơ bản; có hook âm thanh (stub).                                                                                |
| **Question Types v1 – Addition ≤10 (≥8 loại)** | Triển khai **≥8 loại** trong danh sách: choose one, true/false, type number, tap/drag to count, compare, number line/fill missing, ten frame, single-digit add/subtract, match/arrange, select image, word problem simple. Mỗi loại có **chấm điểm, feedback ngắn, hint**, log analytics (stub). |
| **Progress Sync & Demo Path**                  | Sau khi hoàn thành session: Path cập nhật **completed** + **unlock** node kế tiếp; **Node Detail tooltip + CTA Start** điều hướng đúng; soạn **kịch bản demo 2–3 phút** (vào Path → vào lesson → làm bài → summary → quay lại Path thấy ✔).                                                     |
