import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, LinearProgress, Chip, Alert } from '@mui/material';
import { School, Assignment, Quiz, Timer, Save, Refresh } from '@mui/icons-material';
import useProgress from '../hooks/useProgress';

const ProgressDemo = () => {
    const [currentUserId] = useState('user_123');
    const [currentSlideId] = useState('slide_math_001');

    const {
        progressState,
        metrics,
        saveProgress,
        completeSlide,
        completeExercise,
        completeQuiz,
        addStudyTime,
        updateCurrentSlide,
        updateOverallProgress,
        reset,
        clearProgressError,
        isLoading,
        isSaving,
        error
    } = useProgress(currentUserId, currentSlideId, {
        autoSave: true,
        autoSaveInterval: 10000, // 10 seconds for demo
        trackTime: true
    });

    const handleManualSave = async () => {
        const result = await saveProgress();
        if (result.success) {
            alert('Progress saved successfully!');
        } else {
            alert('Failed to save: ' + result.error);
        }
    };

    const handleCompleteSlide = async () => {
        const result = await completeSlide(`slide_${Date.now()}`);
        if (result.success) {
            alert('Slide completed!');
        }
    };

    const handleCompleteExercise = async () => {
        const result = await completeExercise(`exercise_${Date.now()}`);
        if (result.success) {
            alert('Exercise completed!');
        }
    };

    const handleCompleteQuiz = async () => {
        const result = await completeQuiz(`quiz_${Date.now()}`);
        if (result.success) {
            alert('Quiz completed!');
        }
    };

    const handleAddStudyTime = () => {
        addStudyTime(60); // Add 1 minute
    };

    const handleProgressUpdate = () => {
        const newProgress = Math.min(100, (progressState.overallProgress || 0) + 10);
        updateOverallProgress(newProgress);
    };

    const handleSlideNext = () => {
        const nextSlide = (progressState.currentSlideIndex || 0) + 1;
        updateCurrentSlide(nextSlide);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 2 }} />
                Progress Management Demo
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={clearProgressError}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Current Progress Display */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Current Progress
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Overall Progress: {metrics.overallProgress}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={metrics.overallProgress}
                                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2">User ID:</Typography>
                                    <Chip label={progressState.userId || 'N/A'} size="small" />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">Slide ID:</Typography>
                                    <Chip label={progressState.slideId || 'N/A'} size="small" />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">Current Slide:</Typography>
                                    <Chip label={progressState.currentSlideIndex || 0} size="small" color="primary" />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">Study Time:</Typography>
                                    <Chip
                                        label={`${Math.floor((metrics.totalStudyTime + metrics.sessionTime) / 60)}m ${((metrics.totalStudyTime + metrics.sessionTime) % 60)}s`}
                                        size="small"
                                        color="secondary"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Completion Stats */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Completion Stats
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <School sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Slides Completed: {metrics.completionRate}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Assignment sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Exercises Completed: {metrics.exerciseCompletionRate}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Quiz sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Quizzes Completed: {metrics.quizCompletionRate}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Timer sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Session Time: {Math.floor(metrics.sessionTime / 60)}m {metrics.sessionTime % 60}s
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Actions
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={handleManualSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Progress'}
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<School />}
                                    onClick={handleCompleteSlide}
                                >
                                    Complete Slide
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<Assignment />}
                                    onClick={handleCompleteExercise}
                                >
                                    Complete Exercise
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<Quiz />}
                                    onClick={handleCompleteQuiz}
                                >
                                    Complete Quiz
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<Timer />}
                                    onClick={handleAddStudyTime}
                                >
                                    Add 1 Min Study Time
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleProgressUpdate}
                                >
                                    +10% Progress
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleSlideNext}
                                >
                                    Next Slide
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={reset}
                                    color="warning"
                                >
                                    Reset Progress
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Status Display */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Status
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Chip
                                    label={isLoading ? "Loading..." : "Ready"}
                                    color={isLoading ? "warning" : "success"}
                                />
                                <Chip
                                    label={isSaving ? "Saving..." : "Saved"}
                                    color={isSaving ? "warning" : "success"}
                                />
                                {error && (
                                    <Chip
                                        label="Error occurred"
                                        color="error"
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProgressDemo;
