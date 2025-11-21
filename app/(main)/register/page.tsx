// app/register/page.tsx
"use client";
import RegisterForm from "@/app/components/Auth/RegisterForm";
import AuthLayout from "@/app/components/Auth/AuthLayout";
import PublicRoute from "@/app/components/Auth/PublicRoute";
import BackButton from "@/app/components/ui/Button/BackButton";

export default function RegisterPage() {
  return (
    <PublicRoute>
      <AuthLayout type="register">
        {/* <BackButton className="mb-6" /> */}

        <RegisterForm />
      </AuthLayout>
    </PublicRoute>
  );
}
