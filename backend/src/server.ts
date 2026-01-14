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
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
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
