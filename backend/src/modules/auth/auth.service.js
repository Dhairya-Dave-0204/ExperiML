import { randomUUID, createHash } from "node:crypto";

import { prisma } from "#clients/prisma.client";
import { ApiError } from "#utils/ApiError";
import { comparePassword, hashPassword } from "#utils/password.util";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "#utils/token.util";
/*
 * ===============================================
 * Constants
 * ===============================================
 */

const ACTIVE_ACCOUNT_STATUS = "ACTIVE";

/*
 * ===============================================
 * Helpers
 * ===============================================
 */

/**
 * Hashes a refresh token before storing it in the database.
 *
 * Refresh tokens are high-entropy values, so a fast cryptographic hash is sufficient here.
 * Unlike passwords, refresh tokens do not require a slow password-hashing function.
 *
 * @param {string} refreshToken
 * @returns {string}
 */
const hashRefreshToken = (refreshToken) => {
  return createHash("sha256").update(refreshToken).digest("hex");
};

/**
 * Returns the public user representation.
 *
 * Sensitive authentication fields such as passwordHash are intentionally excluded.
 * @param {object} user
 * @returns {object}
 */
const sanitizeUser = (user) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Creates a session metadata object with safe defaults.
 *
 * The database requires browser, operating system, device type, IP address and user agent. 
 *
 * Detailed parsing of the User-Agent will be handled separately when the controller/middleware
 * layer is implemented.
 *
 * @param {object} metadata
 * @returns {object}
 */
const normalizeSessionMetadata = (metadata = {}) => {
  return {
    browser: metadata.browser || "Unknown",
    operatingSystem: metadata.operatingSystem || "Unknown",
    deviceType: metadata.deviceType || "UNKNOWN",
    ipAddress: metadata.ipAddress || "Unknown",
    userAgent: metadata.userAgent || "Unknown",
  };
};

/**
 * Creates a session and generates the refresh token associated with that session.
 *
 * The session ID is generated first so it can be included in the refresh token payload.
 *
 * @param {string} userId
 * @param {object} metadata
 * @returns {Promise<object>}
 */
const createSession = async (userId, metadata) => {
  const sessionId = randomUUID();

  const refreshToken = generateRefreshToken(userId, sessionId);

  /*
   * Verify the token we just generated so we can use its exp claim as the authoritative session expiry.
   */
  const refreshTokenPayload = verifyRefreshToken(refreshToken);

  const expiresAt = new Date(refreshTokenPayload.exp * 1000);

  const normalizedMetadata = normalizeSessionMetadata(metadata);

  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      refreshTokenHash: hashRefreshToken(refreshToken),

      browser: normalizedMetadata.browser,
      operatingSystem: normalizedMetadata.operatingSystem,
      deviceType: normalizedMetadata.deviceType,
      ipAddress: normalizedMetadata.ipAddress,
      userAgent: normalizedMetadata.userAgent,

      expiresAt,
      lastActivityAt: new Date(),
    },
  });

  return {
    session,
    refreshToken,
  };
};

/*
 * ===============================================
 * Register
 * ===============================================
 */

/**
 * Registers a new user.
 *
 * @param {object} data
 * @returns {Promise<object>}
 */
const registerUser = async ({ firstName, lastName, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      accountStatus: ACTIVE_ACCOUNT_STATUS,
    },
  });

  return sanitizeUser(user);
};

/*
 * ===============================================
 * Login
 * ===============================================
 */

/**
 * Authenticates a user and creates a new session. Every successful login creates a new session.
 *
 * @param {object} data
 * @param {object} sessionMetadata
 * @returns {Promise<object>}
 */
const loginUser = async ({ email, password }, sessionMetadata = {}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  /*
   * Do not reveal whether the email exists.
   */
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  /*
   * Soft-deleted users cannot authenticate.
   */
  if (user.deletedAt) {
    throw new ApiError(401, "Invalid email or password.");
  }

  /*
   * Only ACTIVE accounts can authenticate.
   */
  if (user.accountStatus !== ACTIVE_ACCOUNT_STATUS) {
    throw new ApiError(403, "This account is not currently active.");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  /*
   * Every successful login receives a new session.
   */
  const { session, refreshToken } = await createSession(
    user.id,
    sessionMetadata,
  );

  const accessToken = generateAccessToken(user.id, session.id);

  return {
    user: sanitizeUser(user),

    accessToken,

    refreshToken,

    sessionId: session.id,
  };
};

/*
 * ===============================================
 * Refresh Tokens
 * ===============================================
 */

/**
 * Rotates the refresh token and generates a new access token.
 *
 * @param {string} refreshToken
 * @returns {Promise<object>}
 */
const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required.");
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  if (payload.type !== "refresh" || !payload.sub || !payload.sessionId) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  const session = await prisma.session.findUnique({
    where: {
      id: payload.sessionId,
    },
  });

  if (!session) {
    throw new ApiError(401, "Invalid session.");
  }

  if (session.revokedAt) {
    throw new ApiError(401, "Session has been revoked.");
  }

  if (session.expiresAt <= new Date()) {
    throw new ApiError(401, "Session has expired.");
  }

  if (session.userId !== payload.sub) {
    throw new ApiError(401, "Invalid session.");
  }

  /*
   * Compare the incoming refresh token against the hash stored in the session.
   */
  const incomingTokenHash = hashRefreshToken(refreshToken);

  if (incomingTokenHash !== session.refreshTokenHash) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  /*
   * Simple refresh-token rotation:
   * old refresh token
   *       ↓
   * replaced by new refresh token
   */
  const newRefreshToken = generateRefreshToken(session.userId, session.id);

  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const newRefreshTokenPayload = verifyRefreshToken(newRefreshToken);

  const newExpiresAt = new Date(newRefreshTokenPayload.exp * 1000);

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: newExpiresAt,
      lastActivityAt: new Date(),
    },
  });

  const newAccessToken = generateAccessToken(session.userId, session.id);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionId: session.id,
  };
};

