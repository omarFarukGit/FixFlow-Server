import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ServiceRequestService } from "./service-request.service";
import { ServiceRequestValidationSchema } from "./service-request.validation";

const createServiceRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId as string;

  const result = await ServiceRequestService.createServiceRequest(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Service request created successfully",
    data: result,
  });
});

const getMyServiceRequests = catchAsync(async (req, res) => {
  const customerId = req.user?.userId as string;

  const query =
    ServiceRequestValidationSchema.GetMyServiceRequestsValidationSchema.parse(
      req.query,
    );

  const result = await ServiceRequestService.getMyServiceRequests(
    customerId,
    query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service requests retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMyServiceRequestById = catchAsync(async (req, res) => {
  const customerId = req.user?.userId as string;
  const { id } = req.params;

  const result = await ServiceRequestService.getMyServiceRequestById(
    customerId,
    id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service request retrieved successfully",
    data: result,
  });
});

const updateMyServiceRequest = catchAsync(async (req, res) => {
  const customerId = req.user?.userId as string;
  const { id } = req.params;

  const result = await ServiceRequestService.updateMyServiceRequest(
    customerId,
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service request updated successfully",
    data: result,
  });
});

const cancelMyServiceRequest = catchAsync(async (req, res) => {
  const customerId = req.user?.userId as string;
  const { id } = req.params;

  const result = await ServiceRequestService.cancelMyServiceRequest(
    customerId,
    id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service request cancelled successfully",
    data: result,
  });
});
export const ServiceRequestController = {
  createServiceRequest,
  getMyServiceRequests,
  getMyServiceRequestById,
  updateMyServiceRequest,
  cancelMyServiceRequest,
};
