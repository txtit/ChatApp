// // Helper functions for progress management
// import {
//     updateProgressDetails,
//     saveProgressToDB,
//     addCompletedSlide,
//     addCompletedExercise,
//     addCompletedQuiz,
//     updateTimeSpent,
//     setCurrentSlide,
//     updateCurrentSlide,
//     startSlide,
//     finishSlide,
//     addSlideNotes,
//     addSlideTags,
//     updateLearningStats,
//     updateStudyStreak,
//     updateStudyHours,
//     addAchievement,
//     unlockBadge,
//     setGoals,
//     updateGoalProgress
// } from '../redux/slices/progress';
// import {
//     // updateProgressDetails,
//     saveProgressToDB,
//     addCompletedSlide,
//     addCompletedExercise,
//     addCompletedQuiz,
//     updateTimeSpent
// } from '../redux/slices/progress';

// /**
//  * Lưu progress vào Redux và sau đó gọi API để lưu vào DB
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {Object} progressData - Dữ liệu progress cần lưu
//  */
// export const saveProgressToReduxAndDB = async (dispatch, progressData) => {
//     try {
//         // 1. Cập nhật Redux state trước
//         dispatch(updateProgressDetails(progressData));

//         // 2. Tạo payload để gửi lên API
//         const apiPayload = {
//             slideId: progressData.slideId,
//             userId: progressData.userId,
//             overallProgress: progressData.overallProgress,
//             currentSlideIndex: progressData.currentSlideIndex,
//             completedSlides: progressData.completedSlides,
//             completedExercises: progressData.completedExercises,
//             completedQuizzes: progressData.completedQuizzes,
//             timeSpent: progressData.timeSpent,
//             reduxState: progressData.reduxState,
//             timestamp: new Date().toISOString()
//         };

//         // 3. Gọi API để lưu vào database
//         const result = await dispatch(saveProgressToDB(apiPayload));

//         if (saveProgressToDB.fulfilled.match(result)) {
//             console.log('Progress saved successfully:', result.payload);
//             return { success: true, data: result.payload };
//         } else {
//             console.error('Failed to save progress:', result.payload);
//             return { success: false, error: result.payload };
//         }
//     } catch (error) {
//         console.error('Error saving progress:', error);
//         return { success: false, error: error.message };
//     }
// };

// /**
//  * Helper để cập nhật progress khi hoàn thành slide
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {string} slideId - ID của slide đã hoàn thành
//  * @param {Object} currentState - State hiện tại của progress
//  */
// export const markSlideCompleted = async (dispatch, slideId, currentState) => {
//     dispatch(addCompletedSlide(slideId));

//     // Tính toán overall progress mới
//     const totalSlides = currentState.totalSlides || 10; // Giả sử có 10 slide
//     const completedCount = (currentState.completedSlides || []).length + 1;
//     const newOverallProgress = Math.round((completedCount / totalSlides) * 100);

//     const updatedProgress = {
//         ...currentState,
//         completedSlides: [...(currentState.completedSlides || []), slideId],
//         overallProgress: newOverallProgress,
//         reduxState: currentState
//     };

//     return await saveProgressToReduxAndDB(dispatch, updatedProgress);
// };

// /**
//  * Helper để cập nhật progress khi hoàn thành exercise
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {string} exerciseId - ID của exercise đã hoàn thành
//  * @param {Object} currentState - State hiện tại của progress
//  */
// export const markExerciseCompleted = async (dispatch, exerciseId, currentState) => {
//     dispatch(addCompletedExercise(exerciseId));

//     const updatedProgress = {
//         ...currentState,
//         completedExercises: [...(currentState.completedExercises || []), exerciseId],
//         reduxState: currentState
//     };

//     return await saveProgressToReduxAndDB(dispatch, updatedProgress);
// };

// /**
//  * Helper để cập nhật progress khi hoàn thành quiz
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {string} quizId - ID của quiz đã hoàn thành
//  * @param {Object} currentState - State hiện tại của progress
//  */
// export const markQuizCompleted = async (dispatch, quizId, currentState) => {
//     dispatch(addCompletedQuiz(quizId));

//     const updatedProgress = {
//         ...currentState,
//         completedQuizzes: [...(currentState.completedQuizzes || []), quizId],
//         reduxState: currentState
//     };

//     return await saveProgressToReduxAndDB(dispatch, updatedProgress);
// };

// /**
//  * Helper để cập nhật thời gian học
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {number} timeInSeconds - Thời gian học thêm (giây)
//  * @param {Object} currentState - State hiện tại của progress
//  */
// export const updateStudyTime = async (dispatch, timeInSeconds, currentState) => {
//     dispatch(updateTimeSpent(timeInSeconds));

