import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
} from "@mui/material";
import {
    CloudUpload as CloudUploadIcon,
    School as SchoolIcon,
} from "@mui/icons-material";
import { showSnackBar } from "../../redux/slices/app";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const GRADES = [
    { value: "1", label: "Lớp 1" },
    { value: "2", label: "Lớp 2" },
    { value: "3", label: "Lớp 3" },
    { value: "4", label: "Lớp 4" },
    { value: "5", label: "Lớp 5" },
    { value: "6", label: "Lớp 6" },
    { value: "7", label: "Lớp 7" },
    { value: "8", label: "Lớp 8" },
    { value: "9", label: "Lớp 9" },
];

const SUBJECTS = [
    { value: "Toán", label: "Toán" },
    { value: "Tiếng Việt", label: "Tiếng Việt" },
    { value: "Tiếng Anh", label: "Tiếng Anh" },
    { value: "Khoa học", label: "Khoa học" },
    { value: "Lịch sử", label: "Lịch sử" },
    { value: "Địa lý", label: "Địa lý" },
    { value: "Tin học", label: "Tin học" },
];

export default function UploadCurriculum() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [learningPath, setLearningPath] = useState(null);
    const [curriculumId, setCurriculumId] = useState("");
    const [creating, setCreating] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMsg("");

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('subject', subject);
        formData.append('grade', grade);

        try {
            const response = await axios.post('http://localhost:3000/learn/upload', formData);
            setLearningPath(response.data.data);
            setCurriculumId(response.data.data.id);
            dispatch(showSnackBar({ severity: "success", message: response.data.message }));
            // Reset form inputs
            setTitle("");
            setDescription("");
            setSubject("");
            setGrade("");
            setFile(null);
            setSuccessMsg("Đã upload thành công! Hãy ấn nút 'Tạo bài học' để bắt đầu tạo bài học.");
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1000);
        } catch (error) {
            dispatch(showSnackBar({ severity: "error", message: "Có lỗi xảy ra khi tải lên giáo án. Vui lòng thử lại!" }));
            setError('Có lỗi xảy ra khi tải lên giáo án. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async () => {
        if (!learningPath) return;
        setCreating(true);
        try {
            // Gọi API tạo bài học, ví dụ endpoint /course/create
            const response = await axios.post('http://localhost:3000/learn/slides', {
                curriculumId: curriculumId,
            });
            dispatch(showSnackBar({ severity: "success", message: "Tạo bài học thành công!" }));
            navigate('/learn');
        } catch (error) {
            dispatch(showSnackBar({ severity: "error", message: "Tạo bài học thất bại!" }));
        } finally {
            setCreating(false);
        }
    };

    console.log("Learning Path:", learningPath);
    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 2, md: 4 } }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    background: '#fff9e5', // Màu vàng nhạt như trong hình
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Vòng tròn trang trí góc phải */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 192, 203, 0.2)',
                        zIndex: 0
                    }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <SchoolIcon sx={{
                            fontSize: 40,
                            color: '#ff7300',
                            mr: 1,
                            transform: 'translateY(-2px)'
                        }} />
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                color: '#ff7300',
                                fontSize: { xs: '1.5rem', md: '2.2rem' }
                            }}
                        >
                            Tải lên giáo án
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            mb: 4,
                            textAlign: 'center',
                            color: '#666'
                        }}
                    >
                        Tải lên giáo án và AI sẽ tạo lộ trình học tập thú vị cho học sinh!
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {successMsg && (
                                <Grid item xs={12}>
                                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {successMsg}
                                    </Alert>
                                </Grid>
                            )}
                            {!learningPath && (
                                <>
                                    {/* Khu vực kéo thả file - giống thiết kế */}
                                    <Grid item xs={12} sx={{ mb: 2 }}>
                                        <Box sx={{
                                            textAlign: 'center',
                                            position: 'relative'
                                        }}>
                                            {/* Icon mây tải lên */}
                                            <Box sx={{
                                                width: 60,
                                                height: 60,
                                                bgcolor: '#1976d2',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2
                                            }}>
                                                <CloudUploadIcon sx={{ fontSize: 30, color: 'white' }} />
                                            </Box>

                                            {/* Đường nét đứt */}
                                            <Box
                                                component="label"
                                                sx={{
                                                    cursor: 'pointer',
                                                    py: 3,
                                                    px: 2,
                                                    border: '2px dashed #1976d2',
                                                    borderRadius: 2,
                                                    width: '100%',
                                                    display: 'block',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={handleFileChange}
                                                    accept=".pdf"
                                                />
                                                <Typography
                                                    variant="h6"
                                                    color="primary"
                                                    sx={{ mb: 1 }}
                                                >
                                                    Nhấn vào đây để tải lên giáo án
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Hỗ trợ định dạng: PDF, DOC, DOCX, TXT
                                                </Typography>

                                                {file && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ mt: 2, fontWeight: 'bold' }}
                                                    >
                                                        Đã chọn: {file.name}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Trường tiêu đề */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Tiêu đề giáo án"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            placeholder="Tiêu đề giáo án"
                                            InputProps={{
                                                startAdornment: (
                                                    <Box component="span" sx={{
                                                        mr: 1,
                                                        color: '#9c27b0',
                                                        display: 'flex'
                                                    }}>
                                                        📌
                                                    </Box>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Trường mô tả */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Mô tả ngắn"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            placeholder="Mô tả ngắn"
                                            InputProps={{
                                                startAdornment: (
                                                    <Box component="span" sx={{
                                                        mr: 1,
                                                        color: '#2196f3',
                                                        display: 'flex'
                                                    }}>
                                                        📝
                                                    </Box>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Dropdown môn học */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Môn học</InputLabel>
                                            <Select
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                label="Môn học"
                                            >
                                                {SUBJECTS.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Dropdown lớp */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Lớp</InputLabel>
                                            <Select
                                                value={grade}
                                                onChange={(e) => setGrade(e.target.value)}
                                                label="Lớp"
                                            >
                                                {GRADES.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Nút gửi */}
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loading || !file}
                                            fullWidth
                                            size="large"
                                            sx={{
                                                py: 2,
                                                borderRadius: 2,
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                background: '#2196f3',
                                                textTransform: 'none',
                                            }}
                                        >
                                            {loading ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                'Tải lên giáo án'
                                            )}
                                        </Button>
                                    </Grid>
                                </>
                            )}
                            {learningPath && (
                                <Grid item xs={12}>
                                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={handleCreateCourse}
                                            disabled={creating}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                background: '#1976d2',
                                                textTransform: 'none',
                                                boxShadow: 2
                                            }}
                                        >
                                            {creating ? <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} /> : null}
                                            Tạo bài học
                                        </Button>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Box>
            </Paper>

            {/* Phần hiển thị kết quả không thay đổi */}
            {learningPath && (
                <Paper
                    elevation={5}
                    sx={{
                        mt: 4,
                        p: { xs: 2, md: 4 },
                        borderRadius: 4,
                        background: 'linear-gradient(to right bottom, #e0f7fa, #ffffff)',
                    }}
                >
                    {/* ...code hiển thị kết quả giữ nguyên... */}
                </Paper>
            )}
        </Box>
    );
}