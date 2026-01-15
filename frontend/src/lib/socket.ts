import { io } from "socket.io-client";

// Use the same base URL as the API, removing the '/api' suffix
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:3001";

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
    // Optimize for faster real-time updates
    transports: ['websocket', 'polling'], // Prefer websocket over polling
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2000,
    reconnectionAttempts: 5,
    timeout: 10000,
});
