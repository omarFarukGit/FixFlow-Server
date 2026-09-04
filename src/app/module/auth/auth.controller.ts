import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.register(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "verification otp send your mail",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await authServices.verifyUserEmail(
    req.body,
  );
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email verified successfully",
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await authServices.login(req.body);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken
    ? req.cookies.refreshToken
    : req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization?.split(" ")[1]
      : req.headers.authorization;
  const { accessToken, refreshToken } = await authServices.refreshToken(
    token as string,
  );
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token successful",
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
});

export const authController = {
  register,
  verifyEmail,
  login,
  refreshToken,
};
