import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IUpdateTechnicianProfilePayload } from "./technician.interface";

const updateMyProfile = async (
  userId: string,
  profileData: IUpdateTechnicianProfilePayload,
) => {
  const { bio, experienceYears, skills, hourlyRate } = profileData;
  const profile = await prisma.technicianProfile.upsert({
    where: {
      userId,
    },

    update: {
      bio: bio,
      experienceYears: experienceYears,
      skills: skills,
      hourlyRate: hourlyRate,
    },

    create: {
      userId,
      bio: bio,
      experienceYears: experienceYears ?? 0,
      skills: skills ?? [],
      hourlyRate: hourlyRate,
    },
  });

  return profile;
};

const approveTechnician = async (technicianId: string) => {
  const technician = await prisma.user.findFirst({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
      isDeleted: false,
    },
    include: {
      technicianProfile: true,
    },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }

  if (!technician.technicianProfile) {
    throw new AppError(httpStatus.BAD_REQUEST, "Technician profile not found");
  }

  if (technician.technicianProfile.isApproved) {
    throw new AppError(httpStatus.CONFLICT, "Technician is already approved");
  }

  const updatedProfile = await prisma.technicianProfile.update({
    where: {
      userId: technicianId,
    },
    data: {
      isApproved: true,
    },
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
  });

  return updatedProfile;
};

export const technicianService = {
  updateMyProfile,
  approveTechnician,
};
