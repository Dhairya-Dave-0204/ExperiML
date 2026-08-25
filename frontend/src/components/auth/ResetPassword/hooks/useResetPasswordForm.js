import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { submitResetPassword } from "../services/resetPassword.service";

import {
  validateField,
  validateResetPasswordForm,
} from "../utils/resetPasswordValidation";

const INITIAL_VALUES = {
  password: "",
  confirmPassword: "",
};

function useResetPasswordForm() {
  const [values, setValues] = useState(INITIAL_VALUES);

  const [errors, setErrors] = useState({});

  const [touched, setTouched] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return Object.keys(validateResetPasswordForm(values)).length === 0;
  }, [values]);

  function handleChange(event) {
    const { name, value } = event.target;

    const nextValues = {
      ...values,
      [name]: value,
    };

    setValues(nextValues);

    setErrors((previous) => {
      const nextErrors = { ...previous };

      if (touched[name]) {
        nextErrors[name] = validateField(name, value, nextValues);
      }

      // Confirm Password's validity depends on Password, so re-check it
      // whenever Password changes and Confirm Password has already been
      // touched — otherwise a stale "passwords do not match" error can
      // linger even after the user fixes the original password.
      if (name === "password" && touched.confirmPassword) {
        nextErrors.confirmPassword = validateField(
          "confirmPassword",
          nextValues.confirmPassword,
          nextValues,
        );
      }

      return nextErrors;
    });
  }

  function handleBlur(event) {
    const { name, value } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: validateField(name, value, values),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateResetPasswordForm(values);

    setTouched({
      password: true,
      confirmPassword: true,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the highlighted fields before continuing.");

      return;
    }

    try {
      setIsSubmitting(true);

      await submitResetPassword(values);

      setSubmitted(true);

      toast.success("Password reset successfully.");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setValues(INITIAL_VALUES);

    setErrors({});

    setTouched({});

    setSubmitted(false);

    setIsSubmitting(false);
  }

  return {
    values,
    errors,
    touched,

    submitted,
    isSubmitting,
    isFormValid,

    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}

export default useResetPasswordForm;
