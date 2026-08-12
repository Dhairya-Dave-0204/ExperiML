import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
} from "./auth.service.js";

import { env } from "#config/env.config";
import { ApiResponse } from "#utils/ApiResponse";
import { asyncHandler } from "#utils/asyncHandler";

/*
 * ===============================================
 * Cookie Configuration
 * ===============================================
 */

const REFRESH_TOKEN_COOKIE = "refreshToken";

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,

  secure: env.NODE_ENV === "production",

  sameSite: "lax",

  path: "/api/v1/auth",

  maxAge: env.JWT_REFRESH_COOKIE_MAX_AGE,
};

/*
 * ===============================================
 * Session Metadata
 * ===============================================
 */

/**
 * Extracts authentication/session metadata
 * from the incoming HTTP request.
 *
 * Detailed User-Agent parsing can be introduced
 * later without changing the service layer.
 *
 * @param {object} req
 * @returns {object}
 */
const getSessionMetadata = (req) => {
  return {
    browser: "Unknown",

    operatingSystem: "Unknown",

    deviceType: "UNKNOWN",

    ipAddress: req.ip || "Unknown",

    userAgent: req.headers["user-agent"] || "Unknown",
  };
};

/*
 * ===============================================
 * Register
 * ===============================================
 */

/**
 * Registers a new user.
 */
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await registerUser({
    firstName,
    lastName,
    email,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully."));
});

/*
 * ===============================================
 * Login
 * ===============================================
 */

/**
 * Authenticates a user, creates a session,
 * returns the access token, and stores the
 * refresh token in an HttpOnly cookie.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const sessionMetadata = getSessionMetadata(req);

  const { user, accessToken, refreshToken } = await loginUser(
    {
      email,
      password,
    },
    sessionMetadata,
  );

  /*
   * Refresh token is intentionally NOT returned
   * in the response body.
   *
   * It is stored in an HttpOnly cookie so that
   * frontend JavaScript cannot directly access it.
   */
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  /*
   * Access token is returned to the frontend.
   *
   * The frontend will keep it in memory rather
   * than localStorage/sessionStorage.
   */
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        accessToken,
      },
      "Login successful.",
    ),
  );
});

/*
 * ===============================================
 * Refresh Token
 * ===============================================
 */

/**
 * Generates a new access token and rotates
 * the refresh token.
 */
const refresh = asyncHandler(async (req, res) => {
  /*
   * Refresh token is retrieved from the
   * HttpOnly cookie.
   */
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshTokens(refreshToken);

  /*
   * Replace the old refresh token with the
   * newly rotated refresh token.
   */
  res.cookie(
    REFRESH_TOKEN_COOKIE,
    newRefreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS,
  );

  /*
   * Only the new access token is returned
   * in the response body.
   */
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
      },
      "Access token refreshed successfully.",
    ),
  );
});

/*
 * ===============================================
 * Logout
 * ===============================================
 */

/**
 * Revokes the current authentication session
 * and clears the refresh-token cookie.
 *
 * Authentication middleware must run before
 * this controller so that req.user exists.
 */
const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user.sessionId, req.user.id);

  /*
   * Clear the refresh-token cookie using the
   * same path/security configuration with which
   * it was originally created.
   */   
  res.clearCookie(REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json(new ApiResponse(200, null, "Logout successful."));
});

export { register, login, refresh, logout };
