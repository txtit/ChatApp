# HƯỚNG DẪN SỬ DỤNG REDUX PROGRESS V2 - CẤU TRÚC MỚI

## � THAY ĐỔI CHÍNH - TÍCH HỢP LASTSLIDEPOSITIONS VÀO SLIDES

### Trước đây:
```javascript
// State cũ có 2 object riêng biệt
state = {
  slides: {
    slideId1: { visited: true, completed: false },
    slideId2: { visited: true, completed: true }
  },
  lastSlidePositions: {
    lessonId1: { slideIndex: 2, slideId: 'slide3', timestamp: 123456 },
    lessonId2: { slideIndex: 5, slideId: 'slide6', timestamp: 789012 }
  }
}
```

### Bây giờ:
```javascript
// State mới - tích hợp lastSlidePositions vào slides
state = {
  slides: {
    slideId1: { visited: true, completed: false },
    slideId2: { visited: true, completed: true },
    _lastPositions: {
      lessonId1: { slideIndex: 2, slideId: 'slide3', timestamp: 123456 },
      lessonId2: { slideIndex: 5, slideId: 'slide6', timestamp: 789012 }
    }
  }
}
```

## 🎯 LỢI ÍCH

1. **Tối ưu cấu trúc**: Gộp 2 object thành 1, giảm complexity
2. **Dễ quản lý**: Tất cả data về slides ở một chỗ
3. **Performance**: Ít selector calls, ít re-renders
4. **Backup/Restore**: Dễ dàng backup toàn bộ progress
        completedExercises: ["ex-1", "ex-2"],
        completedQuizzes: ["quiz-1"],
        
        // Thành tích
        achievements: [
          {
            id: "first-lesson",
            name: "Bài học đầu tiên",
            description: "Hoàn thành bài học đầu tiên",
            earnedAt: "2024-01-15T10:30:00Z",
            type: "milestone"
          }
        ],
        
        // Mục tiêu hằng ngày
        dailyGoals: {
          studyTime: { target: 3600, current: 1800 },
          lessons: { target: 3, current: 1 },
          exercises: { target: 5, current: 2 }
        },
        
        // Thống kê
        statistics: {
          totalTimeSpent: 3600,
          totalLessonsCompleted: 5,
          totalExercisesCompleted: 10,
          totalQuizzesCompleted: 3,
          streakDays: 7,
          averageScore: 85.5,
          lastActiveDate: "2024-01-15"
        }
      }
    }
  }
}
```

### 2. Files đã được cập nhật

- ✅ `src/redux/slices/progress.js` - Redux slice với đầy đủ actions
- ✅ `src/hooks/useProgress.js` - Custom hook với tất cả functionality
- ✅ `src/components/ProgressDashboard.js` - Dashboard hiển thị tiến độ
- ✅ `src/components/KidsSlideshow/KidsSlideshow.js` - Slideshow tích hợp progress
- ✅ `src/utils/progressHelpers.js` - Utility functions
- ✅ `src/pages/learning/LearningHub.js` - Hub học tập sử dụng Redux progress

## 🚀 Cách sử dụng

### 1. Khởi tạo tiến độ cho user

```javascript
import { useProgress } from '../hooks/useProgress';
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const authState = useSelector(state => state.auth);
  const currentUserId = authState?.user?.id;
  
  const {
    initializeUserProgress,
    startSession,
    progress
  } = useProgress();
  
  // Khởi tạo tiến độ khi user đăng nhập
  useEffect(() => {
    if (currentUserId) {
      initializeUserProgress(currentUserId);
    }
  }, [currentUserId]);
};
```

### 2. Bắt đầu session học

```javascript
const handleStartLearning = async (slideId, slideTitle) => {
  try {
    await startSession({
      slideId,
      slideTitle,
      userId: currentUserId,
      sessionType: 'learning'
    });
    
    // Navigate đến slide
    navigate(`/slide/${slideId}`);
  } catch (error) {
    console.error('Lỗi khi bắt đầu học:', error);
  }
};
```

### 3. Cập nhật tiến độ slide

```javascript
const {
  updateSlideProgress,
  completeSlide,
  navigateToSlide
} = useProgress();

// Cập nhật tiến độ
await updateSlideProgress(slideId, {
  currentSlideIndex: 3,
  progress: 60
});

// Chuyển slide
await navigateToSlide(slideId, 4);

// Hoàn thành slide
await completeSlide(slideId);
```

### 4. Xử lý exercises và quizzes

```javascript
const {
  completeExercise,
  completeQuiz,
  saveExerciseResult,
  saveQuizResult
} = useProgress();

