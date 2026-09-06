import type { ServiceRequestStatus } from "../../../generated/prisma/enums";
export interface ICreateServiceRequestPayload {
  title: string;
  description: string;
  address: string;
  city?: string;
  area?: string;
  scheduledAt?: string;
  estimatedPrice?: number;
  categoryId: string;
}

export interface IGetMyServiceRequestsQuery {
  page?: number;
  limit?: number;
  status?: ServiceRequestStatus;
  search?: string;
  sortBy?: "createdAt" | "scheduledAt" | "estimatedPrice" | "finalPrice";
  sortOrder?: "asc" | "desc";
}

export interface IUpdateServiceRequestPayload {
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  area?: string;
  scheduledAt?: string;
  estimatedPrice?: number;
  categoryId?: string;
}
