import { Badge, Typography, Box, Stack, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import { styled } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { useDispatch, useSelector } from "react-redux";
import { ResetRoomId, SelectConversation } from "../redux/slices/app";
import { SetCurrentConversation } from "../redux/slices/coversation";

const ChatElement = ({ img, name, msg, time, unread, online, id }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { conversations = [] } = useSelector((state) => state.conversation.direct_chat);

    // console.log("idelement", id);
    const current = conversations.find((el) => el?.id === id);
    console.log(current)

    return (
        <Box
            onClick={() => {

                dispatch(SelectConversation({ room_id: id }));
                // dispatch(SetCurrentConversation({ current_conversation: current }));
            }}
            sx={{
                width: "100%",
                borderRadius: 1,
                backgroundColor: theme.palette.mode === "light" ? "#fff" : theme.palette.background.default,
            }} p={2} >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Stack direction={"row"} spacing={2}>
                    {online ? <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">

                        <Avatar alt={name} src={img} />
                    </StyledBadge> : <Avatar alt={name} src={img} />
                    }
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2" >
                            {name}
                        </Typography>
                        <Typography variant="caption" >
                            {typeof msg === "string" ? msg : JSON.stringify(msg)}
                        </Typography>
                    </Stack>

                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    <Typography sx={{ fontWeight: 600 }} variant="caption">
                        {time}
                    </Typography>
                    <Badge color="primary" badgeContent={unread}>

                    </Badge>
                </Stack>

            </Stack>

        </Box>
    )
}

export default ChatElement;