// Lưu kết quả exercise
await saveExerciseResult(slideId, exerciseId, {
  score: 85,
  timeSpent: 120,
  answers: {...}
});

// Hoàn thành exercise
await completeExercise(exerciseId);

// Lưu kết quả quiz
await saveQuizResult(slideId, quizId, {
  score: 90,
  timeSpent: 300,
  answers: {...}
});
```

### 5. Lấy thông tin tiến độ

```javascript
const {
  getSlideProgress,
  isSlideCompleted,
  getLearningStats,
  getDailyGoalProgress,
  getCurrentSessionTime
} = useProgress();

// Lấy % tiến độ của slide
const progressPercent = getSlideProgress(slideId);

// Kiểm tra slide đã hoàn thành chưa
const completed = isSlideCompleted(slideId);

// Lấy thống kê học tập
const stats = getLearningStats();

// Lấy tiến độ mục tiêu hằng ngày
const dailyProgress = getDailyGoalProgress();

// Thời gian session hiện tại
const sessionTime = getCurrentSessionTime();
```

### 6. Quản lý achievements

```javascript
const {
  addAchievement,
  getAchievements,
  checkAchievements
} = useProgress();

// Thêm thành tích
await addAchievement({
  id: 'first-quiz',
  name: 'Quiz đầu tiên',
  description: 'Hoàn thành quiz đầu tiên',
  type: 'milestone'
});

// Kiểm tra thành tích tự động
await checkAchievements();
```

## 🎯 Các tính năng chính

### ✅ Session Management
- Theo dõi session học tập real-time
- Tự động lưu thời gian học
- Quản lý multiple sessions

### ✅ Progress Tracking
- Tiến độ chi tiết cho từng slide
- Theo dõi exercises và quizzes
- Lưu trữ persistent

### ✅ Statistics & Analytics
- Thống kê thời gian học
- Điểm số trung bình
- Streak days tracking
- Daily goals progress

### ✅ Achievements System
- Hệ thống thành tích đa dạng
- Auto-detection achievements
- Milestone tracking

### ✅ Auto-save & Persistence
- Tự động lưu progress mỗi 30s
- Lưu vào Redux và localStorage
- Restore progress khi reload

### ✅ Multi-user Support
- Quản lý tiến độ nhiều user
- Isolated progress per user
- Easy user switching

## 🔧 Setup Instructions

### 1. Đảm bảo Redux store được cấu hình

```javascript
// src/redux/Store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['progress', 'auth'] // Lưu progress và auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);
```

### 2. Wrap App với Redux Provider

```javascript
// src/index.js
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/Store';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
```

### 3. Sử dụng trong components

```javascript
import { useProgress } from '../hooks/useProgress';

const MyLearningComponent = () => {
  const { 
    startSession, 
    updateSlideProgress, 
    getSlideProgress 
  } = useProgress();
  
  // Your component logic here
};
```

## 📊 Dashboard Integration

File `ProgressDashboard.js` đã được tích hợp đầy đủ để hiển thị:

- 📈 Thống kê tổng quan
- 🎯 Mục tiêu hằng ngày  
- 🏆 Thành tích đạt được
- ⏱️ Session hiện tại
- 📚 Recent activities
- 🚀 Quick actions

## 🧪 Testing và Debug

1. **Redux DevTools**: Sử dụng để debug state changes
2. **Console Logs**: Progress actions được log chi tiết
3. **Error Handling**: Comprehensive error catching
4. **Performance**: Optimized with useCallback và useMemo

## 🔄 Migration từ hệ thống cũ

Nếu có dữ liệu progress cũ trong localStorage:

```javascript
// Trong useProgress hook
const migrateOldProgress = () => {
  const oldProgress = localStorage.getItem('learningProgress');
  if (oldProgress) {
    // Convert và migrate sang format mới
    const converted = convertOldProgressFormat(JSON.parse(oldProgress));
    dispatch(initializeUserProgress(converted));
    localStorage.removeItem('learningProgress'); // Clean up
  }
};
```

## 🛠️ CÁCH SỬ DỤNG CẤU TRÚC MỚI

### 1. Lưu vị trí slide cuối cùng:
```javascript
import { setLastSlidePosition } from './redux/slices/progressV2';

// Lưu vị trí slide cuối cùng của bài học
dispatch(setLastSlidePosition({
  lessonId: 'lesson123',
  slideIndex: 5,
  slideId: 'slide_content_6'
}));
```

### 2. Lấy vị trí slide cuối cùng:
```javascript
import { selectLastSlidePosition } from './redux/slices/progressV2';

