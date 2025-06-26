# 📝 Template Use Case - Ứng dụng Học tập

## 📋 Template Chuẩn Use Case

### UC-XXX: [Tên Use Case]
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-XXX |
| **Tên** | [Tên đầy đủ của use case] |
| **Mô tả** | [Mô tả chi tiết chức năng] |
| **Actor chính** | [Ai là người thực hiện chính] |
| **Actor phụ** | [Các actor hỗ trợ] |
| **Điều kiện tiên quyết** | - [Điều kiện 1]<br>- [Điều kiện 2] |
| **Điều kiện thành công** | - [Kết quả mong muốn 1]<br>- [Kết quả mong muốn 2] |
| **Luồng chính** | 1. [Bước 1]<br>2. [Bước 2]<br>3. [Bước 3] |
| **Luồng thay thế** | **2a.** [Tình huống A]:<br>&nbsp;&nbsp;2a1. [Xử lý A1]<br>&nbsp;&nbsp;2a2. [Xử lý A2] |
| **Luồng ngoại lệ** | **E1.** [Lỗi 1]:<br>&nbsp;&nbsp;E1.1. [Xử lý lỗi 1]<br>&nbsp;&nbsp;E1.2. [Fallback] |
| **Tần suất** | [Hàng ngày/Hàng tuần/Hàng tháng] |
| **Mức độ quan trọng** | [Cao/Trung bình/Thấp] |

---

## 🎯 Ví Dụ Use Case Mới

### UC-011: Hệ Thống Chat Học Tập
| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-011 |
| **Tên** | Chat với AI Tutor |
| **Mô tả** | Học sinh chat với AI để được hỗ trợ học tập, giải đáp thắc mắc |
| **Actor chính** | Học sinh |
| **Actor phụ** | AI Tutor, Hệ thống |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Kết nối internet<br>- Có credit chat (nếu giới hạn) |
| **Điều kiện thành công** | - Nhận được câu trả lời<br>- Conversation được lưu<br>- Cập nhật learning path |
| **Luồng chính** | 1. Học sinh mở chat interface<br>2. Nhập câu hỏi<br>3. AI xử lý và phân tích context<br>4. Trả lời phù hợp với độ tuổi<br>5. Lưu conversation history<br>6. Đề xuất bài học liên quan |
| **Luồng thay thế** | **3a.** Câu hỏi phức tạp:<br>&nbsp;&nbsp;3a1. Chia nhỏ thành sub-questions<br>&nbsp;&nbsp;3a2. Trả lời từng phần<br>**4a.** Cần visual aid:<br>&nbsp;&nbsp;4a1. Tạo diagram/hình ảnh<br>&nbsp;&nbsp;4a2. Embed vào response |
| **Luồng ngoại lệ** | **E1.** AI service down:<br>&nbsp;&nbsp;E1.1. Fallback to FAQ<br>&nbsp;&nbsp;E1.2. Queue question cho sau<br>**E2.** Inappropriate question:<br>&nbsp;&nbsp;E2.1. Filter và warning<br>&nbsp;&nbsp;E2.2. Redirect đến suitable content |
| **Tần suất** | 3-5 lần/ngày |
| **Mức độ quan trọng** | Trung bình |

---

## 📊 Checklist Phát Triển Use Case

### ✅ Giai Đoạn Phân Tích
- [ ] Xác định actor chính và phụ
- [ ] Liệt kê các điều kiện tiên quyết
- [ ] Định nghĩa success criteria
- [ ] Vẽ sơ đồ luồng chính
- [ ] Brainstorm các luồng thay thế
- [ ] Identify potential exceptions
- [ ] Đánh giá tần suất và độ quan trọng

### 🛠️ Giai Đoạn Thiết Kế
- [ ] Thiết kế UI/UX mockup
- [ ] Định nghĩa API endpoints
- [ ] Xác định data models
- [ ] Plan database schema changes
- [ ] Identify external dependencies
- [ ] Security và permission planning
- [ ] Performance requirements

### 🧪 Giai Đoạn Testing
- [ ] Unit test cases
- [ ] Integration test scenarios
- [ ] User acceptance criteria
- [ ] Edge cases testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Accessibility testing

### 🚀 Giai Đoạn Deployment
- [ ] Feature flagging setup
- [ ] Rollout strategy
- [ ] Monitoring và alerting
- [ ] User documentation
- [ ] Training materials
- [ ] Rollback plan
- [ ] Success metrics tracking

---

## 🔄 Use Case Review Process

### 📝 Review Checklist
1. **Completeness**: Có đủ thông tin không?
2. **Clarity**: Có rõ ràng, dễ hiểu không?
3. **Consistency**: Có nhất quán với hệ thống không?
4. **Feasibility**: Có khả thi trong timeline không?
5. **Value**: Có mang lại giá trị cho user không?

### 👥 Stakeholder Sign-off
- [ ] Product Manager approval
- [ ] Engineering team review
- [ ] UX/UI team input
- [ ] QA team assessment
- [ ] Security team review (if needed)
- [ ] Legal/Compliance check (if needed)

---

## 📚 Tài Liệu Tham Khảo

### Internal References
- [USE_CASES_DOCUMENTATION.md](./USE_CASES_DOCUMENTATION.md) - Use cases chi tiết
- [USE_CASES_SUMMARY_TABLE.md](./USE_CASES_SUMMARY_TABLE.md) - Bảng tóm tắt
- [SEQUENCE_DIAGRAMS_SUMMARY.md](./SEQUENCE_DIAGRAMS_SUMMARY.md) - Sequence diagrams

### External Standards
- IEEE 830-1998 (Software Requirements Specification)
- UML 2.5 Use Case Modeling
- Agile User Story Best Practices

### Tools Recommended
- **Documentation**: Markdown, Confluence
- **Diagramming**: Draw.io, Lucidchart, PlantUML
- **Tracking**: Jira, Azure DevOps, Linear
- **Testing**: Postman, Jest, Cypress

---

*Template này giúp standardize việc tạo use case mới và đảm bảo quality consistency across team.*

**Cập nhật lần cuối**: June 2025  
**Version**: 1.0  
**Tác giả**: Development Team
