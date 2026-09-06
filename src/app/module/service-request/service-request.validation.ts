import { z } from "zod";

const CreateServiceRequestValidationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address cannot exceed 255 characters"),

  city: z.string().max(100, "City cannot exceed 100 characters").optional(),

  area: z.string().max(100, "Area cannot exceed 100 characters").optional(),

  scheduledAt: z.iso.datetime().optional(),

  estimatedPrice: z.number().positive().optional(),

  categoryId: z.uuid("Invalid category ID"),
});

const GetMyServiceRequestsValidationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z
    .enum([
      "PENDING",
      "ACCEPTED",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),

  search: z.string().trim().max(100).optional(),

  sortBy: z
    .enum(["createdAt", "scheduledAt", "estimatedPrice", "finalPrice"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const UpdateServiceRequestValidationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  city: z.string().max(100, "City cannot exceed 100 characters").optional(),

  area: z.string().max(100, "Area cannot exceed 100 characters").optional(),

  scheduledAt: z.iso.datetime().optional(),

  estimatedPrice: z
    .number()
    .positive("Estimated price must be greater than 0")
    .optional(),

  categoryId: z.uuid("Invalid category ID").optional(),
});

const GetAllServiceRequestsValidationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z
    .enum([
      "PENDING",
      "ACCEPTED",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),

  search: z.string().trim().max(100).optional(),

  city: z.string().trim().max(100).optional(),

  area: z.string().trim().max(100).optional(),

  sortBy: z
    .enum(["createdAt", "scheduledAt", "estimatedPrice", "finalPrice"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const AssignTechnicianValidationSchema = z.object({
  technicianId: z.uuid("Invalid technician ID"),
});

const CompleteServiceRequestValidationSchema = z.object({
  finalPrice: z.number().positive("Final price must be greater than 0"),
});
export const ServiceRequestValidationSchema = {
  CreateServiceRequestValidationSchema,
  GetMyServiceRequestsValidationSchema,
  UpdateServiceRequestValidationSchema,
  GetAllServiceRequestsValidationSchema,
  AssignTechnicianValidationSchema,
  CompleteServiceRequestValidationSchema,
};
