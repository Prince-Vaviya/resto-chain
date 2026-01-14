import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";

// @desc    Get restaurant settings
// @route   GET /api/restaurant
// @access  Public
export const getRestaurant = async (req: Request, res: Response) => {
    try {
        // For single restaurant chain, we just pick the first one
        const restaurant = await Restaurant.findOne();
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update restaurant settings
// @route   PUT /api/restaurant
// @access  Private (Admin)
export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { name, description, address, phone, delivery_fee, is_open, cuisine_type } = req.body;

        let restaurant = await Restaurant.findOne();

        if (restaurant) {
            restaurant.name = name || restaurant.name;
            restaurant.description = description || restaurant.description;
            restaurant.address = address || restaurant.address;
            restaurant.phone = phone || restaurant.phone;
            restaurant.delivery_fee = delivery_fee !== undefined ? delivery_fee : restaurant.delivery_fee;
            restaurant.is_open = is_open !== undefined ? is_open : restaurant.is_open;
            restaurant.cuisine_type = cuisine_type || restaurant.cuisine_type;

            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            // Create if doesn't exist
            const newRestaurant = await Restaurant.create({
                name,
                description,
                address,
                phone,
                delivery_fee,
                is_open,
                cuisine_type
            });
            res.status(201).json(newRestaurant);
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
