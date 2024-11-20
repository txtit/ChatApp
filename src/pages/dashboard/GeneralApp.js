// import React, { Suspense, lazy } from "react";
import Chats from "./Chats";
import { Box, Stack, Typography } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact";
import { useDispatch, useSelector } from "react-redux";
import SharredMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import NoChat from "../../assets/Illustration/NoChat";
import { ResetRoomId } from "../../redux/slices/app";
import { useEffect } from "react";
import { RemoveAllDirectMessage, UpdateDirectConversations } from "../../redux/slices/coversation";
import { socket } from "../../socket";


const GeneralApp = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { sidebar, room_id, chat_type } = useSelector((state) => state.app);

  // useEffect(() => {
  //   // Lắng nghe sự kiện "new_message" từ socket
  //   socket.on("new_message", (messageData) => {
  //     // Kiểm tra nếu tin nhắn thuộc room hiện tại, thì cập nhật nội dung hội thoại
  //     if (messageData.room_id === room_id) {
  //       dispatch(UpdateDirectConversations(messageData)); // Giả sử updateConversation sẽ cập nhật Redux store với tin nhắn mới
  //     } else {
  //       // Nếu room_id chưa tồn tại, có thể tự động tạo room mới
  //       dispatch(UpdateDirectConversations(messageData));
  //     }
  //   });

  //   // Dọn dẹp sự kiện socket khi component bị hủy
  //   return () => {
  //     socket.off("new_message");
  //   };
  // }, [room_id, dispatch]);
  return (

    <Stack direction={"row"} sx={{ width: "100%" }}>

      {/* Chat  */}
      <Chats />
      <Box sx={{ height: "100%", width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)", backgroundColor: theme.palette.mode === "light" ? "#F0F4FA" : theme.palette.background.paper, }}>
        {/* Conversation */}

        {chat_type === 'individual' && room_id !== null ? <Conversation /> :
          <Stack spacing={2} sx={{ height: "100%", width: "100%" }} justifyContent={"center"} alignItems={"center"}>
            <NoChat />
            <Typography>Select a Conversation or start a new Chat</Typography>
          </Stack>}
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
