// Example: How to integrate Redux Progress with KidsSlideshow

import React, { useEffect, useState } from 'react';
import { useProgress } from '../hooks/useProgress';
// ... other imports

const KidsSlideshowWithProgress = ({ data }) => {
    const {
        // State
        progressState,
        currentSlideIndex,
        completedSlides,

        // Actions
        startSession,
        endSession,
        goToSlide,
        completeSlideNew,
        submitExercise,
        submitQuiz,

        // Computed
        isSessionActive,
        sessionDuration,
        completionRate,
        formatTime,

        // Helpers
        isSlideCompleted,
        getProgressSummary
    } = useProgress();

    // Local state for UI
    const [localCurrentSlide, setLocalCurrentSlide] = useState(0);

    // Initialize session when component mounts
    useEffect(() => {
        if (data?.slides?.length > 0 && !isSessionActive) {
            startSession(data, 'user123'); // Replace with actual user ID
        }

        // Cleanup on unmount
        return () => {
            if (isSessionActive) {
                endSession();
            }
        };
    }, [data?.slides?.length, startSession, endSession, isSessionActive]);

    // Sync local slide with Redux when Redux changes
    useEffect(() => {
        setLocalCurrentSlide(currentSlideIndex);
    }, [currentSlideIndex]);

    // Updated navigation functions
    const nextSlide = () => {
        if (localCurrentSlide < totalSlides - 1) {
            const nextIndex = localCurrentSlide + 1;

            // Mark current slide as completed
            completeSlideNew(localCurrentSlide, currentSlideData?.id, 0);

            // Navigate to next slide
            goToSlide(nextIndex, data.slides[nextIndex]);
            setLocalCurrentSlide(nextIndex);
        }
    };

    const prevSlide = () => {
        if (localCurrentSlide > 0) {
            const prevIndex = localCurrentSlide - 1;
            goToSlide(prevIndex, data.slides[prevIndex]);
            setLocalCurrentSlide(prevIndex);
        }
    };

    // Updated exercise submission
    const handleExerciseSubmit = (answers, score, totalQuestions) => {
        const currentExercise = getCurrentExercise(); // Your existing logic

        // Submit to Redux
        submitExercise(
            currentExercise.id,
            currentSlideData.id,
            answers,
            score,
            totalQuestions
        );

        // Show results
        setShowResults(true);
        if (score === 100) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    // Updated quiz submission
    const handleQuizSubmit = (answers, score, totalQuestions) => {
        const currentQuiz = getCurrentQuiz(); // Your existing logic

        // Submit to Redux
        submitQuiz(
            currentQuiz.id,
            currentSlideData.id,
            answers,
            score,
            totalQuestions
        );

        // Show results
        setShowResults(true);
        if (score === 100) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    // Enhanced progress display
    const renderProgressInfo = () => {
        const summary = getProgressSummary();

        return (
            <Box sx={{
                position: 'fixed',
                top: 20,
                right: 20,
                bgcolor: 'rgba(255,255,255,0.9)',
                p: 2,
                borderRadius: 2,
                boxShadow: 3,
                minWidth: 200
            }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    📊 Tiến Độ Học Tập
                </Typography>

                <Typography variant="body2">
                    Hoàn thành: {completionRate}%
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={completionRate}
                    sx={{ my: 1 }}
                />

                {isSessionActive && (
                    <Typography variant="body2" color="primary">
                        ⏱️ Thời gian: {formatTime(sessionDuration)}
                    </Typography>
                )}

                <Typography variant="body2">
                    🎯 Slides: {summary.completedSlides}/{summary.totalSlides}
                </Typography>

                <Typography variant="body2">
                    📝 Bài tập: {summary.totalExercises}
                </Typography>

                <Typography variant="body2">
                    🧠 Quiz: {summary.totalQuizzes}
                </Typography>

                {summary.averageScore > 0 && (
                    <Typography variant="body2">
                        ⭐ Điểm TB: {summary.averageScore}
                    </Typography>
                )}
            </Box>
        );
    };

    // Rest of your component logic...

    return (
        <Box>
            {/* Progress Info Overlay */}
            {renderProgressInfo()}

            {/* Your existing KidsSlideshow JSX */}
            <Container maxWidth="lg">
                {/* ... existing slideshow content ... */}

                {/* Enhanced Navigation with Progress */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        onClick={prevSlide}
                        disabled={localCurrentSlide === 0}
                        startIcon={<ArrowBack />}
                    >
                        Trước
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1">
                            Slide {localCurrentSlide + 1} / {totalSlides}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isSlideCompleted(localCurrentSlide) ? '✅ Hoàn thành' : '⏳ Đang học'}
                        </Typography>
                    </Box>

                    <Button
                        onClick={nextSlide}
                        disabled={localCurrentSlide === totalSlides - 1}
                        endIcon={<ArrowForward />}
                        variant="contained"
                    >
                        Tiếp
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default KidsSlideshowWithProgress;
