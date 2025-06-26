import React, { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    LinearProgress,
    Paper
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward
} from '@mui/icons-material';

const KidsSlideshow = ({ 
    data = {}, 
    onComplete, 
    onSlideChange 
}) => {
    const { slides = [], exercises = [], quizzes = [], title = '' } = data;
    const [currentSlide, setCurrentSlide] = useState(0);

    // Debug logs
    console.log('🎬 KidsSlideshow data:', data);
    console.log('📄 Slides:', slides);
    console.log('📊 Quizzes:', quizzes);
    console.log('📝 Exercises:', exercises);

    // Memoize current slide data với logic merge
    const currentSlideData = useMemo(() => {
        if (!slides || slides.length === 0) return {};
        
        const slideData = slides[currentSlide] || {};
        console.log('🔍 Processing slide:', slideData);

        // Merge quiz data
        if (slideData.type === 'quiz' && slideData.quizId && quizzes && quizzes.length > 0) {
            console.log('🔍 Quiz - Looking for quizId:', slideData.quizId);
            
            const quizQuestions = quizzes.filter(q => 
                q.id && q.id.startsWith(slideData.quizId)
            );
            
            if (quizQuestions.length > 0) {
                const sortedQuestions = quizQuestions.sort((a, b) => {
                    const aNum = parseInt(a.id.split('_').pop()) || 0;
                    const bNum = parseInt(b.id.split('_').pop()) || 0;
                    return aNum - bNum;
                });
                
                console.log('🔀 Merged quiz questions:', sortedQuestions);
                return { ...slideData, questions: sortedQuestions };
            }
        }

        // Merge exercise data
        if (slideData.type === 'exercise' && slideData.exerciseId && exercises && exercises.length > 0) {
            console.log('🔍 Exercise - Looking for exerciseId:', slideData.exerciseId);
            
            const exerciseQuestions = exercises.filter(e =>
                e.id && e.id.startsWith(slideData.exerciseId)
            );
            
            if (exerciseQuestions.length > 0) {
                const sortedExercises = exerciseQuestions.sort((a, b) => {
                    const aNum = parseInt(a.id.split('_').pop()) || 0;
                    const bNum = parseInt(b.id.split('_').pop()) || 0;
                    return aNum - bNum;
                });
                
                console.log('🔀 Merged exercise questions:', sortedExercises);
                return { ...slideData, questions: sortedExercises };
            }
        }

        return slideData;
    }, [slides, currentSlide, quizzes, exercises]);

    // Navigation handlers
    const handleNext = useCallback(() => {
        if (currentSlide < slides.length - 1) {
            const nextSlide = currentSlide + 1;
            setCurrentSlide(nextSlide);
            onSlideChange?.(nextSlide);
        } else {
            onComplete?.();
        }
    }, [currentSlide, slides.length, onSlideChange, onComplete]);

    const handlePrevious = useCallback(() => {
        if (currentSlide > 0) {
            const prevSlide = currentSlide - 1;
            setCurrentSlide(prevSlide);
            onSlideChange?.(prevSlide);
        }
    }, [currentSlide, onSlideChange]);

    // Progress calculation
    const progressPercentage = useMemo(() => {
        return slides.length > 0 ? ((currentSlide + 1) / slides.length) * 100 : 0;
    }, [currentSlide, slides.length]);

    // Simple slide content renderer - KHÔNG SỬ DỤNG QuizSlide/ExerciseSlide để tránh lỗi
    const renderSlideContent = () => {
        if (!currentSlideData || !currentSlideData.type) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography>Đang tải nội dung...</Typography>
                </Paper>
            );
        }

        return (
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, color: '#1976d2' }}>
                    {currentSlideData.title}
                </Typography>

                {/* Display type */}
                <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                    📌 Loại: {currentSlideData.type}
                </Typography>

                {/* Content */}
                {currentSlideData.content && Array.isArray(currentSlideData.content) && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>📋 Nội dung:</Typography>
                        {currentSlideData.content.map((item, index) => (
                            <Typography key={index} sx={{ mb: 1, pl: 2 }}>
                                • {typeof item === 'string' ? item : JSON.stringify(item)}
                            </Typography>
                        ))}
                    </Box>
                )}

                {/* Image prompt */}
                {currentSlideData.imagePrompt && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>🖼️ Hình ảnh gợi ý:</Typography>
                        <Typography sx={{ fontStyle: 'italic' }}>
                            {currentSlideData.imagePrompt}
                        </Typography>
                    </Box>
                )}

                {/* Questions */}
                {currentSlideData.questions && Array.isArray(currentSlideData.questions) && currentSlideData.questions.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {currentSlideData.type === 'quiz' ? '❓ Câu hỏi Quiz:' : '📝 Câu hỏi Bài tập:'}
                        </Typography>
                        {currentSlideData.questions.map((question, index) => (
                            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {index + 1}. {question.question || question.title || 'Không có câu hỏi'}
                                </Typography>
                                
                                {/* Quiz options */}
                                {question.options && Array.isArray(question.options) && (
                                    <Box sx={{ ml: 2 }}>
                                        {question.options.map((option, optIndex) => (
                                            <Typography key={optIndex} sx={{ mb: 0.5 }}>
                                                {String.fromCharCode(65 + optIndex)}. {option}
                                            </Typography>
                                        ))}
                                        {question.correctOption !== undefined && (
                                            <Typography sx={{ mt: 1, color: 'green', fontWeight: 'bold' }}>
                                                ✅ Đáp án: {String.fromCharCode(65 + question.correctOption)}
                                            </Typography>
                                        )}
                                        {question.correctAnswer !== undefined && (
                                            <Typography sx={{ mt: 1, color: 'green', fontWeight: 'bold' }}>
                                                ✅ Đáp án: {String.fromCharCode(65 + question.correctAnswer)}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Paper>
                        ))}
                    </Box>
                )}

                {/* IDs for debugging */}
                {(currentSlideData.quizId || currentSlideData.exerciseId) && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            🔍 ID: {currentSlideData.quizId || currentSlideData.exerciseId}
                        </Typography>
                    </Box>
                )}

                {/* Simple completion button */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: 3,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                        }}
                    >
                        {currentSlide === slides.length - 1 ? '🎉 Hoàn thành' : '➡️ Tiếp theo'}
                    </Button>
                </Box>
            </Paper>
        );
    };

    if (!slides || slides.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        Không có dữ liệu slides
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            {title && (
                <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', color: '#1976d2' }}>
                    {title}
                </Typography>
            )}

            {/* Progress Bar */}
            <Box sx={{ mb: 3 }}>
                <LinearProgress 
                    variant="determinate" 
                    value={progressPercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    Slide {currentSlide + 1} / {slides.length} ({Math.round(progressPercentage)}%)
                </Typography>
            </Box>

            {/* Slide Content */}
            <Box sx={{ mb: 3 }}>
                {renderSlideContent()}
            </Box>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handlePrevious}
                    disabled={currentSlide === 0}
                    sx={{ px: 3, py: 1 }}
                >
                    Trước
                </Button>

                <Typography variant="body1" sx={{ 
                    px: 3, 
                    py: 1, 
                    bgcolor: '#e3f2fd', 
                    borderRadius: 2,
                    fontWeight: 'bold'
                }}>
                    {currentSlide + 1} / {slides.length}
                </Typography>

                <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                    sx={{ px: 3, py: 1 }}
                >
                    {currentSlide === slides.length - 1 ? 'Hoàn thành' : 'Tiếp'}
                </Button>
            </Box>
        </Container>
    );
};

export default KidsSlideshow;
