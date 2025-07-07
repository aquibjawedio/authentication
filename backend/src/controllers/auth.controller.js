import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema.js";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyJWT } from "../utils/jwt.js";

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
    const decodedUser = verifyJWT(req.cookies.refreshToken);
    if (decodedUser.role === "admin") {
      logger.info(
        `Admin is already logged in, but bypassing restriction ${decodedUser._id}`,
      );
      return;
    }
    logger.warn("User attempted to login while already logged in");
    throw new ApiError(400, "User is already logged in");
  }

  const { email, password } = loginUserSchema.parse(req.body);

  const {
    user,
    accessToken,
    accessTokenOptions,
    refreshToken,
    refreshTokenOptions,
  } = await loginUserService({ email, password });

  return res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(201, "User registered successfully", { user }));
});
