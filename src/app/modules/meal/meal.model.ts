import { model, Schema } from "mongoose";
import { IMeal } from "./meal.interface";

const MealSchema = new Schema<IMeal>(
  {
    mealProviderId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    description: String,
    image: String,
    ingredients: [String],
    portionSize: String,
    price: { type: Number, required: [true, "Price is required"] },
    availability: Boolean,
    ratings: { type: Number, default: 0.0 },
    totalRatings: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Meal = model<IMeal>("Meal", MealSchema);
