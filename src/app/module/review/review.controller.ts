import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import { ReviewValidationSchema } from "./review.validation";

const createReview = catchAsync(async (req, res) => {
  const customerId = req.user?.userId as string;

  const result = await ReviewService.createReview(customerId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getCustomerReviews = catchAsync(async (req, res) => {
  const query = ReviewValidationSchema.GetReviewsValidationSchema.parse(
    req.query,
  );
  const customerId = req.user?.userId as string;

  const result = await ReviewService.getCustomerReviews(customerId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getTechnicianReviews = catchAsync(async (req, res) => {
  const query = ReviewValidationSchema.GetReviewsValidationSchema.parse(
    req.query,
  );
  const technicianId = req.user?.userId as string;

  const result = await ReviewService.getTechnicianReviews(technicianId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const query = ReviewValidationSchema.GetReviewsValidationSchema.parse(
    req.query,
  );

  const result = await ReviewService.getAllReviews(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const ReviewController = {
  createReview,
  getCustomerReviews,
  getTechnicianReviews,
  getAllReviews,
};
