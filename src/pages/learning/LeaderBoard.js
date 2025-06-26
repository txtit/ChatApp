import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Avatar, Chip } from '@mui/material';
import { EmojiEvents, School, MilitaryTech } from '@mui/icons-material';
import React from 'react';
import { styled } from '@mui/system';
const Leaderboard = () => {
    const rankings = [
        { rank: 1, name: "Nguyễn Văn A", class: "5A", xp: 2450, avatar: "/avatar1.jpg" },
        { rank: 2, name: "Trần Thị B", class: "5B", xp: 2300, avatar: "/avatar2.jpg" },
        { rank: 3, name: "Lê Văn C", class: "5A", xp: 2100, avatar: "/avatar3.jpg" },
        { rank: 4, name: "Phạm Thị D", class: "5C", xp: 1950, avatar: "/avatar4.jpg" }
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Bảng xếp hạng</Typography>

            <Box sx={{ mb: 3 }}>
                <Chip label="Tuần này" sx={{ mr: 1 }} />
                <Chip label="Tháng này" variant="outlined" sx={{ mr: 1 }} />
                <Chip label="Toàn trường" variant="outlined" />
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Hạng</TableCell>
                        <TableCell>Học sinh</TableCell>
                        <TableCell align="right">Điểm XP</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rankings.map((row) => (
                        <TableRow key={row.rank} hover>
                            <TableCell>
                                {row.rank <= 3 ? (
                                    <MilitaryTech color={row.rank === 1 ? "gold" : row.rank === 2 ? "silver" : "bronze"} />
                                ) : (
                                    row.rank
                                )}
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={row.avatar} sx={{ mr: 2 }} />
                                    <Box>
                                        <Typography>{row.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">Lớp {row.class}</Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                <Chip label={row.xp} icon={<School />} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Danh hiệu của bạn</Typography>
                {/* Hiển thị danh hiệu */}
            </Box>
        </Box>
    );
};

export default Leaderboard;