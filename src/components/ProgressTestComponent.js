import React from 'react';
import { Box, Button, Typography, Paper, LinearProgress } from '@mui/material';
import { useProgressV2 } from '../hooks/useProgressV2';
import { useSelector } from 'react-redux';

const ProgressTestComponent = () => {
    const {
        currentSlide,
        isLessonCompleted,
        getLessonProgress,
        getLessonScore,
        getLessonProgressPercentage,
        initLesson,
        setSlide,
        updateTotal,
        markComplete,
        addAttempt
    } = useProgressV2();

    const lessonProgress = useSelector(state => state.slide.lessonProgress);
    const allLessonsData = useSelector(state => state.slide.lessons); const handleInitLesson = () => {
        initLesson({
            totalSlides: 5,
            lessonId: 'test-lesson-123',
            lessonTitle: 'Test Lesson'
        });
    };

    const handleSetSlide = (slideId) => {
        setSlide({
            id: slideId,
            title: `Slide ${slideId}`,
            content: `Content for slide ${slideId}`,
            type: 'content'
        });
    };

    const handleCompleteSlide = (score = 100) => {
        if (currentSlide.id) {
            markComplete(score);
        }
    };

    const testLessons = ['test-lesson-123', 'test-lesson-456', 'test-lesson-789'];
    const testSlides = ['slide-1', 'slide-2', 'slide-3', 'slide-4', 'slide-5'];

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Progress V2 Test Component
            </Typography>

            {/* Lesson Progress */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Lesson Progress
                </Typography>
                <Typography variant="body2">
                    Progress: {lessonProgress.percentage}%
                    ({lessonProgress.completedSlides}/{lessonProgress.totalSlides})
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={lessonProgress.percentage}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Lesson: {lessonProgress.lessonTitle || 'Not initialized'}
                </Typography>
            </Paper>

            {/* Current Slide */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Current Slide
                </Typography>
                <Typography variant="body2">
                    ID: {currentSlide.id || 'None'}
                </Typography>
                <Typography variant="body2">
                    Title: {currentSlide.title || 'None'}
                </Typography>
                <Typography variant="body2">
                    Completed: {currentSlide.isCompleted ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                    Score: {currentSlide.score}
                </Typography>
                <Typography variant="body2">
                    Attempts: {currentSlide.attempts}
                </Typography>
            </Paper>

            {/* Controls */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Controls
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Button variant="contained" onClick={handleInitLesson}>
                        Initialize Lesson
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleCompleteSlide(85)}
                        disabled={!currentSlide.id}
                    >
                        Complete Current Slide (85%)
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={addAttempt}
                        disabled={!currentSlide.id}
                    >
                        Add Attempt
                    </Button>
                </Box>

                {/* Slide Navigation */}
                <Typography variant="subtitle1" gutterBottom>
                    Navigate to Slide:
                </Typography>                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {testSlides.map(slideId => (
                        <Button
                            key={slideId}
                            variant={currentSlide.id === slideId ? "contained" : "outlined"}
                            size="small"
                            onClick={() => handleSetSlide(slideId)}
                        >
                            {slideId}
                        </Button>
                    ))}
                </Box>
            </Paper>

            {/* All Lessons Progress */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    All Lessons Progress
                </Typography>
                {Object.entries(allLessonsData).map(([lessonId, lessonData]) => (
                    <Box key={lessonId} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                            <strong>{lessonData.title || lessonId}</strong>:
                            {lessonData.isCompleted && ' ✓ Completed'}
                            {lessonData.percentage && ` (${lessonData.percentage}%)`}
                            {lessonData.score && ` (Score: ${lessonData.score})`}
                            {lessonData.completedSlides && ` (${lessonData.completedSlides}/${lessonData.totalSlides} slides)`}
                        </Typography>
                    </Box>
                ))}
                {Object.keys(allLessonsData).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                        No lessons started yet
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default ProgressTestComponent;
