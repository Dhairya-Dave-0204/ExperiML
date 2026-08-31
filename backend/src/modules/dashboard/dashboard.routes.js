import { Router } from "express";

import { authenticate } from "#middleware/auth.middleware";

import { getDashboard } from "./dashboard.controller.js";

const router = Router();

/*
 * ===============================================
 * Get Dashboard  * GET /api/v1/dashboard
 * ===============================================
 * Returns the dashboard data for the currently authenticated user.
 *
 * No userId is accepted from the client. The authenticated user's ID is obtained from: req.user.id
 *
 * Authentication must therefore happen before the controller is executed.
 */
router.get("/", authenticate, getDashboard);

export default router;
