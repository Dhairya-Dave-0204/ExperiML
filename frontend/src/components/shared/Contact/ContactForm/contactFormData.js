export const INITIAL_VALUES = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

export const CONTACT_FIELDS = [
  {
    id: "fullName",
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Jane Doe",
    required: true,
  },

  {
    id: "email",
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "jane@example.com",
    required: true,
  },

  {
    id: "subject",
    name: "subject",
    label: "Subject",
    type: "text",
    placeholder: "What's this about?",
    required: true,
  },

  {
    id: "message",
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Share as much detail as you can...",
    required: true,
    rows: 5,
  },
];

export const CONTACT_FORM_COPY = {
  badge: "Send a message",

  title: "Tell me what's on your mind",

  description:
    "Fill in the details below — the more context you give, the faster a useful reply.",

  submitButton: "Send Message",

  successTitle: "Message ready to send",

  successDescription:
    "Thanks for reaching out. This form isn't connected to a backend just yet — in the meantime, feel free to reach out directly by email.",

  resetButton: "Send another message",
};
