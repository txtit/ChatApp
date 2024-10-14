import { Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { updateSidebarType } from "../redux/slices/app";
import { CaretLeft } from "phosphor-react";
import Msg from "./Conversation/Msg";

const StarredMessages = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        {/* header */}
        <Box sx={{
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          width: "100%",
          backgroundColor: theme.palette.mode === "Light" ? "#F8FAFF" : theme.palette.background,
        }}>
          <Stack sx={{ height: "100%", p: 2 }} direction="row" alignItems={"center"} spacing={3}>
            <IconButton onClick={() => {
              dispatch(updateSidebarType("CONTACT"));
            }}>
              <CaretLeft />
            </IconButton>
            <Typography variant="subtitle2">Starred</Typography>

          </Stack>
        </Box>
        {/* body */}
        <Stack sx={{
          height: "100%",
          position: "relative",
          flexGrow: 1,
          overflowY: "scroll"
        }}
          p={3} spacing={3} >

          <Msg />
        </Stack>
      </Stack>
    </Box>
  )
}

export default StarredMessages;