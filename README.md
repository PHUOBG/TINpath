# TinPath 🎓
> Nền tảng EdTech ứng dụng Trí tuệ Nhân tạo hỗ trợ học sinh ôn thi tốt nghiệp THPT môn Tin học theo Chương trình GDPT 2018.

TinPath là nền tảng số hỗ trợ học sinh THPT học theo chủ đề, luyện tập có hệ thống, theo dõi tiến độ và xây dựng lộ trình học tập tối ưu theo năng lực cá nhân. Dự án khởi đầu dành riêng cho học sinh và giáo viên tại 34 trường THPT tỉnh Quảng Ngãi, đồng thời sẵn sàng mở rộng trên toàn quốc.

Tương tự tinh thần đổi mới giáo dục, **TinPath không thay thế người thầy**. Nền tảng đóng vai trò trợ lý số giúp học sinh hiểu rõ năng lực và lỗ hổng kiến thức trước khi bước vào kỳ thi, giúp giáo viên theo dõi tiến độ lớp học tức thì, và giúp việc ôn thi Tin học THPT trở nên có định hướng, có căn cứ và hiệu quả hơn.

---

## 📌 Tổng Quan Hệ Thống

- **Học theo chủ đề**: Hệ thống hóa kiến thức trọng tâm theo hai định hướng: *Khoa học máy tính (CS)* và *Tin học ứng dụng (ICT)*.
- **Ngân hàng đề thi chuẩn hóa**: Luyện đề bám sát cấu trúc mới của Bộ GD&ĐT (Trắc nghiệm nhiều lựa chọn, Đúng/Sai, Trả lời ngắn) kèm đáp án và lời giải chi tiết.
- **Thử thách 10 câu mỗi ngày**: Rèn luyện kỷ luật tự học, củng cố phản xạ kiến thức mỗi ngày.
- **Gamification & Vinh danh**: Tích lũy XP, chuỗi ngày học liên tục (streak), bảng xếp hạng thi đua theo cấp Trường, Huyện và Tỉnh.
- **AI Cá nhân hóa**: Đánh giá đầu vào, gợi ý bài luyện theo điểm yếu và lập kế hoạch ôn thi bứt phá điểm số.
- **Gợi ý học tập Dashboard**: Nhắc nhở nhiệm vụ dang dở và đề xuất chủ đề thường làm sai theo thời gian thực.
- **Không gian Giáo viên**: Tạo lớp học, quản lý sĩ số, giao bài kiểm tra định kỳ (15 phút, 1 tiết), chia sẻ tài liệu và phân tích phổ điểm.
- **Quản trị hệ thống**: Quản lý tài khoản, phân quyền, dữ liệu 34 trường THPT và ngân hàng câu hỏi.
- **Hệ sinh thái Google**: Tích hợp Google Gemini API cho trợ lý AI, Google Drive lưu trữ học liệu và Google Classroom/Sheets xuất báo cáo.

---

## 🤖 Mô Hình AI & Cá Nhân Hóa

TinPath áp dụng mô hình tiếp cận kép: **Rule-based Logic** cho các phản hồi tức thì và **Gemini AI Agent** cho các phân tích chiều sâu.

```
[1. Đánh giá đầu vào] ➔ [2. Đặt mục tiêu điểm] ➔ [3. Tạo lộ trình học] ➔ [4. Theo dõi làm bài] ➔ [5. Điều chỉnh thích ứng]
```

1. **Đánh giá đầu vào**: Xác định mức độ tự tin, kết quả khởi điểm và quỹ thời gian ôn thi.
2. **Thiết lập mục tiêu**: Đặt mốc điểm kỳ vọng và thời gian hoàn thành mục tiêu.
3. **Tạo lộ trình cá nhân hóa**: Đề xuất thứ tự chuyên đề và lịch phân bổ bài học hợp lý.
4. **Theo dõi tiến độ**: Cập nhật chỉ số thông thạo qua từng bài tập, đề thi và câu hỏi thử thách.
5. **Điều chỉnh thích ứng**: Tự động nhận diện chủ đề học sinh thường sai để gợi ý bài luyện bù đắp kiến thức.

> **Nguyên tắc AI có trách nhiệm**: Các nhắc nhở cơ bản được xử lý bằng logic hệ thống để tiết kiệm tài nguyên. AI tập trung vào phân tích nguyên nhân sai sót, giải thích thuật toán từng bước và tổng hợp kế hoạch học tập có kiểm chứng.

---

## 👥 Phân Quyền Người Dùng

