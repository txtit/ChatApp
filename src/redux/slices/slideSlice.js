// src/redux/slices/slideSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Định nghĩa state ban đầu
const initialState = {
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
  // Lưu vị trí slide cuối cùng cho mỗi bài học
  lastSlidePositions: {
    // Format: { lessonId: { slideIndex: number, slideId: string, timestamp: number } }
  }
};

// Tạo slide slice
const slideSlice = createSlice({
  name: 'slide',
  initialState,
  reducers: {
    // Cập nhật toàn bộ slide
    setCurrentSlide: (state, action) => {
      // Reset các trường tracking
      state.currentSlide = {
        ...action.payload,
        startTime: Date.now(),
        endTime: null,
        isCompleted: false,
        score: 0,
        attempts: 0,
      };

      console.log('Redux: Current slide set:', state.currentSlide);
    },

    // Cập nhật một trường cụ thể
    updateSlideField: (state, action) => {
      const { field, value } = action.payload;

      if (field && state.currentSlide) {
        state.currentSlide[field] = value;
        console.log(`Redux: Updated ${field}:`, value);
      }
    },

    // Đánh dấu slide đã hoàn thành
    completeSlide: (state, action) => {
      if (state.currentSlide) {
        state.currentSlide.isCompleted = true;
        state.currentSlide.endTime = Date.now();

        if (action.payload?.score !== undefined) {
          state.currentSlide.score = action.payload.score;
        }

        console.log('Redux: Slide completed:', state.currentSlide);
      }
    },    // Tăng số lần thử
    incrementAttempts: (state) => {
      if (state.currentSlide) {
        state.currentSlide.attempts += 1;
        console.log('Redux: Attempts:', state.currentSlide.attempts);
      }
    },

    // Lưu vị trí slide cuối cùng cho bài học
    setLastSlidePosition: (state, action) => {
      const { lessonId, slideIndex, slideId } = action.payload;

      if (lessonId && slideIndex !== undefined) {
        state.lastSlidePositions[lessonId] = {
          slideIndex,
          slideId: slideId || null,
          timestamp: Date.now()
        };

        console.log(`Redux: Saved last slide position for lesson ${lessonId}:`,
          state.lastSlidePositions[lessonId]);
      }
    },

    // Xóa vị trí slide cuối cùng khi hoàn thành bài học
    clearLastSlidePosition: (state, action) => {
      const { lessonId } = action.payload;

      if (lessonId && state.lastSlidePositions[lessonId]) {
        delete state.lastSlidePositions[lessonId];
        console.log(`Redux: Cleared last slide position for lesson ${lessonId}`);
      }
    },

    // Reset state
    resetSlide: () => initialState,
  },
});

// Export actions
export const {
  setCurrentSlide,
  updateSlideField,
  completeSlide,
  incrementAttempts,
  setLastSlidePosition,
  clearLastSlidePosition,
  resetSlide,
} = slideSlice.actions;

// Export selectors
export const selectCurrentSlide = (state) => state.slide.currentSlide;
export const selectLastSlidePositions = (state) => state.slide.lastSlidePositions;
export const selectLastSlidePosition = (lessonId) => (state) =>
  state.slide.lastSlidePositions[lessonId] || null;

// Export reducer
export default slideSlice.reducer;
