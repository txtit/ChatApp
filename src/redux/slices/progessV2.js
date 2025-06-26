import { createSlice } from '@reduxjs/toolkit';

// Định nghĩa state ban đầu
const initialState = {
    // Thông tin về slide hiện tại
    currentSlide: {
        id: null,
        title: null,
        content: null,
        type: null, // 'content', 'quiz', 'exercise'
        startTime: null,
        endTime: null,
        isCompleted: false,
        score: 0,
        attempts: 0,
    },

    // Thông tin tiến trình của toàn bộ bài học
    lessonProgress: {
        totalSlides: 0,         // Tổng số slide
        completedSlides: 0,     // Số slide đã hoàn thành
        percentage: 0,          // Phần trăm hoàn thành
        startTime: null,        // Thời gian bắt đầu bài học
        lastActiveTime: null,   // Thời gian hoạt động gần nhất
        lessonId: null,         // ID của bài học
        lessonTitle: null       // Tiêu đề bài học
    },    // Lưu trữ tiến trình của từng bài học và vị trí cuối cùng
    lessons: {
        // Format: { 
        //   "683ab3a52651632e975a79c2": {
        //     lessonId: "683ab3a52651632e975a79c2",
        //     title: "Lesson Title",
        //     totalSlides: 10,
        //     completedSlides: 5,
        //     percentage: 50,
        //     lastSlideIndex: 4,
        //     lastSlideId: "slide-5",
        //     lastAccessTime: timestamp,
        //     startTime: timestamp,
        //     completedAt: timestamp (if completed),
        //     isCompleted: false
        //   }
        // }
    }
};

// Helper function để đảm bảo state được khởi tạo đúng
const ensureStateInitialized = (state) => {
    if (!state.lessons) {
        state.lessons = {};
    }
    if (!state.lessonProgress) {
        state.lessonProgress = {
            totalSlides: 0,
            completedSlides: 0,
            percentage: 0,
            startTime: null,
            lastActiveTime: null,
            lessonId: null,
            lessonTitle: null
        };
    }
    if (!state.currentSlide) {
        state.currentSlide = {
            id: null,
            title: null,
            content: null,
            type: null,
            startTime: null,
            endTime: null,
            isCompleted: false,
            score: 0,
            attempts: 0,
        };
    }
};

// Helper function để đảm bảo lesson data được khởi tạo
const ensureLessonExists = (state, lessonId) => {
    if (!state.lessons[lessonId]) {
        console.log('📚 Creating new lesson entry for:', lessonId);
        state.lessons[lessonId] = {
            lessonId,
            title: null,
            totalSlides: 0,
            completedSlides: 0,
            percentage: 0,
            lastSlideIndex: 0,
            lastSlideId: null,
            lastAccessTime: Date.now(),
            startTime: Date.now(),
            completedAt: null,
            isCompleted: false
        };
        console.log('📚 New lesson created:', state.lessons[lessonId]);
    } else {
        console.log('📚 Lesson already exists:', lessonId, state.lessons[lessonId]);
    }
};

