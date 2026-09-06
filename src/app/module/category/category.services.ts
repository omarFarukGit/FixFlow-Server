import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const createCategory = async (payload: ICreateCategoryPayload) => {
  const { name, description, imageUrl } = payload;

  const existingCategory = await prisma.serviceCategory.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  const category = await prisma.serviceCategory.create({
    data: {
      name,
      description,
      imageUrl: imageUrl ?? "",
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
