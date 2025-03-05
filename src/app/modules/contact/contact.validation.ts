import { z } from "zod";

export const postContactMessageValidationSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .nonempty("Name cannot be empty"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Email must be a valid email address"),
    subject: z.string({
      required_error: "Subject is required",
    }),
    message: z
      .string({
        required_error: "Message is required",
      })
      .max(500, "Message length must be less than 500 characters"),
  })
  .strict();
