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
        fetchDirectConversations(state, action) {
            const list = action.payload.conversations.map((el) => {


                // Kiểm tra nếu không có participants
                if (!el.participants || el.participants.length === 0) {
                    console.log("Không tìm thấy participants cho cuộc trò chuyện với ID:", el._id);
                    return null;
                }
                // console.log('participant:', el.participants);


                // Tìm người dùng khác không phải chính mình
                const this_user = el.participants.find(
                    (elm) => elm._id.toString() !== user_id
                );

                // Nếu không tìm thấy người dùng khác
                if (!this_user) {
                    console.log(`Không tìm thấy người dùng khác trong participants cho cuộc trò chuyện với ID: ${el._id}`);
                    return null;
                } else {
                    console.log(`Không tìm thấy người dùng khác trong participants cho cuộc trò chuyện với ID: ${el._id}`);

                }


                // Trả về cuộc trò chuyện
                return {
                    id: el._id,
                    user_id: this_user._id,
                    name: `${this_user.firstName} ${this_user.lastName}`,
                    online: this_user.status === "Online",
                    img: faker.animal.cat(),
                    msg: faker.music.songName(),
                    time: '12:02',
                    unread: 0,
                    pinned: false
                };
            }).filter(Boolean); // Lọc bỏ giá trị null
            console.log("trotruyen", list);
            state.direct_chat.conversations = list.length > 0 ? list : [];
        },
        updateDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            console.log(this_conversation);
            state.direct_chat.conversations = state.direct_chat.conversations.map((el) => {
                console.log("el", el.id);
                if (el?.id !== this_conversation._id) {
                    return el;
                } else {
                    const user = this_conversation.participants.find((elm) => elm._id.toString() !== user_id);
                    return {
                        to: this_conversation._id,
                        user_id: user?._id,
                        name: `${user?.firstName} ${user?.lastName}`,
                        online: user?.status === "Online",
                        img: faker.animal.cat(),
                        msg: "hehehehehe",
                        time: "9:36",
                        unread: 0,
                        pinned: false,
                    };
                }
            })
            console.log(state.direct_chat.conversations);
        },
        addDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            const user = this_conversation.participants.find((elm) => elm._id.toString() !== user_id);
            state.direct_chat.conversations.push({
                id: this_conversation._id,
                user_id: user?._id,
                name: `${user?.firstName} ${user?.lastName}`,
                img: faker.animal.bear(),
                msg: 'newhehe',
                time: "9:36",
                unread: 0,
                pinned: false,
            })
        },
        setCurrentConversation(state, action) {
            state.direct_chat.current_conversation = action.payload;
        },
        fetchCurrentMessages(state, action) {
            const messages = action.payload.messages;
            const formatted_messages = messages.map((el) => ({
                id: el._id,
                type: "msg",
                subtype: el.type,
                message: el.text,
                incoming: el.to === user_id,
                outgoing: el.from === user_id,
            }));
            state.direct_chat.current_messages = formatted_messages;
        },
        addDirectMessage(state, action) {
            state.direct_chat.current_messages.push(action.payload.message);
        }
    },
});

//reducer

export default slice.reducer;

// ----------------------------------------------------------------------

export const fetchDirectConversationsAction = ({ conversations }) => {
    return async (dispatch) => {
        console.log("Calling fetchDirectConversationsAction"); // Kiểm tra nếu action được gọi
        try {
            console.log("Dispatching fetchDirectConversations with:", conversations); // Kiểm tra dữ liệu trước khi dispatch
            dispatch(slice.actions.fetchDirectConversations({ conversations }));
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        }
    };
};
export const UpdateDirectConversations = ({ conversation }) => {
    return async (dispatch) => {
        console.log("Calling fetchDirectConversationsAction"); // Kiểm tra nếu action được gọi
        try {
            console.log("Dispatching fetchDirectConversations with:", conversation); // Kiểm tra dữ liệu trước khi dispatch
            dispatch(slice.actions.updateDirectConversation({ conversation }));
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

