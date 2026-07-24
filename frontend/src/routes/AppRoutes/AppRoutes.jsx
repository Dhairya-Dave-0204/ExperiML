import { Routes, Route } from "react-router-dom";

import { PublicLayout } from "@/layout/layout.index";

import { Home, About, Contact, FAQ, Documentation, PrivacyPolicy } from "@/pages/page.index";
import { ROUTES } from "@/constants/routes"

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.FAQ} element={<FAQ />} />
        <Route path={ROUTES.DOCS} element={<Documentation />} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  );
}
