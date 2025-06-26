import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import {
    updateProgressDetails,
    addCompletedSlide,
    addCompletedExercise,
    addCompletedQuiz,
    updateTimeSpent,
    saveProgressToDB,
    loadProgressFromDB,
    resetProgress,
    clearError,
    // New actions
    startLearningSession,
    endLearningSession,
    navigateToSlide,
    markSlideCompleted,
    saveExerciseResult,
    saveQuizResult,
    addCustomAchievement,
    updateDailyGoals,
    resetCurrentSession,
    resetAllProgress,
    // Slide-specific actions
    setCurrentSlide,
    updateCurrentSlide,
    startSlide,
    finishSlide,
    // ✅ NEW SESSION ACTIONS
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    setUserId,
    setSlideId,
    setSlideAndUser,

    // ✅ NEW LEARNING STATS ACTIONS
    incrementStudyStreak,
    updateTotalTimeSpent,
    incrementCompletedLessons,
    // ✅ NEW ACHIEVEMENT ACTIONS
    unlockAchievement,
    markAchievementAsViewed,
    // ✅ NEW GOAL ACTIONS
    setDailyGoals,
    resetDailyProgress,
    resetWeeklyProgress,
    resetMonthlyProgress,
    // ✅ NEW PROGRESS ACTIONS
    updateOverallProgress,
    setLoadingState,
    setErrorState,
    setSavingState
} from '../redux/slices/progress';
import {
    saveProgressToReduxAndDB,
    markExerciseCompleted,
    markQuizCompleted,
    updateStudyTime,
    setupAutoSave,
    stopAutoSave
} from '../utils/progressHelpers';

/**
 * Custom hook để quản lý progress
 * @param {string} userId - ID của user
 * @param {string} slideId - ID của slide hiện tại
 * @param {Object} options - Tùy chọn cấu hình
 */
