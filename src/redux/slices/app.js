import { createSlice } from "@reduxjs/toolkit";

// 
import { type } from "@testing-library/user-event/dist/type";

const initialState = {
    sidebar: {
        open: false,
        type: "CONTACT", // can be contact, starred, shared
    },
    snackbar: {
        open: false,
        severity: null,
        message: null,
    }
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
    return async (dispatch, getState) => {
        dispatch(slice.actions.toggleSidebar());
    };

}
export function updateSidebarType(type) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateSidebarType({
            type,
        }));
    };

}



