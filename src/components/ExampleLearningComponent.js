import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    saveProgressToReduxAndDB,
    markSlideCompleted,
    markExerciseCompleted,
    markQuizCompleted,
    updateStudyTime,
    setupAutoSave,
    stopAutoSave
} from '../../utils/progressHelpers';

const ExampleLearningComponent = () => {
    const dispatch = useDispatch();
    const progressState = useSelector(state => state.progress);
    const autoSaveRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    useEffect(() => {
        // Khởi tạo progress khi component mount
        const initializeProgress = async () => {
            const initialProgressData = {
                slideId: 'slide_001',
                userId: 'user_123',
                overallProgress: 0,
                currentSlideIndex: 0,
                completedSlides: [],
                completedExercises: [],
                completedQuizzes: [],
                timeSpent: 0,
                reduxState: progressState
            };

            await saveProgressToReduxAndDB(dispatch, initialProgressData);
        };

        initializeProgress();

        // Setup auto save mỗi 30 giây
        autoSaveRef.current = setupAutoSave(
            dispatch,
            () => progressState,
            30000 // 30 seconds
        );

        // Cleanup khi component unmount
        return () => {
            // Tính thời gian học và lưu lần cuối
            const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
            updateStudyTime(dispatch, sessionTime, progressState);

            // Dừng auto save
            stopAutoSave(autoSaveRef.current);
        };
    }, [dispatch]);

    // Handler khi hoàn thành slide
    const handleSlideCompleted = async (slideId) => {
        try {
            const result = await markSlideCompleted(dispatch, slideId, progressState);
            if (result.success) {
                console.log('Slide completed and saved successfully');
            } else {
                console.error('Failed to save slide completion:', result.error);
            }
        } catch (error) {
            console.error('Error completing slide:', error);
        }
    };

    // Handler khi hoàn thành exercise
    const handleExerciseCompleted = async (exerciseId) => {
        try {
            const result = await markExerciseCompleted(dispatch, exerciseId, progressState);
            if (result.success) {
                console.log('Exercise completed and saved successfully');
            }
        } catch (error) {
            console.error('Error completing exercise:', error);
        }
    };

    // Handler khi hoàn thành quiz
    const handleQuizCompleted = async (quizId) => {
        try {
            const result = await markQuizCompleted(dispatch, quizId, progressState);
            if (result.success) {
                console.log('Quiz completed and saved successfully');
            }
        } catch (error) {
            console.error('Error completing quiz:', error);
        }
    };

    // Handler để lưu progress thủ công
    const handleManualSave = async () => {
        const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

        const progressData = {
            slideId: progressState.slideId,
            userId: progressState.userId,
            overallProgress: progressState.overallProgress,
            currentSlideIndex: progressState.currentSlideIndex,
            completedSlides: progressState.completedSlides,
            completedExercises: progressState.completedExercises,
            completedQuizzes: progressState.completedQuizzes,
            timeSpent: progressState.timeSpent + currentTime,
            reduxState: progressState
        };

        try {
            const result = await saveProgressToReduxAndDB(dispatch, progressData);
            if (result.success) {
                alert('Progress saved successfully!');
            } else {
                alert('Failed to save progress: ' + result.error);
            }
        } catch (error) {
            alert('Error saving progress: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Learning Progress Example</h2>

            <div>
                <p>Current Progress: {progressState.overallProgress}%</p>
                <p>Current Slide: {progressState.currentSlideIndex}</p>
                <p>Completed Slides: {progressState.completedSlides?.length || 0}</p>
                <p>Completed Exercises: {progressState.completedExercises?.length || 0}</p>
                <p>Completed Quizzes: {progressState.completedQuizzes?.length || 0}</p>
                <p>Time Spent: {progressState.timeSpent} seconds</p>
                <p>Saving Status: {progressState.isSaving ? 'Saving...' : 'Saved'}</p>
            </div>

            <div>
                <button onClick={() => handleSlideCompleted('slide_001')}>
                    Complete Slide 1
                </button>
                <button onClick={() => handleExerciseCompleted('exercise_001')}>
                    Complete Exercise 1
                </button>
                <button onClick={() => handleQuizCompleted('quiz_001')}>
                    Complete Quiz 1
                </button>
                <button onClick={handleManualSave}>
                    Save Progress Manually
                </button>
            </div>

            {progressState.error && (
                <div style={{ color: 'red' }}>
                    Error: {progressState.error}
                </div>
            )}
        </div>
    );
};

export default ExampleLearningComponent;
