import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { IMeal } from "./meal.interface";
import httpStatus from "http-status";
import { Meal } from "./meal.model";
import { USER_ROLE } from "../user/user.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import { IUser } from "../user/user.interface";

const createMeal = async (
  payload: IMeal,
  imageUrl: string,
  user: Partial<IUser>,
) => {
  const provider = await User.findOne({
    _id: user?.id,
    role: USER_ROLE.PROVIDER,
  });
  if (!provider) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid meal provider");
  }
  const result = await Meal.create({
    ...payload,
    image: imageUrl,
    mealProviderId: provider.id,
  });
  return result;
};

const getAllMeal = async (query: Record<string, unknown>) => {
  const mealsQuery = new QueryBuilder(Meal.find({ isDeleted: false }), query)
    .search(["name", "description", "ingredients"])
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

const getAllMealByProvider = async (query: Record<string, unknown>, user: Partial<IUser>) => {
  const mealsQuery = new QueryBuilder(
    Meal.find({ isDeleted: false, mealProviderId: user?.id }),
    query,
  )
    .search(["name", "description", "ingredients"])
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
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }
  return meal;
};

const updateMeal = async (
  payload: Partial<IMeal>,
  imageUrl: string,
  user: Partial<IUser>,
  id: string,
) => {
  const provider = await User.findOne({
    _id: user?.id,
    role: USER_ROLE.PROVIDER,
  });
  if (!provider) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid meal provider");
  }
  // Find the existing meal first
  const existingMeal = await Meal.findById(id);

  if (!existingMeal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  // Merge existing image if no new one is provided
  const updatedData = {
    ...payload,
    image: imageUrl || existingMeal.image,
  };

  const result = await Meal.findByIdAndUpdate(id, updatedData, { new: true });
  return result;
};

const deleteMeal = async (user: Partial<IUser>, id: string) => {
  const provider = await User.findOne({
    _id: user?.id,
    role: USER_ROLE.PROVIDER,
  });
  if (!provider) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid meal provider");
  }
  const doesProviderOwnTheMeal = await Meal.findOne({
    _id: id,
    mealProviderId: user?.id,
  });
  if (!doesProviderOwnTheMeal) {
    throw new AppError(httpStatus.FORBIDDEN, "You don't own this meal");
  }
  // Find the existing meal first
  const existingMeal = await Meal.findById(id);

  if (!existingMeal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }
  const result = await Meal.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const MealService = {
  createMeal,
  getAllMeal,
  getAllMealByProvider,
  getSingleMeal,
  updateMeal,
  deleteMeal,
};
