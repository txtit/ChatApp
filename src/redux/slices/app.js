import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

const initialState = {
    sidebar: {
        open: false,
        type: "CONTACT", // can be contact, starred, shared
    },
    snackbar: {
        open: false,
        severity: null,
        message: null,
    },
    this_users: null,
    users: [],
    sent: [],
    friends: [],
    friendsRequest: [],
    chat_type: null,
    room_id: null,
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // toggle sidebar
        toggleSidebar(state, action) {
            // state.sidebar.type = action.payload.type;
            state.sidebar.open = !state.sidebar.open;
            state.sidebar.type = "CONTACT";
        },
        updateSidebarType(state, action) {
            state.sidebar.type = action.payload.type;
        },

        openSnackBar(state, action) {
            console.log("payload", action.payload);

            state.snackbar.open = true;
            state.snackbar.severity = action.payload.severity;
            state.snackbar.message = action.payload.message;
        },
        closeSnackBar(state, action) {
            console.log("This is getting executed");
            state.snackbar.open = false;
            state.snackbar.message = null;
        },
        updateUsers(state, action) {
            state.users = action.payload.users;
            state.this_users = action.payload.this_users;
        },
        updateFriends(state, action) {
            state.friends = action.payload.friends;
        },
        updateFriendsRequest(state, action) {
            state.friendsRequest = action.payload.friendsRequest;
        },
        selectConversation(state, action) {
            console.log('roomid', action.payload.room_id);
            state.chat_type = 'individual';
            state.room_id = action.payload.room_id;
        },
        resetRoomId(state) {
            state.room_id = null;
        },
        updateRoomId(state, action) {
            state.room_id = action.payload.room_id;
        },
        updateUserSent: (state, action) => {
            state.sent = action.payload.sent; // Cập nhật state.sent với mảng mới
        }
    },

});

//reducer
export default slice.reducer;

export const showSnackBar = ({ severity, message }) =>
    async (dispatch, getState) => {
        dispatch(slice.actions.openSnackBar({
            message,
            severity,
        })
        );

        setTimeout(() => {
            dispatch(slice.actions.closeSnackBar());
        }, 4000);
    };
export const closeSnackBar = () =>
    async (dispatch, getState) => {
        dispatch(slice.actions.closeSnackBar());
    };
export function toggleSidebar() {
    return (dispatch) => {
        dispatch(slice.actions.toggleSidebar());
    };

}
export function updateSidebarType(type) {
    return (dispatch,) => {
        dispatch(slice.actions.updateSidebarType({
            type,
        }));
    };

}

export function fecthUsers() {
    return async (dispatch, getState) => {
        await axiosInstance.get("/user/get-users", {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${getState().auth.token}`
            }
        })
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateUsers({
                    users: response.data.data,
                    this_users: response.data.cur_user,
                }))
            })
            .catch((error) => {
                console.log(error);
            })
    }
}

export function fecthFriends() {
    return async (dispatch, getState) => {
        await axiosInstance
            .get("/user/get-friends", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getState().auth.token}`
                }
            }).then((response) => {
                console.log(response);
                dispatch(slice.actions.updateFriends({
                    friends: response.data.data
                }))
            }).catch((error) => {
                console.log(error);
            })
    }
}

export function fecthRequest() {
    return async (dispatch, getState) => {

        await axiosInstance
            .get("user/get-request-friends", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getState().auth.token}`
                }
            }).then((response) => {
                console.log("banbeyeucau", response.data.data);
                dispatch(slice.actions.updateFriendsRequest({
                    friendsRequest: response.data.data
                }))
            }).catch((error) => {
                console.log("Error fetching friend request", error);
            })
    }
}

export function SelectConversation({ room_id }) {
    return (dispatch) => {
        dispatch(slice.actions.selectConversation({ room_id }));
    }
}

export function ResetRoomId() {
    return (dispatch) => {
        dispatch(slice.actions.resetRoomId());
    }
}

export function UpdateRoomId(room_id) {
    return (dispatch) => {
        dispatch(slice.actions.updateRoomId({ room_id }));
    }
}

export function UpdateSent(newSent) {
    return (dispatch) => {
        dispatch(slice.actions.updateUserSent({ sent: newSent }));
    }
}





