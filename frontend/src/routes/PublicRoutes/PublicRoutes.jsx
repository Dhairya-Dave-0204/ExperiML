import React from "react";
import { Routes, Route } from "react-router-dom";

import { PublicLayout } from "@/layout/layout.index";

import {
  Home,
  About,
  Contact,
  FAQ,
  Documentation,
  PrivacyPolicy,
  DataPolicy,
  CookiePolicy,
  TermsOfService,
} from "@/pages/page.index";

function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/faq" element={<FAQ />} />

        <Route path="/docs" element={<Documentation />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/data-policy" element={<DataPolicy />} />

        <Route path="/cookie-policy" element={<CookiePolicy />} />

        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Route>
    </Routes>
  );
}

export default PublicRoutes;
