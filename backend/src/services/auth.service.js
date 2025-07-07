import { User } from "../models/user.model.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";
import {
  emailVerificationMailGenContent,
  sendEmail,
} from "../utils/sendEmail.js";
import { cookieOptions } from "../utils/jwt.js";

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
    let errorMessage;
    let logMessage;
    const errors = [];

    if (userExists.username === username && userExists.email === email) {
      errorMessage = "Username and email are already taken";
      logMessage = `User creation failed: Username "${username}" and Email "${email}" are already taken`;
      errors.push(
        { field: "username", message: "Username is already taken" },
        { field: "email", message: "Email is already registered" },
      );
    } else if (userExists.username === username) {
      errorMessage = "Username is already taken";
      logMessage = `User creation failed: Username "${username}" is already taken`;
      errors.push({ field: "username", message: "Username is already taken" });
    } else {
      errorMessage = "Email is already registered";
      logMessage = `User creation failed: Email "${email}" is already registered`;
      errors.push({ field: "email", message: "Email is already registered" });
    }

    logger.warn(logMessage);
    throw new ApiError(400, errorMessage, errors);
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

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save();

  logger.info(`Email verification token saved for user ID ${user._id}`);

  const verificationUrl = `${env.FRONTEND_URL}/api/v1/auth/verify-email/${unHashedToken}`;

  logger.info(`Sending verification link : ${verificationUrl}  at : ${email}`);
  await sendEmail({
    email,
    subject: "Email Verification",
    mailGenContent: emailVerificationMailGenContent(fullname, verificationUrl),
  });

  logger.info(`User created and verification email sent to ${user.email}`);

  return sanitizeUser(user);
};

export const loginUserService = async ({ email, password }) => {
  logger.info(`Login attempt: ${email}`);

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Login failed: User not found - ${email}`);
    throw new ApiError(
      400,
      "User doesn't exists with this email, Please create your account first.",
    );
  }

  if (!user.isEmailVerified) {
    logger.warn(`Login failed: User email is not verified yet - ${email}`);
    throw new ApiError(
      403,
      "Please verify your email with link sent on registered email.",
    );
  }

  const isMatchedPassword = user.isPasswordCorrect(password);

  if (!isMatchedPassword) {
    logger.warn(`Login failed: Incorrect password for email - ${email}`);
    throw new ApiError(401, "Invalid credentials, login failed.");
  }

  const accessToken = user.generateAccessToken();
  const accessTokenOptions = cookieOptions(1000 * 60 * 15);
  const refreshToken = user.generateRefreshToken();
  const refreshTokenOptions = cookieOptions(1000 * 60 * 60 * 24 * 7);

  logger.info(`Login successfull: User logged in successfully - ${email}`);

  return {
    user: sanitizeUser(user),
    accessToken,
    accessTokenOptions,
    refreshToken,
    refreshTokenOptions,
  };
};
