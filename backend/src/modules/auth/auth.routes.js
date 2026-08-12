import { Router } from "express";

import { register, login, refresh, logout, getMe } from "./auth.controller.js";

import { registerSchema, loginSchema } from "./auth.validation.js";

import { authenticate } from "#middleware/auth.middleware";
import { validate } from "#middleware/validate.middleware";

const router = Router();

/*
 * ===============================================
 * Register * POST /api/v1/auth/register
 * ===============================================
 *
 * Request body is validated before reaching
 * the controller.
 */
router.post("/register", validate(registerSchema), register);

/*
 * ===============================================
 * Login * POST /api/v1/auth/login
 * ===============================================
 *
 * Request body is validated before reaching
 * the controller.
 */
router.post("/login", validate(loginSchema), login);

/*
 * ===============================================
 * Refresh Token * POST /api/v1/auth/refresh
 * ===============================================
 *
 * The refresh token is read from the HttpOnly
 * cookie, so no request-body validation is needed.
 */
router.post("/refresh", refresh);

/*
 * ===============================================
 * Current User * GET /api/v1/auth/me
 * ===============================================
 *
 * Returns the currently authenticated user's
 * public information.
 *
 * Requires a valid access token.
 */
router.get(
  "/me",
  authenticate,
  getMe,
);

/*
 * ===============================================
 * Logout * POST /api/v1/auth/logout
 * =============================================== 
 *
 * The current access token must be valid so that
 * req.user contains the authenticated user and
 * session information.
 */
router.post("/logout", authenticate, logout);

export default router;
