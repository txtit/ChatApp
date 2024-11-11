import { Dialog, DialogContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fecthFriends, fecthRequest, fecthUsers } from "../../redux/slices/app";
import { FriendComponent, FriendRequestComponent, UserComponent } from "../../components/Friends";

const UsersList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fecthUsers());
    }, []);
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

    useEffect(() => {
        console.log('Dispatching fetchRequest...');
        dispatch(fecthRequest());
    }, [dispatch]);


    const { friendsRequest = [] } = useSelector((state) => state.app);
    console.log("danhsach", friendsRequest);

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

    return (
        <Dialog fullWidth maxWidth='xs' open={open} keepMounted onClose={handleClose} sx={{ p: 4 }}>
            <Stack p={2} sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleChange} centered >
                    <Tab label="Explore" />
                    <Tab label="Friends" />
                    <Tab label="Request" />
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