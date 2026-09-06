import express from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PaymentController } from "./payment.controller";
import { CreateCheckoutSessionValidationSchema } from "./payment.validation";

const router = express.Router();

router.post(
  "/create-checkout-session",
  auth("CUSTOMER"),
  validateRequest(CreateCheckoutSessionValidationSchema),
  PaymentController.createCheckoutSession,
);
router.post("/stripe/webhook", PaymentController.handleStripeWebhook);
export const PaymentRoutes = router;
