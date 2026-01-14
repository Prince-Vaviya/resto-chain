import { Request, Response } from "express";
import Order from "../models/Order";
import Restaurant from "../models/Restaurant";
import { io } from "../server";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { items, subtotal, delivery_fee, taxes, total, payment_method, delivery_address } = req.body;

        if (items && items.length === 0) {
            res.status(400).json({ message: "No order items" });
            return;
        }

        // Assume single restaurant for now
        const restaurant = await Restaurant.findOne();
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        // Generate Order Number (Simple timestamp based)
        const order_number = `ORD-${Date.now().toString().slice(-6)}`;

        // @ts-ignore
        const customer_id = req.user._id;

        const order = new Order({
            order_number,
            customer_id,
            restaurant_id: restaurant._id,
            items: items.map((item: any) => ({
                item_id: item.id,
                name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity,
            })),
            subtotal,
            delivery_fee,
            taxes,
            total,
            payment_method,
            delivery_address,
            status: "PENDING",
        });

        const createdOrder = await order.save();

        // Emit event to admin
        io.to("admin").emit("new_order", createdOrder);

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private (Customer)
export const getMyOrders = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const orders = await Order.find({ customer_id: req.user._id }).sort({ placed_at: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get restaurant orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({})
            .populate("customer_id", "name email")
            .sort({ placed_at: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();

            // Emit to customer
            io.to(`customer_${order.customer_id}`).emit("order_status_updated", updatedOrder);

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
