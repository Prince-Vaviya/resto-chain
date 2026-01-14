import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
    order_number: string;
    customer_id: mongoose.Schema.Types.ObjectId;
    restaurant_id: mongoose.Schema.Types.ObjectId;
    items: {
        item_id: mongoose.Schema.Types.ObjectId;
        name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }[];
    subtotal: number;
    delivery_fee: number;
    taxes: number;
    discount: number;
    total: number;
    status: string;
    payment_status: string;
    payment_method: string;
    delivery_address: string;
    placed_at: Date;
}

const OrderSchema: Schema = new Schema({
    order_number: { type: String, required: true, unique: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [
        {
            item_id: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
            name: String,
            quantity: Number,
            unit_price: Number,
            total_price: Number,
        },
    ],
    subtotal: { type: Number, required: true },
    delivery_fee: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED", "PREPARING", "READY_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
        default: "PENDING",
    },
    payment_status: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
    payment_method: { type: String, enum: ["CARD", "COD", "UPI"], required: true },
    delivery_address: { type: String, required: true },
    placed_at: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", OrderSchema);
