# REDUX PROGRESS SYSTEM - HƯỚNG DẪN SỬ DỤNG (CẤU TRÚC MỚI)

## 📋 Tổng quan

Hệ thống Redux Progress đã được **chuyển đổi hoàn toàn** từ cấu trúc lưu slides sang **chỉ lưu lessons theo lessonId**. Điều này giúp:

- ✅ Quản lý tiến trình theo bài học thay vì từng slide riêng lẻ
- ✅ Tối ưu hiệu suất và bộ nhớ
- ✅ Dễ dàng tracking và analytics
- ✅ Đồng bộ với backend API lessons

## 🎯 Cấu trúc State mới

```javascript
state.slide = {
  currentSlide: {
    id: string,
    title: string,
    content: object,
    type: string,
    startTime: timestamp,
    endTime: timestamp,
    isCompleted: boolean,
    score: number,
    attempts: number
  },
  
  lessonProgress: {
    totalSlides: number,
    completedSlides: number,
    percentage: number,
    startTime: timestamp,
    lastActiveTime: timestamp,
    lessonId: string,
    lessonTitle: string
  },
  
  lessons: {
    "683ab3a52651632e975a79c2": {
      lessonId: "683ab3a52651632e975a79c2",
      title: "Lesson Title",
      totalSlides: 10,
      completedSlides: 5,
      percentage: 50,
      lastSlideIndex: 4,
      lastSlideId: "slide-5",
      lastAccessTime: timestamp,
      startTime: timestamp,
      completedAt: timestamp, // khi hoàn thành
      isCompleted: boolean,
      score: number // điểm trung bình
    }
  }
}
```

## 🔧 API Actions

### Lesson Actions (CHÍNH)

```javascript
import { 
  initializeLesson, 
  markSlideCompleted, 
  updateLessonProgress,
  setLastSlidePosition,
  clearLessonData,
  clearAllLessonsData
} from '../redux/slices/progessV2';

// 1. Khởi tạo lesson
dispatch(initializeLesson({
  lessonId: "683ab3a52651632e975a79c2",
  lessonTitle: "Bài học toán",
  totalSlides: 10
}));

// 2. Đánh dấu slide completed
dispatch(markSlideCompleted({
  lessonId: "683ab3a52651632e975a79c2",
  slideIndex: 2,
  slideId: "slide-3",
  score: 85
}));

// 3. Cập nhật progress lesson
dispatch(updateLessonProgress({
  lessonId: "683ab3a52651632e975a79c2",
  completedSlides: 3,
  percentage: 30
}));

// 4. Lưu vị trí slide cuối
dispatch(setLastSlidePosition({
  lessonId: "683ab3a52651632e975a79c2",
  slideIndex: 2,
  slideId: "slide-3"
}));

// 5. Xóa data lesson
dispatch(clearLessonData({ 
  lessonId: "683ab3a52651632e975a79c2" 
}));
```

### Current Slide Actions

```javascript
import { 
  setCurrentSlide, 
  completeSlide, 
  updateSlideField 
} from '../redux/slices/progessV2';

// Set slide hiện tại
dispatch(setCurrentSlide({
  id: "slide-1",
  title: "Slide đầu tiên",
  content: { ... },
  type: "content"
}));

// Complete slide hiện tại
dispatch(completeSlide({ score: 90 }));
```

## 📊 Selectors

```javascript
import { 
  selectAllLessonsData,
  selectLessonData,
  selectLastSlidePosition,
  selectCurrentSlide 
} from '../redux/slices/progessV2';

// Lấy tất cả lessons
const allLessons = useSelector(selectAllLessonsData);

// Lấy data một lesson cụ thể  
const lessonData = useSelector(selectLessonData("683ab3a52651632e975a79c2"));

// Lấy vị trí slide cuối của lesson
const lastPosition = useSelector(selectLastSlidePosition("683ab3a52651632e975a79c2"));

// Lấy slide hiện tại
const currentSlide = useSelector(selectCurrentSlide);
```

## 🎮 Hook Usage

```javascript
import { useProgressV2 } from '../hooks/useProgressV2';

const MyComponent = () => {
  const {
    // State
    currentSlide,
    lessonProgress,
    allLessonsData,
    
    // Lesson actions (NEW)
    initLesson,
    isLessonCompleted,
    getLessonProgress,
    getLessonScore,
    
    // Slide actions (legacy)
    setSlide,
    markComplete,
    
    // Position tracking
    saveLastSlidePosition,
    getLastSlidePosition
  } = useProgressV2();
  
  // Khởi tạo lesson
  useEffect(() => {
    initLesson({
      lessonId: "683ab3a52651632e975a79c2",
      lessonTitle: "Bài học toán",
      totalSlides: 10
    });
  }, []);
  
  // Kiểm tra lesson completed
  const isCompleted = isLessonCompleted("683ab3a52651632e975a79c2");
  
  // Lấy progress lesson
  const lessonData = getLessonProgress("683ab3a52651632e975a79c2");
  
  // Lấy điểm lesson
  const score = getLessonScore("683ab3a52651632e975a79c2");
  
  return (
    <div>
      {lessonData && (
        <div>
          Progress: {lessonData.percentage}%
          Completed: {lessonData.isCompleted ? 'Yes' : 'No'}
          Score: {lessonData.score || 'N/A'}
        </div>
      )}
    </div>
  );
};
```