// Lấy vị trí slide cuối cùng của một bài học cụ thể
const lastPosition = useSelector(selectLastSlidePosition('lesson123'));
// Kết quả: { slideIndex: 5, slideId: 'slide_content_6', timestamp: 1672531200000 }

// Hoặc lấy tất cả positions
const allPositions = useSelector(selectLastSlidePositions);
// Kết quả: { lesson123: { slideIndex: 5, ... }, lesson456: { slideIndex: 2, ... } }
```

### 3. Lấy progress slides (không bao gồm positions):
```javascript
import { selectAllSlidesProgress } from './redux/slices/progressV2';

// Chỉ lấy data slides, không có _lastPositions
const slidesProgress = useSelector(selectAllSlidesProgress);
// Kết quả: { slideId1: { visited: true, completed: false }, slideId2: { ... } }
```

### 4. Lấy toàn bộ slides data (bao gồm positions):
```javascript
import { selectAllSlidesData } from './redux/slices/progressV2';

// Lấy toàn bộ, bao gồm cả _lastPositions
const allSlidesData = useSelector(selectAllSlidesData);
// Kết quả: { slideId1: {...}, slideId2: {...}, _lastPositions: {...} }
```

### 5. Xóa vị trí khi hoàn thành bài học:
```javascript
import { clearLastSlidePosition } from './redux/slices/progressV2';

// Xóa vị trí khi học sinh hoàn thành bài học
dispatch(clearLastSlidePosition({ lessonId: 'lesson123' }));
```

## 🔍 SELECTORS MỚI

### `selectLastSlidePositions(state)`
- Trả về tất cả last positions của tất cả bài học
- Kết quả: `{ lessonId: { slideIndex, slideId, timestamp }, ... }`

### `selectLastSlidePosition(lessonId)(state)`
- Trả về last position của một bài học cụ thể
- Kết quả: `{ slideIndex: number, slideId: string, timestamp: number }` hoặc `null`

### `selectAllSlidesProgress(state)`
- Trả về progress của tất cả slides (không có _lastPositions)
- Kết quả: `{ slideId: { visited, completed, score, ... }, ... }`

### `selectAllSlidesData(state)`
- Trả về toàn bộ slides data bao gồm _lastPositions
- Kết quả: `{ slideId: {...}, _lastPositions: {...} }`

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Key `_lastPositions` là reserved:
```javascript
// ❌ KHÔNG làm thế này
state.slides._lastPositions = { some: 'data' };

// ✅ Sử dụng actions
dispatch(setLastSlidePosition({ lessonId, slideIndex, slideId }));
```

### 2. Khi tính toán completed slides:
- Helper function `getCompletedSlidesCount()` tự động loại bỏ `_lastPositions`
- Không cần lo lắng về việc `_lastPositions` ảnh hưởng đến tính toán

### 3. Backup/Restore progress:
```javascript
// Backup toàn bộ progress
const progressBackup = {
  slides: store.getState().slide.slides,
  lessonProgress: store.getState().slide.lessonProgress,
  currentSlide: store.getState().slide.currentSlide
};

// Restore progress
dispatch(resetProgress());
// Sau đó restore từng phần...
```

## 🔧 DEBUG & TESTING GUIDE

### 1. Actions để xóa dữ liệu:

#### `clearAllSlidesData()`
Xóa hết thông tin slides để bắt đầu từ đầu
```javascript
import { clearAllSlidesData } from './redux/slices/progressV2';

// Xóa hết slides data, chỉ giữ lại cấu trúc _lastPositions
dispatch(clearAllSlidesData());
```

#### `clearLessonData({ lessonId })`
Xóa toàn bộ dữ liệu của một bài học cụ thể
```javascript
import { clearLessonData } from './redux/slices/progressV2';

// Xóa hết data của lesson cụ thể
dispatch(clearLessonData({ lessonId: 'lesson123' }));
```

#### `resetProgress()`
Reset toàn bộ về trạng thái ban đầu
```javascript
import { resetProgress } from './redux/slices/progressV2';

// Reset hoàn toàn
dispatch(resetProgress());
```

### 2. Sử dụng Debug Panel Component:

```javascript
import DebugProgressPanel from './components/DebugProgressPanel';

// Thêm vào component của bạn để debug
function App() {
  return (
    <div>
      {/* Component debug - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === 'development' && <DebugProgressPanel />}
      
      {/* App content */}
    </div>
  );
}
```

### 3. Debug trong Browser Console:

1. **Load debug script:**
```javascript
// Copy nội dung file debug-redux-progress.js vào console
// Hoặc thêm vào HTML: <script src="./debug-redux-progress.js"></script>
```

2. **Expose Redux store:**
```javascript
// Trong store setup
const store = configureStore({...});
window.store = store; // Expose để debug
```

3. **Sử dụng debug commands:**
```javascript
// Xóa hết để bắt đầu từ đầu
debugProgress.clearAll();

