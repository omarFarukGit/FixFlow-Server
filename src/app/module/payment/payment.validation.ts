import { z } from "zod";

const CreateCheckoutSessionValidationSchema = z.object({
  serviceRequestId: z.uuid("Invalid service request ID"),
});

const GetMyPaymentsValidationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z
    .enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"])
    .optional(),
});

const GetAllPaymentsValidationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z
    .enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"])
    .optional(),
});

export const PaymentValidationZodSchema = {
  CreateCheckoutSessionValidationSchema,
  GetMyPaymentsValidationSchema,
  GetAllPaymentsValidationSchema,
};
