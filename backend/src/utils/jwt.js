import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const cookieOptions = (maxAge = 1000 * 60 * 15) => {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: maxAge,
  };
};

export const verifyJWT = (refreshToken) => {
  return jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
};
