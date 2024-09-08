import { createSlice } from "@reduxjs/toolkit";

// 
import { dispatch } from "../Store";

const initialState ={
    sidebar: {
        open: false,
        type: "CONTACT", // can be contact, starred, shared
    }
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // tongle sidebar
        toggleSidebar(state, action){
            state.sidebar.type = action.payload.type;
        },
    },

});

//reducer
export default slice.reducer;

