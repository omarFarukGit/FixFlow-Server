import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IUpdateMePayload } from "./user.interface";

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

const updateMe = async (userId: string, updateData: IUpdateMePayload) => {
  const { name, phone, address, city, area } = updateData;
  console.log({ name, phone, address, city, area });
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

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: name ?? user.name,
      phone: phone ?? user.phone,
      address: address ?? user.address,
      city: city ?? user.city,
      area: area ?? user.area,
    },
    omit: {
      password: true,
    },
  });
  console.log(updateData);
  return updatedUser;
};

export const userService = {
  me,
  updateMe,
};
