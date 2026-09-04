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

router.post(
  "/login",
  validateRequest(UserValidation.UserLoginZodSchema),
  authController.login,
);

router.post("/refresh-token", authController.refreshToken);

router.post(
  "/forgot-password",
  validateRequest(UserValidation.UserForgotPasswordZodSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest(UserValidation.UserResetPasswordZodSchema),
  authController.resetPassword,
);
export const authRoutes = router;
