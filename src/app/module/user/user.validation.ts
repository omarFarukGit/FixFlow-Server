import { z } from "zod";

export const UpdateUserValidationZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),

  phone: z
    .string()
    .min(10, "Invalid phone number")
    .max(20, "Invalid phone number")
    .optional(),

  address: z
    .string()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  city: z.string().max(100, "City cannot exceed 100 characters").optional(),

  area: z.string().max(100, "Area cannot exceed 100 characters").optional(),
});

export const updateUserValidation = {
  UpdateUserValidationZodSchema,
};
