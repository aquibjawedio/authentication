import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  MAILTRAP_HOST: process.env.MAILTRAP_HOST,
  MAILTRAP_PORT: process.env.MAILTRAP_PORT,
  MAILTRAP_USERNAME: process.env.MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD: process.env.MAILTRAP_PASSWORD,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export { env };
