import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Chip,
    Stack,
    Alert,
    Divider
} from '@mui/material';
import {
    PlayArrow,
    Stop,
    CheckCircle,
    Timer
} from '@mui/icons-material';
import { useProgress } from '../../hooks/useProgress';

/**
 * Component minh họa cách sử dụng slide progress system
 * Sử dụng các actions mới đã được sửa: setSlide, beginSlide, completeSlideDetails
 */
const SlideProgressExample = ({ slideData }) => {
    const [slideStatus, setSlideStatus] = useState('not_started'); // not_started, in_progress, completed
    const [slideResult, setSlideResult] = useState(null);

    // Sử dụng useProgress hook với các actions mới
    const {
        progressState,
        setSlide,
        updateSlide,
        beginSlide,
        completeSlideDetails,
        isSessionActive,
        sessionDuration,
        formatTime,
        metrics
    } = useProgress('user123', 'slide456', {
        autoSave: true,
        trackTime: true
    });

    // Sample slide data nếu không được truyền vào
    const currentSlide = slideData || {
        id: 'slide-example-1',
        title: 'Example Slide: Colors in English',
        type: 'vocabulary',
        difficulty: 'beginner',
        content: {
            words: ['red', 'blue', 'green', 'yellow'],
            exercises: [
                { id: 'ex1', question: 'What color is the sky?', answer: 'blue' },
                { id: 'ex2', question: 'What color is grass?', answer: 'green' }
            ]
        },
        maxScore: 100,
        estimatedDuration: 180000 // 3 minutes in ms
    };

    // Initialize slide khi component mount
    useEffect(() => {
        if (currentSlide) {
            setSlide({
                id: currentSlide.id,
                title: currentSlide.title,
                type: currentSlide.type,
                difficulty: currentSlide.difficulty,
                content: currentSlide.content,
                maxScore: currentSlide.maxScore,
                completed: false,
                score: 0
            });
        }
    }, [currentSlide, setSlide]);

    // Bắt đầu slide
    const handleStartSlide = () => {
        beginSlide(currentSlide.id);
        setSlideStatus('in_progress');

        // Update UI state
        updateSlide({
            startedAt: new Date().toISOString(),
            status: 'in_progress'
        });
    };

    // Kết thúc slide với kết quả
    const handleCompleteSlide = (score = 85, feedback = 'Good job!') => {
        const slideResult = {
            score: score,
            maxScore: currentSlide.maxScore,
            feedback: feedback,
            notes: `Completed ${currentSlide.title} with ${score}/${currentSlide.maxScore} points`,
            endTime: new Date().toISOString()
        };

        // Dispatch complete slide action
        completeSlideDetails(slideResult);

        // Update local state
        setSlideResult(slideResult);
        setSlideStatus('completed');

        // Update slide data
        updateSlide({
            completedAt: new Date().toISOString(),
            status: 'completed',
            finalScore: score
        });
    };

    // Simulate slide progress
    const handleSimulateProgress = () => {
        const scores = [65, 75, 85, 95];
        const feedbacks = [
            'Needs improvement',
            'Good effort!',
            'Great work!',
            'Excellent!'
        ];
        const randomScore = scores[Math.floor(Math.random() * scores.length)];
        const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

        handleCompleteSlide(randomScore, randomFeedback);
    };

    const getStatusColor = () => {
        switch (slideStatus) {
            case 'not_started': return 'default';
            case 'in_progress': return 'warning';
            case 'completed': return 'success';
            default: return 'default';
        }
    };

    const getProgressValue = () => {
        switch (slideStatus) {
            case 'not_started': return 0;
            case 'in_progress': return 50;
            case 'completed': return 100;
            default: return 0;
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Slide Progress Example
            </Typography>

            <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent>
                    <Stack spacing={2}>
                        {/* Slide Info */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {currentSlide.title}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                    label={slideStatus.replace('_', ' ').toUpperCase()}
                                    color={getStatusColor()}
                                    size="small"
                                />
                                <Chip
                                    label={currentSlide.type}
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    label={currentSlide.difficulty}
                                    variant="outlined"
                                    size="small"
                                />
                            </Stack>
                        </Box>

                        {/* Progress Bar */}
                        <Box>
                            <Typography variant="body2" gutterBottom>
                                Progress: {getProgressValue()}%
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={getProgressValue()}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>

                        {/* Session Info */}
                        {isSessionActive && (
                            <Alert severity="info" icon={<Timer />}>
                                Session Active: {formatTime(sessionDuration)}
                            </Alert>
                        )}

                        {/* Controls */}
                        <Stack direction="row" spacing={2} justifyContent="center">
                            {slideStatus === 'not_started' && (
                                <Button
                                    variant="contained"
                                    startIcon={<PlayArrow />}
                                    onClick={handleStartSlide}
                                    color="primary"
                                >
                                    Start Slide
                                </Button>
                            )}

                            {slideStatus === 'in_progress' && (
                                <Button
                                    variant="contained"
                                    startIcon={<Stop />}
                                    onClick={handleSimulateProgress}
                                    color="success"
                                >
                                    Complete Slide
                                </Button>
                            )}

                            {slideStatus === 'completed' && (
                                <Button
                                    variant="outlined"
                                    startIcon={<CheckCircle />}
                                    disabled
                                    color="success"
                                >
                                    Completed
                                </Button>
                            )}
                        </Stack>

                        {/* Results */}
                        {slideResult && (
                            <>
                                <Divider />
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Results
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body1">
                                            <strong>Score:</strong> {slideResult.score}/{slideResult.maxScore}
                                            ({Math.round((slideResult.score / slideResult.maxScore) * 100)}%)
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Feedback:</strong> {slideResult.feedback}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {slideResult.notes}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* Redux State Debug Info */}
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Debug: Redux State
                    </Typography>
                    <Box sx={{ fontSize: '0.875rem' }}>
                        <Typography variant="body2" gutterBottom>
                            <strong>Current Slide ID:</strong> {progressState?.currentSlide?.id || 'None'}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Current Session Active:</strong> {isSessionActive ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Session Duration:</strong> {formatTime(sessionDuration)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Total Study Time:</strong> {formatTime(metrics?.totalStudyTime || 0)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Completed Slides:</strong> {metrics?.completionRate || 0}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SlideProgressExample;
