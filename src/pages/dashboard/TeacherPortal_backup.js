import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Button, Chip, Grid,
    Avatar, LinearProgress, Tabs, Tab, IconButton, Tooltip, MenuItem,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, Stack, Badge, Divider
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
    Assignment as TaskIcon,
    CheckCircle as CheckIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
const TeacherPortal = () => {    const [currentTab, setCurrentTab] = useState(0);
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
            class: '5A',
            phone: '0123456789',
            email: 'nguyenvanan@email.com'
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
            class: '5A',
            phone: '0123456790',
            email: 'tranthibinh@email.com'
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
            class: '5A',
            phone: '0123456791',
            email: 'leminhchau@email.com'
        }
    ];

    const assignments = [
        { 
            id: 1, 
            title: "Bài tập Toán - Phân số", 
            description: "Làm các bài tập về phân số từ trang 45-50",
            dueDate: "2024-12-25", 
            subject: "Toán",
            submitted: 20, 
            total: 25, 
            status: "active",
            points: 100,
            createdAt: "2024-12-20"
        },
        { 
            id: 2, 
            title: "Tiếng Việt - Tả cảnh", 
            description: "Viết bài văn tả cảnh quê hương em",
            dueDate: "2024-12-23", 
            subject: "Tiếng Việt",
            submitted: 25, 
            total: 25, 
            status: "completed",
            points: 100,
            createdAt: "2024-12-18"
        },
        { 
            id: 3, 
            title: "Khoa học - Thí nghiệm", 
            description: "Quan sát và báo cáo về sự nảy mầm của hạt đậu",
            dueDate: "2024-12-28", 
            subject: "Khoa học",
            submitted: 15, 
            total: 25, 
            status: "active",
            points: 100,
            createdAt: "2024-12-21"
        }
    ];

    const attendanceData = [
        { date: '2024-12-24', present: 23, absent: 2, late: 0 },
        { date: '2024-12-23', present: 25, absent: 0, late: 0 },
        { date: '2024-12-22', present: 24, absent: 1, late: 0 },
        { date: '2024-12-21', present: 22, absent: 2, late: 1 },
        { date: '2024-12-20', present: 25, absent: 0, late: 0 }
    ];    const statisticsData = {
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
    };    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleCreateAssignment = () => {
        console.log('Creating assignment:', newAssignment);
        setOpenAssignmentDialog(false);
        setNewAssignment({
            title: '',
            description: '',
            dueDate: '',
            subject: '',
            points: 100
        });
    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setOpenStudentDialog(true);
    };

    const TabPanel = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );return (
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom s                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                        transition: 'all 0.3s'
                    }}
                    onClick={() => setOpenAssignmentDialog(true)}
                    >
                        <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                        <Typography variant="h6">Giao bài tập</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tạo bài tập mới
                        </Typography>
                    </Card>
                </Grid>iner spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                        transition: 'all 0.3s'
                    }}>
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
                    }}>
                        <AddIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                        <Typography variant="h6">Thêm mới</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Học sinh, bài tập
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content with Tabs */}
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
                                onChange={(e) => setSelectedClass(e.target.value)}
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
                                                </TableCell>r={getScoreColor(avgScore)}
                                                        size="small"
                                                        icon={avgScore >= 9 ? <StarIcon /> : undefined}
                                                    />
                                                </TableCell>
                                           {/* Tab 2: Assignments */}
                <TabPanel value={currentTab} index={1}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Quản lý bài tập</Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={() => setOpenAssignmentDialog(true)}
                            >
                                           {/* Tab 3: Attendance */}
                <TabPanel value={currentTab} index={2}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Điểm danh hôm nay</Typography>
                            <Button variant="contained" startIcon={<CheckIcon />}>
                                Bắt đầu điểm danh
                            </Button>
                        </Box>

                        {/* Today's Attendance Summary */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={4}>
                                <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                                    <Typography variant="h4" color="success.main" fontWeight="bold">
                                        {attendanceData[0].present}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Có mặt
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#ffebee' }}>
                                    <Typography variant="h4" color="error.main" fontWeight="bold">
                                           {/* Tab 4: Statistics */}
                <TabPanel value={currentTab} index={3}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Thống kê chi tiết</Typography>
                        
                        {/* Overview Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                                    <PersonIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                       </Card>

            {/* Assignment Dialog */}
            <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TaskIcon sx={{ mr: 1 }} />
                        Tạo bài tập mới
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tiêu đề bài tập"
                        fullWidth
                        variant="outlined"
                        value={newAssignment.title}
                        onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Mô tả"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        value={newAssignment.description}
                        onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                        sx={{ mb: 2 }}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Môn học</InputLabel>
                                <Select
                                    value={newAssignment.subject}
                                    label="Môn học"
                                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                                >
                                    <MenuItem value="Toán">Toán</MenuItem>
                                    <MenuItem value="Tiếng Việt">Tiếng Việt</MenuItem>
                                    <MenuItem value="Khoa học">Khoa học</MenuItem>
                                    <MenuItem value="Tiếng Anh">Tiếng Anh</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Điểm tối đa"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={newAssignment.points}
                                onChange={(e) => setNewAssignment({...newAssignment, points: parseInt(e.target.value)})}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        margin="dense"
                        label="Hạn nộp"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssignmentDialog(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleCreateAssignment}>
                        Tạo bài tập
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Student Detail Dialog */}
            <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        Thông tin học sinh
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Avatar 
                                        src={selectedStudent.avatar} 
                                        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                                    >
                                        {selectedStudent.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedStudent.name}
                                    </Typography>
                                    <Chip label={selectedStudent.class} color="primary" />
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" gutterBottom>Thông tin liên hệ</Typography>
                                <Stack spacing={1} sx={{ mb: 3 }}>
                                    <Typography variant="body2">
                                        <strong>Email:</strong> {selectedStudent.email}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Điện thoại:</strong> {selectedStudent.phone}
                                    </Typography>
                                </Stack>

                                <Typography variant="h6" gutterBottom>Kết quả học tập</Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={4}>
                                        <Card sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="h5" color="primary">
                                                {selectedStudent.math}
                                            </Typography>
                                            <Typography variant="body2">Toán</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="h5" color="success.main">
                                                {selectedStudent.english}
                                            </Typography>
                                            <Typography variant="body2">Tiếng Anh</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="h5" color="warning.main">
                                                {selectedStudent.science}
                                            </Typography>
                                            <Typography variant="body2">Khoa học</Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" gutterBottom>Thống kê</Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="body2" gutterBottom>
                                            Tỷ lệ điểm danh: {selectedStudent.attendance}%
                                        </Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={selectedStudent.attendance} 
                                            color={selectedStudent.attendance >= 95 ? 'success' : 'warning'}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" gutterBottom>
                                            Bài tập hoàn thành: {selectedStudent.completed}/{selectedStudent.assignments}
                                        </Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={(selectedStudent.completed / selectedStudent.assignments) * 100} 
                                            color="info"
                                        />
                                    </Box>
                                </Stack>
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
        </Box>
    );                                  Tổng học sinh
                                    </Typography>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                                    <TrendingUpIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        {statisticsData.averageScore}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Điểm TB lớp
                                    </Typography>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                                    <CheckIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        {statisticsData.attendanceRate}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tỷ lệ điểm danh
                                    </Typography>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                                    <AssignmentIcon sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        {statisticsData.completedAssignments}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Bài tập hoàn thành
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Monthly Progress Chart */}
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Tiến độ theo tháng</Typography>
                            <Grid container spacing={2}>
                                {statisticsData.monthlyProgress.map((month, index) => (
                                    <Grid item xs={3} key={index}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" color="primary">
                                                {month.score}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {month.month}
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={(month.score / 10) * 100} 
                                                sx={{ mt: 1 }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>

                        {/* Top Performers */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Học sinh xuất sắc</Typography>
                            <Grid container spacing={2}>
                                {students
                                    .sort((a, b) => ((b.math + b.english + b.science) / 3) - ((a.math + a.english + a.science) / 3))
                                    .slice(0, 3)
                                    .map((student, index) => {
                                        const avgScore = ((student.math + student.english + student.science) / 3).toFixed(1);
                                        return (
                                            <Grid item xs={12} sm={4} key={student.id}>
                                                <Card sx={{ p: 2, textAlign: 'center', border: '1px solid #e0e0e0' }}>
                                                    <Avatar 
                                                        src={student.avatar} 
                                                        sx={{ mx: 'auto', mb: 1, width: 50, height: 50 }}
                                                    >
                                                        {student.name.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {student.name}
                                                    </Typography>
                                                    <Typography variant="h6" color="primary">
                                                        {avgScore}
                                                    </Typography>
                                                    <Chip 
                                                        label={`#${index + 1}`} 
                                                        color={index === 0 ? 'warning' : 'primary'} 
                                                        size="small"
                                                        icon={index === 0 ? <StarIcon /> : undefined}
                                                    />
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                            </Grid>
                        </Card>
                    </CardContent>
                </TabPanel>             {attendanceData[0].late}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Đi trễ
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Attendance History */}
                        <Typography variant="h6" gutterBottom>Lịch sử điểm danh</Typography>
                        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Ngày</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Có mặt</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vắng mặt</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đi trễ</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tỷ lệ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceData.map((day, index) => {
                                        const total = day.present + day.absent + day.late;
                                        const rate = ((day.present / total) * 100).toFixed(1);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{day.date}</TableCell>
                                                <TableCell align="center">
                                                    <Chip label={day.present} color="success" size="small" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip label={day.absent} color="error" size="small" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip label={day.late} color="warning" size="small" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" color={rate >= 95 ? 'success.main' : 'warning.main'}>
                                                        {rate}%
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </TabPanel>             transition: 'box-shadow 0.3s'
                                    }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <TaskIcon color="primary" />
                                                <Chip 
                                                    label={assignment.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                                                    color={assignment.status === 'active' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </Box>
                                            
                                            <Typography variant="h6" gutterBottom>
                                                {assignment.title}
                                            </Typography>
                                            
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {assignment.description}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CalendarIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    Hạn nộp: {assignment.dueDate}
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <AssessmentIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {assignment.points} điểm
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={(assignment.submitted / assignment.total) * 100}
                                                    sx={{ flexGrow: 1, mr: 2 }}
                                                />
                                                <Typography variant="body2">
                                                    {assignment.submitted}/{assignment.total}
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                                                <Button size="small" variant="outlined" startIcon={<ViewIcon />}>
                                                    Xem
                                                </Button>
                                                <Button size="small" variant="outlined" startIcon={<EditIcon />}>
                                                    Sửa
                                                </Button>
                                                <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}>
                                                    Xóa
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </TabPanel>                         </Tooltip>
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
                        <Typography variant="h6" gutterBottom>Quản lý bài tập</Typography>
                        <Typography color="text.secondary">
                            Tính năng quản lý bài tập đang được phát triển...
                        </Typography>
                    </CardContent>
                </TabPanel>

                {/* Tab 3: Attendance */}
                <TabPanel value={currentTab} index={2}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Điểm danh hôm nay</Typography>
                        <Typography color="text.secondary">
                            Tính năng điểm danh đang được phát triển...
                        </Typography>
                    </CardContent>
                </TabPanel>

                {/* Tab 4: Statistics */}
                <TabPanel value={currentTab} index={3}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Thống kê chi tiết</Typography>
                        <Typography color="text.secondary">
                            Biểu đồ thống kê đang được phát triển...
                        </Typography>
                    </CardContent>
                </TabPanel>
            </Card>
        </Box>
    );
};
export default TeacherPortal;