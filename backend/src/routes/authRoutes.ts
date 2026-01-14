import express from "express";
import { registerCustomer, loginCustomer, logoutCustomer } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/logout", logoutCustomer);

export default router;
