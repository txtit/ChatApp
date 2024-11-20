import React from "react";

import { faker } from "@faker-js/faker";
import { Avatar, Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles"
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import StyledBadge from "../StyledBadge";

import { toggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import { RemoveAllDirectMessage } from "../../redux/slices/coversation";
const Header = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { conversations = [], current_messages = [] } = useSelector((state) => state.conversation?.direct_chat || {});
    const { room_id } = useSelector((state) => state.app);
    // dispatch(RemoveAllDirectMessage());


    const current = conversations.find((el) => el?.id === room_id);
    // console.log("teennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", current.online);

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
                    <IconButton>
                        <Phone />
                    </IconButton>
                    <IconButton>
                        <MagnifyingGlass />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton>
                        <CaretDown />
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    )
}

export default Header
