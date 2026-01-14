import express from "express";
import {
    loginAdmin,
    logoutAdmin,
} from "../controllers/adminAuthController";

const router = express.Router();

// No registration route - only one admin exists
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

export default router;
