import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    Alert,
    Chip,
    LinearProgress,
    Card,
    CardContent,
    InputAdornment,
    Divider,
    IconButton,
} from '@mui/material';
import {
    Assignment,
    CheckCircle,
    Cancel,
    EmojiEvents,
    Lightbulb,
    Refresh,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';

const ExerciseSlide = ({ data, onComplete, showResults = false }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showHints, setShowHints] = useState({});

    // Debug log
    console.log('📝 ExerciseSlide received data:', data);
    console.log('📝 ExerciseSlide questions:', data?.questions);
    console.log('📝 ExerciseSlide answers:', data?.answers);
    console.log('📝 ExerciseSlide content:', data?.content);
    
    // Kiểm tra dữ liệu an toàn - hỗ trợ nhiều cấu trúc dữ liệu
    if (!data) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Không có dữ liệu bài tập
                </Typography>
            </Paper>
        );
    }

    // Trường hợp: Exercise slide kiểu "bài tập trên lớp" - không có questions cụ thể
    if (data.type === 'exercise' && (!data.questions || data.questions.length === 0)) {
        return (
            <Paper sx={{ 
                p: 4, 
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                borderRadius: '20px',
                minHeight: 400
            }}>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Assignment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
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
                
                {/* Hiển thị nội dung bài tập */}
                {data.content && Array.isArray(data.content) && data.content.length > 0 ? (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                            📋 Hướng dẫn bài tập:
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
                            📋 Mô tả bài tập:
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
                                📚 Đây là bài tập tương tác trên lớp
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                Hãy làm theo hướng dẫn của giáo viên
                            </Typography>
                        </Paper>
                    </Box>
                )}

                {/* Hiển thị exerciseId nếu có (để debug) */}
                {data.exerciseId && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ 
                            bgcolor: 'grey.100', 
                            px: 2, 
                            py: 1, 
                            borderRadius: 1, 
                            fontFamily: 'monospace',
                            color: 'text.secondary'
                        }}>
                            Exercise ID: {data.exerciseId}
                        </Typography>
                    </Box>
                )}
                
                {/* Nút hoàn thành */}
                <Box sx={{ textAlign: 'center' }}>
                    <Button 
                        variant="contained" 
                        size="large"
                        onClick={() => onComplete(100)}
                        sx={{ 
                            px: 6, 
                            py: 2, 
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            background: 'linear-gradient(135deg, #7c43bd, #667eea)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #6a35a3, #5a67d8)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(124, 67, 189, 0.3)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                        startIcon={<CheckCircle />}
                    >
                        Hoàn thành bài tập
                    </Button>
                </Box>
                
                {/* Hiển thị kết quả nếu đã hoàn thành */}
                {showResults && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Alert severity="success" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                            <EmojiEvents sx={{ mr: 1 }} />
                            Tuyệt vời! Bạn đã hoàn thành bài tập!
                        </Alert>
                    </Box>
                )}
            </Paper>
        );
    }

    // Phần còn lại của code - xử lý exercise có questions
    // ... existing code for interactive exercises ...

    // Trường hợp 3: Có đầy đủ questions array hoặc questions + answers từ API
    let processedQuestions = [];
    
    // Xử lý dữ liệu từ API với cấu trúc questions + answers riêng biệt  
    if (data.questions && Array.isArray(data.questions) && data.answers && Array.isArray(data.answers)) {
        console.log('📝 Processing API data with separate questions & answers arrays');
        
        processedQuestions = data.questions.map((questionText, index) => ({
            question: questionText,
            correctAnswer: data.answers[index] || "",
            type: 'fillBlank'
        }));
        
        console.log('📝 Processed questions (API format):', processedQuestions);
    }
    // Xử lý dữ liệu dạng array objects
    else if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        console.log('📝 Processing standard array of question objects');
        
        processedQuestions = data.questions.map(q => ({
            question: q.question || q,
            correctAnswer: q.correctAnswer || q.answer || "",
            type: q.type || 'fillBlank',
            hint: q.hint || ""
        }));
        
        console.log('📝 Processed questions (standard format):', processedQuestions);
    }

    // Nếu không có questions hợp lệ
    if (processedQuestions.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                    Không tìm thấy câu hỏi hợp lệ
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Dữ liệu bài tập có thể chưa được tải hoặc có lỗi định dạng
                </Typography>
            </Paper>
        );
    }

    // Xử lý submit
    const handleSubmit = () => {
        setSubmitted(true);
        
        let correctCount = 0;
        processedQuestions.forEach((q, index) => {
            const userAnswer = answers[index] || '';
            const correctAnswer = q.correctAnswer.toString().toLowerCase().trim();
            
            if (userAnswer.toLowerCase().trim() === correctAnswer) {
                correctCount++;
            }
        });
        
        const score = Math.round((correctCount / processedQuestions.length) * 100);
        onComplete(score);
    };

    const resetAnswers = () => {
        setAnswers({});
        setSubmitted(false);
        setShowHints({});
    };

    const toggleHint = (index) => {
        setShowHints(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Render giao diện exercise tương tác
    return (
        <Paper sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            borderRadius: '20px' 
        }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Assignment sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.dark', mb: 1 }}>
                    {data.title}
                </Typography>
                {data.description && (
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                        {data.description}
                    </Typography>
                )}
                
                {/* Progress bar */}
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        Tiến độ: {Object.keys(answers).length}/{processedQuestions.length}
                    </Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={(Object.keys(answers).length / processedQuestions.length) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>
            </Box>

            {/* Questions */}
            <Box sx={{ mb: 4 }}>
                {processedQuestions.map((q, index) => {
                    const userAnswer = answers[index] || '';
                    const isCorrect = submitted && userAnswer.toLowerCase().trim() === q.correctAnswer.toString().toLowerCase().trim();
                    const isWrong = submitted && userAnswer && !isCorrect;
                    
                    return (
                        <Card key={index} sx={{ 
                            mb: 3, 
                            border: submitted ? (isCorrect ? '2px solid green' : isWrong ? '2px solid red' : '1px solid #ddd') : '1px solid #ddd',
                            boxShadow: submitted ? (isCorrect ? '0 4px 20px rgba(76, 175, 80, 0.3)' : isWrong ? '0 4px 20px rgba(244, 67, 54, 0.3)' : 2) : 2
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Chip 
                                        label={`Câu ${index + 1}`} 
                                        sx={{ mr: 2, fontWeight: 'bold' }}
                                        color={submitted ? (isCorrect ? 'success' : isWrong ? 'error' : 'default') : 'primary'}
                                    />
                                    <Typography variant="h6" sx={{ flex: 1 }}>
                                        {q.question}
                                    </Typography>
                                    
                                    {/* Hint button */}
                                    {q.hint && (
                                        <IconButton onClick={() => toggleHint(index)} size="small">
                                            {showHints[index] ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )}
                                </Box>
                                
                                {/* Hint display */}
                                {showHints[index] && q.hint && (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        <Lightbulb sx={{ mr: 1 }} />
                                        {q.hint}
                                    </Alert>
                                )}
                                
                                {/* Input field */}
                                <TextField
                                    fullWidth
                                    value={userAnswer}
                                    onChange={(e) => setAnswers(prev => ({ ...prev, [index]: e.target.value }))}
                                    placeholder="Nhập câu trả lời..."
                                    disabled={submitted}
                                    error={isWrong}
                                    InputProps={{
                                        endAdornment: submitted && (
                                            <InputAdornment position="end">
                                                {isCorrect ? <CheckCircle color="success" /> : isWrong ? <Cancel color="error" /> : null}
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                
                                {/* Show correct answer if wrong */}
                                {submitted && isWrong && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        Đáp án đúng: <strong>{q.correctAnswer}</strong>
                                    </Alert>
                                )}
                                
                                {submitted && isCorrect && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        Chính xác! 🎉
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* Action buttons */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                {!submitted ? (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length === 0}
                        sx={{
                            px: 6,
                            py: 2,
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            background: 'linear-gradient(135deg, #4caf50, #45a049)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #45a049, #3d8b40)',
                            }
                        }}
                        startIcon={<CheckCircle />}
                    >
                        Kiểm tra đáp án
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={resetAnswers}
                        sx={{ px: 6, py: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
                        startIcon={<Refresh />}
                    >
                        Làm lại
                    </Button>
                )}
            </Box>

            {/* Results */}
            {showResults && submitted && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Alert severity="success" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <EmojiEvents sx={{ mr: 1 }} />
                        Bạn đã hoàn thành bài tập!
                    </Alert>
                </Box>
            )}
        </Paper>
    );
};

export default ExerciseSlide;