| Vai trò | Chức năng chính |
| :--- | :--- |
| **Học sinh** | Xem Dashboard tiến độ, học chuyên đề, làm thử thách 10 câu, thi thử đề chuẩn hóa, đua top bảng xếp hạng, nhận lộ trình cá nhân hóa từ AI. |
| **Giáo viên** | Quản lý danh sách lớp, giao bài tập/bài thi theo thời hạn, đăng tải học liệu, xem ma trận kết quả và phân tích dạng bài học sinh còn yếu. |
| **Quản trị viên** | Quản lý người dùng, duyệt ngân hàng câu hỏi/đề thi, cấu hình danh mục trường THPT và giám sát vận hành toàn hệ thống. |

---

## 📚 Nguồn Học Liệu & Bản Quyền

TinPath chuẩn hóa nội dung từ các nguồn tài liệu giáo dục chính thống:
- **Sách giáo khoa Tin học 12**: Định hướng Tin học ứng dụng & Định hướng Khoa học máy tính (Bộ Giáo dục & Đào tạo).
- **Sách chuyên đề học tập Tin học 12**: Cánh Diều, Kết nối tri thức với cuộc sống.
- **Bộ đề thi tốt nghiệp THPT**: Đề thi tham khảo và đề thử nghiệm chính thức từ Bộ GD&ĐT.
- **Ngân hàng câu hỏi chuyên đề**: Đóng góp và biên soạn bởi đội ngũ giáo viên Tin học THPT tỉnh Quảng Ngãi.

*Lưu ý: Học liệu được chọn lọc và biên soạn phục vụ mục đích phi thương mại cho cộng đồng giáo dục. Hệ thống không phân phối lại nguyên bản các ấn phẩm thương mại có bản quyền.*

---

## 🏗️ Kiến Trúc Công Nghệ

```
TINpath/
├── src/
│   ├── components/       # Giao diện: Landing, Student, Teacher, Admin, Exam Workspace
│   ├── services/         # StorageService, Firebase Auth, Google Tools, Gemini API
│   ├── data/             # Ngân hàng đề thi tốt nghiệp 2025, danh sách trường Quảng Ngãi
│   └── types/            # TypeScript interfaces & domain models
├── public/
│   └── images/           # Ảnh bìa sách giáo khoa, asset đồ họa, biểu tượng
└── dist/                 # Production bundle (Vite build)
```

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons.
- **Engine & Tooling**: Vite 8, Express API Router (Dev middleware).
- **Trí tuệ nhân tạo**: Google Gemini API (`@google/genai`).
- **Xác thực & Tích hợp**: Firebase Authentication, Google Ecosystem Hub.

---

## 💻 Cài Đặt & Chạy Local

### Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 20.x trở lên
- **Trình quản lý gói**: `npm`

### Các Bước Cài Đặt

1. **Cài đặt thư viện phụ thuộc**:
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường**:
   Sao chép `.env.example` thành `.env.local` và điền API Key:
   ```bash
   cp .env.example .env.local
   ```
   Cấu hình tối thiểu trong `.env.local`:
   ```ini
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

3. **Khởi chạy máy chủ phát triển**:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: **`http://localhost:3000`**

### Kiểm Tra & Đóng Gói (Build)
```bash
npm run lint      # Kiểm tra lỗi kiểu dữ liệu TypeScript (tsc --noEmit)
npm run build     # Đóng gói sản phẩm cho môi trường production
```

---

## 🛡️ Bảo Mật & Định Hướng Phát Triển

- **Bảo vệ dữ liệu**: Không công khai email cá nhân hay kết quả bài làm riêng tư; bảng xếp hạng chỉ hiển thị tên hiển thị và trường học.
- **Bảo mật API**: Tuyệt đối không commit file chứa `GEMINI_API_KEY` lên kho mã nguồn công khai.
- **Tính thực tiễn**: Khuyến khích học đều đặn mỗi ngày thông qua micro-learning thay vì học dồn trước kỳ thi.
- **AI có căn cứ**: Trợ lý giải bài tập bám sát chương trình chuẩn, từ chối đưa ra kết quả không có cơ sở lý thuyết.

---

## ⚖️ Bản Quyền & Tính Liêm Chính Học Thuật

Dự án TinPath được phát triển nhằm đóng góp cho cộng đồng học sinh và giáo viên môn Tin học THPT. Mọi hành vi tái sử dụng trong các cuộc thi sáng tạo khoa học kỹ thuật, nghiên cứu học thuật hoặc hồ sơ năng lực cần trích dẫn rõ nguồn gốc và nhóm phát triển **TinPath**.

Copyright (c) 2025-2026 TinPath Contributors. Phát hành dưới giấy phép mã nguồn mở vì mục đích giáo dục.
