import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { postContactMessageValidationSchema } from "./contact.validation";
import { ContactController } from "./contact.controller";

const ContactRoutes = Router();

ContactRoutes.post(
  "/",
  validateRequest(postContactMessageValidationSchema),
  ContactController.postContactMessage,
);

export default ContactRoutes;