//     const updatedProgress = {
//         ...currentState,
//         timeSpent: (currentState.timeSpent || 0) + timeInSeconds,
//         reduxState: currentState
//     };

//     return await saveProgressToReduxAndDB(dispatch, updatedProgress);
// };

// /**
//  * Helper để tự động lưu progress định kỳ
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {Object} currentState - State hiện tại của progress
//  * @param {number} intervalMs - Khoảng thời gian tự động lưu (milliseconds)
//  */
// export const setupAutoSave = (dispatch, getCurrentState, intervalMs = 30000) => {
//     return setInterval(async () => {
//         const currentState = getCurrentState();
//         if (currentState.slideId && currentState.userId) {
//             await saveProgressToReduxAndDB(dispatch, {
//                 ...currentState,
//                 reduxState: currentState
//             });
//         }
//     }, intervalMs);
// };

// /**
//  * Helper để dừng auto save
//  * @param {number} intervalId - ID của interval cần dừng
//  */
// export const stopAutoSave = (intervalId) => {
//     if (intervalId) {
//         clearInterval(intervalId);
//     }
// };

// // === HELPER FUNCTIONS MỚI CHO SLIDE DETAILS ===

// /**
//  * Helper để bắt đầu một slide mới
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {Object} slideData - Thông tin slide
//  */
// export const startNewSlide = async (dispatch, slideData) => {
//     try {
//         // Set slide hiện tại
//         dispatch(setCurrentSlide(slideData));

//         // Bắt đầu slide
//         dispatch(startSlide({ slideId: slideData.id }));

//         // Cập nhật study streak
//         dispatch(updateStudyStreak());

//         return { success: true, message: 'Slide started successfully' };
//     } catch (error) {
//         console.error('Error starting slide:', error);
//         return { success: false, error: error.message };
//     }
// };

// /**
//  * Helper để hoàn thành slide với điểm số và feedback
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {Object} completionData - Dữ liệu hoàn thành
//  */
// export const completeSlideWithDetails = async (dispatch, completionData) => {
//     try {
//         const { slideId, score, maxScore, feedback, notes, timeSpent } = completionData;

//         // Hoàn thành slide
//         dispatch(finishSlide({
//             score,
//             maxScore,
//             feedback,
//             notes
//         }));

//         // Thêm vào completed slides
//         dispatch(addCompletedSlide(slideId));

//         // Cập nhật thời gian học
//         if (timeSpent) {
//             dispatch(updateTimeSpent(timeSpent));
//             dispatch(updateStudyHours({ daily: timeSpent / 60 }));
//         }

//         // Cập nhật learning stats
//         dispatch(updateLearningStats({
//             totalSlides: 1,
//             averageScore: score,
//             bestScore: score
//         }));

//         // Kiểm tra achievements
//         await checkAndUnlockAchievements(dispatch, { score, maxScore, slideId });

//         return { success: true, message: 'Slide completed successfully' };
//     } catch (error) {
//         console.error('Error completing slide:', error);
//         return { success: false, error: error.message };
//     }
// };

// /**
//  * Helper để thêm notes cho slide
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {string} slideId - ID của slide
//  * @param {string} notes - Ghi chú
//  */
// export const addNotesToSlide = (dispatch, slideId, notes) => {
//     dispatch(addSlideNotes({ slideId, notes }));
//     return { success: true, message: 'Notes added successfully' };
// };

// /**
//  * Helper để thêm tags cho slide
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {string} slideId - ID của slide
//  * @param {Array} tags - Danh sách tags
//  */
// export const addTagsToSlide = (dispatch, slideId, tags) => {
//     dispatch(addSlideTags({ slideId, tags }));
//     return { success: true, message: 'Tags added successfully' };
// };

// /**
//  * Helper để cập nhật thông tin slide đang học
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {Object} updates - Thông tin cần cập nhật
//  */
// export const updateSlideProgress = (dispatch, updates) => {
//     dispatch(updateCurrentSlide(updates));
//     return { success: true, message: 'Slide updated successfully' };
// };

// // === HELPER FUNCTIONS CHO ACHIEVEMENTS VÀ GOALS ===

// /**
//  * Helper để kiểm tra và unlock achievements
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {Object} context - Context để kiểm tra achievements
//  */
// export const checkAndUnlockAchievements = async (dispatch, context) => {
//     const { score, maxScore, slideId, currentState } = context;

//     // Achievement: Perfect Score
//     if (score === maxScore && maxScore > 0) {
//         dispatch(addAchievement({
//             id: 'perfect_score_' + Date.now(),
//             title: 'Điểm số hoàn hảo!',
//             description: 'Đạt điểm tối đa trong một bài học',
//             type: 'score',
//             points: 50,
//             icon: '🏆'
//         }));
//     }

