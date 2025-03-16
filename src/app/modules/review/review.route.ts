import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { createReviewValidation } from "./review.validation";
import { ReviewController } from "./review.controller";

const ReviewRoutes = Router();

ReviewRoutes.post(
  "/",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER, USER_ROLE.ADMIN),
  validateRequest(createReviewValidation),
  ReviewController.createReview,
);

export default ReviewRoutes;
