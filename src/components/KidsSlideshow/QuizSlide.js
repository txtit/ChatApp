import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    Alert,
    Chip,
    LinearProgress,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import {
    Quiz,
    CheckCircle,
    Cancel,
    EmojiEvents,
    Lightbulb,
} from '@mui/icons-material';

const QuizSlide = ({ data, onSubmit, showResults = false }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Debug log
    console.log('🧪 QuizSlide received data:', data);
    console.log('🧪 QuizSlide questions:', data?.questions);
    console.log('🧪 QuizSlide content:', data?.content);

    // Kiểm tra dữ liệu an toàn - hỗ trợ nhiều cấu trúc dữ liệu
    if (!data) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Không có dữ liệu quiz
                </Typography>
            </Paper>
        );
    }

    // Trường hợp: Quiz slide kiểu "quiz trên lớp" - không có questions cụ thể
    if (data.type === 'quiz' && (!data.questions || data.questions.length === 0)) {
        return (
            <Paper sx={{
                p: 4,
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '20px',
                minHeight: 400
            }}>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Quiz sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                        {data.title}
                    </Typography>
                </Box>

                {/* Hiển thị imagePrompt nếu có */}
                {data.imagePrompt && (
                    <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.50', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Lightbulb sx={{ color: 'info.main' }} />
                            <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'info.dark' }}>
                                Hình ảnh minh họa:
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                            {data.imagePrompt}
                        </Typography>
                    </Paper>
                )}

                {/* Hiển thị nội dung quiz */}
                {data.content && Array.isArray(data.content) && data.content.length > 0 ? (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                            🤔 Hướng dẫn quiz:
                        </Typography>
                        {data.content.map((item, index) => (
                            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                    {item}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                ) : data.description ? (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                            🤔 Mô tả quiz:
                        </Typography>
                        <Paper sx={{ p: 3, bgcolor: 'background.paper', borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                {data.description}
                            </Typography>
                        </Paper>
                    </Box>
                ) : (
                    <Box sx={{ mb: 4 }}>
                        <Paper sx={{ p: 3, bgcolor: 'warning.50', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ color: 'warning.dark', fontWeight: 'medium' }}>
                                🧠 Đây là quiz tương tác trên lớp
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                Hãy làm theo hướng dẫn của giáo viên
                            </Typography>
                        </Paper>
                    </Box>
                )}

                {/* Hiển thị quizId nếu có (để debug) */}
                {data.quizId && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{
                            bgcolor: 'grey.100',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            fontFamily: 'monospace',
                            color: 'text.secondary'
                        }}>
                            Quiz ID: {data.quizId}
                        </Typography>
                    </Box>
                )}

                {/* Nút hoàn thành */}
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => onSubmit && onSubmit([])} // Submit empty answers để trigger completion
                        sx={{
                            px: 6,
                            py: 2,
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                        startIcon={<CheckCircle />}
                    >
                        Hoàn thành quiz
                    </Button>
                </Box>

                {/* Hiển thị kết quả nếu đã hoàn thành */}
                {showResults && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Alert severity="success" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                            <EmojiEvents sx={{ mr: 1 }} />
                            Tuyệt vời! Bạn đã hoàn thành quiz!
                        </Alert>
                    </Box>
                )}
            </Paper>
        );
    }

    // Trường hợp 2: Có quizId nhưng chưa có questions (cần load từ API)
    if (data.type === 'quiz' && data.quizId && (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0)) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                    Đang tải dữ liệu quiz...
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Quiz ID: {data.quizId}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    Debug data: {JSON.stringify(data, null, 2)}
                </Typography>
            </Paper>
        );
    }

    // Trường hợp 3: Có đầy đủ questions array
    if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Không có câu hỏi quiz
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    Dữ liệu nhận được: {JSON.stringify(data, null, 2)}
                </Typography>
            </Paper>
        );
    }

    // Kiểm tra nếu tất cả câu hỏi đã được trả lời
    const allAnswered = data.questions?.every((_, index) =>
        answers[index] !== undefined && answers[index] !== null
    );

    // Xử lý thay đổi đáp án
    const handleAnswerChange = (questionIndex, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: parseInt(selectedOption)
        }));
    };

    // Xử lý nộp bài
    const handleSubmit = () => {
        if (!allAnswered) {
            alert('Vui lòng trả lời tất cả câu hỏi!');
            return;
        }

        setSubmitted(true);
        onSubmit(answers);
    };    // Tính điểm và kết quả
    const calculateResults = () => {
        if (!showResults || !data.questions) return null;

        let correct = 0;
        const results = data.questions.map((question, index) => {
            const userAnswer = answers[index];
            // Hỗ trợ cả correctOption (API mới) và correctAnswer (format cũ)
            const correctAnswerIndex = question.correctOption !== undefined ? question.correctOption : question.correctAnswer;
            const isCorrect = userAnswer === correctAnswerIndex;
            if (isCorrect) correct++;

            return {
                questionIndex: index,
                isCorrect,
                userAnswer,
                correctAnswer: correctAnswerIndex,
                explanation: question.explanation || null
            };
        });

        const score = Math.round((correct / data.questions.length) * 100);

        return {
            score,
            correct,
            total: data.questions.length,
            results
        };
    };

    const results = calculateResults();

    // Render một câu hỏi
    const renderQuestion = (question, index) => {
        const userAnswer = answers[index];
        const questionResults = results?.results[index];

        return (
            <Card key={index} sx={{
                mb: 3, border: showResults ?
                    (questionResults?.isCorrect ? '2px solid #4caf50' : '2px solid #f44336') :
                    'none'
            }}>
                <CardContent>                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Quiz sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Câu {index + 1}
                        </Typography>
                        
                        {/* Hiển thị tên quiz gốc nếu là aggregated */}
                        {question.quizTitle && data.quizType === 'aggregated' && (
                            <Chip
                                label={question.quizTitle}
                                size="small"
                                variant="outlined"
                                sx={{ ml: 2, fontSize: '0.7rem' }}
                            />
                        )}
                        
                        {showResults && (
                            <Chip
                                icon={questionResults?.isCorrect ? <CheckCircle /> : <Cancel />}
                                label={questionResults?.isCorrect ? 'Đúng' : 'Sai'}
                                color={questionResults?.isCorrect ? 'success' : 'error'}
                                size="small"
                                sx={{ ml: 'auto' }}
                            />
                        )}
                    </Box>

                    <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
                        {question.question}
                    </Typography>

                    <FormControl component="fieldset" fullWidth disabled={showResults}>
                        <RadioGroup
                            value={userAnswer !== undefined ? userAnswer.toString() : ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                        >
                            {question.options.map((option, optionIndex) => {
                                let optionColor = 'default';
                                let optionIcon = null; if (showResults) {
                                    // Hỗ trợ cả correctOption (API mới) và correctAnswer (format cũ)
                                    const correctAnswerIndex = question.correctOption !== undefined ? question.correctOption : question.correctAnswer;
                                    if (optionIndex === correctAnswerIndex) {
                                        optionColor = 'success';
                                        optionIcon = <CheckCircle sx={{ fontSize: 16, ml: 1, color: 'success.main' }} />;
                                    } else if (optionIndex === userAnswer && optionIndex !== correctAnswerIndex) {
                                        optionColor = 'error';
                                        optionIcon = <Cancel sx={{ fontSize: 16, ml: 1, color: 'error.main' }} />;
                                    }
                                }

                                return (
                                    <FormControlLabel
                                        key={optionIndex}
                                        value={optionIndex.toString()}
                                        control={<Radio color={optionColor} />}
                                        label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                sx={{
                                                    color: (() => {
                                                        if (!showResults) return 'inherit';
                                                        const correctAnswerIndex = question.correctOption !== undefined ? question.correctOption : question.correctAnswer;
                                                        if (optionIndex === correctAnswerIndex) return 'success.main';
                                                        if (optionIndex === userAnswer && optionIndex !== correctAnswerIndex) return 'error.main';
                                                        return 'inherit';
                                                    })()
                                                }}
                                            >
                                                {option}
                                            </Typography>
                                            {optionIcon}
                                        </Box>
                                        } sx={{
                                            mb: 1,
                                            p: 1,
                                            borderRadius: 1,
                                            backgroundColor: (() => {
                                                if (!showResults) return 'transparent';
                                                const correctAnswerIndex = question.correctOption !== undefined ? question.correctOption : question.correctAnswer;
                                                if (optionIndex === correctAnswerIndex) return 'success.50';
                                                if (optionIndex === userAnswer && optionIndex !== correctAnswerIndex) return 'error.50';
                                                return 'transparent';
                                            })(),
                                            '&:hover': {
                                                backgroundColor: showResults ? 'inherit' : 'action.hover'
                                            }
                                        }}
                                    />
                                );
                            })}
                        </RadioGroup>
                    </FormControl>

                    {/* Hiển thị giải thích nếu có */}
                    {showResults && question.explanation && (
                        <Alert
                            severity="info"
                            icon={<Lightbulb />}
                            sx={{ mt: 2 }}
                        >
                            <Typography variant="body2">
                                <strong>Giải thích:</strong> {question.explanation}
                            </Typography>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Quiz sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {data.title || 'Câu hỏi trắc nghiệm'}
                    </Typography>
                </Box>                {data.description && (
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {data.description}
                    </Typography>
                )}

                {/* Hiển thị thông tin aggregated quiz */}
                {data.quizType === 'aggregated' && data.originalQuizzes && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            📚 Tổng hợp từ {data.originalQuizzes.length} quiz:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {data.originalQuizzes.map((quiz, index) => (
                                <Chip
                                    key={quiz.id}
                                    label={quiz.title || `Quiz ${index + 1}`}
                                    size="small"
                                    sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.15)', 
                                        color: 'white',
                                        fontSize: '0.75rem'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Chip
                        label={`${data.questions?.length || 0} câu hỏi`}
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip
                        label={`${data.timeLimit || 10} phút`}
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                </Box>
            </Paper>

            {/* Progress bar */}
            {!showResults && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Tiến độ: {Object.keys(answers).length}/{data.questions?.length || 0} câu
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(Object.keys(answers).length / (data.questions?.length || 1)) * 100}
                        sx={{ height: 8, borderRadius: 5 }}
                    />
                </Box>
            )}

            {/* Questions */}
            {data.questions?.map((question, index) => renderQuestion(question, index))}

            {/* Results */}
            {showResults && results && (
                <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <EmojiEvents sx={{
                            mr: 1,
                            fontSize: 32,
                            color: results.score >= 80 ? 'gold' : results.score >= 60 ? 'silver' : 'bronze'
                        }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Kết quả
                        </Typography>
                    </Box>

                    <Typography variant="h3" sx={{
                        color: results.score >= 80 ? 'success.main' :
                            results.score >= 60 ? 'warning.main' : 'error.main',
                        fontWeight: 'bold',
                        mb: 1
                    }}>
                        {results.score}/100
                    </Typography>                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {results.correct}/{results.total} câu đúng
                    </Typography>

                    {/* Hiển thị thống kê theo từng quiz gốc nếu là aggregated */}
                    {data.quizType === 'aggregated' && data.originalQuizzes && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                📊 Chi tiết theo từng quiz:
                            </Typography>
                            {data.originalQuizzes.map((originalQuiz, quizIndex) => {
                                // Đếm số câu đúng/sai cho quiz này
                                const quizQuestions = data.questions.filter(q => q.quizId === originalQuiz.id);
                                const quizResults = results.results.filter((_, idx) => 
                                    data.questions[idx].quizId === originalQuiz.id
                                );
                                const quizCorrect = quizResults.filter(r => r.isCorrect).length;
                                const quizTotal = quizQuestions.length;
                                const quizScore = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0;

                                return (
                                    <Box key={originalQuiz.id} sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        p: 1,
                                        mb: 1,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            {originalQuiz.title || `Quiz ${quizIndex + 1}`}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2">
                                                {quizCorrect}/{quizTotal}
                                            </Typography>
                                            <Chip 
                                                label={`${quizScore}%`}
                                                size="small"
                                                color={quizScore >= 80 ? 'success' : quizScore >= 60 ? 'warning' : 'error'}
                                            />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}

                    <Alert
                        severity={results.score >= 80 ? 'success' : results.score >= 60 ? 'warning' : 'error'}
                        sx={{ mt: 2 }}
                    >
                        {results.score >= 80 ? '🎉 Xuất sắc! Bạn đã làm rất tốt!' :
                            results.score >= 60 ? '👏 Tốt! Bạn có thể cải thiện thêm!' :
                                '💪 Hãy thử lại! Đọc kỹ câu hỏi và suy nghĩ thêm.'}
                    </Alert>
                </Paper>
            )}

            {/* Submit button */}
            {!showResults && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        disabled={!allAnswered || submitted}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: 3,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                            }
                        }}
                    >
                        {submitted ? 'Đang xử lý...' : 'Nộp bài'}
                    </Button>

                    {!allAnswered && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Vui lòng trả lời tất cả câu hỏi trước khi nộp bài
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default QuizSlide;
