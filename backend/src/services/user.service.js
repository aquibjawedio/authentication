import { logger } from "../utils/logger.js";
import { User } from "../models/user.model.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const getCurrentUserService = async (userId) => {
  logger.info(`Attempting to fetch user with userId : ${userId}`);
  const user = await User.findById(userId);

  if (!user) {
    logger.warn(`User with userId ${userId} not found`);
    throw new Error("User not found");
  }

  logger.info(`User with userId ${userId  } fetched successfully`);
  return sanitizeUser(user);
};
