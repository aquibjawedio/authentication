import { logger } from "../utils/logger.js";
import { User } from "../models/user.model.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const getCurrentUserService = async (username) => {
  logger.info(`Attempting to fetch user with username: ${username}`);
  const user = await User.findOne({ username: username });

  if (!user) {
    logger.warn(`User with username ${username} not found`);
    throw new Error("User not found");
  }

  logger.info(`User with username ${username} fetched successfully`);
  return sanitizeUser(user);
};
