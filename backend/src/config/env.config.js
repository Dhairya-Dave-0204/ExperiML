import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

/*
 * ===============================================
 * Helpers
 * ===============================================
 */

/**
 * Converts a JWT-style duration string into
 * milliseconds.
 *
 * Supported units:
 * s = seconds
 * m = minutes
 * h = hours
 * d = days
 *
 * Example:
 * "15m" → 900000
 * "7d"  → 604800000
 */
const parseDurationToMilliseconds = (duration) => {
  if (!duration) {
    return undefined;
  }

  const match = duration.trim().match(/^(\d+(?:\.\d+)?)(s|m|h|d)$/i);

  if (!match) {
    throw new Error(
      `Invalid duration format: "${duration}". ` +
        `Expected formats such as "15m", "1h", or "7d".`,
    );
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
};

/*
 * ===============================================
 * Environment Configuration
 * ===============================================
 */

const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

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
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_COOKIE_MAX_AGE: parseDurationToMilliseconds(
    JWT_REFRESH_EXPIRES_IN,
  ),

  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "local",
};
