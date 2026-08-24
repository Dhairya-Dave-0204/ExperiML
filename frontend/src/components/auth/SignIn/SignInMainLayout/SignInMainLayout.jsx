import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { SignInForm, AuthFooter } from "@/components/components.index";

import { useAuth } from "@/context/AuthContext";

function SignInMainLayout() {
  const { login } = useAuth();

  const navigate = useNavigate();

  async function handleLogin(credentials) {
    try {
      await login(credentials);

      toast.success("Signed in successfully");

      navigate("/app");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );

      throw error;
    }
  }

  return (
    <section className="min-h-screen app-background">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">
          <SignInForm onSubmit={handleLogin} />
        </div>

        <div className="mt-8">
          <AuthFooter />
        </div>
      </div>
    </section>
  );
}

export default SignInMainLayout;
