import { z } from "zod";

export const createMealValidation = z
  .object({
    mealProviderId: z
      .string({ required_error: "Meal Provider id is required" })
      .nonempty(),
    name: z.string({ required_error: "Meal name is required" }).nonempty(),
    description: z
      .string({ required_error: "Meal description is required" })
      .nonempty(),
    ingredients: z
      .array(z.string({ required_error: "Ingredients are required" }))
      .nonempty(),
    portionSize: z
      .string({ required_error: "Portion size is required" })
      .nonempty(),
    price: z.number({ required_error: "Price is required" }).positive(),
    availability: z.boolean(),
  })
  .strict();
