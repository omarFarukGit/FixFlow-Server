import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IGetAuditLogsQuery } from "./audit-log.interface";
import { AuditLogService } from "./audit-log.service";

const getAuditLogs = catchAsync(async (req, res) => {
  const result = await AuditLogService.getAuditLogs(
    req.query as unknown as IGetAuditLogsQuery,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Audit logs retrieved successfully",
    data: result,
  });
});

export const AuditLogController = {
  getAuditLogs,
};
