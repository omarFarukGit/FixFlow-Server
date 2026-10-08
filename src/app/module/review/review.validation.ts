import { z } from "zod";

export const CreateReviewValidationSchema = z.object({
  serviceRequestId: z.uuid("Invalid service request ID"),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters")
    .optional(),
});

const GetReviewsValidationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  rating: z.coerce.number().int().min(1).max(5).optional(),
});

export const ReviewValidationSchema = {
  GetReviewsValidationSchema,
};
