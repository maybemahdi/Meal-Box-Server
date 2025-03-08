import { Types } from "mongoose";

export interface IOrder {
  customerId: Types.ObjectId;
  mealId: Types.ObjectId;
  customization: string;
  schedule: Date;
  deliveryAddress: string;
  status: "PENDING" | "ACCEPTED" | "DELIVERED" | "CANCELLED";
  isDeleted: boolean;
}
