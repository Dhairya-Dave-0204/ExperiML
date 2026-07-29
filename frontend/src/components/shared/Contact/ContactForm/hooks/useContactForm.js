import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { INITIAL_VALUES, CONTACT_FORM_COPY } from "../contactFormData";

import { validateContactForm } from "../contactFormValidation";

import { submitContactForm } from "../Services/contact.service";

function useContactForm() {
  /* ==========================================================
     State
  ========================================================== */

  const [values, setValues] = useState(INITIAL_VALUES);

  const [touched, setTouched] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ==========================================================
     Derived State
  ========================================================== */

  const errors = useMemo(() => {
    return validateContactForm(values);
  }, [values]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  /* ==========================================================
     Handlers
  ========================================================== */

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      subject: true,
      message: true,
    });

    if (!isValid) {
      toast.error("Please correct the highlighted fields.");

      return;
    }

    try {
      setIsSubmitting(true);

      await submitContactForm(values);

      toast.success(CONTACT_FORM_COPY.successTitle);

      setSubmitted(true);
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setValues(INITIAL_VALUES);

    setTouched({});

    setSubmitted(false);
  }

  /* ==========================================================
     Exports
  ========================================================== */

  return {
    values,
    errors,
    touched,

    isValid,
    submitted,
    isSubmitting,

    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}

export default useContactForm;
