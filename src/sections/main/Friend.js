import { Dialog, DialogContent, Stack, styled, Tab, Tabs } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Badge from '@mui/material/Badge';
import { fecthFriends, fecthRequest, fecthUsers, ResetSent, showSnackBar } from "../../redux/slices/app";
import { FriendComponent, FriendRequestComponent, UserComponent } from "../../components/Friends";
import { socket } from "../../socket";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        left: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));


const UsersList = () => {
    // const sent = useSelector((state) => state.app.sent);
    const { friendsRequest = [] } = useSelector((state) => state.app);

    const dispatch = useDispatch();
    const [send, setSent] = useState(false)
    useEffect(() => {
        dispatch(fecthFriends());
        dispatch(fecthRequest());
        dispatch(fecthUsers());

    }, []);
    // let to_id;
    const { users } = useSelector((state) => state.app);

    return (
        <>
            {Array.isArray(users) ? (
                users.map((el) => (
                    <UserComponent key={el._id} {...el} />

                ))
            ) : (
                <p>No users available</p>
            )}
        </>
    );
}
const FriendsList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fecthFriends());
    }, []);

    const { friends } = useSelector((state) => state.app);
    return (
        <>
            {Array.isArray(friends) ? (
                friends.map((el) => (
                    // Render FriendComponent

                    <FriendComponent key={el._id} {...el} />
                ))

            ) : (
                <p>No friends available</p>
            )}
        </>
    );
};

const RequestFriendsList = () => {
    const dispatch = useDispatch();
    const { friendsRequest = [] } = useSelector((state) => state.app);
    console.log("danhsach", friendsRequest);
    useEffect(() => {
        console.log('Dispatching fetchRequest...');
        dispatch(fecthRequest());
    }, [dispatch]);
    const handleFetchRequest = () => {
        dispatch(fecthRequest());
    };



    return (
        <Stack>
            {Array.isArray(friendsRequest) && friendsRequest.length > 0 ? (
                friendsRequest.map((el) => (
                    <FriendRequestComponent
                        key={el._id}
                        _id={el._id}
                        firstName={el.sender.firstName}
                        lastName={el.sender.lastName}
                        img={el.sender.img}
                        online={el.sender.online}
                        fetchRequest={handleFetchRequest}
                    />
                ))
            ) : (
                <p>No friend requests available</p>
            )}
        </Stack>
    );
};

const Friends = ({ open, handleClose }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { friendsRequest = [] } = useSelector((state) => state.app);
    const { friends } = useSelector((state) => state.app);
    const { users } = useSelector((state) => state.app);

    return (
        <Dialog fullWidth maxWidth='xs' open={open} keepMounted onClose={handleClose} sx={{ p: 4 }}>
            <Stack p={2} sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleChange} centered sx={{
                    '& .MuiTab-root': {
                        minWidth: '80px', // Tăng chiều rộng
                    },
                }} >

                    <Tab
                        label={
                            <Badge badgeContent={users.length} color="primary">
                                Explore
                            </Badge>
                        }
                    />
                    <Tab
                        label={
                            <Badge badgeContent={friends.length} color="primary">
                                Friends
                            </Badge>
                        }
                    />
                    <Tab
                        label={
                            <Badge badgeContent={friendsRequest.length} color="primary">
                                Request
                            </Badge>
                        }
                    />
                </Tabs>
            </Stack>
            {/* Dialog Content */}
            <DialogContent>
                <Stack sx={{ height: "100%" }}>
                    <Stack spacing={2.5}>
                        {(() => {
                            switch (value) {
                                case 0: //display all users
                                    return <UsersList />
                                case 1: // display all friends
                                    return <FriendsList />
                                case 2: // display all friends request
                                    return <RequestFriendsList />
                                default:
                                    break;
                            }
                        })()}
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default Friends;