import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    restaurant_id: mongoose.Schema.Types.ObjectId;
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
});

export const Category = mongoose.model<ICategory>("Category", CategorySchema);

export interface IMenuItem extends Document {
    restaurant_id: mongoose.Schema.Types.ObjectId;
    category_id: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    image: string;
    is_available: boolean;
    prep_time: number;
}

const MenuItemSchema: Schema = new Schema({
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String, // Base64
    is_available: { type: Boolean, default: true },
    prep_time: { type: Number, default: 15 },
});

export const MenuItem = mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
