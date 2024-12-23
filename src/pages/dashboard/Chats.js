import { Avatar, Badge, Box, Button, Divider, IconButton, InputBase, Stack, Typography } from "@mui/material";
import { ArchiveBox, CircleDashed, FlagCheckered, MagnifyingGlass, Users } from "phosphor-react";
import { faker } from '@faker-js/faker';

import React, { useEffect, useState } from "react";
import { styled, alpha, useTheme } from "@mui/material/styles"
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { Search, SearchIconWrapper, StyledInputBase } from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friend";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { AddDirectMessage, FetchDirectConversations, fetchDirectConversationsAction, FetchUnreadConversation, RemoveAllDirectMessage, UpdateDirectConversations } from "../../redux/slices/coversation";
import { ResetRoomId, SelectConversation, UpdateRoomId } from "../../redux/slices/app";


const user_id = window.localStorage.getItem("user_id");
const Chats = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const { room_id } = useSelector((state) => state.app);
    const { friendsRequest, this_users } = useSelector((state) => state.app);

    const theme = useTheme();
    const { conversations = [], current_messages = [] } = useSelector((state) => state.conversation?.direct_chat || {});



    useEffect(() => {
        if (conversations.length === 0) {
            dispatch(ResetRoomId());
            if (current_messages.length === 0) {
                dispatch(RemoveAllDirectMessage());
            }
        }

        socket.emit("get_direct_conversations", { user_id }, (data) => {
            // data => list of conversations
            console.log('API Response:', data);
            const delettion = data?.map((el) => { return el.delettion });
            console.log(delettion)
            const fromValues = data
                .map((item) =>
                    item.delettion?.map((del) => del.from) || [] // Kiểm tra `delettion` trước
                )
                .flat();

            console.log(fromValues);
            console.log(user_id);
            const messasge = data?.map((el) => { return el.messages.length });
            console.log(messasge)

            if (fromValues === user_id) {
                dispatch(RemoveAllDirectMessage);
                console.log("clean")
            } else {
                if (data.length === 0 || messasge.length === 0) {
                    console.log("notclean")

                    dispatch(fetchDirectConversationsAction({ conversations: data }));
                   
                }
            }
        });
    }, [dispatch]);

    useEffect(() => {
        socket.on("new message", (data) => {
            // if (conversations.length === 0) {
            //     dispatch(ResetRoomId());
            //     dispatch(RemoveAllDirectMessage());
            // }
            const roomid = conversations.map((el) => { return el.id });
            console.log("idneeeeeeeeeeeee", roomid);
            if (room_id === null) {

                dispatch(UpdateRoomId(roomid));
            }
            const current = conversations.find((el) => el?.id === room_id);
            console.log("cuuruurrurururururur", conversations);

            if (data.message) {
                const newMessage = {
                    ...data.message,
                    outgoing: data.message.from === user_id,  // Kiểm tra tin nhắn gửi đi hay nhận
                };


                socket.emit("get_direct_conversations", { user_id }, (data) => {
                    // data => list of conversations
                    console.log('API Response:', data);
                    dispatch(fetchDirectConversationsAction({ conversations: data }));
                    // dispatch(FetchUnreadConversation({ conversation: current }));

                    dispatch(UpdateDirectConversations({ conversation: current, message: newMessage }));


                });

                dispatch(AddDirectMessage({ message: newMessage }));
                dispatch(UpdateDirectConversations({ conversation: current, message: newMessage }));
            }
        })
    }, [dispatch]);
    // useEffect(() => {
    //     socket.on("delete_chat_success", () => {
    //         // if (conversations.length === 0) {
    //         //     dispatch(ResetRoomId());
    //         //     dispatch(RemoveAllDirectMessage());
    //         // }
    //         const roomid = conversations.map((el) => { return el.id });
    //         console.log("idneeeeeeeeeeeee", roomid);
    //         if (room_id === null) {

    //             dispatch(UpdateRoomId({ roomid }));
    //         }
    //         const current = conversations.find((el) => el?.id === room_id);
    //         console.log("cuuruurrurururururur", conversations);



    //         socket.emit("get_direct_conversations", { user_id }, (data) => {
    //             // data => list of conversations
    //             console.log('API Response:', data);
    //             dispatch(fetchDirectConversationsAction({ conversations: data }));
    //             // dispatch(FetchUnreadConversation({ conversation: current }));

    //             dispatch(UpdateDirectConversations({ conversation: current }));


    //         });

    //     })
    // }, [dispatch]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    return (
        <>
            <Box sx={{
                position: "relative",
                width: 320,
                backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper,
                boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            }}

            >
                <Stack p={3} spacing={2} sx={{ height: "100vh" }}>

                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography variant="h8" noWrap
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}>
                            {this_users?.firstName} {this_users?.lastName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems={"center"} >
                            <IconButton onClick={() => {
                                handleOpenDialog()
                            }}>
                                <Badge anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }} badgeContent={friendsRequest?.length} color="primary">
                                    <Users color="action" />
                                </Badge>
                                <Users />
                            </IconButton>
                            <IconButton>
                                <CircleDashed />
                            </IconButton>
                        </Stack>

                    </Stack>
                    <Stack sx={{ width: "100%" }} >
                        <Search>
                            <SearchIconWrapper>
                                <MagnifyingGlass color="#709CE6" />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Search..." inputProps={{ "aria-label": "search" }} />
                        </Search>

                    </Stack>
                    <Stack spacing={1}>
                        <Stack direction={"row"} alignItems={"center"} spacing={1.5}>

                            <ArchiveBox size={24} />
                            <Button>
                                Archive
                            </Button>
                        </Stack>
                        <Divider />
                    </Stack>
                    <Stack spacing={2} direction={"column"} sx={{ flexGrow: 1, overflowY: "auto", height: "100%" }}>

                        <SimpleBarStyle timeout={500} clickOnTrack={false}>

                            <Stack spacing={1} >
                                {/* <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                        Pinned
                                    </Typography> */}
                                {/* // fill pinned chat */}
                                {/* {ChatList.filter((el) => el.pinned).map((el) => {
                                        return <ChatElement {...el} />

                                    })}  */}
                                {/* </Stack>
                                <Stack spacing={2.4} > */}
                                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                    All Chats
                                </Typography>
                                {/* // fill pinned chat */}
                                {conversations && current_messages.length > 0 && conversations.length > 0 ? (

                                    conversations.filter((el) => el && !el.pinned).map((el) => {
                                        return <ChatElement key={el._id} {...el} />

                                    })
                                ) : (
                                    <Typography variant="body2" sx={{ color: "#676767" }}>
                                        No conversations available
                                    </Typography>
                                )}

                            </Stack>
                        </SimpleBarStyle>

                    </Stack>
                </Stack>
            </Box>
            {openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}
        </>
    );
};

export default Chats;