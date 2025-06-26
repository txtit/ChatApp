# LearningAPI Endpoint Test

## 🔧 Cập nhật API Endpoints

Đã cập nhật `LearningAPI.js` để match với backend routes:

### ✅ Endpoints mới (đã sửa):

1. **Initialize Progress**:
   - **Cũ**: `POST /learning/initialize-progress`
   - **Mới**: `POST /learning/lessons/{lessonId}/initialize`

2. **Update Slide Position**:
   - **Cũ**: `POST /learning/update-slide-position`
   - **Mới**: `PUT /learning/lessons/{lessonId}/slide-position`

3. **Start Session**:
   - **Cũ**: `POST /learning/start-session`
   - **Mới**: `POST /learning/lessons/{lessonId}/sessions/start`

4. **End Session**:
   - **Cũ**: `POST /learning/end-session`
   - **Mới**: `PUT /learning/sessions/{sessionId}/end`

5. **Submit Exercise**:
   - **Cũ**: `POST /learning/submit-exercise`
   - **Mới**: `POST /learning/lessons/{lessonId}/exercises/submit`

## 🧪 Quick Test Commands

### Test với curl (nếu backend đang chạy):

```bash
# 1. Health Check
curl http://localhost:3000/learning/health

# 2. Test Initialize Progress
curl -X POST http://localhost:3000/learning/lessons/test-lesson-1/initialize \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","totalSlides":10,"lessonTitle":"Test Lesson"}'

# 3. Test Update Slide Position
curl -X PUT http://localhost:3000/learning/lessons/test-lesson-1/slide-position \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","slideIndex":2,"slideId":"slide-2","progress":30}'

# 4. Test Start Session
curl -X POST http://localhost:3000/learning/lessons/test-lesson-1/sessions/start \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","deviceInfo":{"userAgent":"test"}}'
```

## 🔧 Debugging trong Frontend

Mở Console (F12) và check logs:

### Các logs mong đợi:
```javascript
// ✅ Thành công
✅ LearningAPI Response: http://localhost:3000/learning/health
✅ Backend health check passed
✅ Backend progress initialized
✅ Learning session started

// ❌ Lỗi cũ (đã fix)
❌ LearningAPI Error: http://localhost:3000/learning/update-slide-position SyntaxError: Unexpected token '<'

// ✅ Logs mới (sau khi fix)
📡 LearningAPI Request: PUT http://localhost:3000/learning/lessons/lesson-123/slide-position
✅ LearningAPI Response: http://localhost:3000/learning/lessons/lesson-123/slide-position
```

## 🚀 Start Backend Server

Để test, đảm bảo backend server đang chạy:

```bash
cd c:\Users\trant\OneDrive\Desktop\chat-server
npm start
# hoặc
node server.js
```

## 📋 Checklist Sau Khi Update

- [x] Cập nhật initializeProgress endpoint
- [x] Cập nhật updateSlidePosition endpoint  
- [x] Cập nhật startLearningSession endpoint
- [x] Cập nhật endLearningSession endpoint
- [x] Cập nhật submitExerciseResult endpoint
- [x] Cập nhật getUserProgress endpoint
- [x] Cập nhật getLessonProgress endpoint
- [x] Cập nhật bulkUpdateProgress endpoint
- [x] Cập nhật resetLessonProgress endpoint
- [x] Fix debounceUpdateSlidePosition method

## 🎯 Test trong KidsSlideshow

1. **Vào một bài học** → Check health check và session start
2. **Chuyển slides** → Check slide position update (debounced)
3. **Làm quiz/exercise** → Check result submission
4. **Hoàn thành lesson** → Check session end

Tất cả API calls giờ sẽ gọi đúng endpoints backend!
