import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Divider,
    Grid,
    Card,
    CardContent,
    CardActions,
    Chip,
    Alert
} from '@mui/material';
import {
    PlayArrow,
    BugReport,
    DataUsage,
    MergeType,
    Quiz,
    Assignment,
    School
} from '@mui/icons-material';

// Import all test components
import KidsSlideshow from './KidsSlideshow';
import DataFormatTest from './DataFormatTest';
import MergeDataTest from './MergeDataTest';
import KidsSlideshowDemo from './KidsSlideshowDemo';
import KidsSlideshow_Test from './KidsSlideshow_Test';
import ExerciseSlide_APITest from './ExerciseSlide_APITest';

const ComprehensiveTestSuite = () => {
    const [activeTest, setActiveTest] = useState(null);

    const testSuites = [
        {
            id: 'dataformat',
            title: '🧪 Data Format Test',
            description: 'Kiểm tra tất cả các định dạng dữ liệu Quiz & Exercise',
            component: DataFormatTest,
            category: 'Individual Components',
            features: [
                'Quiz với correctOption vs correctAnswer',
                'Exercise với questions/answers riêng biệt',
                'Quiz/Exercise trên lớp (không có questions)',
                'Các trường hợp thiếu dữ liệu'
            ]
        },
        {
            id: 'merge',
            title: '🔄 Merge Data Test', 
            description: 'Kiểm tra logic merge dữ liệu từ mảng exercises/quizzes',
            component: MergeDataTest,
            category: 'Integration Logic',
            features: [
                'Tìm quiz/exercise theo ID',
                'Fallback khi không tìm thấy',
                'Merge data vào slide hiện tại',
                'Xử lý trường hợp thiếu mảng'
            ]
        },
        {
            id: 'slideshow-demo',
            title: '🎬 KidsSlideshow Demo',
            description: 'Demo đầy đủ với dữ liệu mẫu',
            component: KidsSlideshowDemo,
            category: 'Full Integration',
            features: [
                'Navigation giữa các slide',
                'Progress tracking',
                'Audio controls',
                'Auto-play mode'
            ]
        },
        {
            id: 'slideshow-test',
            title: '🧪 KidsSlideshow Test',
            description: 'Test với nhiều loại dữ liệu khác nhau',
            component: KidsSlideshow_Test,
            category: 'Full Integration',
            features: [
                'Multiple data scenarios',
                'Error handling',
                'Edge cases',
                'Debug information'
            ]
        },
        {
            id: 'exercise-api',
            title: '📝 Exercise API Test',
            description: 'Test ExerciseSlide với dữ liệu từ API',
            component: ExerciseSlide_APITest,
            category: 'Individual Components',
            features: [
                'API format data',
                'Different exercise types',
                'Answer validation',
                'Score calculation'
            ]
        }
    ];

    if (activeTest) {
        const testSuite = testSuites.find(t => t.id === activeTest);
        const TestComponent = testSuite.component;
        
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button 
                        onClick={() => setActiveTest(null)}
                        sx={{ mr: 2 }}
                        variant="outlined"
                    >
                        ← Quay lại
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {testSuite.title}
                    </Typography>
                </Box>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Mô tả:</strong> {testSuite.description}
                </Alert>
                
                <TestComponent />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ 
                p: 4, 
                mb: 4, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center'
            }}>
                <School sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    📚 Comprehensive Test Suite
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Hệ thống test toàn diện cho KidsSlideshow, Quiz & Exercise components
                </Typography>
            </Paper>

            <Alert severity="success" sx={{ mb: 4 }}>
                <Typography variant="body1">
                    <strong>✅ Tình trạng hệ thống:</strong> Đã hoàn thiện logic chính, hỗ trợ đa dạng format dữ liệu từ API.
                    Sử dụng các test suite dưới đây để kiểm tra tính năng cụ thể.
                </Typography>
            </Alert>

            {/* Group test suites by category */}
            {['Individual Components', 'Integration Logic', 'Full Integration'].map(category => (
                <Box key={category} sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'secondary.main' }}>
                        {category === 'Individual Components' && '🧩'} 
                        {category === 'Integration Logic' && '⚙️'} 
                        {category === 'Full Integration' && '🎯'} 
                        {' '}{category}
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {testSuites.filter(test => test.category === category).map((testSuite) => (
                            <Grid item xs={12} md={6} lg={4} key={testSuite.id}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            {testSuite.id === 'dataformat' && <DataUsage color="primary" sx={{ mr: 1 }} />}
                                            {testSuite.id === 'merge' && <MergeType color="primary" sx={{ mr: 1 }} />}
                                            {testSuite.id.includes('slideshow') && <School color="primary" sx={{ mr: 1 }} />}
                                            {testSuite.id === 'exercise-api' && <Assignment color="primary" sx={{ mr: 1 }} />}
                                            
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {testSuite.title}
                                            </Typography>
                                        </Box>
                                        
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {testSuite.description}
                                        </Typography>
                                        
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            Tính năng test:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {testSuite.features.map((feature, index) => (
                                                <Chip 
                                                    key={index}
                                                    label={feature}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem', height: 'auto', py: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                    
                                    <CardActions>
                                        <Button 
                                            variant="contained" 
                                            fullWidth
                                            onClick={() => setActiveTest(testSuite.id)}
                                            startIcon={<PlayArrow />}
                                            sx={{ 
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                                            }}
                                        >
                                            Chạy Test
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    
                    <Divider sx={{ mt: 4 }} />
                </Box>
            ))}

            {/* Debug information */}
            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                    🔧 Debug Information
                </Typography>
                <Box sx={{ fontSize: '14px', fontFamily: 'monospace' }}>
                    <div>✅ QuizSlide: Hỗ trợ correctOption & correctAnswer</div>
                    <div>✅ ExerciseSlide: Hỗ trợ questions/answers arrays & objects</div>
                    <div>✅ KidsSlideshow: Logic merge dữ liệu từ exercises/quizzes</div>
                    <div>✅ Redux: slideSlice quản lý currentSlide state</div>
                    <div>✅ Error Handling: Xử lý tất cả edge cases</div>
                </Box>
            </Paper>
        </Box>
    );
};

export default ComprehensiveTestSuite;
