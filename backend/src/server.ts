import dotenv from "dotenv";
dotenv.config();

import app from "./app";

import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 3001;
const httpServer = createServer(app);

// Socket.io Setup
const io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "https://resto-chain.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
    // Optimize for faster real-time updates
    transports: ['websocket', 'polling'], // Prefer websocket
    pingTimeout: 30000,
    pingInterval: 10000,
    maxHttpBufferSize: 1e6, // 1MB
    allowEIO3: true, // backwards compatibility
});

export { io };

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Connect to Database and start server
connectDB().then(() => {
    // Use httpServer.listen instead of app.listen
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
