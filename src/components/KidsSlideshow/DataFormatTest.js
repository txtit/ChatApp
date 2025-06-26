import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import QuizSlide from './QuizSlide';
import ExerciseSlide from './ExerciseSlide';

// Test data cho các format khác nhau từ API
const testData = {
    // 1. Quiz với format chuẩn (correctOption)
    quizStandardFormat: {
        type: 'quiz',
        title: 'Quiz định dạng chuẩn',
        description: 'Quiz sử dụng trường correctOption',
        questions: [
            {
                question: 'Kết quả của 2 + 2 là gì?',
                options: ['3', '4', '5', '6'],
                correctOption: 1,
                explanation: 'Phép cộng cơ bản: 2 + 2 = 4'
            },
            {
                question: 'Thủ đô của Việt Nam là?',
                options: ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'],
                correctOption: 1
            }
        ]
    },

    // 2. Quiz với format cũ (correctAnswer)
    quizOldFormat: {
        type: 'quiz',
        title: 'Quiz định dạng cũ',
        description: 'Quiz sử dụng trường correctAnswer',
        questions: [
            {
                question: 'Con vật nào là loài có vú?',
                options: ['Cá', 'Chim', 'Chó', 'Ếch'],
                correctAnswer: 2, // Sử dụng correctAnswer thay vì correctOption
                explanation: 'Chó là động vật có vú'
            },
            {
                question: 'Màu sắc của mặt trời là?',
                options: ['Đỏ', 'Vàng', 'Xanh', 'Tím'],
                correctAnswer: 1
            }
        ]
    },

    // 3. Quiz chỉ có title (quiz trên lớp)
    quizClassroomOnly: {
        type: 'quiz',
        title: 'Quiz tương tác trên lớp',
        description: 'Học sinh sẽ trả lời theo hướng dẫn của giáo viên',
        content: [
            'Hãy nghe giáo viên đọc câu hỏi',
            'Giơ tay để trả lời',
            'Thảo luận nhóm trước khi đưa ra đáp án'
        ],
        imagePrompt: 'Hình ảnh các em học sinh tham gia hoạt động quiz tương tác'
    },

    // 4. Quiz có quizId nhưng chưa load questions
    quizWithIdOnly: {
        type: 'quiz',
        title: 'Quiz đang tải dữ liệu',
        quizId: 'quiz_12345',
        description: 'Quiz này cần load từ API'
    },

    // 5. Exercise với format chuẩn (array of objects)
    exerciseStandardFormat: {
        type: 'exercise',
        title: 'Bài tập điền từ',
        description: 'Điền từ thích hợp vào chỗ trống',
        questions: [
            {
                question: 'Thủ đô của Pháp là ____',
                correctAnswer: 'Paris',
                hint: 'Thành phố ánh sáng'
            },
            {
                question: 'Con sông dài nhất thế giới là sông ____',
                correctAnswer: 'Nile',
                hint: 'Chảy qua Ai Cập'
            }
        ]
    },

    // 6. Exercise với format API (questions và answers riêng biệt)
    exerciseAPIFormat: {
        type: 'exercise',
        title: 'Bài tập từ API',
        description: 'Dữ liệu được tách riêng questions và answers',
        questions: [
            'Việt Nam có ____ tỉnh thành',
            'Ngôn ngữ chính thức của Việt Nam là tiếng ____',
            'Đơn vị tiền tệ của Việt Nam là ____'
        ],
        answers: [
            '63',
            'Việt',
            'VNĐ'
        ]
    },

    // 7. Exercise chỉ có title (bài tập trên lớp)
    exerciseClassroomOnly: {
        type: 'exercise',
        title: 'Bài tập thực hành trên lớp',
        description: 'Bài tập sẽ được thực hiện theo nhóm',
        content: [
            'Chia thành các nhóm 4-5 người',
            'Mỗi nhóm thảo luận và đưa ra đáp án',
            'Đại diện nhóm trình bày kết quả'
        ],
        imagePrompt: 'Hình ảnh học sinh làm việc nhóm trong lớp học'
    },

    // 8. Exercise có exerciseId nhưng chưa load
    exerciseWithIdOnly: {
        type: 'exercise',
        title: 'Bài tập đang tải',
        exerciseId: 'exercise_67890',
        description: 'Bài tập này cần load từ API'
    },

    // 9. Content slide bình thường
    contentSlide: {
        type: 'content',
        title: 'Slide nội dung',
        content: [
            'Đây là slide nội dung thông thường',
            'Không có câu hỏi hay bài tập',
            'Chỉ hiển thị thông tin'
        ]
    }
};

const DataFormatTest = () => {
    const [selectedTest, setSelectedTest] = React.useState(null);

    const testCases = [
        { key: 'quizStandardFormat', label: 'Quiz - Format chuẩn (correctOption)', component: QuizSlide },
        { key: 'quizOldFormat', label: 'Quiz - Format cũ (correctAnswer)', component: QuizSlide },
        { key: 'quizClassroomOnly', label: 'Quiz - Chỉ có title (quiz trên lớp)', component: QuizSlide },
        { key: 'quizWithIdOnly', label: 'Quiz - Có quizId chưa load', component: QuizSlide },
        { key: 'exerciseStandardFormat', label: 'Exercise - Format chuẩn', component: ExerciseSlide },
        { key: 'exerciseAPIFormat', label: 'Exercise - Format API (questions + answers)', component: ExerciseSlide },
        { key: 'exerciseClassroomOnly', label: 'Exercise - Chỉ có title (bài tập trên lớp)', component: ExerciseSlide },
        { key: 'exerciseWithIdOnly', label: 'Exercise - Có exerciseId chưa load', component: ExerciseSlide }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                🧪 Test các định dạng dữ liệu Quiz & Exercise
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Kiểm tra xem các component hiển thị đúng với các loại dữ liệu khác nhau từ API
            </Typography>

            {/* Test case buttons */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Chọn test case:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {testCases.map((testCase) => (
                        <button
                            key={testCase.key}
                            onClick={() => setSelectedTest(testCase)}
                            style={{
                                padding: '8px 16px',
                                margin: '4px',
                                border: selectedTest?.key === testCase.key ? '2px solid #1976d2' : '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: selectedTest?.key === testCase.key ? '#e3f2fd' : 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {testCase.label}
                        </button>
                    ))}
                </Box>
            </Paper>

            {/* Selected test display */}
            {selectedTest && (
                <>
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h5" sx={{ mb: 2, color: 'secondary.main' }}>
                        📋 Test: {selectedTest.label}
                    </Typography>

                    {/* Raw data display */}
                    <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Raw Data:</Typography>
                        <pre style={{ 
                            fontSize: '12px', 
                            overflow: 'auto', 
                            maxHeight: '200px',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {JSON.stringify(testData[selectedTest.key], null, 2)}
                        </pre>
                    </Paper>

                    {/* Component render */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Component Render:</Typography>
                        <selectedTest.component 
                            data={testData[selectedTest.key]}
                            onSubmit={(result) => {
                                console.log('Test result:', result);
                                alert(`Test completed! Result: ${JSON.stringify(result)}`);
                            }}
                            onComplete={(score) => {
                                console.log('Test completed with score:', score);
                                alert(`Test completed with score: ${score}`);
                            }}
                            showResults={false}
                        />
                    </Paper>
                </>
            )}

            {!selectedTest && (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="h6" color="text.secondary">
                        👆 Chọn một test case ở trên để bắt đầu kiểm tra
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default DataFormatTest;
