import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { setProgress } from '../redux/slices/progress';

const SimpleProgressAdder = () => {
    const dispatch = useDispatch();

    const addSampleProgress = () => {
        // Thêm một số progress data mẫu
        dispatch(setProgress({ courseId: 'slide_demo_001', percent: 85 }));
        dispatch(setProgress({ courseId: 'slide_demo_002', percent: 92 }));
        dispatch(setProgress({ courseId: 'slide_demo_003', percent: 76 }));
        dispatch(setProgress({ courseId: 'slide_demo_004', percent: 100 }));
        dispatch(setProgress({ courseId: 'slide_demo_005', percent: 45 }));
    };

    const addMoreProgress = () => {
        // Thêm dữ liệu giống như bạn đang thấy
        dispatch(setProgress({ courseId: 'slide_683ab45a2651632e975a79c7_1(pin)', percent: 19 }));
        dispatch(setProgress({ courseId: 'slide_683ebed2bdec0e1529eec4a0_1(pin)', percent: 7 }));
        dispatch(setProgress({ courseId: 'slide_683ab3a52651632e975a79c2_1(pin)', percent: 6 }));
        dispatch(setProgress({ courseId: 'slide_6842d4d4b6e6e6ee5dba1ac7_1(pin)', percent: 7 }));
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    ➕ Thêm dữ liệu tiến trình mẫu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Thêm dữ liệu mẫu vào simple progress object
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={addSampleProgress}
                    >
                        Thêm tiến trình demo
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={addMoreProgress}
                    >
                        Thêm dữ liệu hiện tại của bạn
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SimpleProgressAdder;
