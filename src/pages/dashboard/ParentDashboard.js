import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Typography, Card, CardContent, Grid, Tabs, Tab, List, ListItem, ListItemText,
    LinearProgress, Avatar, Chip, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Tooltip, Alert, Divider, CircularProgress
} from '@mui/material';
import {
    ChildCare, School, Assessment, Schedule, Edit, Add, TrendingUp,
    Star, Timer, Games, BookmarkBorder, AccessTime, EmojiEvents, Refresh,
    Login, ExitToApp
} from '@mui/icons-material';
import ParentAPI from '../../services/ParentAPI';
import { checkAuth, createTestToken } from '../../utils/testAuth';

// Load test utilities in development
if (process.env.NODE_ENV === 'development') {
    import('../../utils/parentAuthTest.js');
}

const ParentDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux auth state
    const { isLoggedIn, token } = useSelector((state) => state.auth);

    const [tabValue, setTabValue] = useState(0);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [newScore, setNewScore] = useState('');
    const [newSubject, setNewSubject] = useState('');

    // Parent-specific authentication states
    const [isParentAuthenticated, setIsParentAuthenticated] = useState(false);
    const [parentAuthError, setParentAuthError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // API data states
    const [students, setStudents] = useState([]);
    const [activityHistory, setActivityHistory] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [dashboardSummary, setDashboardSummary] = useState({});

    // Loading states
    const [loading, setLoading] = useState(true);
    const [addingScore, setAddingScore] = useState(false);
    const [error, setError] = useState(null);

    // Check authentication on component mount
    useEffect(() => {
        checkParentAuthentication();
    }, [isLoggedIn, token]);

    // Fetch data when authenticated as parent
    useEffect(() => {
        if (isParentAuthenticated) {
            fetchAllData();
        }
    }, [isParentAuthenticated]); const checkParentAuthentication = async () => {
        // Kiểm tra xem user đã đăng nhập chưa
        if (!isLoggedIn || !token) {
            setParentAuthError('Bạn cần đăng nhập để truy cập Parent Dashboard');
            setIsParentAuthenticated(false);
            setLoading(false);
            return;
        }

        // Kiểm tra có authToken dành riêng cho parent không
        const parentToken = localStorage.getItem('authToken') || localStorage.getItem('parentToken');

        try {
            // Nếu có token từ Redux nhưng chưa có parent token riêng
            if (!parentToken) {
                // Cần xác thực lại với role parent
                setParentAuthError('Bạn cần đăng nhập với quyền phụ huynh để truy cập trang này');
                setUserRole('other'); // User đã login nhưng không phải parent
                setIsParentAuthenticated(false);
                setLoading(false);
                return;
            }

            // Nếu có parent token, thử gọi API để verify
            try {
                // Test call API để kiểm tra token parent có hợp lệ không
                const testResponse = await ParentAPI.getChildren();

                // Nếu API thành công, user đã được xác thực là parent
                setIsParentAuthenticated(true);
                setParentAuthError(null);
                setUserRole('parent');

            } catch (apiError) {
                if (apiError.message && (
                    apiError.message.includes('Access denied') ||
                    apiError.message.includes('No token provided') ||
                    apiError.message.includes('401') ||
                    apiError.message.includes('Unauthorized')
                )) {
                    // Token không hợp lệ hoặc không có quyền parent
                    setParentAuthError('Token phụ huynh không hợp lệ. Vui lòng đăng nhập lại với quyền phụ huynh');
                    setIsParentAuthenticated(false);
                } else {
                    // Lỗi khác (network, server, etc.) - vẫn coi là authenticated
                    setIsParentAuthenticated(true);
                    setParentAuthError(null);
                }
            }

        } catch (error) {
            console.error('Error checking parent authentication:', error);
            setParentAuthError('Lỗi kiểm tra xác thực. Vui lòng thử lại.');
            setIsParentAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleParentLogin = () => {
        // Lưu intended destination để redirect sau khi login
        localStorage.setItem('redirectAfterLogin', '/dashboard/parent');

        // Navigate to login với param để biết cần login as parent
        navigate('/auth/login?role=parent');
    };

    const handleSwitchToParent = () => {
        // Chuyển đổi role từ user hiện tại sang parent
        // Clear existing parent tokens và yêu cầu đăng nhập lại
        localStorage.removeItem('authToken');
        localStorage.removeItem('parentToken');

        // Navigate to login với role parent
        handleParentLogin();
    }; const handleCreateTestToken = () => {
        createTestToken();
        checkParentAuthentication();
    }; const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch children first
            const childrenResponse = await ParentAPI.getChildren();
            const children = childrenResponse.data || [];

            if (children.length === 0) {
                setStudents([]);
                setActivityHistory([]);
                setLoading(false);
                return;
            }

            // Transform children data for UI
            const studentsData = await Promise.all(
                children.map(async (child) => {
                    try {
                        // Fetch data for each child in parallel
                        const [progress, mathScores, englishScores, achievements] = await Promise.all([
                            ParentAPI.getChildProgress(child.id).catch(() => ({ data: {} })),
                            ParentAPI.getChildScores(child.id, 'math').catch(() => ({ data: { scores: [], average: 0 } })),
                            ParentAPI.getChildScores(child.id, 'english').catch(() => ({ data: { scores: [], average: 0 } })),
                            ParentAPI.getChildAchievements(child.id).catch(() => ({ data: [] }))
                        ]);

                        return {
                            id: child.id,
                            name: child.name,
                            avatar: child.avatar,
                            grade: child.grade,
                            totalStudyTime: progress.data.totalStudyTime || 0,
                            weeklyGoal: progress.data.weeklyGoal || 180,
                            mathScores: mathScores.data.scores || [],
                            englishScores: englishScores.data.scores || [],
                            averageMath: mathScores.data.average || 0,
                            averageEnglish: englishScores.data.average || 0,
                            completedLessons: progress.data.completedLessons || 0,
                            totalLessons: progress.data.totalLessons || 3,
                            achievements: achievements.data.map(a => a.title) || [],
                            lastActivity: ParentAPI.formatRelativeTime(progress.data.lastActivity),
                            currentStreak: progress.data.currentStreak || 0
                        };
                    } catch (error) {
                        console.error(`Error fetching data for child ${child.id}:`, error);
                        // Return fallback data for this child
                        return {
                            id: child.id,
                            name: child.name,
                            avatar: child.avatar,
                            grade: child.grade,
                            totalStudyTime: 0,
                            weeklyGoal: 180,
                            mathScores: [],
                            englishScores: [],
                            averageMath: 0,
                            averageEnglish: 0,
                            completedLessons: 0,
                            totalLessons: 3,
                            achievements: [],
                            lastActivity: 'Chưa có hoạt động',
                            currentStreak: 0
                        };
                    }
                })
            );

            setStudents(studentsData);

            // Fetch recent activities and subjects for the first child
            if (children.length > 0) {
                try {
                    const [recentActivities, subjectsData] = await Promise.all([
                        ParentAPI.getRecentActivities(10).catch(() => ({ data: [] })),
                        ParentAPI.getSubjects(children[0].id).catch(() => ({ data: [] }))
                    ]);

                    // Transform activities
                    const activities = recentActivities.data.map((activity, index) => ({
                        id: index + 1,
                        studentId: activity.childId,
                        studentName: activity.childName,
                        activity: activity.activity,
                        score: activity.score || 0,
                        subject: activity.subject,
                        time: ParentAPI.formatRelativeTime(activity.timestamp),
                        type: 'lesson' // Default type
                    }));

                    setActivityHistory(activities);
                    setSubjects(subjectsData.data);
                } catch (error) {
                    console.error('Error fetching activities/subjects:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);            // Check for authentication errors
            if (error.message && (
                error.message.includes('Access denied') ||
                error.message.includes('No token provided') ||
                error.message.includes('401') ||
                error.message.includes('Unauthorized')
            )) {
                setParentAuthError('Phiên đăng nhập phụ huynh đã hết hạn. Vui lòng đăng nhập lại.');
                setIsParentAuthenticated(false);
                setLoading(false);
                return;
            }

            setError('Không thể tải dữ liệu. Vui lòng thử lại.');

            // Fallback to mock data if API fails
            setStudents([
                {
                    id: 'mock1',
                    name: "Dữ liệu mẫu",
                    avatar: "DL",
                    grade: "Lớp 5A",
                    totalStudyTime: 145,
                    weeklyGoal: 180,
                    mathScores: [8.5, 9.0, 7.5, 8.0, 9.5],
                    englishScores: [7.0, 8.5, 8.0, 9.0, 8.5],
                    averageMath: 8.5,
                    averageEnglish: 8.2,
                    completedLessons: 12,
                    totalLessons: 15,
                    achievements: ["Toán học xuất sắc", "Tiến bộ vượt bậc"],
                    lastActivity: "2 giờ trước",
                    currentStreak: 5
                }
            ]);
        } finally {
            setLoading(false);
        }
    }; const handleAddScore = async () => {
        if (selectedStudent && newScore && newSubject) {
            try {
                setAddingScore(true);
                const score = parseFloat(newScore);

                // Map subject names to API format
                const subjectMap = {
                    'Toán': 'math',
                    'Tiếng Anh': 'english'
                };

                const scoreData = {
                    subject: subjectMap[newSubject] || newSubject.toLowerCase(),
                    score: score,
                    type: 'test',
                    lessonId: null,
                    notes: `Bài kiểm tra ${newSubject}`
                };

                // Call API to add score
                await ParentAPI.addChildScore(selectedStudent, scoreData);

                // Create activity for UI
                const newActivity = {
                    id: activityHistory.length + 1,
                    studentId: selectedStudent,
                    studentName: students.find(s => s.id === selectedStudent)?.name || 'Học sinh',
                    activity: `Bài kiểm tra ${newSubject}`,
                    score: score,
                    subject: newSubject,
                    time: "Vừa xong",
                    type: "test"
                };

                setActivityHistory([newActivity, ...activityHistory]);

                // Update student scores in local state
                setStudents(prev => prev.map(student => {
                    if (student.id === selectedStudent) {
                        const updatedStudent = { ...student };
                        if (newSubject === "Toán") {
                            updatedStudent.mathScores = [...student.mathScores.slice(1), score];
                            updatedStudent.averageMath = updatedStudent.mathScores.reduce((a, b) => a + b, 0) / updatedStudent.mathScores.length;
                        } else if (newSubject === "Tiếng Anh") {
                            updatedStudent.englishScores = [...student.englishScores.slice(1), score];
                            updatedStudent.averageEnglish = updatedStudent.englishScores.reduce((a, b) => a + b, 0) / updatedStudent.englishScores.length;
                        }
                        return updatedStudent;
                    }
                    return student;
                }));

                // Close dialog and reset form
                setEditDialogOpen(false);
                setSelectedStudent('');
                setNewScore('');
                setNewSubject('');                // Optional: Refetch data to ensure sync
                // await fetchAllData();

            } catch (error) {
                console.error('Error adding score:', error);

                // Check for authentication errors
                if (error.message && (
                    error.message.includes('Access denied') ||
                    error.message.includes('No token provided') ||
                    error.message.includes('401') ||
                    error.message.includes('Unauthorized')
                )) {
                    setParentAuthError('Phiên đăng nhập phụ huynh đã hết hạn. Vui lòng đăng nhập lại.');
                    setIsParentAuthenticated(false);
                    setEditDialogOpen(false);
                    return;
                }

                alert('Không thể thêm điểm. Vui lòng thử lại.');
            } finally {
                setAddingScore(false);
            }
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'test': return <Assessment color="primary" />;
            case 'game': return <Games color="secondary" />;
            case 'practice': return <BookmarkBorder color="action" />;
            case 'homework': return <School color="success" />;
            default: return <School />;
        }
    };

    const getScoreColor = (score) => {
        if (score >= 9) return 'success';
        if (score >= 7) return 'warning';
        return 'error';
    };

    // Show loading spinner
    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '100vh',
                width: '100%',
                p: 3
            }}>
                <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    Đang tải dữ liệu...
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Vui lòng chờ trong giây lát
                </Typography>
            </Box>
        );
    }

    // Show parent authentication error if not authenticated as parent
    if (!isParentAuthenticated && parentAuthError) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 3
            }}>
                <Card sx={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
                    <CardContent sx={{ p: 4 }}>
                        {userRole === 'other' ? (
                            <>
                                <ExitToApp sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                                <Typography variant="h5" gutterBottom>
                                    Chuyển đổi tài khoản
                                </Typography>
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    Bạn đang đăng nhập với tài khoản khác. Để truy cập Parent Dashboard,
                                    bạn cần đăng nhập với tài khoản phụ huynh.
                                </Alert>
                                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                                    Hiện tại: Đã đăng nhập | Cần: Tài khoản phụ huynh
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<ExitToApp />}
                                    onClick={handleSwitchToParent}
                                    sx={{ mr: 2 }}
                                >
                                    Chuyển sang tài khoản phụ huynh
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate(-1)}
                                >
                                    Quay lại
                                </Button>
                            </>
                        ) : (
                            <>
                                <Login sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h5" gutterBottom>
                                    Cần đăng nhập với quyền phụ huynh
                                </Typography>
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    {parentAuthError}
                                </Alert>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<Login />}
                                    onClick={handleParentLogin}
                                    sx={{ mr: 2 }}
                                >
                                    Đăng nhập phụ huynh
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={checkParentAuthentication}
                                    sx={{ mr: 2 }}
                                >
                                    Kiểm tra lại
                                </Button>
                                {/* Development helper button */}
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={handleCreateTestToken}
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: 'text.secondary',
                                        textTransform: 'none'
                                    }}
                                >
                                    (Test: Tạo token mẫu)
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>);
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            width: '100%',
            p: 3
        }}>
            <Box sx={{
                width: '100%',
                maxWidth: '1400px', // Giới hạn chiều rộng tối đa
                mx: 'auto' // Căn giữa horizontal
            }}>                <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                    <Typography variant="h4" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'white',
                    }}>
                        <ChildCare sx={{ mr: 2, fontSize: 40 }} />
                        Bảng điều khiển phụ huynh
                    </Typography>

                    {/* Refresh button */}
                    <Tooltip title="Làm mới dữ liệu">
                        <IconButton
                            onClick={fetchAllData}
                            disabled={loading}
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                }
                            }}
                        >
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={fetchAllData}
                            >
                                Thử lại
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* No data message */}
                {!loading && !error && students.length === 0 && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Chưa có dữ liệu học sinh
                        </Typography>
                        <Typography variant="body2">
                            Hiện tại chưa có học sinh nào được liên kết với tài khoản này.
                            Vui lòng liên hệ quản trị viên để thêm học sinh.
                        </Typography>
                    </Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newVal) => setTabValue(newVal)}
                        sx={{
                            '& .MuiTab-root': { color: 'white' },
                            '& .Mui-selected': { color: 'white !important' },
                            '& .MuiTabs-indicator': { backgroundColor: 'white' }
                        }}
                    >
                        <Tab icon={<School />} label="Tổng quan" />
                        <Tab icon={<Assessment />} label="Điểm số" />
                        <Tab icon={<Schedule />} label="Hoạt động" />
                        <Tab icon={<TrendingUp />} label="Báo cáo" />
                    </Tabs>                </Box>

                {/* Tab 1: Tổng quan */}
                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        {students.map((student) => (
                            <Grid item xs={12} lg={6} key={student.id}>
                                <Card sx={{ height: '100%', boxShadow: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                {student.avatar}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6">{student.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {student.grade}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Card variant="outlined">
                                                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                                                        <Typography variant="h5" color="primary">
                                                            {student.averageMath.toFixed(1)}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Điểm TB Toán
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Card variant="outlined">
                                                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                                                        <Typography variant="h5" color="secondary">
                                                            {student.averageEnglish.toFixed(1)}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Điểm TB T.Anh
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" gutterBottom>
                                                Thời gian học tuần này: {student.totalStudyTime}/{student.weeklyGoal} phút
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(student.totalStudyTime / student.weeklyGoal) * 100}
                                                sx={{ height: 10, borderRadius: 5 }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" gutterBottom>
                                                Tiến độ bài học: {student.completedLessons}/{student.totalLessons}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(student.completedLessons / student.totalLessons) * 100}
                                                color="secondary"
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" gutterBottom>Thành tích:</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {student.achievements.map((achievement, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={achievement}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        icon={<Star />}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary">
                                            <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                            Hoạt động cuối: {student.lastActivity}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>))}
                    </Grid>
                )}                {/* Tab 2: Quản lý điểm số */}
                {tabValue === 1 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">Quản lý điểm số</Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => setEditDialogOpen(true)}
                                        >
                                            Thêm điểm
                                        </Button>
                                    </Box>

                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Học sinh</TableCell>
                                                    <TableCell>Môn học</TableCell>
                                                    <TableCell>Điểm trung bình</TableCell>
                                                    <TableCell>Điểm gần nhất</TableCell>
                                                    <TableCell>Xu hướng</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {students.map((student) => [
                                                    <TableRow key={`${student.id}-math`}>
                                                        <TableCell>{student.name}</TableCell>
                                                        <TableCell>Toán học</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={student.averageMath.toFixed(1)}
                                                                color={getScoreColor(student.averageMath)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{student.mathScores[student.mathScores.length - 1]}</TableCell>
                                                        <TableCell>
                                                            <TrendingUp color={
                                                                student.mathScores[student.mathScores.length - 1] >
                                                                    student.mathScores[student.mathScores.length - 2] ?
                                                                    'success' : 'error'
                                                            } />
                                                        </TableCell>
                                                    </TableRow>,
                                                    <TableRow key={`${student.id}-english`}>
                                                        <TableCell>{student.name}</TableCell>
                                                        <TableCell>Tiếng Anh</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={student.averageEnglish.toFixed(1)}
                                                                color={getScoreColor(student.averageEnglish)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{student.englishScores[student.englishScores.length - 1]}</TableCell>
                                                        <TableCell>
                                                            <TrendingUp color={
                                                                student.englishScores[student.englishScores.length - 1] >
                                                                    student.englishScores[student.englishScores.length - 2] ?
                                                                    'success' : 'error'
                                                            } />
                                                        </TableCell>
                                                    </TableRow>
                                                ])}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}                {/* Tab 3: Lịch sử hoạt động */}
                {tabValue === 2 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Lịch sử hoạt động học tập
                                    </Typography>
                                    <List>
                                        {activityHistory.map((activity) => {
                                            const student = students.find(s => s.id === activity.studentId);
                                            return (
                                                <React.Fragment key={activity.id}>
                                                    <ListItem>
                                                        <Box sx={{ mr: 2 }}>
                                                            {getActivityIcon(activity.type)}
                                                        </Box>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Typography variant="body1">
                                                                        {student?.name} - {activity.activity}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={`${activity.score}/10`}
                                                                        size="small"
                                                                        color={getScoreColor(activity.score)}
                                                                    />
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Chip
                                                                        label={activity.subject}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        • {activity.time}
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider />
                                                </React.Fragment>
                                            );
                                        })}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}                {/* Tab 4: Báo cáo tiến độ */}
                {tabValue === 3 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Thống kê thời gian học
                                    </Typography>
                                    {students.map((student) => (
                                        <Box key={student.id} sx={{ mb: 3 }}>
                                            <Typography variant="body1" gutterBottom>
                                                {student.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Timer color="primary" />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(student.totalStudyTime / student.weeklyGoal) * 100}
                                                        sx={{ height: 8, borderRadius: 4 }}
                                                    />
                                                </Box>
                                                <Typography variant="body2">
                                                    {student.totalStudyTime}p/{student.weeklyGoal}p
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Xu hướng điểm số
                                    </Typography>
                                    {students.map((student) => (
                                        <Box key={student.id} sx={{ mb: 2 }}>
                                            <Typography variant="body1">{student.name}</Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2">Toán:</Typography>
                                                        <Chip
                                                            label={student.averageMath.toFixed(1)}
                                                            size="small"
                                                            color={getScoreColor(student.averageMath)}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2">T.Anh:</Typography>
                                                        <Chip
                                                            label={student.averageEnglish.toFixed(1)}
                                                            size="small"
                                                            color={getScoreColor(student.averageEnglish)}
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tóm tắt tuần này
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {students.map((student) => (
                                            <Grid item xs={12} md={6} key={student.id}>
                                                <Alert severity="info" sx={{ mb: 1 }}>
                                                    <Typography variant="body2">
                                                        <strong>{student.name}:</strong>
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • Đã học {student.totalStudyTime} phút ({Math.round((student.totalStudyTime / student.weeklyGoal) * 100)}% mục tiêu)
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • Hoàn thành {student.completedLessons}/{student.totalLessons} bài học
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • Điểm trung bình: Toán {student.averageMath.toFixed(1)}, T.Anh {student.averageEnglish.toFixed(1)}
                                                    </Typography>
                                                </Alert>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}                {/* Dialog thêm điểm */}
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Thêm điểm số mới</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Chọn học sinh</InputLabel>
                                    <Select
                                        value={selectedStudent}
                                        onChange={(e) => setSelectedStudent(e.target.value)}
                                        label="Chọn học sinh"
                                        disabled={addingScore}
                                    >
                                        {students.map((student) => (
                                            <MenuItem key={student.id} value={student.id.toString()}>
                                                {student.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Môn học</InputLabel>
                                    <Select
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                        label="Môn học"
                                        disabled={addingScore}
                                    >
                                        <MenuItem value="Toán">Toán học</MenuItem>
                                        <MenuItem value="Tiếng Anh">Tiếng Anh</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Điểm số (0-10)"
                                    type="number"
                                    value={newScore}
                                    onChange={(e) => setNewScore(e.target.value)}
                                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                                    disabled={addingScore}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setEditDialogOpen(false)}
                            disabled={addingScore}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleAddScore}
                            variant="contained"
                            disabled={addingScore || !selectedStudent || !newScore || !newSubject}
                            startIcon={addingScore ? <CircularProgress size={20} /> : <Add />}
                        >
                            {addingScore ? 'Đang thêm...' : 'Thêm điểm'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default ParentDashboard;