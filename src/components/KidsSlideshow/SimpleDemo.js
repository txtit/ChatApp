import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';
import KidsSlideshow from './KidsSlideshow';

// Demo data đơn giản - mỗi slide chỉ có 1 bài tập riêng
const simpleData = {
    title: "Bài học đơn giản - Mỗi slide 1 bài tập",
    subjectGrade: "Tiếng Việt - Lớp 1",
    slides: [
        {
            id: "slide_1",
            title: "Giới thiệu",
            content: "Chào mừng đến với bài học về chữ cái. Chúng ta sẽ học từng chữ cái một cách riêng biệt!",
            type: "content"
        },
        {
            id: "slide_2", 
            title: "Bài tập chữ A",
            content: "Làm bài tập về chữ cái A",
            type: "exercise"
        },
        {
            id: "slide_3",
            title: "Bài tập chữ B", 
            content: "Làm bài tập về chữ cái B",
            type: "exercise"
        },
        {
            id: "slide_4",
            title: "Bài tập chữ C",
            content: "Làm bài tập về chữ cái C", 
            type: "exercise"
        },
        {
            id: "slide_5",
            title: "Kiểm tra chữ A & B",
            content: "Quiz kiểm tra hiểu biết về chữ A và B",
            type: "quiz"
        },
        {
            id: "slide_6", 
            title: "Kiểm tra tổng hợp",
            content: "Quiz kiểm tra tất cả chữ cái đã học",
            type: "quiz"
        },
        {
            id: "slide_7",
            title: "Hoàn thành",
            content: "Chúc mừng! Bạn đã hoàn thành bài học về chữ cái A, B, C.",
            type: "content"
        }
    ],
    exercises: [
        {
            id: "exercise_slide_2",  // Match với slide_2
            title: "Điền chữ A",
            description: "Điền chữ cái A vào chỗ trống để hoàn thành từ",
            questions: ["_pple", "C_r", "B_t", "_nt"],
            answers: ["A", "A", "A", "A"]
        },
        {
            id: "exercise_slide_3",  // Match với slide_3
            title: "Điền chữ B", 
            description: "Điền chữ cái B vào chỗ trống để hoàn thành từ",
            questions: ["_all", "_ook", "_ird", "_us"],
            answers: ["B", "B", "B", "B"]
        },
        {
            id: "exercise_slide_4",  // Match với slide_4
            title: "Điền chữ C",
            description: "Điền chữ cái C vào chỗ trống để hoàn thành từ",
            questions: ["_at", "_ar", "_up", "_ake"],
            answers: ["C", "C", "C", "C"]
        }
    ],
    quizzes: [
        {
            id: "quiz_slide_5",      // Match với slide_5
            title: "Quiz chữ A & B",
            description: "Kiểm tra kiến thức về chữ cái A và B",
            questions: [
                {
                    question: "Chữ cái đầu tiên trong từ 'Apple' là gì?",
                    options: ["A", "B", "C", "P"],
                    correctAnswer: 0
                },
                {
                    question: "Chữ cái đầu tiên trong từ 'Ball' là gì?",
                    options: ["A", "B", "C", "L"],
                    correctAnswer: 1
                },
                {
                    question: "Từ nào bắt đầu bằng chữ A?",
                    options: ["Ball", "Apple", "Cat", "Dog"],
                    correctAnswer: 1
                }
            ]
        },
        {
            id: "quiz_slide_6",      // Match với slide_6
            title: "Quiz tổng hợp A, B, C",
            description: "Kiểm tra tổng hợp kiến thức về chữ cái A, B, C",
            questions: [
                {
                    question: "Chữ cái nào đứng đầu bảng chữ cái?",
                    options: ["B", "A", "C", "D"],
                    correctAnswer: 1
                },
                {
                    question: "Từ 'Cat' bắt đầu bằng chữ cái nào?",
                    options: ["A", "B", "C", "T"],
                    correctAnswer: 2
                },
                {
                    question: "Sắp xếp đúng thứ tự: A, ?, C",
                    options: ["D", "B", "E", "F"],
                    correctAnswer: 1
                },
                {
                    question: "Có bao nhiêu chữ cái trong nhóm A, B, C?",
                    options: ["2", "3", "4", "5"],
                    correctAnswer: 1
                }
            ]
        }
    ]
};

const SimpleDemo = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.50' }}>
                <Typography variant="h4" gutterBottom color="success.main">
                    ✨ Demo: Mỗi slide 1 bài tập riêng
                </Typography>
                <Typography variant="body1" paragraph>
                    Demo này cho thấy cách sử dụng đơn giản nhất: mỗi slide chỉ liên kết với 1 bài tập hoặc 1 quiz duy nhất.
                    Không có navigation phức tạp, mỗi slide có nội dung riêng biệt.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ✅ Slide 2: Bài tập chữ A (1 bài duy nhất)<br/>
                    ✅ Slide 3: Bài tập chữ B (1 bài duy nhất)<br/>
                    ✅ Slide 4: Bài tập chữ C (1 bài duy nhất)<br/>
                    ✅ Slide 5: Quiz A & B (1 quiz duy nhất)<br/>
                    ✅ Slide 6: Quiz tổng hợp (1 quiz duy nhất)<br/>
                    ✅ Không có navigation bar phức tạp
                </Typography>
            </Paper>

            <KidsSlideshow data={simpleData} />
        </Container>
    );
};

export default SimpleDemo;
