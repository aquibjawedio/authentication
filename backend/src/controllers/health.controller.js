import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

const healthController = asyncHandler(async (req, res) => {
  const healthData = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  logger.info("Sever is running", healthData);
  return res
    .status(200)
    .json(new ApiResponse(200, "Healthcheck Passed", healthData));
});

export { healthController };
