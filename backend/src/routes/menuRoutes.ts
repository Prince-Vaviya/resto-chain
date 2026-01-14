import express from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} from "../controllers/menuController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Categories
router.get("/categories", getCategories);
router.post("/categories", protect, createCategory);
router.put("/categories/:id", protect, updateCategory);
router.delete("/categories/:id", protect, deleteCategory);

// Items
router.get("/items", getMenuItems);
router.post("/items", protect, createMenuItem);
router.put("/items/:id", protect, updateMenuItem);
router.delete("/items/:id", protect, deleteMenuItem);

export default router;
