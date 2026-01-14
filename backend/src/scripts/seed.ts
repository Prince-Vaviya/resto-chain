import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "../models/Customer";

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB Connected");

        // Clear existing customers
        await Customer.deleteMany({});

        // Create Customer
        const customer = await Customer.create({
            name: "John Doe",
            email: "customer@example.com",
            phone: "9876543210",
            password: "password123", // Will be hashed by pre-save hook
        });

        console.log("-----------------------------------");
        console.log("Customer Created:");
        console.log("Email: customer@example.com");
        console.log("Password: password123");
        console.log("-----------------------------------");

        // Create Admin (For now, we use the same model or a specific hardcoded one if no Admin model exists yet. 
        // Since the task list implies 'Admin Login' is done but might just be a boolean flag or separate model not yet fully used, 
        // I will create another customer user to act as admin for the demo until RBAC is fully set).
        // Note: In a real app, use a separate Admin model or a role field. 
        // For this MVP step, I'll print credentials that user can use to log in.

        // Check if we have an Admin model, if not, we skip or use Customer as placeholder.
        // Based on previous files, we only have Customer, Restaurant, Order, Menu. 
        // I'll create a 'Restaurant Owner' customer for now.

        const admin = await Customer.create({
            name: "Admin User",
            email: "admin@example.com",
            phone: "1234567890",
            password: "adminpassword123",
        });

        console.log("Admin (Placeholder) Created:");
        console.log("Email: admin@example.com");
        console.log("Password: adminpassword123");
        console.log("-----------------------------------");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
