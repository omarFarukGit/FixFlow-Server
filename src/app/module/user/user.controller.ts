import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

const me = catchAsync(async (req, res) => {
  const userId = req?.user?.userId as string;

  const result = await userService.me(userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User information retrieved successfully",
    data: result,
  });
});

const updateMe = catchAsync(async (req, res) => {
  const userId = req?.user?.userId as string;

  const result = await userService.updateMe(userId, req.body);

  console.log(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User information updated successfully",
    data: result,
  });
});

export const userController = {
  me,
  updateMe,
};
