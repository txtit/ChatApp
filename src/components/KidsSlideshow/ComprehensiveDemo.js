import React, { useState } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Container, 
    Tabs, 
    Tab, 
    Alert,
    Button,
    Stack
} from '@mui/material';
import { School, Quiz, Psychology, PlayArrow, AutoAwesome } from '@mui/icons-material';
import KidsSlideshow from './KidsSlideshow';
import MultiExerciseDemo from './MultiExerciseDemo';
import MultiQuizDemo from './MultiQuizDemo';
import SimpleDemo from './SimpleDemo';

// Demo data tổng hợp với cả exercise và quiz
const comprehensiveData = {
    title: "Bài học tổng hợp - Nhiều dạng bài tập",
    subjectGrade: "Toán & Tiếng Việt - Lớp 1",
    slides: [
        {
            id: "slide_1",
            title: "Giới thiệu",
            content: "Chào mừng đến với bài học tổng hợp. Chúng ta sẽ học cả Toán và Tiếng Việt!",
            type: "content"
        },
        {
            id: "slide_2",
            title: "Bài tập Tiếng Việt",
            content: "Làm bài tập về chữ cái",
            type: "exercise"
        },
        {
            id: "slide_3", 
            title: "Kiểm tra Toán",
            content: "Làm quiz kiểm tra phép tính",
            type: "quiz"
        },
        {
            id: "slide_4",
            title: "Kết thúc",
            content: "Chúc mừng! Bạn đã hoàn thành bài học.",
            type: "content"
        }
    ],
    exercises: [
        {
            id: "exercise_2_1",
            title: "Bài 1: Chữ cái A",
            description: "Điền chữ A vào chỗ trống",
            questions: ["_pple", "_nt", "_rm"],
            answers: ["A", "A", "A"]
        },
        {
            id: "exercise_2_2",
            title: "Bài 2: Chữ cái B", 
            description: "Điền chữ B vào chỗ trống",
            questions: ["_all", "_ird", "_ook"],
            answers: ["B", "B", "B"]
        },
        {
            id: "exercise_2_3",
            title: "Bài 3: Chữ cái C",
            description: "Điền chữ C vào chỗ trống",
            questions: ["_at", "_ar", "_up"],
            answers: ["C", "C", "C"]
        }
    ],
    quizzes: [
        {
            id: "quiz_3_1",
            title: "Quiz 1: Phép cộng cơ bản",
            description: "Tính các phép cộng đơn giản",
            questions: [
                {
                    question: "1 + 1 = ?",
                    options: ["1", "2", "3", "4"],
                    correctAnswer: 1
                },
                {
                    question: "2 + 2 = ?",
                    options: ["3", "4", "5", "6"],
                    correctAnswer: 1
                }
            ]
        },
        {
            id: "quiz_3_2",
            title: "Quiz 2: Phép trừ cơ bản",
            description: "Tính các phép trừ đơn giản",
            questions: [
                {
                    question: "5 - 2 = ?",
                    options: ["2", "3", "4", "5"],
                    correctAnswer: 1
                },
                {
                    question: "4 - 1 = ?",
                    options: ["2", "3", "4", "5"],
                    correctAnswer: 1
                }
            ]
        }
    ]
};

const ComprehensiveDemo = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'gradient.main', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Typography variant="h3" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                    🎓 Demo Hệ thống Nhiều Bài tập/Quiz
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                    Kiểm tra các tính năng mới: chuyển qua lại giữa nhiều bài tập và quiz trong cùng một slide
                </Typography>
            </Paper>            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                    <Tab 
                        icon={<AutoAwesome />} 
                        label="Simple Demo (Recommended)" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<School />} 
                        label="Multi-Exercise Demo" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<Quiz />} 
                        label="Multi-Quiz Demo" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<Psychology />} 
                        label="Comprehensive Demo" 
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <Box>
                    <Alert severity="success" sx={{ mb: 3 }}>
                        <strong>Simple Demo (Khuyến nghị):</strong> Cách sử dụng đơn giản nhất - mỗi slide chỉ có 1 bài tập/quiz riêng.
                        Không có navigation phức tạp, phù hợp với hầu hết trường hợp sử dụng.
                    </Alert>
                    <SimpleDemo />
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <strong>Multi-Exercise Demo:</strong> Một slide exercise liên kết với 3 bài tập khác nhau. 
                        Chuyển đến slide thứ 2 để xem navigation giữa các bài tập.
                    </Alert>
                    <MultiExerciseDemo />
                </Box>
            )}

            {tabValue === 2 && (
                <Box>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <strong>Multi-Quiz Demo:</strong> Một slide quiz liên kết với 3 quiz khác nhau.
                        Chuyển đến slide thứ 2 để xem navigation giữa các quiz.
                    </Alert>
                    <MultiQuizDemo />
                </Box>
            )}

            {tabValue === 3 && (
                <Box>
                    <Alert severity="success" sx={{ mb: 3 }}>
                        <strong>Comprehensive Demo:</strong> Bài học hoàn chỉnh với cả exercise và quiz.
                        Slide 2 có 3 bài tập Tiếng Việt, Slide 3 có 2 quiz Toán.
                    </Alert>
                    <KidsSlideshow data={comprehensiveData} />
                </Box>
            )}

            <Paper sx={{ p: 3, mt: 4, bgcolor: 'warning.50' }}>
                <Typography variant="h6" gutterBottom color="warning.main">
                    📋 Hướng dẫn test:
                </Typography>
                <Stack spacing={1}>
                    <Typography variant="body2">• Chuyển đến slide có type "exercise" hoặc "quiz"</Typography>
                    <Typography variant="body2">• Nếu có nhiều bài tập/quiz, sẽ xuất hiện navigation bar phía trên</Typography>
                    <Typography variant="body2">• Sử dụng nút "Bài trước"/"Bài tiếp" để chuyển qua lại</Typography>
                    <Typography variant="body2">• Kết quả sẽ được reset khi chuyển bài</Typography>
                    <Typography variant="body2">• Mỗi bài có dữ liệu riêng biệt (questions, answers, title)</Typography>
                </Stack>
            </Paper>
        </Container>
    );
};

export default ComprehensiveDemo;
