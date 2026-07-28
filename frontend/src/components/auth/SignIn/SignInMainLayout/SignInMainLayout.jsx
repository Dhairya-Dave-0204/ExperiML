import { AuthFooter, SignInForm } from "@/components/components.index";

function SignInMainLayout() {
  return (
    <section className="min-h-screen app-background">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">
          <SignInForm />
        </div>

        <div className="mt-8">
          <AuthFooter />
        </div>
      </div>
    </section>
  );
}

export default SignInMainLayout;
