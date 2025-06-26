import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import KidsSlideshow from '../../components/KidsSlideshow/KidsSlideshow';
import axiosInstance from '../../utils/axios';
import { useParams } from 'react-router-dom';
import { sampleSlidesData } from '../../data/slidesData'; // Import sample data for testing

export default function Slideshow() {
    const [slideData, setSlideData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy slideId từ URL sử dụng useParams
    const { slideId } = useParams();

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);

                // If slideId is 'test' or 'sample', use sample data instead of API
                if (slideId === 'test' || slideId === 'sample') {
                    console.log('Using sample data for testing');
                    setSlideData(sampleSlidesData);
                    setLoading(false);
                    return;
                }

                // Gọi API để lấy dữ liệu slide
                const response = await axiosInstance.get(`/learn/slides-data/${slideId}`);
                // console.log('API response:', response.data);

                // Kiểm tra cấu trúc response
                if (!response.data.success || !response.data.slides) {
                    throw new Error('Dữ liệu API không đúng định dạng');
                }

                // Log chi tiết cấu trúc dữ liệu để debug - chú ý data.slides chứa toàn bộ dữ liệu
                // console.log('Response structure:', {
                //     hasData: !!response.data.slides,
                //     hasSlidesArray: Array.isArray(response.data.slides.slides),
                //     slidesCount: response.data.slides.slides?.length || 0,
                //     exercisesCount: response.data.slides.exercises?.length || 0,
                //     quizzesCount: response.data.slides.quizzes?.length || 0
                // });

                // Xử lý phần tích hợp bài tập và quiz với slides
                const processedData = processSlideData(response.data.slides);

                setSlideData(processedData);
                setLoading(false);
            } catch (err) {
                console.error('Lỗi khi tải slides:', err);
                setError('Không thể tải slide, vui lòng thử lại sau');
                setLoading(false);
            }
        };

        fetchSlides();
    }, [slideId]);

    // Hàm xử lý dữ liệu slides để thêm slides bài tập và quiz
    const processSlideData = (slidesData) => {
        // Kiểm tra dữ liệu đầu vào kỹ lưỡng
        if (!slidesData) return null;

        console.log("Processing data structure:", slidesData);

        // Tạo một bản sao an toàn của dữ liệu
        const processedData = { ...slidesData };

        // Đảm bảo các thuộc tính đều là mảng, sử dụng || để cung cấp giá trị mặc định
        const slides = Array.isArray(processedData.slides) ? [...processedData.slides] : [];
        const exercises = Array.isArray(processedData.exercises) ? processedData.exercises : [];
        const quizzes = Array.isArray(processedData.quizzes) ? processedData.quizzes : [];

        // Chỉ xử lý khi có bài tập và slides không trống
        if (exercises.length > 0 && slides.length > 0) {
            exercises.forEach(exercise => {
                if (!exercise || !exercise.title) return; // Kiểm tra từng bài tập

                // Tìm vị trí slide nội dung liên quan đến bài tập
                const targetTitle = exercise.title.split(':')[0].trim();
                const targetIndex = slides.findIndex(slide =>
                    slide && slide.title && slide.title.includes(targetTitle) && slide.type === 'content'
                );

                if (targetIndex !== -1) {
                    // Thêm slide bài tập ngay sau slide nội dung
                    slides.splice(targetIndex + 1, 0, {
                        type: 'exercise',
                        title: exercise.title,
                        content: [],
                        imagePrompt: `Bài tập về ${exercise.title.split(':').pop().trim()}`,
                        exerciseId: exercises.indexOf(exercise) // Lưu ID của bài tập để tham chiếu
                    });
                }
            });
        }

        // Thêm slide quiz trước phần tổng kết nếu có quiz
        if (quizzes.length > 0 && slides.length > 0) {
            const summaryIndex = slides.findIndex(slide =>
                slide && (slide.type === 'summary' || (slide.title && slide.title.includes('Tổng kết')))
            );

            if (summaryIndex !== -1) {
                slides.splice(summaryIndex, 0, {
                    type: 'quiz',
                    title: 'Kiểm tra kiến thức',
                    content: [],
                    imagePrompt: 'Hình ảnh trắc nghiệm kiến thức'
                });
            }
        }

        // Cập nhật lại mảng slides trong dữ liệu đã xử lý
        processedData.slides = slides;
        return processedData;
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh'
            }}>
                <CircularProgress size={60} color="primary" />
                <Typography variant="h6" sx={{ mt: 3 }}>
                    Đang tải bài học...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" variant="filled">
                    {error}
                </Alert>
            </Box>
        );
    } if (!slideData) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    Không tìm thấy bài học hoặc định dạng không hợp lệ. Vui lòng thử lại sau.
                </Alert>
            </Box>
        );
    }

    // console.log("About to render KidsSlideshow with data:", slideData);
    // console.log("slideData.slides:", slideData.slides);
    // console.log("slideData structure:", Object.keys(slideData));

    // Truyền toàn bộ dữ liệu đã xử lý vào KidsSlideshow
    return <KidsSlideshow data={slideData} />;
}