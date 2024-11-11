import { Box, Stack } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles"
import { Chat_History } from "../../data";
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from "./MsgTypes";
import { SimpleBarStyle } from "../Scrollbar";

const Msg = (menu) => {
    const theme = useTheme();

    return (
        <Box p={3} width={"100%"} sx={{ flexGrow: 1, backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper }}>

            {/* hidden scroll */}
            <SimpleBarStyle timeout={500}>

                <Stack spacing={3}>
                    {Chat_History.map((el, idx) => {
                        switch (el.type) {
                            case "divider":
                                //Timeline
                                return <Timeline key={idx} el={el} />

                            case "msg":
                                switch (el.subtype) {
                                    case "img":
                                        //img msg
                                        return <MediaMsg key={idx} el={el} menu={menu} />
                                    case "doc":
                                        //Doc msg
                                        return <DocMsg key={idx} el={el} menu={menu} />

                                    case "link":
                                        //Link msg
                                        return <LinkMsg key={idx} el={el} menu={menu} />

                                    case "reply":
                                        //reply msg
                                        return <ReplyMsg key={idx} el={el} menu={menu} />


                                    default:
                                        //text msg
                                        return <TextMsg key={idx} el={el} menu={menu} />
                                }


                            default:
                                return null;
                        }
                    })}

                </Stack>
            </SimpleBarStyle>

        </Box>


    )
}

export default Msg;