function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function submitResetPassword(formData) {
  /*
    Placeholder service.

    Replace this with your backend API call
    once authentication is integrated.

    Example:

    return api.post("/auth/reset-password", {
      password: formData.password,
      token: resetToken, // token handling to be wired up later
    });
  */

  await delay(1500);

  return {
    success: true,
    message: "Your password has been reset successfully.",
  };
}
