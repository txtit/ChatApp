import { faker } from "@faker-js/faker";
import { createSlice } from "@reduxjs/toolkit";

const user_id = window.localStorage.getItem("user_id");

const initialState = {
    direct_chat: {
        conversations: [],
        current_conversation: null,
        current_messages: [],
    },
    group_chats: {},
};

const slice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        // fetchDirectConversations(state, action) {

        //     const list = action.payload.conversations.map((el) => {


        //         // Kiểm tra nếu không có participants
        //         if (!el.participants || el.participants.length === 0) {
        //             console.log("Không tìm thấy participants cho cuộc trò chuyện với ID:", el._id);
        //             return null;
        //         }
        //         // console.log('participant:', el.participants);


        //         // Tìm người dùng khác không phải chính mình
        //         const this_user = el.participants.find(
        //             (elm) => elm._id.toString() !== user_id
        //         );

        //         // Nếu không tìm thấy người dùng khác
        //         if (!this_user) {
        //             console.log(`Không tìm thấy người dùng khác trong participants cho cuộc trò chuyện với ID: ${el._id}`);
        //             return null;
        //         } else {
        //             console.log(`Không tìm thấy người dùng khác trong participants cho cuộc trò chuyện với ID: ${el._id}`);

        //         }



        //         // Trả về cuộc trò chuyện
        //         return {
        //             id: el._id,
        //             user_id: this_user._id,
        //             name: `${this_user.firstName} ${this_user.lastName}`,
        //             online: this_user.status === "Online",
        //             img: faker.animal.cat(),
        //             msg: faker.music.songName(),
        //             time: '12:02',
        //             unread: 0,
        //             pinned: false
        //         };
        //     }).filter(Boolean); // Lọc bỏ giá trị null
        //     console.log("trotruyen", list);
        //     state.direct_chat.conversations = list.length > 0 ? list : [];
        // },
        // updateDirectConversation(state, action) {
        //     const this_conversation = action.payload.conversation;
        //     console.log(this_conversation);
        //     state.direct_chat.conversations = state.direct_chat.conversations.map((el) => {
        //         console.log("el", el.id);
        //         if (el?.id !== this_conversation._id) {
        //             return el;
        //         } else {
        //             const user = this_conversation.participants.find((elm) => elm._id.toString() !== user_id);
        //             return {
        //                 to: this_conversation._id,
        //                 user_id: user?._id,
        //                 name: `${user?.firstName} ${user?.lastName}`,
        //                 online: user?.status === "Online",
        //                 img: faker.animal.cat(),
        //                 msg: "hehehehehe",
        //                 time: "9:36",
        //                 unread: 0,
        //                 pinned: false,
        //             };
        //         }
        //     })
        //     console.log(state.direct_chat.conversations);
        // },

        fetchDirectConversations(state, action) {

            console.log("fetch =========================")
            console.log(action.payload.unread);
            // const listConversation = action.payload.unread;
            const list = action.payload.conversations.map((el) => {
                if (!el.participants || el.participants.length === 0) {
                    console.log("Không tìm thấy participants cho cuộc trò chuyện với ID:", el._id);
                    return null;
                }

                const this_user = el.participants.find((elm) => elm._id.toString() !== user_id);
                const this_conversation = action.payload.unread.find((els) => els.id === el._id);
                if (!this_user) {
                    console.log(`Không tìm thấy người dùng khác trong participants cho cuộc trò chuyện với ID: ${el._id}`);
                    return null;
                }

                const lastMessage = el.messages[el.messages.length - 1];
                console.log("last", el.messages?.length);
                const date = new Date(lastMessage?.created_at);
                const time = !isNaN(date.getTime())
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "Invalid Date"; // xử lý trường hợp không hợp lệ
                const address = lastMessage?.to !== user_id;
                return {
                    id: el._id,
                    user_id: this_user._id,
                    name: `${this_user.firstName} ${this_user.lastName}`,
                    online: this_user.status === "Online",
                    img: faker.animal.cat(),
                    msg: `${address ? "You : " : ""}${lastMessage?.text || "No message"}`,
                    time: time,
                    unread: address ? 0 : this_conversation?.unread || 0,
                    iso: lastMessage?.created_at,
                    pinned: false,
                };
            }).filter(Boolean).sort((a, b) => new Date(b.iso) - new Date(a.iso));
            console.log("danh sach", list);
            state.direct_chat.conversations = list.length > 0 ? list : [];
            console.log('neeeeeeeeeeeeeeeeeeeee', state.direct_chat.conversations);

        },
        fetchUnreadConversation(state, action) {
            console.log("unread ===================================");
            console.log("id", action.payload.conversation_id);
            const id = action.payload.conversation_id;
            console.log("unread", action.payload.unread);
            const unreadCount = action.payload.unread
            const this_conversation = action.payload.conversations.find((el) => el._id === id);
            console.log(this_conversation);
            if (!this_conversation) {
                console.log("Không tìm thấy cuộc trò chuyện với ID:", id);
                return;
            }

            const this_user = this_conversation.participants.find((elm) => elm._id.toString() !== user_id);

            if (!this_user) {
                console.log(`Không tìm thấy người dùng khác trong participants cho cuộc trò chuyện với ID: ${this_conversation._id}`);
                return;
            }

            const lastMessage = this_conversation.messages[this_conversation.messages.length - 1];
            console.log("last", this_conversation.messages?.length);
            const date = new Date(Date.parse(lastMessage?.created_at));
            const time = !isNaN(date.getTime())
                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "Invalid Date"; // xử lý trường hợp không hợp lệ
            const address = lastMessage?.to !== user_id;
            // if(lastMessage)
            // if (!address) {
            //     unreadCount = unreadCount + 1;
            // }
            const updatedConversation = {
                id: this_conversation._id,
                user_id: this_user._id,
                name: `${this_user.firstName} ${this_user.lastName}`,
                online: this_user.status === "Online",
                img: faker.animal.cat(),
                msg: `${address ? "You : " : ""}${lastMessage?.text || "No message"}`,
                time: time,
                unread: address ? 0 : unreadCount + 1,
                pinned: false,
            };

            const conversationIndex = state.direct_chat.conversations.findIndex((eln) => eln.id === id);
            if (conversationIndex !== -1) {
                state.direct_chat.conversations[conversationIndex] = updatedConversation;
                console.log('neeeeeeeeeeeeeeeeeeeee', state.direct_chat.conversations[conversationIndex]);

            }
        },

        updateDirectConversation(state, action) {

            console.log("update=============================")
            const this_conversation = action.payload.conversation;
            const this_cur_mes = action.payload.message;
            console.log('neeeeeeeeeeeeeeeeeeeee', this_conversation);
            console.log('userneeeeeeeeeeeeeeeee', this_conversation.unread);

            const address = this_cur_mes?.from === user_id;
            console.log("addresss", address);
            const date = new Date(this_cur_mes?.created_at);
            const time = `${date.getHours()}:${date.getMinutes()}`;
            // Tạo mảng conversations mới
            state.direct_chat.conversations = state.direct_chat.conversations.map((el) => {
                if (el?.id?.toString() !== this_conversation._id?.toString()) {
                    return el;
                } else {
                    const user = this_conversation.participants.find(
                        (elm) => elm._id.toString() !== user_id
                    );
                    // const count = lla;
                    // console.log(count);
                    return {
                        ...el, // Tạo bản sao mới
                        name: `${user?.firstName} ${user?.lastName}`,
                        online: user?.status === "Online",
                        img: faker.animal.cat(),
                        msg: `${address ? "You:" : ""}${this_cur_mes?.text || "No new message"}`,
                        time: time,
                        unread: 6,
                        pinned: false,
                    };
                }
            });
            console.log('neeeeeeeeeeeeeeeeeeeee', state.direct_chat.conversations);

        },


        // updateDirectConversation(state, action) {
        //     const this_conversation = action.payload.conversation;
        //     const this_cur_mes = action.payload.message;
        //     const date = new Date(this_cur_mes?.created_at);
        //     const time = `${date.getHours()}:${date.getMinutes()}`
        //     state.direct_chat.conversations = state.direct_chat.conversations.map((el) => {
        //         if (el?.id !== this_conversation._id) {
        //             return el;
        //         } else {
        //             const user = this_conversation.participants.find((elm) => elm._id.toString() !== user_id);
        //             return {
        //                 ...el,
        //                 name: `${user?.firstName} ${user?.lastName}`,
        //                 online: user?.status === "Online",
        //                 img: faker.animal.cat(),
        //                 msg: this_cur_mes?.text || "No new message",  // Chắc chắn cập nhật tin nhắn thực tế
        //                 time: time,
        //                 unread: 0,
        //                 pinned: false,
        //             };
        //         }
        //     });
        // },

        addDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            console.log("countAddDriect", this_conversation.unread);
            const date = new Date(Date.now());
            const time = `${date.getHours()}:${date.getMinutes()}`
            const user = this_conversation.participants.find((elm) => elm._id.toString() !== user_id);
            const lastMessage = this_conversation.messages[this_conversation.messages.length - 1]?.text || "No messages";

            state.direct_chat.conversations.push({
                id: this_conversation._id,
                user_id: user?._id,
                name: `${user?.firstName} ${user?.lastName}`,
                img: faker.animal.cat(),
                msg: lastMessage,
                time: time,
                unread: 9,
                pinned: false,
            })
        },
        setCurrentConversation(state, action) {
            // const this_conversation = action.payload.current_conversation;
            console.log("set current =======================================")
            console.log(action.payload.conversation);
            state.direct_chat.current_conversation = action.payload.conversation;






        },
        fetchCurrentMessages(state, action) {
            const messages = action.payload.messages;
            console.log(messages);
            const formatted_messages = messages?.map((el) => ({
                id: el._id,
                type: "msg",
                subtype: el.type,
                message: el.text,
                incoming: el.from !== user_id,
                outgoing: el.from === user_id,
            }));
            state.direct_chat.current_messages = formatted_messages;
        },
        addDirectMessage(state, action) {
            if (action.payload?.conversation) {
                state.direct_chat.conversations.push(action.payload.conversation);
            }

            const conversation = state.direct_chat.conversations.find(
                (el) => el.id === action.payload?.conversation_id
            );

            if (conversation) {
                conversation.messages.push(action.payload.message);
            }
        },
        // addDirectMessage(state, action) {
        //     const { conversation_id, message } = action.payload;

        //     // Cập nhật tin nhắn cho người gửi
        //     const conversation = state.direct_chat.conversations.find(
        //         (el) => el.id === conversation_id
        //     );

        //     if (conversation) {
        //         // Nếu cuộc trò chuyện đã tồn tại, thêm tin nhắn vào
        //         conversation.messages.push(message);
        //         conversation.msg = message.text;  // Cập nhật tin nhắn cuối cùng
        //     } else {
        //         // Nếu cuộc trò chuyện không tồn tại, tạo cuộc trò chuyện mới cho người gửi
        //         const newConversation = {
        //             id: conversation_id,
        //             user_id: message.from,  // Người nhận là người khác ngoài người gửi
        //             name: `${message.from_first_name} ${message.from_last_name}`,  // Lấy tên người nhận
        //             img: faker.animal.cat(),
        //             msg: message.text,
        //             time: new Date().toISOString(),  // Cập nhật thời gian
        //             unread: 1,
        //             pinned: false,
        //             messages: [message],  // Thêm tin nhắn vào cuộc trò chuyện mới
        //         };
        //         state.direct_chat.conversations.push(newConversation);
        //     }

        //     // Cập nhật cuộc trò chuyện cho người nhận nếu cần
        //     const recipientConversation = state.direct_chat.conversations.find(
        //         (el) => el.user_id === message.to
        //     );

        //     if (recipientConversation) {
        //         recipientConversation.messages.push(message);
        //         recipientConversation.msg = message.text;  // Cập nhật tin nhắn cuối cùng
        //     } else {
        //         // Nếu không có cuộc trò chuyện của người nhận, tạo mới cuộc trò chuyện cho người nhận
        //         const newRecipientConversation = {
        //             id: conversation_id,
        //             user_id: message.to,  // Người nhận là 'to'
        //             name: `${message.to_first_name} ${message.to_last_name}`,
        //             img: faker.animal.cat(),
        //             msg: message.text,
        //             time: new Date().toISOString(),
        //             unread: 1,
        //             pinned: false,
        //             messages: [message],
        //         };
        //         state.direct_chat.conversations.push(newRecipientConversation);
        //     }
        // },


        removeMessage(state, action) {
            state.direct_chat.current_messages = [];
            state.direct_chat.conversations = [];
            state.direct_chat.current_conversation = null;
        }
    },
});

