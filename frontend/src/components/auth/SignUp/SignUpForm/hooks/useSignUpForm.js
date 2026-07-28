import { useMemo, useState } from "react";

import { validateField, validateSignUpForm } from "../utils/signUpValidation";

function useSignUpForm() {
  /* ==========================================================
     State
  ========================================================== */

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: "",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ==========================================================
     Derived State
  ========================================================== */

  const isFormValid = useMemo(() => {
    return validateSignUpForm(values).isValid;
  }, [values]);

  /* ==========================================================
     Handlers
  ========================================================== */

  function handleChange(event) {
    const { name, value } = event.target;

    const updatedValues = {
      ...values,
      [name]: value,
    };

    setValues(updatedValues);

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, updatedValues),
      }));
    }

    // Revalidate confirm password whenever password changes
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: touched.password
          ? validateField("password", updatedValues)
          : prev.password,
        confirmPassword: validateField("confirmPassword", updatedValues),
      }));
    }
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, values),
    }));
  }

  function toggleAgreement() {
    const updatedValues = {
      ...values,
      agreed: !values.agreed,
    };

    setValues(updatedValues);

    setTouched((prev) => ({
      ...prev,
      agreed: true,
    }));

    setErrors((prev) => ({
      ...prev,
      agreed: validateField("agreed", updatedValues),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const { errors: validationErrors, isValid } = validateSignUpForm(values);

    setErrors(validationErrors);

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreed: true,
    });

    if (!isValid) return;

    try {
      setIsSubmitting(true);

      // TODO:
      // Call Sign Up API here.

      console.log("Sign Up Data:", values);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setValues({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    });

    setErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreed: "",
    });

    setTouched({
      fullName: false,
      email: false,
      password: false,
      confirmPassword: false,
      agreed: false,
    });

    setIsSubmitting(false);
  }

  /* ==========================================================
     Exports
  ========================================================== */

  return {
    values,
    errors,
    touched,

    agreed: values.agreed,

    isSubmitting,
    isFormValid,

    handleChange,
    handleBlur,
    handleSubmit,
    toggleAgreement,
    resetForm,
  };
}

export default useSignUpForm;
