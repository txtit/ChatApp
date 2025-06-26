import { Box, Typography, Card, CardContent, LinearProgress, Chip, Button } from '@mui/material';
import { EmojiEvents, CheckCircle, Star } from '@mui/icons-material';
import React from 'react';
const DailyQuests = () => {
    const quests = [
        { title: "Học 1 bài Toán", xp: 100, completed: true },
        { title: "Xem 2 video Tiếng Anh", xp: 150, completed: false, progress: 1 },
        { title: "Hoàn thành 1 trò chơi", xp: 200, completed: false },
        { title: "Giúp đỡ bạn bè", xp: 50, completed: false }
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Nhiệm vụ hôm nay</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Star color="warning" sx={{ fontSize: 40, mr: 1 }} />
                <Box>
                    <Typography variant="h6">Tiến độ nhiệm vụ</Typography>
                    <LinearProgress variant="determinate" value={40} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
            </Box>

            {quests.map((quest, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                        {quest.completed ? (
                            <CheckCircle color="success" sx={{ fontSize: 30, mr: 2 }} />
                        ) : (
                            <Box sx={{
                                width: 30,
                                height: 30,
                                border: '2px solid #ddd',
                                borderRadius: '50%',
                                mr: 2
                            }} />
                        )}

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography>{quest.title}</Typography>
                            {quest.progress && (
                                <LinearProgress
                                    variant="determinate"
                                    value={(quest.progress / 2) * 100}
                                    sx={{ height: 6, mt: 1 }}
                                />
                            )}
                        </Box>

                        <Chip
                            icon={<EmojiEvents />}
                            label={`+${quest.xp} XP`}
                            color="primary"
                            variant="outlined"
                        />
                    </CardContent>
                </Card>
            ))}

            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                Nhận thưởng ngày
            </Button>
        </Box>
    );
};

export default DailyQuests;