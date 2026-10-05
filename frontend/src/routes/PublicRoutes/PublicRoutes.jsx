import { lazy } from "react";
import { Route } from "react-router-dom";

import PublicLayout from "@/layout/PublicLayout/PublicLayout";

const Home = lazy(() => import("@/pages/public/Home/Home"));

const About = lazy(() => import("@/pages/public/About/About"));

const Contact = lazy(() => import("@/pages/public/Contact/Contact"));

const FAQ = lazy(() => import("@/pages/public/FAQ/FAQ"));

const Documentation = lazy(
  () => import("@/pages/public/Documentation/Documentation"),
);

const PrivacyPolicy = lazy(
  () => import("@/pages/public/PrivacyPolicy/PrivacyPolicy"),
);

const DataPolicy = lazy(() => import("@/pages/public/DataPolicy/DataPolicy"));

const CookiePolicy = lazy(
  () => import("@/pages/public/CookiePolicy/CookiePolicy"),
);

const TermsOfService = lazy(
  () => import("@/pages/public/TermsOfService/TermsOfService"),
);

const PublicRoutes = (
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
);

export default PublicRoutes;