//reducer

export default slice.reducer;

// ----------------------------------------------------------------------

export const fetchDirectConversationsAction = ({ conversations, unread }) => {
    return async (dispatch) => {
        console.log("Calling fetchDirectConversationsAction"); // Kiểm tra nếu action được gọi
        try {
            console.log("Dispatching fetchDirectConversations with:", conversations); // Kiểm tra dữ liệu trước khi dispatch
            dispatch(slice.actions.fetchDirectConversations({ conversations, unread }));
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        }
    };
};

export const FetchUnreadConversation = ({ conversations, conversation_id, unread }) => {
    return async (dispatch) => {
        console.log("Calling fetchUnreadConversation"); // Kiểm tra nếu action được gọi
        try {
            console.log("Dispatching fetchUnreadConversation with:", conversations); // Kiểm tra dữ liệu trước khi dispatch
            dispatch(slice.actions.fetchUnreadConversation({ conversations, conversation_id, unread }));
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        }
    };
};
export const UpdateDirectConversations = ({ conversation, message }) => {
    return async (dispatch) => {
        console.log("Calling UpdateDirectConversations", message); // Kiểm tra nếu action được gọi
        try {
            console.log("Dispatching fetchDirectConversations with:", message); // Kiểm tra dữ liệu trước khi dispatch
            dispatch(slice.actions.updateDirectConversation({ conversation, message }));
            // dispatch(slice.actions.fetchDirectConversations({ conversation }));
            console.log("After Dispatching fetchDirectConversations with:", conversation); // Kiểm tra dữ liệu trước khi dispatch

        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        }
    };
};
export const AddDirectConversationsAction = ({ conversation }) => {
    return async (dispatch) => {
        console.log("Calling fetchDirectConversationsAction"); // Kiểm tra nếu action được gọi
        try {
            console.log("Dispatching fetchDirectConversations with:", conversation); // Kiểm tra dữ liệu trước khi dispatch
            dispatch(slice.actions.addDirectConversation({ conversation }));
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        }
    };
};

export const FetchCurrentMessages = ({ messages }) => {
    return async (dispatch, getState) => {
        const curentMessages = getState().conversation.direct_chat.current_messages;
        if (curentMessages !== messages) {
            dispatch(slice.actions.fetchCurrentMessages({ messages }));

        }

    }
}

export const AddDirectMessage = ({ message }) => {
    return async (dispatch) => {
        dispatch(slice.actions.addDirectMessage({ message }));
    }
}

export const SetCurrentConversation = ({ conversation }) => {
    return async (dispatch) => {
        dispatch(slice.actions.setCurrentConversation({ conversation }));
    }
}

export const RemoveAllDirectMessage = () => {
    return async (dispatch) => {
        dispatch(slice.actions.removeMessage());
    }
}

