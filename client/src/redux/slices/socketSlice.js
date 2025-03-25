import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    isSocketConnected: false,
  },
  reducers: {
    socketConnected: (state) => {
      state.isSocketConnected = true;
    },
    socketDisconnected: (state) => {
      state.isSocketConnected = false;
    },
  },
});

export const { socketConnected, socketDisconnected } = socketSlice.actions;

export default socketSlice.reducer;