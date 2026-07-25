export function validateContactForm(values) {
  const errors = {};

  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  // Full Name Validation
  if (!fullName) {
    errors.fullName = "Please enter your name.";
  } else if (fullName.length < 2) {
    errors.fullName = "Name must be at least 2 characters.";
  }

  // Email Validation
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Subject Validation
  if (!subject) {
    errors.subject = "Please add a subject.";
  } else if (subject.length < 3) {
    errors.subject = "Subject must be at least 3 characters.";
  }

  // Message Validation
  if (!message) {
    errors.message = "Please write a message.";
  } else if (message.length < 20) {
    errors.message = "Message should be at least 20 characters.";
  }

  return errors;
}
