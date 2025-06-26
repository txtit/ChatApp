// src/hooks/useSlide.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    setCurrentSlide,
    updateSlideField,
    completeSlide,
    incrementAttempts,
    resetSlide,
    selectCurrentSlide,
    selectLessonProgress,
    selectSlideProgress,
    selectAllLessonsData,
    selectLessonData,
    initializeLesson,
    markSlideCompleted,
    resetProgress,
    updateTotalSlides,
    selectOverallProgressStatus,
    setLastSlidePosition,
    clearLastSlidePosition,
    selectLastSlidePositions,
    selectLastSlidePosition,
    forceUpdateLessonProgress
} from '../redux/slices/progessV2';

export const useProgressV2 = () => {
    const dispatch = useDispatch();
    // Safe selectors that handle undefined state
    const currentSlide = useSelector(selectCurrentSlide) || {};
    const lessonProgress = useSelector(selectLessonProgress) || {
        percentage: 0,
        completedSlides: 0,
        totalSlides: 0,
        lessonTitle: null,
        lessonId: null
    }; const allLessonsData = useSelector(selectAllLessonsData) || {};
    const lastSlidePositions = useSelector(selectLastSlidePositions) || {};

    // Lấy currentSlide từ Redux

    // Cập nhật toàn bộ slide
    const setSlide = useCallback((slideData) => {
        console.log('Setting slide:', slideData);
        dispatch(setCurrentSlide(slideData));
    }, [dispatch]);

    // Cập nhật một trường cụ thể
    const updateField = useCallback((field, value) => {
        console.log(`Updating field ${field}:`, value);
        dispatch(updateSlideField({ field, value }));
    }, [dispatch]);

    // Đánh dấu slide đã hoàn thành
    const markComplete = useCallback((score) => {
        console.log('Marking slide complete with score:', score);
        dispatch(completeSlide({ score }));
    }, [dispatch]);

    // Tăng số lần thử
    const addAttempt = useCallback(() => {
        console.log('Adding attempt');
        dispatch(incrementAttempts());
    }, [dispatch]);

    // Reset slide
    const resetCurrentSlide = useCallback(() => {
        console.log('Resetting slide');
        dispatch(resetProgress());
    }, [dispatch]);

    // Tính thời gian đã dành cho slide hiện tại (ms)
    const getSlideTime = useCallback(() => {
        if (!currentSlide.startTime) return 0;
        const endTime = currentSlide.endTime || Date.now();
        return endTime - currentSlide.startTime;
    }, [currentSlide.endTime, currentSlide.startTime]);

    // Đánh dấu slide hiện tại đã hoàn thành
    const completeCurrentSlide = useCallback((score) => {
        console.log('Marking current slide complete with score:', score);
        dispatch(completeSlide({ score }));
    }, [dispatch]);

    // == LESSON PROGRESS ACTIONS ==

    // Khởi tạo thông tin bài học
    const initLesson = useCallback((options) => {
        console.log('Initializing lesson:', options);
        dispatch(initializeLesson(options));
    }, [dispatch]);

    // Cập nhật tổng số slide
    const updateTotal = useCallback((totalSlides) => {
        console.log('Updating total slides:', totalSlides);
        dispatch(updateTotalSlides({ totalSlides }));
    }, [dispatch]);

    // Đánh dấu một slide cụ thể đã hoàn thành
    const markSlideComplete = useCallback((slideId, score) => {
        console.log(`Marking slide ${slideId} complete with score:`, score);
        dispatch(markSlideCompleted({ slideId, score }));
    }, [dispatch]);

    // Reset toàn bộ progress
    const resetAll = useCallback(() => {
        console.log('Resetting all progress');
        dispatch(resetProgress());
    }, [dispatch]);

    // == HELPERS ==



    // Định dạng thời gian thành chuỗi mm:ss
    const formatTime = useCallback((milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, []);    // Kiểm tra một lesson đã hoàn thành chưa (lessons structure)
    const isLessonCompleted = useCallback((lessonId) => {
        return allLessonsData[lessonId]?.isCompleted || false;
    }, [allLessonsData]);

    // Lấy thông tin progress của một lesson cụ thể (lessons structure)
    const getLessonProgress = useCallback((lessonId) => {
        return allLessonsData[lessonId] || null;
    }, [allLessonsData]);    // Lấy điểm số của một lesson (lessons structure)
    const getLessonScore = useCallback((lessonId) => {
        return allLessonsData[lessonId]?.score || null;
    }, [allLessonsData]);

    // Lấy phần trăm progress của lesson
    const getLessonProgressPercentage = useCallback((lessonId) => {
        if (!lessonId || !allLessonsData) return 0;
        const lessonData = allLessonsData[lessonId];
        return lessonData?.percentage || 0;
    }, [allLessonsData]);

    // Lấy vị trí slide cuối cùng của lesson với format đầy đủ
    const getLastSlidePositionForLesson = useCallback((lessonId) => {
        if (!lessonId || !allLessonsData) return null;

        const lessonData = allLessonsData[lessonId];
        if (lessonData && lessonData.lastSlideIndex !== undefined) {
            return {
                slideIndex: lessonData.lastSlideIndex,
                slideId: lessonData.lastSlideId,
                timestamp: lessonData.lastAccessTime
            };
        }
        return null;
    }, [allLessonsData]);    // === REMOVED LEGACY SLIDE FUNCTIONS ===
    // Legacy slide functions have been removed as we've migrated to lessons-based structure
    // Use lesson-based functions instead: isLessonCompleted, getLessonProgress, etc.

    // == LAST SLIDE POSITION ACTIONS ==

    // Lưu vị trí slide cuối cùng
    const saveLastSlidePosition = useCallback((lessonId, slideIndex, slideId) => {
        console.log(`Saving last slide position for lesson ${lessonId}:`, { slideIndex, slideId });
        dispatch(setLastSlidePosition({ lessonId, slideIndex, slideId }));
    }, [dispatch]);

    // Xóa vị trí slide cuối cùng (khi hoàn thành bài học)
    const clearLastPosition = useCallback((lessonId) => {
        console.log(`Clearing last slide position for lesson ${lessonId}`);
        dispatch(clearLastSlidePosition({ lessonId }));
    }, [dispatch]);    // Lấy vị trí slide cuối cùng của một bài học
    const getLastSlidePosition = useCallback((lessonId) => {
        return lastSlidePositions[lessonId] || null;
    }, [lastSlidePositions]);

    // Action mới: Buộc cập nhật progress
    const forceUpdateProgress = useCallback((lessonId, slideIndex) => {
        console.log(`Force updating progress for lesson ${lessonId} at slide ${slideIndex}`);
        dispatch(forceUpdateLessonProgress({ lessonId, slideIndex }));
    }, [dispatch]);    return {
        // State
        currentSlide,
        lessonProgress,
        lastSlidePositions,
        allLessonsData,

        // Actions
        setSlide,
        updateField,
        markComplete,
        addAttempt,
        resetCurrentSlide,

        // Current slide actions
        completeCurrentSlide,

        // Lesson actions
        initLesson,
        updateTotal,
        resetAll,

        // Last slide position actions
        saveLastSlidePosition,
        clearLastPosition,
        getLastSlidePosition,
        forceUpdateProgress,

        // Lesson helpers (new structure)
        isLessonCompleted,
        getLessonProgress,
        getLessonScore,
        getLessonProgressPercentage,
        getLastSlidePositionForLesson,

        // Utilities
        getSlideTime,
        formatTime
    };
};