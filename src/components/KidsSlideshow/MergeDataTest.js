import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import KidsSlideshow from './KidsSlideshow';

// Test data với slides + exercises/quizzes riêng biệt (giống API thực tế)
const mergeTestData = {
    title: 'Bài học mẫu với Quiz & Exercise',
    subjectGrade: 'Toán lớp 5',
    slides: [
        {
            id: 'slide_1',
            type: 'content',
            title: 'Giới thiệu bài học',
            content: [
                'Chào mừng các em đến với bài học hôm nay',
                'Chúng ta sẽ học về phép tính cơ bản'
            ]
        },
        {
            id: 'slide_2', 
            type: 'quiz',
            title: 'Kiểm tra kiến thức',
            quizId: 'quiz_math_basic', // Tham chiếu đến quiz trong mảng quizzes
            description: 'Hãy trả lời các câu hỏi sau'
        },
        {
            id: 'slide_3',
            type: 'exercise', 
            title: 'Bài tập thực hành',
            exerciseId: 'exercise_math_practice', // Tham chiếu đến exercise trong mảng exercises
            description: 'Làm bài tập để củng cố kiến thức'
        },
        {
            id: 'slide_4',
            type: 'quiz',
            title: 'Quiz không tìm thấy data',
            quizId: 'quiz_not_found', // Quiz này không có trong mảng quizzes
            description: 'Quiz này sẽ fallback về quiz đầu tiên'
        },
        {
            id: 'slide_5',
            type: 'exercise',
            title: 'Exercise không tìm thấy data', 
            exerciseId: 'exercise_not_found', // Exercise này không có trong mảng exercises
            description: 'Exercise này sẽ fallback về exercise đầu tiên'
        },
        {
            id: 'slide_6',
            type: 'quiz',
            title: 'Quiz trên lớp',
            description: 'Quiz tương tác không có questions cụ thể'
            // Không có quizId, sẽ không merge data từ mảng quizzes
        }
    ],
    
    // Mảng quizzes riêng biệt
    quizzes: [
        {
            id: 'quiz_math_basic',
            title: 'Quiz Toán cơ bản',
            description: 'Kiểm tra kiến thức về phép tính cơ bản',
            questions: [
                {
                    question: '3 + 5 = ?',
                    options: ['7', '8', '9', '10'],
                    correctOption: 1,
                    explanation: '3 + 5 = 8'
                },
                {
                    question: '12 - 4 = ?',
                    options: ['6', '7', '8', '9'],
                    correctOption: 2,
                    explanation: '12 - 4 = 8'
                }
            ]
        },
        {
            id: 'quiz_science_basic', 
            title: 'Quiz Khoa học cơ bản',
            description: 'Một quiz khác để test fallback',
            questions: [
                {
                    question: 'Mặt trời mọc ở hướng nào?',
                    options: ['Bắc', 'Nam', 'Đông', 'Tây'],
                    correctOption: 2
                }
            ]
        }
    ],

    // Mảng exercises riêng biệt
    exercises: [
        {
            id: 'exercise_math_practice',
            title: 'Bài tập Toán thực hành',
            description: 'Điền số thích hợp vào chỗ trống',
            questions: [
                {
                    question: '7 + 3 = ____',
                    correctAnswer: '10',
                    hint: 'Phép cộng đơn giản'
                },
                {
                    question: '15 - 6 = ____', 
                    correctAnswer: '9',
                    hint: 'Phép trừ cơ bản'
                }
            ]
        },
        {
            id: 'exercise_api_format',
            title: 'Bài tập định dạng API',
            description: 'Exercise với questions và answers riêng biệt',
            questions: [
                'Có ____ ngày trong một tuần',
                'Có ____ tháng trong một năm'
            ],
            answers: [
                '7',
                '12'
            ]
        }
    ]
};

// Test data với structure không đầy đủ
const incompleteTestData = {
    title: 'Bài học thiếu dữ liệu',
    slides: [
        {
            id: 'slide_1',
            type: 'quiz',
            title: 'Quiz không có mảng quizzes',
            quizId: 'some_quiz_id'
        },
        {
            id: 'slide_2', 
            type: 'exercise',
            title: 'Exercise không có mảng exercises',
            exerciseId: 'some_exercise_id'
        }
    ]
    // Không có mảng quizzes và exercises
};

const MergeDataTest = () => {
    const [selectedDataset, setSelectedDataset] = React.useState('complete');

    const datasets = {
        complete: {
            label: 'Data đầy đủ (có slides + quizzes + exercises)',
            data: mergeTestData
        },
        incomplete: {
            label: 'Data thiếu (chỉ có slides, không có quizzes/exercises)',
            data: incompleteTestData
        }
    };

    const currentData = datasets[selectedDataset].data;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                🔄 Test Merge Data Quiz & Exercise
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Kiểm tra logic merge dữ liệu từ mảng exercises/quizzes vào slides trong KidsSlideshow
            </Typography>

            {/* Dataset selector */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Chọn dataset test:</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {Object.entries(datasets).map(([key, dataset]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedDataset(key)}
                            style={{
                                padding: '12px 24px',
                                border: selectedDataset === key ? '2px solid #1976d2' : '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: selectedDataset === key ? '#e3f2fd' : 'white',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: selectedDataset === key ? 'bold' : 'normal'
                            }}
                        >
                            {dataset.label}
                        </button>
                    ))}
                </Box>
            </Paper>

            {/* Data structure display */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>📊 Cấu trúc dữ liệu hiện tại:</Typography>
                <Box sx={{ fontSize: '14px', fontFamily: 'monospace' }}>
                    <div>📄 Slides: {currentData.slides?.length || 0}</div>
                    <div>🧪 Quizzes: {currentData.quizzes?.length || 0}</div>
                    <div>📝 Exercises: {currentData.exercises?.length || 0}</div>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Raw Data (click to expand):</Typography>
                <details>
                    <summary style={{ cursor: 'pointer', color: '#1976d2' }}>
                        Click để xem dữ liệu chi tiết
                    </summary>
                    <pre style={{ 
                        fontSize: '11px', 
                        overflow: 'auto', 
                        maxHeight: '300px',
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {JSON.stringify(currentData, null, 2)}
                    </pre>
                </details>
            </Paper>

            {/* KidsSlideshow component */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>🎯 KidsSlideshow Render:</Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Quan sát console log để xem quá trình merge dữ liệu
                </Typography>
                
                <KidsSlideshow 
                    data={currentData}
                    autoPlay={false}
                    onComplete={(result) => {
                        console.log('Slideshow completed:', result);
                        alert(`Slideshow completed! Score: ${result.score}`);
                    }}
                />
            </Paper>

            {/* Test instructions */}
            <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.50' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                    📋 Hướng dẫn test:
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                    <li>Chuyển qua các slide để xem logic merge hoạt động</li>
                    <li>Slide 2 (quiz): Tìm quiz theo quizId "quiz_math_basic"</li>
                    <li>Slide 3 (exercise): Tìm exercise theo exerciseId "exercise_math_practice"</li>
                    <li>Slide 4 (quiz): Quiz không tìm thấy, fallback về quiz đầu tiên</li>
                    <li>Slide 5 (exercise): Exercise không tìm thấy, fallback về exercise đầu tiên</li>
                    <li>Slide 6 (quiz): Quiz trên lớp, không merge data từ mảng</li>
                    <li>Quan sát console log để xem quá trình tìm kiếm và merge</li>
                    <li>Test dataset "thiếu dữ liệu" để xem xử lý khi không có mảng quizzes/exercises</li>
                </Box>
            </Paper>
        </Box>
    );
};

export default MergeDataTest;
