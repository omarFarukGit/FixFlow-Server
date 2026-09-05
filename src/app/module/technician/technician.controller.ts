import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";

const updateMyProfile = catchAsync(async (req, res) => {
  const userId = req?.user?.userId as string;

  const result = await technicianService.updateMyProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician profile updated successfully",
    data: result,
  });
});

export const technicianProfileController = {
  updateMyProfile,
};
