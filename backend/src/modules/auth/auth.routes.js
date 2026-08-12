import { Router } from "express";

import { register, login, refresh, logout } from "./auth.controller.js";

const router = Router();

/*
 * Register a new user * POST /api/v1/auth/register
 */
router.post("/register", register);

/*
 * Authenticate an existing user * POST /api/v1/auth/login
 */
router.post("/login", login);

/*
 * Refresh access token and rotate the refresh token * POST /api/v1/auth/refresh
 */
router.post("/refresh", refresh);

/*
 * Logout and revoke the current session * POST /api/v1/auth/logout
 *
 * Authentication middleware will be added
 * here once auth.middleware.js is implemented.
 */
router.post("/logout", logout);

export default router;
