import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    Card,
    CardContent,
    Avatar,
    IconButton,
    Badge,
    Tabs,
    Tab,
    Stack,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Grid,
    Fade,
    Tooltip
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    School,
    EmojiEvents,
    Update,
    Circle,
    Delete,
    MarkEmailRead,
    FilterList,
    Schedule,
    Star,
    NewReleases,
    Assignment,
    Quiz,
    Celebration
} from '@mui/icons-material';

// Data mẫu với nhiều loại thông báo
const thongBaoMau = [
    {
        id: 1,
        type: "Nhắc học",
        icon: <School />,
        title: "⏰ Đã đến giờ học Toán!",
        content: "Hôm nay chúng ta sẽ học về phép nhân và phép chia. Hãy chuẩn bị sẵn sàng nhé!",
        time: "08:00",
        date: "Hôm nay",
        isRead: false,
        priority: "high",
        color: "#2196f3"
    },
    {
        id: 2,
        type: "Sự kiện",
        icon: <EmojiEvents />,
        title: "🎉 Thử thách tuần mới!",
        content: "Tham gia thử thách 'Giải 10 bài toán trong 5 phút' để nhận huy hiệu vàng!",
        time: "09:00",
        date: "Hôm nay",
        isRead: false,
        priority: "medium",
        color: "#ff9800"
    },
    {
        id: 3,
        type: "Cập nhật",
        icon: <Update />,
        title: "📚 Bài học mới đã có!",
        content: "Khám phá bài học 'Hình học cơ bản' với những hoạt động thú vị và trò chơi tương tác.",
        time: "10:00",
        date: "Hôm nay",
        isRead: true,
        priority: "low",
        color: "#4caf50"
    },
    {
        id: 4,
        type: "Thành tích",
        icon: <Star />,
        title: "🌟 Chúc mừng!",
        content: "Bạn đã hoàn thành 5 bài học liên tiếp! Huy hiệu 'Học sinh chăm chỉ' đã được mở khóa.",
        time: "14:30",
        date: "Hôm qua",
        isRead: false,
        priority: "high",
        color: "#9c27b0"
    },
    {
        id: 5,
        type: "Bài tập",
        icon: <Assignment />,
        title: "📝 Bài tập mới",
        content: "Giáo viên đã giao bài tập về nhà cho môn Tiếng Anh. Hạn nộp: 26/06/2025",
        time: "16:45",
        date: "Hôm qua",
        isRead: true,
        priority: "medium",
        color: "#f44336"
    },
    {
        id: 6,
        type: "Quiz",
        icon: <Quiz />,
        title: "🧩 Trắc nghiệm tuần",
        content: "Đừng quên làm bài trắc nghiệm tuần này! Còn 2 ngày nữa là hết hạn.",
        time: "18:20",
        date: "2 ngày trước",
        isRead: true,
        priority: "medium",
        color: "#00bcd4"
    },
    {
        id: 7,
        type: "Hệ thống",
        icon: <NewReleases />,
        title: "🔧 Cập nhật hệ thống",
        content: "Hệ thống đã được cập nhật với nhiều tính năng mới. Khám phá ngay!",
        time: "20:15",
        date: "3 ngày trước",
        isRead: true,
        priority: "low",
        color: "#607d8b"
    }
];

