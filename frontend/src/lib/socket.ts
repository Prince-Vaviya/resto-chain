import { io } from "socket.io-client";

// In production, this URL should be an env variable
const SOCKET_URL = "http://localhost:3001";

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
});
