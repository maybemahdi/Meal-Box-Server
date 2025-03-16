import { z } from "zod";

// export const userValidationSchema = z
//   .object({
//     name: z
//       .string({
//         required_error: "name is required",
//       })
//       .nonempty("name cannot be empty"),
//     email: z
//       .string({
//         required_error: "email is required",
//       })
//       .email("email must be a valid email address"),
//     phoneNumber: z
//       .string({
//         required_error: "email is required",
//       })
//     password: z
//       .string({
//         required_error: "Password is required",
//       })
//       .min(6, "Password must be at least 6 characters long"),
//     role: z.enum([USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER, USER_ROLE.ADMIN], {
//       required_error: "Account type is required",
//     }),
//     isBlocked: z.boolean().optional().default(false),
//     isDeleted: z.boolean().optional().default(false),
//   })
//   .strict();

export const updateCustomerProfileValidationSchema = z
  .object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    dietaryPreferences: z.array(z.string()).optional(),
  })
  .strict();
export const updateProviderProfileValidationSchema = z
  .object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    cuisineSpecialties: z.array(z.string()).optional(),
  })
  .strict();
