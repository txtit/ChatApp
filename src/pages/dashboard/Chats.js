import { Avatar, Badge, Box, Button, Divider, IconButton, InputBase, Stack, Typography } from "@mui/material";
import { ArchiveBox, CircleDashed, FlagCheckered, MagnifyingGlass } from "phosphor-react";
import { faker } from '@faker-js/faker';

import React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles"
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { Search, SearchIconWrapper, StyledInputBase } from "../../components/Search";
import ChatElement from "../../components/ChatElement";


/*
const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.background.paper, 1),
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    left: 0,

}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, // Ensure enough space for the icon
    width: "100%",

}));
*/
const Chats = () => {
    const theme = useTheme();
    return (
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
                    <IconButton>
                        <CircleDashed />
                    </IconButton>

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
                <Stack spacing={2} direction={"column"} sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}>

                    <SimpleBarStyle timeout={500} clickOnTrack={false}>

                        <Stack spacing={2.4} >
                            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                Pinned
                            </Typography>
                            {/* // fill pinned chat */}
                            {ChatList.filter((el) => el.pinned).map((el) => {
                                return <ChatElement {...el} />

                            })}
                        </Stack>
                        <Stack spacing={2.4} >
                            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                All Chats
                            </Typography>
                            {/* // fill pinned chat */}
                            {ChatList.filter((el) => !el.pinned).map((el) => {
                                return <ChatElement {...el} />

                            })}
                        </Stack>
                    </SimpleBarStyle>

                </Stack>
            </Stack>
        </Box>
    );
};

export default Chats;