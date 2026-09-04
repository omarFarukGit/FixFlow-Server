import crypto from "node:crypto";
import path from "node:path";
import bcrypt from "bcryptjs";
import ejs from "ejs";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { UserStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import transporter from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import redisClient from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";
import type {
  ILoginPayload,
  IRegisterPayload,
  IVerifyEmailPayload,
} from "./auth.interface";

const register = async (payload: IRegisterPayload) => {
  const { name, email, password, role } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User with this email already exists",
    );
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const expirationSeconds = 5 * 60;
  const otpKey = `user-registation-otp:${email}`;
  const otpValue = crypto.randomInt(100000, 1000000).toString();
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });
  const userRegistrationKey = `user-registration-data:${email}`;

  const redisUserRegistrationData = {
    name,
    email,
    password: hashedPassword,
    role,
  };

  await redisClient.set(
    userRegistrationKey,
    JSON.stringify(redisUserRegistrationData),
    {
      expiration: {
        type: "EX",
        value: expirationSeconds,
      },
    },
  );

  const templatePath = path.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs",
  );

  const templateData = {
    name,
    email,
    otp: otpValue,
    expirationMinutes: expirationSeconds / 60,
    year: new Date().getFullYear(),
  };
  const html = await ejs.renderFile(templatePath, templateData);

  await transporter.sendMail({
    from: `"FixFlow" <${config.email_sender}>`,
    to: email,
    subject: "Email Verification",
    html,
  });

  return {};
};

const verifyUserEmail = async (payload: IVerifyEmailPayload) => {
  const otp = payload.otp;
  const email = payload.email.trim().toLowerCase();

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist?.status === "SUSPENDED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Blocked");
  }

  if (isUserExist?.emailVerified) {
    throw new AppError(httpStatus.CONFLICT, "Email ALready Verified");
  }

  if (isUserExist?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is Deleted");
  }

  const otpKey = `user-registation-otp:${email}`;
  const redisOtp = await redisClient.get(otpKey);

  if (!redisOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (redisOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP Does Not Match");
  }

  await redisClient.del(otpKey);

  const userRegistrationKey = `user-registration-data:${email}`;

  const redisPatientData = await redisClient.get(userRegistrationKey);

  if (!redisPatientData) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient Doesnt Exist");
  }

  const userData = JSON.parse(redisPatientData);

  const createdUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      emailVerified: true,
    },
  });

  await redisClient.del(userRegistrationKey);
  const templatePath = path.join(
    process.cwd(),
    "src/app/templates/user-welcome-email.ejs",
  );

  const templateData = {
    name: createdUser.name,
    year: new Date().getFullYear(),
  };

  const html = await ejs.renderFile(templatePath, templateData);

  await transporter.sendMail({
    from: `"FixFlow" <${config.email_sender}>`,
    to: email,
    subject: "Welcome To FixFlow System",
    html,
  });

  const { ...user } = createdUser;
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const login = async (payload: ILoginPayload) => {
  // throw new Error("Test Error");

  const { password } = payload;
  const email = payload.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // throw new Error("User not found");
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is suspended");
  }

  if (user.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  if (user.password === null && user.googleId !== null) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User Already Has Account Registered With Google. Try To Login With Google.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      config.node_env === "development"
        ? verifiedRefreshToken.error
        : "Invalid refresh token",
    );
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User is inactive or not found",
    );
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};
export const authServices = {
  register,
  verifyUserEmail,
  login,
  refreshToken,
};
