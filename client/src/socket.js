import { io } from "socket.io-client";

let socket = null;

export const connectSocket = async (userId) => {
    if (!socket) {
        socket = io("https://symptocure.onrender.com",{
            transports: ["websocket"],
        }); // Change to your backend URL

        socket.on("connect", () => {
            // console.log("Socket connected");
            socket.emit("join", userId);
        });
    }
};

export const getSocket = () => socket; // Allows you to access socket anywhere

export const disconnectSocket =async (userId) => {
    if (socket) {
        await socket.emit("remove-user-socket",userId);
        socket.emit("is-user-online",userId);
        socket.disconnect();
        socket = null;
    }
};