export const useProgress = (userId, slideId, options = {}) => {
    const {
        autoSave = true,
        autoSaveInterval = 30000, // 30 seconds
        trackTime = true
    } = options;

    const dispatch = useDispatch();
    const progressState = useSelector(state => state.progress);
    const autoSaveRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    // Initialize progress khi hook được sử dụng
    useEffect(() => {
        if (userId && slideId) {
            const initProgress = {
                slideId,
                userId,
                overallProgress: 0,
                currentSlideIndex: 0,
                completedSlides: [],
                completedExercises: [],
                completedQuizzes: [],
                timeSpent: 0,
                reduxState: progressState
            };

            dispatch(updateProgressDetails(initProgress));

            // Load existing progress from DB
            dispatch(loadProgressFromDB({ userId, slideId }));

            // Setup auto save nếu được enable
            if (autoSave) {
                autoSaveRef.current = setupAutoSave(
                    dispatch,
                    () => progressState,
                    autoSaveInterval
                );
            }
        }

        return () => {
            // Save final progress khi unmount
            if (trackTime && userId && slideId) {
                const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
                updateStudyTime(dispatch, sessionTime, progressState);
            }

            // Stop auto save
            if (autoSaveRef.current) {
                stopAutoSave(autoSaveRef.current);
            }
        };
    }, [userId, slideId, autoSave, autoSaveInterval, trackTime, dispatch]);

    // Các callback functions
    const saveProgress = useCallback(async (customData = {}) => {
        const progressData = {
            slideId: progressState.slideId,
            userId: progressState.userId,
            overallProgress: progressState.overallProgress,
            currentSlideIndex: progressState.currentSlideIndex,
            completedSlides: progressState.completedSlides,
            completedExercises: progressState.completedExercises,
            completedQuizzes: progressState.completedQuizzes,
            timeSpent: progressState.timeSpent,
            reduxState: progressState,
            ...customData
        };

        return await saveProgressToReduxAndDB(dispatch, progressData);
    }, [dispatch, progressState]);

    const completeSlide = useCallback(async (slideId) => {
        return await markSlideCompleted(dispatch, slideId, progressState);
    }, [dispatch, progressState]);

    const completeExercise = useCallback(async (exerciseId) => {
        return await markExerciseCompleted(dispatch, exerciseId, progressState);
    }, [dispatch, progressState]);

    const completeQuiz = useCallback(async (quizId) => {
        return await markQuizCompleted(dispatch, quizId, progressState);
    }, [dispatch, progressState]);

    const addStudyTime = useCallback((timeInSeconds) => {
        dispatch(updateTimeSpent(timeInSeconds));
    }, [dispatch]);

    const updateCurrentSlide = useCallback((slideIndex) => {
        dispatch(updateProgressDetails({
            currentSlideIndex: slideIndex,
            reduxState: progressState
        }));
    }, [dispatch, progressState]);

    const updateOverallProgress = useCallback((progress) => {
        dispatch(updateProgressDetails({
            overallProgress: progress,
            reduxState: progressState
        }));
    }, [dispatch, progressState]);

    const reset = useCallback(() => {
        dispatch(resetProgress());
        startTimeRef.current = Date.now();
    }, [dispatch]);

    const clearProgressError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const loadProgress = useCallback(async (userId, slideId) => {
        return await dispatch(loadProgressFromDB({ userId, slideId }));
    }, [dispatch]);

    const setCurrentUserId = (userId) => {
        dispatch(setUserId(userId));
    }
    const setCurrentSlideId = (slideId) => {
        dispatch(setSlideId(slideId));
    }
    const setSlideAndUserInfo = (slideId, userId) => {
        dispatch(setSlideAndUser({ slideId, userId }));
    }
    const selectLesson = useCallback((slideId, userId) => {
        dispatch(setCurrentSlide({ slideId, userId }));
        console.log(`Selected lesson: ${slideId} for user: ${userId}`);
    }, [dispatch]);

    // Tính toán các metrics
    const metrics = {
        completionRate: progressState.completedSlides?.length || 0,
        exerciseCompletionRate: progressState.completedExercises?.length || 0,
        quizCompletionRate: progressState.completedQuizzes?.length || 0,
        totalStudyTime: progressState.timeSpent || 0,
        sessionTime: Math.floor((Date.now() - startTimeRef.current) / 1000),
        overallProgress: progressState.overallProgress || 0
    };

    return {
        // State
        progressState,
        metrics,

        // Actions
        saveProgress,
        completeSlide,
        completeExercise,
        completeQuiz,
        addStudyTime,
        updateCurrentSlide,
        updateOverallProgress,
        reset,
        clearProgressError,
        loadProgress,

        setCurrentSlideId,
        setCurrentUserId,
        setSlideAndUserInfo,

        // === NEW SESSION MANAGEMENT ACTIONS ===
        startSession: useCallback((slideData, userId = null) => {
            dispatch(startLearningSession({
                slideData,
                userId,
                startTime: Date.now()
            }));
        }, [dispatch]),

        endSession: useCallback(() => {
            dispatch(endLearningSession({
                endTime: Date.now()
            }));
        }, [dispatch]),

        resetSession: useCallback(() => {
            dispatch(resetCurrentSession());
        }, [dispatch]),

        // === NEW NAVIGATION ACTIONS ===
        goToSlide: useCallback((slideIndex, slideData = null) => {
            dispatch(navigateToSlide({
                slideIndex,
                slideData,
                timestamp: Date.now()
            }));
        }, [dispatch]),

        completeSlideNew: useCallback((slideIndex, slideId = null, score = 0) => {
            dispatch(markSlideCompleted({
                slideIndex,
                slideId,
                score,
                completedAt: Date.now()
            }));
        }, [dispatch]),

        // === NEW EXERCISE & QUIZ ACTIONS ===
        submitExercise: useCallback((exerciseId, slideId, answers, score, totalQuestions) => {
            dispatch(saveExerciseResult({
                exerciseId,
                slideId,
                answers,
                score,
                totalQuestions,
                completedAt: Date.now()
            }));
        }, [dispatch]),

        submitQuiz: useCallback((quizId, slideId, answers, score, totalQuestions) => {
            dispatch(saveQuizResult({
                quizId,
                slideId,
                answers,
                score,
                totalQuestions,
                completedAt: Date.now()
            }));
        }, [dispatch]),

        // === NEW ACHIEVEMENT ACTIONS ===
        unlockAchievement: useCallback((achievement) => {
            dispatch(addCustomAchievement(achievement));
        }, [dispatch]),        // === NEW GOAL ACTIONS ===
        setDailyGoals: useCallback((goals) => {
            dispatch(updateDailyGoals({ goals }));
        }, [dispatch]),

        // === NEW UTILITY ACTIONS ===
        resetAllData: useCallback(() => {
            dispatch(resetAllProgress());
        }, [dispatch]),

        // ✅ === NEW SESSION MANAGEMENT ACTIONS ===
        startNewSession: useCallback((sessionType = 'learning', userId = null) => {
            dispatch(startSession({ sessionType, userId }));
        }, [dispatch]),

        endCurrentSession: useCallback(() => {
            dispatch(endSession());
        }, [dispatch]),

        pauseCurrentSession: useCallback(() => {
            dispatch(pauseSession());
        }, [dispatch]),

        resumeCurrentSession: useCallback(() => {
            dispatch(resumeSession());
        }, [dispatch]),

        // ✅ === NEW LEARNING STATS ACTIONS ===
        incrementStreak: useCallback(() => {
            dispatch(incrementStudyStreak());
        }, [dispatch]),

        addStudyTime: useCallback((timeInMs) => {
            dispatch(updateTotalTimeSpent(timeInMs));
        }, [dispatch]),

        markLessonComplete: useCallback(() => {
            dispatch(incrementCompletedLessons());
        }, [dispatch]),

        // ✅ === NEW ACHIEVEMENT ACTIONS ===
        unlockNewAchievement: useCallback((achievement) => {
            dispatch(unlockAchievement(achievement));
        }, [dispatch]),

        markAchievementViewed: useCallback((achievementId) => {
            dispatch(markAchievementAsViewed(achievementId));
        }, [dispatch]),

        // ✅ === NEW GOAL MANAGEMENT ACTIONS ===
        updateDailyGoals: useCallback((goals) => {
            dispatch(setDailyGoals(goals));
        }, [dispatch]),

        resetDailyGoalProgress: useCallback(() => {
            dispatch(resetDailyProgress());
        }, [dispatch]),

        resetWeeklyGoalProgress: useCallback(() => {
            dispatch(resetWeeklyProgress());
        }, [dispatch]),

        resetMonthlyGoalProgress: useCallback(() => {
            dispatch(resetMonthlyProgress());
        }, [dispatch]),

        // ✅ === NEW PROGRESS ACTIONS ===
        setProgress: useCallback((progress) => {
            dispatch(updateOverallProgress(progress));
        }, [dispatch]),

        setLoading: useCallback((loading) => {
            dispatch(setLoadingState(loading));
        }, [dispatch]),

        setError: useCallback((error) => {
            dispatch(setErrorState(error));
        }, [dispatch]),

        setSaving: useCallback((saving) => {
            dispatch(setSavingState(saving));
        }, [dispatch]),

        // === SLIDE-SPECIFIC ACTIONS ===
        setSlide: useCallback((slideData) => {
            dispatch(setCurrentSlide(slideData));
        }, [dispatch]),

        updateSlide: useCallback((updates) => {
            dispatch(updateCurrentSlide(updates));
        }, [dispatch]),

        beginSlide: useCallback((slideId, startTime = null) => {
            dispatch(startSlide({
                slideId,
                startTime: startTime || new Date().toISOString()
            }));
        }, [dispatch]),

        completeSlideDetails: useCallback((slideResult) => {
            const { score, maxScore, feedback, notes, endTime } = slideResult;
            dispatch(finishSlide({
                score,
                maxScore,
                feedback,
                notes,
                endTime: endTime || new Date().toISOString()
            }));
        }, [dispatch]),        // === COMPUTED VALUES ===
        isSessionActive: !!progressState.currentSession?.isActive,
        sessionDuration: progressState.currentSession?.startTime
            ? Date.now() - progressState.currentSession.startTime - (progressState.currentSession.pausedTime || 0)
            : 0,
        currentSessionId: progressState.currentSession?.sessionId || null,
        slidesViewedInSession: progressState.currentSession?.slidesViewed?.length || 0,
        sessionScore: progressState.currentSession?.sessionScore || 0,

        completionRate: progressState.learningStats?.totalSlides > 0
            ? Math.round((progressState.completedSlides?.length || 0) / progressState.learningStats.totalSlides * 100)
            : 0,
        recentAchievements: progressState.achievements
            ?.sort((a, b) => (b.unlockedAt || b.earnedAt) - (a.unlockedAt || a.earnedAt))
            ?.slice(0, 5) || [],
        newAchievements: progressState.achievements?.filter(a => a.isNew) || [],

        isOnStreak: (progressState.learningStats?.studyStreak || progressState.learningStats?.streakDays || 0) > 0,
        currentStreak: progressState.learningStats?.studyStreak || progressState.learningStats?.streakDays || 0,

        // ✅ NEW COMPUTED VALUES
        totalSessions: progressState.learningStats?.totalSessions || 0,
        totalTimeSpent: progressState.learningStats?.totalTimeSpent || progressState.timeSpent || 0,
        completedLessons: progressState.learningStats?.completedLessons || 0,

        // Goal progress
        dailyGoalProgress: {
            timeProgress: progressState.goals?.dailyTimeMinutes > 0
                ? (progressState.goalProgress?.todayTime || 0) / (progressState.goals.dailyTimeMinutes * 60 * 1000) * 100
                : 0,
            lessonProgress: progressState.goals?.weeklyLessons > 0
                ? (progressState.goalProgress?.todayLessons || 0) / (progressState.goals.weeklyLessons / 7) * 100
                : 0
        },

        weeklyGoalProgress: {
            timeProgress: progressState.goals?.dailyTimeMinutes > 0
                ? (progressState.goalProgress?.weekTime || 0) / (progressState.goals.dailyTimeMinutes * 7 * 60 * 1000) * 100
                : 0,
            lessonProgress: progressState.goals?.weeklyLessons > 0
                ? (progressState.goalProgress?.weekLessons || 0) / progressState.goals.weeklyLessons * 100
                : 0
        },

        // === HELPER METHODS ===
        getSlideHistory: useCallback((slideId) => {
            return progressState.slideHistory?.[slideId] || null;
        }, [progressState.slideHistory]),

        isSlideCompleted: useCallback((slideIndex) => {
            return progressState.completedSlides?.includes(slideIndex) || false;
        }, [progressState.completedSlides]),

        hasAchievement: useCallback((achievementId) => {
            return progressState.achievements?.some(a => a.id === achievementId) || false;
        }, [progressState.achievements]),

        getProgressSummary: useCallback(() => {
            return {
                totalSlides: progressState.learningStats?.totalSlides || 0,
                completedSlides: progressState.completedSlides?.length || 0,
                totalExercises: progressState.learningStats?.totalExercises || 0,
                totalQuizzes: progressState.learningStats?.totalQuizzes || 0,
                overallProgress: progressState.overallProgress || 0,
                averageScore: progressState.learningStats?.averageScore || 0,
                bestScore: progressState.learningStats?.bestScore || 0,
                timeSpent: progressState.timeSpent || 0,
                streakDays: progressState.learningStats?.streakDays || 0,
                achievementsCount: progressState.achievements?.length || 0
            };
        }, [progressState]),

        formatTime: useCallback((ms) => {
            if (!ms || ms === 0) return '0m';

            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);

            if (hours > 0) {
                return `${hours}h ${minutes % 60}m`;
            } else if (minutes > 0) {
                return `${minutes}m`;
            } else {
                return `${seconds}s`;
            }
        }, []),

        // Status
        isLoading: progressState.isLoading,
        isSaving: progressState.isSaving,
        error: progressState.error
    };
};

export default useProgress;
