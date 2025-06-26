# Debug LearningAPI và Redux Issues

## 🚨 Vấn đề hiện tại:

1. **MongoDB ObjectId Error**: Fixed ✅
2. **Redux "totalSlides not available"**: Cần debug thêm

## 🔧 Debug Steps:

### 1. Clear Test Data:
Mở Console và chạy:
```javascript
// Clear localStorage
LearningAPI.clearTestData();

// Check current userId
console.log('Test Info:', LearningAPI.getTestInfo());
```

### 2. Test Backend Health:
```javascript
// Test health endpoint
LearningAPI.healthCheck()
  .then(data => console.log('✅ Health check:', data))
  .catch(err => console.error('❌ Health check failed:', err));
```

### 3. Test Initialize Progress:
```javascript
// Test initialize with proper ObjectId
LearningAPI.initializeProgress('test-lesson-123', 10)
  .then(data => console.log('✅ Initialize success:', data))
  .catch(err => console.error('❌ Initialize failed:', err));
```

### 4. Test Update Slide Position:
```javascript
// Test update slide position
LearningAPI.updateSlidePosition('test-lesson-123', 2, 'slide-2', 30)
  .then(data => console.log('✅ Update success:', data))
  .catch(err => console.error('❌ Update failed:', err));
```

## 🎯 Expected vs Actual:

### Expected ObjectId format:
- **Length**: 24 characters
- **Format**: Hex string (0-9, a-f)
- **Example**: `683ab3a52651632e975a79c2`

### Generated userId debug:
```javascript
const testInfo = LearningAPI.getTestInfo();
console.log('Generated userId:', testInfo.userId);
console.log('Length:', testInfo.userIdLength);
console.log('Is valid ObjectId:', testInfo.isValidObjectId);
```

## 🛠️ Debug trong KidsSlideshow:

1. **Check Redux State**:
   - Mở Redux DevTools
   - Check `progressV2` state
   - Verify `totalSlides` có được set chưa

2. **Check initLesson call**:
   - Ensure `slides.length` được pass đúng
   - Verify `data?.id` tồn tại

## 🚀 Quick Fix Test:

Thử reload page và check console logs theo thứ tự:
1. Health check ✅
2. Initialize progress ✅  
3. Start session ✅
4. Slide position updates ✅

## 📋 Final Checklist:

- [ ] Backend server running (`node server.js`)
- [ ] MongoDB connected
- [ ] Valid ObjectId generated (24 chars)
- [ ] Redux totalSlides set properly
- [ ] All API endpoints responding

## 🔍 Advanced Debug:

Nếu vẫn lỗi, check backend logs:
```bash
cd c:\Users\trant\OneDrive\Desktop\chat-server
node server.js
# Watch console for error logs
```
