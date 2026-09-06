import { z } from "zod";

export const CreateCheckoutSessionValidationSchema = z.object({
  serviceRequestId: z.uuid("Invalid service request ID"),
});

export const GetMyPaymentsValidationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z
    .enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"])
    .optional(),
});

export const GetAllPaymentsValidationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z
    .enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"])
    .optional(),
});
