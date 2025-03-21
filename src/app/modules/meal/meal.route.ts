import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { upload } from "../../utils/sendImageToCloudinary";
import { MealController } from "./meal.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createMealValidation, updateMealValidation } from "./meal.validation";

const MealRoutes = Router();

MealRoutes.post(
  "/",
  auth(USER_ROLE.PROVIDER),
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createMealValidation),
  MealController.createMeal,
);

MealRoutes.get(
  "/",
  // auth(USER_ROLE.PROVIDER, USER_ROLE.CUSTOMER, USER_ROLE.ADMIN),
  MealController.getAllMeal,
);

MealRoutes.get(
  "/provider",
  auth(USER_ROLE.PROVIDER),
  MealController.getAllMealByProvider,
);

MealRoutes.get(
  "/:id",
  // auth(USER_ROLE.PROVIDER, USER_ROLE.CUSTOMER, USER_ROLE.ADMIN),
  MealController.getSingleMeal,
);

MealRoutes.patch(
  "/:id",
  auth(USER_ROLE.PROVIDER),
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(updateMealValidation),
  MealController.updateMeal,
);

MealRoutes.delete("/:id", auth(USER_ROLE.PROVIDER), MealController.deleteMeal);

export default MealRoutes;
