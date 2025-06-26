// ====================================
// SCRIPT DEBUG REDUX PROGRESS V2 - NEW LESSON STRUCTURE
// ====================================
// Sử dụng trong browser console để test và debug Redux progress
// Cấu trúc mới: chỉ lưu lessons theo lessonId, không lưu từng slide

console.log("🔧 Redux Progress Debug Script - New Lesson Structure Loaded");

// Test với lesson ID thực tế
const TEST_LESSON_ID = "683ab3a52651632e975a79c2";
const TEST_LESSON_TITLE = "Bài học số học lớp 3";

// === HELPER FUNCTIONS ===
function getReduxState() {
    if (typeof window.store !== 'undefined') {
        return window.store.getState();
    }

    // Fallback: try to get from React DevTools
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
        const reactInstance = Array.from(document.querySelectorAll('*'))
            .map(el => el._reactInternalInstance || el.__reactInternalInstance)
            .find(instance => instance);

        if (reactInstance) {
            // Try to find Redux store
            let current = reactInstance;
            while (current) {
                if (current.memoizedProps && current.memoizedProps.store) {
                    return current.memoizedProps.store.getState();
                }
                current = current.child;
            }
        }
    }

    console.error("❌ Không thể tìm thấy Redux store");
    return null;
}

function dispatchAction(action) {
    if (typeof window.store !== 'undefined') {
        window.store.dispatch(action);
        console.log("✅ Action dispatched:", action);
        return true;
    }
    console.error("❌ Không thể dispatch action - store không tồn tại");
    return false;
}

// === LESSON DEBUGGING FUNCTIONS ===
function debugLessonsState() {
    const state = getReduxState();
    if (!state) return;

    console.log("📊 === LESSONS STATE DEBUG ===");
    console.log("Current lessons:", state.slide?.lessons || {});
    console.log("Current slide:", state.slide?.currentSlide || {});
    console.log("Lesson progress:", state.slide?.lessonProgress || {});

    // Check if our test lesson exists
    const testLesson = state.slide?.lessons?.[TEST_LESSON_ID];
    if (testLesson) {
        console.log(`🎯 Test lesson (${TEST_LESSON_ID}):`, testLesson);
    } else {
        console.log(`⚠️ Test lesson (${TEST_LESSON_ID}) not found`);
    }
}

function initTestLesson() {
    console.log("🚀 Initializing test lesson...");

    const action = {
        type: 'slide/initializeLesson',
        payload: {
            lessonId: TEST_LESSON_ID,
            lessonTitle: TEST_LESSON_TITLE,
            totalSlides: 10
        }
    };

    if (dispatchAction(action)) {
        setTimeout(() => {
            console.log("📊 State after initialization:");
            debugLessonsState();
        }, 100);
    }
}

function simulateLessonProgress() {
    console.log("📈 Simulating lesson progress...");

    // Simulate completing 3 slides
    for (let i = 1; i <= 3; i++) {
        const action = {
            type: 'slide/markSlideCompleted',
            payload: {
                lessonId: TEST_LESSON_ID,
                slideIndex: i - 1,
                slideId: `slide-${i}`,
                score: 80 + Math.random() * 20 // Random score between 80-100
            }
        };
        dispatchAction(action);
    }

    // Set last slide position
    const positionAction = {
        type: 'slide/setLastSlidePosition',
        payload: {
            lessonId: TEST_LESSON_ID,
            slideIndex: 2,
            slideId: 'slide-3'
        }
    };
    dispatchAction(positionAction);

    setTimeout(() => {
        console.log("📊 State after progress simulation:");
        debugLessonsState();
    }, 100);
}

function testLessonCompletion() {
    console.log("🏁 Testing lesson completion...");

    // Complete remaining slides to finish the lesson
    for (let i = 4; i <= 10; i++) {
        const action = {
            type: 'slide/markSlideCompleted',
            payload: {
                lessonId: TEST_LESSON_ID,
                slideIndex: i - 1,
                slideId: `slide-${i}`,
                score: 85 + Math.random() * 15 // Random score between 85-100
            }
        };
        dispatchAction(action);
    }

    setTimeout(() => {
        console.log("📊 State after lesson completion:");
        debugLessonsState();

        const state = getReduxState();
        const lesson = state?.slide?.lessons?.[TEST_LESSON_ID];
        if (lesson && lesson.isCompleted) {
            console.log("🎉 Lesson completed successfully!");
            console.log(`📊 Final percentage: ${lesson.percentage}%`);
            console.log(`🏆 Final score: ${lesson.score}%`);
        }
    }, 100);
}

