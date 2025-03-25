import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "../slices/signInSlice";
import loadingReducer from "../slices/loadingSlice";
import roleReducer from "../slices/roleSlice";
import socketReducer from "../slices/socketSlice";

const store = configureStore({
  reducer: {
    signin: signInReducer,
    loading: loadingReducer,
    role: roleReducer,
    socketio: socketReducer,
  },
});

export default store;
