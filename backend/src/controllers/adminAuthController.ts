import { Request, Response } from "express";
import Admin from "../models/Admin";
import generateToken from "../utils/generateToken";

const registerAdmin = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        res.status(400).json({ message: "Admin already exists" });
        return;
    }

    const admin = await Admin.create({
        name,
        email,
        password,
    });

    if (admin) {
        generateToken(res, (admin._id as unknown) as string);
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            isAdmin: true,
        });
    } else {
        res.status(400).json({ message: "Invalid admin data" });
    }
};

const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (admin && (await admin.comparePassword(password))) {
        generateToken(res, (admin._id as unknown) as string);
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            isAdmin: true,
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

const logoutAdmin = (req: Request, res: Response) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out" });
};

export { registerAdmin, loginAdmin, logoutAdmin };
