import { useMemo, useState } from "react";

import { validateField, validateSignInForm } from "../utils/signInValidation";

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const INITIAL_ERRORS = {
  email: "",
  password: "",
};

const INITIAL_TOUCHED = {
  email: false,
  password: false,
};

function useSignInForm() {
  const [values, setValues] = useState(INITIAL_VALUES);

  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const [touched, setTouched] = useState(INITIAL_TOUCHED);

  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input changes.
   * Performs live validation after a field has been touched.
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  }

  /**
   * Validate field when it loses focus.
   */
  function handleBlur(event) {
    const { name, value } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  }

  /**
   * Validate entire form on submit.
   */
  function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    const { errors, isValid } = validateSignInForm(values);

    setErrors(errors);

    if (!isValid) {
      return false;
    }

    setIsSubmitting(true);

    // Backend integration will be added later.

    return true;
  }

  /**
   * Toggle password visibility.
   */
  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  /**
   * Toggle Remember Me.
   */
  function toggleRememberMe() {
    setRememberMe((prev) => !prev);
  }

  /**
   * Reset form.
   */
  function resetForm() {
    setValues(INITIAL_VALUES);
    setErrors(INITIAL_ERRORS);
    setTouched(INITIAL_TOUCHED);
    setRememberMe(false);
    setShowPassword(false);
    setIsSubmitting(false);
  }

  /**
   * Button enabled only when form is completely valid.
   */
  const isFormValid = useMemo(() => {
    return validateSignInForm(values).isValid;
  }, [values]);

  return {
    values,

    errors,

    touched,

    rememberMe,

    showPassword,

    isSubmitting,

    isFormValid,

    handleChange,

    handleBlur,

    handleSubmit,

    toggleRememberMe,

    togglePasswordVisibility,

    resetForm,
  };
}

export default useSignInForm;
