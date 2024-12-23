import React, { useState } from "react";

import { faker } from "@faker-js/faker";
import {
    Avatar, Box, Divider, Fade, IconButton, Menu, MenuItem, Stack, Typography, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles"
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import StyledBadge from "../StyledBadge";

import { toggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import { RemoveAllDirectMessage } from "../../redux/slices/coversation";
import { StartAudioCall } from "../../redux/slices/audioCall";
import { socket } from "../../socket";

const Conversation_Menu = [
    {
        title: "Contact info",
    },
    {
        title: "Mute notifications",
    },
    {
        title: "Clear messages",
    },
    {
        title: "Delete chat",
    },
];
const BlockDialog = ({ open, handleClose }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Block this contact</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you want to block this Contact?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancle</Button>
                <Button onClick={handleClose}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
};
const DeleteDialog = ({ open, handleClose, handleDeleteChat }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Delete this chat</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you want to Delete this Contact?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancle</Button>
                <Button onClick={handleDeleteChat}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
};
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const user_id = window.localStorage.getItem("user_id");

const Header = () => {
    const theme = useTheme();
    const { conversations = [], current_messages = [], current_conversation } = useSelector((state) => state.conversation?.direct_chat || {});
    const { room_id } = useSelector((state) => state.app);
    // dispatch(RemoveAllDirectMessage());


    const current = conversations.find((el) => el?.id === room_id);
    console.log("teennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", current?.user_id);
    const dispatch = useDispatch();

    const [openBlock, setOpenBlock] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleCloseBlock = () => {
        setOpenBlock(false);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleDeleteChat = () => {
        console.log("Delete")
        socket.emit("delete_conversations", { to: current?.user_id, from: user_id });
        dispatch(RemoveAllDirectMessage);
        socket.on("delete_chat_success");
    }

    const [conversationMenuAnchorEl, setConversationMenuAnchorEl] =
        React.useState(null);
    const openConversationMenu = Boolean(conversationMenuAnchorEl);
    const handleClickConversationMenu = (event) => {
        setConversationMenuAnchorEl(event.currentTarget);
    };
    const handleCloseConversationMenu = (title) => {
        console.log(title.title)
        switch (title.title) {
            case "Contact info":
                setOpenDelete(true)
                break;

            default:
                break;
        }

        setConversationMenuAnchorEl(null);
    };


    return (
        <Box
            p={2}
            sx={{
                width: "100%", backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper, boxShadow: "0px 0px 2px rgba(0,0,0,0.25)"

            }}
        >
            <Stack alignItems={"center"} direction={"row"} justifyContent={"space-between"} sx={{ width: "100%", height: "100%" }} >
                <Stack onClick={() => {
                    dispatch(toggleSidebar());
                }} direction={"row"} spacing={2}>
                    <Box>
                        <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">

                            <Avatar src={faker.image.cats()} />
                        </StyledBadge>

                    </Box>
                    <Stack spacing={0.2}>
                        <Typography variant="subtitle2">{current ? current.name : ""}</Typography>
                        <Typography variant="caption" >{current ? (current.online ? "Online" : "Offline") : ""}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={3}>
                    <IconButton>
                        <VideoCamera />
                    </IconButton>
                    <IconButton onClick={() => {
                        console.log("Phone");
                        dispatch(StartAudioCall(current_conversation.user_id));
                    }}>
                        <Phone />
                    </IconButton>
                    <IconButton>
                        <MagnifyingGlass />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton
                        id="conversation-positioned-button"
                        aria-controls={
                            openConversationMenu ? "conversation-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openConversationMenu ? "true" : undefined}
                        onClick={handleClickConversationMenu}

                    >
                        <CaretDown />
                    </IconButton>
                    <Menu
                        MenuListProps={{
                            "aria-labelledby": "fade-button",
                        }}
                        TransitionComponent={Fade}
                        id="conversation-positioned-menu"
                        aria-labelledby="conversation-positioned-button"
                        anchorEl={conversationMenuAnchorEl}
                        open={openConversationMenu}
                        onClose={handleCloseConversationMenu}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <Box p={1}>
                            <Stack spacing={1}>
                                {Conversation_Menu.map((el) => (
                                    <MenuItem onClick={() => handleCloseConversationMenu(el)}>
                                        <Stack
                                            sx={{ minWidth: 100 }}
                                            direction="row"
                                            alignItems={"center"}
                                            justifyContent="space-between"
                                        >
                                            <span>{el.title}</span>
                                        </Stack>{" "}
                                    </MenuItem>
                                ))}
                            </Stack>
                        </Box>
                    </Menu>
                </Stack>
            </Stack>
            {openBlock && (
                <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
            )}
            {openDelete && (
                <DeleteDialog open={openDelete} handleClose={handleCloseDelete} handleDeleteChat={handleDeleteChat} />
            )}
        </Box>
    )
}

export default Header
