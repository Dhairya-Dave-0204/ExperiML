import { Routes, Route } from "react-router-dom";

import { PublicLayout, AuthLayout } from "@/layout/layout.index";

import { NotFound } from "@/pages/page.index";

import  Test  from "@/Test";
import {
  Home,
  About,
  Contact,
  FAQ,
  Documentation,
  PrivacyPolicy,
  DataPolicy,
  CookiePolicy,
  SignIn,
  SignUp,
  TermsOfService,
  ForgotPassword,
} from "@/pages/page.index";
import { ROUTES } from "@/constants/routes";

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
        <Route path={ROUTES.DATA_POLICY} element={<DataPolicy />} />
        <Route path={ROUTES.COOKIE_POLICY} element={<CookiePolicy />} />
        <Route path={ROUTES.TERM_SERVICE} element={<TermsOfService />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route path={ROUTES.FORGOT_PASS} element={<ForgotPassword />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}
