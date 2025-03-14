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

export const OrderController = {
  createOrder,
};
