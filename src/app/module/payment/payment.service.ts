import httpStatus from "http-status";
import type Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/AppError";
import type {
  ICreateCheckoutSessionPayload,
  IGetAllPaymentsQuery,
  IGetMyPaymentsQuery,
} from "./payment.interface";

const createCheckoutSession = async (
  customerId: string,
  payload: ICreateCheckoutSessionPayload,
) => {
  const { serviceRequestId } = payload;

  // 1. Find customer's service request
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      customerId,
      isDeleted: false,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  // 2. Service must be completed
  if (serviceRequest.status !== "COMPLETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment is only available for completed service requests",
    );
  }

  // 3. Final price must exist
  if (!serviceRequest.finalPrice) {
    throw new AppError(httpStatus.BAD_REQUEST, "Final price is not available");
  }

  // 4. Check existing payment
  const existingPayment = await prisma.payment.findUnique({
    where: {
      serviceRequestId,
    },
  });

  if (existingPayment?.status === "PAID") {
    throw new AppError(
      httpStatus.CONFLICT,
      "Payment has already been completed",
    );
  }

  if (existingPayment?.status === "PENDING") {
    throw new AppError(httpStatus.CONFLICT, "Payment is already in progress");
  }

  // 5. Get final price
  const amount = Number(serviceRequest.finalPrice);

  // 6. Create Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "bdt",

          product_data: {
            name: serviceRequest.title,
            description: "FixFlow service payment",
          },

          unit_amount: Math.round(amount * 100),
        },

        quantity: 1,
      },
    ],

    metadata: {
      serviceRequestId: serviceRequest.id,
      customerId,
    },

    success_url:
      "http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}",

    cancel_url: "http://localhost:3000/payment/cancel",
  });

  // 7. Create payment record
  const payment = await prisma.payment.create({
    data: {
      amount: serviceRequest.finalPrice,
      currency: "BDT",
      status: "PENDING",
      method: "STRIPE",
      stripeSessionId: checkoutSession.id,
      serviceRequestId: serviceRequest.id,
      customerId,
    },
  });

  return {
    paymentId: payment.id,
    checkoutUrl: checkoutSession.url,
    amount: payment.amount,
    currency: payment.currency,
  };
};

const handleStripeWebhook = async (rawBody: Buffer, signature: string) => {
  let event: Stripe.Event;

  // Verify Stripe signature
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe_webhook_secret,
    );
  } catch {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid Stripe webhook signature",
    );
  }

  // Payment successful
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ SESSION ID:", session.id);
    console.log("✅ METADATA:", session.metadata);
    console.log("✅ PAYMENT INTENT:", session.payment_intent);

    const serviceRequestId = session.metadata?.serviceRequestId;

    if (!serviceRequestId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Service request ID missing from Stripe session",
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        serviceRequestId,
      },
    });

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    // Prevent duplicate webhook processing
    if (payment.status === "PAID") {
      return {
        received: true,
      };
    }

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "PAID",
        transactionId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
      },
    });
  }

  return {
    received: true,
  };
};

const getMyPayments = async (
  customerId: string,
  query: IGetMyPaymentsQuery,
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { status } = query;

  const skip = (page - 1) * limit;

  const where = {
    customerId,
    ...(status && { status }),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        method: true,
        transactionId: true,
        stripeSessionId: true,
        serviceRequestId: true,
        createdAt: true,
        updatedAt: true,

        serviceRequest: {
          select: {
            id: true,
            title: true,
            status: true,
            finalPrice: true,
          },
        },
      },
    }),

    prisma.payment.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: payments,
  };
};

const getAllPayments = async (query: IGetAllPaymentsQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { status } = query;

  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        method: true,
        transactionId: true,
        stripeSessionId: true,
        serviceRequestId: true,
        customerId: true,
        createdAt: true,
        updatedAt: true,

        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

        serviceRequest: {
          select: {
            id: true,
            title: true,
            status: true,
            finalPrice: true,
          },
        },
      },
    }),

    prisma.payment.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: payments,
  };
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  getMyPayments,
  getAllPayments,
};
