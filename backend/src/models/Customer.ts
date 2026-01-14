import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface ICustomer extends Document {
    name: string;
    email: string;
    phone: string;
    address?: string;
    password?: string;
    addresses: {
        label: string;
        address: string;
        is_default: boolean;
    }[];
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    password: { type: String, select: false },
    addresses: [
        {
            label: String,
            address: String,
            is_default: { type: Boolean, default: false },
        },
    ],
});

CustomerSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    // @ts-ignore
    this.password = await bcrypt.hash(this.password, salt);
});

CustomerSchema.methods.comparePassword = async function (enteredPassword: string) {
    // @ts-ignore
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
