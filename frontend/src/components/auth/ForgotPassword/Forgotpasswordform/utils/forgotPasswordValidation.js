function validateEmail(email) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return "Email address is required.";
  }

  if (trimmedEmail.length > 254) {
    return "Email address is too long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return "Enter a valid email address.";
  }

  return "";
}

export function validateField(name, value, values = {}) {
  switch (name) {
    case "email":
      return validateEmail(value);

    default:
      return "";
  }
}

export function validateForgotPasswordForm(values) {
  const errors = {};

  const emailError = validateEmail(values.email);

  if (emailError) {
    errors.email = emailError;
  }

  return errors;
}

export { validateEmail };
