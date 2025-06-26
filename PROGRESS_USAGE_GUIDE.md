# Progress Management System - Hướng dẫn sử dụng

## Tổng quan
Hệ thống quản lý tiến độ học tập được xây dựng với Redux Toolkit, bao gồm:
- Lưu trữ tiến độ chi tiết trong Redux
- Tự động đồng bộ với database
- Auto-save định kỳ
- Tracking thời gian học tập

## Cấu trúc Files

### 1. Redux Slice (`src/redux/slices/progress.js`)
- **State**: lưu trữ toàn bộ thông tin progress
- **Actions**: các action để cập nhật state
- **Async Thunks**: gọi API để lưu/load từ DB

### 2. Helper Functions (`src/utils/progressHelpers.js`)
- `saveProgressToReduxAndDB()`: Lưu vào Redux và DB
- `markSlideCompleted()`: Đánh dấu slide hoàn thành
- `markExerciseCompleted()`: Đánh dấu exercise hoàn thành
- `markQuizCompleted()`: Đánh dấu quiz hoàn thành
- `updateStudyTime()`: Cập nhật thời gian học
- `setupAutoSave()`: Thiết lập auto-save

### 3. Custom Hook (`src/hooks/useProgress.js`)
- Hook tùy chỉnh để dễ dàng sử dụng progress functionality
- Tự động khởi tạo và cleanup
- Cung cấp các callback functions tiện lợi

### 4. Mock API (`src/utils/mockProgressAPI.js`)
- Simulation database cho development
- API endpoints cho save/load progress

## Cách sử dụng

### Phương pháp 1: Sử dụng Custom Hook (Khuyến nghị)

```jsx
import useProgress from '../hooks/useProgress';

const MyLearningComponent = () => {
    const {
        progressState,
        metrics,
        saveProgress,
        completeSlide,
        completeExercise,
        completeQuiz,
        isLoading,
        isSaving
    } = useProgress('user_123', 'slide_001', {
        autoSave: true,
        autoSaveInterval: 30000,
        trackTime: true
    });

    const handleSlideComplete = async () => {
        const result = await completeSlide('slide_001');
        if (result.success) {
            console.log('Slide completed!');
        }
    };

    return (
        <div>
            <p>Progress: {metrics.overallProgress}%</p>
            <button onClick={handleSlideComplete}>Complete Slide</button>
        </div>
    );
};
```

### Phương pháp 2: Sử dụng trực tiếp Redux

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { saveProgressToReduxAndDB } from '../utils/progressHelpers';

const MyComponent = () => {
    const dispatch = useDispatch();
    const progressState = useSelector(state => state.progress);

    const handleSave = async () => {
        const progressData = {
            slideId: 'slide_001',
            userId: 'user_123',
            overallProgress: 75,
            currentSlideIndex: 5,
            completedSlides: ['slide_001', 'slide_002'],
            completedExercises: ['ex_001'],
            completedQuizzes: ['quiz_001'],
            timeSpent: 1200,
            reduxState: progressState
        };

        const result = await saveProgressToReduxAndDB(dispatch, progressData);
        console.log(result);
    };

    return <button onClick={handleSave}>Save Progress</button>;
};
```

## Data Structure

### Progress State Structure
```javascript
{
    slideId: "slide_001",
    userId: "user_123",
    overallProgress: 75,              // Phần trăm hoàn thành tổng thể
    currentSlideIndex: 5,             // Slide hiện tại
    completedSlides: ["slide_001"],   // Danh sách slide đã hoàn thành
    completedExercises: ["ex_001"],   // Danh sách exercise đã hoàn thành
    completedQuizzes: ["quiz_001"],   // Danh sách quiz đã hoàn thành
    timeSpent: 1200,                  // Thời gian học (giây)
    isLoading: false,
    isSaving: false,
    error: null,
    reduxState: {...}                 // Snapshot của toàn bộ Redux state
}
```

## API Endpoints (Cần implement trong backend)

### 1. Save Progress
```
POST /api/progress/save
Body: {
    slideId, userId, overallProgress, currentSlideIndex,
    completedSlides, completedExercises, completedQuizzes,
    timeSpent, reduxState, timestamp
}
```

### 2. Load Progress
```
GET /api/progress/load/:userId/:slideId
Response: { success, data, message }
```

### 3. Get User Progress
```
GET /api/progress/user/:userId
Response: { success, data: [...], message }
```

## Best Practices

### 1. Auto-save Configuration
```javascript
const { progressState } = useProgress(userId, slideId, {
    autoSave: true,           // Enable auto-save
    autoSaveInterval: 30000,  // Save every 30 seconds
    trackTime: true           // Track study time automatically
});
```

### 2. Error Handling
```javascript
const { error, clearProgressError } = useProgress(userId, slideId);

useEffect(() => {
    if (error) {
        console.error('Progress error:', error);
        // Show user notification
        // Auto-clear error after showing
        setTimeout(clearProgressError, 5000);
    }
}, [error, clearProgressError]);
```

### 3. Manual Save with Feedback
```javascript
const { saveProgress, isSaving } = useProgress(userId, slideId);

const handleManualSave = async () => {
    const result = await saveProgress();
    if (result.success) {
        showSuccessMessage('Progress saved!');
    } else {
        showErrorMessage('Failed to save: ' + result.error);
    }
};
```

### 4. Completion Tracking
```javascript
const { completeSlide, completeExercise, completeQuiz } = useProgress(userId, slideId);

// Khi user hoàn thành một slide
const onSlideComplete = async (slideId) => {
    await completeSlide(slideId);
    // Progress sẽ tự động được cập nhật và lưu
};
```

## Testing
Sử dụng component `ProgressDemo` để test các functionality:
- Import và sử dụng trong routing
- Test auto-save, manual save
- Test completion tracking
- Test error handling

## Migration từ hệ thống cũ
Nếu có dữ liệu progress cũ, tạo migration script:
```javascript
const migrateOldProgress = async (oldProgressData) => {
    const newFormat = {
        slideId: oldProgressData.courseId,
        userId: oldProgressData.userId,
        overallProgress: oldProgressData.percent,
        // ... map other fields
    };
    
    await saveProgressToReduxAndDB(dispatch, newFormat);
};
```
