import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { technicianController } from "./technician.controller";
import { technicianValidation } from "./technician.validation";

const router = Router();

router.patch(
  "/me/profile",
  auth("TECHNICIAN"),
  validateRequest(technicianValidation.UpdateTechnicianProfileValidationSchema),
  technicianController.updateMyProfile,
);
router.patch(
  "/:technicianId/approve",
  auth("ADMIN"),
  technicianController.approveTechnician,
);

export const technicianRoute = router;
