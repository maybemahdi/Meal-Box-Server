import { z } from "zod";
import { USER_ROLE } from "../user/user.constant";

// Validation for user registration
export const registerUserValidation = z
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
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters long"),
    role: z.enum([USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER], {
      required_error: "Account type is required",
    }),
  })
  .strict();

// Validation for user login
export const loginUserValidation = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Email must be a valid email address"),
    password: z.string({
      required_error: "Password is required",
    }),
    rememberMe: z.boolean().default(false).optional(),
  })
  .strict();

export const forgetPasswordValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Email must be a valid email address"),
});

export const resetPasswordValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Email must be a valid email address"),
  newPassword: z
    .string({
      required_error: "User password is required!",
    })
    .min(6, "Password must be at least 6 characters long"),
});
export const changePasswordValidationSchema = z.object({
  oldPassword: z
    .string({
      required_error: "Old password is required!",
    })
    .min(6, "Old Password must be at least 6 characters long"),
  newPassword: z
    .string({
      required_error: "New password is required!",
    })
    .min(6, "New Password must be at least 6 characters long"),
});

// Types inferred from the Zod schemas
export type RegisterUserValidationType = z.infer<typeof registerUserValidation>;
export type LoginUserValidationType = z.infer<typeof loginUserValidation>;
