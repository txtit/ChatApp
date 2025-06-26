# 📚 Use Cases - Ứng dụng Học tập cho Trẻ em (6-10 tuổi)

## 🎯 Tổng quan hệ thống

Ứng dụng học tập tương tác dành cho trẻ em 6-10 tuổi với các tính năng gamification, theo dõi tiến độ, và hệ thống thưởng động viên.

---

## 👥 Actors (Các tác nhân)

| Actor | Mô tả | Vai trò |
|-------|-------|---------|
| **Học sinh** | Trẻ em từ 6-10 tuổi | Người dùng chính của ứng dụng |
| **Phụ huynh** | Cha/mẹ của học sinh | Theo dõi tiến độ, cài đặt kiểm soát |
| **Giáo viên** | Giáo viên/Mentor | Tạo nội dung, đánh giá tiến độ |
| **Quản trị viên** | Admin hệ thống | Quản lý nội dung, người dùng |
| **Hệ thống** | Backend/AI | Xử lý logic, đề xuất cá nhân hóa |

---

## 📖 Use Case 1: Học Bài qua Slideshow

### UC-001: Học Bài Slideshow
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-001 |
| **Tên** | Học Bài qua Slideshow |
| **Mô tả** | Học sinh học bài thông qua slideshow tương tác với âm thanh, hình ảnh và bài tập nhỏ |
| **Actor chính** | Học sinh |
| **Actor phụ** | Hệ thống, Phụ huynh |
| **Điều kiện tiên quyết** | - Học sinh đã đăng nhập<br>- Có kết nối internet<br>- Đã chọn bài học |
| **Điều kiện thành công** | - Hoàn thành slideshow<br>- Tiến độ được lưu<br>- Nhận điểm thưởng |
| **Luồng chính** | 1. Học sinh chọn bài học<br>2. Hệ thống load slideshow<br>3. Học sinh xem từng slide<br>4. Hệ thống theo dõi thời gian<br>5. Học sinh làm bài tập trong slide<br>6. Hệ thống auto-save tiến độ<br>7. Hoàn thành và nhận thưởng |
| **Luồng thay thế** | **3a.** Học sinh tạm dừng:<br>&nbsp;&nbsp;3a1. Hệ thống lưu vị trí hiện tại<br>&nbsp;&nbsp;3a2. Cho phép tiếp tục sau<br>**5a.** Trả lời sai bài tập:<br>&nbsp;&nbsp;5a1. Hiển thị gợi ý<br>&nbsp;&nbsp;5a2. Cho phép thử lại |
| **Luồng ngoại lệ** | **E1.** Mất kết nối:<br>&nbsp;&nbsp;E1.1. Lưu offline<br>&nbsp;&nbsp;E1.2. Đồng bộ khi có mạng<br>**E2.** Slide bị lỗi:<br>&nbsp;&nbsp;E2.1. Hiển thị thông báo<br>&nbsp;&nbsp;E2.2. Chuyển slide tiếp theo |
| **Tần suất** | Hàng ngày |
| **Mức độ quan trọng** | Cao |

---

## 🧠 Use Case 2: Làm Bài Tập/Quiz

### UC-002: Làm Bài Tập và Quiz
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-002 |
| **Tên** | Làm Bài Tập/Quiz |
| **Mô tả** | Học sinh làm bài tập và quiz với nhiều dạng câu hỏi, có timer và feedback tức thì |
| **Actor chính** | Học sinh |
| **Actor phụ** | Hệ thống, Progress System |
| **Điều kiện tiên quyết** | - Đã hoàn thành bài học liên quan<br>- Có kết nối internet |
| **Điều kiện thành công** | - Hoàn thành tất cả câu hỏi<br>- Nhận điểm và feedback<br>- Cập nhật tiến độ |
| **Luồng chính** | 1. Học sinh chọn bài tập/quiz<br>2. Hệ thống load câu hỏi đầu tiên<br>3. Khởi động timer<br>4. Học sinh trả lời<br>5. Hệ thống validate và feedback<br>6. Cập nhật điểm số<br>7. Chuyển câu tiếp theo<br>8. Hoàn thành và hiển thị kết quả |
| **Luồng thay thế** | **4a.** Hết thời gian:<br>&nbsp;&nbsp;4a1. Tự động chuyển câu tiếp<br>&nbsp;&nbsp;4a2. Không cộng điểm<br>**5a.** Trả lời sai:<br>&nbsp;&nbsp;5a1. Hiển thị đáp án đúng<br>&nbsp;&nbsp;5a2. Giải thích chi tiết<br>&nbsp;&nbsp;5a3. Trừ điểm (nếu có) |
| **Luồng ngoại lệ** | **E1.** Mất kết nối:<br>&nbsp;&nbsp;E1.1. Lưu tạm thời<br>&nbsp;&nbsp;E1.2. Tiếp tục khi có mạng<br>**E2.** Câu hỏi lỗi:<br>&nbsp;&nbsp;E2.1. Bỏ qua câu hỏi<br>&nbsp;&nbsp;E2.2. Báo lỗi cho admin |
| **Tần suất** | 2-3 lần/ngày |
| **Mức độ quan trọng** | Cao |

