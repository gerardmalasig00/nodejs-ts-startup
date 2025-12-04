import dotenv from "dotenv";
dotenv.config();

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  PORT: parseInt(process.env.PORT || "4000", 10),

  MONGO_URI: required("MONGO_URI", process.env.MONGO_URI),

  JWT_ACCESS_SECRET: required(
    "JWT_ACCESS_SECRET",
    process.env.JWT_ACCESS_SECRET
  ),
  JWT_REFRESH_SECRET: required(
    "JWT_REFRESH_SECRET",
    process.env.JWT_REFRESH_SECRET
  ),

  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  NODE_ENV: process.env.NODE_ENV || "development",
};
