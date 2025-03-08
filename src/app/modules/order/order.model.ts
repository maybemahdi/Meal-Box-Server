import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User" },
    mealId: { type: Schema.Types.ObjectId, ref: "Meal" },
    customization: String,
    schedule: Date,
    deliveryAddress: String,
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Order = model<IOrder>("Order", OrderSchema);
