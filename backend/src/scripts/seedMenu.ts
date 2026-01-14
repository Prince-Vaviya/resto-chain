import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category, MenuItem } from "../models/Menu";
import Restaurant from "../models/Restaurant";

dotenv.config();

const seedMenu = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB Connected for Menu Seeding");

        // Ensure we have a restaurant
        let restaurant = await Restaurant.findOne();
        if (!restaurant) {
            restaurant = await Restaurant.create({
                name: "Resto-Chain Central",
                description: "The best food in town",
                address: "123 Food St",
                phone: "123-456-7890",
            });
            console.log("Created Default Restaurant");
        }

        // Clear existing menu
        await Category.deleteMany({});
        await MenuItem.deleteMany({});

        // Create Categories
        const categories = await Category.insertMany([
            { name: "Starters", restaurant_id: restaurant._id },
            { name: "Main Course", restaurant_id: restaurant._id },
            { name: "Desserts", restaurant_id: restaurant._id },
            { name: "Beverages", restaurant_id: restaurant._id },
        ]);

        console.log("Categories Seedeed");

        // Create Items
        const starters = categories.find(c => c.name === "Starters");
        const mainCourse = categories.find(c => c.name === "Main Course");
        const desserts = categories.find(c => c.name === "Desserts");

        if (starters && mainCourse && desserts) {
            await MenuItem.insertMany([
                {
                    restaurant_id: restaurant._id,
                    category_id: starters._id,
                    name: "Paneer Tikka",
                    description: "Grilled cottage cheese marinated in spices",
                    price: 280,
                    image: "🧀",
                    is_available: true,
                },
                {
                    restaurant_id: restaurant._id,
                    category_id: starters._id,
                    name: "Samosa Platter",
                    description: "Crispy pastry filled with spiced potatoes",
                    price: 150,
                    image: "🔺",
                    is_available: true,
                },
                {
                    restaurant_id: restaurant._id,
                    category_id: mainCourse._id,
                    name: "Butter Chicken",
                    description: "Rich and creamy tomato gravy with tender chicken",
                    price: 350,
                    image: "🍛",
                    is_available: true,
                },
                {
                    restaurant_id: restaurant._id,
                    category_id: mainCourse._id,
                    name: "Dal Makhani",
                    description: "Creamy lentils cooked overnight",
                    price: 220,
                    image: "🍲",
                    is_available: true,
                },
                {
                    restaurant_id: restaurant._id,
                    category_id: desserts._id,
                    name: "Gulab Jamun",
                    description: "Sweet milk dumplings",
                    price: 100,
                    image: "🍩",
                    is_available: true,
                }
            ]);
            console.log("Menu Items Seeded");
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedMenu();
