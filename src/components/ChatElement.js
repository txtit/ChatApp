import { Badge, Typography, Box, Stack, Avatar } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
// import { styled } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { useDispatch, useSelector } from "react-redux";
import { ResetRoomId, SelectConversation } from "../redux/slices/app";
import { fetchDirectConversationsAction, FetchUnreadConversation, SetCurrentConversation, UpdateDirectConversations } from "../redux/slices/coversation";
import { socket } from "../socket";

const ChatElement = ({ img, name, msg, time, unread, online, id }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { conversations = [], current_messages = [], current_conversation } = useSelector((state) => state.conversation.direct_chat);
    const { room_id } = useSelector((state) => state.app);
    const user_id = window.localStorage.getItem("user_id");
    const current = conversations?.find((el) => el?.id === id);
    const current2 = current_conversation?.id === id;

    console.log(current)
    // console.log("idelement", id);
    const BoldTypography = styled(Typography)(({ theme }) => ({
        fontWeight: current2 ? 700 : 350,
    }));
    const handleRightClick = (event) => {
        event.preventDefault(); // Ngăn menu chuột phải mặc định
        console.log("Right-clicked on box!");
    };

    return (
        <Box
            onContextMenu={handleRightClick}
            onClick={() => {
                // 1. Cập nhật cuộc trò chuyện hiện tại
                dispatch(SelectConversation({ room_id: id }));
                console.log("Đã chọn cuộc trò chuyện:", id);

                // 2. Lấy thông tin cuộc trò chuyện hiện tại từ danh sách
                const current = conversations?.find((el) => el?.id === id);
                console.log("Cuộc trò chuyện hiện tại:", current);

                // 3. Gửi yêu cầu lấy danh sách cuộc trò chuyện qua socket
                socket.emit("get_direct_conversations", { user_id }, (data) => {
                    console.log("Danh sách từ server:", data);

                    if (!current) {
                        console.warn("Không tìm thấy cuộc trò chuyện hiện tại!");
                        return;
                    }

                    // 4. Dispatch hành động để cập nhật Redux
                    dispatch(UpdateDirectConversations({ conversation: current }));
                    console.log("Cập nhật trạng thái cuộc trò chuyện:", current);

                    // 5. Cập nhật trạng thái chưa đọc
                    dispatch(
                        FetchUnreadConversation({
                            conversations: data,
                            conversation_id: current?.id,
                            unread: -1,
                        })
                    );

                    console.log("Cập nhật số lượng chưa đọc về 0 cho cuộc trò chuyện:", current?.id);
                });
            }}

            sx={{
                width: "100%",
                borderRadius: 1,
                backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : current2 ? theme.palette.background.default : theme.palette.background.paper,
            }} p={2} >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Stack direction={"row"} spacing={2}>
                    {online ? <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">

                        <Avatar alt={name} src={img} />
                    </StyledBadge> : <Avatar alt={name} src={img} />
                    }
                    <Stack spacing={0.3} >
                        <BoldTypography variant="subtitle2"  >
                            {name}
                        </BoldTypography>
                        <BoldTypography variant="caption" >
                            {typeof msg === "string" ? msg : JSON.stringify(msg)}
                        </BoldTypography>
                    </Stack>

                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    <BoldTypography variant="caption" >
                        {time}
                    </BoldTypography>
                    <Badge color="primary" badgeContent={unread}>

                    </Badge>
                </Stack>

            </Stack>

        </Box >
    )
}

export default ChatElement;