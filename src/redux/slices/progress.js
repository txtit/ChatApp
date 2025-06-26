import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { progressAPI } from "../../utils/mockProgressAPI"; // Import mock API

// Async thunk để lưu progress vào database
export const saveProgressToDB = createAsyncThunk(
    'progress/saveProgressToDB',
    async (progressData, { rejectWithValue }) => {
        try {
            // Trong development, sử dụng mock API
            if (process.env.NODE_ENV === 'development') {
                const response = await progressAPI.saveProgress(progressData);
                return response.data;
            }

            // Trong production, sử dụng real API
            const response = await axios.post('/api/progress/save', progressData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk để lấy progress từ database
export const loadProgressFromDB = createAsyncThunk(
    'progress/loadProgressFromDB',
    async ({ userId, slideId }, { rejectWithValue }) => {
        try {
            // Trong development, sử dụng mock API
            if (process.env.NODE_ENV === 'development') {
                const response = await progressAPI.loadProgress(userId, slideId);
                return response.data;
            }

            // Trong production, sử dụng real API
            const response = await axios.get(`/api/progress/load/${userId}/${slideId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    // Thông tin progress chi tiết
    slideId: null,
    userId: null,
    overallProgress: 0,
    selectedLesson: null,
    currentSlideIndex: 0,
    completedSlides: [],
    completedExercises: [], completedQuizzes: [],
    timeSpent: 0,

    // ✅ SESSION MANAGEMENT (THÊM MỚI)
    currentSession: {
        isActive: false,
        startTime: null,
        endTime: null,
        sessionId: null,
        slidesViewed: [],
        sessionTimeSpent: 0,
        sessionScore: 0,
        sessionType: null, // 'learning', 'practice', 'test'
        pausedTime: 0,
        resumeCount: 0
    },

    // Thông tin chi tiết của slide hiện tại
    currentSlide: {
        id: null,
        title: null,
        content: null,
        type: null, // 'lesson', 'exercise', 'quiz', 'game'
        difficulty: null, // 'easy', 'medium', 'hard'
        subject: null, // 'math', 'english', 'science'
        duration: 0, // thời gian dự kiến (phút)
        points: 0, // điểm tối đa có thể đạt được
        startTime: null,
        endTime: null,
        attempts: 0, // số lần thử
        score: 0, // điểm đạt được
        maxScore: 0, // điểm tối đa
        isCompleted: false,
        feedback: null, // phản hồi từ giáo viên/hệ thống
        notes: null, // ghi chú của học sinh
        tags: [], // các tag liên quan
        prerequisites: [], // slide cần hoàn thành trước
        resources: [], // tài liệu tham khảo
        metadata: {} // thông tin meta khác
    },

    // Lịch sử chi tiết của tất cả slides
    slideHistory: {}, // { slideId: { attempts: [...], scores: [...], timeSpent: 0, ... } }    // Thống kê học tập
    learningStats: {
        totalSlides: 0,
        totalLessons: 0,
        totalExercises: 0,
        totalQuizzes: 0,
        totalGames: 0,
        totalSessions: 0,        // ✅ THÊM MỚI
        studyStreak: 0,          // ✅ THÊM MỚI
        averageScore: 0,
        bestScore: 0,
        streakDays: 0,
        lastStudyDate: null,
        totalTimeSpent: 0,       // ✅ THÊM MỚI
        completedLessons: 0,     // ✅ THÊM MỚI
        favoriteSubjects: [],
        weakSubjects: [],
        studyHours: {
            daily: 0,
            weekly: 0,
            monthly: 0,
            total: 0
        }
    },    // Achievements và badges
    achievements: [],
    unlockedBadges: [],
    currentGoals: [],

    // ✅ GOAL SYSTEM (THÊM MỚI)
    goals: {
        dailyTimeMinutes: 60,
        weeklyLessons: 5,
        weeklyQuizzes: 3,
        monthlyPoints: 1000,
        targetScore: 80,
        streakTarget: 7
    },

    // ✅ GOAL PROGRESS (THÊM MỚI)
    goalProgress: {
        todayTime: 0,
        todayLessons: 0,
        todayQuizzes: 0,
        weekTime: 0,
        weekLessons: 0,
        weekQuizzes: 0,
        monthPoints: 0,
        currentStreak: 0,
        lastGoalCheck: null
    },

    // Lưu theo courseId hoặc slideId: { [id]: percent }
    progress: {},

    // Loading states
    isLoading: false,
    isSaving: false,
    error: null,

    // Redux state snapshot
    reduxState: null
};

// Helper function to ensure learningStats exists
const ensureLearningStats = (state) => {
    if (!state.learningStats) {
        state.learningStats = {
            totalSlides: 0,
            totalLessons: 0,
            totalExercises: 0,
            totalQuizzes: 0,
            totalGames: 0,
            averageScore: 0,
            bestScore: 0,
            streakDays: 0,
            lastStudyDate: null,
            favoriteSubjects: [],
            weakSubjects: [],
            studyHours: {
                daily: 0,
                weekly: 0,
                monthly: 0,
                total: 0
            }
        };
    }
};

const progressSlice = createSlice({
    name: "progress",
    initialState,
    reducers: {
        setSelectedLesson: (state, action) => {
            state.selectedLesson = action.payload;
        },

        loadLessons: (state, action) => {
            state.availableLessons = action.payload;
        },
        // Action để set thông tin progress cơ bản
        setProgress: (state, action) => {
            const { courseId, percent } = action.payload;
            state.progress[courseId] = percent;
        },        // Action để update thông tin progress chi tiết
        updateProgressDetails: (state, action) => {
            console.log("Reducer received: ", action.payload);
            const {
                slideId,
                userId,
                overallProgress,
                currentSlideIndex,
                completedSlides,
                completedExercises,
                completedQuizzes,
                timeSpent,
                reduxState,
                // Add support for direct field updates
                field,
                value
            } = action.payload;

            // If field and value are provided, update that specific field
            if (field && value !== undefined) {
                if (state.currentSlide) {
                    state.currentSlide[field] = value;
                    console.log(`Updated state.currentSlide.${field} = ${JSON.stringify(value)}`);
                } else {
                    // If currentSlide doesn't exist yet, create it
                    state.currentSlide = { [field]: value };
                    console.log(`Created state.currentSlide with ${field} = ${JSON.stringify(value)}`);
                }
            }

            if (slideId !== undefined) state.slideId = slideId;
            if (userId !== undefined) state.userId = userId;
            if (overallProgress !== undefined) state.overallProgress = overallProgress;
            if (currentSlideIndex !== undefined) state.currentSlideIndex = currentSlideIndex;
            if (completedSlides !== undefined) state.completedSlides = completedSlides;
            if (completedExercises !== undefined) state.completedExercises = completedExercises;
            if (completedQuizzes !== undefined) state.completedQuizzes = completedQuizzes;
            if (timeSpent !== undefined) state.timeSpent = timeSpent;
            if (reduxState !== undefined) state.reduxState = reduxState;
        },

        // Action để thêm slide đã hoàn thành
        addCompletedSlide: (state, action) => {
            const slideId = action.payload;
            if (!state.completedSlides.includes(slideId)) {
                state.completedSlides.push(slideId);
            }
        },

        // Action để thêm exercise đã hoàn thành
        addCompletedExercise: (state, action) => {
            const exerciseId = action.payload;
            if (!state.completedExercises.includes(exerciseId)) {
                state.completedExercises.push(exerciseId);
            }
        },

        // Action để thêm quiz đã hoàn thành
        addCompletedQuiz: (state, action) => {
            const quizId = action.payload;
            if (!state.completedQuizzes.includes(quizId)) {
                state.completedQuizzes.push(quizId);
            }
        },        // Action để cập nhật thời gian học
        updateTimeSpent: (state, action) => {
            state.timeSpent += action.payload;
        },

        // === ACTIONS MỚI CHO SLIDE DETAILS ===

        // Action để set thông tin slide hiện tại
        setCurrentSlide: (state, action) => {
            const slideData = action.payload;

            // Khởi tạo currentSlide nếu chưa tồn tại
            if (!state.currentSlide) {
                state.currentSlide = {
                    id: null,
                    startTime: null,
                    endTime: null,
                    score: 0,
                    maxScore: 0,
                    attempts: 0,
                    feedback: null,
                    notes: null,
                    completed: false
                };
            }

            state.currentSlide = {
                ...state.currentSlide,
                ...slideData
            };
            state.slideId = slideData.id;
        },        // Action để cập nhật thông tin slide hiện tại
        updateCurrentSlide: (state, action) => {
            const updates = action.payload;

            // Đảm bảo currentSlide tồn tại trước khi update
            if (!state.currentSlide) {
                state.currentSlide = {
                    id: null,
                    startTime: null,
                    endTime: null,
                    score: 0,
                    maxScore: 0,
                    attempts: 0,
                    feedback: null,
                    notes: null,
                    completed: false
                };
            }

            state.currentSlide = {
                ...state.currentSlide,
                ...updates
            };
        },
        // Action để bắt đầu slide
        startSlide: (state, action) => {
            const { slideId, startTime } = action.payload;

            // Đảm bảo currentSlide được khởi tạo
            if (!state.currentSlide) {
                state.currentSlide = {
                    id: slideId,
                    startTime: null,
                    endTime: null,
                    score: 0,
                    maxScore: 0,
                    attempts: 0,
                    feedback: null,
                    notes: null,
                    completed: false
                };
            }

            state.currentSlide.id = slideId;
            state.currentSlide.startTime = startTime || new Date().toISOString(); state.currentSlide.attempts = (state.currentSlide.attempts || 0) + 1;
            state.currentSlide.completed = false;
        },
        // Action để kết thúc slide
        finishSlide: (state, action) => {
            const { score, maxScore, feedback, notes, endTime } = action.payload;
            const actualEndTime = endTime || new Date().toISOString();

            // Đảm bảo currentSlide tồn tại
            if (!state.currentSlide) {
                console.warn('finishSlide called but currentSlide is null');
                return;
            }

            state.currentSlide.endTime = actualEndTime;
            state.currentSlide.score = score || 0;
            state.currentSlide.maxScore = maxScore || 0;
            state.currentSlide.feedback = feedback;
            state.currentSlide.notes = notes;
            state.currentSlide.completed = true;

            // Tính thời gian hoàn thành slide
            if (state.currentSlide.startTime) {
                const duration = new Date(actualEndTime) - new Date(state.currentSlide.startTime);
                const durationMinutes = Math.floor(duration / (1000 * 60));

                // Cập nhật slide history
                const slideId = state.currentSlide.id;
                if (!state.slideHistory[slideId]) {
                    state.slideHistory[slideId] = {
                        attempts: [],
                        scores: [],
                        timeSpent: 0,
                        bestScore: 0,
                        averageScore: 0,
                        completedCount: 0
                    };
                }

                state.slideHistory[slideId].attempts.push({
                    attemptNumber: state.currentSlide.attempts,
                    score: score || 0,
                    maxScore: maxScore || 0,
                    startTime: state.currentSlide.startTime,
                    endTime: actualEndTime,
                    duration: durationMinutes,
                    feedback: feedback
                });

                state.slideHistory[slideId].scores.push(score || 0);
                state.slideHistory[slideId].timeSpent += durationMinutes;
                state.slideHistory[slideId].completedCount += 1;
                state.slideHistory[slideId].bestScore = Math.max(
                    state.slideHistory[slideId].bestScore,
                    score || 0
                );
                state.slideHistory[slideId].averageScore =
                    state.slideHistory[slideId].scores.reduce((a, b) => a + b, 0) /
                    state.slideHistory[slideId].scores.length;
            }
        },
        // Action để cập nhật learning stats
        updateLearningStats: (state, action) => {
            const updates = action.payload;

            // Ensure learningStats exists
            ensureLearningStats(state);

            state.learningStats = {
                ...state.learningStats,
                ...updates
            };
        },
        // Action để thêm achievement
        addAchievement: (state, action) => {
            const achievement = action.payload;
            if (!state.achievements.find(a => a.id === achievement.id)) {
                state.achievements.push({
                    ...achievement,
                    earnedAt: achievement.earnedAt || new Date().toISOString()
                });
            }
        },
        // Action để unlock badge
        unlockBadge: (state, action) => {
            const badge = action.payload;
            if (!state.unlockedBadges.find(b => b.id === badge.id)) {
                state.unlockedBadges.push({
                    ...badge,
                    unlockedAt: badge.unlockedAt || new Date().toISOString()
                });
            }
        },
        // Action để set goals
        setGoals: (state, action) => {
            state.currentGoals = action.payload;
        },
        // Action để cập nhật goal progress
        updateGoalProgress: (state, action) => {
            const { goalId, progress, completedAt } = action.payload;
            const goal = state.currentGoals.find(g => g.id === goalId);
            if (goal) {
                goal.currentProgress = progress;
                goal.isCompleted = progress >= goal.targetProgress;
                if (goal.isCompleted && !goal.completedAt) {
                    goal.completedAt = completedAt || new Date().toISOString();
                }
            }
        },
        // Action để thêm notes cho slide
        addSlideNotes: (state, action) => {
            const { slideId, notes } = action.payload;
            if (state.currentSlide.id === slideId) {
                state.currentSlide.notes = notes;
            }

            // Cũng lưu vào slide history
            if (state.slideHistory[slideId]) {
                state.slideHistory[slideId].notes = notes;
            }
        },
        // Action để thêm tags cho slide
        addSlideTags: (state, action) => {
            const { slideId, tags } = action.payload;
            if (state.currentSlide.id === slideId) {
                state.currentSlide.tags = [
                    ...new Set([...state.currentSlide.tags, ...tags])
                ];
            }
        },
        // Action để cập nhật study streak
        updateStudyStreak: (state, action) => {
            // Ensure learningStats exists
            ensureLearningStats(state);

            const now = action.payload || new Date().toISOString();
            const today = new Date(now).toDateString();
            const lastStudy = state.learningStats.lastStudyDate;

            if (!lastStudy) {
                state.learningStats.streakDays = 1;
            } else {
                const lastStudyDate = new Date(lastStudy).toDateString();
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

                if (lastStudyDate === yesterday) {
                    state.learningStats.streakDays += 1;
                } else if (lastStudyDate !== today) {
                    state.learningStats.streakDays = 1;
                }
            }

            state.learningStats.lastStudyDate = now;
        },
        // Action để cập nhật study hours
        updateStudyHours: (state, action) => {
            // Ensure learningStats exists
            ensureLearningStats(state);

            const { daily, weekly, monthly } = action.payload;
            if (daily) state.learningStats.studyHours.daily += daily;
            if (weekly) state.learningStats.studyHours.weekly += weekly;
            if (monthly) state.learningStats.studyHours.monthly += monthly;

            // Cập nhật total
            state.learningStats.studyHours.total =
                state.learningStats.studyHours.daily +
                state.learningStats.studyHours.weekly +
                state.learningStats.studyHours.monthly;
        },

        // === END ACTIONS MỚI ===

        // Action để reset progress
        resetProgress: (state) => {
            return { ...initialState };
        },
        // Action để clear error
        clearError: (state) => {
            state.error = null;
        },
        // === SESSION MANAGEMENT ACTIONS ===
        startLearningSession: (state, action) => {

            const { slideData, startTime = Date.now() } = action.payload;
            // state.currentSlide.startTime = 5;
            state.isLoading = false;
            state.error = null;

            // Update learning stats
            ensureLearningStats(state);
            if (slideData?.slides) {
                state.learningStats.totalSlides = slideData.slides.length;
            }

            // Update last study date and streak
            const today = new Date().toDateString();
            const lastStudy = state.learningStats.lastStudyDate
                ? new Date(state.learningStats.lastStudyDate).toDateString()
                : null;

            if (lastStudy !== today) {
                state.learningStats.lastStudyDate = startTime;

                if (lastStudy) {
                    const daysDiff = Math.floor((startTime - new Date(state.learningStats.lastStudyDate)) / (1000 * 60 * 60 * 24));
                    if (daysDiff === 1) {
                        state.learningStats.streakDays += 1;
                    } else if (daysDiff > 1) {
                        state.learningStats.streakDays = 1;
                    }
                } else {
                    state.learningStats.streakDays = 1;
                }
            }
        },
        endLearningSession: (state, action) => {
            const { endTime = Date.now() } = action.payload;

            if (state.currentSlide.startTime) {
                const sessionTime = endTime - state.currentSlide.startTime;
                state.timeSpent += sessionTime;

                // Update study hours
                ensureLearningStats(state);
                const hoursSpent = sessionTime / (1000 * 60 * 60);
                state.learningStats.studyHours.daily += hoursSpent;
                state.learningStats.studyHours.weekly += hoursSpent;
                state.learningStats.studyHours.monthly += hoursSpent;
                state.learningStats.studyHours.total += hoursSpent;

                state.currentSlide.endTime = endTime;
            }
        },

        // === SLIDE NAVIGATION ===
        navigateToSlide: (state, action) => {
            const { slideIndex, slideData, timestamp = Date.now() } = action.payload;

            // Save time spent on current slide
            if (state.currentSlide.startTime && state.currentSlideIndex !== slideIndex) {
                const timeSpent = timestamp - state.currentSlide.startTime;
                const slideId = state.currentSlide.id || state.currentSlideIndex;

                if (!state.slideHistory[slideId]) {
                    state.slideHistory[slideId] = {
                        attempts: [],
                        scores: [],
                        timeSpent: 0,
                        isCompleted: false
                    };
                }
                state.slideHistory[slideId].timeSpent += timeSpent;
            }

            // Update current slide
            state.currentSlideIndex = slideIndex;
            state.currentSlide.startTime = timestamp;

            if (slideData) {
                Object.assign(state.currentSlide, slideData);
            }

            // Update overall progress
            const completedCount = state.completedSlides.length;
            const totalSlides = state.learningStats.totalSlides || 1;
            state.overallProgress = Math.round((completedCount / totalSlides) * 100);
        },
        markSlideCompleted: (state, action) => {
            const { slideIndex, slideId, score = 0, completedAt = Date.now() } = action.payload;

            // Add to completed slides if not already there
            if (!state.completedSlides.includes(slideIndex)) {
                state.completedSlides.push(slideIndex);
            }

            // Update slide history
            const id = slideId || slideIndex;
            if (!state.slideHistory[id]) {
                state.slideHistory[id] = {
                    attempts: [],
                    scores: [],
                    timeSpent: 0,
                    isCompleted: false
                };
            }

            state.slideHistory[id].isCompleted = true;
            state.slideHistory[id].scores.push(score);
            state.slideHistory[id].attempts.push({
                completedAt,
                score,
                timeSpent: state.currentSlide.startTime ? completedAt - state.currentSlide.startTime : 0
            });

            // Update learning stats
            ensureLearningStats(state);
            if (score > state.learningStats.bestScore) {
                state.learningStats.bestScore = score;
            }

            // Calculate average score
            const allScores = Object.values(state.slideHistory)
                .flatMap(history => history.scores)
                .filter(score => score > 0);

            if (allScores.length > 0) {
                state.learningStats.averageScore = Math.round(
                    allScores.reduce((sum, score) => sum + score, 0) / allScores.length
                );
            }

            // Update overall progress
            const totalSlides = state.learningStats.totalSlides || 1;
            state.overallProgress = Math.round((state.completedSlides.length / totalSlides) * 100);

            // Check for achievements
            if (state.completedSlides.length === 1) {
                const achievement = {
                    id: 'first_slide',
                    title: 'Slide Đầu Tiên! 🎯',
                    description: 'Hoàn thành slide đầu tiên của bạn',
                    earnedAt: completedAt,
                    type: 'milestone'
                };
                if (!state.achievements.find(a => a.id === achievement.id)) {
                    state.achievements.push(achievement);
                }
            }

            if (state.overallProgress >= 50 && !state.achievements.find(a => a.id === 'halfway_hero')) {
                state.achievements.push({
                    id: 'halfway_hero',
                    title: 'Anh Hùng Nửa Đường! ⭐',
                    description: 'Hoàn thành 50% bài học',
                    earnedAt: completedAt,
                    type: 'progress'
                });
            }

            if (state.overallProgress === 100) {
                state.achievements.push({
                    id: 'lesson_master',
                    title: 'Bậc Thầy Bài Học! 🏆',
                    description: 'Hoàn thành 100% bài học',
                    earnedAt: completedAt,
                    type: 'completion'
                });
            }
        },

        // === EXERCISE & QUIZ RESULTS ===
        saveExerciseResult: (state, action) => {
            const { exerciseId, slideId, answers, score, totalQuestions, completedAt = Date.now() } = action.payload;

            // Add to completed exercises
            if (!state.completedExercises.includes(exerciseId)) {
                state.completedExercises.push(exerciseId);
            }

            // Update slide history with exercise result
            const id = slideId || exerciseId;
            if (!state.slideHistory[id]) {
                state.slideHistory[id] = {
                    attempts: [],
                    scores: [],
                    timeSpent: 0,
                    isCompleted: false,
                    type: 'exercise'
                };
            }

            state.slideHistory[id].scores.push(score);
            state.slideHistory[id].attempts.push({
                type: 'exercise',
                answers,
                score,
                totalQuestions,
                completedAt,
                timeSpent: state.currentSlide.startTime ? completedAt - state.currentSlide.startTime : 0
            });

            // Update learning stats
            ensureLearningStats(state);
            state.learningStats.totalExercises += 1;

            if (score > state.learningStats.bestScore) {
                state.learningStats.bestScore = score;
            }

            // Perfect exercise achievement
            if (score === 100 && !state.achievements.find(a => a.id === 'perfect_exercise')) {
                state.achievements.push({
                    id: 'perfect_exercise',
                    title: 'Bài Tập Hoàn Hảo! 💯',
                    description: 'Đạt 100 điểm trong bài tập',
                    earnedAt: completedAt,
                    type: 'achievement'
                });
            }
        },
        saveQuizResult: (state, action) => {
            const { quizId, slideId, answers, score, totalQuestions, completedAt = Date.now() } = action.payload;

            // Add to completed quizzes
            if (!state.completedQuizzes.includes(quizId)) {
                state.completedQuizzes.push(quizId);
            }

            // Update slide history with quiz result
            const id = slideId || quizId;
            if (!state.slideHistory[id]) {
                state.slideHistory[id] = {
                    attempts: [],
                    scores: [],
                    timeSpent: 0,
                    isCompleted: false,
                    type: 'quiz'
                };
            }

            state.slideHistory[id].scores.push(score);
            state.slideHistory[id].attempts.push({
                type: 'quiz',
                answers,
                score,
                totalQuestions,
                completedAt,
                timeSpent: state.currentSlide.startTime ? completedAt - state.currentSlide.startTime : 0
            });

            // Update learning stats
            ensureLearningStats(state);
            state.learningStats.totalQuizzes += 1;

            if (score > state.learningStats.bestScore) {
                state.learningStats.bestScore = score;
            }

            // Quiz master achievement
            if (score === 100 && !state.achievements.find(a => a.id === 'quiz_master')) {
                state.achievements.push({
                    id: 'quiz_master',
                    title: 'Bậc Thầy Quiz! 🧠',
                    description: 'Đạt 100 điểm trong quiz',
                    earnedAt: completedAt,
                    type: 'achievement'
                });
            }
        },
        // === GOALS & ACHIEVEMENTS ===
        addCustomAchievement: (state, action) => {
            const achievement = action.payload;
            if (!state.achievements.find(a => a.id === achievement.id)) {
                state.achievements.push({
                    ...achievement,
                    earnedAt: achievement.earnedAt || Date.now()
                });
            }
        },
        updateDailyGoals: (state, action) => {
            const { goals } = action.payload;
            if (!state.currentGoals.find(g => g.type === 'daily')) {
                state.currentGoals.push({
                    type: 'daily',
                    goals,
                    createdAt: Date.now()
                });
            } else {
                const dailyGoal = state.currentGoals.find(g => g.type === 'daily');
                dailyGoal.goals = goals;
            }
        },

        // === UTILITY ACTIONS ===
        resetCurrentSession: (state) => {
            state.currentSlide = {
                ...initialState.currentSlide,
                startTime: Date.now()
            };
            state.currentSlideIndex = 0;
            state.error = null;
        }, resetAllProgress: (state) => {
            Object.assign(state, initialState);
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setSlideId: (state, action) => {
            state.slideId = action.payload;
        },
        setSlideAndUser: (state, action) => {
            const { slideId, userId } = action.payload;
            state.slideId = slideId;
            state.userId = userId;
        },
        // ✅ SESSION MANAGEMENT ACTIONS (THÊM MỚI)
        startSession: (state, action) => {
            const { sessionType = 'learning', userId = null, slideId = null } = action.payload || {};

            state.currentSession.isActive = true;
            state.currentSession.startTime = Date.now();
            state.currentSession.sessionId = `session_${Date.now()}`;
            state.currentSession.slidesViewed = [];
            state.currentSession.sessionTimeSpent = 0;
            state.currentSession.sessionScore = 0;
            state.currentSession.sessionType = sessionType;
            state.currentSession.pausedTime = 0;
            state.currentSession.resumeCount = 0;

            // Update learning stats
            ensureLearningStats(state);
            state.learningStats.totalSessions += 1;

            if (userId) {
                state.userId = userId;
            }
            if (slideId) {
                state.slideId = slideId;
            }
        },

        endSession: (state) => {
            if (state.currentSession.isActive) {
                const sessionDuration = Date.now() - state.currentSession.startTime - state.currentSession.pausedTime;

                // Update stats
                ensureLearningStats(state);
                state.learningStats.totalTimeSpent += sessionDuration;
                state.timeSpent += sessionDuration;

                // Reset session
                state.currentSession.isActive = false;
                state.currentSession.endTime = Date.now();
            }
        },

        pauseSession: (state) => {
            if (state.currentSession.isActive) {
                state.currentSession.pausedTime += Date.now() - state.currentSession.startTime;
            }
        },

        resumeSession: (state) => {
            if (state.currentSession.isActive) {
                state.currentSession.startTime = Date.now();
                state.currentSession.resumeCount += 1;
            }
        },

        // ✅ LEARNING STATS ACTIONS (THÊM MỚI)
        incrementStudyStreak: (state) => {
            ensureLearningStats(state);
            state.learningStats.studyStreak += 1;
            state.goalProgress.currentStreak = state.learningStats.studyStreak;
        },

        updateTotalTimeSpent: (state, action) => {
            const timeToAdd = action.payload;
            ensureLearningStats(state);
            state.learningStats.totalTimeSpent += timeToAdd;
            state.timeSpent += timeToAdd;

            // Update goal progress
            state.goalProgress.todayTime += timeToAdd;
            state.goalProgress.weekTime += timeToAdd;
        },

        incrementCompletedLessons: (state) => {
            ensureLearningStats(state);
            state.learningStats.completedLessons += 1;
            state.goalProgress.todayLessons += 1;
            state.goalProgress.weekLessons += 1;
        },

        // ✅ ACHIEVEMENT ACTIONS (THÊM MỚI)
        unlockAchievement: (state, action) => {
            const achievement = action.payload;
            const existingAchievement = state.achievements.find(a => a.id === achievement.id);

            if (!existingAchievement) {
                state.achievements.push({
                    ...achievement,
                    unlockedAt: Date.now(),
                    isNew: true
                });
            }
        },

        markAchievementAsViewed: (state, action) => {
            const achievementId = action.payload;
            const achievement = state.achievements.find(a => a.id === achievementId);
            if (achievement) {
                achievement.isNew = false;
            }
        },

        // ✅ GOAL ACTIONS (THÊM MỚI)
        setDailyGoals: (state, action) => {
            const goals = action.payload;
            state.goals = { ...state.goals, ...goals };
        },

        updateGoalProgress: (state, action) => {
            const updates = action.payload;
            state.goalProgress = { ...state.goalProgress, ...updates };
        },

        resetDailyProgress: (state) => {
            state.goalProgress.todayTime = 0;
            state.goalProgress.todayLessons = 0;
            state.goalProgress.todayQuizzes = 0;
            state.goalProgress.lastGoalCheck = Date.now();
        },

        resetWeeklyProgress: (state) => {
            state.goalProgress.weekTime = 0;
            state.goalProgress.weekLessons = 0;
            state.goalProgress.weekQuizzes = 0;
        },

        resetMonthlyProgress: (state) => {
            state.goalProgress.monthPoints = 0;
        },

        // ✅ PROGRESS UPDATE ACTIONS (THÊM MỚI)
        updateOverallProgress: (state, action) => {
            const newProgress = action.payload;
            state.overallProgress = Math.max(0, Math.min(100, newProgress));
        },

        setLoadingState: (state, action) => {
            state.isLoading = action.payload;
        },

        setErrorState: (state, action) => {
            state.error = action.payload;
        },

        setSavingState: (state, action) => {
            state.isSaving = action.payload;
        },

        // ...existing code...
    },

    extraReducers: (builder) => {
        builder
            // Save progress to DB
            .addCase(saveProgressToDB.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(saveProgressToDB.fulfilled, (state, action) => {
                state.isSaving = false;
                // Có thể cập nhật state với response từ server nếu cần
            })
            .addCase(saveProgressToDB.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload;
            })

            // Load progress from DB
            .addCase(loadProgressFromDB.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadProgressFromDB.fulfilled, (state, action) => {
                state.isLoading = false;
                const progressData = action.payload;
                console.log(progressData);
                // Update state với data từ database
                state.slideId = progressData.slideId;
                state.userId = progressData.userId;
                state.overallProgress = progressData.overallProgress;
                state.currentSlideIndex = progressData.currentSlideIndex;
                state.completedSlides = progressData.completedSlides || [];
                state.completedExercises = progressData.completedExercises || [];
                state.completedQuizzes = progressData.completedQuizzes || [];
                state.timeSpent = progressData.timeSpent || 0;
                state.reduxState = progressData.reduxState;
            })
            .addCase(loadProgressFromDB.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const {
    setProgress,
    updateProgressDetails,
    addCompletedSlide,
    addCompletedExercise,
    addCompletedQuiz,
    updateTimeSpent,

    // Slide detail actions
    setCurrentSlide,
    updateCurrentSlide,
    startSlide,
    finishSlide,
    addSlideNotes,
    addSlideTags,

    // Learning stats actions
    updateLearningStats,
    updateStudyStreak,
    updateStudyHours,

    // Achievement actions
    addAchievement,
    unlockBadge,

    // Goal actions
    setGoals,
    updateGoalProgress,

    // Utility actions
    resetProgress,
    clearError,

    // Session management actions
    startLearningSession,
    endLearningSession,

    // Slide navigation actions
    navigateToSlide,
    markSlideCompleted,

    // Exercise & quiz result actions
    saveExerciseResult,
    saveQuizResult,

    // Custom achievement actions
    addCustomAchievement,
    updateDailyGoals,

    // Utility actions
    resetCurrentSession,
    resetAllProgress,

    // ✅ NEW SESSION ACTIONS
    startSession,
    endSession,
    pauseSession,
    resumeSession,

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
    setSavingState,

    setUserId,
    setSlideId,
    setSlideAndUser,
} = progressSlice.actions;

export default progressSlice.reducer;