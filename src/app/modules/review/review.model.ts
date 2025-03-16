import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const ReviewSchema = new Schema<IReview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
  },
  mealId: {
    type: Schema.Types.ObjectId,
    ref: "Meal",
    required: [true, "mealId is required"],
  },
  comment: { type: String, required: [true, "comment is required"] },
  rating: { type: Number, required: [true, "rating is required"] },
  isDeleted: { type: Boolean, default: false },
});

export const Review = model<IReview>("Review", ReviewSchema);
