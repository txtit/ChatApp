import { Box, Stack } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles"
import { Chat_History } from "../../data";
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from "./MsgTypes";

const Msg = () => {
    const theme = useTheme();

    return (
        // <Box width={"100%"} sx={{ flexGrow: 1, backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper }}>
        <Box p={3}>
            <Stack spacing={3}>
                {Chat_History.map((el) => {
                    switch (el.type) {
                        case "divider":
                            //Timeline
                          return  <Timeline el={el}/>
                          
                        case "msg":
                            switch (el.subtype) {
                                case "img":
                                    //img msg
                                    return  <MediaMsg el={el}/>
                                case "doc":
                                    //Doc msg
                                    return <DocMsg el={el}/>

                                case "link":
                                    //Link msg
                                    return <LinkMsg el={el}/>

                                case "reply":
                                    //reply msg
                                    return <ReplyMsg el={el}/>


                                default:
                                    //text msg
                                    return <TextMsg el={el}/>
                            }
                            break;

                        default:
                            break;
                    }
                })}

            </Stack>
        </Box>


    )
}

export default Msg;