function clearTestData() {
    console.log("🧹 Clearing test lesson data...");

    const action = {
        type: 'slide/clearLessonData',
        payload: {
            lessonId: TEST_LESSON_ID
        }
    };

    if (dispatchAction(action)) {
        setTimeout(() => {
            console.log("📊 State after clearing:");
            debugLessonsState();
        }, 100);
    }
}

function clearAllLessons() {
    console.log("🧹 Clearing all lessons data...");

    const action = {
        type: 'slide/clearAllLessonsData',
        payload: {}
    };

    if (dispatchAction(action)) {
        setTimeout(() => {
            console.log("📊 State after clearing all:");
            debugLessonsState();
        }, 100);
    }
}

// === LESSON DATA ANALYSIS ===
function analyzeLessonData() {
    const state = getReduxState();
    if (!state) return;

    const lessons = state.slide?.lessons || {};
    const lessonIds = Object.keys(lessons);

    console.log("📈 === LESSON DATA ANALYSIS ===");
    console.log(`Total lessons: ${lessonIds.length}`);

    if (lessonIds.length === 0) {
        console.log("⚠️ No lesson data found");
        return;
    }

    lessonIds.forEach(lessonId => {
        const lesson = lessons[lessonId];
        console.log(`\n📚 Lesson: ${lessonId}`);
        console.log(`  Title: ${lesson.title || 'N/A'}`);
        console.log(`  Progress: ${lesson.percentage || 0}%`);
        console.log(`  Completed slides: ${lesson.completedSlides || 0}/${lesson.totalSlides || 0}`);
        console.log(`  Is completed: ${lesson.isCompleted ? 'Yes' : 'No'}`);
        console.log(`  Score: ${lesson.score || 'N/A'}`);
        console.log(`  Last slide: ${lesson.lastSlideIndex} (${lesson.lastSlideId})`);
        console.log(`  Started: ${lesson.startTime ? new Date(lesson.startTime).toLocaleString() : 'N/A'}`);
        console.log(`  Last access: ${lesson.lastAccessTime ? new Date(lesson.lastAccessTime).toLocaleString() : 'N/A'}`);
        if (lesson.completedAt) {
            console.log(`  Completed at: ${new Date(lesson.completedAt).toLocaleString()}`);
        }
    });
}

// === EXPORT FUNCTIONS TO WINDOW ===
window.debugLessons = {
    // State inspection
    state: debugLessonsState,
    analyze: analyzeLessonData,

    // Test actions
    init: initTestLesson,
    progress: simulateLessonProgress,
    complete: testLessonCompletion,

    // Cleanup
    clear: clearTestData,
    clearAll: clearAllLessons,

    // Quick test sequence
    quickTest: () => {
        console.log("🚀 Running quick test sequence...");
        debugLessonsState();
        setTimeout(() => initTestLesson(), 500);
        setTimeout(() => simulateLessonProgress(), 1000);
        setTimeout(() => analyzeLessonData(), 1500);
    },

    // Full test sequence
    fullTest: () => {
        console.log("🚀 Running full test sequence...");
        clearAllLessons();
        setTimeout(() => initTestLesson(), 500);
        setTimeout(() => simulateLessonProgress(), 1000);
        setTimeout(() => testLessonCompletion(), 2000);
        setTimeout(() => analyzeLessonData(), 2500);
    },

    // Helper
    getState: getReduxState
};

console.log("✅ Debug functions available at window.debugLessons");
console.log("📖 Usage:");
console.log("  - debugLessons.state() - Check current state");
console.log("  - debugLessons.init() - Initialize test lesson");
console.log("  - debugLessons.progress() - Simulate progress");
console.log("  - debugLessons.complete() - Complete lesson");
console.log("  - debugLessons.analyze() - Analyze all lessons");
console.log("  - debugLessons.quickTest() - Run quick test");
console.log("  - debugLessons.fullTest() - Run full test");
console.log("  - debugLessons.clear() - Clear test data");
console.log("  - debugLessons.clearAll() - Clear all lessons");
