import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material';
import { Comment, Report, Block, CheckCircle } from '@mui/icons-material';
import React from 'react';
const ContentModeration = () => {
    const reports = [
        { id: 1, content: "Từ ngữ không phù hợp", type: "Bình luận", reporter: "Nguyễn Văn A" },
        { id: 2, content: "Ảnh không đúng nội dung", type: "Bài đăng", reporter: "Trần Thị B" }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Report color="error" sx={{ mr: 1 }} /> Kiểm duyệt nội dung
            </Typography>

            <Card>
                <CardContent>
                    <List>
                        {reports.map((report) => (
                            <React.Fragment key={report.id}>
                                <ListItem
                                    secondaryAction={
                                        <Box>
                                            <Button size="small" color="error" startIcon={<Block />} sx={{ mr: 1 }}>
                                                Xóa
                                            </Button>
                                            <Button size="small" color="success" startIcon={<CheckCircle />}>
                                                Duyệt
                                            </Button>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={report.content}
                                        secondary={`${report.type} • Báo cáo bởi: ${report.reporter}`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ContentModeration;