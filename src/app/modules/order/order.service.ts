import Stripe from "stripe";
import { IOrder } from "./order.interface";
import config from "../../config";
import { startSession } from "mongoose";
import { Order } from "./order.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Meal } from "../meal/meal.model";
import { User } from "../user/user.model";
import { sendEmail } from "../../utils/sendEmail";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2025-02-24.acacia",
});

const createOrder = async (payload: IOrder) => {
  if (!payload?.paymentMethodId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment method is required");
  }
  const session = await startSession();
  try {
    session.startTransaction();
    // checking if the customer who ordered is exist
    const isCustomerExists = await User.findById(payload.customerId).session(
      session,
    );
    if (!isCustomerExists) {
      throw new AppError(httpStatus.UNAUTHORIZED, "The customer is not found");
    }

    // Step 1: Find the meal (inside transaction)
    const productToOrder = await Meal.findById(payload?.mealId).session(
      session,
    );
    if (!productToOrder) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "The Meal you want to order is not found",
      );
    }
    if (!productToOrder.availability) {
      throw new AppError(httpStatus.FORBIDDEN, "The meal is not available");
    }
    const mealProvider = await User.findById(
      productToOrder.mealProviderId,
    ).session(session);

    if (!mealProvider) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Meal provider not found",
      );
    }
    // Step 2: Create order (without payment info yet)
    const { paymentMethodId, ...modifiedPayload } = payload;
    const order = await Order.create(
      [{ ...modifiedPayload, mealProviderId: productToOrder.mealProviderId }],
      {
        session,
      },
    );
    if (!order.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create order");
    }
    // Step 3: Process payment by creating a paymentIntent using the provided paymentMethodId
    const paymentIntent = await stripe.paymentIntents.create({
      amount: productToOrder.price * 100,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    if (!paymentIntent.id) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to process payment",
      );
    }

    // Step 4: Update Order with payment status
    if (paymentIntent.status === "succeeded") {
      order[0].paymentStatus = "PAID";
      order[0].paymentIntentId = paymentIntent.id;
      await order[0].save({ session });

      const emailToCustomerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        h1   {
            color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #059669;
            color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
        }
        .content {
            margin-top: 20px;
        }
        .order-details {
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
        }
        .footer a {
            color: #059669;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>
        <div class="content">
            <p>Dear ${isCustomerExists.name},</p>
            <p>Thank you for placing an order with us! We are excited to prepare your meal based on your dietary preferences. Here are your order details:</p>
            <div class="order-details">
                <p><strong>Meal Item:</strong> ${productToOrder.name}</p>
                <p><strong>Delivery Date:</strong> ${order[0].schedule.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long", // e.g., "Thursday"
                    year: "numeric", // e.g., "2025"
                    month: "long", // e.g., "March"
                    day: "numeric", // e.g., "26"
                  },
                )}</p>
                <p><strong>Dietary Preferences:</strong>  ${
                  Array.isArray(isCustomerExists.dietaryPreferences) &&
                  isCustomerExists.dietaryPreferences.length > 0
                    ? isCustomerExists.dietaryPreferences.join(", ")
                    : "N/A"
                }</p>
                <p><strong>Total Amount:</strong> ${productToOrder?.price} USD</p>
            </div>
            <p>Your meal will be delivered to the address provided. You will receive a notification once your order is ready for delivery.</p>
            <p>Thank you for choosing us, and we hope you enjoy your meal!</p>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to <a href=${`mailto:${config.email}`}>Contact Us</a>.</p>
        </div>
    </div>
</body>
</html>
`;
      const emailToProviderHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #059669;
            color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
        }
        .content {
            margin-top: 20px;
        }
        .order-details {
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
        }
        .footer a {
            color: #059669;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Order Received</h1>
        </div>
        <div class="content">
            <p>Dear ${mealProvider.name},</p>
            <p>You have received a new meal order from a customer. Below are the order details:</p>
            <div class="order-details">
                <p><strong>Customer Name:</strong> ${isCustomerExists.name}</p>
                <p><strong>Meal Item:</strong> ${productToOrder.name}</p>
                <p><strong>Dietary Preferences:</strong> ${
                  Array.isArray(isCustomerExists.dietaryPreferences) &&
                  isCustomerExists.dietaryPreferences.length > 0
                    ? isCustomerExists.dietaryPreferences.join(", ")
                    : "N/A"
                }</p>
                <p><strong>Delivery Date:</strong> ${order[0].schedule.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long", // e.g., "Thursday"
                    year: "numeric", // e.g., "2025"
                    month: "long", // e.g., "March"
                    day: "numeric", // e.g., "26"
                  },
                )}</p>
                <p><strong>Order Amount:</strong> ${productToOrder?.price} USD</p>
            </div>
            <p>Please review the order and prepare the meal as per the customer's preferences. Once the meal is ready, update the order status and proceed with delivery.</p>
            <p>Thank you for your service, and we appreciate your timely response!</p>
        </div>
        <div class="footer">
             <p>If you have any questions, feel free to <a href=${`mailto:${config.email}`}>Contact Us</a>.</p>
        </div>
    </div>
</body>
</html>
`;

      sendEmail(
        `Order Confirmation`,
        isCustomerExists.email,
        emailToCustomerHtml,
      );
      sendEmail(`Order Confirmation`, mealProvider.email, emailToProviderHtml);

      await session.commitTransaction();
      return {
        success: true,
        message: "Order created and payment successful",
        order: { orderId: order[0]._id },
      };
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment failed");
    }
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const OrderService = {
  createOrder,
};
