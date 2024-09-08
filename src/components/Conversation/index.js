import React from "react";
import { Box, Stack} from "@mui/material";
import Header from "./Header";
import Msg from "./Msg";
import Footer from "./Footer";
import { useTheme } from "@mui/material/styles"





const Conversation = () => {
    const theme = useTheme();

    return (
        <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
            {/* Chatheader */}
           <Header/>
            {/* Msg */}
            <Box width={"100%"} sx={{flexGrow: 1, height:"100%" , overflowY:"scroll", backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper}}>
                <Msg/>
            </Box>

            {/* Chatfooter */}
            <Footer/>

        </Stack>
    )
}

export default Conversation