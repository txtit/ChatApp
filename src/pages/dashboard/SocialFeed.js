import React, { useState } from 'react'
import { Box, TextField, Avatar, Button, Card, CardContent, Typography } from '@mui/material';
import { AddPhotoAlternate, Mood, Send } from '@mui/icons-material';

const SocialFeed = () => {
    return (
        <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
            {/* Tạo bài đăng mới */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar sx={{ mr: 2 }} />
                        <TextField
                            fullWidth
                            placeholder="Chia sẻ điều gì đó..."
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Button startIcon={<AddPhotoAlternate />}>Ảnh</Button>
                            <Button startIcon={<Mood />}>Cảm xúc</Button>
                        </div>
                        <Button variant="contained" endIcon={<Send />}>Đăng</Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Danh sách bài đăng */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar sx={{ mr: 2 }} />
                        <div>
                            <Typography fontWeight="bold">Trần Thị B</Typography>
                            <Typography variant="caption">10 phút trước</Typography>
                        </div>
                    </Box>
                    <Typography paragraph>
                        Hôm nay mình đã hoàn thành bài toán khó nhất tuần này! 🎉
                    </Typography>
                    {/* Phần reaction và bình luận */}
                </CardContent>
            </Card>
        </Box>
    );
};

export default SocialFeed;