import mongoose, { Document, Schema } from "mongoose";

export interface IRestaurant extends Document {
    name: string;
    description: string;
    cuisine_type: string[];
    address: string;
    phone: string;
    is_open: boolean;
    delivery_fee: number;
}

const RestaurantSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: String,
    cuisine_type: [String],
    address: { type: String, required: true },
    phone: { type: String, required: true },
    is_open: { type: Boolean, default: true },
    delivery_fee: { type: Number, default: 0 },
});

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
