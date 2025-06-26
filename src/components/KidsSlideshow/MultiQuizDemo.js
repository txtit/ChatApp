import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';
import KidsSlideshow from './KidsSlideshow';

// Demo data với 1 slide quiz liên kết tới 3 quiz
const multiQuizData = {
    title: "Kiểm tra kiến thức - Nhiều quiz",
    subjectGrade: "Toán - Lớp 1", 
    slides: [
        {
            id: "slide_1",
            title: "Ôn tập phép cộng",
            content: "Hãy ôn lại những gì đã học về phép cộng",
            type: "content"
        },
        {
            id: "slide_2",
            title: "Kiểm tra kiến thức",
            content: "Làm các quiz để kiểm tra hiểu biết",
            type: "quiz"
        }
    ],
    exercises: [],
    quizzes: [
        {
            id: "quiz_2_1",
            title: "Quiz 1: Cộng 1 chữ số",
            description: "Tính các phép cộng đơn giản",
            questions: [
                {
                    question: "1 + 1 = ?",
                    options: ["1", "2", "3", "4"],
                    correctAnswer: 1
                },
                {
                    question: "2 + 3 = ?", 
                    options: ["4", "5", "6", "7"],
                    correctAnswer: 1
                }
            ]
        },
        {
            id: "quiz_2_2",
            title: "Quiz 2: Cộng số lớn hơn",
            description: "Thử với các số lớn hơn",
            questions: [
                {
                    question: "5 + 4 = ?",
                    options: ["8", "9", "10", "11"],
                    correctAnswer: 1
                },
                {
                    question: "6 + 3 = ?",
                    options: ["8", "9", "10", "11"], 
                    correctAnswer: 1
                }
            ]
        },
        {
            id: "quiz_2_3",
            title: "Quiz 3: Thách thức",
            description: "Những câu hỏi khó hơn",
            questions: [
                {
                    question: "7 + 8 = ?",
                    options: ["14", "15", "16", "17"],
                    correctAnswer: 1
                },
                {
                    question: "9 + 6 = ?",
                    options: ["14", "15", "16", "17"],
                    correctAnswer: 1
                }
            ]
        }
    ]
};

const MultiQuizDemo = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
                <Typography variant="h4" gutterBottom color="primary.main">
                    🧠 Demo: Nhiều quiz trong 1 slide
                </Typography>
                <Typography variant="body1" paragraph>
                    Demo này cho thấy cách hệ thống xử lý khi 1 slide quiz được liên kết với nhiều quiz.
                    Slide "Kiểm tra kiến thức" sẽ hiển thị 3 quiz khác nhau với navigation để chuyển qua lại.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ✅ Navigation hiển thị "Quiz 1/3", "Quiz 2/3", "Quiz 3/3"<br/>
                    ✅ Có nút "Quiz trước" và "Quiz tiếp" để chuyển<br/>
                    ✅ Reset kết quả khi chuyển quiz<br/>
                    ✅ Mỗi quiz có câu hỏi riêng biệt
                </Typography>
            </Paper>

            <KidsSlideshow data={multiQuizData} />
        </Container>
    );
};

export default MultiQuizDemo;
