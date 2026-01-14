import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
        credentials: true,
    })
);
app.use(cookieParser());

// Test Route
app.get("/", (req: Request, res: Response) => {
    res.send("Resto-Chain API is running...");
});

import authRoutes from "./routes/authRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import menuRoutes from "./routes/menuRoutes";
import orderRoutes from "./routes/orderRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

export default app;
