const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export async function submitContactForm(formData) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("Contact service is not configured properly.");
  }

  const payload = {
    access_key: accessKey,

    name: formData.fullName,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,

    // Optional Web3Forms fields
    from_name: "ExperiML Contact Form",
    botcheck: "",
  };

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to send your message. Please try again.",
    );
  }

  return result;
}
