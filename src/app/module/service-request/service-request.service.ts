import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { AuditLogService } from "../audit-log/audit-log.service";
import type {
  IAssignTechnicianPayload,
  ICompleteServiceRequestPayload,
  ICreateServiceRequestPayload,
  IGetAllServiceRequestsQuery,
  IGetMyAssignedServicesQuery,
  IGetMyServiceRequestsQuery,
  IUpdateServiceRequestPayload,
} from "./service-request.interface";

const createServiceRequest = async (
  userId: string,
  payload: ICreateServiceRequestPayload,
) => {
  const category = await prisma.serviceCategory.findFirst({
    where: {
      id: payload.categoryId,
      isDeleted: false,
      isActive: true,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      title: payload.title,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      area: payload.area,
      scheduledAt: payload.scheduledAt
        ? new Date(payload.scheduledAt)
        : undefined,
      estimatedPrice: payload.estimatedPrice,
      categoryId: payload.categoryId,
      customerId: userId,
    },
    include: {
      category: true,
    },
  });

  return serviceRequest;
};

const getMyServiceRequests = async (
  customerId: string,
  query: IGetMyServiceRequestsQuery,
) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    customerId,
    isDeleted: false,

    ...(status && {
      status,
    }),

    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          address: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          city: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          area: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [serviceRequests, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,

      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
          },
        },

        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,

            technicianProfile: {
              select: {
                bio: true,
                experienceYears: true,
                skills: true,
                hourlyRate: true,
                status: true,
                averageRating: true,
                totalJobs: true,
              },
            },
          },
        },

        payment: true,
        review: true,
      },

      orderBy: {
        [sortBy]: sortOrder,
      },

      skip,
      take: limit,
    }),

    prisma.serviceRequest.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: serviceRequests,
  };
};

const getMyServiceRequestById = async (
  customerId: string,
  serviceRequestId: string,
) => {
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      customerId,
      isDeleted: false,
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      },

      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,

          technicianProfile: {
            select: {
              bio: true,
              experienceYears: true,
              skills: true,
              hourlyRate: true,
              status: true,
              averageRating: true,
              totalJobs: true,
            },
          },
        },
      },

      payment: true,
      review: true,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  return serviceRequest;
};

const updateMyServiceRequest = async (
  customerId: string,
  serviceRequestId: string,
  payload: IUpdateServiceRequestPayload,
) => {
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      customerId,
      isDeleted: false,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  if (serviceRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending service requests can be updated",
    );
  }

  if (payload.categoryId) {
    const category = await prisma.serviceCategory.findFirst({
      where: {
        id: payload.categoryId,
        isDeleted: false,
        isActive: true,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
  }

  const updatedServiceRequest = await prisma.serviceRequest.update({
    where: {
      id: serviceRequestId,
    },

    data: {
      ...(payload.title !== undefined && {
        title: payload.title,
      }),

      ...(payload.description !== undefined && {
        description: payload.description,
      }),

      ...(payload.address !== undefined && {
        address: payload.address,
      }),

      ...(payload.city !== undefined && {
        city: payload.city,
      }),

      ...(payload.area !== undefined && {
        area: payload.area,
      }),

      ...(payload.scheduledAt !== undefined && {
        scheduledAt: new Date(payload.scheduledAt),
      }),

      ...(payload.estimatedPrice !== undefined && {
        estimatedPrice: payload.estimatedPrice,
      }),

      ...(payload.categoryId !== undefined && {
        categoryId: payload.categoryId,
      }),
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      },
    },
  });

  return updatedServiceRequest;
};

const cancelMyServiceRequest = async (
  customerId: string,
  serviceRequestId: string,
) => {
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      customerId,
      isDeleted: false,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  if (serviceRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending service requests can be cancelled",
    );
  }

  const cancelledServiceRequest = await prisma.serviceRequest.update({
    where: {
      id: serviceRequestId,
    },
    data: {
      status: "CANCELLED",
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      },
    },
  });

  return cancelledServiceRequest;
};

