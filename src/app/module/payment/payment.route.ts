import express from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidationZodSchema } from "./payment.validation";

const router = express.Router();

router.post(
  "/create-checkout-session",
  auth(Role.CUSTOMER),
  validateRequest(
    PaymentValidationZodSchema.CreateCheckoutSessionValidationSchema,
  ),
  PaymentController.createCheckoutSession,
);
// router.post("/stripe/webhook", PaymentController.handleStripeWebhook);
router.get(
  "/my-payments",
  auth(Role.CUSTOMER),
  PaymentController.getMyPayments,
);

router.get("/", auth(Role.ADMIN), PaymentController.getAllPayments);
export const PaymentRoutes = router;
