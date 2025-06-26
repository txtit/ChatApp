import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    useTheme,
    Alert,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    Fullscreen,
    School,
    EmojiEvents,
    Star,
    Check,
    Close,
    HelpOutline,
    FormatQuote,
    Lightbulb,
    CloudDownload,
    Image,
    SaveAlt
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { useDispatch } from "react-redux";
import { setProgress } from "../../redux/slices/progress";

const KidsSlideshow = ({ data }) => {
    console.log("KidsSlideshow received data:", data);

    // Khởi tạo các state và thiết lập dữ liệu
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [exerciseAnswers, setExerciseAnswers] = useState({});
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [generatedImages, setGeneratedImages] = useState({});
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [currentImagePrompt, setCurrentImagePrompt] = useState('');
    const [score, setScore] = useState(0);

    const theme = useTheme();
    const dispatch = useDispatch();
    const viewedSlides = useRef(new Set());

    // Trích xuất dữ liệu từ prop data
    const { slides, exercises, quizzes, title, subjectGrade } = data || {};
    console.log("Extracted data:", { slides, exercises, quizzes, title, subjectGrade });
    console.log("Slides array:", slides);
    console.log("Is slides array?", Array.isArray(slides));
    console.log("Slides length:", slides?.length);

    // Track progress changes - CHỈ dispatch setProgress đơn giản
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

    // Kiểm tra dữ liệu trước khi sử dụng
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

    const extractGroupId = (id) => {
        // Lấy phần giữa dấu "_" đầu tiên và cuối cùng
        if (!id) return "";
        const parts = id.split("_");
        // Nếu id dạng "slide_xxx_4" hoặc "ex_xxx_1"
        return parts.length === 3 ? parts[1] : "";
    };

    // Tìm bài tập liên quan đến slide hiện tại
    const currentExercise = currentSlideData?.type === 'exercise' && exercises
        ? exercises.find(ex => {
            console.log("Current slide data:", currentSlideData);
            console.log("Current exercises data:", exercises);
            const slideGroup = extractGroupId(currentSlideData.exerciseId || currentSlideData.id);
            const exGroup = extractGroupId(ex.id);
            if (slideGroup && exGroup && slideGroup === exGroup) {
                return true;
            }
            // So sánh bằng exerciseId nếu có
            if (currentSlideData.exerciseId !== undefined && ex.id !== undefined) {
                return currentSlideData.exerciseId === ex.id;
            }
            return false;
        })
        : null;

    // Tìm quiz liên quan đến slide hiện tại
    const currentQuiz = currentSlideData?.type === 'quiz' && quizzes
        ? quizzes.find(quiz => {
            const slideGroup = extractGroupId(currentSlideData.quizId || currentSlideData.id);
            const quizGroup = extractGroupId(quiz.id);
            if (slideGroup && quizGroup && slideGroup === quizGroup) {
                return true;
            }
            return false;
        })?.questions
        : null;

    // Kiểm tra câu trả lời bài tập (đơn giản - không dispatch Redux phức tạp)
    const checkExerciseAnswers = () => {
        if (!currentExercise) return false;

        let correct = 0;
        let total = currentExercise.questions.length;

        currentExercise.questions.forEach((_, index) => {
            const answer = exerciseAnswers[`${currentSlide}_${index}`]?.toLowerCase() || '';
            const correctAnswer = currentExercise.answers[index]?.toLowerCase() || '';

            if (answer === correctAnswer) {
                correct++;
            }
        });

        const exerciseScore = (correct / total) * 100;
        setScore(exerciseScore);
        setShowResults(true);

        // Show confetti for perfect score
        if (exerciseScore === 100) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        return correct === total;
    };

    // Kiểm tra câu trả lời trắc nghiệm (đơn giản - không dispatch Redux phức tạp)
    const checkQuizAnswers = () => {
        if (!currentQuiz) return false;

        let correct = 0;
        let total = currentQuiz.length;

        currentQuiz.forEach((quiz, index) => {
            const selectedOption = quizAnswers[`${currentSlide}_${index}`];
            if (selectedOption === quiz.correctOption) {
                correct++;
            }
        });

        const quizScore = (correct / total) * 100;
        setScore(quizScore);
        setShowResults(true);

        // Show confetti for perfect score
        if (quizScore === 100) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        return correct === total;
    };

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            console.log("Current slide data:", currentSlideData);
            if ((currentSlideData?.type === 'exercise' && !showResults) ||
                (currentSlideData?.type === 'quiz' && !showResults)) {
                // Nếu đang ở slide bài tập hoặc quiz và chưa hiển thị kết quả, yêu cầu kiểm tra
                if (window.confirm('Bạn muốn nộp bài không? Sau khi nộp, bạn không thể sửa đổi câu trả lời.')) {
                    if (currentSlideData?.type === 'exercise') {
                        checkExerciseAnswers();
                    } else {
                        checkQuizAnswers();
                    }
                }
                return;
            }
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

    // Phần render slides giữ nguyên
    const renderTitleSlide = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 5,
                        minHeight: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, #fff9c4 0%, #ffcc80 100%)',
                        borderRadius: '24px',
                        mt: 2
                    }}
                >
                    <School sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
                    <Typography variant="h2" component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            textAlign: 'center',
                            fontFamily: '"Comic Sans MS", cursive, sans-serif',
                            mb: 2
                        }}>
                        {currentSlideData.title}
                    </Typography>
                    <Typography variant="h5"
                        sx={{
                            color: theme.palette.text.secondary,
                            textAlign: 'center',
                            fontFamily: '"Comic Sans MS", cursive, sans-serif'
                        }}>
                        {subjectGrade || 'Bài học thú vị'}
                    </Typography>
                </Paper>
            </motion.div>
        );
    };

    const renderContentSlide = () => {
        return (
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        minHeight: 400,
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        borderRadius: '20px',
                        mt: 2
                    }}
                >
                    <Typography variant="h4" component="h2"
                        sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.dark,
                            mb: 3,
                            fontFamily: '"Comic Sans MS", cursive, sans-serif'
                        }}>
                        {currentSlideData.title}
                    </Typography>

                    {currentSlideData.content && (
                        <Box sx={{ mb: 3 }}>
                            {Array.isArray(currentSlideData.content) ? (
                                currentSlideData.content.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                mb: 2,
                                                fontSize: '1.2rem',
                                                lineHeight: 1.6,
                                                fontFamily: '"Comic Sans MS", cursive, sans-serif'
                                            }}
                                        >
                                            {item}
                                        </Typography>
                                    </motion.div>
                                ))
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '1.2rem',
                                        lineHeight: 1.6,
                                        fontFamily: '"Comic Sans MS", cursive, sans-serif'
                                    }}
                                >
                                    {currentSlideData.content}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Paper>
            </motion.div>
        );
    };

    const renderExerciseSlide = () => {
        if (!currentExercise) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Không tìm thấy bài tập cho slide này</Typography>
                </Paper>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        minHeight: 400,
                        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                        borderRadius: '20px',
                        mt: 2
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <Star sx={{ fontSize: 40, color: theme.palette.warning.main, mr: 2 }} />
                        <Typography variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.primary.dark,
                                fontFamily: '"Comic Sans MS", cursive, sans-serif'
                            }}>
                            Bài Tập
                        </Typography>
                    </Box>

                    {currentExercise.questions.map((question, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Câu {index + 1}: {question}
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Nhập câu trả lời..."
                                value={exerciseAnswers[`${currentSlide}_${index}`] || ''}
                                onChange={(e) => setExerciseAnswers({
                                    ...exerciseAnswers,
                                    [`${currentSlide}_${index}`]: e.target.value
                                })}
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    ))}

                    {!showResults && (
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={checkExerciseAnswers}
                                sx={{ px: 4, py: 2 }}
                            >
                                Kiểm tra đáp án
                            </Button>
                        </Box>
                    )}

                    {showResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Paper
                                sx={{
                                    p: 3,
                                    mt: 3,
                                    textAlign: 'center',
                                    bgcolor: score >= 80 ? 'success.light' : 'warning.light'
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {score >= 80 ? 'Xuất sắc!' : 'Cần cố gắng thêm!'}
                                </Typography>
                                <Typography variant="h6">
                                    Điểm số: {score.toFixed(0)}/100
                                </Typography>
                            </Paper>
                        </motion.div>
                    )}
                </Paper>
            </motion.div>
        );
    };

    const renderQuizSlide = () => {
        if (!currentQuiz) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Không tìm thấy quiz cho slide này</Typography>
                </Paper>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        minHeight: 400,
                        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                        borderRadius: '20px',
                        mt: 2
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <EmojiEvents sx={{ fontSize: 40, color: theme.palette.success.main, mr: 2 }} />
                        <Typography variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.primary.dark,
                                fontFamily: '"Comic Sans MS", cursive, sans-serif'
                            }}>
                            Quiz
                        </Typography>
                    </Box>

                    {currentQuiz.map((quiz, index) => (
                        <Box key={index} sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Câu {index + 1}: {quiz.question}
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    value={quizAnswers[`${currentSlide}_${index}`] || ''}
                                    onChange={(e) => setQuizAnswers({
                                        ...quizAnswers,
                                        [`${currentSlide}_${index}`]: e.target.value
                                    })}
                                >
                                    {quiz.options.map((option, optIndex) => (
                                        <FormControlLabel
                                            key={optIndex}
                                            value={optIndex.toString()}
                                            control={<Radio />}
                                            label={option}
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    ))}

                    {!showResults && (
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={checkQuizAnswers}
                                sx={{ px: 4, py: 2 }}
                            >
                                Xem kết quả
                            </Button>
                        </Box>
                    )}

                    {showResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Paper
                                sx={{
                                    p: 3,
                                    mt: 3,
                                    textAlign: 'center',
                                    bgcolor: score >= 80 ? 'success.light' : 'warning.light'
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {score >= 80 ? 'Tuyệt vời!' : 'Hãy thử lại!'}
                                </Typography>
                                <Typography variant="h6">
                                    Điểm số: {score.toFixed(0)}/100
                                </Typography>
                            </Paper>
                        </motion.div>
                    )}
                </Paper>
            </motion.div>
        );
    };

    const renderSlideContent = () => {
        if (!currentSlideData) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Không có dữ liệu slide</Typography>
                </Paper>
            );
        }

        switch (currentSlideData.type) {
            case 'title':
                return renderTitleSlide();
            case 'exercise':
                return renderExerciseSlide();
            case 'quiz':
                return renderQuizSlide();
            case 'content':
            default:
                return renderContentSlide();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            <Box sx={{
                bgcolor: 'white',
                p: 3,
                borderRadius: 4,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                position: 'relative'
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        fontFamily: '"Comic Sans MS", cursive, sans-serif',
                        color: theme.palette.primary.main
                    }}
                >
                    {title || "Bài học tương tác"}
                </Typography>

                <Stepper
                    activeStep={currentSlide}
                    alternativeLabel
                    sx={{ mb: 3 }}
                >
                    {slides.map((slide, index) => (
                        <Step key={index}>
                            <StepLabel>
                                {slide.title || `Slide ${index + 1}`}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Render slide content */}
                {renderSlideContent()}

                {/* Navigation buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 3
                }}>
                    <Button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        startIcon={<ArrowBack />}
                        variant="outlined"
                    >
                        Trước
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                        {currentSlide + 1} / {totalSlides}
                    </Typography>

                    <Button
                        onClick={nextSlide}
                        disabled={currentSlide === totalSlides - 1}
                        endIcon={<ArrowForward />}
                        variant="contained"
                    >
                        Tiếp
                    </Button>
                </Box>

                {/* Action buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 2
                }}>
                    <IconButton
                        onClick={goFullScreen}
                        color="primary"
                        title="Toàn màn hình"
                    >
                        <Fullscreen />
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
};

export default KidsSlideshow;
