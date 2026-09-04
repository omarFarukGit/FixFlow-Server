import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const me = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // শুধু TECHNICIAN হলে profile আনবে
  if (user.role === "TECHNICIAN") {
    const technician = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        technicianProfile: true,
      },
      omit: {
        password: true,
      },
    });

    return technician;
  }

  return user;
};

export const userService = {
  me,
};
