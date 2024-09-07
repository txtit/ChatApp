import React, { Suspense, lazy } from "react";
import Chats from "./Chats";
import { Box, Stack } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";

// dynamic import
const Cat = lazy(() => import("../../components/Cat"));

const GeneralApp = () => {
const theme = useTheme();
  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>

      {/* Chat  */}
      <Chats />
      <Box sx={{ height: "100%", width: "calc(100vw - 420px)", backgroundColor: "#fff" }}>
        {/* Conversation */}
        <Conversation />
      </Box>
    </Stack>
  );
};

export default GeneralApp;
