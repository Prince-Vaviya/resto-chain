import express from "express";
import {
    registerCustomer,
    loginCustomer,
    logoutCustomer,
    updateProfile,
    getCustomers,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/logout", logoutCustomer);
router.put("/profile", protect, updateProfile);
router.get("/customers", protect, getCustomers);

export default router;
