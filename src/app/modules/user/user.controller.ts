import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    success: true,
    message: "Shipping Status Updated",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const UserController = {
  getAllUsers,
};