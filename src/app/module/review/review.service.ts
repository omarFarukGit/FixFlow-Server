import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

import type {
  ICreateReviewPayload,
  IGetReviewsQuery,
} from "./review.interface";

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

  const ratingSummary = await prisma.review.aggregate({
    where: {
      technicianId: serviceRequest.technicianId,
    },
    _avg: {
      rating: true,
    },
  });

  const averageRating = ratingSummary._avg.rating ?? 0;

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

const getCustomerReviews = async (
  customerId: string,
  query: IGetReviewsQuery,
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { rating } = query;

  const skip = (page - 1) * limit;

  const where = {
    reviewerId: customerId,
    ...(rating && {
      rating,
    }),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        rating: true,
        comment: true,
        serviceRequestId: true,
        reviewerId: true,
        technicianId: true,
        createdAt: true,
        updatedAt: true,

        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,

            technicianProfile: {
              select: {
                bio: true,
                experienceYears: true,
                averageRating: true,
                totalJobs: true,
              },
            },
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

    prisma.review.count({
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

    data: reviews,
  };
};

const getTechnicianReviews = async (
  technicianId: string,
  query: IGetReviewsQuery,
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { rating } = query;

  const skip = (page - 1) * limit;

  const where = {
    technicianId,
    ...(rating && {
      rating,
    }),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        rating: true,
        comment: true,
        serviceRequestId: true,
        reviewerId: true,
        technicianId: true,
        createdAt: true,
        updatedAt: true,

        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
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

    prisma.review.count({
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

    data: reviews,
  };
};

const getAllReviews = async (query: IGetReviewsQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { rating } = query;

  const skip = (page - 1) * limit;

  const where = {
    ...(rating && {
      rating,
    }),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        rating: true,
        comment: true,
        serviceRequestId: true,
        reviewerId: true,
        technicianId: true,
        createdAt: true,
        updatedAt: true,

        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
          },
        },

        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,

            technicianProfile: {
              select: {
                averageRating: true,
                totalJobs: true,
              },
            },
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

    prisma.review.count({
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

    data: reviews,
  };
};

export const ReviewService = {
  createReview,
  getCustomerReviews,
  getTechnicianReviews,
  getAllReviews,
};
