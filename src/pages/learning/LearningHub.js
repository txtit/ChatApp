import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardMedia, CardContent, Typography, Chip, Box, Button,
    LinearProgress, CircularProgress, Container, InputAdornment, TextField,
    IconButton, Menu, MenuItem, Divider, CardActionArea, CardActions, Tooltip,
    Paper, Fade, Tab, Tabs, Alert, Stack
} from '@mui/material';
import {
    Search, FilterList, Add, Visibility, Edit, CalendarToday,
    BookOutlined, ArrowForward, Sort, MoreVert, School,
    Science, Translate, Calculate, SortByAlpha, AccessTime,
    CheckCircle, PieChart, PlayArrow, Timer, TrendingUp, Star
} from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/vi';
import axiosInstance from '../../utils/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProgressV2 } from '../../hooks/useProgressV2';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearAllLessonsData,
    selectLastSlidePositions,
    selectAllLessonsData,
    selectLessonData
} from '../../redux/slices/progessV2';

const LearningHub = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [currentTab, setCurrentTab] = useState(0); const [subjects, setSubjects] = useState([]);    // Use the Redux-based progress tracking system
    const {
        currentSlide,
        allLessonsData,
        initLesson,
        setSlide,
        saveLastSlidePosition,
        getLastSlidePosition,
        isLessonCompleted,
        getLessonProgress,
        getLessonScore,
        getLessonProgressPercentage,
        getLastSlidePositionForLesson,
        forceUpdateProgress
    } = useProgressV2();// Get lesson progress from Redux with safety checks
    const lessonProgress = useSelector(state => state.slide?.lessonProgress || {});

    const currentUserId = localStorage.getItem("user_id") || 'demo-user' + Date.now();    // Initialize lesson progress when slides are loaded with the correct structure
    useEffect(() => {
        if (slides.length > 0) {
            // Initialize the learning hub as a meta-lesson to track overall progress
            initLesson({
                totalSlides: slides.length,
                lessonId: 'learning-hub',
                lessonTitle: 'Thư viện bài học'
            });
        }
    }, [slides.length, initLesson]);    // Debug Redux hooks
    useEffect(() => {
        console.log('🔍 LearningHub Redux State Debug:', {
            allLessonsData,
            lessonsCount: Object.keys(allLessonsData).length,
            lessonIds: Object.keys(allLessonsData),
            slidesLoaded: slides.length,
            hasForceUpdateProgress: typeof forceUpdateProgress === 'function',
            hasSaveLastSlidePosition: typeof saveLastSlidePosition === 'function'
        });
    }, [allLessonsData, slides.length, forceUpdateProgress, saveLastSlidePosition]);// Get lesson progress percentage using the new lessons structure
    const getLessonProgressPercentageDisplay = (lessonId) => {
        const reduxProgress = getLessonProgressPercentage(lessonId);

        // Debug: Log progress data
        console.log('📊 LearningHub Progress Debug for', lessonId, ':', {
            reduxProgress,
            lessonData: allLessonsData[lessonId],
            hasLessonData: !!allLessonsData[lessonId],
            allLessonsKeys: Object.keys(allLessonsData),
            fullAllLessonsData: allLessonsData
        });

        return reduxProgress;
    };// Check if lesson is completed using the new lessons structure
    const isLessonCompletedRedux = (lessonId) => {
        return isLessonCompleted(lessonId);
    };    // Get lesson score for display using the new lessons structure
    const getLessonScoreDisplay = (lessonId) => {
        return getLessonScore(lessonId);
    };// Get lesson status text based on the new lessons structure
    const getLessonStatusText = (lessonId) => {
        if (!lessonId) return 'Chưa bắt đầu';

        const progress = getLessonProgressPercentageDisplay(lessonId); const isCompleted = isLessonCompletedRedux(lessonId);
        const score = getLessonScoreDisplay(lessonId);

        if (isCompleted) {
            return score !== null ? `Hoàn thành (${score}%)` : 'Hoàn thành';
        }

        if (progress >= 75) return 'Gần hoàn thành';
        if (progress >= 50) return 'Đang học';
        if (progress >= 25) return 'Đã bắt đầu';
        if (progress > 0) return 'Đã xem';
        return 'Chưa bắt đầu';
    };    // Get last slide position for a lesson using the new lessons structure
    const getLastSlidePositionForLessonDisplay = (lessonId) => {
        return getLastSlidePositionForLesson(lessonId);
    };    // Test function để debug progress update
    const testProgressUpdate = (lessonId) => {
        console.log('🧪 Testing progress update for lesson:', lessonId);

        // First, ensure the lesson is properly initialized
        const existingLessonData = allLessonsData[lessonId];
        console.log('📊 Existing lesson data:', existingLessonData);
        // If lesson doesn't have totalSlides, initialize it properly
        if (!existingLessonData || !existingLessonData.totalSlides || existingLessonData.totalSlides === 0) {
            console.log('⚠️ Lesson not properly initialized, initializing now...');
            const lessonItem = slides.find(slide => slide.id === lessonId || slide._id === lessonId);
            const lessonTitle = lessonItem ? lessonItem.title : 'Test Lesson';

            // Initialize with default 10 slides for testing
            initLesson({
                totalSlides: 10,
                lessonId: lessonId,
                lessonTitle: lessonTitle
            });

            console.log('✅ Lesson initialized with 10 slides for testing');

            // Wait a bit for Redux to update
            setTimeout(() => {
                testProgressUpdate(lessonId);
            }, 100);
            return;
        }

        // Now test with various slide indices
        console.log('Testing slideIndex 0...');
        forceUpdateProgress(lessonId, 0);

        setTimeout(() => {
            console.log('Testing slideIndex 1...');
            forceUpdateProgress(lessonId, 1);

            setTimeout(() => {
                console.log('Testing slideIndex 2...');
                forceUpdateProgress(lessonId, 2);

                setTimeout(() => {
                    console.log('Final state check:', {
                        progress: getLessonProgressPercentageDisplay(lessonId),
                        lessonData: allLessonsData[lessonId]
                    });
                }, 200);
            }, 200);
        }, 200);
    };// Handle starting learning for a lesson
    const handleStartLearning = async (lessonId, lessonTitle) => {
        try {
            console.log('🚀 Starting learning with:', { lessonId, lessonTitle });

            // Validate lessonId and lessonTitle first
            const safeLessonId = lessonId || `lesson_${Date.now()}`;
            const safeLessonTitle = lessonTitle || 'Bài học không có tiêu đề';

            // Fetch lesson data from API
            const response = await axiosInstance.get(`/learn/slides-data/${safeLessonId}`);
            console.log('📡 API response:', response.data);

            // Get the actual slide data to determine total slides
            const slideData = response.data || {};
            const totalSlides = slideData.slides ? slideData.slides.length : 1;
            console.log('📊 Total slides detected:', totalSlides);

            // Initialize this specific lesson with correct slide count
            initLesson({
                totalSlides: totalSlides,
                lessonId: safeLessonId,
                lessonTitle: safeLessonTitle
            });

            // Check if there's a saved slide position for this lesson
            const lastSlidePosition = getLastSlidePositionForLessonDisplay(safeLessonId);
            console.log('� Last slide position for lesson:', safeLessonId, lastSlidePosition);

            let startingSlideIndex = 0;

            if (lastSlidePosition && lastSlidePosition.slideIndex >= 0) {
                // Continue from saved position
                startingSlideIndex = lastSlidePosition.slideIndex;
                console.log('� Continuing from saved position:', startingSlideIndex);
            } else {
                // First time starting - mark as started at slide 0
                console.log('🚀 First time starting lesson - marking as started');
                saveLastSlidePosition(safeLessonId, 0, 'slide_0');
                startingSlideIndex = 0;
            }            // Force update progress to ensure it reflects the current position
            console.log('🔄 Before forceUpdateProgress:', {
                lessonId: safeLessonId,
                slideIndex: startingSlideIndex,
                progressBefore: getLessonProgressPercentageDisplay(safeLessonId)
            });

            forceUpdateProgress(safeLessonId, startingSlideIndex);

            // Check progress after force update
            setTimeout(() => {
                const progressAfter = getLessonProgressPercentageDisplay(safeLessonId);
                console.log('📊 After forceUpdateProgress:', {
                    lessonId: safeLessonId,
                    slideIndex: startingSlideIndex,
                    progressAfter: progressAfter,
                    allLessonsDataAfter: allLessonsData[safeLessonId]
                });
            }, 100);

            // Set the current lesson in Redux
            setSlide({
                id: `${safeLessonId}_slide_${startingSlideIndex}`,
                title: safeLessonTitle,
                content: slideData,
                type: 'content',
                lessonId: safeLessonId
            });

            console.log('✅ Lesson set successfully, navigating...');

            // Navigate to lesson with correct slide position
            let navigationUrl = `/slide/${safeLessonId}`;
            if (startingSlideIndex > 0) {
                navigationUrl += `?slideIndex=${startingSlideIndex}`;
                console.log('🎯 Continuing from slide index:', startingSlideIndex);
            }

            navigate(navigationUrl);
        } catch (error) {
            console.error('❌ Lỗi khi bắt đầu học:', error);

            // Fallback: still allow navigation if lessonId exists
            if (lessonId) {
                console.log('🔄 Fallback: navigating without setting Redux state');

                // Even in fallback, try to mark as started
                try {
                    const safeLessonId = lessonId || `lesson_${Date.now()}`;
                    const safeLessonTitle = lessonTitle || 'Bài học';

                    initLesson({
                        totalSlides: 10, // Default fallback slide count
                        lessonId: safeLessonId,
                        lessonTitle: safeLessonTitle
                    });

                    // Mark as started and force update progress
                    saveLastSlidePosition(safeLessonId, 0, 'slide_0');
                    forceUpdateProgress(safeLessonId, 0);
                    console.log('📈 Fallback: Lesson marked as started');
                } catch (fallbackError) {
                    console.error('❌ Fallback initialization failed:', fallbackError);
                }

                navigate(`/slide/${lessonId}`);
            }
        }
    };

    // Hàm để lấy ảnh và icon dựa trên môn học
    const getSubjectInfo = (subject) => {
        const subjectMap = {
            "Toán": {
                image: "/math-bg.jpg",
                icon: <Calculate color="primary" />
            },
            "Tiếng Việt": {
                image: "/vietnamese-bg.jpg",
                icon: <BookOutlined color="success" />
            },
            "Khoa học": {
                image: "/science-bg.jpg",
                icon: <Science color="warning" />
            },
            "Tiếng Anh": {
                image: "/english-bg.jpg",
                icon: <Translate color="info" />
            }
        };
        return subjectMap[subject] || { image: "/default-subject.jpg", icon: <School color="secondary" /> };
    };    // Fetch danh sách slide khi component được mount
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/learn/slides/getAll');

                if (response.data.success) {
                    const slidesData = response.data.slides;
                    setSlides(slidesData);

                    // Extract unique subjects for tabs
                    const uniqueSubjects = [...new Set(slidesData.map(slide => slide.subject))];
                    setSubjects(['Tất cả', ...uniqueSubjects]);

                } else {
                    setError("Không thể tải danh sách slide");
                }
            } catch (err) {
                console.error("Lỗi khi lấy danh sách slide:", err);
                setError("Đã xảy ra lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);    // Calculate overall learning statistics using the new lessons structure
    const getOverallStats = () => {
        if (!allLessonsData || Object.keys(allLessonsData).length === 0) {
            return {
                totalLessons: slides.length,
                completedLessons: 0,
                inProgressLessons: 0,
                totalTimeSpent: 0,
                averageScore: 0,
                streakDays: 0,
                achievements: 0
            };
        }

        // Filter out the 'learning-hub' meta-lesson and only consider actual lesson data
        const actualLessons = Object.values(allLessonsData).filter(lesson =>
            lesson.lessonId && lesson.lessonId !== 'learning-hub'
        );

        // Count completed and in-progress lessons using lesson data
        const completedLessonsCount = actualLessons.filter(lesson =>
            lesson.isCompleted === true
        ).length; const inProgressLessonsCount = actualLessons.filter(lesson =>
            lesson.percentage > 0 && !lesson.isCompleted
        ).length;// Calculate average score from completed lessons
        const completedLessonsWithScores = actualLessons.filter(lesson =>
            lesson.isCompleted && lesson.score !== undefined && lesson.score !== null
        );

        const averageScore = completedLessonsWithScores.length > 0
            ? Math.round(completedLessonsWithScores.reduce((sum, lesson) =>
                sum + (lesson.score || 0), 0) / completedLessonsWithScores.length)
            : 0;

        // Calculate total time spent (basic estimation based on access times)
        const totalTimeSpent = actualLessons.reduce((total, lesson) => {
            if (lesson.completedAt && lesson.startTime) {
                return total + (lesson.completedAt - lesson.startTime);
            }
            return total;
        }, 0);

        return {
            totalLessons: slides.length,
            completedLessons: completedLessonsCount,
            inProgressLessons: inProgressLessonsCount,
            totalTimeSpent: Math.floor(totalTimeSpent / 1000), // Convert to seconds
            averageScore,
            streakDays: 0, // Can be implemented later based on access patterns
            achievements: completedLessonsCount // Based on completed lessons
        };
    };

    const overallStats = getOverallStats();    // Improved progress color logic
    const getProgressColor = (percentage) => {
        if (percentage === 0) return 'rgba(0,0,0,0.12)'; // Gray for not started
        if (percentage < 30) return '#ff5722'; // Red for just started
        if (percentage < 70) return '#ff9800'; // Orange for in progress
        if (percentage < 100) return '#2196f3'; // Blue for almost done
        return '#4caf50'; // Green for completed
    };

    // Get progress color variant for MUI components
    const getProgressColorVariant = (percentage) => {
        if (percentage === 0) return 'inherit';
        if (percentage < 30) return 'error';
        if (percentage < 70) return 'warning';
        if (percentage < 100) return 'info';
        return 'success';
    };

    // Format thời gian từ giây sang h:m:s
    const formatTime = (seconds) => {
        if (!seconds || seconds === 0) return '0 phút';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes} phút`;
    };
    const handleSortClick = (event) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setSortAnchorEl(null);
    };

    const handleSortChange = (sortType) => {
        setSortBy(sortType);
        handleSortClose();
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    // Filter and sort slides
    const filteredSlides = slides.filter(slide => {
        const matchesSearch = slide.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = currentTab === 0 || slide.subject === subjects[currentTab];
        return matchesSearch && matchesSubject;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'a-z':
                return a.title.localeCompare(b.title);
            case 'z-a':
                return b.title.localeCompare(a.title);
            case 'slides-asc':
                return a.slideCount - b.slideCount;
            case 'slides-desc':
                return b.slideCount - a.slideCount;
            default:
                return 0;
        }
    });

    // Generate gradient based on subject
    const getGradient = (subject) => {
        const gradientMap = {
            "Toán": "linear-gradient(135deg, #a5d8ff 0%, #74c0fc 100%)",
            "Tiếng Việt": "linear-gradient(135deg, #b2f2bb 0%, #69db7c 100%)",
            "Khoa học": "linear-gradient(135deg, #ffd8a8 0%, #ffa94d 100%)",
            "Tiếng Anh": "linear-gradient(135deg, #d0bfff 0%, #9775fa 100%)"
        };
        return gradientMap[subject] || "linear-gradient(135deg, #e9ecef 0%, #ced4da 100%)";
    };

    // Hiển thị trạng thái loading
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh',
                    textAlign: 'center'
                }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 3, fontWeight: 'medium' }}>
                        Đang tải danh sách bài học...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Vui lòng đợi trong giây lát
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Hiển thị lỗi nếu có
    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: '#FFF8F8'
                    }}
                >
                    <Typography variant="h5" color="error" gutterBottom>
                        {error}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Đã xảy ra lỗi khi tải dữ liệu từ máy chủ
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => window.location.reload()}
                    >
                        Thử lại
                    </Button>
                </Paper>
            </Container>
        );
    } return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header section với thống kê tổng quan */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 4
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Thư viện bài học
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Khám phá và học tập với các bài giảng tương tác
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    size="large"
                    onClick={() => navigate('/course')}
                    sx={{
                        mt: { xs: 2, sm: 0 },
                        px: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 4px 20px 0 rgba(33, 150, 243, 0.3)'
                    }}
                >
                    Tạo bài học mới
                </Button>
            </Box>            {/* Thống kê tổng quan */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                            border: 'none'
                        }}
                    >                        <School color="primary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                            {overallStats.completedLessons}/{overallStats.totalLessons}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Bài học hoàn thành
                        </Typography>
                        {overallStats.inProgressLessons > 0 && (
                            <Typography variant="caption" display="block" color="warning.main" sx={{ mt: 0.5 }}>
                                +{overallStats.inProgressLessons} đang học
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                            border: 'none'
                        }}
                    >
                        <Timer color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                            {formatTime(overallStats.totalTimeSpent)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Thời gian học
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                            border: 'none'
                        }}
                    >
                        <TrendingUp color="success" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                            {overallStats.averageScore > 0 ? `${overallStats.averageScore}%` : '--'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Điểm trung bình
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
                            border: 'none'
                        }}
                    >
                        <Star color="warning" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                            {overallStats.achievements}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Thành tích
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>            {/* Debug Panel - Chỉ hiển thị khi có lesson data */}
            {/* {Object.keys(allLessonsData).length > 0 && (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>🔧 Debug Progress System</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                            <strong>Lessons trong Redux:</strong> {Object.keys(allLessonsData).length}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Lesson IDs:</strong> {Object.keys(allLessonsData).join(', ')}
                        </Typography>                        <Typography variant="body2">
                            <strong>Functions Available:</strong> 
                            initLesson: {typeof initLesson === 'function' ? '✅' : '❌'}, 
                            forceUpdateProgress: {typeof forceUpdateProgress === 'function' ? '✅' : '❌'}, 
                            saveLastSlidePosition: {typeof saveLastSlidePosition === 'function' ? '✅' : '❌'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Slides Structure Debug:</strong> 
                            Total slides: {slides.length}, 
                            First slide ID: {slides[0] ? (slides[0].id || slides[0]._id || 'no-id') : 'no-slides'}, 
                            Fields: {slides[0] ? Object.keys(slides[0]).slice(0, 5).join(', ') : 'no-fields'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => {
                                    console.log('📊 All slides structure:', slides.slice(0, 2));
                                    console.log('📊 All lessons data:', allLessonsData);
                                }}
                            >
                                Debug Slides
                            </Button>
                            <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => {
                                    const firstSlide = slides[0];
                                    if (firstSlide) {
                                        const slideId = firstSlide.id || firstSlide._id;
                                        console.log('🧪 Testing first slide:', slideId);
                                        testProgressUpdate(slideId);
                                    }
                                }}
                            >
                                Test First Slide
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            {Object.keys(allLessonsData).filter(id => id !== 'learning-hub').slice(0, 3).map(lessonId => {
                                const lessonData = allLessonsData[lessonId];
                                return (
                                    <Box key={lessonId} sx={{ 
                                        border: '1px solid #ccc', 
                                        borderRadius: 1, 
                                        p: 1, 
                                        minWidth: 200,
                                        bgcolor: 'white'
                                    }}>
                                        <Typography variant="caption" display="block">
                                            <strong>ID:</strong> {lessonId.slice(0, 8)}...
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            <strong>Progress:</strong> {lessonData.percentage || 0}%
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            <strong>Total Slides:</strong> {lessonData.totalSlides || 0}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            <strong>Last Slide:</strong> {lessonData.lastSlideIndex || 0}
                                        </Typography>
                                        <Button 
                                            size="small" 
                                            variant="outlined"
                                            onClick={() => testProgressUpdate(lessonId)}
                                            sx={{ mt: 0.5 }}
                                        >
                                            Test Progress
                                        </Button>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Alert>
            )} */}

            {/* Display current slide information if available */}
            {currentSlide?.id && (
                <Alert
                    severity="info"
                    sx={{ mb: 3, borderRadius: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => navigate(`/slide/${currentSlide.id}`)}
                        >
                            Tiếp tục
                        </Button>
                    }
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PlayArrow />
                        <Typography variant="body2">
                            Đang học: <strong>{currentSlide.title}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • Slide ID: {currentSlide.id}
                        </Typography>
                    </Box>
                </Alert>
            )}

            {/* Filter and search section */}
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 4,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2
                }}
            >
                <TextField
                    placeholder="Tìm kiếm bài học..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ maxWidth: { md: '40%' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexWrap: 'wrap'
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<Sort />}
                        onClick={handleSortClick}
                        size="small"
                    >
                        {sortBy === 'newest' && 'Mới nhất'}
                        {sortBy === 'oldest' && 'Cũ nhất'}
                        {sortBy === 'a-z' && 'A-Z'}
                        {sortBy === 'z-a' && 'Z-A'}
                        {sortBy === 'slides-asc' && 'Số slide tăng dần'}
                        {sortBy === 'slides-desc' && 'Số slide giảm dần'}
                    </Button>
                    <Menu
                        anchorEl={sortAnchorEl}
                        open={Boolean(sortAnchorEl)}
                        onClose={handleSortClose}
                    >
                        <MenuItem onClick={() => handleSortChange('newest')}>
                            <AccessTime sx={{ mr: 1, fontSize: 20 }} /> Mới nhất
                        </MenuItem>
                        <MenuItem onClick={() => handleSortChange('oldest')}>
                            <AccessTime sx={{ mr: 1, fontSize: 20 }} /> Cũ nhất
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => handleSortChange('a-z')}>
                            <SortByAlpha sx={{ mr: 1, fontSize: 20 }} /> A-Z
                        </MenuItem>
                        <MenuItem onClick={() => handleSortChange('z-a')}>
                            <SortByAlpha sx={{ mr: 1, fontSize: 20, transform: 'scaleX(-1)' }} /> Z-A
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => handleSortChange('slides-asc')}>
                            <FilterList sx={{ mr: 1, fontSize: 20 }} /> Số slide tăng dần
                        </MenuItem>
                        <MenuItem onClick={() => handleSortChange('slides-desc')}>
                            <FilterList sx={{ mr: 1, fontSize: 20, transform: 'scaleY(-1)' }} /> Số slide giảm dần
                        </MenuItem>
                    </Menu>
                </Box>
            </Paper>

            {/* Subject tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ px: 2 }}
                >
                    {subjects.map((subject, index) => (
                        <Tab
                            key={index}
                            label={subject}
                            icon={index === 0 ? undefined : getSubjectInfo(subject).icon}
                            iconPosition="start"
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Content */}
            {filteredSlides.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                        border: '1px dashed #ced4da'
                    }}
                >
                    <BookOutlined sx={{ fontSize: 60, color: '#adb5bd', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>Không tìm thấy bài học</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        {searchTerm ? 'Không có kết quả phù hợp với tìm kiếm của bạn' : 'Hãy tạo bài học mới để bắt đầu!'}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        size="large"
                    >
                        Tạo bài học mới
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredSlides.map((slide, index) => (
                        <Grid item xs={12} sm={6} md={4} key={slide.id}>
                            <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                        }
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => navigate(`/slide/${slide.id}`)}
                                    >
                                        <Box
                                            sx={{
                                                height: 140,
                                                background: getGradient(slide.subject),
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {getSubjectInfo(slide.subject).icon && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 16,
                                                        top: 16,
                                                        bgcolor: 'white',
                                                        borderRadius: '50%',
                                                        p: 1,
                                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    {React.cloneElement(getSubjectInfo(slide.subject).icon,
                                                        { fontSize: 'large' })}
                                                </Box>
                                            )}
                                            <Typography
                                                variant="h5"
                                                component="div"
                                                sx={{
                                                    color: 'white',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    fontWeight: 'bold',
                                                    px: 2,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {slide.subject}
                                            </Typography>
                                        </Box>
                                    </CardActionArea>
                                    <CardContent>
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            noWrap
                                            sx={{ fontWeight: 'medium' }}
                                        >
                                            {slide.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={slide.subject}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={`Lớp ${slide.grade}`}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                            />                                        </Box>                                        {/* Progress display using Redux */}
                                        <Box sx={{ mb: 2, mt: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PieChart fontSize="small" sx={{ mr: 0.5 }} />
                                                    Tiến độ bài học
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    {(() => {
                                                        const progress = getLessonProgressPercentageDisplay(slide.id);
                                                        const isCompleted = isLessonCompletedRedux(slide.id);

                                                        // Debug for each slide
                                                        console.log(`📊 Slide ${slide.id} progress:`, {
                                                            progress,
                                                            isCompleted,
                                                            hasReduxData: !!allLessonsData[slide.id]
                                                        });

                                                        return (
                                                            <>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight="bold"
                                                                    sx={{
                                                                        color: getProgressColor(progress)
                                                                    }}
                                                                >
                                                                    {Math.round(progress)}%
                                                                </Typography>
                                                                {isCompleted && (
                                                                    <CheckCircle fontSize="small" color="success" />
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </Box>
                                            </Box>

                                            <LinearProgress
                                                variant="determinate"
                                                value={getLessonProgressPercentageDisplay(slide.id)}
                                                color={getProgressColorVariant(getLessonProgressPercentageDisplay(slide.id))}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'rgba(0,0,0,0.05)',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                    }
                                                }}
                                            />

                                            {/* Status text */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, alignItems: 'center' }}>
                                                <Typography
                                                    variant="caption" sx={{
                                                        color: getProgressColor(getLessonProgressPercentageDisplay(slide.id)),
                                                        fontWeight: 'medium'
                                                    }}
                                                >
                                                    {getLessonStatusText(slide.id)}
                                                </Typography>

                                                {getLessonScoreDisplay(slide.id) !== null && isLessonCompletedRedux(slide.id) && (
                                                    <Chip
                                                        label={`${getLessonScoreDisplay(slide.id)}%`}
                                                        size="small"
                                                        color={getLessonScoreDisplay(slide.id) >= 80 ? 'success' : getLessonScoreDisplay(slide.id) >= 60 ? 'warning' : 'error'}
                                                        sx={{ height: 20, fontSize: '0.65rem' }}
                                                    />
                                                )}
                                            </Box>

                                            {/* Debug info for each slide */}
                                            <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 1 }}>
                                                <Typography variant="caption" color="info.main">
                                                    🔍 Debug: Redux={getLessonProgressPercentageDisplay(slide.id)}% |
                                                    Data={allLessonsData[slide.id] ? 'Yes' : 'No'} |
                                                    ID={slide.id}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <School fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {slide.slideCount} slide
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {moment(slide.createdAt).locale('vi').format('DD/MM/YYYY')}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>                                        <Stack direction="row" spacing={1}>
                                        {(() => {
                                            const isCompleted = isLessonCompletedRedux(slide.id);
                                            const progressPercentage = getLessonProgressPercentageDisplay(slide.id);
                                            const lastSlidePosition = getLastSlidePositionForLessonDisplay(slide.id);
                                            const hasProgress = progressPercentage > 0;

                                            return (
                                                <Button
                                                    variant="contained"
                                                    color={getProgressColorVariant(progressPercentage)}
                                                    size="small"
                                                    sx={{
                                                        borderRadius: 6,
                                                        boxShadow: 'none',
                                                        px: 2,
                                                        position: 'relative'
                                                    }}
                                                    startIcon={
                                                        isCompleted ? <CheckCircle /> :
                                                            hasProgress ? <PlayArrow /> : <PlayArrow />
                                                    }
                                                    onClick={() => handleStartLearning(slide.id, slide.title)}
                                                >
                                                    {isCompleted
                                                        ? 'Ôn lại'
                                                        : hasProgress
                                                            ? `Tiếp tục${lastSlidePosition?.slideIndex ? ` (${lastSlidePosition.slideIndex + 1})` : ''}`
                                                            : 'Bắt đầu'
                                                    }
                                                    {lastSlidePosition && !isCompleted && (
                                                        <Tooltip title={`Tiếp tục từ slide ${lastSlidePosition.slideIndex + 1}`}>
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: -4,
                                                                    right: -4,
                                                                    width: 12,
                                                                    height: 12,
                                                                    borderRadius: '50%',
                                                                    bgcolor: 'warning.main',
                                                                    border: '2px solid white'
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Button>
                                            );
                                        })()}

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() => navigate(`/slide/${slide.id}`)}
                                            sx={{ borderRadius: 6 }}
                                        >
                                            Xem
                                        </Button>
                                    </Stack>

                                        <Box>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/slide/edit/${slide.id}`);
                                                }}
                                            >
                                                <Tooltip title="Chỉnh sửa">
                                                    <Edit fontSize="small" />
                                                </Tooltip>
                                            </IconButton>

                                            <IconButton size="small">
                                                <Tooltip title="Tùy chọn khác">
                                                    <MoreVert fontSize="small" />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default LearningHub;