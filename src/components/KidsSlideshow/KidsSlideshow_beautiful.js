import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    useTheme,
    Alert,
    LinearProgress,
    Chip,
    Fab,
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    Fullscreen,
    School,
    Star,
    EmojiEvents,
    AutoAwesome,
    Celebration,
    Face,
    Psychology,
    Quiz,
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from "react-redux";
import { setProgress } from "../../redux/slices/progress";

const KidsSlideshow = ({ data }) => {
    console.log("KidsSlideshow received data:", data);

    // State initialization
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [exerciseAnswers, setExerciseAnswers] = useState({});
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const theme = useTheme();
    const dispatch = useDispatch();
    const viewedSlides = useRef(new Set());

    // Extract data from props
    const { slides, exercises, quizzes, title, subjectGrade } = data || {};
    console.log("Extracted data:", { slides, exercises, quizzes, title, subjectGrade });

    // Track progress changes
    useEffect(() => {
        if (slides?.length > 0) {
            // Mark slide as viewed
            viewedSlides.current.add(currentSlide);

            // Calculate overall progress
            const percentComplete = Math.round((viewedSlides.current.size / slides.length) * 100);

            // Only dispatch setProgress action
            dispatch(setProgress({
                courseId: data.id || slides[0]?.id || "default",
                percent: percentComplete
            }));
        }
    }, [currentSlide, slides, data.id, dispatch]);

    // Validate data before rendering
    if (!slides || !Array.isArray(slides)) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    Không thể tải nội dung bài học. Vui lòng thử lại sau.
                </Alert>
            </Container>
        );
    }

    const totalSlides = slides.length;
    const currentSlideData = currentSlide < totalSlides ? slides[currentSlide] : null;

    // Navigation functions
    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
            setShowResults(false);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
            setShowResults(false);
        }
    };

    const goFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    };

    // Render slide content với thiết kế sinh động
    const renderSlideContent = () => {
        if (!currentSlideData) {
            return (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                >
                    <Paper sx={{
                        p: 6,
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                        borderRadius: '24px',
                        color: 'white'
                    }}>
                        <Face sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Không có dữ liệu slide
                        </Typography>
                    </Paper>
                </motion.div>
            );
        }

        const slideVariants = {
            enter: { x: 300, opacity: 0, scale: 0.9 },
            center: { x: 0, opacity: 1, scale: 1 },
            exit: { x: -300, opacity: 0, scale: 0.9 }
        };

        const getSlideBackground = (type) => {
            switch (type) {
                case 'exercise':
                    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                case 'quiz':
                    return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                case 'summary':
                    return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
                default:
                    return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
            }
        };

        const getSlideIcon = (type) => {
            switch (type) {
                case 'exercise':
                    return <Psychology sx={{ fontSize: 60, color: 'white', mb: 2 }} />;
                case 'quiz':
                    return <Quiz sx={{ fontSize: 60, color: 'white', mb: 2 }} />;
                case 'summary':
                    return <EmojiEvents sx={{ fontSize: 60, color: '#FFD700', mb: 2 }} />;
                default:
                    return <AutoAwesome sx={{ fontSize: 60, color: 'white', mb: 2 }} />;
            }
        };

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                    }}
                >
                    <Paper
                        elevation={8}
                        sx={{
                            p: 5,
                            minHeight: 500,
                            background: getSlideBackground(currentSlideData.type),
                            borderRadius: '32px',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                opacity: 0.3
                            }
                        }}
                    >
                        {/* Floating decorative elements */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                zIndex: 1
                            }}
                        >
                            <Star sx={{ fontSize: 40, color: '#FFD700', opacity: 0.8 }} />
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 15, 0],
                                rotate: [0, -5, 5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                            style={{
                                position: 'absolute',
                                bottom: '30px',
                                left: '30px',
                                zIndex: 1
                            }}
                        >
                            <Celebration sx={{ fontSize: 35, color: '#FF69B4', opacity: 0.7 }} />
                        </motion.div>

                        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                            {/* Slide type indicator */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                            >
                                {getSlideIcon(currentSlideData.type)}
                            </motion.div>

                            {/* Slide title với animation */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <Typography
                                    variant="h3"
                                    component="h2"
                                    sx={{
                                        mb: 4,
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                        fontFamily: '"Comic Sans MS", cursive, sans-serif'
                                    }}
                                >
                                    {currentSlideData.title || `Slide ${currentSlide + 1}`}
                                </Typography>
                            </motion.div>

                            {/* Slide content */}
                            {currentSlideData.content && (
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                >
                                    <Box sx={{
                                        mb: 4,
                                        p: 3,
                                        bgcolor: 'rgba(255,255,255,0.95)',
                                        borderRadius: '20px',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                                    }}>
                                        {Array.isArray(currentSlideData.content) ? (
                                            currentSlideData.content.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.8 + index * 0.2 }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            mb: 2,
                                                            color: '#2c3e50',
                                                            lineHeight: 1.6,
                                                            fontSize: '1.2rem'
                                                        }}
                                                    >
                                                        {item}
                                                    </Typography>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: '#2c3e50',
                                                    lineHeight: 1.6,
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                {currentSlideData.content}
                                            </Typography>
                                        )}
                                    </Box>
                                </motion.div>
                            )}

                            {/* Exercise section */}
                            {currentSlideData.type === 'exercise' && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8, type: "spring" }}
                                >
                                    <Box sx={{
                                        mt: 3,
                                        p: 4,
                                        bgcolor: 'rgba(255,255,255,0.95)',
                                        borderRadius: '20px',
                                        border: '3px dashed #9b59b6'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                            <Psychology sx={{ fontSize: 40, color: '#9b59b6', mr: 2 }} />
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#9b59b6',
                                                    fontFamily: '"Comic Sans MS", cursive'
                                                }}
                                            >
                                                Bài Tập Thú Vị!
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                                            🎯 Sẵn sàng thử thách bản thân chưa? Hãy làm bài tập để kiểm tra kiến thức!
                                        </Typography>
                                    </Box>
                                </motion.div>
                            )}

                            {/* Quiz section */}
                            {currentSlideData.type === 'quiz' && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8, type: "spring" }}
                                >
                                    <Box sx={{
                                        mt: 3,
                                        p: 4,
                                        bgcolor: 'rgba(255,255,255,0.95)',
                                        borderRadius: '20px',
                                        border: '3px dashed #e74c3c'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                            <Quiz sx={{ fontSize: 40, color: '#e74c3c', mr: 2 }} />
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#e74c3c',
                                                    fontFamily: '"Comic Sans MS", cursive'
                                                }}
                                            >
                                                Quiz Vui Nhộn!
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                                            🧠 Trò chơi trắc nghiệm đang chờ bạn! Chọn đáp án đúng nhé!
                                        </Typography>
                                    </Box>
                                </motion.div>
                            )}
                        </Box>
                    </Paper>
                </motion.div>
            </AnimatePresence>
        );
    };

    // Main component return với giao diện sinh động
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(45deg, #74b9ff 0%, #0984e3 50%, #a29bfe 100%)',
            py: 4,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decorative elements */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpolygon points="50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40"/%3E%3C/g%3E%3C/svg%3E")',
                zIndex: 0
            }} />

            {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                {/* Header với animation */}
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <Paper
                        elevation={10}
                        sx={{
                            p: 4,
                            mb: 4,
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header decorative elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px'
                            }}
                        >
                            <School sx={{ fontSize: 40, opacity: 0.3 }} />
                        </motion.div>

                        <Typography
                            variant="h3"
                            sx={{
                                mb: 2,
                                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            🌟 {title || "Bài học tương tác"} 🌟
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.9,
                                fontFamily: '"Comic Sans MS", cursive'
                            }}
                        >
                            {subjectGrade || "Học tập vui vẻ"}
                        </Typography>
                    </Paper>
                </motion.div>

                {/* Progress bar với animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <Paper
                        elevation={6}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <EmojiEvents sx={{ color: '#FFD700', mr: 2, fontSize: 30 }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Comic Sans MS", cursive',
                                    color: '#2c3e50',
                                    fontWeight: 'bold'
                                }}
                            >
                                Tiến độ học tập
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Chip
                                label={`${currentSlide + 1}/${totalSlides}`}
                                color="primary"
                                variant="filled"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    fontFamily: '"Comic Sans MS", cursive'
                                }}
                            />
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={(viewedSlides.current.size / totalSlides) * 100}
                            sx={{
                                height: 12,
                                borderRadius: 6,
                                bgcolor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 6,
                                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)'
                                }
                            }}
                        />

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                textAlign: 'center',
                                color: '#7f8c8d',
                                fontWeight: 'bold'
                            }}
                        >
                            {Math.round((viewedSlides.current.size / totalSlides) * 100)}% hoàn thành 🎯
                        </Typography>
                    </Paper>
                </motion.div>

                {/* Slide content */}
                {renderSlideContent()}

                {/* Navigation controls với thiết kế sinh động */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <Paper
                        elevation={8}
                        sx={{
                            p: 3,
                            mt: 4,
                            borderRadius: '24px',
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {/* Navigation buttons */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={prevSlide}
                                    disabled={currentSlide === 0}
                                    startIcon={<ArrowBack />}
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        borderRadius: '20px',
                                        background: currentSlide === 0 ? 'gray' : 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                                        fontFamily: '"Comic Sans MS", cursive',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': {
                                            background: currentSlide === 0 ? 'gray' : 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
                                        }
                                    }}
                                >
                                    Trước
                                </Button>
                            </motion.div>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#2c3e50',
                                        fontFamily: '"Comic Sans MS", cursive',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Slide {currentSlide + 1} / {totalSlides}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    {currentSlideData?.title || 'Đang tải...'}
                                </Typography>
                            </Box>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={nextSlide}
                                    disabled={currentSlide === totalSlides - 1}
                                    endIcon={<ArrowForward />}
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        borderRadius: '20px',
                                        background: currentSlide === totalSlides - 1 ? 'gray' : 'linear-gradient(45deg, #4ECDC4 30%, #44A08D 90%)',
                                        fontFamily: '"Comic Sans MS", cursive',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': {
                                            background: currentSlide === totalSlides - 1 ? 'gray' : 'linear-gradient(45deg, #44A08D 30%, #4ECDC4 90%)',
                                        }
                                    }}
                                >
                                    Tiếp
                                </Button>
                            </motion.div>
                        </Box>

                        {/* Quick navigation dots */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                            {slides.map((_, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Box
                                        onClick={() => setCurrentSlide(index)}
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: index === currentSlide ? '#4ECDC4' : '#bdc3c7',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: '#4ECDC4'
                                            }
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </Box>

                        {/* Action buttons */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2
                        }}>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Fab
                                    onClick={goFullScreen}
                                    color="primary"
                                    size="medium"
                                    sx={{
                                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                                        }
                                    }}
                                >
                                    <Fullscreen />
                                </Fab>
                            </motion.div>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default KidsSlideshow;
