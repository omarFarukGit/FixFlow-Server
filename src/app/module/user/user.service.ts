import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IUpdateMePayload } from "./user.interface";
import { GetAllUsersValidationSchema } from "./user.validation";

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

  return updatedUser;
};

const updateProfileImage = async (userId: string, buffer: Buffer) => {
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

  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          async (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error("No result returned from Cloudinary"));
            }

            resolve(result);
          },
        )
        .end(buffer);
    },
  );

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      imageUrl: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
    },
    omit: {
      password: true,
    },
  });

  if (user.imagePublicId && user.imageUrl) {
    await cloudinary.uploader.destroy(user.imagePublicId);
  }

  return updatedUser;
};

const getAllUsers = async (query: unknown) => {
  const { page, limit, search, role, status, sortBy, sortOrder } =
    GetAllUsersValidationSchema.parse(query);

  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,

    ...(role && {
      role,
    }),

    ...(status && {
      status,
    }),

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        [sortBy ?? "createdAt"]: sortOrder,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        imageUrl: true,
        authProvider: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,

        technicianProfile: {
          select: {
            id: true,
            userId: true,
            bio: true,
            experienceYears: true,
            skills: true,
            hourlyRate: true,
            status: true,
            averageRating: true,
            totalJobs: true,
            isApproved: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAllCustomers = async (query: unknown) => {
  return getAllUsers({
    ...(query as Record<string, unknown>),
    role: "CUSTOMER",
  });
};

const getAllTechnicians = async (query: unknown) => {
  return getAllUsers({
    ...(query as Record<string, unknown>),
    role: "TECHNICIAN",
  });
};

export const userService = {
  me,
  updateMe,
  updateProfileImage,
  getAllUsers,
  getAllCustomers,
  getAllTechnicians,
};
