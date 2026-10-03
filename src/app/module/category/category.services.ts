import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const createCategory = async (
  payload: ICreateCategoryPayload,
  buffer: Buffer,
) => {
  const { name, description } = payload;

  const existingCategory = await prisma.serviceCategory.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "fixflow/categories",
          },
          (error, result) => {
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

  console.log(cloudinaryResult.secure_url);

  const category = await prisma.serviceCategory.create({
    data: {
      name,
      description,
      imageUrl: cloudinaryResult.secure_url,
    },
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.serviceCategory.findMany({
    where: {
      isDeleted: false,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

const getCategoryById = async (id: string) => {
  const category = await prisma.serviceCategory.findFirst({
    where: {
      id,
      isDeleted: false,
      isActive: true,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

const updateCategory = async (id: string, payload: IUpdateCategoryPayload) => {
  const category = await prisma.serviceCategory.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (payload.name && payload.name !== category.name) {
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: {
        name: payload.name,
      },
    });

    if (existingCategory) {
      throw new AppError(httpStatus.CONFLICT, "Category already exists");
    }
  }

  const updatedCategory = await prisma.serviceCategory.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedCategory;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.serviceCategory.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const deletedCategory = await prisma.serviceCategory.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      isActive: false,
    },
  });

  return deletedCategory;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
