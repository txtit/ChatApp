# Hướng dẫn khắc phục lỗi xác thực Parent Dashboard

## Vấn đề
Khi truy cập Parent Dashboard, bạn gặp lỗi:
```
❌ API Error 401: Access denied. No token provided.
```

## Nguyên nhân
- Người dùng chưa đăng nhập
- Token xác thực đã hết hạn
- Token không tồn tại trong localStorage

## Cách khắc phục

### 1. Đăng nhập qua giao diện (Khuyến nghị)
1. Click nút **"Đăng nhập"** trên màn hình thông báo lỗi
2. Nhập thông tin đăng nhập hợp lệ
3. Hệ thống sẽ tự động lưu token và redirect về dashboard

### 2. Kiểm tra token trong browser (Phát triển)
1. Mở Developer Tools (F12)
2. Vào tab **Console**
3. Kiểm tra token hiện tại:
   ```javascript
   localStorage.getItem('authToken') || localStorage.getItem('accessToken')
   ```
4. Nếu không có token, tạo token test:
   ```javascript
   localStorage.setItem('authToken', 'test-token-' + Date.now())
   ```
5. Refresh trang

### 3. Sử dụng tiện ích test (Phát triển)
Trong console của browser, sử dụng:
```javascript
// Kiểm tra trạng thái xác thực
window.testAuth.checkAuth()

// Tạo token test
window.testAuth.createTestToken()

// Xóa token (logout)
window.testAuth.clearAuth()
```

### 4. Nút "Tạo token mẫu" (Phát triển)
Trên màn hình lỗi xác thực, click nút **"(Test: Tạo token mẫu)"** để tạo token test nhanh.

## Backend Test
Để test API trực tiếp:

```bash
# Test với token giả
curl -H "Authorization: Bearer test-token-123456" \
     http://localhost:3000/parent/children

# Kết quả mong đợi: danh sách children hoặc mảng rỗng (không lỗi 401)
```

## Cấu hình Production
Trong production, cần:
1. Implement JWT verification thật trong `middleware/learningAuth.js`
2. Tắt test token bằng cách set `NODE_ENV=production`
3. Đảm bảo user phải đăng nhập thật qua API `/auth/login`

## Troubleshooting

### Lỗi vẫn tiếp diễn
1. Kiểm tra backend có chạy tại `http://localhost:3000`
2. Kiểm tra console backend xem có log xác thực không
3. Kiểm tra Network tab trong DevTools xem API call có đúng headers không

### Token bị từ chối
1. Đảm bảo token có prefix `Bearer `
2. Kiểm tra middleware `protect` trong `/routes/parent.js`
3. Xem log backend để hiểu lý do token bị reject

## Liên hệ
Nếu vấn đề vẫn tiếp diễn, kiểm tra:
- Backend logs trong terminal chạy server
- Browser console errors
- Network requests trong DevTools
