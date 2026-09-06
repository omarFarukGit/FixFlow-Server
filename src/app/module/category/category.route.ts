import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { CategoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.CreateCategoryValidationSchema),
  CategoryController.createCategory,
);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.UpdateCategoryValidationSchema),
  CategoryController.updateCategory,
);
router.delete("/:id", auth(Role.ADMIN), CategoryController.deleteCategory);

export const categoryRoutes = router;
