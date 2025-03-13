import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createAddressValidationSchema,
  updatedAddressValidationSchema,
} from "./address.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { AddressController } from "./address.controller";

const AddressRoutes = Router();

AddressRoutes.post(
  "/",
  auth(USER_ROLE.CUSTOMER),
  validateRequest(createAddressValidationSchema),
  AddressController.createAddress,
);

AddressRoutes.patch(
  "/",
  auth(USER_ROLE.CUSTOMER),
  validateRequest(updatedAddressValidationSchema),
  AddressController.updateAddress,
);

AddressRoutes.get(
  "/get-my-address",
  auth(USER_ROLE.CUSTOMER),
  AddressController.getMyAddress,
);

export default AddressRoutes;
