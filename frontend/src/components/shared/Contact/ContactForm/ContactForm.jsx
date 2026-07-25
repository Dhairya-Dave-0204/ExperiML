import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

import ContactField from "./ContactField";

import {
  INITIAL_VALUES,
  CONTACT_FIELDS,
  CONTACT_FORM_COPY,
} from "./contactFormData";

import { validateContactForm } from "./contactFormValidation";

function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);

  const [touched, setTouched] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const errors = validateContactForm(values);

  const isValid = Object.keys(errors).length === 0;

  const inputClasses = `
    w-full
    rounded-lg
    border
    border-border
    bg-surface
    px-4
    py-2.5
    text-sm
    text-text
    placeholder:text-text-secondary/70
    transition-colors
    duration-150
    focus:border-primary
    focus:outline-none
    focus:ring-2
    focus:ring-primary-light
  `;

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

  function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      subject: true,
      message: true,
    });

    if (!isValid) return;

    /*
      Frontend only for now.
      API integration will be added later.
    */

    setSubmitted(true);
  }

  function resetForm() {
    setValues(INITIAL_VALUES);
    setTouched({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <section className="py-16 border-t border-border md:py-24">
        <div className="container-custom">
          <div
            className="flex flex-col items-center max-w-xl p-8 mx-auto text-center border shadow-sm  rounded-xl border-border bg-surface md:p-10"
          >
            <div
              className="flex items-center justify-center w-12 h-12 mb-4 rounded-full  bg-success/10"
            >
              <CheckCircle2
                size={24}
                strokeWidth={1.75}
                className="text-success"
              />
            </div>

            <h2
              className="mb-2 text-xl font-extrabold  font-heading text-text"
            >
              {CONTACT_FORM_COPY.successTitle}
            </h2>

            <p
              className="max-w-sm text-sm leading-relaxed  text-text-secondary"
            >
              {CONTACT_FORM_COPY.successDescription}
            </p>

            <button
              type="button"
              onClick={resetForm}
              className="
                mt-6
                inline-flex
                items-center
                rounded-lg
                border
                border-border
                px-5
                py-2.5
                text-sm
                font-semibold
                text-text
                transition-colors
                duration-150
                hover:border-border-hover
                hover:bg-surface-soft
              "
            >
              {CONTACT_FORM_COPY.resetButton}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 border-t border-border bg-surface-soft md:py-24">
      <div className="container-custom">
        {/* Header */}

        <div className="max-w-xl mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase  text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            {CONTACT_FORM_COPY.badge}
          </div>

          <h2
            className="mb-3 text-2xl font-extrabold tracking-tight  font-heading text-text md:text-3xl"
          >
            {CONTACT_FORM_COPY.title}
          </h2>

          <p
            className="
              text-[15px]
              leading-relaxed
              text-text-secondary
            "
          >
            {CONTACT_FORM_COPY.description}
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl p-6 mx-auto border shadow-sm  rounded-xl border-border bg-surface md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {CONTACT_FIELDS.filter(
              (field) => field.name === "fullName" || field.name === "email",
            ).map((field) => (
              <ContactField
                key={field.id}
                {...field}
                error={errors[field.name]}
                touched={touched[field.name]}
              >
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClasses}
                />
              </ContactField>
            ))}
          </div>

          {CONTACT_FIELDS.filter(
            (field) => field.name === "subject" || field.name === "message",
          ).map((field) => (
            <div key={field.id} className="mt-5">
              <ContactField
                {...field}
                error={errors[field.name]}
                touched={touched[field.name]}
              >
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.name}
                    rows={field.rows}
                    placeholder={field.placeholder}
                    value={values[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputClasses} resize-none`}
                  />
                ) : (
                  <input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={values[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClasses}
                  />
                )}
              </ContactField>
            </div>
          ))}

          <button
            type="submit"
            disabled={!isValid}
            className="
              mt-6
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-primary
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-colors
              duration-150
              hover:bg-primary-dark
              disabled:cursor-not-allowed
              disabled:bg-border
              disabled:text-text-secondary
              sm:w-auto
            "
          >
            {CONTACT_FORM_COPY.submitButton}

            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
