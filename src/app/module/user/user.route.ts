import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
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
router.get("/", auth(Role.ADMIN), userController.getAllUsers);

router.get("/customers", auth(Role.ADMIN), userController.getAllCustomers);

router.get("/technicians", auth(Role.ADMIN), userController.getAllTechnicians);

router.patch(
  "/me/image",
  upload.single("image"),
  auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER),
  userController.updateProfileImage,
);

export const userRoute = router;