---

## 📊 Use Case 3: Theo Dõi Tiến Độ

### UC-003: Xem Dashboard Tiến Độ
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-003 |
| **Tên** | Theo Dõi Tiến Độ Học Tập |
| **Mô tả** | Học sinh và phụ huynh xem dashboard tiến độ với biểu đồ, thống kê và báo cáo chi tiết |
| **Actor chính** | Học sinh, Phụ huynh |
| **Actor phụ** | Hệ thống, Analytics Service |
| **Điều kiện tiên quyết** | - Đã có dữ liệu học tập<br>- Đăng nhập hợp lệ |
| **Điều kiện thành công** | - Hiển thị dashboard đầy đủ<br>- Cập nhật real-time<br>- Export báo cáo (nếu cần) |
| **Luồng chính** | 1. Truy cập dashboard<br>2. Hệ thống load dữ liệu<br>3. Hiển thị biểu đồ tiến độ<br>4. Hiển thị thống kê chi tiết<br>5. Cập nhật real-time<br>6. Gửi thông báo nếu có milestone |
| **Luồng thay thế** | **2a.** Chưa có dữ liệu:<br>&nbsp;&nbsp;2a1. Hiển thị hướng dẫn<br>&nbsp;&nbsp;2a2. Đề xuất bài học đầu tiên<br>**4a.** Xem chi tiết môn học:<br>&nbsp;&nbsp;4a1. Drill-down theo môn<br>&nbsp;&nbsp;4a2. Hiển thị breakdown |
| **Luồng ngoại lệ** | **E1.** Lỗi load dữ liệu:<br>&nbsp;&nbsp;E1.1. Hiển thị cache cũ<br>&nbsp;&nbsp;E1.2. Thông báo lỗi<br>**E2.** Dữ liệu không nhất quán:<br>&nbsp;&nbsp;E2.1. Sync lại từ server<br>&nbsp;&nbsp;E2.2. Hiển thị warning |
| **Tần suất** | Hàng ngày |
| **Mức độ quan trọng** | Trung bình |

---

## 🎥 Use Case 4: Xem Video Bài Học

### UC-004: Xem Video Lesson
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-004 |
| **Tên** | Xem Video Bài Học |
| **Mô tả** | Học sinh xem video bài học với tính năng tương tác, ghi chú và kiểm tra hiểu bài |
| **Actor chính** | Học sinh |
| **Actor phụ** | Hệ thống, Video Service |
| **Điều kiện tiên quyết** | - Kết nối internet ổn định<br>- Đã đăng nhập<br>- Có quyền truy cập video |
| **Điều kiện thành công** | - Xem hoàn thành video<br>- Trả lời quiz trong video<br>- Tiến độ được lưu |
| **Luồng chính** | 1. Chọn video bài học<br>2. Hệ thống load video<br>3. Phát video với subtitle<br>4. Hiển thị quiz tương tác<br>5. Học sinh trả lời quiz<br>6. Tiếp tục phát video<br>7. Hoàn thành và cập nhật tiến độ |
| **Luồng thay thế** | **3a.** Tạm dừng video:<br>&nbsp;&nbsp;3a1. Lưu timestamp<br>&nbsp;&nbsp;3a2. Cho phép ghi chú<br>**5a.** Trả lời sai quiz:<br>&nbsp;&nbsp;5a1. Replay đoạn video<br>&nbsp;&nbsp;5a2. Hiển thị gợi ý |
| **Luồng ngoại lệ** | **E1.** Mạng chậm:<br>&nbsp;&nbsp;E1.1. Giảm chất lượng video<br>&nbsp;&nbsp;E1.2. Buffering<br>**E2.** Video lỗi:<br>&nbsp;&nbsp;E2.1. Thử load lại<br>&nbsp;&nbsp;E2.2. Chuyển video khác |
| **Tần suất** | 1-2 lần/ngày |
| **Mức độ quan trọng** | Cao |

