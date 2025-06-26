import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    useTheme,
    Alert,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Chip,
    IconButton,
    Card,
    CardContent,
    Divider,
    Stack,
    Badge,
    Fab,
    Zoom,
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    Fullscreen,
    School,
    Star,
    EmojiEvents,
    Image,
    AutoAwesome,
    PlayArrow,
    Pause,
    SkipNext,
    SkipPrevious,
    Palette,
    LightbulbOutlined,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useProgress } from '../../hooks/useProgress';
import Confetti from 'react-confetti';
import { useProgressV2 } from '../../hooks/useProgressV2';
import QuizSlide from './QuizSlide';
import ExerciseSlide from './ExerciseSlide';

const KidsSlideshow = ({ data }) => {
    // Redux progress hooks
    const dispatch = useDispatch();
    const progressState = useSelector(state => state.progress);
    const {
        updateProgressDetail,
        currentSlide: reduxCurrentSlide,
        getCurrentSessionTime
    } = useProgress();

    // State cơ bản + state cho bài tập
    const [exerciseAnswers, setExerciseAnswers] = useState({});
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showConfetti, setShowConfetti] = useState(false);
    const [score, setScore] = useState(0);

    const [slideIndex, setSlideIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);
    // State cho tạo hình ảnh
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // Nếu muốn hiển thị ảnh tạo ra

    const theme = useTheme();
    
    // Trích xuất dữ liệu từ prop data
    const { slides, exercises, quizzes, title, subjectGrade } = data || {};

    // Calculate total slides and current slide data
    const totalSlides = slides?.length || 0;
    
    // Redux state và actions
    const {
        currentSlide,
        setSlide,
        updateField,
        markComplete,
        addAttempt
    } = useProgressV2();

    // Slide hiện tại từ props
    const currentSlideData = slides[slideIndex];

    // Cập nhật Redux khi slide thay đổi
    useEffect(() => {
        if (currentSlideData) {
            // Log để debug
            console.log('Slide changed, updating Redux:', currentSlideData);

            // Cập nhật thông tin slide vào Redux
            setSlide({
                id: currentSlideData.id,
                title: currentSlideData.title,
                content: currentSlideData.content,
                type: currentSlideData.type,
                score: 0,
                attempts: 0,
                isCompleted: false,
                feedback: '',
                startTime: Date.now(),
                endTime: null
            });
        }
    }, [slideIndex, currentSlideData, setSlide]);

    // Handlers cho điều hướng slide  
    const handleNextSlide = () => {
        if (slideIndex < totalSlides - 1) {
            setSlideIndex(slideIndex + 1);
            setShowResults(false);
        }
    };

    const handlePrevSlide = () => {
        if (slideIndex > 0) {
            setSlideIndex(slideIndex - 1);
            setShowResults(false);
        }
    };

    // Handlers cho quiz và exercise
    const handleCheckQuizAnswers = (answers) => {
        // Tăng số lần thử
        addAttempt();

        // Tính điểm số (giả sử đây là logic tính điểm)
        const totalQuestions = currentSlideData.questions?.length || 0;
        const correctAnswers = answers.filter(answer => answer.isCorrect).length;
        const percentScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        // Cập nhật điểm số
        updateField('score', percentScore);

        // Đánh dấu hoàn thành nếu đạt điểm
        if (percentScore >= 70) { // Điểm đạt là 70%
            markComplete(percentScore);
        }

        // Hiển thị kết quả
        setShowResults(true);
    };

    // Thêm các function còn thiếu
    const goFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    };

    const nextSlide = () => {
        handleNextSlide();
    };

    const prevSlide = () => {
        handlePrevSlide();
    };

    // Debug output
    console.log('Redux currentSlide:', currentSlide);

    // Render slide content tùy theo loại
    const renderSlideContent = () => {
        if (!currentSlideData) return null;

        switch (currentSlideData.type) {
            case 'content':
            case 'title':
                return (
                    <Box sx={{ my: 3 }}>
                        <Typography variant="h4">{currentSlideData.title}</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {currentSlideData.content}
                        </Typography>
                    </Box>
                );

            case 'quiz':
                return (
                    <QuizSlide
                        data={currentSlideData}
                        onSubmit={handleCheckQuizAnswers}
                        showResults={showResults}
                    />
                );

            case 'exercise':
                return (
                    <ExerciseSlide
                        data={currentSlideData}
                        onComplete={(score) => {
                            addAttempt();
                            updateField('score', score);
                            if (score >= 70) markComplete(score);
                            setShowResults(true);
                        }}
                        showResults={showResults}
                    />
                );

            default:
                return <Typography>Không hỗ trợ loại slide này</Typography>;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            {/* Số slide ở trên cùng và ô tạo hình ảnh */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                px: 2
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#7c43bd', fontFamily: 'Comic Sans MS, cursive' }}>
                    Slide {slideIndex + 1} / {totalSlides}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Nhập mô tả để tạo hình ảnh..."
                        value={imagePrompt}
                        onChange={e => setImagePrompt(e.target.value)}
                        sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 220 }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ fontWeight: 'bold', fontFamily: 'Comic Sans MS, cursive', px: 2, py: 1 }}
                        onClick={() => {
                            setImageUrl(imagePrompt ? `https://dummyimage.com/400x200/7c43bd/fff&text=${encodeURIComponent(imagePrompt)}` : "");
                        }}
                    >
                        Tạo hình ảnh
                    </Button>
                </Box>
            </Box>

            {/* Nội dung slide */}
            <Box sx={{
                bgcolor: 'white',
                p: 3,
                borderRadius: 4,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                position: 'relative',
                mt: 2
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        color: theme.palette.primary.main
                    }}
                >
                    {title || "Bài học tương tác"}
                </Typography>

                {/* Render slide content */}
                {renderSlideContent()}
            </Box>

            {/* Navigation buttons */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3
            }}>
                <Button
                    onClick={prevSlide}
                    disabled={slideIndex === 0}
                    startIcon={<ArrowBack />}
                    variant="outlined"
                >
                    Trước
                </Button>

                <Typography variant="body2" color="text.secondary">
                    {slideIndex + 1} / {totalSlides}
                </Typography>

                <Button
                    onClick={nextSlide}
                    disabled={slideIndex === totalSlides - 1}
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
                    onClick={goFullScreen} color="primary"
                    title="Toàn màn hình"
                >
                    <Fullscreen />
                </IconButton>
            </Box>
        </Container>
    );
};

export default KidsSlideshow;
