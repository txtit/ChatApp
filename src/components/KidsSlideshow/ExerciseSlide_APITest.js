import React, { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import ExerciseSlide from './ExerciseSlide';

// Dữ liệu test giống như từ API thực tế
const testExerciseData = {
    type: "exercise",
    title: "Bài tập điền chữ cái",
    description: "Điền chữ cái còn thiếu vào các từ dưới đây",
    timeLimit: 10,
    difficulty: "Dễ",
    answers: ["B", "A", "D", "E"],
    questions: ["B_nana", "A_pple", "D_g", "E_lephant"]
};

// Dữ liệu test phức tạp hơn
const complexExerciseData = {
    type: "exercise", 
    title: "Bài tập từ vựng nâng cao",
    description: "Hoàn thành các từ tiếng Anh sau",
    timeLimit: 15,
    difficulty: "Trung bình",
    answers: ["CAR", "HOUSE", "TREE", "WATER", "BOOK"],
    questions: ["C_R (phương tiện)", "HOU_E (ngôi nhà)", "TR_E (cây)", "WA_ER (nước)", "BO_K (sách)"]
};

// Dữ liệu test với cấu trúc questions array hoàn chỉnh (dạng cũ)
const standardExerciseData = {
    type: "exercise",
    title: "Bài tập toán học",
    description: "Giải các phép tính sau",
    questions: [
        {
            question: "2 + 2 = ?",
            correctAnswer: "4",
            type: "number",
            hint: "Phép cộng đơn giản",
            inputLabel: "Nhập kết quả",
            placeholder: "Nhập số..."
        },
        {
            question: "5 × 3 = ?", 
            correctAnswer: "15",
            type: "number",
            hint: "5 nhân với 3",
            inputLabel: "Nhập kết quả"
        }
    ]
};

const ExerciseSlide_APITest = () => {
    const [currentTest, setCurrentTest] = useState(0);
    const [showResults, setShowResults] = useState(false);
    
    const testCases = [
        { name: "API Data - Simple", data: testExerciseData },
        { name: "API Data - Complex", data: complexExerciseData },
        { name: "Standard Format", data: standardExerciseData }
    ];
    
    const handleComplete = (score) => {
        console.log('✅ Exercise completed with score:', score);
        setShowResults(true);
    };
    
    const resetTest = () => {
        setShowResults(false);
    };
    
    const switchTest = (index) => {
        setCurrentTest(index);
        setShowResults(false);
    };
    
    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
            <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                    🧪 ExerciseSlide API Test
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Test ExerciseSlide với dữ liệu từ API thực tế (questions + answers arrays)
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {testCases.map((testCase, index) => (
                        <Button
                            key={index}
                            variant={currentTest === index ? "contained" : "outlined"}
                            onClick={() => switchTest(index)}
                            sx={{ mb: 1 }}
                        >
                            {testCase.name}
                        </Button>
                    ))}
                </Box>
                
                <Button
                    variant="outlined"
                    onClick={resetTest}
                    sx={{ mt: 2 }}
                    disabled={!showResults}
                >
                    Reset Test
                </Button>
            </Paper>
            
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    📋 Current Test Data:
                </Typography>
                <Typography 
                    component="pre" 
                    sx={{ 
                        fontSize: '0.8rem', 
                        fontFamily: 'monospace',
                        background: '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto'
                    }}
                >
                    {JSON.stringify(testCases[currentTest].data, null, 2)}
                </Typography>
            </Paper>
            
            <ExerciseSlide
                data={testCases[currentTest].data}
                onComplete={handleComplete}
                showResults={showResults}
            />
        </Box>
    );
};

export default ExerciseSlide_APITest;
