# 📋 Bảng Tóm Tắt Use Cases - Ứng dụng Học tập

## 🎯 Bảng Use Cases Chính

| ID | Tên Use Case | Actor | Mức độ | Tần suất | Mô tả ngắn |
|----|--------------|-------|---------|----------|------------|
| UC-001 | Học Bài Slideshow | Học sinh | Cao | Hàng ngày | Học qua slideshow tương tác với bài tập |
| UC-002 | Làm Bài Tập/Quiz | Học sinh | Cao | Hàng ngày | Quiz đa dạng với timer và feedback |
| UC-003 | Theo Dõi Tiến Độ | Học sinh, PH | Trung bình | Hàng ngày | Dashboard tiến độ với biểu đồ |
| UC-004 | Xem Video Lesson | Học sinh | Cao | 1-2 lần/tuần | Video tương tác với quiz |
| UC-005 | Daily Quest | Học sinh | Trung bình | Hàng ngày | Nhiệm vụ hàng ngày để duy trì streak |
| UC-006 | Bảng Xếp Hạng | Học sinh | Thấp | 2-3 lần/tuần | Ranking và challenge bạn bè |
| UC-007 | Xác Thực | Tất cả | Cao | 1 lần/session | Đăng nhập/đăng ký |
| UC-008 | Dashboard Phụ Huynh | Phụ huynh | Trung bình | 2-3 lần/tuần | Theo dõi con em |
| UC-009 | Cài Đặt | Tất cả | Thấp | 1-2 lần/tháng | Tùy chỉnh cá nhân |
| UC-010 | Gamification | Học sinh | Trung bình | Theo sự kiện | Thành tích và phần thưởng |

*PH: Phụ huynh*

## 🔄 Ma Trận Use Case - Actor

| Use Case | Học sinh | Phụ huynh | Giáo viên | Admin | Hệ thống |
|----------|:--------:|:---------:|:---------:|:-----:|:--------:|
| UC-001 Slideshow | ✅ | - | - | - | S |
| UC-002 Quiz | ✅ | - | - | - | S |
| UC-003 Progress | ✅ | ✅ | ✅ | - | S |
| UC-004 Video | ✅ | - | - | - | S |
| UC-005 Daily Quest | ✅ | - | - | - | S |
| UC-006 Leaderboard | ✅ | - | - | - | S |
| UC-007 Auth | ✅ | ✅ | ✅ | ✅ | S |
| UC-008 Parent Dashboard | - | ✅ | - | - | S |
| UC-009 Settings | ✅ | ✅ | ✅ | ✅ | S |
| UC-010 Gamification | ✅ | - | - | - | S |

**Ký hiệu**: ✅ = Actor chính, S = Hỗ trợ/Supporting

## 📊 Phân Tích Tần Suất

### Theo Tần Suất Sử Dụng
```
Hàng ngày        ████████████████████████████████████████ 40%
2-3 lần/tuần     ████████████████████ 20%
1-2 lần/tuần     ██████████ 10%
1-2 lần/tháng    ██████████ 10%
Theo sự kiện     ████████████████████ 20%
```

### Theo Mức Độ Quan Trọng
```
Cao              ████████████████████████████████████████ 40%
Trung bình       ████████████████████████████████████████ 40%
Thấp            ████████████████████ 20%
```

## 🎯 Use Cases theo Chức Năng

### 📚 Học Tập (Learning)
| ID | Tên | Mô tả ngắn |
|----|-----|------------|
| UC-001 | Slideshow | Học qua slide tương tác |
| UC-002 | Quiz | Bài tập và kiểm tra |
| UC-004 | Video | Video lesson có tương tác |

### 📈 Theo Dõi (Tracking)
| ID | Tên | Mô tả ngắn |
|----|-----|------------|
| UC-003 | Progress | Dashboard tiến độ |
| UC-008 | Parent Dashboard | Theo dõi của phụ huynh |

### 🎮 Gamification
| ID | Tên | Mô tả ngắn |
|----|-----|------------|
| UC-005 | Daily Quest | Nhiệm vụ hàng ngày |
| UC-006 | Leaderboard | Bảng xếp hạng |
| UC-010 | Achievement | Thành tích và phần thưởng |

### ⚙️ Hệ Thống (System)
| ID | Tên | Mô tả ngắn |
|----|-----|------------|
| UC-007 | Authentication | Đăng nhập/đăng ký |
| UC-009 | Settings | Cài đặt cá nhân |

## 🔀 Luồng Use Case Chính

### Luồng Học Tập Cơ Bản
```
UC-007 (Login) → UC-001 (Slideshow) → UC-002 (Quiz) → UC-003 (Progress)
                                                    ↓
UC-010 (Achievement) ← UC-005 (Daily Quest) ←─────┘
```

### Luồng Phụ Huynh
```
UC-007 (Login) → UC-008 (Parent Dashboard) → UC-003 (Progress View)
                                           ↓
                                      UC-009 (Settings)
```

### Luồng Gamification
```
UC-001/UC-002/UC-004 → UC-010 (Achievement) → UC-006 (Leaderboard)
         ↓                        ↑
   UC-005 (Daily Quest) ─────────┘
```

## 🚀 Roadmap Triển Khai

### Phase 1: Foundation (Tháng 1-2) - 40%
- [x] UC-007: Authentication System
- [x] UC-001: Slideshow Learning
- [x] UC-002: Quiz System
- [x] UC-003: Basic Progress Tracking

### Phase 2: Engagement (Tháng 3-4) - 30%
- [ ] UC-005: Daily Quest System
- [ ] UC-010: Achievement Engine
- [ ] UC-006: Leaderboard & Social

### Phase 3: Advanced (Tháng 5-6) - 30%
- [ ] UC-004: Video Learning
- [ ] UC-008: Parent Dashboard
- [ ] UC-009: Advanced Settings

## 📋 Checklist Implementation

### Cơ Sở Hạ Tầng
- [x] Authentication Service
- [x] User Management
- [x] Progress Tracking
- [ ] Video Streaming
- [ ] Real-time Notifications
- [ ] Analytics Dashboard

### Components Frontend
- [x] Login/Register Forms
- [x] Slideshow Player
- [x] Quiz Engine
- [x] Progress Charts
- [ ] Video Player
- [ ] Parent Dashboard
- [ ] Leaderboard
- [ ] Achievement Gallery

### Backend Services
- [x] User Service
- [x] Content Service
- [ ] Quest Service
- [ ] Achievement Service
- [ ] Analytics Service
- [ ] Notification Service

## 📞 Dependencies và Integrations

### External APIs/Services
| Service | Use Cases | Status |
|---------|-----------|--------|
| Video CDN | UC-004 | Planning |
| Push Notifications | UC-008, UC-010 | Planning |
| Analytics | UC-003, UC-008 | In Progress |
| Payment Gateway | UC-010 | Future |
| Social Media | UC-006, UC-010 | Future |

### Internal Dependencies
| Component | Depends On | Use Cases Affected |
|-----------|------------|-------------------|
| Progress Tracking | User Auth | UC-003, UC-008 |
| Achievement System | Progress + Quiz | UC-010 |
| Leaderboard | Achievement + Social | UC-006 |
| Parent Dashboard | User Auth + Progress | UC-008 |

---

*Tài liệu tham khảo nhanh cho team development. Cập nhật: June 2025*
