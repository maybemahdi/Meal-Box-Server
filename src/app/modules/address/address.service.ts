import AppError from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { IAddress } from "./address.interface";
import httpStatus from "http-status";
import { Address } from "./address.model";

const createAddress = async (payload: IAddress, user: Partial<IUser>) => {
  const isUserExists = await User.isUserExistsByCustomId(user?.id);
  if (!isUserExists || isUserExists.role !== user.role) {
    throw new AppError(httpStatus.NOT_FOUND, "Access denied");
  }
  const isAddressExists = await Address.findOne({
    customerId: isUserExists._id,
  });
  if (isAddressExists) {
    throw new AppError(httpStatus.CONFLICT, "Address already exists");
  }
  const address = await Address.create({
    ...payload,
    customerId: isUserExists.id,
  });
  return address;
};

const updateAddress = async (
  payload: Partial<IAddress>,
  user: Partial<IUser>,
) => {
  const isUserExists = await User.isUserExistsByCustomId(user?.id);
  if (!isUserExists || isUserExists.role !== user.role) {
    throw new AppError(httpStatus.NOT_FOUND, "Access denied");
  }
  const isAddressExists = await Address.findOne({
    customerId: isUserExists._id,
  });
  if (!isAddressExists) {
    throw new AppError(httpStatus.CONFLICT, "Address doesn't exist");
  }
  const address = await Address.findByIdAndUpdate(
    isAddressExists._id,
    payload,
    {
      new: true,
    },
  );
  return address;
};

const getMyAddress = async (user: Partial<IUser>) => {
  const isUserExists = await User.isUserExistsByCustomId(user.id);
  if (!isUserExists || isUserExists.role !== user.role) {
    throw new AppError(httpStatus.NOT_FOUND, "Access denied");
  }
  const address = await Address.findOne({
    customerId: isUserExists._id,
  });
  if (!address) {
    throw new AppError(httpStatus.NOT_FOUND, "Address not found");
  }
  return address;
};

export const AddressService = {
  createAddress,
  updateAddress,
  getMyAddress,
};
