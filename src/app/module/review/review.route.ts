import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewController } from "./review.controller";
import { CreateReviewValidationSchema } from "./review.validation";

const router = Router();

router.post(
  "/",
  auth("CUSTOMER"),
  validateRequest(CreateReviewValidationSchema),
  ReviewController.createReview,
);

export const ReviewRoutes = router;
