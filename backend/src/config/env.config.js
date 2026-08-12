import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT,

  CORS_ORIGIN: process.env.CORS_ORIGIN,

  DATABASE_URL: process.env.DATABASE_URL,

  POSTGRE_USER: process.env.POSTGRE_USER,
  POSTGRE_HOST: process.env.POSTGRE_HOST,
  POSTGRE_PASSWORD: process.env.POSTGRE_PASSWORD,
  POSTGRE_DB: process.env.POSTGRE_DB,
  POSTGRE_PORT: process.env.POSTGRE_PORT,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN, 
};
//TODO: Implement the env variable validation using the custom requireENV function