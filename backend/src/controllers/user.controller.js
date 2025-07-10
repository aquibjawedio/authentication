import { getCurrentUserSchema } from "../schemas/user.schema.js";
import { getCurrentUserService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getCurrentUserController = asyncHandler(async (req, res) => {
  const { userId } = getCurrentUserSchema.parse({
    userId: req.user._id,
  });

  const user = await getCurrentUserService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", { user }));
});
