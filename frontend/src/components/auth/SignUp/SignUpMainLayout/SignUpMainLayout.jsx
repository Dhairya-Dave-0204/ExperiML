import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  AuthLayout,
  AuthCard,
  SignUpForm,
  AuthFooterUp,
  AuthHeader,
} from "@/components/components.index";

import { useAuth } from "@/context/AuthContext";

import { ROUTES } from "@/constants/routes"

function SignUpMainLayout() {
  const { register } = useAuth();

  const navigate = useNavigate();

  async function handleRegister(credentials) {
    try {
      await register(credentials);

      toast.success("Account created successfully. Please sign in.");

      navigate(ROUTES.SIGN_IN);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create account. Please try again.",
      );

      throw error;
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Create your ExperiML account to manage datasets, experiments, and machine learning workflows."
        />

        <SignUpForm onSubmit={handleRegister} />
      </AuthCard>

      <AuthFooterUp actionLabel="creating an account" />
    </AuthLayout>
  );
}

export default SignUpMainLayout;
