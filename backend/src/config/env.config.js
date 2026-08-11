import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT,

  CORS_ORIGIN: process.env.CORS_ORIGIN,
};
