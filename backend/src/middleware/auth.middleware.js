import { ApiError } from "#utils/ApiError";
import { verifyAccessToken } from "#utils/token.util";

/*
 * ===============================================
 * Authentication Middleware
 * ===============================================
 *
 * Extracts and verifies the access token from:
 *
 * Authorization: Bearer <access-token>
 *
 * On successful verification, the authenticated
 * user's identity and session information are
 * attached to req.user.
 */

const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  /*
   * Authorization header is required.
   */
  if (!authorizationHeader) {
    return next(new ApiError(401, "Authentication required."));
  }

  /*
   * Expected format:
   *
   * Authorization: Bearer <token>
   */
  const [scheme, token] = authorizationHeader.split(" ");

  /*
   * Validate the Authorization scheme
   * and token presence.
   */
  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Invalid authorization header."));
  }

  try {
    /*
     * Verify JWT signature, expiration,
     * and HS256 algorithm.
     */
    const payload = verifyAccessToken(token);

    /*
     * Make sure this is actually an access
     * token and not another JWT type.
     */
    if (payload.type !== "access") {
      return next(new ApiError(401, "Invalid access token."));
    }

    /*
     * Required claims for our authentication
     * architecture.
     */
    if (!payload.sub || !payload.sessionId) {
      return next(new ApiError(401, "Invalid access token."));
    }

    /*
     * Attach authenticated context to the
     * request for downstream controllers.
     */
    req.user = {
      id: payload.sub,
      sessionId: payload.sessionId,
    };

    return next();
  } catch (error) {
    /*
     * jwt.verify() can throw for:
     *
     * - expired token
     * - invalid signature
     * - malformed token
     * - invalid token
     *
     * Do not expose the underlying JWT error
     * to the client.
     */
    return next(new ApiError(401, "Invalid or expired access token."));
  }
};

export { authenticate };