// Tạo progressV2 slice
const progressV2 = createSlice({
    name: 'slide',
    initialState,
    reducers: {
        // === CURRENT SLIDE ACTIONS ===        // Cập nhật toàn bộ slide hiện tại
        setCurrentSlide: (state, action) => {
            ensureStateInitialized(state);

            // Reset các trường tracking
            state.currentSlide = {
                ...action.payload,
                startTime: Date.now(),
                endTime: null,
                isCompleted: false,
                score: 0,
                attempts: 0,
            };

            // Cập nhật thời gian hoạt động gần nhất
            state.lessonProgress.lastActiveTime = Date.now();

            // Nếu có lessonId trong payload, cập nhật lesson data
            if (action.payload.lessonId) {
                ensureLessonExists(state, action.payload.lessonId);
                state.lessons[action.payload.lessonId].lastAccessTime = Date.now();
            }

            console.log('Current slide set:', state.currentSlide);
        },// Cập nhật một trường cụ thể
        updateSlideField: (state, action) => {
            ensureStateInitialized(state);

            const { field, value } = action.payload;

            if (field && state.currentSlide) {
                state.currentSlide[field] = value;
                state.lessonProgress.lastActiveTime = Date.now();
                console.log(`Updated ${field}:`, value);
            }
        },        // Đánh dấu slide hiện tại đã hoàn thành
        completeSlide: (state, action) => {
            if (state.currentSlide) {
                // Cập nhật thông tin slide hiện tại
                state.currentSlide.isCompleted = true;
                state.currentSlide.endTime = Date.now();

                if (action.payload?.score !== undefined) {
                    state.currentSlide.score = action.payload.score;
                }

                // Cập nhật lesson progress nếu có lessonId
                const lessonId = state.lessonProgress.lessonId;
                if (lessonId) {
                    ensureLessonExists(state, lessonId);

                    // Tăng số slide đã hoàn thành
                    state.lessons[lessonId].completedSlides += 1;
                    state.lessonProgress.completedSlides = state.lessons[lessonId].completedSlides;

                    // Tính toán lại phần trăm hoàn thành
                    if (state.lessons[lessonId].totalSlides > 0) {
                        const percentage = Math.round(
                            (state.lessons[lessonId].completedSlides / state.lessons[lessonId].totalSlides) * 100
                        );
                        state.lessons[lessonId].percentage = percentage;
                        state.lessonProgress.percentage = percentage;

                        // Kiểm tra xem lesson đã hoàn thành chưa
                        if (percentage >= 100) {
                            state.lessons[lessonId].isCompleted = true;
                            state.lessons[lessonId].completedAt = Date.now();
                        }
                    }

                    state.lessons[lessonId].lastAccessTime = Date.now();
                }

                state.lessonProgress.lastActiveTime = Date.now();
                console.log('Slide completed:', state.currentSlide);
                console.log('Updated progress:', state.lessonProgress);
            }
        },        // Tăng số lần thử
        incrementAttempts: (state) => {
            if (state.currentSlide) {
                state.currentSlide.attempts += 1;
                state.lessonProgress.lastActiveTime = Date.now();
                console.log('Attempts:', state.currentSlide.attempts);
            }
        },

        // === LESSON PROGRESS ACTIONS ===        // Khởi tạo thông tin bài học
        initializeLesson: (state, action) => {
            const { totalSlides, lessonId, lessonTitle } = action.payload;

            console.log('🚀 initializeLesson called:', { totalSlides, lessonId, lessonTitle });

            ensureStateInitialized(state);
            ensureLessonExists(state, lessonId);

            console.log('📊 Lesson data before init:', state.lessons[lessonId]);

            // Cập nhật thông tin lesson progress
            state.lessonProgress = {
                ...state.lessonProgress,
                totalSlides,
                lessonId,
                lessonTitle,
                startTime: Date.now(),
                lastActiveTime: Date.now(),
                completedSlides: state.lessons[lessonId].completedSlides || 0
            };

            // Cập nhật lesson data
            state.lessons[lessonId] = {
                ...state.lessons[lessonId],
                lessonId,
                title: lessonTitle,
                totalSlides,
                startTime: state.lessons[lessonId].startTime || Date.now(),
                lastAccessTime: Date.now()
            };

            // Tính toán phần trăm
            if (totalSlides > 0) {
                const percentage = Math.round(
                    (state.lessons[lessonId].completedSlides / totalSlides) * 100
                );
                state.lessons[lessonId].percentage = percentage;
                state.lessonProgress.percentage = percentage;
            }

            console.log('📊 Lesson data after init:', state.lessons[lessonId]);
            console.log('📊 Lesson progress after init:', state.lessonProgress);
        },// Cập nhật tổng số slide
        updateTotalSlides: (state, action) => {
            const { totalSlides } = action.payload;
            state.lessonProgress.totalSlides = totalSlides;

            // Cập nhật lesson data nếu có lessonId
            const lessonId = state.lessonProgress.lessonId;
            if (lessonId) {
                ensureLessonExists(state, lessonId);
                state.lessons[lessonId].totalSlides = totalSlides;

                // Tính toán lại phần trăm
                if (totalSlides > 0) {
                    const percentage = Math.round(
                        (state.lessons[lessonId].completedSlides / totalSlides) * 100
                    );
                    state.lessons[lessonId].percentage = percentage;
                    state.lessonProgress.percentage = percentage;
                }
            }

            state.lessonProgress.lastActiveTime = Date.now();
            console.log('Total slides updated:', totalSlides);
        },

        // Cập nhật tiến trình chung
        updateOverallProgress: (state, action) => {
            const { completed, total } = action.payload;

            if (completed !== undefined) {
                state.lessonProgress.completedSlides = completed;
            }

            if (total !== undefined) {
                state.lessonProgress.totalSlides = total;
            }

            // Tính toán phần trăm
            if (state.lessonProgress.totalSlides > 0) {
                state.lessonProgress.percentage = Math.round(
                    (state.lessonProgress.completedSlides / state.lessonProgress.totalSlides) * 100
                );
            }

            state.lessonProgress.lastActiveTime = Date.now();
            console.log('Overall progress updated:', state.lessonProgress);
        },        // Đánh dấu một slide cụ thể đã hoàn thành (không phải slide hiện tại)
        markSlideCompleted: (state, action) => {
            const { lessonId, slideId, score } = action.payload;

            if (lessonId) {
                ensureLessonExists(state, lessonId);

                // Tăng số slide đã hoàn thành (nếu chưa tăng)
                state.lessons[lessonId].completedSlides += 1;

                // Tính toán lại phần trăm hoàn thành
                if (state.lessons[lessonId].totalSlides > 0) {
                    const percentage = Math.round(
                        (state.lessons[lessonId].completedSlides / state.lessons[lessonId].totalSlides) * 100
                    );
                    state.lessons[lessonId].percentage = percentage;

                    // Kiểm tra xem lesson đã hoàn thành chưa
                    if (percentage >= 100) {
                        state.lessons[lessonId].isCompleted = true;
                        state.lessons[lessonId].completedAt = Date.now();
                    }
                }

                state.lessons[lessonId].lastAccessTime = Date.now();
                state.lessonProgress.lastActiveTime = Date.now();

                // Cập nhật lesson progress nếu đang học lesson này
                if (state.lessonProgress.lessonId === lessonId) {
                    state.lessonProgress.completedSlides = state.lessons[lessonId].completedSlides;
                    state.lessonProgress.percentage = state.lessons[lessonId].percentage;
                }

                console.log(`Marked slide completed for lesson ${lessonId}`);
                console.log('Updated progress:', state.lessonProgress);
            }
        },        // Cập nhật tiến trình của một lesson cụ thể
        updateLessonProgress: (state, action) => {
            const { lessonId, ...progressData } = action.payload;

            if (lessonId) {
                ensureLessonExists(state, lessonId);

                // Cập nhật lesson data
                state.lessons[lessonId] = {
                    ...state.lessons[lessonId],
                    ...progressData,
                    lastAccessTime: Date.now()
                };

                // Nếu đang học lesson này, cập nhật lesson progress
                if (state.lessonProgress.lessonId === lessonId) {
                    if (progressData.completedSlides !== undefined) {
                        state.lessonProgress.completedSlides = progressData.completedSlides;
                    }
                    if (progressData.percentage !== undefined) {
                        state.lessonProgress.percentage = progressData.percentage;
                    }
                    if (progressData.totalSlides !== undefined) {
                        state.lessonProgress.totalSlides = progressData.totalSlides;
                    }
                }

                state.lessonProgress.lastActiveTime = Date.now();
                console.log(`Updated progress for lesson ${lessonId}:`, progressData);
            }
        },        // === LAST SLIDE POSITION ACTIONS ===        // Lưu vị trí slide cuối cùng cho bài học
        setLastSlidePosition: (state, action) => {
            ensureStateInitialized(state);
            const { lessonId, slideIndex, slideId } = action.payload;

            console.log('💾 setLastSlidePosition called:', { lessonId, slideIndex, slideId });

            if (lessonId && slideIndex !== undefined) {
                ensureLessonExists(state, lessonId);

                console.log('📊 Lesson data before saving position:', state.lessons[lessonId]);

                // Cập nhật vị trí cuối cùng trong lesson data
                state.lessons[lessonId].lastSlideIndex = slideIndex;
                state.lessons[lessonId].lastSlideId = slideId || null;
                state.lessons[lessonId].lastAccessTime = Date.now();

                // Tính toán lại progress dựa trên vị trí slide hiện tại
                if (state.lessons[lessonId].totalSlides > 0) {
                    // Progress = (current slide index + 1) / total slides * 100
                    // Vì slideIndex bắt đầu từ 0, nên +1 để có số slide thực tế
                    const currentSlideNumber = slideIndex + 1;
                    const percentage = Math.round((currentSlideNumber / state.lessons[lessonId].totalSlides) * 100);
                    
                    // Đảm bảo percentage không vượt quá 100%
                    state.lessons[lessonId].percentage = Math.min(percentage, 100);
                    
                    // Cập nhật lesson progress nếu đang học lesson này
                    if (state.lessonProgress.lessonId === lessonId) {
                        state.lessonProgress.percentage = state.lessons[lessonId].percentage;
                    }
                    
                    console.log(`📊 Progress updated for lesson ${lessonId}: ${state.lessons[lessonId].percentage}% (slide ${currentSlideNumber}/${state.lessons[lessonId].totalSlides})`);
                } else {
                    console.warn('⚠️ Cannot calculate progress - totalSlides is 0 for lesson:', lessonId);
                }

                console.log('📊 Lesson data after saving position:', state.lessons[lessonId]);
                console.log(`Saved last slide position for lesson ${lessonId}: index ${slideIndex}`);
            } else {
                console.warn('⚠️ Invalid params for setLastSlidePosition:', { lessonId, slideIndex, slideId });
            }
        },        // Action mới: Buộc cập nhật progress ngay lập tức
        forceUpdateLessonProgress: (state, action) => {
            ensureStateInitialized(state);
            const { lessonId, slideIndex } = action.payload;

            console.log('🔄 forceUpdateLessonProgress called:', { lessonId, slideIndex });

            if (lessonId && slideIndex !== undefined) {
                ensureLessonExists(state, lessonId);

                console.log('📊 Current lesson data before update:', state.lessons[lessonId]);

                // Kiểm tra totalSlides trước khi tính progress
                if (state.lessons[lessonId].totalSlides > 0) {
                    const currentSlideNumber = slideIndex + 1;
                    const percentage = Math.round((currentSlideNumber / state.lessons[lessonId].totalSlides) * 100);
                    
                    state.lessons[lessonId].percentage = Math.min(percentage, 100);
                    state.lessons[lessonId].lastAccessTime = Date.now();
                    
                    // Cập nhật lesson progress nếu đang học lesson này
                    if (state.lessonProgress.lessonId === lessonId) {
                        state.lessonProgress.percentage = state.lessons[lessonId].percentage;
                    }
                    
                    console.log(`🔄 Force updated progress for lesson ${lessonId}: ${state.lessons[lessonId].percentage}% (slide ${currentSlideNumber}/${state.lessons[lessonId].totalSlides})`);
                    console.log('📊 Updated lesson data:', state.lessons[lessonId]);                } else {
                    console.warn('⚠️ Cannot update progress - totalSlides is 0 for lesson:', lessonId);
                    console.log('📊 Lesson data with totalSlides=0:', state.lessons[lessonId]);
                    console.log('💡 Trying to get totalSlides from lessonProgress...');
                    
                    // Fallback: Try to get totalSlides from lessonProgress if this is the current lesson
                    if (state.lessonProgress.lessonId === lessonId && state.lessonProgress.totalSlides > 0) {
                        console.log('📋 Using totalSlides from lessonProgress:', state.lessonProgress.totalSlides);
                        state.lessons[lessonId].totalSlides = state.lessonProgress.totalSlides;
                        
                        // Now try to calculate progress again
                        const currentSlideNumber = slideIndex + 1;
                        const percentage = Math.round((currentSlideNumber / state.lessons[lessonId].totalSlides) * 100);
                        
                        state.lessons[lessonId].percentage = Math.min(percentage, 100);
                        state.lessons[lessonId].lastAccessTime = Date.now();
                        state.lessonProgress.percentage = state.lessons[lessonId].percentage;
                        
                        console.log(`✅ Fallback progress update successful: ${state.lessons[lessonId].percentage}%`);
                    } else {
                        console.error('❌ Cannot update progress - totalSlides not available anywhere');
                        console.log('💡 Applying default totalSlides=10 for testing/demo purposes');
                        
                        // Last resort: Set a default value for testing purposes
                        state.lessons[lessonId].totalSlides = 10;
                        
                        // Now calculate progress with default value
                        const currentSlideNumber = slideIndex + 1;
                        const percentage = Math.round((currentSlideNumber / state.lessons[lessonId].totalSlides) * 100);
                        
                        state.lessons[lessonId].percentage = Math.min(percentage, 100);
                        state.lessons[lessonId].lastAccessTime = Date.now();
                        
                        // Update lesson progress if this is current lesson
                        if (state.lessonProgress.lessonId === lessonId) {
                            state.lessonProgress.percentage = state.lessons[lessonId].percentage;
                            if (!state.lessonProgress.totalSlides || state.lessonProgress.totalSlides === 0) {
                                state.lessonProgress.totalSlides = state.lessons[lessonId].totalSlides;
                            }
                        }
                        
                        console.log(`⚠️ Default progress update applied: ${state.lessons[lessonId].percentage}% (using default totalSlides=10)`);
                    }
                }
            } else {
                console.warn('⚠️ Invalid params for forceUpdateLessonProgress:', { lessonId, slideIndex });
            }
        },

        // Xóa vị trí slide cuối cùng khi hoàn thành bài học
        clearLastSlidePosition: (state, action) => {
            ensureStateInitialized(state);
            const { lessonId } = action.payload;

            if (lessonId && state.lessons[lessonId]) {
                state.lessons[lessonId].lastSlideIndex = 0;
                state.lessons[lessonId].lastSlideId = null;
                state.lessons[lessonId].lastAccessTime = Date.now();
                console.log(`Cleared last slide position for lesson ${lessonId}`);
            }
        },// Reset toàn bộ progress
        resetProgress: () => initialState,        // Xóa hết thông tin lessons để kiểm tra lại từ đầu
        clearAllLessonsData: (state) => {
            ensureStateInitialized(state);
            // Reset lessons về object rỗng
            state.lessons = {};

            // Reset lesson progress về 0
            state.lessonProgress.completedSlides = 0;
            state.lessonProgress.percentage = 0;
            state.lessonProgress.lastActiveTime = Date.now();

            console.log('All lessons data cleared. Ready for fresh start.');
        },

        // Xóa toàn bộ dữ liệu của một bài học cụ thể
        clearLessonData: (state, action) => {
            ensureStateInitialized(state);
            const { lessonId } = action.payload;

            if (lessonId && state.lessons[lessonId]) {
                // Xóa lesson data
                delete state.lessons[lessonId];

                // Reset lesson progress nếu đang học lesson này
                if (state.lessonProgress.lessonId === lessonId) {
                    state.lessonProgress = {
                        totalSlides: 0,
                        completedSlides: 0,
                        percentage: 0,
                        startTime: null,
                        lastActiveTime: Date.now(),
                        lessonId: null,
                        lessonTitle: null
                    };
                }

                // Reset current slide nếu đang ở lesson này
                if (state.currentSlide.lessonId === lessonId) {
                    state.currentSlide = {
                        id: null,
                        title: null,
                        content: null,
                        type: null,
                        startTime: null,
                        endTime: null,
                        isCompleted: false,
                        score: 0,
                        attempts: 0,
                    };
                }

                console.log(`Cleared all data for lesson ${lessonId}`);
            }
        },
    },
});

