import { Request, Response } from "express";
import Customer from "../models/Customer";
import generateToken from "../utils/generateToken";

const registerCustomer = async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, password } = req.body;

    const userExists = await Customer.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const user = await Customer.create({
        name,
        email,
        phone,
        password,
    });

    if (user) {
        generateToken(res, (user._id as unknown) as string);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

const loginCustomer = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await Customer.findOne({ email }).select("+password");

    if (user && (await user.comparePassword(password))) {
        generateToken(res, (user._id as unknown) as string);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

const logoutCustomer = (req: Request, res: Response) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out" });
};

export { registerCustomer, loginCustomer, logoutCustomer };
