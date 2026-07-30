import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { submitForgotPassword } from "../services/forgotPassword.service";

import {
  validateField,
  validateForgotPasswordForm,
} from "../utils/forgotPasswordValidation";

const INITIAL_VALUES = {
  email: "",
};

function useForgotPasswordForm() {
  const [values, setValues] = useState(INITIAL_VALUES);

  const [errors, setErrors] = useState({});

  const [touched, setTouched] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return Object.keys(validateForgotPasswordForm(values)).length === 0;
  }, [values]);

  function handleChange(event) {
    const { name, value } = event.target;

    const nextValues = {
      ...values,
      [name]: value,
    };

    setValues(nextValues);

    if (touched[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: validateField(name, value),
      }));
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: validateField(name, value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForgotPasswordForm(values);

    setTouched({
      email: true,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please enter a valid email address.");

      return;
    }

    try {
      setIsSubmitting(true);

      await submitForgotPassword(values);

      setSubmitted(true);

      toast.success("Password reset link sent.");
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

export default useForgotPasswordForm;
