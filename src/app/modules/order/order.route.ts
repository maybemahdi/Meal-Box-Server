import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
} from "./order.validation";
import { OrderController } from "./order.controller";

const OrderRoutes = Router();

OrderRoutes.post(
  "/",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER),
  validateRequest(createOrderValidationSchema),
  OrderController.createOrder,
);

OrderRoutes.get(
  "/get-orders-for-provider",
  auth(USER_ROLE.PROVIDER),
  OrderController.getOrdersForProvider,
);

OrderRoutes.patch(
  "/change-status/:id",
  auth(USER_ROLE.PROVIDER),
  validateRequest(updateOrderStatusValidationSchema),
  OrderController.updateOrderStatus,
);

OrderRoutes.get(
  "/get-orders-for-customer",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER, USER_ROLE.ADMIN), // Use case as --get my order for every role, but (route name mistakenly used as "get-orders-for-customer").
  OrderController.getOrdersForCustomer,
);

export default OrderRoutes;
