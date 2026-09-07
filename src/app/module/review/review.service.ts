import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { ICreateReviewPayload } from "./review.interface";

const createReview = async (
  customerId: string,
  payload: ICreateReviewPayload,
) => {
  const { serviceRequestId, rating, comment } = payload;

  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      customerId,
      isDeleted: false,
    },
    include: {
      payment: true,
      review: true,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  if (serviceRequest.status !== "COMPLETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Review is only available for completed service requests",
    );
  }

  if (!serviceRequest.technicianId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No technician is assigned to this service request",
    );
  }

  if (serviceRequest.payment?.status !== "PAID") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Review is only available after successful payment",
    );
  }

  if (serviceRequest.review) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Review has already been submitted",
    );
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      serviceRequestId,
      reviewerId: customerId,
      technicianId: serviceRequest.technicianId,
    },
  });

  // Calculate technician's new average rating
  const ratingSummary = await prisma.review.aggregate({
    where: {
      technicianId: serviceRequest.technicianId,
    },
    _avg: {
      rating: true,
    },
  });

  const averageRating = ratingSummary._avg.rating ?? 0;

  // Update technician profile rating
  await prisma.technicianProfile.update({
    where: {
      userId: serviceRequest.technicianId,
    },
    data: {
      averageRating,
    },
  });

  return review;
};

export const ReviewService = {
  createReview,
};
