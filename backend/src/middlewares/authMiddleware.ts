import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Customer from "../models/Customer";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    // Check for token in cookie (for local development)
    token = req.cookies.jwt;

    // If no cookie token, check Authorization header (for production/cross-domain)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = await Customer.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
