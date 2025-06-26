import { CaretLeft, FileX } from 'phosphor-react'
import React from 'react'
import ProfileForm from '../../sections/settings/ProfileForm'
import { useSelector } from 'react-redux'
import { Box, Avatar, Typography, Button, Tabs, Tab, Paper } from '@mui/material';
import { School, Stars, People, Book, Games } from '@mui/icons-material';
import BangThanhTichDayDu from '../../components/FullProgressDisplay';
import ProgressDemo from '../../components/ProgressDemo';
import ProgressTester from '../../components/ProgressTester';
import ReduxDebugger from '../../components/ReduxDebugger';
import SimpleProgressAdder from '../../components/SimpleProgressAdder';

const Profile = () => {
    const [tabValue, setTabValue] = React.useState(0);

    return (
        <Box sx={{ p: 3, width: '100%', backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
            <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar sx={{ width: 100, height: 100, border: '4px solid white' }} />
                    <Box sx={{ ml: 3 }}>
                        <Typography variant="h4">Nguyễn Văn A</Typography>
                        <Typography>Lớp 5A - Trường Tiểu học ABC</Typography>
                        <Button variant="contained" sx={{ mt: 1 }}>Chỉnh sửa hồ sơ</Button>
                    </Box>
                </Box>
            </Paper>
            <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)}>
                <Tab icon={<School />} label="Thành tích" />
                {/* <Tab icon={<People />} label="Debug Redux" /> */}
                <Tab icon={<Stars />} label="Huy hiệu" />
            </Tabs>{tabValue === 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" gutterBottom>Bảng thành tích</Typography>
                    {/* <ProgressTester /> */}
                    <BangThanhTichDayDu />
                </Box>
            )}            {tabValue === 1 && (
                <Box sx={{ mt: 3 }}>
                    <SimpleProgressAdder />
                    {/* <ReduxDebugger /> */}
                </Box>
            )}

            {tabValue === 2 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" gutterBottom>Bộ sưu tập huy hiệu</Typography>
                    {/* Các huy hiệu */}
                </Box>
            )}
        </Box>
    );
};

export default Profile