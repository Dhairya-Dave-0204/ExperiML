import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT,

  CORS_ORIGIN: process.env.CORS_ORIGIN,
};
