'use client'
import SignInForm from "@/components/sign-in-form";
import { ToastContainer } from "react-toastify";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function SignInPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-purple-950/30 to-background dark:from-purple-950/50 dark:to-background">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <SignInForm />
      </div>
    </QueryClientProvider>
  );
}
