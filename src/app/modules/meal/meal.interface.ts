import { Types } from "mongoose";

export interface IMeal {
  mealProviderId: Types.ObjectId;
  name: string;
  description: string;
  image: string;
  ingredients: string[];
  portionSize: string;
  price: number;
  availability: boolean;
  ratings: number;
  isDeleted: boolean;
} 