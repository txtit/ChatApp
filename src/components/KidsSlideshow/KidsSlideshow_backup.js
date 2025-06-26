import React, { useState, useCallback, useEffect, useMemo } from 'react';
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

// CSS animations for beautiful effects
const keyframes = `
@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

// Inject CSS animations
if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
}

const KidsSlideshow = ({ data }) => {
    // console.log("KidsSlideshow received data:", data);

    // Redux progress hooks
    const dispatch = useDispatch();
    const progressState = useSelector(state => state.progress);
    const {
        updateProgressDetail,
        currentSlide: reduxCurrentSlide,
        getCurrentSessionTime
    } = useProgress();    // State cơ bản + state cho bài tập
    // const [currentSlide, setCurrentSlide] = useState(0);
    const [exerciseAnswers, setExerciseAnswers] = useState({});
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showConfetti, setShowConfetti] = useState(false);
    const [score, setScore] = useState(0);

    const [slideIndex, setSlideIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);
    // State cho tạo hình ảnh
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // Nếu muốn hiển thị ảnh tạo ra    // State đơn giản hóa - mỗi slide chỉ có 1 exercise/quiz
    const [currentExerciseData, setCurrentExerciseData] = useState(null);
    const [currentQuizData, setCurrentQuizData] = useState(null);

    const theme = useTheme();    // Trích xuất dữ liệu từ prop data
    const { slides, exercises, quizzes, title, subjectGrade } = data || {};

    // Debug log cho dữ liệu chính
    console.log('🎯 KidsSlideshow data structure:', {
        slides: slides?.length || 0,
        exercises: exercises?.length || 0,
        quizzes: quizzes?.length || 0,
        title,
        subjectGrade
    });
    console.log('📊 Full exercises array:', exercises);
    console.log('📊 Full quizzes array:', quizzes);
    // Load dữ liệu quiz nếu cần - chỉ lấy 1 quiz

    // Calculate total slides and current slide data
    const totalSlides = slides?.length || 0;
    // const currentSlideData = slides ? slides[currentSlide] : null;
    // Redux state và actions
    const {
        currentSlide,
        setSlide,
        updateField,
        markComplete,
        addAttempt
    } = useProgressV2();

    // Slide hiện tại từ props
    // const currentSlideData = slides[slideIndex];    // Cập nhật Redux khi slide thay đổi
const currentSlideData = useMemo(() => {
    if (!slides || slides.length === 0) return {};
    
    const slideData = slides[currentSlide] || {};
    console.log('🔍 Processing slide:', slideData);

    // Merge quiz data
    if (slideData.type === 'quiz' && slideData.quizId && quizzes && quizzes.length > 0) {
        console.log('🔍 Quiz - Looking for quizId:', slideData.quizId);
        console.log('🔍 Quiz - Available quizzes:', quizzes);
        
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
        } else {
            console.log('⚠️ No matching quiz questions found');
        }
    }

    // Merge exercise data - Sửa lại logic này
    if (slideData.type === 'exercise' && slideData.exerciseId) {
        console.log('🔍 Exercise - Looking for exerciseId:', slideData.exerciseId);
        console.log('🔍 Exercise - Available exercises:', exercises);
        
        // Kiểm tra exercises có tồn tại và có length không
        if (exercises && Array.isArray(exercises) && exercises.length > 0) {
            const exerciseQuestions = exercises.filter(e => {
                console.log('🔍 Checking exercise:', e?.id, 'vs', slideData.exerciseId);
                return e && e.id && e.id.startsWith(slideData.exerciseId);
            });
            
            console.log('🔍 Filtered exerciseQuestions:', exerciseQuestions);
            
            if (exerciseQuestions.length > 0) {
                const sortedExercises = exerciseQuestions.sort((a, b) => {
                    const aNum = parseInt(a.id.split('_').pop()) || 0;
                    const bNum = parseInt(b.id.split('_').pop()) || 0;
                    return aNum - bNum;
                });
                
                console.log('🔀 Merged exercise questions:', sortedExercises);
                return { ...slideData, questions: sortedExercises };
            } else {
                console.log('⚠️ No matching exercise questions found');
            }
        } else {
            console.log('⚠️ Exercises array is empty or invalid:', exercises);
        }
        
        // Nếu không tìm thấy exercises hoặc không match, vẫn trả về slideData với questions rỗng
        // ExerciseSlide sẽ xử lý trường hợp này
        return { ...slideData, questions: [] };
    }

    return slideData;
}, [slides, currentSlide, quizzes, exercises]);
    useEffect(() => {
        if (currentSlideData) {
            // Log để debug
            console.log('Slide changed, updating Redux:', currentSlideData);

            // Reset kết quả khi chuyển slide
            setShowResults(false);            // Load dữ liệu exercise nếu cần - chỉ lấy 1 exercise
            if (currentSlideData.type === 'exercise' && exercises && exercises.length > 0) {
                console.log('🔍 Loading exercise data...');
                console.log('🔍 Current slide:', currentSlideData);
                console.log('🔍 Available exercises:', exercises);

                let exerciseData = null;

                // Tìm theo exerciseId nếu có
                if (currentSlideData.exerciseId) {
                    exerciseData = exercises.find(ex => ex.id === currentSlideData.exerciseId);
                    console.log('🔍 Searching by exerciseId:', currentSlideData.exerciseId, 'Found:', exerciseData);
                }

                // Nếu chưa tìm thấy, tìm theo pattern ID
                if (!exerciseData) {
                    const slideIdPattern = currentSlideData.id.replace('slide_', '');
                    exerciseData = exercises.find(ex => ex.id.includes(slideIdPattern));
                    console.log('🔍 Searching by ID pattern:', slideIdPattern, 'Found:', exerciseData);
                }

                // Nếu vẫn chưa tìm thấy, lấy exercise đầu tiên làm mẫu
                if (!exerciseData && exercises.length > 0) {
                    exerciseData = exercises[0];
                    console.log('🔍 Using first exercise as fallback:', exerciseData);
                }

                console.log('✅ Selected exercise:', exerciseData);
                setCurrentExerciseData(exerciseData);

                // Merge exercise data vào currentSlideData - ĐẢM BẢO MERGE THÀNH CÔNG
                if (exerciseData) {
                    console.log('🔀 Merging exercise data into slide...');
                    console.log('📝 Before merge - questions:', currentSlideData.questions);
                    console.log('📝 Before merge - answers:', currentSlideData.answers);

                    // Force merge - tạo object mới để đảm bảo re-render
                    Object.assign(currentSlideData, {
                        questions: exerciseData.questions || [],
                        answers: exerciseData.answers || [],
                        description: exerciseData.description || currentSlideData.description,
                        title: exerciseData.title || currentSlideData.title
                    });

                    console.log('📝 After merge - questions:', currentSlideData.questions);
                    console.log('📝 After merge - answers:', currentSlideData.answers);
                } else {
                    console.warn('❌ No exercise data found for slide:', currentSlideData.id);
                }
            } else {
                setCurrentExerciseData(null);
            }
            if (currentSlideData.type === 'quiz' && quizzes && quizzes.length > 0) {
                console.log('🔍 Loading quiz data...');
                console.log('🔍 Current slide:', currentSlideData);
                console.log('🔍 Available quizzes:', quizzes);

                let quizData = null;

                // Tìm theo quizId nếu có
                if (currentSlideData.quizId) {
                    quizData = quizzes.find(quiz => quiz.id === currentSlideData.quizId);
                    console.log('🔍 Searching by quizId:', currentSlideData.quizId, 'Found:', quizData);
                }

                // Nếu chưa tìm thấy, tìm theo pattern ID
                if (!quizData) {
                    const slideIdPattern = (currentSlideData && currentSlideData.id && typeof currentSlideData.id === 'string')
                        ? currentSlideData.id.replace('slide_', '')
                        : '';
                    quizData = quizzes.find(quiz => quiz.id.includes(slideIdPattern));
                    console.log('🔍 Searching by ID pattern:', slideIdPattern, 'Found:', quizData);
                }

                // Nếu vẫn chưa tìm thấy, lấy quiz đầu tiên làm mẫu
                if (!quizData && quizzes.length > 0) {
                    quizData = quizzes[0];
                    console.log('🔍 Using first quiz as fallback:', quizData);
                }

                console.log('✅ Selected quiz:', quizData);
                setCurrentQuizData(quizData);

                // Merge quiz data vào currentSlideData - ĐẢM BẢO MERGE THÀNH CÔNG
                if (quizData) {
                    console.log('🔀 Merging quiz data into slide...');
                    console.log('🧪 Before merge - questions:', currentSlideData.questions);

                    // Force merge - tạo object mới để đảm bảo re-render
                    Object.assign(currentSlideData, {
                        questions: quizData.questions || [],
                        description: quizData.description || currentSlideData.description,
                        title: quizData.title || currentSlideData.title
                    });

                    console.log('🧪 After merge - questions:', currentSlideData.questions);
                } else {
                    console.warn('❌ No quiz data found for slide:', currentSlideData.id);
                }
            } else {
                setCurrentQuizData(null);
            }

            // Cập nhật thông tin slide vào Redux
            setSlide({
                id: currentSlideData.id,
                title: currentSlideData.title,
                content: currentSlideData.content,
                type: currentSlideData.type,
            });
        }
    }, [currentSlideData, setSlide, exercises, quizzes]);

    // Xử lý chuyển đến slide tiếp theo
    const handleNextSlide = () => {
        // Nếu là slide nội dung, đánh dấu hoàn thành
        if (currentSlideData.type === 'content') {
            markComplete(100); // Content slides luôn hoàn thành với điểm tối đa
        }

        // Chuyển đến slide tiếp theo
        if (slideIndex < slides.length - 1) {
            setSlideIndex(slideIndex + 1);
            setShowResults(false); // Reset kết quả
        }
    };    // Xử lý quay lại slide trước
    const handlePrevSlide = () => {
        if (slideIndex > 0) {
            setSlideIndex(slideIndex - 1);
            setShowResults(false); // Reset kết quả
        }
    };
    // Xử lý kiểm tra đáp án quiz
    const handleCheckQuizAnswers = (answers) => {
        // Tăng số lần thử
        addAttempt();

        // Tính điểm
        let score = 0;
        const totalQuestions = currentSlideData.questions.length;

        currentSlideData.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                score++;
            }
        });

        // Chuyển sang thang điểm 100
        const percentScore = Math.round((score / totalQuestions) * 100);

        // Cập nhật điểm vào Redux
        updateField('score', percentScore);

        // Nếu đạt điểm tối thiểu, đánh dấu là đã hoàn thành
        if (percentScore >= 70) { // Điểm đạt là 70%
            markComplete(percentScore);
        }

        // Hiển thị kết quả
        setShowResults(true);
    };    // Thêm các function còn thiếu
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
    console.log('Redux currentSlide:', currentSlide);    // Render slide content tùy theo loại với giao diện đẹp
    const renderSlideContent = () => {
        if (!currentSlideData) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Không có dữ liệu slide</Typography>
                </Paper>
            );
        }

        // Ô hình ảnh đẹp mắt
        const imageBox = (
            <Card sx={{
                width: 320,
                ml: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
                overflow: 'visible',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
                    borderRadius: 4,
                    zIndex: -1,
                    animation: 'gradient 6s ease infinite',
                    backgroundSize: '400% 400%'
                }
            }}>
                <CardContent sx={{ p: 3, color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Palette sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                            Tạo Hình Ảnh
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            height: 180,
                            borderRadius: 3,
                            background: imageUrl ? 'transparent' : 'rgba(255,255,255,0.1)',
                            border: imageUrl ? 'none' : '2px dashed rgba(255,255,255,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }
                        }}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Generated image"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    borderRadius: 12,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                }}
                            />
                        ) : (
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                <LightbulbOutlined sx={{ fontSize: 40, mb: 1, opacity: 0.7 }} />
                                <Typography sx={{ fontSize: 12, mb: 1, fontWeight: 'bold' }}>
                                    Gợi ý hình ảnh:
                                </Typography>
                                <Typography sx={{
                                    fontSize: 11,
                                    fontStyle: 'italic',
                                    opacity: 0.8,
                                    lineHeight: 1.3,
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '8px',
                                    borderRadius: 2
                                }}>
                                    {currentSlideData?.imagePrompt || "Nhập mô tả để tạo hình ảnh..."}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Stack spacing={1}>
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Nhập mô tả để tạo hình ảnh..."
                            value={imagePrompt}
                            onChange={e => setImagePrompt(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    background: 'rgba(255,255,255,0.9)',
                                    borderRadius: 2,
                                    '&:hover': {
                                        background: 'rgba(255,255,255,1)'
                                    }
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AutoAwesome />}
                            onClick={() => {
                                setImageUrl(imagePrompt ? `https://dummyimage.com/280x180/7c43bd/fff&text=${encodeURIComponent(imagePrompt)}` : "");
                            }}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                                fontWeight: 'bold',
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: 14,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(238, 90, 36, 0.4)'
                                }
                            }}
                        >
                            Tạo Hình Ảnh
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        );

        // Title slide với thiết kế hiện đại
        if (currentSlideData.type === 'title') {
            return (
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch', minHeight: 500 }}>
                    <Card
                        elevation={12}
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 4,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                animation: 'shimmer 3s ease-in-out infinite'
                            }
                        }}
                    >
                        <CardContent sx={{
                            textAlign: 'center',
                            color: 'white',
                            position: 'relative',
                            zIndex: 1,
                            p: 4
                        }}>
                            <Zoom in={true} timeout={1000}>
                                <Box sx={{ mb: 3 }}>
                                    <School sx={{
                                        fontSize: 100,
                                        mb: 2,
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                    }} />
                                </Box>
                            </Zoom>

                            <Typography variant="h3" component="h1"
                                sx={{
                                    fontWeight: 900,
                                    textAlign: 'center',
                                    mb: 3,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                    lineHeight: 1.2
                                }}>
                                {currentSlideData.title}
                            </Typography>

                            <Typography variant="h6"
                                sx={{
                                    opacity: 0.9,
                                    textAlign: 'center',
                                    fontWeight: 400,
                                    mb: 3,
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '12px 24px',
                                    borderRadius: 3,
                                    backdropFilter: 'blur(10px)'
                                }}>
                                {subjectGrade}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                                <Chip
                                    icon={<Star />}
                                    label="Bắt đầu học"
                                    sx={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        padding: '8px 16px',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.3)'
                                        }
                                    }}
                                />
                                <Chip
                                    icon={<EmojiEvents />}
                                    label={`${totalSlides} slides`}
                                    sx={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        padding: '8px 16px'
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                    {imageBox}
                </Box>
            );
        }        // Quiz slide - đơn giản không có navigation
        if (currentSlideData.type === 'quiz') {
            console.log('🧪 Quiz slide data:', currentSlideData);
            console.log('🧪 Quiz questions:', currentSlideData.questions);

            return (
                <QuizSlide
                    data={currentSlideData}
                    onSubmit={handleCheckQuizAnswers}
                    showResults={showResults}
                />
            );
        }

        // Exercise slide - đơn giản không có navigation
        if (currentSlideData.type === 'exercise') {
            console.log('📝 Exercise slide data:', currentSlideData);
            console.log('📝 Exercise questions:', currentSlideData.questions);

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
        }

        // Content slide với giao diện đẹp
        return (
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
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Nội dung slide bên trái */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" component="h2"
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.primary.dark,
                                mb: 3,
                            }}>
                            {currentSlideData.title}
                        </Typography>

                        {currentSlideData.content && (
                            <Box sx={{ mb: 3 }}>
                                {Array.isArray(currentSlideData.content) ? (
                                    currentSlideData.content.map((item, index) => (
                                        <Typography
                                            key={index}
                                            variant="body1"
                                            sx={{
                                                mb: 2,
                                                fontSize: '1.2rem',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {typeof item === 'string' ? item : JSON.stringify(item)}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: '1.2rem',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {currentSlideData.content}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* Ô hình ảnh bên phải */}
                    {imageBox}
                </Box>
            </Paper>
        );
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
            </Box>            {/* Nội dung slide */}
            <Box sx={{
                bgcolor: 'white',
                p: 3,
                borderRadius: 4,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                position: 'relative',
                mt: 2,
                animation: 'fadeInUp 0.6s ease-out',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(124, 67, 189, 0.1)'
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #7c43bd, #667eea)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        textShadow: 'none'
                    }}
                >
                    {title || "Bài học tương tác"}
                </Typography>

                {/* Hiển thị ảnh đã tạo nếu có */}
                {imageUrl && (
                    <Box sx={{
                        mb: 3,
                        textAlign: 'center',
                        animation: 'fadeInUp 0.8s ease-out'
                    }}>
                        <img
                            src={imageUrl}
                            alt="Generated content"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                border: '3px solid rgba(124, 67, 189, 0.2)'
                            }}
                        />
                    </Box>
                )}

                {/* Render slide content */}
                {renderSlideContent()}
            </Box>            {/* Navigation buttons */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3,
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(124, 67, 189, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)',
                border: '1px solid rgba(124, 67, 189, 0.1)'
            }}>
                <Button
                    onClick={prevSlide}
                    disabled={slideIndex === 0}
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        border: '2px solid',
                        borderColor: slideIndex === 0 ? 'rgba(0,0,0,0.12)' : '#7c43bd',
                        color: slideIndex === 0 ? 'rgba(0,0,0,0.26)' : '#7c43bd',
                        '&:hover': {
                            background: slideIndex === 0 ? 'transparent' : 'rgba(124, 67, 189, 0.1)',
                            transform: slideIndex === 0 ? 'none' : 'translateY(-2px)',
                            boxShadow: slideIndex === 0 ? 'none' : '0 4px 12px rgba(124, 67, 189, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Trước
                </Button>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'linear-gradient(135deg, #7c43bd, #667eea)',
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(124, 67, 189, 0.3)'
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {slideIndex + 1} / {totalSlides}
                    </Typography>
                </Box>

                <Button
                    onClick={nextSlide}
                    disabled={slideIndex === totalSlides - 1}
                    endIcon={<ArrowForward />}
                    variant="contained"
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        background: slideIndex === totalSlides - 1
                            ? 'rgba(0,0,0,0.12)'
                            : 'linear-gradient(135deg, #7c43bd, #667eea)',
                        '&:hover': {
                            background: slideIndex === totalSlides - 1
                                ? 'rgba(0,0,0,0.12)'
                                : 'linear-gradient(135deg, #667eea, #7c43bd)',
                            transform: slideIndex === totalSlides - 1 ? 'none' : 'translateY(-2px)',
                            boxShadow: slideIndex === totalSlides - 1
                                ? 'none'
                                : '0 6px 16px rgba(124, 67, 189, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                    }}
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
                <Fab
                    onClick={goFullScreen}
                    color="primary"
                    title="Toàn màn hình"
                    sx={{
                        background: 'linear-gradient(135deg, #7c43bd, #667eea)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #667eea, #7c43bd)',
                            transform: 'scale(1.1)',
                            boxShadow: '0 8px 20px rgba(124, 67, 189, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Fullscreen />
                </Fab>
            </Box>
        </Container>
    );
};

// export default KidsSlideshow;
//         if (!currentExercise) return false;

//         // Track exercise attempt
//         if (updateProgressDetail) {
//             dispatch(updateProgressDetail({
//                 field: 'attempts',
//                 value: (reduxCurrentSlide?.attempts || 0) + 1
//             }));
//         }

//         let correct = 0;
//         let total = currentExercise.questions.length;

//         currentExercise.questions.forEach((_, index) => {
//             const answer = exerciseAnswers[`${currentSlide}_${index}`]?.toLowerCase() || '';
//             const correctAnswer = currentExercise.answers[index]?.toLowerCase() || '';

//             if (answer === correctAnswer) {
//                 correct++;
//             }
//         });

//         const exerciseScore = (correct / total) * 100;
//         setScore(exerciseScore);
//         setShowResults(true);

//         // Track exercise score
//         if (updateProgressDetail) {
//             updateProgressDetail({
//                 field: 'score',
//                 value: exerciseScore
//             });

//             // Track completion and feedback
//             if (exerciseScore >= 70) {
//                 updateProgressDetail({
//                     field: 'isCompleted',
//                     value: true
//                 });

//                 updateProgressDetail({
//                     field: 'feedback',
//                     value: exerciseScore >= 90 ? '🎉 Xuất sắc!' : '👏 Tốt lắm!'
//                 });
//             } else {
//                 updateProgressDetail({
//                     field: 'feedback',
//                     value: '💪 Hãy thử lại!'
//                 });
//             }
//         }

//         // Show confetti for perfect score
//         if (exerciseScore === 100) {
//             setShowConfetti(true);
//             setTimeout(() => setShowConfetti(false), 3000);
//         }

//         return correct === total;
//     };

//     const checkQuizAnswers = () => {
//         if (!currentQuiz) return false;

//         // Track quiz attempt
//         if (updateProgressDetail) {
//             updateProgressDetail({
//                 field: 'attempts',
//                 value: (reduxCurrentSlide?.attempts || 0) + 1
//             });
//         }

//         let correct = 0;
//         let total = currentQuiz.length;

//         currentQuiz.forEach((quiz, index) => {
//             const selectedOption = quizAnswers[`${currentSlide}_${index}`];
//             const selectedIndex = parseInt(selectedOption);

//             console.log(`🧪 Quiz ${index + 1}:`, {
//                 question: quiz.question,
//                 selectedOption: selectedOption,
//                 selectedIndex: selectedIndex,
//                 correctOption: quiz.correctOption,
//                 isCorrect: selectedIndex === quiz.correctOption
//             });

//             if (selectedIndex === quiz.correctOption) {
//                 correct++;
//             }
//         });

//         const quizScore = (correct / total) * 100;
//         setScore(quizScore);
//         setShowResults(true);

//         // Track quiz score
//         if (updateProgressDetail) {
//             updateProgressDetail({
//                 field: 'score',
//                 value: quizScore
//             });

//             // Track completion and feedback
//             if (quizScore >= 70) {
//                 updateProgressDetail({
//                     field: 'isCompleted',
//                     value: true
//                 });

//                 updateProgressDetail({
//                     field: 'feedback',
//                     value: quizScore >= 90 ? '🎉 Xuất sắc!' : '👏 Tốt lắm!'
//                 });
//             } else {
//                 updateProgressDetail({
//                     field: 'feedback',
//                     value: '💪 Hãy thử lại!'
//                 });
//             }
//         }

//         // Show confetti for perfect score
//         if (quizScore === 100) {
//             setShowConfetti(true);
//             setTimeout(() => setShowConfetti(false), 3000);
//         }

//         console.log(`🧪 Quiz Results: ${correct}/${total} = ${quizScore}%`);
//         return correct === total;
//     };

//     const nextSlide = () => {
//         // Track end time
//         if (updateProgressDetail) {
//             updateProgressDetail({
//                 field: 'endTime',
//                 value: Date.now()
//             });
//         }

//         if (currentSlide < totalSlides - 1) {
//             // Kiểm tra nếu slide hiện tại là exercise hoặc quiz và chưa nộp bài
//             if ((currentSlideData?.type === 'exercise' && currentExercise && !showResults) ||
//                 (currentSlideData?.type === 'quiz' && currentQuiz && !showResults)) {
//                 // Yêu cầu nộp bài trước khi chuyển slide
//                 if (window.confirm('Bạn muốn nộp bài trước khi chuyển slide không?')) {
//                     if (currentSlideData?.type === 'exercise') {
//                         checkExerciseAnswers();
//                     } else if (currentSlideData?.type === 'quiz') {
//                         checkQuizAnswers();
//                     }
//                 }
//                 return;
//             }

//             setCurrentSlide(currentSlide + 1);
//             setShowResults(false);
//         }
//     };

//     const prevSlide = () => {
//         // Track end time
//         if (updateProgressDetail) {
//             updateProgressDetail({
//                 field: 'endTime',
//                 value: Date.now()
//             });
//         }

//         if (currentSlide > 0) {
//             setCurrentSlide(currentSlide - 1);
//             setShowResults(false);
//         }
//     };

//     const goFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//         }
//     };    // Render slide content với exercise và quiz
//     const renderSlideContent = () => {
//         if (!currentSlideData) {
//             return (
//                 <Paper sx={{ p: 4, textAlign: 'center' }}>
//                     <Typography variant="h6">Không có dữ liệu slide</Typography>
//                 </Paper>
//             );
//         }        // Ô hình ảnh và tạo hình ảnh với thiết kế đẹp hơn
//         const imageBox = (
//             <Card sx={{
//                 width: 320,
//                 ml: 2,
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 borderRadius: 4,
//                 overflow: 'visible',
//                 position: 'relative',
//                 '&::before': {
//                     content: '""',
//                     position: 'absolute',
//                     top: -2,
//                     left: -2,
//                     right: -2,
//                     bottom: -2,
//                     background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
//                     borderRadius: 4,
//                     zIndex: -1,
//                     animation: 'gradient 6s ease infinite',
//                     backgroundSize: '400% 400%'
//                 }
//             }}>
//                 <CardContent sx={{ p: 3, color: 'white' }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                         <Palette sx={{ mr: 1, fontSize: 20 }} />
//                         <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>
//                             Tạo Hình Ảnh
//                         </Typography>
//                     </Box>

//                     <Box
//                         sx={{
//                             width: '100%',
//                             height: 180,
//                             borderRadius: 3,
//                             background: imageUrl ? 'transparent' : 'rgba(255,255,255,0.1)',
//                             border: imageUrl ? 'none' : '2px dashed rgba(255,255,255,0.3)',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             mb: 2,
//                             backdropFilter: 'blur(10px)',
//                             transition: 'all 0.3s ease',
//                             '&:hover': {
//                                 transform: 'scale(1.02)',
//                                 boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
//                             }
//                         }}
//                     >
//                         {imageUrl ? (
//                             <img
//                                 src={imageUrl}
//                                 alt="Generated image"
//                                 style={{
//                                     maxWidth: '100%',
//                                     maxHeight: '100%',
//                                     borderRadius: 12,
//                                     boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
//                                 }}
//                             />
//                         ) : (
//                             <Box sx={{ textAlign: 'center', p: 2 }}>
//                                 <LightbulbOutlined sx={{ fontSize: 40, mb: 1, opacity: 0.7 }} />
//                                 <Typography sx={{ fontSize: 12, mb: 1, fontWeight: 'bold' }}>
//                                     Gợi ý hình ảnh:
//                                 </Typography>
//                                 <Typography sx={{
//                                     fontSize: 11,
//                                     fontStyle: 'italic',
//                                     opacity: 0.8,
//                                     lineHeight: 1.3,
//                                     background: 'rgba(255,255,255,0.1)',
//                                     padding: '8px',
//                                     borderRadius: 2
//                                 }}>
//                                     {currentSlideData?.imagePrompt || "Nhập mô tả để tạo hình ảnh..."}
//                                 </Typography>
//                             </Box>
//                         )}
//                     </Box>

//                     {/* Chip gợi ý với hiệu ứng đẹp */}
//                     {currentSlideData?.imagePrompt && (
//                         <Chip
//                             label={currentSlideData.imagePrompt}
//                             onClick={() => setImagePrompt(currentSlideData.imagePrompt)}
//                             sx={{
//                                 mb: 2,
//                                 fontSize: 10,
//                                 height: 'auto',
//                                 width: '100%',
//                                 padding: '8px',
//                                 background: 'rgba(255,255,255,0.2)',
//                                 color: 'white',
//                                 backdropFilter: 'blur(10px)',
//                                 border: '1px solid rgba(255,255,255,0.3)',
//                                 cursor: 'pointer',
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                     background: 'rgba(255,255,255,0.3)',
//                                     transform: 'translateY(-2px)'
//                                 },
//                                 '& .MuiChip-label': {
//                                     whiteSpace: 'normal',
//                                     textAlign: 'center',
//                                     lineHeight: 1.2
//                                 }
//                             }}
//                         />
//                     )}

//                     <Stack spacing={1}>
//                         <TextField
//                             size="small"
//                             variant="outlined"
//                             placeholder="Nhập mô tả để tạo hình ảnh..."
//                             value={imagePrompt}
//                             onChange={e => setImagePrompt(e.target.value)}
//                             sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                     background: 'rgba(255,255,255,0.9)',
//                                     borderRadius: 2,
//                                     '&:hover': {
//                                         background: 'rgba(255,255,255,1)'
//                                     }
//                                 }
//                             }}
//                         />
//                         <Button
//                             variant="contained"
//                             startIcon={<AutoAwesome />}
//                             onClick={() => {
//                                 setImageUrl(imagePrompt ? `https://dummyimage.com/280x180/7c43bd/fff&text=${encodeURIComponent(imagePrompt)}` : "");
//                             }}
//                             sx={{
//                                 background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
//                                 fontWeight: 'bold',
//                                 py: 1.5,
//                                 borderRadius: 2,
//                                 textTransform: 'none',
//                                 fontSize: 14,
//                                 '&:hover': {
//                                     background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
//                                     transform: 'translateY(-2px)',
//                                     boxShadow: '0 6px 20px rgba(238, 90, 36, 0.4)'
//                                 }
//                             }}
//                         >
//                             Tạo Hình Ảnh
//                         </Button>
//                     </Stack>
//                 </CardContent>
//             </Card>
//         );        // Title slide với thiết kế hiện đại
//         if (currentSlideData.type === 'title') {
//             return (
//                 <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch', minHeight: 500 }}>
//                     <Card
//                         elevation={12}
//                         sx={{
//                             flex: 1,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                             borderRadius: 4,
//                             position: 'relative',
//                             overflow: 'hidden',
//                             '&::before': {
//                                 content: '""',
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 bottom: 0,
//                                 background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
//                                 animation: 'shimmer 3s ease-in-out infinite'
//                             }
//                         }}
//                     >
//                         <CardContent sx={{
//                             textAlign: 'center',
//                             color: 'white',
//                             position: 'relative',
//                             zIndex: 1,
//                             p: 4
//                         }}>
//                             <Zoom in={true} timeout={1000}>
//                                 <Box sx={{ mb: 3 }}>
//                                     <School sx={{
//                                         fontSize: 100,
//                                         mb: 2,
//                                         filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
//                                     }} />
//                                 </Box>
//                             </Zoom>

//                             <Typography variant="h3" component="h1"
//                                 sx={{
//                                     fontWeight: 900,
//                                     textAlign: 'center',
//                                     mb: 3,
//                                     textShadow: '0 2px 4px rgba(0,0,0,0.3)',
//                                     lineHeight: 1.2
//                                 }}>
//                                 {currentSlideData.title}
//                             </Typography>

//                             <Typography variant="h6"
//                                 sx={{
//                                     opacity: 0.9,
//                                     textAlign: 'center',
//                                     fontWeight: 400,
//                                     mb: 3,
//                                     background: 'rgba(255,255,255,0.1)',
//                                     padding: '12px 24px',
//                                     borderRadius: 3,
//                                     backdropFilter: 'blur(10px)'
//                                 }}>
//                                 {subjectGrade}
//                             </Typography>

//                             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
//                                 <Chip
//                                     icon={<Star />}
//                                     label="Bắt đầu học"
//                                     sx={{
//                                         background: 'rgba(255,255,255,0.2)',
//                                         color: 'white',
//                                         fontWeight: 'bold',
//                                         fontSize: 14,
//                                         padding: '8px 16px',
//                                         '&:hover': {
//                                             background: 'rgba(255,255,255,0.3)'
//                                         }
//                                     }}
//                                 />
//                                 <Chip
//                                     icon={<EmojiEvents />}
//                                     label={`${totalSlides} slides`}
//                                     sx={{
//                                         background: 'rgba(255,255,255,0.2)',
//                                         color: 'white',
//                                         fontWeight: 'bold',
//                                         fontSize: 14,
//                                         padding: '8px 16px'
//                                     }}
//                                 />
//                             </Box>
//                         </CardContent>
//                     </Card>
//                     {imageBox}                </Box>
//             );
//         }

//         // Exercise slide
//         if (currentSlideData.type === 'exercise') {
//             if (!currentExercise) {
//                 return (
//                     <Paper sx={{ p: 4, textAlign: 'center' }}>
//                         <Typography variant="h6">Không tìm thấy bài tập cho slide này</Typography>
//                     </Paper>
//                 );
//             }

//             return (<Paper
//                 elevation={6}
//                 sx={{
//                     p: 4,
//                     minHeight: 400,
//                     background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
//                     borderRadius: '20px',
//                     mt: 2
//                 }}
//             >
//                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
//                     <Star sx={{ fontSize: 40, color: theme.palette.warning.main, mr: 2 }} />
//                     <Typography variant="h4"
//                         sx={{
//                             fontWeight: 'bold',
//                             color: theme.palette.primary.dark,
//                             fontFamily: 'Comic Sans MS, cursive',
//                             letterSpacing: 1
//                         }}>
//                         Bài Tập
//                     </Typography>
//                 </Box>

//                 {currentExercise.questions.map((question, index) => {
//                     const userAnswer = exerciseAnswers[`${currentSlide}_${index}`] || '';
//                     const correctAnswer = currentExercise.answers[index] || '';
//                     const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
//                     return (
//                         <Box key={index} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#fff', boxShadow: 1, border: isCorrect && showResults ? '2px solid #43a047' : showResults ? '2px solid #e53935' : '2px solid #e1bee7' }}>
//                             <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#7c43bd' }}>
//                                 Câu {index + 1}: {question}
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 variant="outlined"
//                                 placeholder="Nhập câu trả lời..."
//                                 value={userAnswer}
//                                 onChange={(e) => setExerciseAnswers({
//                                     ...exerciseAnswers,
//                                     [`${currentSlide}_${index}`]: e.target.value
//                                 })}
//                                 sx={{ mb: 1, background: '#f8fafd', borderRadius: 1 }}
//                                 disabled={showResults}
//                             />
//                             {showResults && (
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                                     {isCorrect ? (
//                                         <>
//                                             <span style={{ color: '#43a047', fontWeight: 'bold', marginRight: 8 }}>✔ Đúng!</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <span style={{ color: '#e53935', fontWeight: 'bold', marginRight: 8 }}>✘ Sai.</span>
//                                             <span style={{ color: '#1565c0', fontWeight: 'bold' }}>Đáp án đúng: {correctAnswer}</span>
//                                         </>
//                                     )}
//                                 </Box>
//                             )}
//                         </Box>
//                     );
//                 })}

//                 {!showResults && (
//                     <Box sx={{ textAlign: 'center', mt: 3 }}>
//                         <Button
//                             variant="contained"
//                             size="large"
//                             onClick={checkExerciseAnswers}
//                             sx={{ px: 4, py: 2, fontWeight: 'bold', fontFamily: 'Comic Sans MS, cursive', background: 'linear-gradient(90deg,#7c43bd,#43a047)', color: '#fff' }}
//                         >
//                             Kiểm tra đáp án
//                         </Button>
//                     </Box>
//                 )}

//                 {showResults && (
//                     <Paper
//                         sx={{
//                             p: 3,
//                             mt: 3,
//                             bgcolor: score >= 80 ? 'success.light' : 'warning.light',
//                             textAlign: 'center',
//                             borderRadius: 2
//                         }}
//                     >
//                         <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: score >= 80 ? '#43a047' : '#e53935' }}>
//                             {score >= 80 ? 'Xuất sắc!' : 'Cần cố gắng thêm!'}
//                         </Typography>
//                         <Typography variant="h6" sx={{ color: '#333' }}>
//                             Điểm số: {score.toFixed(0)}/100
//                         </Typography>
//                     </Paper>
//                 )}
//             </Paper>
//             );
//         }

//         // Quiz slide
//         if (currentSlideData.type === 'quiz') {
//             if (!currentQuiz) {
//                 return (
//                     <Paper sx={{ p: 4, textAlign: 'center' }}>
//                         <Typography variant="h6">Không tìm thấy quiz cho slide này</Typography>
//                     </Paper>
//                 );
//             }

//             return (<Paper
//                 elevation={6}
//                 sx={{
//                     p: 4,
//                     minHeight: 400,
//                     background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
//                     borderRadius: '20px',
//                     mt: 2
//                 }}
//             >
//                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
//                     <EmojiEvents sx={{ fontSize: 40, color: theme.palette.success.main, mr: 2 }} />
//                     <Typography variant="h4"
//                         sx={{
//                             fontWeight: 'bold',
//                             color: theme.palette.primary.dark,
//                         }}>
//                         Quiz
//                     </Typography>
//                 </Box>

//                 {currentQuiz.map((quiz, index) => (
//                     <Box key={index} sx={{ mb: 4 }}>
//                         <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//                             Câu {index + 1}: {quiz.question}
//                         </Typography>
//                         <FormControl component="fieldset">
//                             <RadioGroup
//                                 value={quizAnswers[`${currentSlide}_${index}`] || ''}
//                                 onChange={(e) => setQuizAnswers({
//                                     ...quizAnswers,
//                                     [`${currentSlide}_${index}`]: e.target.value
//                                 })}
//                             >
//                                 {quiz.options.map((option, optIndex) => (
//                                     <FormControlLabel
//                                         key={optIndex}
//                                         value={optIndex.toString()}
//                                         control={<Radio />}
//                                         label={option}
//                                         sx={{ mb: 1 }}
//                                     />
//                                 ))}
//                             </RadioGroup>
//                         </FormControl>
//                     </Box>
//                 ))}

//                 {!showResults && (
//                     <Box sx={{ textAlign: 'center', mt: 3 }}>
//                         <Button
//                             variant="contained"
//                             size="large"
//                             onClick={checkQuizAnswers}
//                             sx={{ px: 4, py: 2 }}
//                         >
//                             Xem kết quả
//                         </Button>
//                     </Box>
//                 )}                    {showResults && (
//                     <Paper
//                         sx={{
//                             p: 3,
//                             mt: 3,
//                             bgcolor: score >= 80 ? 'success.light' : 'warning.light'
//                         }}
//                     >
//                         <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
//                             {score >= 80 ? 'Tuyệt vời!' : 'Hãy thử lại!'}
//                         </Typography>
//                         <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
//                             Điểm số: {score.toFixed(0)}/100
//                         </Typography>

//                         {/* Hiển thị đáp án đúng cho quiz */}
//                         <Box sx={{ mt: 2 }}>
//                             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.dark' }}>
//                                 Đáp án đúng:
//                             </Typography>                            {currentQuiz.map((quiz, index) => {
//                                 const userAnswer = quizAnswers[`${currentSlide}_${index}`];
//                                 const correctAnswerIndex = quiz.correctOption;
//                                 const correctAnswerText = quiz.options[correctAnswerIndex];
//                                 const userAnswerText = userAnswer !== undefined ? quiz.options[parseInt(userAnswer)] : '';
//                                 const isCorrect = parseInt(userAnswer) === correctAnswerIndex;

//                                 return (
//                                     <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
//                                         <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
//                                             Câu {index + 1}: {quiz.question}
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ mb: 1 }}>
//                                             <strong>Lựa chọn của bạn:</strong>
//                                             <span style={{
//                                                 color: isCorrect ? 'green' : 'red',
//                                                 marginLeft: '8px'
//                                             }}>
//                                                 {userAnswerText || '(Chưa chọn)'}
//                                             </span>
//                                         </Typography>
//                                         <Typography variant="body2">
//                                             <strong>Đáp án đúng:</strong>
//                                             <span style={{ color: 'green', marginLeft: '8px' }}>
//                                                 {correctAnswerText}
//                                             </span>
//                                         </Typography>
//                                     </Box>
//                                 );
//                             })}
//                         </Box>
//                     </Paper>
//                 )}
//             </Paper>
//             );
//         }        // Content slide hoặc bất kỳ loại slide nào khác
//         return (
//             <Paper
//                 elevation={4}
//                 sx={{
//                     p: 4,
//                     minHeight: 400,
//                     background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
//                     borderRadius: '20px',
//                     mt: 2
//                 }}
//             >
//                 <Box sx={{ display: 'flex', gap: 2 }}>
//                     {/* Nội dung slide bên trái */}
//                     <Box sx={{ flex: 1 }}>
//                         <Typography variant="h4" component="h2"
//                             sx={{
//                                 fontWeight: 'bold',
//                                 color: theme.palette.primary.dark,
//                                 mb: 3,
//                             }}>
//                             {currentSlideData.title}
//                         </Typography>

//                         {currentSlideData.content && (
//                             <Box sx={{ mb: 3 }}>
//                                 {Array.isArray(currentSlideData.content) ? (
//                                     currentSlideData.content.map((item, index) => (
//                                         <Typography
//                                             key={index}
//                                             variant="body1"
//                                             sx={{
//                                                 mb: 2,
//                                                 fontSize: '1.2rem',
//                                                 lineHeight: 1.6,
//                                             }}
//                                         >
//                                             {item}
//                                         </Typography>
//                                     ))
//                                 ) : (
//                                     <Typography
//                                         variant="body1"
//                                         sx={{
//                                             fontSize: '1.2rem',
//                                             lineHeight: 1.6,
//                                         }}
//                                     >
//                                         {currentSlideData.content}
//                                     </Typography>
//                                 )}
//                             </Box>
//                         )}
//                     </Box>

//                     {/* Ô hình ảnh bên phải */}
//                     {imageBox}
//                 </Box>
//             </Paper>
//         );
//     };

//     const extractGroupId = (id) => {
//         // Lấy phần giữa dấu "_" đầu tiên và cuối cùng
//         if (!id) return "";
//         const parts = id.split("_");
//         // Nếu id dạng "slide_xxx_4" hoặc "ex_xxx_1"
//         return parts.length === 3 ? parts[1] : "";
//     };

//     // Tìm bài tập liên quan đến slide hiện tại
//     const currentExercise = currentSlideData?.type === 'exercise' && exercises
//         ? exercises.find(ex => {
//             const slideGroup = extractGroupId(currentSlideData.exerciseId || currentSlideData.id);
//             const exGroup = extractGroupId(ex.id);
//             if (slideGroup && exGroup && slideGroup === exGroup) {
//                 return true;
//             }
//             // So sánh bằng exerciseId nếu có
//             if (currentSlideData.exerciseId !== undefined && ex.id !== undefined) {
//                 return currentSlideData.exerciseId === ex.id;
//             }
//             return false;
//         })
//         : null;    // Tìm quiz liên quan đến slide hiện tại
//     const currentQuiz = currentSlideData?.type === 'quiz' && quizzes
//         ? (() => {
//             // Kiểm tra nếu quizzes là mảng câu hỏi trực tiếp (từ API)
//             if (Array.isArray(quizzes) && quizzes.length > 0 && quizzes[0].question) {
//                 console.log("🧪 Using direct quiz array from API");
//                 return quizzes; // Trả về toàn bộ mảng câu hỏi
//             }

//             // Nếu quizzes là mảng các object quiz (từ sample data)
//             const foundQuiz = quizzes.find(quiz => {
//                 // Ưu tiên tìm theo quizId
//                 if (currentSlideData.quizId && quiz.id === currentSlideData.quizId) {
//                     return true;
//                 }
//                 // Fallback: tìm theo group ID
//                 const slideGroup = extractGroupId(currentSlideData.quizId || currentSlideData.id);
//                 const quizGroup = extractGroupId(quiz.id);
//                 if (slideGroup && quizGroup && slideGroup === quizGroup) {
//                     return true;
//                 }
//                 // Fallback cuối: lấy quiz đầu tiên nếu không tìm thấy
//                 return quizzes.indexOf(quiz) === 0;
//             });

//             return foundQuiz?.questions || null;
//         })() : null;    // Debug currentQuiz
//     console.log("🧪 Current Quiz:", {
//         currentQuiz,
//         hasCurrentQuiz: !!currentQuiz,
//         quizLength: currentQuiz?.length,
//         slideType: currentSlideData?.type, quizSample: currentQuiz?.[0] // Log first question for debugging
//     });

//     // New helper function to process exercise answers
//     const processExerciseAnswers = () => {
//         if (!currentExercise) return;

//         let exerciseCorrect = 0;
//         let exerciseTotal = currentExercise.questions.length;

//         currentExercise.questions.forEach((_, index) => {
//             const answer = exerciseAnswers[`${currentSlide}_${index}`]?.toLowerCase() || '';
//             const correctAnswer = currentExercise.answers[index]?.toLowerCase() || '';
//             if (answer === correctAnswer) {
//                 exerciseCorrect++;
//             }
//         });

//         const exerciseScore = (exerciseCorrect / exerciseTotal) * 100;
//         setScore(exerciseScore);
//         setShowResults(true);

//         // ✅ Track exercise score
//         if (typeof updateProgressDetail === 'function') {
//             updateProgressDetail({
//                 field: 'score',
//                 value: exerciseScore
//             });        // ✅ Track completion and feedback
//             if (exerciseScore >= 70) {
//                 updateProgressDetail({
//                     field: 'isCompleted',
//                     value: true
//                 });

//                 updateProgressDetail({
//                     field: 'feedback',
//                     value: exerciseScore >= 90 ? '🎉 Xuất sắc!' : '👏 Tốt lắm!'
//                 });
//             } else {
//                 updateProgressDetail({
//                     field: 'feedback',
//                     value: '💪 Hãy thử lại!'
//                 });
//             }
//         }

//         // Show confetti for perfect score
//         if (exerciseScore === 100) {
//             setShowConfetti(true);
//             setTimeout(() => setShowConfetti(false), 3000);
//         }
//         // Log exercise results
//         console.log(`📝 Exercise Results: ${exerciseScore}%`);
//         return exerciseScore === 100;
//     }; // End of processExerciseAnswers function

//     // Track slide changes
//     useEffect(() => {
//         if (typeof updateProgressDetail === 'function' && currentSlideData) {
//             updateProgressDetail({
//                 field: 'slideIndex',
//                 value: currentSlide
//             });

//             updateProgressDetail({
//                 field: 'startTime',
//                 value: Date.now()
//             });
//         }
//     }, [currentSlide, currentSlideData, updateProgressDetail]);

//     // Main component return
//     return (
//         <Container maxWidth="lg" sx={{ py: 4 }}>
//             {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

//             {/* Số slide ở trên cùng và ô tạo hình ảnh */}
//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 mb: 2,
//                 px: 2
//             }}>
//                 <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#7c43bd', fontFamily: 'Comic Sans MS, cursive' }}>
//                     Slide {currentSlide + 1} / {totalSlides}
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <TextField
//                         size="small"
//                         variant="outlined"
//                         placeholder="Nhập mô tả để tạo hình ảnh..."
//                         value={imagePrompt}
//                         onChange={e => setImagePrompt(e.target.value)}
//                         sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 220 }}
//                     />
//                     <Button
//                         variant="contained"
//                         color="secondary"
//                         sx={{ fontWeight: 'bold', fontFamily: 'Comic Sans MS, cursive', px: 2, py: 1 }}
//                         onClick={() => {
//                             setImageUrl(imagePrompt ? `https://dummyimage.com/400x200/7c43bd/fff&text=${encodeURIComponent(imagePrompt)}` : "");
//                         }}
//                     >
//                         Tạo hình ảnh
//                     </Button>
//                 </Box>
//             </Box>

//             {/* Nội dung slide */}
//             <Box sx={{
//                 bgcolor: 'white',
//                 p: 3,
//                 borderRadius: 4,
//                 boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
//                 position: 'relative',
//                 mt: 2
//             }}>
//                 <Typography
//                     variant="h5"
//                     sx={{
//                         mb: 2,
//                         color: theme.palette.primary.main
//                     }}
//                 >
//                     {title || "Bài học tương tác"}
//                 </Typography>

//                 {/* Render slide content */}
//                 {renderSlideContent()}
//             </Box>

//             {/* Navigation buttons */}
//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 mt: 3
//             }}>
//                 <Button
//                     onClick={prevSlide}
//                     disabled={currentSlide === 0}
//                     startIcon={<ArrowBack />}
//                     variant="outlined"
//                 >
//                     Trước
//                 </Button>

//                 <Typography variant="body2" color="text.secondary">
//                     {currentSlide + 1} / {totalSlides}
//                 </Typography>

//                 <Button
//                     onClick={nextSlide}
//                     disabled={currentSlide === totalSlides - 1}
//                     endIcon={<ArrowForward />}
//                     variant="contained"
//                 >
//                     Tiếp
//                 </Button>
//             </Box>

//             {/* Action buttons */}
//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 gap: 2,
//                 mt: 2
//             }}>
//                 <IconButton
//                     onClick={goFullScreen} color="primary"
//                     title="Toàn màn hình"
//                 >
//                     <Fullscreen />
//                 </IconButton>
//             </Box>
//         </Container>
//     );
// };

export default KidsSlideshow;
