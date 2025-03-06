import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import {
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidationSchema,
} from "./auth.validation";

const AuthRoutes = Router();

AuthRoutes.post(
  "/register",
  validateRequest(registerUserValidation),
  AuthController.registerUser,
);
AuthRoutes.post(
  "/login",
  validateRequest(loginUserValidation),
  AuthController.loginUser,
);
AuthRoutes.post(
  "/forget-password",
  validateRequest(forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);
AuthRoutes.post(
  "/reset-password",
  validateRequest(resetPasswordValidationSchema),
  AuthController.resetPassword,
);
AuthRoutes.patch(
  "/change-password",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER, USER_ROLE.ADMIN),
  validateRequest(changePasswordValidationSchema),
  AuthController.changePassword,
);
AuthRoutes.patch(
  "/update-user-status",
  auth(USER_ROLE.ADMIN),
  AuthController.updatedUserStatus,
);

export default AuthRoutes;
