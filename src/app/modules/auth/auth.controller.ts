import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../config";
import { AuthService } from "./auth.service";
import AppError from "../../errors/AppError";

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserIntoDB(req?.body);
  sendResponse(res, {
    success: true,
    message: "User registered successfully",
    statusCode: httpStatus.CREATED,
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { accessToken, email, role, name, id } = result;

  res.cookie("token", accessToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: {
      id,
      name,
      email,
      role,
      accessToken: accessToken,
    },
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req?.body?.email;
  const result = await AuthService.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset link has been sent!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong !");
  }

  const result = await AuthService.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(req.body, req.user);
  sendResponse(res, {
    success: result?.success,
    statusCode: httpStatus.OK,
    message: result?.message,
  });
});

const updatedUserStatus = catchAsync(async (req, res) => {
  const payload = req?.body;
  const result = await AuthService.updatedUserStatus(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User is ${payload?.status ? "Blocked" : "Active"} now`,
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  updatedUserStatus,
};
