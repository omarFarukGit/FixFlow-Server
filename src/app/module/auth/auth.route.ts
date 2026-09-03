import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { UserValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(UserValidation.UserRegistrationZodSchema),
  authController.register,
);
router.post(
  "/verify-email",
  validateRequest(UserValidation.UserEmailVerifyZodSchema),
  authController.verifyEmail,
);

export const authRoutes = router;
