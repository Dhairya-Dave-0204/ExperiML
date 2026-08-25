function validatePassword(password) {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number.";
  }

  return "";
}

function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword) {
    return "Please confirm your new password.";
  }

  if (confirmPassword !== password) {
    return "Passwords do not match.";
  }

  return "";
}

export function validateField(name, value, values = {}) {
  switch (name) {
    case "password":
      return validatePassword(value);

    case "confirmPassword":
      return validateConfirmPassword(value, values.password);

    default:
      return "";
  }
}

export function validateResetPasswordForm(values) {
  const errors = {};

  const passwordError = validatePassword(values.password);

  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validateConfirmPassword(
    values.confirmPassword,
    values.password,
  );

  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return errors;
}

export { validatePassword, validateConfirmPassword };
