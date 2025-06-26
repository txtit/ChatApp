import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';
import KidsSlideshow from './KidsSlideshow';

// Demo data với 1 slide exercise liên kết tới 3 bài tập
const multiExerciseData = {
    title: "Bài học về chữ cái - Nhiều bài tập",
    subjectGrade: "Tiếng Việt - Lớp 1",
    slides: [
        {
            id: "slide_1",
            title: "Học chữ cái A, B, C",
            content: "Hôm nay chúng ta sẽ học về 3 chữ cái đầu tiên trong bảng chữ cái",
            type: "content"
        },
        {
            id: "slide_2", 
            title: "Bài tập về chữ cái",
            content: "Làm các bài tập để củng cố kiến thức",
            type: "exercise"
        }
    ],
    exercises: [
        {
            id: "exercise_2_1",
            title: "Bài 1: Điền chữ cái A",
            description: "Điền chữ cái A vào chỗ trống",
            questions: ["_pple", "C_r", "B_t"],
            answers: ["A", "A", "A"]
        },
        {
            id: "exercise_2_2", 
            title: "Bài 2: Điền chữ cái B",
            description: "Điền chữ cái B vào chỗ trống",
            questions: ["_all", "_ook", "_ird"],
            answers: ["B", "B", "B"]
        },
        {
            id: "exercise_2_3",
            title: "Bài 3: Điền chữ cái C",
            description: "Điền chữ cái C vào chỗ trống", 
            questions: ["_at", "_ar", "_up"],
            answers: ["C", "C", "C"]
        }
    ],
    quizzes: []
};

const MultiExerciseDemo = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'info.50' }}>
                <Typography variant="h4" gutterBottom color="info.main">
                    🎯 Demo: Nhiều bài tập trong 1 slide
                </Typography>
                <Typography variant="body1" paragraph>
                    Demo này cho thấy cách hệ thống xử lý khi 1 slide exercise được liên kết với nhiều bài tập.
                    Slide "Bài tập về chữ cái" sẽ hiển thị 3 bài tập khác nhau với navigation để chuyển qua lại.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ✅ Navigation hiển thị "Bài tập 1/3", "Bài tập 2/3", "Bài tập 3/3"<br/>
                    ✅ Có nút "Bài trước" và "Bài tiếp" để chuyển<br/>
                    ✅ Reset kết quả khi chuyển bài tập<br/>
                    ✅ Mỗi bài tập có dữ liệu riêng biệt
                </Typography>
            </Paper>

            <KidsSlideshow data={multiExerciseData} />
        </Container>
    );
};

export default MultiExerciseDemo;
