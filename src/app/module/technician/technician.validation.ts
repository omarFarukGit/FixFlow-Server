import { z } from "zod";

export const UpdateTechnicianProfileValidationSchema = z.object({
  bio: z.string().max(1000).optional(),

  experienceYears: z.number().int().min(0).max(50).optional(),

  skills: z.array(z.string().min(1).max(100)).min(1).optional(),

  hourlyRate: z.number().positive().optional(),
});

export const technicianValidation = {
  UpdateTechnicianProfileValidationSchema,
};
