import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = io("http://localhost:5000"); // Change to your backend URL
    }
};

export const getSocket = () => socket; // Allows you to access socket anywhere

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
