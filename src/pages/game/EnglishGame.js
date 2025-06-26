import {
    Box, Typography, Card, CardContent, Button, Grid, Avatar, LinearProgress,
    Chip, Dialog, DialogContent, DialogTitle, IconButton, Alert, Fade, Zoom,
    Stack, Paper, Divider
} from '@mui/material';
import {
    Translate, VolumeUp, CheckCircle, Cancel, Star, Refresh, Home, Timer,
    PlayArrow, Pause, SkipNext, EmojiEvents, LocalFireDepartment,
    School, TrendingUp, WhatsApp
} from '@mui/icons-material';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSound from '../../hooks/useSound';

const EnglishGame = () => {
    const navigate = useNavigate();
    const { preloadAudio, playSound, stopSound, playBackgroundMusic } = useSound();

    // Game states
    const [gameStarted, setGameStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [gameEnded, setGameEnded] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [level, setLevel] = useState(1);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const timerRef = useRef();
    const speechSynthRef = useRef();

    // Word bank với nhiều từ vựng phong phú
    const wordBank = [
        // Level 1 - Basic words
        { word: "Apple", meaning: "Quả táo", category: "Fruit", level: 1, emoji: "🍎" },
        { word: "Cat", meaning: "Con mèo", category: "Animal", level: 1, emoji: "🐱" },
        { word: "Dog", meaning: "Con chó", category: "Animal", level: 1, emoji: "🐶" },
        { word: "Book", meaning: "Cuốn sách", category: "Object", level: 1, emoji: "📚" },
        { word: "Car", meaning: "Xe hơi", category: "Vehicle", level: 1, emoji: "🚗" },
        { word: "House", meaning: "Ngôi nhà", category: "Building", level: 1, emoji: "🏠" },
        { word: "Water", meaning: "Nước", category: "Nature", level: 1, emoji: "💧" },
        { word: "Sun", meaning: "Mặt trời", category: "Nature", level: 1, emoji: "☀️" },

        // Level 2 - Intermediate words
        { word: "Beautiful", meaning: "Đẹp", category: "Adjective", level: 2, emoji: "✨" },
        { word: "Computer", meaning: "Máy tính", category: "Technology", level: 2, emoji: "💻" },
        { word: "Elephant", meaning: "Con voi", category: "Animal", level: 2, emoji: "🐘" },
        { word: "Rainbow", meaning: "Cầu vồng", category: "Nature", level: 2, emoji: "🌈" },
        { word: "Guitar", meaning: "Đàn guitar", category: "Music", level: 2, emoji: "🎸" },
        { word: "Butterfly", meaning: "Con bướm", category: "Animal", level: 2, emoji: "🦋" },
        { word: "Adventure", meaning: "Cuộc phiêu lưu", category: "Action", level: 2, emoji: "🗺️" },
        { word: "Friendship", meaning: "Tình bạn", category: "Emotion", level: 2, emoji: "🤝" },

        // Level 3 - Advanced words
        { word: "Magnificent", meaning: "Tráng lệ", category: "Adjective", level: 3, emoji: "👑" },
        { word: "Democracy", meaning: "Dân chủ", category: "Politics", level: 3, emoji: "🗳️" },
        { word: "Philosophy", meaning: "Triết học", category: "Academic", level: 3, emoji: "🤔" },
        { word: "Ecosystem", meaning: "Hệ sinh thái", category: "Science", level: 3, emoji: "🌍" },
        { word: "Innovation", meaning: "Sự đổi mới", category: "Technology", level: 3, emoji: "💡" },
        { word: "Perseverance", meaning: "Sự kiên trì", category: "Quality", level: 3, emoji: "💪" },
        { word: "Extraordinary", meaning: "Phi thường", category: "Adjective", level: 3, emoji: "⭐" },
        { word: "Compassion", meaning: "Lòng trương cảm", category: "Emotion", level: 3, emoji: "❤️" }
    ];

    // Generate questions based on current level
    const getQuestionsForLevel = useCallback((level) => {
        const levelWords = wordBank.filter(w => w.level <= level);
        const shuffled = [...levelWords].sort(() => Math.random() - 0.5);

        return shuffled.slice(0, 10).map(word => {
            const wrongOptions = wordBank
                .filter(w => w.meaning !== word.meaning && w.level <= level)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(w => ({ text: w.meaning, correct: false }));

            const allOptions = [
                { text: word.meaning, correct: true },
                ...wrongOptions
            ].sort(() => Math.random() - 0.5);

            return {
                ...word,
                options: allOptions
            };
        });
    }, []);

    const [questions, setQuestions] = useState([]);
    const currentQuestion = questions[currentQuestionIndex];    // Initialize game
    useEffect(() => {
        // Preload all audio files
        preloadAudio('background', require('../../assets/sound/background.mp3'));
        preloadAudio('correct', require('../../assets/sound/correct.mp3'));
        preloadAudio('wrong', require('../../assets/sound/wrong.mp3'));
        preloadAudio('crash', require('../../assets/sound/crash.mp3'));

        setQuestions(getQuestionsForLevel(level));

        // Cleanup: stop all sounds when component unmounts
        return () => {
            stopSound('background');
        };
    }, [level, preloadAudio, getQuestionsForLevel, stopSound]);

    // Timer logic
    useEffect(() => {
        if (gameStarted && !gameEnded && !showResult && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !showResult) {
            handleTimeUp();
        }

        return () => clearTimeout(timerRef.current);
    }, [gameStarted, gameEnded, showResult, timeLeft]);

    // Speech synthesis
    const speakWord = (word) => {
        if ('speechSynthesis' in window) {
            // Stop any current speech
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }; const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setLives(3);
        setStreak(0);
        setCurrentQuestionIndex(0);
        setTimeLeft(20);
        setGameEnded(false);
        setShowResult(false);
        setAnsweredQuestions([]);
        playBackgroundMusic('background');
    };

    const handleSelect = (option) => {
        if (isProcessing || selected) return;

        setIsProcessing(true);
        setSelected(option);

        if (option.correct) {
            // Correct answer
            const points = 10 + (streak * 2) + (level * 5);
            setScore(prev => prev + points);
            setStreak(prev => prev + 1);
            playSound('correct');

            // Level up every 5 correct answers in a row
            if (streak > 0 && (streak + 1) % 5 === 0 && level < 3) {
                setLevel(prev => prev + 1);
            }
        } else {
            // Wrong answer
            setStreak(0);
            setLives(prev => prev - 1);
            playSound('wrong');
        }

        setShowResult(true);
        setAnsweredQuestions(prev => [...prev, {
            ...currentQuestion,
            selectedAnswer: option,
            isCorrect: option.correct
        }]);

        // Auto next question after 2 seconds
        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    const handleTimeUp = () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setStreak(0);
        setLives(prev => prev - 1);
        setShowResult(true);
        playSound('wrong');

        setAnsweredQuestions(prev => [...prev, {
            ...currentQuestion,
            selectedAnswer: null,
            isCorrect: false,
            timeUp: true
        }]);

        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    const nextQuestion = () => {
        setIsProcessing(false);
        setSelected(null);
        setShowResult(false);

        if (lives <= 1 || currentQuestionIndex >= questions.length - 1) {
            endGame();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimeLeft(20);
        }
    };

    const endGame = () => {
        setGameEnded(true);
        stopSound('background');

        // Generate final stats
        const correctCount = answeredQuestions.filter(q => q.isCorrect).length;
        const accuracy = answeredQuestions.length > 0 ? (correctCount / answeredQuestions.length * 100).toFixed(1) : 0;
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameEnded(false);
        setCurrentQuestionIndex(0);
        setSelected(null);
        setScore(0);
        setLives(3);
        setStreak(0);
        setTimeLeft(20);
        setShowResult(false);
        setLevel(1);
        setAnsweredQuestions([]);
        setIsProcessing(false);
        setQuestions(getQuestionsForLevel(1));
        stopSound('background');
    };

    const goHome = () => {
        stopSound('background');
        navigate('/gamecenter');
    }; if (!gameStarted) {
        return (
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                zIndex: 1000,
                overflow: 'hidden'
            }}>
                <Card sx={{
                    maxWidth: 500,
                    width: '100%',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h3" gutterBottom sx={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            mb: 2
                        }}>
                            🌟 English Word Match
                        </Typography>

                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            Khám phá thế giới từ vựng tiếng Anh thú vị!
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Timer color="primary" sx={{ fontSize: 30, mb: 1 }} />
                                        <Typography variant="body2">20 giây/câu</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <EmojiEvents color="warning" sx={{ fontSize: 30, mb: 1 }} />
                                        <Typography variant="body2">3 mạng sống</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>                        <Button
                            variant="contained"
                            size="large"
                            onClick={startGame}
                            startIcon={<PlayArrow />}
                            sx={{
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                color: 'white',
                                py: 2,
                                px: 4,
                                fontSize: '1.2rem',
                                borderRadius: 3,
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                },
                                transition: 'all 0.3s ease',
                                mb: 2
                            }}
                        >
                            Bắt đầu chơi
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => playSound('correct')}
                            startIcon={<VolumeUp />}
                            sx={{
                                borderColor: '#667eea',
                                color: '#667eea',
                                '&:hover': {
                                    borderColor: '#5a6fd8',
                                    color: '#5a6fd8'
                                }
                            }}
                        >
                            Test âm thanh
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    if (gameEnded) {
        const correctCount = answeredQuestions.filter(q => q.isCorrect).length;
        const accuracy = answeredQuestions.length > 0 ? (correctCount / answeredQuestions.length * 100).toFixed(1) : 0; return (
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                zIndex: 1000,
                overflow: 'auto'
            }}>
                <Card sx={{
                    maxWidth: 600,
                    width: '100%',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{
                            color: score > 100 ? '#4caf50' : '#f44336',
                            fontWeight: 'bold',
                            mb: 3
                        }}>
                            {score > 100 ? '🎉 Xuất sắc!' : '📚 Cần cố gắng thêm!'}
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                                    <Typography variant="h4" color="primary">{score}</Typography>
                                    <Typography variant="body2">Điểm</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                                    <Typography variant="h4" color="success.main">{correctCount}</Typography>
                                    <Typography variant="body2">Đúng</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                                    <Typography variant="h4" color="warning.main">{accuracy}%</Typography>
                                    <Typography variant="body2">Độ chính xác</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fce4ec' }}>
                                    <Typography variant="h4" color="secondary">{level}</Typography>
                                    <Typography variant="body2">Level</Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                startIcon={<Refresh />}
                                onClick={resetGame}
                                sx={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                                    }
                                }}
                            >
                                Chơi lại
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Home />}
                                onClick={goHome}
                                sx={{ borderColor: '#667eea', color: '#667eea' }}
                            >
                                Về trang chủ
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        );
    } return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'auto'
        }}>
            {/* Main Container */}
            <Box sx={{
                maxWidth: 800,
                mx: 'auto',
                width: '100%',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={goHome} sx={{ color: 'white' }}>
                        <Home />
                    </IconButton>

                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                        English Word Match
                    </Typography>

                    <Chip
                        label={`Level ${level}`}
                        color="warning"
                        variant="filled"
                    />
                </Box>

                {/* Stats Bar */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={3}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="h6" color="primary">{score}</Typography>
                            <Typography variant="caption">Điểm</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="h6" color="error">{'❤️'.repeat(lives)}</Typography>
                            <Typography variant="caption">Mạng</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="h6" color="warning.main">{streak}</Typography>
                            <Typography variant="caption">Streak</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="h6" color="secondary">{timeLeft}</Typography>
                            <Typography variant="caption">Giây</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Timer Progress */}
                <LinearProgress
                    variant="determinate"
                    value={(timeLeft / 20) * 100}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 3,
                        bgcolor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                            background: timeLeft > 5 ? 'linear-gradient(90deg, #4caf50, #8bc34a)' : 'linear-gradient(90deg, #f44336, #ff9800)'
                        }
                    }}
                />            {/* Question Card Container */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {currentQuestion && (
                        <Fade in={!showResult} timeout={300}>
                            <Box>
                                <Card sx={{
                                    maxWidth: 600,
                                    mx: 'auto',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 3,
                                    mb: 3
                                }}>
                                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Câu {currentQuestionIndex + 1}/{questions.length}
                                        </Typography>

                                        <Typography variant="h2" sx={{
                                            mb: 2,
                                            fontWeight: 'bold',
                                            color: '#333'
                                        }}>
                                            {currentQuestion.emoji} {currentQuestion.word}
                                        </Typography>

                                        <Chip
                                            label={currentQuestion.category}
                                            color="primary"
                                            size="small"
                                            sx={{ mb: 3 }}
                                        />

                                        <Button
                                            variant="outlined"
                                            startIcon={<VolumeUp />}
                                            onClick={() => speakWord(currentQuestion.word)}
                                            sx={{ mb: 4 }}
                                        >
                                            Nghe phát âm
                                        </Button>

                                        <Grid container spacing={2}>
                                            {currentQuestion.options.map((option, i) => (
                                                <Grid item xs={12} sm={6} key={i}>
                                                    <Button
                                                        fullWidth
                                                        variant={selected === option ? "contained" : "outlined"}
                                                        color={
                                                            selected && option.correct ? "success" :
                                                                selected === option && !option.correct ? "error" : "primary"
                                                        }
                                                        onClick={() => handleSelect(option)}
                                                        startIcon={
                                                            selected && option.correct ? <CheckCircle /> :
                                                                selected === option && !option.correct ? <Cancel /> : null
                                                        }
                                                        disabled={isProcessing}
                                                        sx={{
                                                            height: 60,
                                                            fontSize: '1.1rem',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                            }
                                                        }}
                                                    >
                                                        {option.text}
                                                    </Button>
                                                </Grid>
                                            ))}
                                        </Grid>                        </CardContent>
                                </Card>
                            </Box>
                        </Fade>
                    )}
                </Box>

                {/* Result Dialog */}
                <Dialog open={showResult} maxWidth="sm" fullWidth>
                    <DialogContent sx={{ textAlign: 'center', p: 4 }}>
                        {selected?.correct ? (
                            <Box>
                                <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                                <Typography variant="h4" color="success.main" gutterBottom>
                                    Chính xác! 🎉
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    +{10 + (streak * 2) + (level * 5)} điểm
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                                <Typography variant="h4" color="error.main" gutterBottom>
                                    {timeLeft === 0 ? 'Hết thời gian! ⏰' : 'Sai rồi! 😞'}
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Đáp án đúng: {currentQuestion?.meaning}
                                </Typography>
                            </Box>
                        )}

                        {streak > 0 && (
                            <Chip
                                label={`🔥 ${streak} streak`}
                                color="warning"
                                variant="filled"
                            />
                        )}                </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
};

export default EnglishGame;