const getAllServiceRequests = async (query: IGetAllServiceRequestsQuery) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    city,
    area,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,

    ...(status && {
      status,
    }),

    ...(city && {
      city: {
        contains: city,
        mode: "insensitive" as const,
      },
    }),

    ...(area && {
      area: {
        contains: area,
        mode: "insensitive" as const,
      },
    }),

    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          address: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [serviceRequests, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,

      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
          },
        },

        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
            technicianProfile: {
              select: {
                experienceYears: true,
                skills: true,
                hourlyRate: true,
                status: true,
                averageRating: true,
                totalJobs: true,
              },
            },
          },
        },

        category: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
          },
        },

        payment: true,
        review: true,
      },

      orderBy: {
        [sortBy]: sortOrder,
      },

      skip,
      take: limit,
    }),

    prisma.serviceRequest.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: serviceRequests,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const assignTechnician = async (
  adminId: string,
  serviceRequestId: string,
  payload: IAssignTechnicianPayload,
) => {
  const { technicianId } = payload;

  // 1. Find service request
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      isDeleted: false,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  // 2. Only PENDING requests can be assigned
  if (serviceRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending service requests can be assigned",
    );
  }

  // 3. Find technician
  const technician = await prisma.user.findFirst({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
      status: "ACTIVE",
      isDeleted: false,
    },
    include: {
      technicianProfile: true,
    },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }

  // 4. Technician must have a profile
  if (!technician.technicianProfile) {
    throw new AppError(httpStatus.BAD_REQUEST, "Technician profile not found");
  }

  // 5. Technician must be approved
  if (!technician.technicianProfile.isApproved) {
    throw new AppError(httpStatus.FORBIDDEN, "Technician is not approved");
  }

  // 6. Technician must be available
  if (technician.technicianProfile.status !== "AVAILABLE") {
    throw new AppError(httpStatus.BAD_REQUEST, "Technician is not available");
  }

  // 7. Assign technician
  const updatedServiceRequest = await prisma.serviceRequest.update({
    where: {
      id: serviceRequestId,
    },

    data: {
      technicianId,
      status: "ASSIGNED",
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
        },
      },

      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,

          technicianProfile: {
            select: {
              bio: true,
              experienceYears: true,
              skills: true,
              hourlyRate: true,
              status: true,
              averageRating: true,
              totalJobs: true,
              isApproved: true,
            },
          },
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      },
    },
  });

  // audit-logs create
  await AuditLogService.createAuditLog({
    userId: adminId,
    action: "TECHNICIAN_ASSIGNED",
    entity: "ServiceRequest",
    entityId: serviceRequestId,
    oldData: {
      technicianId: serviceRequest.technicianId,
      status: serviceRequest.status,
    },
    newData: {
      technicianId: updatedServiceRequest.technicianId,
      status: updatedServiceRequest.status,
    },
  });

  return updatedServiceRequest;
};

const acceptServiceRequest = async (
  technicianId: string,
  serviceRequestId: string,
) => {
  // 1. Find the assigned service request
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      isDeleted: false,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  // 2. Verify that this technician is assigned
  if (serviceRequest.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not assigned to this service request",
    );
  }

  // 3. Only ASSIGNED requests can be accepted
  if (serviceRequest.status !== "ASSIGNED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only assigned service requests can be accepted",
    );
  }

  // 4. Update status
  const acceptedServiceRequest = await prisma.serviceRequest.update({
    where: {
      id: serviceRequestId,
    },

    data: {
      status: "ACCEPTED",
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
        },
      },

      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,

          technicianProfile: {
            select: {
              bio: true,
              experienceYears: true,
              skills: true,
              hourlyRate: true,
              status: true,
              averageRating: true,
              totalJobs: true,
              isApproved: true,
            },
          },
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      },
    },
  });

  //Technician accept audit-logs create
  await AuditLogService.createAuditLog({
    userId: technicianId,
    action: "SERVICE_REQUEST_ACCEPTED",
    entity: "ServiceRequest",
    entityId: serviceRequestId,
    oldData: {
      status: serviceRequest.status,
    },
    newData: {
      status: acceptedServiceRequest.status,
    },
  });

  return acceptedServiceRequest;
};

