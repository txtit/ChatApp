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
import { FetchDirectConversations, fetchDirectConversationsAction } from "../../redux/slices/coversation";
import { ResetRoomId } from "../../redux/slices/app";


const user_id = window.localStorage.getItem("user_id");
const Chats = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();

    const { conversations = [] } = useSelector((state) => state.conversation?.direct_chat || {});
    useEffect(() => {
        dispatch(ResetRoomId());

        socket.emit("get_direct_conversations", { user_id }, (data) => {
            // data => list of conversations
            console.log('API Response:', data);
            dispatch(fetchDirectConversationsAction({ conversations: data }));
        });
    }, [dispatch]);

    console.log('conversation', conversations);

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
                        <Typography variant="h5">
                            Chats
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems={"center"} >
                            <IconButton onClick={() => {
                                handleOpenDialog()
                            }}>
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

                            <Stack spacing={2.4} >
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
                                {conversations && conversations.length > 0 ? (

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