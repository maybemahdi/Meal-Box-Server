import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createOrder(req.body);
  sendResponse(res, {
    success: true,
    message: "Order created successfully",
    statusCode: 201,
    data: result,
  });
});

const getOrdersForProvider = catchAsync(async (req, res) => {
  const result = await OrderService.getOrdersForProvider(req.user, req.query);
  sendResponse(res, {
    success: true,
    message: "Orders retrieved successfully",
    statusCode: 200,
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const result = await OrderService.updateOrderStatus(
    req.body.status,
    req.params.id,
  );
  sendResponse(res, {
    success: true,
    message: "Order status updated successfully",
    statusCode: 200,
    data: result,
  });
});

const getOrdersForCustomer = catchAsync(async (req, res) => {
  const result = await OrderService.getOrdersForCustomer(req.user, req.query);
  sendResponse(res, {
    success: true,
    message: "Orders retrieved successfully",
    statusCode: 200,
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getOrdersForProvider,
  updateOrderStatus,
  getOrdersForCustomer
};
