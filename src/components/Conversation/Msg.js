import { Box, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles"
import { Chat_History } from "../../data";
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline, Timeline2 } from "./MsgTypes";
import { SimpleBarStyle } from "../Scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { AddDirectConversationsAction, AddDirectMessage, FetchCurrentMessages, fetchDirectConversationsAction, FetchUnreadConversation, RemoveAllDirectMessage, SetCurrentConversation, UpdateDirectConversations } from "../../redux/slices/coversation";
import { ResetRoomId, UpdateRoomId } from "../../redux/slices/app";

const Msg = (menu) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { conversations = [], current_messages = [], current_conversation } = useSelector((state) => state.conversation.direct_chat);
    const { room_id } = useSelector((state) => state.app);
    const user_id = window.localStorage.getItem("user_id");
    const lastTime = conversations.map((el) => {
        return el.time;
    });
    console.log("heokodjeohfishfisdfsdfsd", lastTime);
    const messagesEndRef = useRef(null);


    console.log("id", room_id);
    useEffect(() => {
        if (conversations.length === 0) {
            dispatch(ResetRoomId());
            if (current_messages.length === 0) {
                dispatch(RemoveAllDirectMessage());
            }
        }
        const current = conversations.find((el) => el?.id === room_id);


        socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
            // data => list of messages
            console.log(data, "List of messages");
            // xu li out in
            const formattedMessages = data.map((msg) => ({
                ...msg,
                outgoing: msg.from === user_id,
            }));

            const messagesWithTimeLine = addTimeLine(formattedMessages);

            dispatch(FetchCurrentMessages({ messages: messagesWithTimeLine }));


        });
        console.log("current conversation ==================", current)
        dispatch(SetCurrentConversation({ conversation: current }));
    }, [room_id, current_conversation, conversations, dispatch, user_id]);


    useEffect(() => {
        const current = conversations?.find((el) => el?.id === room_id);
        const this_current_conversation = current_conversation?.id === room_id;
        if (this_current_conversation) {

            console.log('hientai', current_conversation.unread);
        }

        // const this_conversation = 
        // Lắng nghe tin nhắn mới từ server
        socket.on("new message", (data) => {
            console.log("New message received:", data);
            console.log("current messages", current);

            // Kiểm tra nếu data chứa tin nhắn đơn lẻ
            if (data.message && current) {
                const newMessage = {
                    ...data.message,
                    outgoing: data.message.from === user_id,  // Kiểm tra tin nhắn gửi đi hay nhận
                };

                const currentConversationId = data.conversation_id;
                console.log("current messages", currentConversationId);
                const currentConversaton = conversations?.find((el) => el.id === currentConversationId);
                console.log("current conversation", currentConversaton?.unread);
                // if (current_conversations) {
                //     currentConversaton?.unread = 0;
                // }



                dispatch(AddDirectMessage({ message: newMessage }));
                dispatch(UpdateDirectConversations({ conversation: current, message: newMessage }));


                // socket.emit("start_conversations", { to: current?.user_id, from: user_id });
                socket.emit("get_direct_conversations", { user_id }, (data) => {
                    // data => list of conversations
                    console.log('API Response:', data);
                    // const currentid = data?.map((el) => el._id);
                    // const currentConversaton = conversations?.find((el) => currentid.includes(el?.id));
                    // console.log(currentid);
                    // // console.log(currentConversaton.id);
                    // // console.log(currentafter);


                    console.log("ehehehehehehduehfuhfdsf", newMessage);


                    // todo => lay id tu current conversation 


                    console.log("ccccccccccccccccccccccc", current_conversation.unread);
                    dispatch(fetchDirectConversationsAction({ conversations: data, unread: conversations }));

                    dispatch(UpdateDirectConversations({ conversation: currentConversaton ? currentConversaton : current }));
                    dispatch(FetchUnreadConversation({ conversations: data, conversation_id: currentConversationId, unread: currentConversaton?.unread }));
                    // dispatch(SetCurrentConversation({ conversation: current }))
                    console.log("ccccccccccccccccccccccc", current);

                    // dispatch(UpdateDirectConversations({ conversation: current, message: newMessage }));




                });
                console.log('Cập nhật cuộc trò chuyện với tin nhắn mới');
            } else {
                console.error("Không có tin nhắn trong data:", data);
            }
        });

        // Kiểm tra nếu cuộc trò chuyện hiện tại đã tồn tại
        // if (current) {
        //     dispatch(SetCurrentConversation(current));  // Cập nhật cuộc trò chuyện hiện tại
        // }

        // Dọn dẹp khi component unmount
        return () => {
            socket.off("new message");  // Đảm bảo rằng bạn ngừng lắng nghe khi component bị hủy
        };
    }, [room_id, conversations, current_messages, dispatch, user_id]);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [current_messages]);



    const addTimeLine = (messages) => {
        const result = [];
        let lastDate = null;
        let lastTime = null;

        messages.map((el, idx) => {
            const msgDate = new Date(el.created_at).toDateString();
            const msgTime = new Date(el.created_at).getTime();

            // Add a date divider if the date changes
            if (msgDate !== lastDate) {
                result.push({ type: "divider", text: msgDate });
                lastDate = msgDate;
                lastTime = msgTime;
            }

            // Add a time divider if the message is more than 10 minutes after the last message
            if (lastTime && (msgTime - lastTime) > 30 * 60 * 1000) { // 10 minutes in milliseconds
                const timeString = new Date(el.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                result.push({ type: "time", text: timeString });
                lastTime = msgTime; // Update lastTime to the current message's time
            }

            result.push(el); // Add the message to the result
        });

        return result;
    };



    return (
        <Box p={3} width={"100%"} sx={{ flexGrow: 1, backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper }}>

            {/* hidden scroll */}
            <SimpleBarStyle timeout={500}>

                <Stack spacing={3}>
                    {current_messages.map((el, idx) => {
                        switch (el.type) {

                            case "msg":
                                switch (el.subtype) {
                                    case "divider":
                                        return <Timeline key={idx} el={el} />
                                    case "time":
                                        return <Timeline2 key={idx} el={el} />
                                }
                            //Timeline

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
                    <div ref={messagesEndRef} />
                </Stack>
            </SimpleBarStyle>

        </Box>


    )
}

export default Msg;