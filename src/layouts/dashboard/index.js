import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import { fecthFriends, fecthRequest, fecthUsers, ResetRoomId, ResetSent, SelectConversation, showSnackBar, UpdateRoomId, UpdateSent } from "../../redux/slices/app";
import { AddDirectConversationsAction, fetchDirectConversationsAction, RemoveAllDirectMessage, UpdateDirectConversations } from "../../redux/slices/coversation";
import { PushToAudioCallQueue, ResetAudioCallQueue, UpdateAudioCallDialog } from "../../redux/slices/audioCall";
import AudioCallDialog from "../../sections/Audio/CallDialog";
import AudioCallNotification from "../../sections/Audio/CallNotification";
import { LogoutUser } from "../../redux/slices/auth";
// fixing
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector((state) => state.conversation.direct_chat)
  const user_id = window.localStorage.getItem("user_id");
  const { room_id, this_users } = useSelector((state) => state.app);

  const { open_audio_notification_dialog, open_audio_dialog } = useSelector((state) => state.audioCall)
  // const { open_video_notification_dialog, open_video_dialog } = useSelector((state) => state.videoCall)
  const sent = useSelector((state) => state.app.sent);


  const handleCloseAudioDialog = () => {
    dispatch(UpdateAudioCallDialog({ state: false }));
  }
  // const handleCloseVideoDialog = () => {
  //   dispatch(UpdateVideoCallDialog({ state: false }));
  // }
  useEffect(() => {
    //logout when dontsee token 

    // reload when see #loaded
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + '#loaded';
          window.location.reload();
        }
      }

      window.onload();
      dispatch(fecthUsers());
      if (!this_users?.token) {
        dispatch(LogoutUser());

      }
      if (!socket) {
        connectSocket(user_id);
      }

      socket.on("audio_call_notification", (data) => {
        console.log(data)
        // TODO => dispatch an action to add this in call_queue
        dispatch(PushToAudioCallQueue(data));
      });

      socket.on("video_call_notification", (data) => {
        // TODO => dispatch an action to add this in call_queue
        // dispatch(PushToVideoCallQueue(data));
      });

      // " new_friend_request"
      socket.on("new_friend_request", (data) => {
        console.log('helo')
        dispatch(fecthRequest());
        dispatch(showSnackBar({ severity: "success", message: data.message }));
      })
      socket.on("request_accepted", (data) => {
        dispatch(fecthFriends());
        dispatch(fecthRequest());
        dispatch(fecthUsers());
        console.log('fetch request')
        dispatch(showSnackBar({ severity: "success", message: data.message }));
      })
      socket.on("request_send", (data) => {
        dispatch(fecthRequest());
        dispatch(showSnackBar({ severity: "success", message: data.message }));
        // // dispatch(showSnackBar({ severity: "success", message: data.to._id }));
        // console.log(sent)
        // const existingSent = [...sent]; // Sao chép mảng `sent`
        // if (!existingSent.some((el) => el._id === data.to._id)) {
        //   existingSent.push({ _id: data.to._id }); // Thêm phần tử mới vào mảng
        //   dispatch(UpdateSent(existingSent)); // Cập nhật Redux state
        // }

        // console.log("Updated sent:", existingSent);

      })
      socket.on("request_send_cancel", (data) => {
        dispatch(fecthRequest());
        // dispatch(showSnackBar({ severity: "success", message: data.message }));
        // // dispatch(showSnackBar({ severity: "success", message: data.to._id }));
        // console.log(sent)
        // const existingSent = [...sent]; // Sao chép mảng `sent`
        // if (existingSent.some((el) => el._id === data.to._id)) {
        //   existingSent.filter(item => item !== data.to._id); // Thêm phần tử mới vào mảng
        //   dispatch(UpdateSent(existingSent)); // Cập nhật Redux state
        // }

        // console.log("Updated sent:", existingSent);

      })
      socket.on("start_chat", (data) => {

        console.log("hehehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", data);
        // add / update to conversation list
        const existing_conversation = conversations.find((el) => el?.id === data._id);

        // console.log(existing_conversation);

        if (existing_conversation) {
          // update direct conversation 
          dispatch(UpdateDirectConversations({ conversation: data }));
        } else {
          dispatch(AddDirectConversationsAction({ conversation: data }));
        }

        dispatch(SelectConversation({ room_id: data._id }))
      })
      socket.on("delete_chat_success", () => {
        dispatch(RemoveAllDirectMessage());
        dispatch(ResetRoomId());
      })

      socket.on("new message", (data) => {
        console.log("datanek", data)
        // if (room_id === null) {
        //   dispatch(ResetRoomId);
        // }
        // Tìm cuộc trò chuyện hiện tại dựa trên ID
        const existing_conversation = conversations.find((el) => el?.id === data?.new_chat._id);
        if (room_id === null) {

          dispatch(UpdateRoomId(data.new_chat._id.toString()));
        }
        if (existing_conversation) {
          // Nếu cuộc trò chuyện đã tồn tại, cập nhật lại
          dispatch(UpdateDirectConversations({ conversation: data?.new_chat }));
        } else {
          // Nếu chưa tồn tại, thêm mới vào danh sách
          dispatch(AddDirectConversationsAction({ conversation: data?.new_chat }));
        }

        dispatch(fetchDirectConversationsAction({ conversations: data?.new_chat }));
        dispatch(UpdateDirectConversations({ conversation: existing_conversation }));


        // Chọn cuộc trò chuyện nếu cần
        if (room_id === data.new_chat._id) {
          dispatch(SelectConversation({ room_id: data._id }));
        }
      });

    }
    return () => {
      socket.off("delete_chat_success");

      socket.off("new_friend_request");
      socket.off("request_accepted");
      socket.off("request_sent");
      socket.off("start_chat");
      socket.off("new message");
      socket?.off("audio_call_notification");
    }
  }, [isLoggedIn, socket, conversations, dispatch, user_id])
  if (!isLoggedIn) {
    return <Navigate to={'auth/login'} />
  }
  return (
    <>
      <Stack direction={"row"}>
        {/* //  sidebar */}
        <SideBar />
        <Outlet />
      </Stack>
      {open_audio_notification_dialog && (<AudioCallNotification open={open_audio_notification_dialog} />)}
      {open_audio_dialog && (<AudioCallDialog open={open_audio_dialog} handleClose={handleCloseAudioDialog} />)}
    </>
  );
};

export default DashboardLayout;
