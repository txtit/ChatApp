import { Box, Typography, Avatar, Button, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import { PersonAdd, People, PersonRemove, HowToReg } from '@mui/icons-material';
import React from 'react';
const FriendSystem = () => {
    const [tabValue, setTabValue] = React.useState(0);

    // Mock data
    const friendRequests = [
        { id: 1, name: "Nguyễn Thị B", class: "5A", avatar: "/avatar1.jpg" },
        { id: 2, name: "Trần Văn C", class: "5B", avatar: "/avatar2.jpg" }
    ];

    const friends = [
        { id: 3, name: "Lê Thị D", class: "5A", avatar: "/avatar3.jpg", mutual: 4 },
        { id: 4, name: "Phạm Văn E", class: "5C", avatar: "/avatar4.jpg", mutual: 2 }
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Kết nối bạn bè</Typography>

            <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)}>
                <Tab icon={<PersonAdd />} label="Lời mời" />
                <Tab icon={<People />} label="Bạn bè" />
                <Tab icon={<HowToReg />} label="Đã gửi" />
            </Tabs>

            {tabValue === 0 && (
                <List sx={{ mt: 2 }}>
                    {friendRequests.map((request) => (
                        <ListItem key={request.id} secondaryAction={
                            <Box>
                                <Button variant="contained" size="small" sx={{ mr: 1 }}>Chấp nhận</Button>
                                <Button variant="outlined" size="small">Từ chối</Button>
                            </Box>
                        }>
                            <ListItemAvatar>
                                <Avatar src={request.avatar} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={request.name}
                                secondary={`Lớp ${request.class}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            {tabValue === 1 && (
                <List sx={{ mt: 2 }}>
                    {friends.map((friend) => (
                        <React.Fragment key={friend.id}>
                            <ListItem secondaryAction={
                                <Button variant="outlined" startIcon={<PersonRemove />}>Huỷ kết bạn</Button>
                            }>
                                <ListItemAvatar>
                                    <Avatar src={friend.avatar} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={friend.name}
                                    secondary={`${friend.mutual} bạn chung • Lớp ${friend.class}`}
                                />
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}

            {tabValue === 2 && (
                <Typography sx={{ mt: 3 }}>Danh sách lời mời đã gửi</Typography>
            )}
        </Box>
    );
};

export default FriendSystem;