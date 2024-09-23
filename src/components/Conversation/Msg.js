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
                    {Chat_History.map((el) => {
                        switch (el.type) {
                            case "divider":
                                //Timeline
                                return <Timeline el={el} />

                            case "msg":
                                switch (el.subtype) {
                                    case "img":
                                        //img msg
                                        return <MediaMsg el={el} menu={menu} />
                                    case "doc":
                                        //Doc msg
                                        return <DocMsg el={el} menu={menu} />

                                    case "link":
                                        //Link msg
                                        return <LinkMsg el={el} menu={menu} />

                                    case "reply":
                                        //reply msg
                                        return <ReplyMsg el={el} menu={menu} />


                                    default:
                                        //text msg
                                        return <TextMsg el={el} menu={menu} />
                                }


                            default:
                                break;
                        }
                    })}

                </Stack>
            </SimpleBarStyle>

        </Box>


    )
}

export default Msg;