import jwt from "jsonwebtoken";

import { env } from "#config/env.config";

/*
 * ===============================================
 * Access Token
 * ===============================================
 */

/**
 * Generates an access token for an authenticated session.
 *
 * @param {string} userId
 * @param {string} sessionId
 * @returns {string}
 */
const generateAccessToken = (userId, sessionId) => {
  return jwt.sign(
    {
      sub: userId,
      sessionId,
      type: "access",
    },
    env.JWT_ACCESS_SECRET,
    {
      algorithm: "HS256",
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  );
};

/**
 * Verifies an access token.
 *
 * @param {string} token
 * @returns {object}
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    algorithms: ["HS256"],
  });
};

/*
 * ===============================================
 * Refresh Token
 * ===============================================
 */

/**
 * Generates a refresh token for an authenticated session.
 *
 * @param {string} userId
 * @param {string} sessionId
 * @returns {string}
 */
const generateRefreshToken = (userId, sessionId) => {
  return jwt.sign(
    {
      sub: userId,
      sessionId,
      type: "refresh",
    },
    env.JWT_REFRESH_SECRET,
    {
      algorithm: "HS256",
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
  );
};

/**
 * Verifies a refresh token.
 *
 * @param {string} token
 * @returns {object}
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, {
    algorithms: ["HS256"],
  });
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
