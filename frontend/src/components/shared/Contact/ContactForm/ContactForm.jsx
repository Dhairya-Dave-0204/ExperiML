import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

import ContactField from "./ContactField";
import { CONTACT_FIELDS, CONTACT_FORM_COPY } from "./contactFormData";
import useContactForm from "./hooks/useContactForm";

import {
  sectionReveal,
  heroContent,
  fadeUp,
  cardReveal,
  staggerFast,
  listItemReveal,
  ctaHover,
  ctaTap,
  buttonHover,
  buttonTap,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

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
      <motion.section
        className="py-16 border-t border-border md:py-24"
        variants={sectionReveal}
        initial="hidden"
        animate="visible"
        viewport={sectionViewport}
      >
        <div className="container-custom">
          <motion.div
            variants={cardReveal}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center max-w-xl p-8 mx-auto text-center border shadow-sm rounded-xl border-border bg-surface md:p-10"
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-success/10"
            >
              <CheckCircle2
                size={24}
                strokeWidth={1.75}
                className="text-success"
              />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mb-2 text-xl font-extrabold font-heading text-text"
            >
              {CONTACT_FORM_COPY.successTitle}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="max-w-sm text-sm leading-relaxed text-text-secondary"
            >
              {CONTACT_FORM_COPY.successDescription}
            </motion.p>

            <motion.button
              variants={fadeUp}
              whileHover={buttonHover}
              whileTap={buttonTap}
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
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="py-16 border-t border-border bg-primary-light/30 md:py-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="container-custom">
        {/* Header */}
        <motion.div
          variants={heroContent}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="max-w-xl mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {CONTACT_FORM_COPY.badge}
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl"
          >
            {CONTACT_FORM_COPY.title}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15px] leading-relaxed text-text-secondary"
          >
            {CONTACT_FORM_COPY.description}
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          variants={cardReveal}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="max-w-4xl p-6 mx-auto border shadow-sm rounded-xl border-border bg-surface md:p-8"
        >
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {/* Name + Email */}
            <motion.div
              variants={listItemReveal}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
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
            </motion.div>

            {/* Subject + Message */}
            {CONTACT_FIELDS.filter(
              (field) => field.name === "subject" || field.name === "message",
            ).map((field) => (
              <motion.div
                key={field.id}
                variants={listItemReveal}
                className="mt-5"
              >
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
              </motion.div>
            ))}

            {/* Submit */}
            <motion.div variants={listItemReveal} className="mt-6">
              <motion.button
                whileHover={ctaHover}
                whileTap={ctaTap}
                type="submit"
                disabled={!isValid || isSubmitting}
                className="
                  inline-flex
                  items-center
                  justify-center
                  w-full
                  gap-2
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
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
}

export default ContactForm;