---

## 🎯 Use Case 5: Daily Quest

### UC-005: Hoàn Thành Daily Quest
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-005 |
| **Tên** | Hoàn Thành Nhiệm Vụ Hàng Ngày |
| **Mô tả** | Học sinh nhận và hoàn thành các nhiệm vụ hàng ngày để nhận thưởng và duy trì streak |
| **Actor chính** | Học sinh |
| **Actor phụ** | Hệ thống, Quest Manager |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Có nhiệm vụ được gán |
| **Điều kiện thành công** | - Hoàn thành nhiệm vụ<br>- Nhận thưởng<br>- Cập nhật streak |
| **Luồng chính** | 1. Hệ thống tạo daily quest<br>2. Hiển thị danh sách nhiệm vụ<br>3. Học sinh chọn nhiệm vụ<br>4. Thực hiện nhiệm vụ<br>5. Hệ thống validate completion<br>6. Nhận thưởng và cập nhật streak<br>7. Unlock bonus nếu hoàn thành tất cả |
| **Luồng thay thế** | **4a.** Nhiệm vụ quá khó:<br>&nbsp;&nbsp;4a1. Hiển thị gợi ý<br>&nbsp;&nbsp;4a2. Cho phép skip (giới hạn)<br>**6a.** Streak milestone:<br>&nbsp;&nbsp;6a1. Hiển thị celebration<br>&nbsp;&nbsp;6a2. Unlock special reward |
| **Luồng ngoại lệ** | **E1.** Hết thời gian trong ngày:<br>&nbsp;&nbsp;E1.1. Nhiệm vụ bị reset<br>&nbsp;&nbsp;E1.2. Mất streak<br>**E2.** Nhiệm vụ bị lỗi:<br>&nbsp;&nbsp;E2.1. Tự động hoàn thành<br>&nbsp;&nbsp;E2.2. Ghi log lỗi |
| **Tần suất** | Hàng ngày |
| **Mức độ quan trọng** | Trung bình |

---

## 🏆 Use Case 6: Bảng Xếp Hạng

### UC-006: Xem Bảng Xếp Hạng
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-006 |
| **Tên** | Xem và Tương Tác Bảng Xếp Hạng |
| **Mô tả** | Học sinh xem bảng xếp hạng, so sánh với bạn bè và tham gia các thử thách |
| **Actor chính** | Học sinh |
| **Actor phụ** | Hệ thống, Social System |
| **Điều kiện tiên quyết** | - Đã có điểm số<br>- Kết nối internet |
| **Điều kiện thành công** | - Hiển thị bảng xếp hạng<br>- Cập nhật real-time<br>- Tham gia challenge thành công |
| **Luồng chính** | 1. Truy cập bảng xếp hạng<br>2. Hệ thống load dữ liệu ranking<br>3. Hiển thị vị trí cá nhân<br>4. Hiển thị top learners<br>5. Học sinh tham gia challenge<br>6. Cập nhật điểm số real-time<br>7. Thông báo khi thay đổi ranking |
| **Luồng thay thế** | **3a.** Chưa có điểm:<br>&nbsp;&nbsp;3a1. Hiển thị thông báo<br>&nbsp;&nbsp;3a2. Đề xuất bài học<br>**5a.** Tạo challenge mới:<br>&nbsp;&nbsp;5a1. Mời bạn bè<br>&nbsp;&nbsp;5a2. Đặt mục tiêu |
| **Luồng ngoại lệ** | **E1.** Lỗi load ranking:<br>&nbsp;&nbsp;E1.1. Hiển thị cache<br>&nbsp;&nbsp;E1.2. Retry tự động<br>**E2.** Challenge không hợp lệ:<br>&nbsp;&nbsp;E2.1. Hủy challenge<br>&nbsp;&nbsp;E2.2. Thông báo lỗi |
| **Tần suất** | 2-3 lần/tuần |
| **Mức độ quan trọng** | Thấp |

---

## 🔐 Use Case 7: Quản Lý Tài Khoản

