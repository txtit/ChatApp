import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, Card, CardContent, Grid, Alert } from '@mui/material';
import {
    updateProgressDetails,
    setCurrentSlide,
    addCompletedSlide,
    addCompletedExercise,
    addCompletedQuiz,
    updateLearningStats,
    addAchievement,
    unlockBadge,
    setGoals
} from '../redux/slices/progress';

const ProgressTester = () => {
    const dispatch = useDispatch();
    const progressState = useSelector(state => state.progress);

    const populateFullProgressData = () => {
        console.log('Populating full progress data...');

        // 1. Update basic progress details
        dispatch(updateProgressDetails({
            slideId: 'slide_demo_001',
            userId: 'user_123',
            overallProgress: 75,
            currentSlideIndex: 5,
            completedSlides: ['slide_001', 'slide_002', 'slide_003', 'slide_004', 'slide_005'],
            completedExercises: ['ex_001', 'ex_002', 'ex_003'],
            completedQuizzes: ['quiz_001', 'quiz_002'],
            timeSpent: 3600 // 1 hour in seconds
        }));

        // 2. Set current slide details
        dispatch(setCurrentSlide({
            id: 'slide_demo_001',
            title: 'Toán học cơ bản',
            content: 'Bài học về phép cộng trừ',
            type: 'lesson',
            difficulty: 'easy',
            subject: 'math',
            duration: 30,
            points: 100,
            startTime: new Date().toISOString(),
            attempts: 2,
            score: 85,
            maxScore: 100,
            isCompleted: true,
            tags: ['math', 'basic', 'arithmetic'],
            prerequisites: ['slide_000'],
            resources: ['video_001', 'exercise_001']
        }));

        // 3. Add some completed items
        dispatch(addCompletedSlide('slide_006'));
        dispatch(addCompletedExercise('ex_004'));
        dispatch(addCompletedQuiz('quiz_003'));

        // 4. Update learning statistics
        dispatch(updateLearningStats({
            totalSlides: 20,
            totalLessons: 8,
            totalExercises: 15,
            totalQuizzes: 5,
            totalGames: 3,
            averageScore: 78,
            bestScore: 95,
            streakDays: 7,
            lastStudyDate: new Date().toISOString(),
            favoriteSubjects: ['math', 'science'],
            weakSubjects: ['english'],
            studyHours: {
                daily: 2,
                weekly: 10,
                monthly: 40,
                total: 120
            }
        }));

        // 5. Add achievements
        dispatch(addAchievement({
            id: 'achievement_001',
            title: 'First Steps',
            description: 'Hoàn thành bài học đầu tiên',
            type: 'milestone',
            icon: '🎯',
            points: 50
        }));

        dispatch(addAchievement({
            id: 'achievement_002',
            title: 'Math Master',
            description: 'Hoàn thành 5 bài toán liên tiếp',
            type: 'skill',
            icon: '🧮',
            points: 100
        }));

        dispatch(addAchievement({
            id: 'achievement_003',
            title: 'Weekly Warrior',
            description: 'Học 7 ngày liên tiếp',
            type: 'streak',
            icon: '🔥',
            points: 150
        }));

        // 6. Unlock badges
        dispatch(unlockBadge({
            id: 'badge_001',
            name: 'Beginner',
            description: 'Bắt đầu hành trình học tập',
            icon: '🌟',
            category: 'progress'
        }));

        dispatch(unlockBadge({
            id: 'badge_002',
            name: 'Quick Learner',
            description: 'Hoàn thành bài học nhanh chóng',
            icon: '⚡',
            category: 'speed'
        }));

        dispatch(unlockBadge({
            id: 'badge_003',
            name: 'Perfect Score',
            description: 'Đạt điểm tuyệt đối',
            icon: '💯',
            category: 'accuracy'
        }));

        // 7. Set learning goals
        dispatch(setGoals([
            {
                id: 'goal_001',
                title: 'Complete 10 Lessons',
                description: 'Hoàn thành 10 bài học trong tháng',
                targetProgress: 10,
                currentProgress: 6,
                deadline: '2024-12-31',
                category: 'learning',
                isCompleted: false
            },
            {
                id: 'goal_002',
                title: 'Daily Study Streak',
                description: 'Học 30 ngày liên tiếp',
                targetProgress: 30,
                currentProgress: 7,
                deadline: '2024-12-31',
                category: 'habit',
                isCompleted: false
            },
            {
                id: 'goal_003',
                title: 'Math Excellence',
                description: 'Đạt điểm trung bình trên 80% cho môn toán',
                targetProgress: 80,
                currentProgress: 78,
                deadline: '2024-12-31',
                category: 'performance',
                isCompleted: false
            }
        ]));

        console.log('Full progress data populated!');
    };

    const clearProgressData = () => {
        dispatch({ type: 'progress/resetProgress' });
        console.log('Progress data cleared!');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                🧪 Progress Data Tester
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
                Sử dụng các button dưới đây để test và populate Redux progress data
            </Alert>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={populateFullProgressData}
                    >
                        🚀 Populate Full Data
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={clearProgressData}
                    >
                        🗑️ Clear Data
                    </Button>
                </Grid>
            </Grid>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Current Redux Progress Keys:
                    </Typography>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                        <pre style={{ fontSize: '12px', margin: 0 }}>
                            {JSON.stringify(Object.keys(progressState), null, 2)}
                        </pre>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Progress Object (Simple):
                    </Typography>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                        <pre style={{ fontSize: '12px', margin: 0 }}>
                            {JSON.stringify(progressState.progress, null, 2)}
                        </pre>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Basic Progress Info:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2">User ID: {progressState.userId || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Slide ID: {progressState.slideId || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Overall Progress: {progressState.overallProgress || 0}%</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Current Slide: {progressState.currentSlideIndex || 0}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Completed Slides: {progressState.completedSlides?.length || 0}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Time Spent: {Math.floor((progressState.timeSpent || 0) / 60)}m</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProgressTester;
