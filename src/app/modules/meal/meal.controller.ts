/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MealService } from "./meal.service";
import httpStatus from "http-status";

const createMeal = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image is required");
  }
  const imageUrl = (req.file as any).path;
  const result = await MealService.createMeal(req.body, imageUrl, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Meal created successfully",
    data: result,
  });
});

const getAllMeal = catchAsync(async (req, res) => {
  const result = await MealService.getAllMeal(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Meals retrieved successfully",
    data: result,
  });
});

const getSingleMeal = catchAsync(async (req, res) => {
  const result = await MealService.getSingleMeal(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Meal retrieved successfully",
    data: result,
  });
});

const updateMeal = catchAsync(async (req, res) => {
  const imageUrl = req.file ? (req.file as any).path : undefined;

  const result = await MealService.updateMeal(
    req.body,
    imageUrl,
    req.user,
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Meal updated successfully",
    data: result,
  });
});

export const MealController = {
  createMeal,
  getAllMeal,
  getSingleMeal,
  updateMeal,
};
