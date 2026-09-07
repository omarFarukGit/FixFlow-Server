import { prisma } from "../../lib/prisma";
import type {
  ICreateAuditLogPayload,
  IGetAuditLogsQuery,
} from "./audit-log.interface";

const getAuditLogs = async (query: IGetAuditLogsQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const { action, entity, userId } = query;

  const skip = (page - 1) * limit;

  const where = {
    ...(action && {
      action: {
        contains: action,
        mode: "insensitive" as const,
      },
    }),

    ...(entity && {
      entity: {
        contains: entity,
        mode: "insensitive" as const,
      },
    }),

    ...(userId && {
      userId,
    }),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        oldData: true,
        newData: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),

    prisma.auditLog.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: logs,
  };
};

const createAuditLog = async (payload: ICreateAuditLogPayload) => {
  return prisma.auditLog.create({
    data: {
      userId: payload.userId,
      action: payload.action,
      entity: payload.entity,
      entityId: payload.entityId,
      oldData: payload.oldData
        ? JSON.parse(JSON.stringify(payload.oldData))
        : undefined,
      newData: payload.newData
        ? JSON.parse(JSON.stringify(payload.newData))
        : undefined,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
    },
  });
};

export const AuditLogService = {
  getAuditLogs,
  createAuditLog,
};
