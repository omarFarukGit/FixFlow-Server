import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

const me = catchAsync(async (req, res) => {
  const userId = req?.user?.userId as string;

  const result = await userService.me(userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User information retrieved successfully",
    data: result,
  });
});

const updateMe = catchAsync(async (req, res) => {
  const userId = req?.user?.userId as string;

  const result = await userService.updateMe(userId, req.body);

  console.log(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User information updated successfully",
    data: result,
  });
});

const updateProfileImage = catchAsync(async (req, res) => {
  const userId = req?.user?.userId as string;

  const result = await userService.updateProfileImage(
    userId,
    req.file?.buffer as Buffer,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile image updated successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllCustomers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers({
    ...req.query,
    role: "CUSTOMER",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customers retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllTechnicians = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers({
    ...req.query,
    role: "TECHNICIAN",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technicians retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const userController = {
  me,
  updateMe,
  updateProfileImage,
  getAllUsers,
  getAllCustomers,
  getAllTechnicians,
};
