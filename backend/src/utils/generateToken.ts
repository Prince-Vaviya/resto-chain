import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (res: Response, userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN as any,
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax", // Changed from "strict" to "lax" for better cross-domain support
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token; // Return token so it can be included in response body
};

export default generateToken;
