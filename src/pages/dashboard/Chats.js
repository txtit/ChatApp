import { Box, IconButton, Stack, styled, Typography } from "@mui/material";
import { CircleDashed } from "phosphor-react";
import React from "react";
const Search = styled("div"(({theme})))
const Chats = () => {
    return (
        <Box sx={{
            position: "relative",
            height: "100vh",
            width: 320,
            backgroundColor: "#F8FAFF",
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}

        >
            <Stack p={3}>

            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Typography variant="h5">
                    Chats
                </Typography>
                <IconButton>
                    <CircleDashed />
                </IconButton>
            </Stack>
            </Stack>
        </Box>
    );
};

export default Chats;