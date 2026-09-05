import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { technicianProfileController } from "./technician.controller";
import { technicianValidation } from "./technician.validation";

const router = Router();

router.patch(
  "/me/profile",
  auth("TECHNICIAN"),
  validateRequest(technicianValidation.UpdateTechnicianProfileValidationSchema),
  technicianProfileController.updateMyProfile,
);

export const technicianRoute = router;