// Export actions
export const {
    setCurrentSlide,
    updateSlideField,
    completeSlide,
    incrementAttempts,
    initializeLesson,
    updateTotalSlides,
    updateOverallProgress,
    markSlideCompleted,
    updateLessonProgress,
    setLastSlidePosition,
    clearLastSlidePosition,
    forceUpdateLessonProgress,
    resetProgress,
    clearAllLessonsData,
    clearLessonData
} = progressV2.actions;

// Export selectors
export const selectCurrentSlide = (state) => state.slide?.currentSlide || {};

export const selectLessonProgress = (state) => state.slide?.lessonProgress || {};

export const selectOverallProgressStatus = (state) => ({
    percentage: state.slide?.lessonProgress?.percentage || 0,
    completed: state.slide?.lessonProgress?.completedSlides || 0,
    total: state.slide?.lessonProgress?.totalSlides || 0
});

export const selectSlideProgress = (slideId) => (state) =>
    state.slide?.slides?.[slideId] || { visited: false, completed: false };

export const selectAllLessonsData = (state) => state.slide?.lessons || {};

export const selectLessonData = (lessonId) => (state) =>
    state.slide?.lessons?.[lessonId] || null;

// Selectors cho last slide positions
export const selectLastSlidePositions = (state) => {
    const lessons = state.slide?.lessons || {};
    const positions = {};

    Object.keys(lessons).forEach(lessonId => {
        if (lessons[lessonId].lastSlideIndex !== undefined) {
            positions[lessonId] = {
                slideIndex: lessons[lessonId].lastSlideIndex,
                slideId: lessons[lessonId].lastSlideId,
                timestamp: lessons[lessonId].lastAccessTime
            };
        }
    });

    return positions;
};

export const selectLastSlidePosition = (lessonId) => (state) => {
    const lessonData = state.slide?.lessons?.[lessonId];
    if (lessonData && lessonData.lastSlideIndex !== undefined) {
        return {
            slideIndex: lessonData.lastSlideIndex,
            slideId: lessonData.lastSlideId,
            timestamp: lessonData.lastAccessTime
        };
    }
    return null;
};

// Export reducer
export default progressV2.reducer;