## 💡 Patterns thường dùng

### 1. Hiển thị progress lesson

```javascript
const getLessonProgressPercentage = (lessonId) => {
  if (!lessonId || !allLessonsData) return 0;
  
  const lessonData = allLessonsData[lessonId];
  if (!lessonData) return 0;
  
  return lessonData.percentage || 0;
};

const isLessonCompletedRedux = (lessonId) => {
  if (!lessonId || !allLessonsData) return false;
  
  const lessonData = allLessonsData[lessonId];
  return lessonData?.isCompleted || false;
};

const getLessonScore = (lessonId) => {
  if (!lessonId || !allLessonsData) return null;
  
  const lessonData = allLessonsData[lessonId];
  return lessonData?.score || null;
};
```

### 2. Tính thống kê tổng quan

```javascript
const getOverallStats = () => {
  if (!allLessonsData || Object.keys(allLessonsData).length === 0) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      inProgressLessons: 0,
      averageScore: 0
    };
  }
  
  // Filter out meta-lessons
  const actualLessons = Object.values(allLessonsData).filter(lesson => 
    lesson.lessonId && lesson.lessonId !== 'learning-hub'
  );
  
  const completedCount = actualLessons.filter(lesson => 
    lesson.isCompleted === true
  ).length;
  
  const inProgressCount = actualLessons.filter(lesson => 
    lesson.percentage > 0 && !lesson.isCompleted
  ).length;
  
  const lessonsWithScores = actualLessons.filter(lesson => 
    lesson.isCompleted && lesson.score != null
  );
  
  const averageScore = lessonsWithScores.length > 0
    ? Math.round(lessonsWithScores.reduce((sum, lesson) => 
        sum + lesson.score, 0) / lessonsWithScores.length)
    : 0;
  
  return {
    totalLessons: actualLessons.length,
    completedLessons: completedCount,
    inProgressLessons: inProgressCount,
    averageScore
  };
};
```

### 3. Resume lesson từ vị trí cuối

```javascript
const handleStartLearning = async (lessonId, lessonTitle) => {
  // Lấy vị trí cuối cùng
  const lessonData = allLessonsData[lessonId];
  const lastSlideIndex = lessonData?.lastSlideIndex;
  
  // Navigate với position nếu có
  let navigationUrl = `/slide/${lessonId}`;
  if (lastSlideIndex !== undefined && lastSlideIndex > 0) {
    navigationUrl += `?slideIndex=${lastSlideIndex}`;
  }
  
  navigate(navigationUrl);
};
```

## 🐛 Debug & Testing

### Console Script

```javascript
// Copy script từ file debug-redux-progress-new.js
// Hoặc dùng commands:

// Kiểm tra state
debugLessons.state();

// Test lesson
debugLessons.init();
debugLessons.progress();
debugLessons.complete();

// Phân tích data
debugLessons.analyze();

// Quick test
debugLessons.quickTest();
```

### Component Debug

```javascript
// Thêm vào component để debug
useEffect(() => {
  console.log('All lessons data:', allLessonsData);
  console.log('Current lesson progress:', lessonProgress);
}, [allLessonsData, lessonProgress]);
```

## ⚠️ Migration Notes

### BREAKING CHANGES từ cấu trúc cũ:

1. **Không còn `state.slide.slides`** - thay bằng `state.slide.lessons`
2. **Không còn tracking từng slide** - chỉ track lesson level
3. **API functions đổi tên:**
   - `getSlideProgress(slideId)` → `getLessonProgress(lessonId)`
   - `isSlideCompleted(slideId)` → `isLessonCompleted(lessonId)`
   - `getSlideScore(slideId)` → `getLessonScore(lessonId)`

### Cách migrate:

```javascript
// CŨ ❌
const progress = getSlideProgress(slideId);
const isCompleted = isSlideCompleted(slideId);
const score = getSlideScore(slideId);

// MỚI ✅
const lessonData = allLessonsData[lessonId];
const progress = lessonData?.percentage || 0;
const isCompleted = lessonData?.isCompleted || false;
const score = lessonData?.score || null;
```

## 🔗 Files liên quan

- `/src/redux/slices/progessV2.js` - Redux slice chính
- `/src/hooks/useProgressV2.js` - Hook wrapper
- `/src/pages/learning/LearningHub.js` - Usage example
- `/debug-redux-progress-new.js` - Debug script
- `/src/components/DebugProgressPanel.jsx` - Debug UI

## 📞 Hỗ trợ

Nếu có vấn đề:
1. Kiểm tra console errors
2. Dùng debug script để test state
3. Kiểm tra lesson data structure
4. Đảm bảo lessonId đúng format
