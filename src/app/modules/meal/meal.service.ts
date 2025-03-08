import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { IMeal } from "./meal.interface";
import httpStatus from "http-status";
import { Meal } from "./meal.model";
import { USER_ROLE } from "../user/user.constant";
import QueryBuilder from "../../builder/QueryBuilder";

const createMeal = async (payload: IMeal, imageUrl: string) => {
  const provider = await User.findOne({
    _id: payload?.mealProviderId,
    role: USER_ROLE.PROVIDER,
  });
  if (!provider) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid meal provider");
  }
  const result = await Meal.create({ ...payload, image: imageUrl });
  return result;
};

const getAllMeal = async (query: Record<string, unknown>) => {
  const mealsQuery = new QueryBuilder(Meal.find({ isDeleted: false }), query)
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate();
  const meals = await mealsQuery.modelQuery.exec();
  const meta = await mealsQuery.getMetaData();

  return {
    meta: { ...meta },
    meals: meals,
  };
};

const getSingleMeal = async (id: string) => {
  const meal = await Meal.findById(id);
  if (!meal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found")
  }
  return meal;
};

export const MealService = {
  createMeal,
  getAllMeal,
  getSingleMeal,
};
