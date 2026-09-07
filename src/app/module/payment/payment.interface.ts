import type { PaymentStatus } from "../../../generated/prisma/enums";

export interface ICreateCheckoutSessionPayload {
  serviceRequestId: string;
}

export interface IGetMyPaymentsQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
}

export interface IGetAllPaymentsQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
}
