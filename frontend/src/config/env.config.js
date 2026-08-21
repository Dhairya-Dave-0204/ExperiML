/*
 * Centralized access to frontend environment variables.
 *
 * Application code should NOT access import.meta.env directly.
 * All environment variables should be read and exported from
 * this file.
 *
 * Vite exposes only variables prefixed with VITE_ to the
 * client-side application.
 */

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const API_URL = import.meta.env.VITE_API_URL;

/*
 * ============================================================
 * ENVIRONMENT VALIDATION
 * ============================================================
 *
 * Fail fast during application startup if a required
 * environment variable is missing.
 *
 * This prevents configuration errors from appearing later
 * when the contact form is submitted.
 *
 */

if (!WEB3FORMS_ACCESS_KEY) {
  throw new Error(
    "Missing required environment variable: VITE_WEB3FORMS_ACCESS_KEY",
  );
}

if (!API_URL) {
  throw new Error(
    "Missing required environment variable: API_URL",
  );
}

/*
 * ============================================================
 * EXPORT
 * ============================================================
 * Export a centralized, immutable configuration object.
 */

const env = Object.freeze({
  WEB3FORMS_ACCESS_KEY,
  API_URL
});

export default env;
