import express from "express";
import { getRestaurant, updateRestaurant } from "../controllers/restaurantController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getRestaurant);
router.put("/", protect, updateRestaurant);

export default router;
