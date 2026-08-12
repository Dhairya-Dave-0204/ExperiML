import { z } from "zod";

/*
 * ===============================================
 * Common Validation Rules
 * ===============================================
 */

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address.")
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(20, "Password must not exceed 20 characters.");

/*
 * ===============================================
 * Register
 * ===============================================
 */

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(50, "First name must not exceed 50 characters."),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(50, "Last name must not exceed 50 characters."),

    email: emailSchema,

    password: passwordSchema,

    confirmPassword: z.string().min(1, "Password confirmation is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/*
 * ===============================================
 * Login
 * ===============================================
 */

const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password must not exceed 128 characters."),
});

/*
 * ===============================================
 * Refresh Token
 * ===============================================
 *
 * The refresh token is intentionally NOT validated
 * through the request body.
 *
 * It will come from the HttpOnly cookie.
 */

export { registerSchema, loginSchema };
