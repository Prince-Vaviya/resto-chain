import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
} from "../controllers/orderController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, getOrders);
router.put("/:id/status", protect, updateOrderStatus);

export default router;
