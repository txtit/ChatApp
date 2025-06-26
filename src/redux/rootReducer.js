import { keyframes } from "@emotion/react";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app"
import authReducer from "./slices/auth"
import audioCallReducer from "./slices/audioCall"
import videoCallReducer from "./slices/videoCall"
import conversationReducer from "./slices/coversation"
import progressReducer from "./slices/progress"
import slideReducer from "./slices/progessV2"
// slices

const rootPeristConfig = {
    key: 'root',
    storage,
    keyPrefix: "redux-",
    // whitelist: [],
    // blacklist:[],
}
const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    conversation: conversationReducer,
    audioCall: audioCallReducer,
    videoCall: videoCallReducer,
    progress: progressReducer,
    slide: slideReducer,
});

export { rootPeristConfig, rootReducer };