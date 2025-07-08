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
import crypto from "crypto";

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

export const loginUserService = async ({ email, password, userAgent, ip }) => {
  logger.info(`Login attempt: ${email}`);
  logger.info(`userAgent :  ${userAgent}  ip - ${ip}`);

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

  const isMatchedPassword = await user.isPasswordCorrect(password);

  if (!isMatchedPassword) {
    logger.warn(`Login failed: Incorrect password for email - ${email}`);
    throw new ApiError(401, "Invalid credentials, login failed.");
  }

  const sessionId = crypto.randomBytes(16).toString("hex");
  const deviceId = crypto.randomBytes(32).toString("hex");

  const accessToken = user.generateAccessToken();
  const accessTokenOptions = cookieOptions(1000 * 60 * 15);
  const refreshToken = user.generateRefreshToken(sessionId);
  const refreshTokenOptions = cookieOptions(1000 * 60 * 60 * 24 * 7);

  user.sessions.push({
    sessionId,
    deviceId,
    userAgent,
    ip,
    loginCount: (user.sessions[user.sessions.length - 1]?.loginCount || 0) + 1,
    refreshToken,
    lastLoginAt: new Date(),
    lastUsedAt: new Date(),
  });

  await user.save();

  logger.info(`Login successfull: User logged in successfully - ${email}`);

  return {
    user: sanitizeUser(user),
    accessToken,
    accessTokenOptions,
    refreshToken,
    refreshTokenOptions,
  };
};

export const logoutUserService = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    logger.warn(`Logout failed : User not found with ID -${userId}`);
    throw new ApiError(401, "User not found");
  }

  const sessionIndex = user.sessions.findIndex(
    (session) => session.refreshToken === refreshToken,
  );

  if (sessionIndex === -1) {
    throw new ApiError(401, "Session not found");
  }

  user.sessions.splice(sessionIndex, 1);
  await user.save();

  logger.info(`Session cleared : User session cleared for - ${user.email}`);
  return sanitizeUser(user);
};

export const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) {
    logger.warn("Failed to refresh: Refresh token is missing ");
    throw new ApiError(403, "Refresh token is required");
  }

  const user = await User.findOne({
    "sessions.refreshToken": refreshToken,
    "sessions.isRevoked": false,
  });

  const sessionIndex = user.sessions.findIndex(
    (s) => s.refreshToken === refreshToken && !s.isRevoked,
  );

  if (sessionIndex === -1) {
    throw new ApiError(401, "Session not found or revoked");
  }
  user.sessions[sessionIndex].lastUsedAt = new Date();

  const sessionId = crypto.randomBytes(16).toString("hex");

  const newAccessToken = user.generateAccessToken();
  const accessTokenOptions = cookieOptions(1000 * 60 * 15);
  const newRefreshToken = user.generateRefreshToken(sessionId);
  const refreshTokenOptions = cookieOptions(1000 * 60 * 60 * 24 * 7);

  user.sessions[sessionIndex].refreshToken = newRefreshToken;
  user.sessions[sessionIndex].sessionId = sessionId;
  await user.save();

  logger.info(`Refresh token refreshed: Session continues for ${user.email}`);

  return {
    user: sanitizeUser(user),
    newAccessToken,
    accessTokenOptions,
    newRefreshToken,
    refreshTokenOptions,
  };
};
