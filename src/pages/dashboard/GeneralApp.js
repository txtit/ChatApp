// import React, { Suspense, lazy } from "react";
import Chats from "./Chats";
import { Box, Stack, Typography } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import SharredMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import NoChat from "../../assets/Illustration/NoChat";


// dynamic import
// const Cat = lazy(() => import("../../components/Cat"));

const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar, room_id, chat_type } = useSelector((state) => state.app);
  // console(sidebar)
  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>

      {/* Chat  */}
      <Chats />
      <Box sx={{ height: "100%", width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)", backgroundColor: theme.palette.mode === "light" ? "#F0F4FA" : theme.palette.background.paper, }}>
        {/* Conversation */}
        {chat_type === 'individual' && room_id !== null ? (<Conversation />) : (
          <Stack spacing={2} sx={{ height: "100%", width: "100%" }} justifyContent={"center"} alignItems={"center"}>
            <NoChat />
            <Typography>Select a Conversation or start a new Chat</Typography>
          </Stack>)}
      </Box>

      {/* Contact*/}
      {sidebar.open && (() => {
        switch (sidebar.type) {
          case "CONTACT":
            return <Contact />
          case "STARRED":
            return <StarredMessages />
          case "SHARED":
            return <SharredMessages />

          default:
            break;

        }
      })()}


    </Stack>
  );
};

export default GeneralApp;