// Chạy test scenario đầy đủ
debugProgress.runFullTest();

// Xem state hiện tại
getCurrentState();
```

### 4. Kiểm tra state structure:

#### Trước khi có dữ liệu:
```javascript
{
  slides: {
    _lastPositions: {}
  },
  lessonProgress: {
    totalSlides: 0,
    completedSlides: 0,
    percentage: 0,
    // ...
  },
  currentSlide: {
    id: null,
    // ...
  }
}
```

#### Sau khi có dữ liệu test:
```javascript
{
  slides: {
    "slide-001": {
      visited: true,
      completed: true,
      score: 95,
      completedAt: 1672531200000
    },
    _lastPositions: {
      "lesson-123": {
        slideIndex: 2,
        slideId: "slide-003",
        timestamp: 1672531200000
      }
    }
  }
}
```

### 5. Common Debug Scenarios:

#### Scenario 1: Kiểm tra slides có lưu đúng không
```javascript
// Bước 1: Clear all
debugProgress.clearAll();

// Bước 2: Init lesson
debugProgress.initLesson('test-lesson', 5);

// Bước 3: Add some slides
debugProgress.setSlide('slide-001');
debugProgress.completeSlide('slide-001', 90);

// Bước 4: Check kết quả
debugProgress.viewSlidesData();
```

#### Scenario 2: Kiểm tra last positions
```javascript
// Set multiple positions
debugProgress.setLastPosition('lesson-1', 2);
debugProgress.setLastPosition('lesson-2', 4);

// View positions
const state = getCurrentState();
console.log('Last Positions:', state.slides._lastPositions);
```

#### Scenario 3: Kiểm tra progress calculation
```javascript
// Tạo lesson với 3 slides
debugProgress.initLesson('progress-test', 3);

// Complete 2/3 slides
debugProgress.completeSlide('slide-1', 80);
debugProgress.completeSlide('slide-2', 90);

// Check percentage (should be 67%)
const state = getCurrentState();
console.log('Progress:', state.lessonProgress.percentage); // Should be 67
```

### 6. Debug Checklist:

- [ ] Slides có lưu vào đúng structure không?
- [ ] `_lastPositions` có tách biệt khỏi slides data không?
- [ ] Progress calculation có đúng không?
- [ ] Clear functions có hoạt động không?
- [ ] State có consistent không?

---

## 🎮 VÍ DỤ THỰC TẾ

### Trong component SlideViewer:
```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectLastSlidePosition,
  setLastSlidePosition,
  clearLastSlidePosition 
} from '../redux/slices/progressV2';

const SlideViewer = ({ lessonId, slides }) => {
  const dispatch = useDispatch();
  const lastPosition = useSelector(selectLastSlidePosition(lessonId));
  
  // Khôi phục vị trí cuối cùng khi vào bài học
  useEffect(() => {
    if (lastPosition && lastPosition.slideIndex < slides.length) {
      // Chuyển đến slide cuối cùng
      setCurrentSlideIndex(lastPosition.slideIndex);
    }
  }, [lessonId, lastPosition]);
  
  // Lưu vị trí khi chuyển slide
  const handleSlideChange = (newIndex) => {
    dispatch(setLastSlidePosition({
      lessonId,
      slideIndex: newIndex,
      slideId: slides[newIndex]?.id
    }));
  };
  
  // Xóa vị trí khi hoàn thành bài học
  const handleLessonComplete = () => {
    dispatch(clearLastSlidePosition({ lessonId }));
  };
  
  return (
    <div>
      {/* Slide content */}
    </div>
  );
};
```

### Trong component LessonList:
```javascript
const LessonList = () => {
  const allPositions = useSelector(selectLastSlidePositions);
  
  return (
    <div>
      {lessons.map(lesson => (
        <LessonCard 
          key={lesson.id}
          lesson={lesson}
          lastPosition={allPositions[lesson.id]}
          showContinueButton={!!allPositions[lesson.id]}
        />
      ))}
    </div>
  );
};
```

## 🔧 MIGRATION GUIDE

Nếu bạn đang sử dụng version cũ:

1. **Cập nhật selectors:**
```javascript
// Thay đổi từ:
const lastPositions = useSelector(state => state.slide.lastSlidePositions);

// Thành:
const lastPositions = useSelector(selectLastSlidePositions);
```
