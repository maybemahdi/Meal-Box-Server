import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Meal } from "../meal/meal.model";
import { USER_ROLE } from "./user.constant";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";

const getAllUsers = async (query: Record<string, unknown>) => {
  const usersQuery = new QueryBuilder(Meal.find({ isDeleted: false }), query)
    .search(["name", "email", "phoneNumber"])
    .filter()
    .sort()
    .paginate();
  const users = await usersQuery.modelQuery.exec();
  const meta = await usersQuery.getMetaData();
  return {
    meta: { ...meta },
    users: users,
  };
};

const getMe = async (user: Partial<IUser>) => {
  const result = await User.findById(user?.id);
  return result;
};

const updateCustomerProfile = async (
  payload: Partial<IUser>,
  user: Partial<IUser>,
) => {
  const isCustomerExists = await User.findOne({
    _id: user.id,
    role: USER_ROLE.CUSTOMER,
  });
  if (!isCustomerExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid customer");
  }
  const updatedUser = await User.findByIdAndUpdate(user.id, payload, {
    new: true,
  });
  return updatedUser;
};

const updateProviderProfile = async (
  payload: Partial<IUser>,
  user: Partial<IUser>,
) => {
  const isProviderExists = await User.findOne({
    _id: user.id,
    role: USER_ROLE.PROVIDER,
  });
  if (!isProviderExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid provider");
  }
  const updatedUser = await User.findByIdAndUpdate(user.id, payload, {
    new: true,
  });
  return updatedUser;
};

export const UserService = {
  getAllUsers,
  getMe,
  updateCustomerProfile,
  updateProviderProfile,
};
