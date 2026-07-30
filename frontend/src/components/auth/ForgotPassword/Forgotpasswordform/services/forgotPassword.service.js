function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function submitForgotPassword(formData) {
  /*
    Placeholder service.

    Replace this with your backend API call
    once authentication is integrated.

    Example:

    return api.post("/auth/forgot-password", formData);
  */

  await delay(1500);

  return {
    success: true,
    message:
      "If an account exists with this email address, a password reset link has been sent.",
    email: formData.email,
  };
}
