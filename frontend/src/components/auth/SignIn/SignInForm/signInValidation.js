// Email validation pattern
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * Validate email address.
 * @param {string} email
 * @returns {string}
 */
export function validateEmail(email) {
  const value = email.trim();

  if (!value) {
    return "Email address is required.";
  }

  if (!EMAIL_REGEX.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
}

/**
 * Validate password.
 * @param {string} password
 * @returns {string}
 */
export function validatePassword(password) {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return "";
}

/**
 * Validate an individual field.
 * Useful for dynamic validation while typing.
 *
 * @param {string} field
 * @param {string} value
 * @returns {string}
 */
export function validateField(field, value) {
  switch (field) {
    case "email":
      return validateEmail(value);

    case "password":
      return validatePassword(value);

    default:
      return "";
  }
}

/**
 * Validate the complete sign in form.
 *
 * @param {{ email: string, password: string }}
 * @returns {{
 *   errors: {
 *     email: string,
 *     password: string
 *   },
 *   isValid: boolean
 * }}
 */
export function validateSignInForm(values) {
  const errors = {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };

  const isValid = Object.values(errors).every((error) => error === "");

  return {
    errors,
    isValid,
  };
}
