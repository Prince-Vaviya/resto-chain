import { Request, Response } from "express";
import { Category, MenuItem } from "../models/Menu";
import Restaurant from "../models/Restaurant";

// --- Categories ---

// @desc    Get all categories
// @route   GET /api/menu/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a category
// @route   POST /api/menu/categories
// @access  Private (Admin)
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        // Assume single restaurant for now
        const restaurant = await Restaurant.findOne();
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        const category = await Category.create({
            name,
            restaurant_id: restaurant._id as any,
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update a category
// @route   PUT /api/menu/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name;
            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

// @desc    Delete a category
// @route   DELETE /api/menu/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.json({ message: "Category removed" });
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

// --- Menu Items ---

// @desc    Get all menu items
// @route   GET /api/menu/items
// @access  Public
export const getMenuItems = async (req: Request, res: Response) => {
    try {
        const items = await MenuItem.find().populate("category_id");
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a menu item
// @route   POST /api/menu/items
// @access  Private (Admin)
export const createMenuItem = async (req: Request, res: Response) => {
    try {
        const { name, description, price, category_id, image, is_available, prep_time } = req.body;

        // Assume single restaurant
        const restaurant = await Restaurant.findOne();
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        const menuItem = await MenuItem.create({
            restaurant_id: restaurant._id as any,
            category_id,
            name,
            description,
            price,
            image,
            is_available,
            prep_time
        });
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update a menu item
// @route   PUT /api/menu/items/:id
// @access  Private (Admin)
// ... (Similar update logic for Item)
export const updateMenuItem = async (req: Request, res: Response) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (menuItem) {
            const { name, description, price, category_id, image, is_available, prep_time } = req.body;

            menuItem.name = name || menuItem.name;
            menuItem.description = description || menuItem.description;
            menuItem.price = price || menuItem.price;
            menuItem.category_id = category_id || menuItem.category_id;
            menuItem.image = image || menuItem.image;
            menuItem.is_available = is_available !== undefined ? is_available : menuItem.is_available;
            menuItem.prep_time = prep_time || menuItem.prep_time;

            const updatedItem = await menuItem.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

// @desc    Delete a menu item
// @route   DELETE /api/menu/items/:id
// @access  Private (Admin)
export const deleteMenuItem = async (req: Request, res: Response) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (menuItem) {
            await menuItem.deleteOne();
            res.json({ message: "Item removed" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}
