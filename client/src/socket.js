import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
    if (!socket) {
        socket = io("http://localhost:5000",{
            transports: ["websocket"],
        }); // Change to your backend URL

        socket.on("connect", () => {
            // console.log("Socket connected");
            socket.emit("join", userId);
        });
    }
};

export const getSocket = () => socket; // Allows you to access socket anywhere

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
