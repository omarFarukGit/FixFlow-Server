import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { updateUserValidation } from "./user.validation";

const router = Router();

router.get(
  "/me",
  auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER),
  userController.me,
);
router.patch(
  "/me",
  validateRequest(updateUserValidation.UpdateUserValidationZodSchema),
  auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER),
  userController.updateMe,
);
export const userRoute = router;
