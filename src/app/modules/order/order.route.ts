import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { createOrderValidationSchema } from "./order.validation";
import { OrderController } from "./order.controller";

const OrderRoutes = Router();

OrderRoutes.post(
  "/",
  auth(USER_ROLE.CUSTOMER),
  validateRequest(createOrderValidationSchema),
  OrderController.createOrder,
);

export default OrderRoutes;
