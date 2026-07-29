import { Send, CheckCircle2 } from "lucide-react";

import ContactField from "./ContactField";

import { CONTACT_FIELDS, CONTACT_FORM_COPY } from "./contactFormData";

import useContactForm from "./hooks/useContactForm";

function ContactForm() {
  const {
    values,
    errors,
    touched,

    submitted,
    isSubmitting,
    isValid,

    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useContactForm();

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

  if (submitted) {
    return (
      <section className="py-16 border-t border-border md:py-24">
        <div className="container-custom">
          <div className="flex flex-col items-center max-w-xl p-8 mx-auto text-center border shadow-sm rounded-xl border-border bg-surface md:p-10">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-success/10">
              <CheckCircle2
                size={24}
                strokeWidth={1.75}
                className="text-success"
              />
            </div>

            <h2 className="mb-2 text-xl font-extrabold font-heading text-text">
              {CONTACT_FORM_COPY.successTitle}
            </h2>

            <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
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
    <section className="py-16 border-t border-border bg-primary-light/30 md:py-24">
      <div className="container-custom">
        {/* Header */}

        <div className="max-w-xl mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            {CONTACT_FORM_COPY.badge}
          </div>

          <h2 className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            {CONTACT_FORM_COPY.title}
          </h2>

          <p className="text-[15px] leading-relaxed text-text-secondary">
            {CONTACT_FORM_COPY.description}
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-4xl p-6 mx-auto border shadow-sm rounded-xl border-border bg-surface md:p-8"
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
            disabled={!isValid || isSubmitting}
            className="
              inline-flex
              items-center
              justify-center
              w-full
              gap-2
              mt-6
              rounded-lg
              bg-primary
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-colors
              duration-300
              hover:bg-primary-dark
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            {isSubmitting ? "Sending..." : CONTACT_FORM_COPY.submitButton}

            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
