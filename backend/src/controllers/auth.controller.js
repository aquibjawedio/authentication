import {
  loginUserSchema,
  registerUserSchema,
  resendVerificationEmailSchema,
  verifyEmailSchema,
} from "../schemas/auth.schema.js";
import {
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  registerUserService,
  resendVerificationEmailService,
  verifyEmailService,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";
import { clearCookieOptions, verifyJWTRefreshToken } from "../utils/jwt.js";
import geoip from "geoip-lite";

export const registerUserController = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = registerUserSchema.parse(
    req.body,
  );

  const user = await registerUserService({
    fullname,
    username,
    email,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", { user }));
});

export const loginUserController = asyncHandler(async (req, res) => {
  if (req.cookies?.refreshToken) {
    const decodedUser = verifyJWTRefreshToken(req.cookies.refreshToken);
    if (decodedUser.role === "admin") {
      logger.info(
        `Admin is already logged in, but bypassing restriction ${decodedUser._id}`,
      );
      return;
    }
    logger.warn("User attempted to login while already logged in");
    throw new ApiError(400, "User is already logged in");
  }
  const userAgent = req.get("User-Agent");
  const parseIp =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress;

  const ip = geoip.lookup(parseIp);

  logger.info(`Attemp to get GeoIP: Getting geoIP:  - ${ip}`);

  const { email, password } = loginUserSchema.parse(req.body);

  const {
    user,
    accessToken,
    accessTokenOptions,
    refreshToken,
    refreshTokenOptions,
  } = await loginUserService({ email, password, userAgent, ip });

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, "User logged in successfully", { user }));
});

export const logoutUserController = asyncHandler(async (req, res) => {
  const user = await logoutUserService(req.user._id, req.cookies.refreshToken);
  const cookieSettings = clearCookieOptions();
  res.clearCookie("accessToken", cookieSettings);
  res.clearCookie("refreshToken", cookieSettings);

  logger.info("Logged out successful: User logged out");

  return res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully", { user }));
});

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    logger.warn("Refresh token missing: User unauthorized");
    throw new ApiError(403, "Unauthorized! Refresh token is missing");
  }
  const {
    user,
    newAccessToken,
    accessTokenOptions,
    newRefreshToken,
    refreshTokenOptions,
  } = await refreshAccessTokenService(refreshToken);

  res
    .status(200)
    .cookie("accessToken", newAccessToken, accessTokenOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
    .json(
      new ApiResponse(200, "Access token refreshed successfully", { user }),
    );
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const { token } = verifyEmailSchema.parse({ token: req.params?.token });

  const user = await verifyEmailService(token);

  return res
    .status(200)
    .json(new ApiResponse(200, "User email verified successfully", { user }));
});

export const resendVerificationEmailController = asyncHandler(
  async (req, res) => {
    const { email } = resendVerificationEmailSchema.parse(req.body);
    const user = await resendVerificationEmailService(email);

    return res.status(200).json(
      new ApiResponse(200, "Verification email resent successfully", {
        user,
      }),
    );
  },
);