export default function ThongBao() {
    const [tabValue, setTabValue] = useState(0);
    const [thongBao, setThongBao] = useState(thongBaoMau);

    // Lọc thông báo theo tab
    const getFilteredNotifications = () => {
        switch (tabValue) {
            case 0: return thongBao; // Tất cả
            case 1: return thongBao.filter(n => !n.isRead); // Chưa đọc
            case 2: return thongBao.filter(n => n.isRead); // Đã đọc
            case 3: return thongBao.filter(n => n.priority === 'high'); // Quan trọng
            default: return thongBao;
        }
    };

    // Đánh dấu đã đọc
    const markAsRead = (id) => {
        setThongBao(prev => prev.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    // Xóa thông báo
    const deleteNotification = (id) => {
        setThongBao(prev => prev.filter(n => n.id !== id));
    };

    // Đánh dấu tất cả đã đọc
    const markAllAsRead = () => {
        setThongBao(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const unreadCount = thongBao.filter(n => !n.isRead).length;
    const filteredNotifications = getFilteredNotifications();
    return (
        <Box sx={{
            p: 3,
            maxWidth: 1200,
            mx: 'auto',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            fontFamily: '"Comic Sans MS", cursive, sans-serif'
        }}>
            {/* Header */}
            <Paper sx={{
                p: 4,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
                            <Avatar sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                width: 60,
                                height: 60,
                                backdropFilter: 'blur(10px)'
                            }}>
                                <NotificationsIcon sx={{ fontSize: 30 }} />
                            </Avatar>
                        </Badge>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                📢 Thông Báo
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                🎯 Cập nhật mới nhất về hoạt động học tập của bạn
                            </Typography>
                        </Box>
                    </Box>

                    {/* Thống kê nhanh */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {thongBao.length}
                                </Typography>
                                <Typography variant="body2">📬 Tổng thông báo</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffeb3b' }}>
                                    {unreadCount}
                                </Typography>
                                <Typography variant="body2">🔔 Chưa đọc</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                    {thongBao.filter(n => n.isRead).length}
                                </Typography>
                                <Typography variant="body2">✅ Đã đọc</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                                    {thongBao.filter(n => n.priority === 'high').length}
                                </Typography>
                                <Typography variant="body2">⚡ Quan trọng</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Background decoration */}
                <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                }} />
            </Paper>

            {/* Action Buttons */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<MarkEmailRead />}
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        sx={{
                            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                            fontWeight: 'bold',
                            borderRadius: 2
                        }}
                    >
                        📖 Đánh dấu tất cả đã đọc
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                        📅 Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')} lúc {new Date().toLocaleTimeString('vi-VN')}
                    </Typography>
                </Box>
            </Paper>

            {/* Tabs Filter */}
            <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            fontWeight: 'bold',
                            textTransform: 'none',
                            minHeight: 64,
                            fontSize: '1rem',
                            '&.Mui-selected': {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white'
                            }
                        }
                    }}
                >
                    <Tab label={`📋 Tất cả (${thongBao.length})`} />
                    <Tab label={`🔔 Chưa đọc (${unreadCount})`} />
                    <Tab label={`✅ Đã đọc (${thongBao.filter(n => n.isRead).length})`} />
                    <Tab label={`⚡ Quan trọng (${thongBao.filter(n => n.priority === 'high').length})`} />
                </Tabs>
            </Paper>

            {/* Notifications List */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {filteredNotifications.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {filteredNotifications.map((notification, index) => (
                            <Fade in={true} timeout={300 + index * 100} key={notification.id}>
                                <Box>
                                    <ListItem
                                        sx={{
                                            p: 3,
                                            backgroundColor: notification.isRead ? 'inherit' : 'rgba(33, 150, 243, 0.05)',
                                            borderLeft: `6px solid ${notification.color}`,
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.04)',
                                                transform: 'translateX(4px)',
                                                transition: 'all 0.2s ease'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{
                                                bgcolor: notification.color,
                                                width: 56,
                                                height: 56,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                            }}>
                                                {notification.icon}
                                            </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            sx={{ ml: 2 }}
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="h6" sx={{
                                                        fontWeight: 'bold',
                                                        color: notification.isRead ? 'text.primary' : '#1976d2'
                                                    }}>
                                                        {notification.title}
                                                    </Typography>
                                                    {!notification.isRead && (
                                                        <Circle sx={{
                                                            ml: 1,
                                                            fontSize: 8,
                                                            color: '#2196f3'
                                                        }} />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body1" sx={{
                                                        mb: 1,
                                                        lineHeight: 1.5,
                                                        color: 'text.primary'
                                                    }}>
                                                        {notification.content}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={notification.type}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: notification.color,
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                            <Schedule sx={{ fontSize: 14, mr: 0.5 }} />
                                                            <Typography variant="caption">
                                                                {notification.time} - {notification.date}
                                                            </Typography>
                                                        </Box>
                                                        {notification.priority === 'high' && (
                                                            <Chip
                                                                label="⚡ Quan trọng"
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            }
                                        />

                                        <ListItemSecondaryAction>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                {!notification.isRead && (
                                                    <Tooltip title="Đánh dấu đã đọc">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => markAsRead(notification.id)}
                                                            sx={{
                                                                backgroundColor: '#4caf50',
                                                                color: 'white',
                                                                '&:hover': { backgroundColor: '#45a049' }
                                                            }}
                                                        >
                                                            <MarkEmailRead fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Xóa thông báo">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        sx={{
                                                            backgroundColor: '#f44336',
                                                            color: 'white',
                                                            '&:hover': { backgroundColor: '#d32f2f' }
                                                        }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < filteredNotifications.length - 1 && <Divider />}
                                </Box>
                            </Fade>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <Avatar sx={{
                            width: 100,
                            height: 100,
                            bgcolor: 'grey.200',
                            mx: 'auto',
                            mb: 2
                        }}>
                            <NotificationsIcon sx={{ fontSize: 50, color: 'grey.500' }} />
                        </Avatar>
                        <Typography variant="h5" gutterBottom color="text.secondary">
                            📭 Không có thông báo nào
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {tabValue === 1 && "🎉 Tuyệt vời! Bạn đã đọc hết thông báo."}
                            {tabValue === 2 && "📝 Chưa có thông báo nào được đọc."}
                            {tabValue === 3 && "🔕 Không có thông báo quan trọng."}
                            {tabValue === 0 && "💫 Hãy quay lại sau để xem thông báo mới!"}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}