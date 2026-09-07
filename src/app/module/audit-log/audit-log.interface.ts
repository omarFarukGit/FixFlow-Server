export interface IGetAuditLogsQuery {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  userId?: string;
}

export interface ICreateAuditLogPayload {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
}
