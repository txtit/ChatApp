import React from 'react';
import {
    Box, Card, CardContent, Typography, LinearProgress,
    Grid, Chip, Avatar, Button,
    Stack,
    Paper
} from '@mui/material';
import {
    TrendingUp, School, Quiz, Assignment,
    EmojiEvents, Timer, Star,
    PlayArrow, CheckCircle, Grade, Timeline,
    Whatshot
} from '@mui/icons-material';
import { useProgress } from '../hooks/useProgress';

const ProgressDashboard = () => {
    const {
        progressState,
        isSessionActive,
        sessionDuration,
        completionRate,
        recentAchievements,
        isOnStreak,
        getProgressSummary,
        formatTime,
        startSession,
        endSession,
        resetSession
    } = useProgress();

    const summary = getProgressSummary();

    const getScoreColor = (score) => {
        if (score >= 90) return 'success';
        if (score >= 70) return 'warning';
        if (score >= 50) return 'info';
        return 'error';
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h3" sx={{
                mb: 4,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
            }}>
                📊 Bảng Tiến Độ Học Tập
            </Typography>

            <Grid container spacing={3}>
                {/* Current Session Card */}
                {isSessionActive && (
                    <Grid item xs={12}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: 4
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Timer sx={{ mr: 2, fontSize: 40 }} />
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                Phiên Học Đang Diễn Ra
                                            </Typography>
                                            <Typography variant="h6">
                                                Thời gian: {formatTime(sessionDuration)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={endSession}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                        }}
                                    >
                                        Kết Thúc Phiên
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Overall Progress Card */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ mr: 2, fontSize: 30 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Tiến Độ Tổng Quan
                                </Typography>
                            </Box>
                            <Typography variant="h2" sx={{ mb: 2, fontWeight: 900 }}>
                                {summary.overallProgress}%
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={summary.overallProgress}
                                sx={{
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'white',
                                        borderRadius: 6
                                    }
                                }}
                            />
                            <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                                {summary.completedSlides} / {summary.totalSlides} slides hoàn thành
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Learning Stats Card */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h5" sx={{
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold'
                            }}>
                                <School sx={{ mr: 2 }} />
                                Thống Kê Học Tập
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                                        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                            {summary.totalExercises}
                                        </Typography>
                                        <Typography variant="body2">Bài Tập</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                                        <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
                                            {summary.totalQuizzes}
                                        </Typography>
                                        <Typography variant="body2">Quiz</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                                        <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                                            {summary.averageScore}
                                        </Typography>
                                        <Typography variant="body2">Điểm TB</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                                        <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                                            {summary.streakDays}
                                        </Typography>
                                        <Typography variant="body2">Ngày Liên Tiếp</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Study Time & Streak */}
                <Grid item xs={12} md={4}>
                    <Card sx={{
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                        color: 'white'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Whatshot sx={{ mr: 2, fontSize: 30 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Thời Gian & Streak
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                                {formatTime(summary.timeSpent)}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                                Tổng thời gian học
                            </Typography>

                            {isOnStreak && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <Whatshot sx={{ mr: 1, color: '#ff6b6b' }} />
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Streak {summary.streakDays} ngày!
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Best Score */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Grade sx={{ fontSize: 50, color: '#ffd700', mb: 2 }} />
                            <Typography variant="h4" color={getScoreColor(summary.bestScore)} sx={{ fontWeight: 'bold' }}>
                                {summary.bestScore}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Điểm Cao Nhất
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Achievement Count */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <EmojiEvents sx={{ fontSize: 50, color: '#ff9800', mb: 2 }} />
                            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                                {summary.achievementsCount}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Thành Tích
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Achievements */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h5" sx={{
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold'
                            }}>
                                <EmojiEvents sx={{ mr: 2 }} />
                                Thành Tích Gần Đây
                            </Typography>
                            {recentAchievements.length > 0 ? (
                                <Stack spacing={2}>
                                    {recentAchievements.map((achievement, index) => (
                                        <Paper key={index} sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{
                                                    mr: 2,
                                                    bgcolor: 'primary.main',
                                                    fontSize: 20
                                                }}>
                                                    🏆
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {achievement.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {achievement.description}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(achievement.earnedAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={achievement.type || 'achievement'}
                                                    size="small"
                                                    color="primary"
                                                />
                                            </Box>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Chưa có thành tích nào. Hãy tiếp tục học để mở khóa! 🎯
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                                ⚡ Hành Động Nhanh
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                {!isSessionActive && (
                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrow />}
                                        onClick={() => startSession({})}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Bắt Đầu Học
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    startIcon={<Timeline />}
                                    onClick={resetSession}
                                >
                                    Reset Session
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProgressDashboard;