### UC-007: Đăng Nhập/Đăng Ký
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-007 |
| **Tên** | Xác Thực Người Dùng |
| **Mô tả** | Học sinh và phụ huynh đăng nhập/đăng ký tài khoản với các phương thức khác nhau |
| **Actor chính** | Học sinh, Phụ huynh |
| **Actor phụ** | Hệ thống, Auth Service |
| **Điều kiện tiên quyết** | - Có thiết bị kết nối internet<br>- Ứng dụng đã cài đặt |
| **Điều kiện thành công** | - Xác thực thành công<br>- Session được tạo<br>- Chuyển đến dashboard |
| **Luồng chính** | 1. Chọn phương thức đăng nhập<br>2. Nhập thông tin xác thực<br>3. Hệ thống validate<br>4. Tạo session/token<br>5. Load profile người dùng<br>6. Chuyển đến dashboard |
| **Luồng thay thế** | **1a.** Đăng ký mới:<br>&nbsp;&nbsp;1a1. Nhập thông tin cá nhân<br>&nbsp;&nbsp;1a2. Xác thực email/SMS<br>&nbsp;&nbsp;1a3. Tạo tài khoản<br>**2a.** Quên mật khẩu:<br>&nbsp;&nbsp;2a1. Reset password<br>&nbsp;&nbsp;2a2. Gửi link reset |
| **Luồng ngoại lệ** | **E1.** Thông tin sai:<br>&nbsp;&nbsp;E1.1. Hiển thị lỗi<br>&nbsp;&nbsp;E1.2. Cho phép thử lại<br>**E2.** Tài khoản bị khóa:<br>&nbsp;&nbsp;E2.1. Thông báo lý do<br>&nbsp;&nbsp;E2.2. Hướng dẫn liên hệ |
| **Tần suất** | 1 lần/session |
| **Mức độ quan trọng** | Cao |

---

## 👨‍👩‍👧‍👦 Use Case 8: Quản Lý Phụ Huynh

### UC-008: Dashboard Phụ Huynh
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-008 |
| **Tên** | Theo Dõi Con Em |
| **Mô tả** | Phụ huynh theo dõi tiến độ học tập của con, thiết lập kiểm soát và nhận báo cáo |
| **Actor chính** | Phụ huynh |
| **Actor phụ** | Hệ thống, Notification Service |
| **Điều kiện tiên quyết** | - Đã liên kết tài khoản con<br>- Có quyền truy cập |
| **Điều kiện thành công** | - Xem được tiến độ con<br>- Thiết lập kiểm soát thành công<br>- Nhận báo cáo đều đặn |
| **Luồng chính** | 1. Đăng nhập dashboard phụ huynh<br>2. Chọn tài khoản con<br>3. Xem tổng quan tiến độ<br>4. Thiết lập time limit/control<br>5. Nhận notification về hoạt động<br>6. Export báo cáo tuần/tháng |
| **Luồng thay thế** | **4a.** Thiết lập reminder:<br>&nbsp;&nbsp;4a1. Đặt lịch học<br>&nbsp;&nbsp;4a2. Gửi thông báo<br>**5a.** Emergency alert:<br>&nbsp;&nbsp;5a1. Gửi SMS/Email<br>&nbsp;&nbsp;5a2. Thông báo trên app |
| **Luồng ngoại lệ** | **E1.** Không có dữ liệu:<br>&nbsp;&nbsp;E1.1. Hiển thị hướng dẫn<br>&nbsp;&nbsp;E1.2. Khuyến khích con sử dụng app<br>**E2.** Lỗi notification:<br>&nbsp;&nbsp;E2.1. Lưu queue retry<br>&nbsp;&nbsp;E2.2. Thông báo lỗi |
| **Tần suất** | 2-3 lần/tuần |
| **Mức độ quan trọng** | Trung bình |

---

## 🛠️ Use Case 9: Cài Đặt Hệ Thống

### UC-009: Cài Đặt Cá Nhân Hóa
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-009 |
| **Tên** | Cài Đặt và Cá Nhân Hóa |
| **Mô tả** | Người dùng tùy chỉnh cài đặt ứng dụng, theme, thông báo và preference |
| **Actor chính** | Học sinh, Phụ huynh |
| **Actor phụ** | Hệ thống |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Có quyền truy cập settings |
| **Điều kiện thành công** | - Cài đặt được lưu<br>- Áp dụng ngay lập tức<br>- Sync cross-device |
| **Luồng chính** | 1. Truy cập Settings<br>2. Chỉnh sửa preferences<br>3. Lưu cài đặt<br>4. Hệ thống validate<br>5. Áp dụng changes<br>6. Sync đến tất cả devices |
| **Luồng thay thế** | **2a.** Reset to default:<br>&nbsp;&nbsp;2a1. Xác nhận reset<br>&nbsp;&nbsp;2a2. Khôi phục cài đặt gốc<br>**5a.** Conflict settings:<br>&nbsp;&nbsp;5a1. Hiển thị warning<br>&nbsp;&nbsp;5a2. Đề xuất giải pháp |
| **Luồng ngoại lệ** | **E1.** Cài đặt không hợp lệ:<br>&nbsp;&nbsp;E1.1. Hiển thị lỗi validation<br>&nbsp;&nbsp;E1.2. Revert về cũ<br>**E2.** Lỗi sync:<br>&nbsp;&nbsp;E2.1. Lưu local<br>&nbsp;&nbsp;E2.2. Retry sau |
| **Tần suất** | 1-2 lần/tháng |
| **Mức độ quan trọng** | Thấp |

