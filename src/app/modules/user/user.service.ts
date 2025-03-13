import { IUser } from "./user.interface";
import { User } from "./user.model";

const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

const getMe = async (user: Partial<IUser>) => {
  const result = await User.findById(user?.id);
  return result;
};

export const UserService = {
  getAllUsers,
  getMe,
};
