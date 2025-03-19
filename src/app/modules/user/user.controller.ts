import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse(res, {
    success: true,
    message: "Users retrieved successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await UserService.getMe(req?.user);
  sendResponse(res, {
    success: true,
    message: "Get me retrieved successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateCustomerProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateCustomerProfile(req.body, req.user);
  sendResponse(res, {
    success: true,
    message: "Profile updated successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateProviderProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateProviderProfile(req.body, req.user);
  sendResponse(res, {
    success: true,
    message: "Profile updated successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getMe,
  updateCustomerProfile,
  updateProviderProfile,
};
