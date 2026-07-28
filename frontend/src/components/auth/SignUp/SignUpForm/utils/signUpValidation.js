// signUpValidation.js

/* ==========================================================
   Constants
========================================================== */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FULL_NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  special: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;'']/,
};

/* ==========================================================
   Full Name Validation
========================================================== */

export function validateFullName(fullName) {
  const value = fullName.trim();

  if (!value) {
    return "Please enter your full name.";
  }

  if (value.length < 2) {
    return "Name must contain at least 2 characters.";
  }

  if (value.length > 100) {
    return "Name cannot exceed 100 characters.";
  }

  if (!FULL_NAME_REGEX.test(value)) {
    return "Please enter a valid full name.";
  }

  return "";
}

/* ==========================================================
   Email Validation
========================================================== */

export function validateEmail(email) {
  const value = email.trim();

  if (!value) {
    return "Please enter your email address.";
  }

  if (!EMAIL_REGEX.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
}

/* ==========================================================
   Password Validation
========================================================== */

export function validatePassword(password) {
  if (!password) {
    return "Please enter a password.";
  }

  if (password.length < PASSWORD_RULES.minLength) {
    return `Password must contain at least ${PASSWORD_RULES.minLength} characters.`;
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    return `Password cannot exceed ${PASSWORD_RULES.maxLength} characters.`;
  }

  if (!PASSWORD_RULES.uppercase.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!PASSWORD_RULES.lowercase.test(password)) {
    return "Password must include at least one lowercase letter.";
  }

  if (!PASSWORD_RULES.number.test(password)) {
    return "Password must include at least one number.";
  }

  if (!PASSWORD_RULES.special.test(password)) {
    return "Password must include at least one special character.";
  }

  return "";
}

/* ==========================================================
   Confirm Password Validation
========================================================== */

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
}

/* ==========================================================
   Agreement Validation
========================================================== */

export function validateAgreement(agreed) {
  if (!agreed) {
    return "You must agree to the Terms of Service and Privacy Policy.";
  }

  return "";
}

/* ==========================================================
   Individual Field Validation
========================================================== */

export function validateField(fieldName, values) {
  switch (fieldName) {
    case "fullName":
      return validateFullName(values.fullName);

    case "email":
      return validateEmail(values.email);

    case "password":
      return validatePassword(values.password);

    case "confirmPassword":
      return validateConfirmPassword(values.password, values.confirmPassword);

    case "agreed":
      return validateAgreement(values.agreed);

    default:
      return "";
  }
}

/* ==========================================================
   Complete Form Validation
========================================================== */

export function validateSignUpForm(values) {
  const errors = {
    fullName: validateFullName(values.fullName),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.password,
      values.confirmPassword,
    ),
    agreed: validateAgreement(values.agreed),
  };

  const isValid = Object.values(errors).every((error) => error === "");

  return {
    errors,
    isValid,
  };
}
