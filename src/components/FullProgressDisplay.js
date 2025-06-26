import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Chip, Stack, Divider, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, School, Assignment, Quiz, Timer, TrendingUp, Stars, EmojiEvents } from '@mui/icons-material';

const FullProgressDisplay = () => {
    const dispatch = useDispatch();

    // Lấy toàn bộ progress state từ Redux
    const trangThaiTienDo = useSelector(state => state.progress);

    // Debug: In ra toàn bộ state để kiểm tra
    console.log('🎯 Trạng Thái Tiến Độ Đầy Đủ:', trangThaiTienDo);

    return (
        <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 4,
                color: '#2c3e50',
                fontWeight: 'bold'
            }}>
                <School sx={{ mr: 2, color: 'primary.main' }} />
                📊 Bảng Thành Tích Học Tập Toàn Diện
            </Typography>            <Grid container spacing={3}>
                {/* Tiến Độ Tổng Quan */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        borderRadius: 3
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{
                                color: '#1565c0',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                📊 Tiến Độ Tổng Quan
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    🎯 Tiến độ học tập: {trangThaiTienDo.overallProgress || 0}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={trangThaiTienDo.overallProgress || 0}
                                    sx={{
                                        mt: 1,
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 6,
                                            background: 'linear-gradient(90deg, #42a5f5, #1976d2)'
                                        }
                                    }}
                                />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Chip
                                        label={`👤 Học sinh: ${trangThaiTienDo.userId || 'Chưa có'}`}
                                        variant="outlined"
                                        size="small"
                                        sx={{ fontSize: '0.75rem' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Chip
                                        label={`📄 Slide: ${trangThaiTienDo.slideId || 'Chưa có'}`}
                                        variant="outlined"
                                        size="small"
                                        sx={{ fontSize: '0.75rem' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Chip
                                        label={`📍 Hiện tại: ${trangThaiTienDo.currentSlideIndex || 0}`}
                                        color="primary"
                                        size="small"
                                        sx={{ fontSize: '0.75rem' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Chip
                                        label={`⏰ Thời gian: ${Math.floor((trangThaiTienDo.timeSpent || 0) / 60)} phút`}
                                        color="secondary"
                                        size="small"
                                        sx={{ fontSize: '0.75rem' }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>                {/* Thống Kê Hoàn Thành */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                        borderRadius: 3
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{
                                color: '#2e7d32',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                ✅ Thống Kê Hoàn Thành
                            </Typography>

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <School sx={{ mr: 1, fontSize: 16, color: '#4caf50' }} />
                                        📚 Slide đã hoàn thành:
                                    </Typography>
                                    <Chip
                                        label={trangThaiTienDo.completedSlides?.length || 0}
                                        color="success"
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Assignment sx={{ mr: 1, fontSize: 16, color: '#2196f3' }} />
                                        📝 Bài tập đã làm:
                                    </Typography>
                                    <Chip
                                        label={trangThaiTienDo.completedExercises?.length || 0}
                                        color="info"
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Quiz sx={{ mr: 1, fontSize: 16, color: '#ff9800' }} />
                                        🧩 Trắc nghiệm đã làm:
                                    </Typography>
                                    <Chip
                                        label={trangThaiTienDo.completedQuizzes?.length || 0}
                                        color="warning"
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>                {/* Chi Tiết Slide Hiện Tại */}
                <Grid item xs={12}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                        borderRadius: 3
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{
                                color: '#e65100',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                📝 Chi Tiết Slide Hiện Tại
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2" sx={{ color: '#bf360c', fontWeight: 'bold' }}>
                                            📋 Thông tin cơ bản:
                                        </Typography>
                                        <Typography variant="body2">🆔 Mã: {trangThaiTienDo.currentSlide?.id || 'Chưa có'}</Typography>
                                        <Typography variant="body2">📖 Tiêu đề: {trangThaiTienDo.currentSlide?.title || 'Chưa có'}</Typography>
                                        <Typography variant="body2">🎯 Loại: {trangThaiTienDo.currentSlide?.type || 'Chưa có'}</Typography>
                                        <Typography variant="body2">📚 Môn học: {trangThaiTienDo.currentSlide?.subject || 'Chưa có'}</Typography>
                                        <Typography variant="body2">⭐ Độ khó: {trangThaiTienDo.currentSlide?.difficulty || 'Chưa có'}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2" sx={{ color: '#bf360c', fontWeight: 'bold' }}>
                                            🏆 Kết quả học tập:
                                        </Typography>
                                        <Typography variant="body2">📊 Điểm số: {trangThaiTienDo.currentSlide?.score || 0}/{trangThaiTienDo.currentSlide?.maxScore || 0}</Typography>
                                        <Typography variant="body2">🔄 Số lần thử: {trangThaiTienDo.currentSlide?.attempts || 0}</Typography>
                                        <Typography variant="body2">✅ Đã hoàn thành: {trangThaiTienDo.currentSlide?.isCompleted ? 'Rồi' : 'Chưa'}</Typography>
                                        <Typography variant="body2">🎖️ Điểm thưởng: {trangThaiTienDo.currentSlide?.points || 0}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>                {/* Thống Kê Học Tập */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
                        borderRadius: 3
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{
                                color: '#0277bd',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                📈 Thống Kê Học Tập
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2">📄 Tổng Slide: {trangThaiTienDo.learningStats?.totalSlides || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">📚 Tổng Bài học: {trangThaiTienDo.learningStats?.totalLessons || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">📝 Tổng Bài tập: {trangThaiTienDo.learningStats?.totalExercises || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">🧩 Tổng Trắc nghiệm: {trangThaiTienDo.learningStats?.totalQuizzes || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">📊 Điểm TB: {trangThaiTienDo.learningStats?.averageScore || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">🏆 Điểm cao nhất: {trangThaiTienDo.learningStats?.bestScore || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">🔥 Ngày liên tiếp: {trangThaiTienDo.learningStats?.streakDays || 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">⏰ Giờ học: {trangThaiTienDo.learningStats?.studyHours?.total || 0}h</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>                {/* Thành Tựu & Mục Tiêu */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
                        borderRadius: 3
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{
                                color: '#ef6c00',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                🏆 Thành Tựu & Mục Tiêu
                            </Typography>

                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#e65100',
                                        fontWeight: 'bold'
                                    }}>
                                        <EmojiEvents sx={{ mr: 1, fontSize: 16 }} />
                                        🎯 Thành tựu ({trangThaiTienDo.achievements?.length || 0})
                                    </Typography>
                                    {trangThaiTienDo.achievements?.length > 0 ? (
                                        <List dense>
                                            {trangThaiTienDo.achievements.slice(0, 3).map((thanhTuu, index) => (
                                                <ListItem key={index} disableGutters>
                                                    <ListItemText
                                                        primary={thanhTuu.title || thanhTuu.id}
                                                        secondary={thanhTuu.description}
                                                        sx={{
                                                            '& .MuiListItemText-primary': { fontWeight: 'bold' }
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            🌱 Chưa có thành tựu nào, hãy cố gắng nhé!
                                        </Typography>
                                    )}
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#e65100',
                                        fontWeight: 'bold'
                                    }}>
                                        <Stars sx={{ mr: 1, fontSize: 16 }} />
                                        🏅 Huy hiệu ({trangThaiTienDo.unlockedBadges?.length || 0})
                                    </Typography>
                                    {trangThaiTienDo.unlockedBadges?.length > 0 ? (
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {trangThaiTienDo.unlockedBadges.slice(0, 5).map((huyHieu, index) => (
                                                <Chip
                                                    key={index}
                                                    label={huyHieu.name || huyHieu.id}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: '#fff3e0',
                                                        borderColor: '#ff9800',
                                                        color: '#e65100'
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            🌟 Chưa mở khóa huy hiệu nào
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>                {/* Lịch Sử Slide Accordion */}
                <Grid item xs={12}>
                    <Accordion sx={{
                        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                        borderRadius: 3,
                        '&:before': { display: 'none' }
                    }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            sx={{ backgroundColor: 'rgba(156, 39, 176, 0.1)' }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                                📚 Lịch Sử Học Tập ({Object.keys(trangThaiTienDo.slideHistory || {}).length} slide)
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {Object.keys(trangThaiTienDo.slideHistory || {}).length > 0 ? (
                                <Grid container spacing={2}>
                                    {Object.entries(trangThaiTienDo.slideHistory || {}).slice(0, 6).map(([slideId, lichSu]) => (
                                        <Grid item xs={12} md={6} lg={4} key={slideId}>
                                            <Card variant="outlined" sx={{
                                                background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                                                borderColor: '#e91e63'
                                            }}>
                                                <CardContent>
                                                    <Typography variant="subtitle2" gutterBottom sx={{
                                                        fontWeight: 'bold',
                                                        color: '#c2185b'
                                                    }}>
                                                        📄 {slideId}
                                                    </Typography>
                                                    <Typography variant="body2">🔄 Số lần thử: {lichSu.attempts?.length || 0}</Typography>
                                                    <Typography variant="body2">🏆 Điểm cao nhất: {lichSu.bestScore || 0}</Typography>
                                                    <Typography variant="body2">⏰ Thời gian: {Math.floor((lichSu.timeSpent || 0) / 60)} phút</Typography>
                                                    <Typography variant="body2">✅ Hoàn thành: {lichSu.completedCount || 0} lần</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                    📝 Chưa có lịch sử học tập nào
                                </Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Grid>                {/* Trạng Thái Hệ Thống */}
                <Grid item xs={12}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                        borderRadius: 3
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{
                                color: '#2e7d32',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                ⚡ Trạng Thái Hệ Thống
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                <Chip
                                    label={trangThaiTienDo.isLoading ? "🔄 Đang tải..." : "✅ Sẵn sàng"}
                                    color={trangThaiTienDo.isLoading ? "warning" : "success"}
                                    sx={{ fontWeight: 'bold' }}
                                />
                                <Chip
                                    label={trangThaiTienDo.isSaving ? "💾 Đang lưu..." : "✅ Đã lưu"}
                                    color={trangThaiTienDo.isSaving ? "warning" : "success"}
                                    sx={{ fontWeight: 'bold' }}
                                />
                                {trangThaiTienDo.error && (
                                    <Chip
                                        label={`❌ Lỗi: ${trangThaiTienDo.error}`}
                                        color="error"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>                {/* Dữ Liệu Tiến Độ Thô (Debug) */}
                <Grid item xs={12}>
                    <Accordion sx={{
                        background: 'linear-gradient(135deg, #fafafa 0%, #e0e0e0 100%)',
                        borderRadius: 3,
                        '&:before': { display: 'none' }
                    }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            sx={{ backgroundColor: 'rgba(97, 97, 97, 0.1)' }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242' }}>
                                🔧 Dữ Liệu Tiến Độ Thô ()
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{
                                backgroundColor: '#f5f5f5',
                                p: 2,
                                borderRadius: 2,
                                maxHeight: 400,
                                overflow: 'auto',
                                border: '1px solid #ddd'
                            }}>
                                <pre style={{
                                    fontSize: '12px',
                                    margin: 0,
                                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                    color: '#333'
                                }}>
                                    {JSON.stringify(trangThaiTienDo, null, 2)}
                                </pre>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FullProgressDisplay;