/*
 * ===============================================
 * Get Current User
 * ===============================================
 */

/**
 * Retrieves the currently authenticated user's public information.
 *
 * @param {string} userId
 * @returns {Promise<object>}
 */
const getCurrentUser = async (userId) => {
  if (!userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  /*
   * The user may have been deleted after the access token was issued.
   */
  if (!user || user.deletedAt) {
    throw new ApiError(401, "User account no longer exists.");
  }

  /*
   * The user's account status may have changed after the access token was issued.
   */
  if (user.accountStatus !== ACTIVE_ACCOUNT_STATUS) {
    throw new ApiError(403, "This account is not currently active.");
  }

  return sanitizeUser(user);
};

/*
 * ===============================================
 * Change Password
 * ===============================================
 */

/**
 * Changes the password of the currently authenticated user.
 *
 * The current password must match the stored BCrypt password hash before the new password is saved.
 *
 * After a successful password change, all other authenticated sessions are revoked. 
 *
 * The current session remains active so the user does not get unexpectedly logged out immediately
 * after changing their password.
 * @param {object} data
 * @param {string} data.userId
 * @param {string} data.sessionId
 * @param {string} data.currentPassword
 * @param {string} data.newPassword
 * @returns {Promise<void>}
 */
const changePassword = async ({
  userId,
  sessionId,
  currentPassword,
  newPassword,
}) => {
  if (!userId || !sessionId) {
    throw new ApiError(401, "Authentication required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  /*
   * The user may have been deleted after the access token was issued.
   */
  if (!user || user.deletedAt) {
    throw new ApiError(401, "User account no longer exists.");
  }

  /*
   * Only ACTIVE accounts can change their password.
   */
  if (user.accountStatus !== ACTIVE_ACCOUNT_STATUS) {
    throw new ApiError(403, "This account is not currently active.");
  }

  /*
   * Verify the current password against the stored  BCrypt hash.
   */
  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.passwordHash,
  );

  if (!isCurrentPasswordValid) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  /*
   * Prevent the user from replacing the password with the exact same password.
   *
   * This check also exists at the validation layer, but keeping it here protects the service when it
   * is called independently of the HTTP layer.
   */
  const isSamePassword = await comparePassword(newPassword, user.passwordHash);

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password.",
    );
  }

  const newPasswordHash = await hashPassword(newPassword);

  /* 
   * Update the password and revoke all OTHER sessions atomically. The current session remains active.
   */
  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    }),

    prisma.session.updateMany({
      where: {
        userId,
        id: {
          not: sessionId,
        },
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
  ]);
};

/**
 * ===============================================
 * Delete Current User
 * ===============================================
 * Soft-deletes the currently authenticated user.
 *
 * The user record remains in the database so that historical ownership  and referential integrity
 * are preserved. All authentication sessions are revoked.
 * @param {string} userId
 * @returns {Promise<void>}
 */
const deleteCurrentUser = async (userId) => {
  if (!userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || user.deletedAt) {
    throw new ApiError(404, "User account not found or already deleted.");
  }

  /*
   * Soft-delete the account and revoke all of its authentication sessions atomically.
   */
  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    }),

    prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
  ]);
};

/*
 * ===============================================
 * Logout
 * ===============================================
 */

/**
 * Revokes an authenticated session.
 *
 * @param {string} sessionId
 * @param {string} userId
 * @returns {Promise<void>}
 */
const logoutUser = async (sessionId, userId) => {
  if (!sessionId || !userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    throw new ApiError(404, "Session not found.");
  }

  if (session.userId !== userId) {
    throw new ApiError(403, "You are not authorized to revoke this session.");
  }

  /*
   * Logout is idempotent from the application's perspective. If the session is already revoked,
   * there is nothing further to do.
   */
  if (session.revokedAt) {
    return;
  }

  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

export {
  registerUser,
  loginUser,
  refreshTokens,
  getCurrentUser,
  changePassword,
  deleteCurrentUser,
  logoutUser,
};
