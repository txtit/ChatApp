// DEBUG SCRIPT CHO REDUX PROGRESS V2
// Copy và paste script này vào browser console để test

console.log('🚀 Starting Redux Progress V2 Debug Session...');

// Helper function để dispatch actions
const testDispatch = (action) => {
    if (window.store) {
        window.store.dispatch(action);
        console.log('✅ Action dispatched:', action.type);
    } else {
        console.error('❌ Redux store not found on window.store');
    }
};

// Helper function để xem state hiện tại
const getCurrentState = () => {
    if (window.store) {
        const state = window.store.getState();
        console.log('📊 Current Progress State:', state.slide);
        return state.slide;
    } else {
        console.error('❌ Redux store not found on window.store');
    }
};

// Test Actions - Import từ store
const testActions = {
    // 1. Xóa hết dữ liệu để bắt đầu fresh
    clearAll: () => {
        console.log('🧹 Clearing all slides data...');
        testDispatch({ type: 'slide/clearAllSlidesData' });
        getCurrentState();
    },

    // 2. Reset toàn bộ progress
    resetAll: () => {
        console.log('🔄 Resetting all progress...');
        testDispatch({ type: 'slide/resetProgress' });
        getCurrentState();
    },

    // 3. Khởi tạo lesson mới
    initLesson: (lessonId = 'debug-lesson-001', totalSlides = 5) => {
        console.log(`🎯 Initializing lesson ${lessonId}...`);
        testDispatch({
            type: 'slide/initializeLesson',
            payload: {
                totalSlides,
                lessonId,
                lessonTitle: `Debug Lesson ${lessonId}`
            }
        });
        getCurrentState();
    },

    // 4. Set slide hiện tại
    setSlide: (slideId = 'debug-slide-001') => {
        console.log(`📄 Setting current slide ${slideId}...`);
        testDispatch({
            type: 'slide/setCurrentSlide',
            payload: {
                id: slideId,
                title: `Debug Slide ${slideId}`,
                content: 'This is a debug slide for testing',
                type: 'content'
            }
        });
        getCurrentState();
    },

    // 5. Đánh dấu slide completed
    completeSlide: (slideId = 'debug-slide-001', score = 95) => {
        console.log(`✅ Marking slide ${slideId} as completed...`);
        testDispatch({
            type: 'slide/markSlideCompleted',
            payload: { slideId, score }
        });
        getCurrentState();
    },

    // 6. Set last position
    setLastPosition: (lessonId = 'debug-lesson-001', slideIndex = 2) => {
        console.log(`💾 Setting last position for ${lessonId} at index ${slideIndex}...`);
        testDispatch({
            type: 'slide/setLastSlidePosition',
            payload: {
                lessonId,
                slideIndex,
                slideId: `debug-slide-00${slideIndex + 1}`
            }
        });
        getCurrentState();
    },

    // 7. Xem toàn bộ slides data
    viewSlidesData: () => {
        const state = getCurrentState();
        if (state) {
            console.log('📂 All Slides Data:', state.slides);
            console.log('📂 Last Positions:', state.slides?._lastPositions);
        }
    },

    // 8. Test scenario hoàn chỉnh
    runFullTest: () => {
        console.log('🧪 Running full test scenario...');

        // Step 1: Clear all
        testActions.clearAll();

        setTimeout(() => {
            // Step 2: Init lesson
            testActions.initLesson('test-lesson-123', 3);

            setTimeout(() => {
                // Step 3: Set slides
                testActions.setSlide('slide-001');
                testActions.completeSlide('slide-001', 85);

                setTimeout(() => {
                    testActions.setSlide('slide-002');
                    testActions.setLastPosition('test-lesson-123', 1);

                    setTimeout(() => {
                        // Step 4: View final result
                        console.log('🏁 Final test results:');
                        testActions.viewSlidesData();
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }
};

// Expose functions globally for easy access
window.debugProgress = testActions;

console.log('✨ Debug functions ready! Available commands:');
console.log('- debugProgress.clearAll() // Xóa hết slides data');
console.log('- debugProgress.resetAll() // Reset toàn bộ progress');
console.log('- debugProgress.initLesson() // Khởi tạo lesson test');
console.log('- debugProgress.setSlide() // Set slide hiện tại');
console.log('- debugProgress.completeSlide() // Đánh dấu slide hoàn thành');
console.log('- debugProgress.setLastPosition() // Set vị trí cuối');
console.log('- debugProgress.viewSlidesData() // Xem dữ liệu slides');
console.log('- debugProgress.runFullTest() // Chạy test scenario đầy đủ');
console.log('- getCurrentState() // Xem state hiện tại');

// Check if store is available
if (window.store) {
    console.log('✅ Redux store detected and ready!');
    getCurrentState();
} else {
    console.warn('⚠️ Redux store not found. Make sure to expose store on window.store');
    console.log('Add this to your store setup: window.store = store;');
}
