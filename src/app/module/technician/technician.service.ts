import { prisma } from "../../lib/prisma";
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

export const technicianService = {
  updateMyProfile,
};
