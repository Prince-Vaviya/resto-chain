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
        address: req.body.address || "",
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

const updateProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = await Customer.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            // @ts-ignore
            user.address = req.body.address || user.address;
            // Email is read-only for updates usually, but we keep logic if needed or strictly follow req
            // User requested email read-only on frontend, backend can stay flexible or restrict. 
            // Let's keep flexibility but frontend will restrict.

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                // @ts-ignore
                address: updatedUser.address,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.aggregate([
            {
                $match: { isAdmin: { $ne: true } }
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "customer_id",
                    as: "orders"
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    phone: 1,
                    address: 1,
                    joinedAt: "$createdAt",
                    totalOrders: { $size: "$orders" },
                    totalRevenue: { $sum: "$orders.total" },
                    orders: {
                        $map: {
                            input: "$orders",
                            as: "order",
                            in: {
                                _id: "$$order._id",
                                order_number: "$$order.order_number",
                                total: "$$order.total",
                                status: "$$order.status",
                                placed_at: "$$order.placed_at",
                                items: "$$order.items",
                                subtotal: "$$order.subtotal",
                                taxes: "$$order.taxes",
                                delivery_fee: "$$order.delivery_fee"
                            }
                        }
                    }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export { registerCustomer, loginCustomer, logoutCustomer, updateProfile, getCustomers };


