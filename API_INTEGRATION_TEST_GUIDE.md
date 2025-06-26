# API Integration Test Guide cho KidsSlideshow

## 🎯 Tổng quan
File `KidsSlideshow.js` đã được cập nhật để tích hợp đầy đủ với backend API thông qua `LearningAPI.js`. Các API calls được thêm vào:

## ✅ Các API Integration đã thêm

### 1. **Lesson Initialization** (Khởi tạo bài học)
- **Vị trí**: useEffect khi component mount
- **API calls**:
  - `LearningAPI.healthCheck()` - Kiểm tra backend health
  - `LearningAPI.initializeProgress(lessonId, totalSlides)` - Khởi tạo progress
  - `LearningAPI.startLearningSession(lessonId, 'study')` - Bắt đầu session
- **State updates**: `currentSessionId`, `isSessionActive`

### 2. **Slide Position Sync** (Đồng bộ vị trí slide)
- **Vị trí**: useEffect khi slideIndex thay đổi
- **API calls**: 
  - `LearningAPI.debounceUpdateSlidePosition()` - Cập nhật vị trí (debounced 1.5s)
- **Tự động**: Gọi mỗi khi user chuyển slide (có debounce để tránh spam)

### 3. **Quiz Result Submission** (Gửi kết quả quiz)
- **Vị trí**: `handleCheckQuizAnswers()`
- **API calls**: 
  - `LearningAPI.submitExerciseResult(lessonId, slideId, 'quiz', score, answers)`
- **Trigger**: Khi user submit quiz answers

### 4. **Exercise Result Submission** (Gửi kết quả exercise)
- **Vị trí**: `handleExerciseComplete()`
- **API calls**: 
  - `LearningAPI.submitExerciseResult(lessonId, slideId, 'exercise', score, null)`
- **Trigger**: Khi user hoàn thành exercise

### 5. **Session Management** (Quản lý session)
- **End Session khi**:
  - Component unmount (user thoát): `LearningAPI.endLearningSession(sessionId, 'partial', slideIndex)`
  - Hoàn thành lesson: `LearningAPI.endLearningSession(sessionId, 'completed', totalSlides-1)`

## 🧪 Cách Test

### Test 1: Backend Connection
1. Mở Console (F12)
2. Vào một bài học
3. Kiểm tra logs:
   ```
   🏥 Checking backend health...
   ✅ Backend health check passed
   🚀 Initializing backend progress for lesson: [lessonId]
   ✅ Backend progress initialized
   ✅ Learning session started
   📝 Session ID stored: [sessionId]
   ```

### Test 2: Slide Position Sync
1. Chuyển qua lại các slides
2. Kiểm tra logs (debounced 1.5s):
   ```
   🔄 Syncing slide position with backend (debounced)
   ```
3. Click button "API Sync" để test manual sync

### Test 3: Quiz Submission
1. Làm một quiz slide
2. Submit answers
3. Kiểm tra logs:
   ```
   📤 Submitting quiz result to backend
   ✅ Quiz result submitted successfully
   ```

### Test 4: Exercise Submission
1. Hoàn thành một exercise slide
2. Kiểm tra logs:
   ```
   📤 Submitting exercise result to backend
   ✅ Exercise result submitted successfully
   ```

### Test 5: Session End
1. **Test khi thoát**: Reload page giữa chừng
2. **Test khi hoàn thành**: Làm hết tất cả slides
3. Kiểm tra logs:
   ```
   ✅ Learning session ended - lesson completed
   hoặc
   ✅ Learning session ended on component unmount
   ```

## 🎮 Debug Controls

### Debug Buttons (cuối trang)
- **Check Position**: Hiển thị vị trí slide đã lưu
- **Save Position**: Lưu vị trí hiện tại manually
- **API Sync**: Test sync với backend manually
- **Session Chip**: Hiển thị session ID hiện tại

### Console Logs
Tất cả API calls đều có logs chi tiết:
- ✅ Thành công (màu xanh)
- ❌ Lỗi (màu đỏ)
- 🔄 Đang xử lý (màu xanh dương)

## 🚨 Error Handling

### Nếu Backend không khả dụng:
```javascript
❌ Error initializing backend progress/session: [error]
⚠️ Continuing with Redux-only mode
```
- App sẽ tiếp tục hoạt động với Redux only
- Không crash, vẫn lưu progress local

### API Call Failures:
- Tất cả API calls đều có try-catch
- Log errors nhưng không block UI
- User vẫn có thể học bình thường

## 📋 Checklist Test

- [ ] Backend health check thành công
- [ ] Lesson initialization tạo session
- [ ] Slide position sync hoạt động (debounced)
- [ ] Quiz result submission thành công
- [ ] Exercise result submission thành công
- [ ] Session kết thúc khi hoàn thành lesson
- [ ] Session kết thúc khi thoát giữa chừng
- [ ] Debug buttons hoạt động
- [ ] App vẫn hoạt động khi backend down

## 🔗 API Endpoints được sử dụng

```
GET  /learning/health
POST /learning/initialize-progress
POST /learning/start-session
POST /learning/update-slide-position
POST /learning/submit-exercise
POST /learning/end-session
```

## 📝 Notes

1. **Debouncing**: Slide position update có debounce 1.5s để tránh spam API
2. **Fallback**: Nếu API fails, app tiếp tục với Redux-only mode
3. **Session Management**: Tự động track session lifecycle
4. **Error Resilience**: Không bao giờ crash vì API errors

## 🎉 Kết quả mong đợi

Sau khi test thành công:
- Progress được lưu real-time trong backend
- Session tracking đầy đủ
- Quiz/Exercise results được submit
- User experience không bị ảnh hưởng bởi API calls
- Backend có đầy đủ data để analytics/reporting
