import React from 'react';
import { Box, Paper, Typography, Container, Alert } from '@mui/material';
import KidsSlideshow from './KidsSlideshow';

// Test data giống như API thực tế - slide có exerciseId và exercises array riêng
const apiLikeData = {
    title: "Test API Data Structure",
    subjectGrade: "English - Grade 4",
    slides: [
        {
            id: "slide_1",
            title: "Content Slide",
            content: "This is a content slide",
            type: "content"
        },
        {
            id: "slide_2",
            title: "Exercise Slide with exerciseId",
            content: "",
            type: "exercise",
            exerciseId: "ex_test_123", // Có exerciseId
            questions: [], // Ban đầu rỗng - sẽ được merge từ exercises array
            answers: []
        },
        {
            id: "slide_3", 
            title: "Quiz Slide with quizId",
            content: "",
            type: "quiz",
            quizId: "quiz_test_456", // Có quizId
            questions: [] // Ban đầu rỗng - sẽ được merge từ quizzes array
        },
        {
            id: "slide_4",
            title: "Exercise without ID",
            content: "",
            type: "exercise",
            // Không có exerciseId - sẽ fallback to first exercise
            questions: [],
            answers: []
        }
    ],
    exercises: [
        {
            id: "ex_test_123", // Match với slide_2
            title: "Test Exercise 1",
            description: "Fill in the blanks",
            questions: ["H_llo", "W_rld", "T_st"],
            answers: ["e", "o", "e"]
        },
        {
            id: "ex_test_789",
            title: "Test Exercise 2", 
            description: "Another exercise",
            questions: ["_pple", "_anana"],
            answers: ["A", "B"]
        }
    ],
    quizzes: [
        {
            id: "quiz_test_456", // Match với slide_3
            title: "Test Quiz 1",
            description: "Multiple choice questions",
            questions: [
                {
                    question: "What is 1 + 1?",
                    options: ["1", "2", "3", "4"],
                    correctAnswer: 1
                },
                {
                    question: "What color is the sky?",
                    options: ["Red", "Blue", "Green", "Yellow"],
                    correctAnswer: 1
                }
            ]
        }
    ]
};

const ExerciseQuizTest = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    🧪 Test: Exercise/Quiz Data Merging
                </Typography>
                <Typography variant="body2">
                    <strong>Test scenarios:</strong><br/>
                    • Slide 2: Exercise with exerciseId "ex_test_123" (should merge data)<br/>
                    • Slide 3: Quiz with quizId "quiz_test_456" (should merge data)<br/>
                    • Slide 4: Exercise without ID (should fallback to first exercise)<br/>
                    <br/>
                    <strong>Expected behavior:</strong><br/>
                    ✅ All exercise/quiz slides should show interactive forms<br/>
                    ❌ No "Đang tải dữ liệu..." messages<br/>
                    ✅ Console logs should show successful data merging
                </Typography>
            </Alert>

            <Paper sx={{ p: 3, mb: 3, bgcolor: 'warning.50' }}>
                <Typography variant="h5" gutterBottom color="warning.main">
                    🔧 Debug Test Component
                </Typography>
                <Typography variant="body1">
                    Kiểm tra console để xem debug logs của quá trình merge dữ liệu exercise/quiz.
                    Nếu vẫn thấy "Đang tải dữ liệu bài tập...", có nghĩa là logic merge chưa hoạt động đúng.
                </Typography>
            </Paper>

            <KidsSlideshow data={apiLikeData} />
        </Container>
    );
};

export default ExerciseQuizTest;
