import React from 'react';
import {
    Card, Typography, Grid, Box, List, ListItem, ListItemAvatar,
    ListItemText, Avatar, Badge, Chip, LinearProgress
} from '@mui/material';
import {
    Group as GroupIcon,
    TrendingUp as TrendingUpIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckIcon,
    Star as StarIcon
} from '@mui/icons-material';

export const StatisticsCards = ({ statisticsData }) => (
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
);

export const ProgressChart = ({ monthlyProgress }) => (
    <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Xu hướng điểm số theo tháng</Typography>
        <Box sx={{ display: 'flex', alignItems: 'end', height: 200, gap: 2 }}>
            {monthlyProgress.map((item, index) => (
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
);

export const TopPerformers = ({ students, getScoreColor, getScoreLabel }) => (
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
);

export const AttendanceSummary = ({ attendanceData }) => (
    <Grid container spacing={3}>
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
);
