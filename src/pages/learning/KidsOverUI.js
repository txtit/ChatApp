// import React from 'react';
// import {
//     Box,
//     Button,
//     Typography,
//     Card,
//     CardContent,
//     Avatar,
//     Stack,
//     Paper,
//     LinearProgress
// } from '@mui/material';
// import {
//     Calculate,
//     MenuBook,
//     Code,
//     MusicNote,
//     EmojiEvents
// } from '@mui/icons-material';

// const KidsOverDashboard = () => {
//     // Dữ liệu khóa học
//     const courses = [
//         {
//             icon: <Calculate color="primary" sx={{ fontSize: 40 }} />,
//             title: "Toán học",
//             sub: "10 bài học mới"
//         },
//         {
//             icon: <MenuBook color="primary" sx={{ fontSize: 40 }} />,
//             title: "Tiếng Anh",
//             sub: "5 bài học mới"
//         },
//         {
//             icon: <Code color="primary" sx={{ fontSize: 40 }} />,
//             title: "Lập trình",
//             sub: "8 bài học mới"
//         },
//         {
//             icon: <MusicNote color="primary" sx={{ fontSize: 40 }} />,
//             title: "Âm nhạc",
//             sub: "3 bài học mới"
//         }
//     ];

//     return (
//         <Box sx={{
//             backgroundColor: '#f9f9f9',
//             minHeight: '100vh',
//             width: '100%',

//             p: 3,
//             fontFamily: '"Comic Sans MS", cursive, sans-serif'
//         }}>
//             {/* Header */}
//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 mb: 4
//             }}>
//                 <Typography variant="h4" sx={{
//                     color: '#ff6b6b',
//                     fontWeight: 'bold',
//                     fontFamily: '"Baloo 2", cursive'
//                 }}>
//                     KidsOver
//                 </Typography>
//                 <Avatar sx={{ bgcolor: '#ff6b6b' }}>
//                     <EmojiEvents />
//                 </Avatar>
//             </Box>

//             {/* Welcome Section */}
//             <Paper elevation={3} sx={{
//                 bgcolor: '#fff',
//                 p: 3,
//                 mb: 4,
//                 borderRadius: 4,
//                 background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
//             }}>
//                 <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
//                     Chào mừng bạn trở lại!
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 3 }}>
//                     Hôm nay chúng ta học gì nhỉ?
//                 </Typography>
//                 <Button
//                     variant="contained"
//                     sx={{
//                         bgcolor: '#ff6b6b',
//                         '&:hover': { bgcolor: '#ff5252' },
//                         borderRadius: 3,
//                         px: 4,
//                         py: 1,
//                         fontSize: '1.1rem',
//                         textTransform: 'none'
//                     }}
//                 >
//                     Bắt đầu học
//                 </Button>
//             </Paper>

//             {/* Courses Section */}
//             <Typography variant="h5" sx={{
//                 mb: 3,
//                 fontWeight: 'bold',
//                 color: '#333'
//             }}>
//                 Khóa học của bạn
//             </Typography>

//             <Stack direction="row" spacing={3} sx={{
//                 flexWrap: 'wrap',
//                 justifyContent: { xs: 'center', md: 'flex-start' }
//             }}>
//                 {courses.map((course, index) => (
//                     <Card key={index} sx={{
//                         minWidth: 180,
//                         borderRadius: 3,
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                         '&:hover': {
//                             transform: 'translateY(-5px)',
//                             transition: 'transform 0.3s'
//                         }
//                     }}>
//                         <CardContent sx={{
//                             textAlign: 'center',
//                             p: 3
//                         }}>
//                             {course.icon}
//                             <Typography variant="h6" sx={{
//                                 mt: 1,
//                                 fontWeight: 'bold'
//                             }}>
//                                 {course.title}
//                             </Typography>
//                             <Typography variant="body2" sx={{
//                                 color: 'text.secondary',
//                                 mt: 1
//                             }}>
//                                 {course.sub}
//                             </Typography>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </Stack>

//             {/* Progress Section */}
//             <Typography variant="h5" sx={{
//                 mt: 5,
//                 mb: 2,
//                 fontWeight: 'bold',
//                 color: '#333'
//             }}>
//                 Tiến độ học tập
//             </Typography>

//             <Paper elevation={3} sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 bgcolor: '#fff'
//             }}>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                     Bạn đã hoàn thành 12/20 bài học
//                 </Typography>
//                 <LinearProgress
//                     variant="determinate"
//                     value={60}
//                     sx={{
//                         height: 10,
//                         borderRadius: 5,
//                         backgroundColor: '#e0e0e0',
//                         '& .MuiLinearProgress-bar': {
//                             borderRadius: 5,
//                             backgroundColor: '#4caf50'
//                         }
//                     }}
//                 />
//                 <Box sx={{
//                     display: 'flex',
//                     justifyContent: 'flex-end',
//                     mt: 1
//                 }}>
//                     <Typography variant="body2" color="text.secondary">
//                         60% hoàn thành
//                     </Typography>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default KidsOverDashboard;

import React, { useState } from 'react';
import axios from "../../utils/axios";
import {
    Box, Button, TextField, Typography, CircularProgress,
    Paper, Grid, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axiosInstance from '../../utils/axios';

export default function UploadCurriculum() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [loading, setLoading] = useState(false);
    const [learningPath, setLearningPath] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('subject', subject);
        formData.append('grade', grade);

        try {
            const response = await axiosInstance.post('/learn/upload', formData);
            setLearningPath(response.data.data.learningPath);
            alert('Giáo án đã được tải lên và xử lý thành công!');
        } catch (error) {
            console.error('Lỗi khi tải lên:', error);
            alert('Có lỗi xảy ra khi tải lên giáo án');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Tải lên giáo án
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                            >
                                Chọn file giáo án
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    required
                                />
                            </Button>
                            {file && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Đã chọn: {file.name}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Tiêu đề giáo án"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Mô tả"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Môn học"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Lớp</InputLabel>
                                <Select
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                                        <MenuItem key={g} value={g}>
                                            Lớp {g}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                fullWidth
                                sx={{ py: 1.5 }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    'Tải lên và tạo lộ trình học'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {learningPath && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Lộ trình học đã tạo:
                    </Typography>
                    <Typography variant="h6">{learningPath.title}</Typography>

                    {learningPath.lessons.map((lesson, index) => (
                        <Box key={index} sx={{ my: 2, p: 2, border: '1px solid #eee' }}>
                            <Typography variant="subtitle1">
                                <strong>Ngày {lesson.day}, {lesson.session}: {lesson.title}</strong>
                            </Typography>
                            <Typography variant="body2">{lesson.description}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Thời lượng: {lesson.duration} phút
                            </Typography>
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
}