//     // Achievement: First Completion
//     if (currentState?.completedSlides?.length === 1) {
//         dispatch(addAchievement({
//             id: 'first_completion',
//             title: 'Bước đầu tiên!',
//             description: 'Hoàn thành slide đầu tiên',
//             type: 'milestone',
//             points: 25,
//             icon: '🎯'
//         }));
//     }

//     // Achievement: Study Streak
//     if (currentState?.learningStats?.streakDays >= 7) {
//         dispatch(addAchievement({
//             id: 'week_streak',
//             title: 'Kiên trì một tuần!',
//             description: 'Học liên tục 7 ngày',
//             type: 'streak',
//             points: 100,
//             icon: '🔥'
//         }));
//     }

//     return { success: true };
// };

// /**
//  * Helper để tạo và set goals
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {Array} goals - Danh sách goals
//  */
// export const createLearningGoals = (dispatch, goals) => {
//     const formattedGoals = goals.map(goal => ({
//         id: goal.id || 'goal_' + Date.now(),
//         title: goal.title,
//         description: goal.description,
//         type: goal.type, // 'daily', 'weekly', 'monthly'
//         targetProgress: goal.targetProgress,
//         currentProgress: 0,
//         isCompleted: false,
//         createdAt: new Date().toISOString(),
//         deadline: goal.deadline,
//         reward: goal.reward
//     }));

//     dispatch(setGoals(formattedGoals));
//     return { success: true, goals: formattedGoals };
// };

// /**
//  * Helper để cập nhật progress của goal
//  * @param {Object} dispatch - Redux dispatch function
//  * @param {string} goalId - ID của goal
//  * @param {number} progress - Progress mới
//  */
// export const updateGoal = (dispatch, goalId, progress) => {
//     dispatch(updateGoalProgress({ goalId, progress }));
//     return { success: true, message: 'Goal updated successfully' };
// };

// // === HELPER FUNCTIONS CHO ANALYTICS ===

// /**
//  * Helper để tính toán analytics từ slide history
//  * @param {Object} slideHistory - Lịch sử slides
//  * @param {Object} learningStats - Stats hiện tại
//  */
// export const calculateLearningAnalytics = (slideHistory, learningStats) => {
//     const analytics = {
//         totalAttempts: 0,
//         totalTimeSpent: 0,
//         averageScore: 0,
//         improvementRate: 0,
//         mostDifficultTopics: [],
//         strongestTopics: [],
//         studyPattern: {},
//         recommendations: []
//     };

//     // Tính toán từ slide history
//     Object.values(slideHistory).forEach(slide => {
//         analytics.totalAttempts += slide.attempts.length;
//         analytics.totalTimeSpent += slide.timeSpent;

//         if (slide.scores.length > 0) {
//             analytics.averageScore += slide.averageScore;
//         }
//     });

//     const slideCount = Object.keys(slideHistory).length;
//     if (slideCount > 0) {
//         analytics.averageScore = analytics.averageScore / slideCount;
//     }

//     // Tính improvement rate
//     const recentSlides = Object.values(slideHistory)
//         .filter(slide => slide.scores.length >= 2)
//         .map(slide => {
//             const scores = slide.scores;
//             return scores[scores.length - 1] - scores[0];
//         });

//     if (recentSlides.length > 0) {
//         analytics.improvementRate = recentSlides.reduce((a, b) => a + b, 0) / recentSlides.length;
//     }

//     // Tạo recommendations
//     if (analytics.averageScore < 60) {
//         analytics.recommendations.push('Nên dành thêm thời gian ôn tập cơ bản');
//     }
//     if (analytics.improvementRate > 20) {
//         analytics.recommendations.push('Tiến bộ tốt! Tiếp tục duy trì');
//     }
//     if (analytics.totalTimeSpent < learningStats.studyHours.daily * 60) {
//         analytics.recommendations.push('Nên tăng thời gian học hàng ngày');
//     }

//     return analytics;
// };

// /**
//  * Helper để export progress data
//  * @param {Object} progressState - Complete progress state
//  */
// export const exportProgressData = (progressState) => {
//     return {
//         exportedAt: new Date().toISOString(),
//         userId: progressState.userId,
//         summary: {
//             totalSlides: progressState.completedSlides.length,
//             totalExercises: progressState.completedExercises.length,
//             totalQuizzes: progressState.completedQuizzes.length,
//             totalTimeSpent: progressState.timeSpent,
//             overallProgress: progressState.overallProgress,
//             averageScore: progressState.learningStats.averageScore,
//             achievements: progressState.achievements.length,
//             currentStreak: progressState.learningStats.streakDays
//         },
//         detailedHistory: progressState.slideHistory,
//         achievements: progressState.achievements,
//         learningStats: progressState.learningStats,
//         currentGoals: progressState.currentGoals
//     };
// };
