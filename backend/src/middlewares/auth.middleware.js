import { AvailableUserRoles } from "../constants/user.constant.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWTAccessToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    logger.warn("Unauthorized! Access token missing - please login");
    throw new ApiError(
      403,
      "Unauthorized! User is not logged in, Access Token Missing",
    );
  }
  let decodedUser;
  try {
    decodedUser = verifyJWTAccessToken(accessToken);
  } catch (err) {
    logger.warn("Invalid or expired Access Token- please login again");
    throw new ApiError(
      401,
      "Invalid or expired Access Token please login again",
    );
  }

  req.user = sanitizeUser(decodedUser);
  logger.info(`User is logged in: User ID ${req.user._id}`);
  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== AvailableUserRoles.ADMIN) {
    logger.warn("Forbidden! Admins only");
    throw new ApiError(403, "Forbidden! Admins only");
  }
  logger.info(`User is an ADMIN ${req.user.email}`);
  next();
});

export const isModerator = asyncHandler(async (req, res, next) => {
  if (req.user.role !== AvailableUserRoles.MODERATOR) {
    logger.warn("Forbidden! Moderators only");
    throw new ApiError(403, "Forbidden! Moderators only");
  }
  logger.info(`User is an MODERATOR email - ${req.user.email}`);
  next();
});
