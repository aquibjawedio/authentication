import { User } from "../models/user.model.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const registerUserService = async ({
  fullname,
  username,
  email,
  password,
}) => {
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    logger.warn(
      userExists.username === username
        ? `User creation failed: Username "${username}" is already taken`
        : `User creation failed: Email "${email}" is already registered`
    );
    throw new ApiError(
      400,
      userExists.username === username
        ? "Username is already taken"
        : "Email is already registered"
    );
  }

  logger.info(`Creating new user with email: ${email}, username: ${username}`);

  const user = await User.create({
    fullname,
    username,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Failed to create user");
  }

  logger.info(`User created successfully with ID: ${user.id}`);

  return sanitizeUser(user);
};
