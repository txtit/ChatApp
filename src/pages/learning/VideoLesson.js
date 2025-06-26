import { Box, Typography, Card, CardMedia, IconButton, Chip, LinearProgress, Button } from '@mui/material';
import { PlayArrow, Bookmark, Share, Quiz } from '@mui/icons-material';
import React from 'react';
const VideoLesson = () => {
    const [progress, setProgress] = React.useState(0);

    // Mock data
    const lesson = {
        title: "Toán: Phép nhân phân số",
        teacher: "Cô Nguyễn Thị Hương",
        duration: "4:32",
        views: "1.2k",
        questions: 5
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>{lesson.title}</Typography>

            <Card sx={{ mb: 2 }}>
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image="/math-lesson-thumbnail.jpg"
                        alt="Bài giảng"
                    />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                        }}
                        size="large"
                    >
                        <PlayArrow fontSize="large" />
                    </IconButton>
                </Box>

                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>{lesson.teacher}</Typography>
                        <Box>
                            <IconButton><Bookmark /></IconButton>
                            <IconButton><Share /></IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`${lesson.duration}`} size="small" />
                        <Chip label={`${lesson.views} lượt xem`} size="small" variant="outlined" />
                    </Box>
                </Box>
            </Card>

            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, mb: 3 }} />

            <Button
                variant="contained"
                fullWidth
                startIcon={<Quiz />}
                sx={{ mb: 3 }}
            >
                Làm bài kiểm tra ({lesson.questions} câu)
            </Button>

            <Typography variant="h6" gutterBottom>Bài học liên quan</Typography>
            {/* Danh sách bài học liên quan */}
        </Box>
    );
};

export default VideoLesson;