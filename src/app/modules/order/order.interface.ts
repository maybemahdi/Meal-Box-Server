import { Types } from "mongoose";

export interface IOrder {
  paymentMethodId?: string;
  customerId: Types.ObjectId;
  mealId: Types.ObjectId;
  mealProviderId: Types.ObjectId;
  customization: string;
  schedule: Date;
  deliveryAddress: string;
  status: "PENDING" | "ACCEPTED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID";
  isDeleted: boolean;
  paymentIntentId?: string;
}
