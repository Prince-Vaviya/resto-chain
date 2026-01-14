import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";

export interface AuthenticatedAdminRequest extends Request {
    admin?: any;
}

export const protectAdmin = async (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            req.admin = await Admin.findById(decoded.userId).select("-password");

            if (!req.admin) {
                res.status(401).json({ message: "Not authorized, admin not found" });
                return;
            }

            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