---

## 🎮 Use Case 10: Gamification

### UC-010: Hệ Thống Thành Tích và Rewards
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-010 |
| **Tên** | Kiếm Thành Tích và Phần Thưởng |
| **Mô tả** | Học sinh hoàn thành các mục tiêu để unlock badges, achievements và rewards |
| **Actor chính** | Học sinh |
| **Actor phụ** | Hệ thống, Achievement Engine |
| **Điều kiện tiên quyết** | - Đã tham gia học tập<br>- Có hoạt động trên app |
| **Điều kiện thành công** | - Unlock achievement<br>- Nhận reward<br>- Cập nhật profile |
| **Luồng chính** | 1. Hệ thống monitor hoạt động<br>2. Detect achievement trigger<br>3. Validate điều kiện<br>4. Unlock badge/achievement<br>5. Hiển thị celebration<br>6. Cập nhật profile<br>7. Chia sẻ (tùy chọn) |
| **Luồng thay thế** | **2a.** Near milestone:<br>&nbsp;&nbsp;2a1. Hiển thị progress bar<br>&nbsp;&nbsp;2a2. Encourage hoàn thành<br>**7a.** Share achievement:<br>&nbsp;&nbsp;7a1. Chọn platform<br>&nbsp;&nbsp;7a2. Tạo share content |
| **Luồng ngoại lệ** | **E1.** Duplicate achievement:<br>&nbsp;&nbsp;E1.1. Không thưởng lại<br>&nbsp;&nbsp;E1.2. Log warning<br>**E2.** Reward service down:<br>&nbsp;&nbsp;E2.1. Queue reward<br>&nbsp;&nbsp;E2.2. Process sau |
| **Tần suất** | Theo hoạt động |
| **Mức độ quan trọng** | Trung bình |

---

## 📱 Tóm Tắt Use Cases

### 📊 Thống Kê Use Cases

| Mức độ quan trọng | Số lượng | Tỷ lệ |
|-------------------|----------|-------|
| **Cao** | 4 | 40% |
| **Trung bình** | 4 | 40% |
| **Thấp** | 2 | 20% |
| **Tổng cộng** | **10** | **100%** |

### 🎯 Use Cases theo Actor

| Actor | Use Cases liên quan |
|-------|-------------------|
| **Học sinh** | UC-001, UC-002, UC-004, UC-005, UC-006, UC-007, UC-009, UC-010 |
| **Phụ huynh** | UC-003, UC-007, UC-008, UC-009 |
| **Giáo viên** | UC-003, UC-007 |
| **Hệ thống** | Tất cả use cases |

### 🔄 Tần Suất Sử Dụng

| Tần suất | Use Cases |
|----------|-----------|
| **Hàng ngày** | UC-001, UC-002, UC-003, UC-005 |
| **2-3 lần/tuần** | UC-006, UC-008 |
| **1-2 lần/tuần** | UC-004 |
| **1-2 lần/tháng** | UC-009 |
| **Theo sự kiện** | UC-007, UC-010 |

---

## 🚀 Kế Hoạch Triển Khai

### Phase 1: Core Features (Tháng 1-2)
- UC-007: Authentication
- UC-001: Slideshow Learning
- UC-002: Quiz/Exercise
- UC-003: Progress Tracking

### Phase 2: Engagement Features (Tháng 3-4)
- UC-005: Daily Quest
- UC-010: Gamification
- UC-006: Leaderboard

### Phase 3: Advanced Features (Tháng 5-6)
- UC-004: Video Lessons
- UC-008: Parent Dashboard
- UC-009: Customization

---

*Tài liệu này phục vụ cho việc phát triển ứng dụng học tập tương tác dành cho trẻ em. Các use case có thể được điều chỉnh dựa trên feedback và requirements thực tế.*