const startServiceRequest = async (
  technicianId: string,
  serviceRequestId: string,
) => {
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      isDeleted: false,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  if (serviceRequest.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not assigned to this service request",
    );
  }

  if (serviceRequest.status !== "ACCEPTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only accepted service requests can be started",
    );
  }

  const startedServiceRequest = await prisma.serviceRequest.update({
    where: {
      id: serviceRequestId,
    },
    data: {
      status: "IN_PROGRESS",
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
        },
      },
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
          technicianProfile: {
            select: {
              bio: true,
              experienceYears: true,
              skills: true,
              hourlyRate: true,
              status: true,
              averageRating: true,
              totalJobs: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      },
    },
  });

  //Technician start audit-logs create
  await AuditLogService.createAuditLog({
    userId: technicianId,
    action: "SERVICE_REQUEST_STARTED",
    entity: "ServiceRequest",
    entityId: serviceRequestId,
    oldData: {
      status: serviceRequest.status,
    },
    newData: {
      status: startedServiceRequest.status,
    },
  });

  return startedServiceRequest;
};

const completeServiceRequest = async (
  technicianId: string,
  serviceRequestId: string,
  payload: ICompleteServiceRequestPayload,
) => {
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      isDeleted: false,
    },
  });

  if (!serviceRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Service request not found");
  }

  if (serviceRequest.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not assigned to this service request",
    );
  }

  if (serviceRequest.status !== "IN_PROGRESS") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only in-progress service requests can be completed",
    );
  }

  const completedServiceRequest = await prisma.serviceRequest.update({
    where: {
      id: serviceRequestId,
    },
    data: {
      status: "COMPLETED",
      finalPrice: payload.finalPrice,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
        },
      },
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
          technicianProfile: {
            select: {
              bio: true,
              experienceYears: true,
              skills: true,
              hourlyRate: true,
              status: true,
              averageRating: true,
              totalJobs: true,
              isApproved: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      },
    },
  });

  //Technician complete audit logs create
  await AuditLogService.createAuditLog({
    userId: technicianId,
    action: "SERVICE_REQUEST_COMPLETED",
    entity: "ServiceRequest",
    entityId: serviceRequestId,
    oldData: {
      status: serviceRequest.status,
      finalPrice: serviceRequest.finalPrice,
    },
    newData: {
      status: completedServiceRequest.status,
      finalPrice: completedServiceRequest.finalPrice,
    },
  });

  return completedServiceRequest;
};

const getMyAssignedServices = async (
  technicianId: string,
  query: IGetMyAssignedServicesQuery,
) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  // Convert query params to numbers
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  // Make sure logged-in user is actually a technician
  const technician = await prisma.user.findFirst({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }

  const where = {
    technicianId,
    isDeleted: false,
    ...(status && { status }),
  };

  const [services, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,
      skip,
      take: limitNumber,

      orderBy: {
        [sortBy]: sortOrder,
      },

      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        city: true,
        area: true,
        scheduledAt: true,
        estimatedPrice: true,
        finalPrice: true,
        status: true,
        customerId: true,
        technicianId: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,

        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
          },
        },

        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    }),

    prisma.serviceRequest.count({
      where,
    }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },

    data: services,
  };
};

export const ServiceRequestService = {
  createServiceRequest,
  getMyServiceRequests,
  getMyServiceRequestById,
  updateMyServiceRequest,
  cancelMyServiceRequest,
  getAllServiceRequests,
  assignTechnician,
  acceptServiceRequest,
  startServiceRequest,
  completeServiceRequest,
  getMyAssignedServices,
};
