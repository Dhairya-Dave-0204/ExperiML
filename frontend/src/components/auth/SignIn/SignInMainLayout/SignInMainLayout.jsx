import { AuthFooter, SignInForm } from "@/components/components.index";

function SignInMainLayout() {
  return (
    <section className="min-h-screen bg-background">
      <div className="flex flex-col min-h-screen">
        <main className="flex items-center justify-center flex-1 px-6 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-lg">
            <SignInForm />
          </div>
        </main>

        <AuthFooter />
      </div>
    </section>
  );
}

export default SignInMainLayout;
