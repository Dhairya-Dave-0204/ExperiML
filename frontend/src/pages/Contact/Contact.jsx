import React from "react";
import {
  ContactHero,
  ContactInfo,
  ContactForm,
  Locationmap,
  DeveloperSection,
  ContactReasons,
  ContactCTA,
} from "@/components/components.index";

function Contact() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <Locationmap />
      <DeveloperSection />
      <ContactReasons />
      <ContactCTA />
    </>
  );
}

export default Contact;
