// app/login/page.tsx
"use client";
import LoginForm from "@/app/components/Auth/LoginForm";
import AuthLayout from "@/app/components/Auth/AuthLayout";
import PublicRoute from "@/app/components/Auth/PublicRoute";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";

function LoginPageContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <PublicRoute>
      <AuthLayout type="login">
        <LoginForm />
      </AuthLayout>
    </PublicRoute>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
