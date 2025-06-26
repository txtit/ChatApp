import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import ExerciseSlide from './ExerciseSlide';

const ExerciseTestComponent = () => {
    // Dữ liệu test với array câu hỏi toán
    const mathExerciseData = {
        type: 'exercise',
        title: 'Bài tập toán cộng',
        description: 'Hãy tính toán các phép cộng dưới đây',
        content: [
            "3 + 2 = ?",
            "5 + 4 = ?", 
            "1 + 6 = ?",
            "8 + 3 = ?",
            "7 + 2 = ?"
        ],
        exerciseId: 'math_addition_001'
    };

    // Dữ liệu test với questions và answers riêng biệt
    const questionsAnswersData = {
        type: 'exercise',
        title: 'Bài tập toán nhân',
        description: 'Hãy tính toán các phép nhân dưới đây',
        questions: [
            "2 × 3 = ?",
            "4 × 5 = ?",
            "3 × 6 = ?"
        ],
        answers: [
            "6",
            "20", 
            "18"
        ],
        exerciseId: 'math_multiplication_001'
    };

    // Dữ liệu test với question objects
    const questionObjectsData = {
        type: 'exercise',
        title: 'Bài tập từ vựng',
        description: 'Điền từ thích hợp vào chỗ trống',
        questions: [
            {
                question: "Con mèo _____ trên cành cây",
                correctAnswer: "ngồi",
                hint: "Động từ chỉ tư thế"
            },
            {
                question: "Hoa _____ rất đẹp",
                correctAnswer: "hồng",
                hint: "Một loại hoa có màu đỏ"
            }
        ],
        exerciseId: 'vocabulary_001'
    };

    const [currentData, setCurrentData] = React.useState(mathExerciseData);
    const [showResults, setShowResults] = React.useState(false);

    const handleComplete = (score) => {
        console.log('Exercise completed with score:', score);
        setShowResults(true);
        
        // Reset sau 3 giây
        setTimeout(() => {
            setShowResults(false);
        }, 3000);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Test ExerciseSlide Component
            </Typography>
            
            {/* Controls để thử nghiệm các loại dữ liệu */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button 
                    variant={currentData === mathExerciseData ? "contained" : "outlined"}
                    onClick={() => {
                        setCurrentData(mathExerciseData);
                        setShowResults(false);
                    }}
                >
                    Test Math (Content Array)
                </Button>
                <Button 
                    variant={currentData === questionsAnswersData ? "contained" : "outlined"}
                    onClick={() => {
                        setCurrentData(questionsAnswersData);
                        setShowResults(false);
                    }}
                >
                    Test Math (Questions/Answers)
                </Button>
                <Button 
                    variant={currentData === questionObjectsData ? "contained" : "outlined"}
                    onClick={() => {
                        setCurrentData(questionObjectsData);
                        setShowResults(false);
                    }}
                >
                    Test Vocabulary (Question Objects)
                </Button>
            </Box>

            {/* Hiển thị dữ liệu hiện tại */}
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Current Data Structure:
                </Typography>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(currentData, null, 2)}
                </pre>
            </Box>

            {/* ExerciseSlide component */}
            <ExerciseSlide
                data={currentData}
                onComplete={handleComplete}
                showResults={showResults}
            />
        </Container>
    );
};

export default ExerciseTestComponent;
