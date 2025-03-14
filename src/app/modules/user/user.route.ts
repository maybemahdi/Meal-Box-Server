import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";
import {
  updateCustomerProfileValidationSchema,
  updateProviderProfileValidationSchema,
} from "./user.validation";

const UserRoutes = Router();

UserRoutes.get("/", auth(USER_ROLE.ADMIN), UserController.getAllUsers);
UserRoutes.get(
  "/get-me",
  auth(USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER),
  UserController.getMe,
);
UserRoutes.patch(
  "/update-customer-profile",
  auth(USER_ROLE.CUSTOMER),
  validateRequest(updateCustomerProfileValidationSchema),
  UserController.updateCustomerProfile,
);
UserRoutes.patch(
  "/update-provider-profile",
  auth(USER_ROLE.PROVIDER),
  validateRequest(updateProviderProfileValidationSchema),
  UserController.updateProviderProfile,
);

export default UserRoutes;
