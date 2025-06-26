import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Button, Chip, Grid,
    Avatar, LinearProgress, Tabs, Tab, IconButton, Tooltip, MenuItem,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, Badge, Divider, Stack, Alert,
    List, ListItem, ListItemText, ListItemAvatar, Switch, FormControlLabel
} from '@mui/material';
import {
    School as ClassIcon,
    BookOutlined as AssignmentIcon,
    PeopleOutline as GroupIcon,
    BarChart as BarChartIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Star as StarIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    CalendarToday as CalendarIcon,
    Assignment as TaskIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Timeline as TimelineIcon,
    TrendingUp as TrendingUpIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Assessment as AssessmentIcon,
    Announcement as AnnouncementIcon,
    Save as SaveIcon
} from '@mui/icons-material';

const TeacherPortal = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedClass, setSelectedClass] = useState('5A');
    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
    const [openStudentDialog, setOpenStudentDialog] = useState(false);
    const [openCreateAssignmentDialog, setOpenCreateAssignmentDialog] = useState(false);
    const [openCreateAnnouncementDialog, setOpenCreateAnnouncementDialog] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        dueDate: '',
        subject: '',
        points: 100,
        type: 'homework'
    });
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        type: 'info'
    });

    const classes = [
        { id: '5A', name: 'Lớp 5A', students: 25, subject: 'Toán học' },
        { id: '5B', name: 'Lớp 5B', students: 23, subject: 'Tiếng Việt' },
        { id: '4A', name: 'Lớp 4A', students: 27, subject: 'Khoa học' }
    ];

    const students = [
        {
            id: 1,
            name: "Nguyễn Văn An",
            avatar: "https://i.pravatar.cc/40?img=1",
            math: 8.5,
            english: 7.5,
            science: 9.0,
            attendance: 95,
            assignments: 12,
            completed: 10,
            parentEmail: "nguyenvan@email.com",
            phone: "0123456789",
            behavior: "Tốt",
            notes: "Học sinh chăm chỉ, tích cực tham gia lớp học"
        },
        {
            id: 2,
            name: "Trần Thị Bình",
            avatar: "https://i.pravatar.cc/40?img=2",
            math: 9.0,
            english: 8.0,
            science: 8.5,
            attendance: 98,
            assignments: 12,
            completed: 12,
            parentEmail: "tranthi@email.com",
            phone: "0123456788",
            behavior: "Xuất sắc",
            notes: "Học sinh giỏi, luôn hoàn thành bài tập đúng hạn"
        },
        {
            id: 3,
            name: "Lê Minh Châu",
            avatar: "https://i.pravatar.cc/40?img=3",
            math: 7.5,
            english: 9.0,
            science: 8.0,
            attendance: 92,
            assignments: 12,
            completed: 9,
            parentEmail: "leminh@email.com",
            phone: "0123456787",
            behavior: "Khá",
            notes: "Cần cải thiện việc nộp bài tập đúng hạn"
        }
    ];

    const assignments = [
        {
            id: 1,
            title: "Bài tập Toán - Phân số",
            description: "Làm các bài tập về phân số từ trang 45-50. Học sinh cần nắm vững cách cộng, trừ, nhân, chia phân số.",
            dueDate: "2024-12-25",
            subject: "Toán",
            submitted: 20,
            total: 25,
            status: "active",
            points: 100,
            createdAt: "2024-12-20",
            type: "homework"
        },
        {
            id: 2,
            title: "Tiếng Việt - Tả cảnh",
            description: "Viết bài văn tả cảnh quê hương em với độ dài từ 150-200 từ. Sử dụng các biện pháp tu từ đã học.",
            dueDate: "2024-12-23",
            subject: "Tiếng Việt",
            submitted: 25,
            total: 25,
            status: "completed",
            points: 100,
            createdAt: "2024-12-18",
            type: "essay"
        },
        {
            id: 3,
            title: "Khoa học - Thí nghiệm",
            description: "Quan sát và báo cáo về sự nảy mầm của hạt đậu trong 7 ngày. Ghi nhận sự thay đổi hàng ngày.",
            dueDate: "2024-12-28",
            subject: "Khoa học",
            submitted: 15,
            total: 25,
            status: "active",
            points: 100,
            createdAt: "2024-12-21",
            type: "experiment"
        }
    ];

    const attendanceData = [
        { date: '2024-12-24', present: 23, absent: 2, late: 0, total: 25 },
        { date: '2024-12-23', present: 25, absent: 0, late: 0, total: 25 },
        { date: '2024-12-22', present: 24, absent: 1, late: 0, total: 25 },
        { date: '2024-12-21', present: 22, absent: 2, late: 1, total: 25 },
        { date: '2024-12-20', present: 25, absent: 0, late: 0, total: 25 }
    ];

    const statisticsData = {
        totalStudents: 25,
        averageScore: 8.3,
        attendanceRate: 96,
        completedAssignments: 85,
        monthlyProgress: [
            { month: 'T9', score: 7.8 },
            { month: 'T10', score: 8.1 },
            { month: 'T11', score: 8.3 },
            { month: 'T12', score: 8.5 }
        ]
    };

    // Handler functions
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleViewAssignment = (assignment) => {
        setSelectedAssignment(assignment);
        setOpenAssignmentDialog(true);
    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setOpenStudentDialog(true);
    };

    const handleCreateAssignment = () => {
        setOpenCreateAssignmentDialog(true);
    };

    const handleCreateAnnouncement = () => {
        setOpenCreateAnnouncementDialog(true);
    };

    const handleSaveAssignment = () => {
        console.log('Saving assignment:', newAssignment);
        setOpenCreateAssignmentDialog(false);
        setNewAssignment({
            title: '',
            description: '',
            dueDate: '',
            subject: '',
            points: 100,
            type: 'homework'
        });
    };

    const handleSaveAnnouncement = () => {
        console.log('Saving announcement:', newAnnouncement);
        setOpenCreateAnnouncementDialog(false);
        setNewAnnouncement({
            title: '',
            content: '',
            type: 'info'
        });
    };

    const handleDeleteAssignment = (assignmentId) => {
        console.log('Deleting assignment:', assignmentId);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'primary';
            case 'completed': return 'success';
            case 'overdue': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Đang diễn ra';
            case 'completed': return 'Hoàn thành';
            case 'overdue': return 'Quá hạn';
            default: return 'Không xác định';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 9) return 'success';
        if (score >= 8) return 'primary';
        if (score >= 6.5) return 'warning';
        return 'error';
    };

    const getScoreLabel = (score) => {
        if (score >= 9) return 'Xuất sắc';
        if (score >= 8) return 'Giỏi';
        if (score >= 6.5) return 'Khá';
        return 'Trung bình';
    };

    const TabPanel = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    ); return (
        <Box sx={{
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <Box sx={{ mb: 4, px: 3, pt: 3 }}>
                <Typography variant="h4" gutterBottom sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#1976d2',
                    fontWeight: 'bold'
                }}>
                    <ClassIcon sx={{ mr: 2, fontSize: 40 }} />
                    Cổng Giáo viên
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý lớp học, học sinh và bài tập một cách hiệu quả                </Typography>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ px: 3 }}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                            transition: 'all 0.3s'
                        }}
                            onClick={handleCreateAssignment}
                        >
                            <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                            <Typography variant="h6">Giao bài tập</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tạo bài tập mới
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                            transition: 'all 0.3s'
                        }}>
                            <GroupIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                            <Typography variant="h6">Quản lý lớp</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {classes.length} lớp học
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                            transition: 'all 0.3s'
                        }}>
                            <BarChartIcon sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
                            <Typography variant="h6">Báo cáo</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Thống kê chi tiết
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                            transition: 'all 0.3s'
                        }}
                            onClick={handleCreateAnnouncement}
                        >                        <AnnouncementIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                            <Typography variant="h6">Thông báo</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tạo thông báo mới
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>            {/* Main Content with Tabs */}
            <Box sx={{ px: 3, pb: 3, height: 'calc(100vh - 200px)', overflow: 'auto' }}>
                <Card sx={{ boxShadow: 3 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={handleTabChange}>
                            <Tab label="Danh sách học sinh" />
                            <Tab label="Bài tập" />
                            <Tab label="Điểm danh" />
                            <Tab label="Thống kê" />
                        </Tabs>
                    </Box>

                    {/* Tab 1: Students List */}
                    <TabPanel value={currentTab} index={0}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">
                                    {selectedClass} - Danh sách học sinh ({students.length} học sinh)
                                </Typography>
                                <TextField
                                    select
                                    size="small"
                                    value={selectedClass}
                                    onChange={handleClassChange}
                                    sx={{ minWidth: 120 }}
                                >
                                    {classes.map((cls) => (
                                        <MenuItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Học sinh</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Toán</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tiếng Anh</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Khoa học</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Điểm danh</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bài tập</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đánh giá</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {students.map((student) => {
                                            const avgScore = ((student.math + student.english + student.science) / 3).toFixed(1);
                                            return (
                                                <TableRow key={student.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar
                                                                src={student.avatar}
                                                                sx={{ mr: 2, width: 32, height: 32 }}
                                                            >
                                                                {student.name.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {student.name}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={student.math}
                                                            color={getScoreColor(student.math)}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={student.english}
                                                            color={getScoreColor(student.english)}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={student.science}
                                                            color={getScoreColor(student.science)}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={student.attendance}
                                                                sx={{ width: 50, mr: 1 }}
                                                                color={student.attendance >= 95 ? 'success' : 'warning'}
                                                            />
                                                            <Typography variant="caption">
                                                                {student.attendance}%
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" color="text.secondary">
                                                            {student.completed}/{student.assignments}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={getScoreLabel(avgScore)}
                                                            color={getScoreColor(avgScore)}
                                                            size="small"
                                                            icon={avgScore >= 9 ? <StarIcon /> : undefined}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Xem chi tiết">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleViewStudent(student)}
                                                            >
                                                                <ViewIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Chỉnh sửa">
                                                            <IconButton size="small" color="info">
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </TabPanel>

                    {/* Tab 2: Assignments */}
                    <TabPanel value={currentTab} index={1}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Quản lý bài tập</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleCreateAssignment}
                                >
                                    Tạo bài tập mới
                                </Button>
                            </Box>

                            <Grid container spacing={3}>
                                {assignments.map((assignment) => (
                                    <Grid item xs={12} md={6} lg={4} key={assignment.id}>
                                        <Card sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': { boxShadow: 4 },
                                            transition: 'box-shadow 0.3s'
                                        }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                        {assignment.title}
                                                    </Typography>
                                                    <Chip
                                                        label={getStatusText(assignment.status)}
                                                        color={getStatusColor(assignment.status)}
                                                        size="small"
                                                    />
                                                </Box>

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {assignment.description.length > 100
                                                        ? `${assignment.description.substring(0, 100)}...`
                                                        : assignment.description}
                                                </Typography>

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                                                        Hạn nộp: {assignment.dueDate}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <TaskIcon sx={{ mr: 1, fontSize: 16 }} />
                                                        Môn: {assignment.subject}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <AssessmentIcon sx={{ mr: 1, fontSize: 16 }} />
                                                        Điểm tối đa: {assignment.points}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Đã nộp: {assignment.submitted}/{assignment.total}
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(assignment.submitted / assignment.total) * 100}
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<ViewIcon />}
                                                        onClick={() => handleViewAssignment(assignment)}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </TabPanel>

                    {/* Tab 3: Attendance */}
                    <TabPanel value={currentTab} index={2}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Điểm danh và theo dõi sự có mặt</Typography>

                            <Grid container spacing={3}>
                                {/* Summary Cards */}
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            {attendanceData[0]?.present || 0}
                                        </Typography>
                                        <Typography variant="body2">Có mặt hôm nay</Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                                            {attendanceData[0]?.absent || 0}
                                        </Typography>
                                        <Typography variant="body2">Vắng mặt</Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                                        <Typography variant="h4" color="secondary" fontWeight="bold">
                                            {attendanceData[0]?.late || 0}
                                        </Typography>
                                        <Typography variant="body2">Đi muộn</Typography>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Attendance History */}
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom>Lịch sử điểm danh (5 ngày gần nhất)</Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Ngày</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Có mặt</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vắng mặt</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đi muộn</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tỷ lệ (%)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {attendanceData.map((record) => (
                                                <TableRow key={record.date}>
                                                    <TableCell>{record.date}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={record.present}
                                                            color="success"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={record.absent}
                                                            color="warning"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={record.late}
                                                            color="secondary"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2">
                                                            {((record.present / record.total) * 100).toFixed(1)}%
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                    </TabPanel>

                    {/* Tab 4: Statistics */}
                    <TabPanel value={currentTab} index={3}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Thống kê và báo cáo</Typography>

                            {/* Summary Statistics */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                                        <GroupIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                        <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                                            {statisticsData.totalStudents}
                                        </Typography>
                                        <Typography variant="body2">Tổng học sinh</Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                                        <TrendingUpIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                        <Typography variant="h4" fontWeight="bold" color="#1976d2">
                                            {statisticsData.averageScore}
                                        </Typography>
                                        <Typography variant="body2">Điểm trung bình</Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                                        <CalendarIcon sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
                                        <Typography variant="h4" fontWeight="bold" color="#ed6c02">
                                            {statisticsData.attendanceRate}%
                                        </Typography>
                                        <Typography variant="body2">Tỷ lệ đi học</Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                                        <CheckIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                                        <Typography variant="h4" fontWeight="bold" color="#9c27b0">
                                            {statisticsData.completedAssignments}%
                                        </Typography>
                                        <Typography variant="body2">Hoàn thành BT</Typography>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Progress Chart */}
                            <Card sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>Xu hướng điểm số theo tháng</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'end', height: 200, gap: 2 }}>
                                    {statisticsData.monthlyProgress.map((item, index) => (
                                        <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                                            <Box
                                                sx={{
                                                    height: `${(item.score / 10) * 160}px`,
                                                    backgroundColor: '#1976d2',
                                                    borderRadius: 1,
                                                    mb: 1,
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {item.score}
                                            </Box>
                                            <Typography variant="caption">{item.month}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Card>

                            {/* Top Performers */}
                            <Card sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Học sinh xuất sắc</Typography>
                                <List>
                                    {students
                                        .sort((a, b) => {
                                            const avgA = (a.math + a.english + a.science) / 3;
                                            const avgB = (b.math + b.english + b.science) / 3;
                                            return avgB - avgA;
                                        })
                                        .slice(0, 3)
                                        .map((student, index) => {
                                            const avgScore = ((student.math + student.english + student.science) / 3).toFixed(1);
                                            return (
                                                <ListItem key={student.id}>
                                                    <ListItemAvatar>
                                                        <Badge
                                                            badgeContent={index + 1}
                                                            color={index === 0 ? 'error' : index === 1 ? 'warning' : 'info'}
                                                        >
                                                            <Avatar src={student.avatar}>
                                                                {student.name.charAt(0)}
                                                            </Avatar>
                                                        </Badge>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={student.name}
                                                        secondary={`Điểm trung bình: ${avgScore} - ${getScoreLabel(avgScore)}`}
                                                    />
                                                    <Chip
                                                        label={avgScore}
                                                        color={getScoreColor(avgScore)}
                                                        icon={index === 0 ? <StarIcon /> : undefined}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                </List>
                            </Card>
                        </CardContent>
                    </TabPanel>
                </Card>

                {/* Dialogs */}

                {/* Student Detail Dialog */}
                <Dialog
                    open={openStudentDialog}
                    onClose={() => setOpenStudentDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Chi tiết học sinh</Typography>
                            <IconButton onClick={() => setOpenStudentDialog(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedStudent && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Avatar
                                            src={selectedStudent.avatar}
                                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                                        >
                                            {selectedStudent.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="h6">{selectedStudent.name}</Typography>
                                        <Chip
                                            label={selectedStudent.behavior}
                                            color="primary"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6" gutterBottom>Thông tin cá nhân</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Email phụ huynh:</Typography>
                                            <Typography variant="body1">{selectedStudent.parentEmail}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Số điện thoại:</Typography>
                                            <Typography variant="body1">{selectedStudent.phone}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">Ghi chú:</Typography>
                                            <Typography variant="body1">{selectedStudent.notes}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="h6" gutterBottom>Kết quả học tập</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                <Typography variant="h4" color="primary">{selectedStudent.math}</Typography>
                                                <Typography variant="body2">Toán học</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                <Typography variant="h4" color="primary">{selectedStudent.english}</Typography>
                                                <Typography variant="body2">Tiếng Anh</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                <Typography variant="h4" color="primary">{selectedStudent.science}</Typography>
                                                <Typography variant="body2">Khoa học</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="body2" color="text.secondary">Điểm danh:</Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={selectedStudent.attendance}
                                            sx={{ mt: 1, height: 8 }}
                                        />
                                        <Typography variant="caption">{selectedStudent.attendance}%</Typography>
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Bài tập: {selectedStudent.completed}/{selectedStudent.assignments} hoàn thành
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(selectedStudent.completed / selectedStudent.assignments) * 100}
                                            sx={{ mt: 1, height: 8 }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenStudentDialog(false)}>Đóng</Button>
                        <Button variant="contained" startIcon={<EditIcon />}>
                            Chỉnh sửa
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Assignment Detail Dialog */}
                <Dialog
                    open={openAssignmentDialog}
                    onClose={() => setOpenAssignmentDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Chi tiết bài tập</Typography>
                            <IconButton onClick={() => setOpenAssignmentDialog(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedAssignment && (
                            <Box>
                                <Typography variant="h5" gutterBottom>{selectedAssignment.title}</Typography>

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Môn học:</Typography>
                                        <Typography variant="body1">{selectedAssignment.subject}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Hạn nộp:</Typography>
                                        <Typography variant="body1">{selectedAssignment.dueDate}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Điểm tối đa:</Typography>
                                        <Typography variant="body1">{selectedAssignment.points}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
                                        <Chip
                                            label={getStatusText(selectedAssignment.status)}
                                            color={getStatusColor(selectedAssignment.status)}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" gutterBottom>Mô tả bài tập</Typography>
                                <Typography variant="body1" paragraph>
                                    {selectedAssignment.description}
                                </Typography>

                                <Typography variant="h6" gutterBottom>Tiến độ nộp bài</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Đã nộp: {selectedAssignment.submitted}/{selectedAssignment.total} học sinh
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(selectedAssignment.submitted / selectedAssignment.total) * 100}
                                        sx={{ mt: 1, height: 8 }}
                                    />
                                    <Typography variant="caption">
                                        {((selectedAssignment.submitted / selectedAssignment.total) * 100).toFixed(1)}%
                                    </Typography>
                                </Box>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Còn {selectedAssignment.total - selectedAssignment.submitted} học sinh chưa nộp bài tập này.
                                </Alert>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAssignmentDialog(false)}>Đóng</Button>
                        <Button variant="outlined" startIcon={<EditIcon />}>
                            Chỉnh sửa
                        </Button>
                        <Button variant="contained" startIcon={<ViewIcon />}>
                            Xem bài nộp
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Create Assignment Dialog */}
                <Dialog
                    open={openCreateAssignmentDialog}
                    onClose={() => setOpenCreateAssignmentDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Tạo bài tập mới</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Tiêu đề bài tập"
                            fullWidth
                            variant="outlined"
                            value={newAssignment.title}
                            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            margin="dense"
                            label="Mô tả chi tiết"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={newAssignment.description}
                            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Môn học</InputLabel>
                                    <Select
                                        value={newAssignment.subject}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                                        label="Môn học"
                                    >
                                        <MenuItem value="Toán">Toán học</MenuItem>
                                        <MenuItem value="Tiếng Việt">Tiếng Việt</MenuItem>
                                        <MenuItem value="Tiếng Anh">Tiếng Anh</MenuItem>
                                        <MenuItem value="Khoa học">Khoa học</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Loại bài tập</InputLabel>
                                    <Select
                                        value={newAssignment.type}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value })}
                                        label="Loại bài tập"
                                    >
                                        <MenuItem value="homework">Bài tập về nhà</MenuItem>
                                        <MenuItem value="essay">Bài văn</MenuItem>
                                        <MenuItem value="experiment">Thí nghiệm</MenuItem>
                                        <MenuItem value="project">Dự án</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Hạn nộp"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={newAssignment.dueDate}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Điểm tối đa"
                                    type="number"
                                    fullWidth
                                    value={newAssignment.points}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) })}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreateAssignmentDialog(false)}>Hủy</Button>
                        <Button
                            onClick={handleSaveAssignment}
                            variant="contained"
                            startIcon={<SaveIcon />}
                        >
                            Tạo bài tập
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Create Announcement Dialog */}
                <Dialog
                    open={openCreateAnnouncementDialog}
                    onClose={() => setOpenCreateAnnouncementDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Tạo thông báo mới</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Tiêu đề thông báo"
                            fullWidth
                            variant="outlined"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            margin="dense"
                            label="Nội dung"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Loại thông báo</InputLabel>
                            <Select
                                value={newAnnouncement.type}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                label="Loại thông báo"
                            >
                                <MenuItem value="info">Thông tin</MenuItem>
                                <MenuItem value="warning">Cảnh báo</MenuItem>
                                <MenuItem value="important">Quan trọng</MenuItem>
                                <MenuItem value="event">Sự kiện</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreateAnnouncementDialog(false)}>Hủy</Button>
                        <Button
                            onClick={handleSaveAnnouncement}
                            variant="contained"
                            startIcon={<SaveIcon />}
                        >
                            Tạo thông báo                    </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default TeacherPortal;
