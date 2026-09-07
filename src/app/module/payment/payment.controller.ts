import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type {
  IGetAllPaymentsQuery,
  IGetMyPaymentsQuery,
} from "./payment.interface";
import { PaymentService } from "./payment.service";

const createCheckoutSession = catchAsync(async (req, res) => {
  const customerId = req.user?.userId as string;

  const result = await PaymentService.createCheckoutSession(
    customerId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
});

const handleStripeWebhook = catchAsync(async (req, res) => {
  console.log("🔥 STRIPE WEBHOOK RECEIVED");
  const signature = req.headers["stripe-signature"];

  if (!signature || Array.isArray(signature)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Stripe signature is missing",
    });
  }

  const result = await PaymentService.handleStripeWebhook(req.body, signature);

  return res.status(httpStatus.OK).json(result);
});

const getMyPayments = catchAsync(async (req, res) => {
  const customerId = req.user?.userId as string;

  const result = await PaymentService.getMyPayments(
    customerId,
    req.query as unknown as IGetMyPaymentsQuery,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPayments(
    req.query as unknown as IGetAllPaymentsQuery,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All payments retrieved successfully",
    data: result,
  });
});
export const PaymentController = {
  createCheckoutSession,
  handleStripeWebhook,
  getMyPayments,
  getAllPayments,
};
