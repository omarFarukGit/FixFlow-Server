import { z } from "zod";

export const GetAuditLogsValidationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  action: z.string().optional(),

  entity: z.string().optional(),

  userId: z.uuid("Invalid user ID").optional(),
});
