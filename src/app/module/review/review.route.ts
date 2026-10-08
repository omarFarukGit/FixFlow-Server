import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewController } from "./review.controller";
import { CreateReviewValidationSchema } from "./review.validation";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(CreateReviewValidationSchema),
  ReviewController.createReview,
);

/* Customer */
router.get("/my", auth(Role.CUSTOMER), ReviewController.getCustomerReviews);

/* Technician */
router.get(
  "/technician",
  auth(Role.TECHNICIAN),
  ReviewController.getTechnicianReviews,
);

/* Admin */
router.get("/admin", auth(Role.ADMIN), ReviewController.getAllReviews);

export const ReviewRoutes = router;
