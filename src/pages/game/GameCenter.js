import {
    Box,
    Typography,
    Card,
    CardActionArea,
    CardContent,
    Button,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    LinearProgress
} from '@mui/material';
import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { EmojiEvents, Star, TrendingUp } from '@mui/icons-material';
const GameCenter = () => {
    const navigate = useNavigate();

    const games = [
        {
            name: "Đấu trường Toán học",
            reward: "500 XP",
            players: "1.2k đang chơi",
            route: "/mathgame",
            emoji: "🧮"
        },
        {
            name: "Ghép từ Tiếng Anh",
            reward: "Huy hiệu",
            players: "800 đang chơi",
            route: "/englishgame",
            emoji: "🔤"
        },
        {
            name: "Đố vui Khoa học",
            reward: "300 XP",
            players: "650 đang chơi",
            route: "/game",
            emoji: "🔬"
        }
    ];    // Dữ liệu bảng xếp hạng học tập
    const leaderboardData = [
        {
            rank: 1,
            name: "Alex Nguyễn",
            avatar: "A",
            totalScore: 950,
            avgScore: 9.5,
            testsCompleted: 100,
            studyHours: 125,
            accuracy: 95,
            badge: "👑",
            grade: "Xuất sắc"
        },
        {
            rank: 2,
            name: "Minh Châu",
            avatar: "M",
            totalScore: 890,
            avgScore: 8.9,
            testsCompleted: 95,
            studyHours: 108,
            accuracy: 89,
            badge: "🥈",
            grade: "Giỏi"
        },
        {
            rank: 3,
            name: "Hoàng Tú",
            avatar: "H",
            totalScore: 825,
            avgScore: 8.3,
            testsCompleted: 87,
            studyHours: 96,
            accuracy: 83,
            badge: "🥉",
            grade: "Giỏi"
        },
        {
            rank: 4,
            name: "Lan Anh",
            avatar: "L",
            totalScore: 780,
            avgScore: 7.8,
            testsCompleted: 76,
            studyHours: 84,
            accuracy: 78,
            badge: "📚",
            grade: "Khá"
        },
        {
            rank: 5,
            name: "Đức Minh",
            avatar: "D",
            totalScore: 735,
            avgScore: 7.4,
            testsCompleted: 68,
            studyHours: 75,
            accuracy: 74,
            badge: "📚",
            grade: "Khá"
        },
        {
            rank: 6,
            name: "Thu Hà",
            avatar: "T",
            totalScore: 685,
            avgScore: 6.9,
            testsCompleted: 62,
            studyHours: 68,
            accuracy: 69,
            badge: "📚",
            grade: "Khá"
        },
        {
            rank: 7,
            name: "Văn Nam",
            avatar: "V",
            totalScore: 640,
            avgScore: 6.4,
            testsCompleted: 55,
            studyHours: 61,
            accuracy: 64,
            badge: "📖",
            grade: "Trung bình"
        },
        {
            rank: 8,
            name: "Mai Linh",
            avatar: "M",
            totalScore: 595,
            avgScore: 6.0,
            testsCompleted: 48,
            studyHours: 54,
            accuracy: 60,
            badge: "📖",
            grade: "Trung bình"
        }
    ];

    const handlePlayGame = (route) => {
        navigate(route);
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return '#FFD700'; // Vàng
            case 2: return '#C0C0C0'; // Bạc
            case 3: return '#CD7F32'; // Đồng
            default: return '#1976d2'; // Xanh
        }
    }; return (
        <Box sx={{ p: 3, width: '100%', backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom>Trung tâm trò chơi</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/parent-dashboard')}
                    sx={{
                        background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #ee5a52, #e74c3c)',
                        },
                        px: 3,
                        py: 1,
                        fontWeight: 'bold'
                    }}
                >
                    👨‍👩‍👧‍👦 Bảng điều khiển phụ huynh
                </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/teacher-dashboard')}
                    sx={{
                        background: 'linear-gradient(45deg,rgb(122, 107, 255),rgb(82, 181, 238))',
                        '&:hover': {
                            background: 'linear-gradient(45deg,rgb(82, 118, 238),rgb(60, 177, 231))',
                        },
                        px: 3,
                        py: 1,
                        fontWeight: 'bold'
                    }}
                >
                    👨‍👩‍👧‍👦 Bảng điều khiển Giáo Viên
                </Button>
            </Box>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 3
            }}>                {games.map((game, index) => (
                <Card key={index} sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                    }
                }}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span style={{ fontSize: '2rem' }}>{game.emoji}</span>
                                {game.name}
                            </Typography>
                            <Typography color="text.secondary">
                                Phần thưởng: {game.reward}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {game.players}
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1976d2, #0288d1)',
                                        transform: 'scale(1.02)'
                                    }
                                }}
                                onClick={() => handlePlayGame(game.route)}
                            >
                                🎮 Chơi ngay
                            </Button>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
            </Box>            <Box sx={{ mt: 4 }}>                <Typography variant="h5" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3
            }}>
                <EmojiEvents sx={{ color: '#FFD700', fontSize: '2rem' }} />
                Bảng xếp hạng học tập tuần này
                <Chip
                    label="Cập nhật mới"
                    color="success"
                    size="small"
                    sx={{ ml: 2 }}
                />
            </Typography>

                <Card sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}>
                    <CardContent sx={{ p: 0 }}>
                        <TableContainer component={Paper} sx={{
                            borderRadius: 3,
                            background: 'transparent'
                        }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{
                                        background: 'linear-gradient(45deg, #2196f3, #21cbf3)'
                                    }}>                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                            Hạng
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                            Học sinh
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                            Điểm TB
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                            Xếp loại
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                            Độ chính xác
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                            Số bài thi
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leaderboardData.map((player) => (
                                        <TableRow
                                            key={player.rank}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                                                    transform: 'scale(1.01)',
                                                    transition: 'all 0.2s ease'
                                                },
                                                backgroundColor: player.rank <= 3 ?
                                                    `${getRankColor(player.rank)}15` : 'transparent'
                                            }}
                                        >
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: getRankColor(player.rank),
                                                            fontWeight: 'bold',
                                                            minWidth: 20
                                                        }}
                                                    >
                                                        #{player.rank}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '1.5rem' }}>
                                                        {player.badge}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: getRankColor(player.rank),
                                                            width: 40,
                                                            height: 40,
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {player.avatar}
                                                    </Avatar>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {player.name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>                                            <TableCell>
                                                <Stack alignItems="flex-start">
                                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                                        {player.avgScore}/10
                                                    </Typography>
                                                    <Chip
                                                        icon={<TrendingUp />}
                                                        label={`${player.totalScore} điểm`}
                                                        size="small"
                                                        color="info"
                                                        variant="outlined"
                                                    />
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={player.grade}
                                                    color={
                                                        player.grade === 'Xuất sắc' ? 'success' :
                                                            player.grade === 'Giỏi' ? 'primary' :
                                                                player.grade === 'Khá' ? 'warning' : 'default'
                                                    }
                                                    variant="filled"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={1}>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {player.accuracy}%
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={player.accuracy}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            backgroundColor: '#f0f0f0'
                                                        }}
                                                        color={player.accuracy >= 80 ? 'success' :
                                                            player.accuracy >= 60 ? 'warning' : 'error'}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Stack alignItems="flex-start">
                                                    <Typography variant="body2" color="text.secondary">
                                                        {player.testsCompleted} bài
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {player.studyHours}h học
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                📚 Học tập chăm chỉ để đạt thành tích cao hơn!
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<Star />}
                                sx={{
                                    borderColor: '#FFD700',
                                    color: '#FFD700',
                                    '&:hover': {
                                        borderColor: '#FFA500',
                                        color: '#FFA500',
                                        backgroundColor: 'rgba(255, 215, 0, 0.1)'
                                    }
                                }}
                            >
                                Xem bảng thành tích cả năm
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default GameCenter;