import dashboardService from "./dashboard.service.js";

import { ApiResponse } from "#utils/ApiResponse";
import { asyncHandler } from "#utils/asyncHandler";

/*
 * ===============================================
 * Get Dashboard  * GET /api/v1/dashboard
 * ===============================================
 * Returns all data required by the authenticated user's dashboard.
 *
 * Authentication is handled by the authenticate middleware before this controller executes.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard({
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, dashboard, "Dashboard data retrieved successfully."),
    );
});

export { getDashboard };
