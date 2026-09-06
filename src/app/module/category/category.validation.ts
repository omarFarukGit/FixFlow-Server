import { z } from "zod";

const CreateCategoryValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  imageUrl: z.url("Invalid image URL").optional(),
});

const UpdateCategoryValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  imageUrl: z.url("Invalid image URL").optional(),

  isActive: z.boolean().optional(),
});

export const categoryValidation = {
  CreateCategoryValidationSchema,
  UpdateCategoryValidationSchema,
};
