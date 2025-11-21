// app/RootClientWrapper.tsx
"use client";
import { AuthProvider } from "@/app/context/AuthContext";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { LayoutProvider } from "@/app/context/LayoutContext";
import TanstackQueryProvider from "./providers/TanstackQueryProvider";
import Navbar from "@/app/components/Navbar/Navbar";
import { routes } from "@/app/components/Navbar/Routes";
import ClientLayout from "./clientWrapper";

interface RootClientWrapperProps {
  children: React.ReactNode;
  sidebarRoutes: any[];
}

export default function RootClientWrapper({
  children,
  sidebarRoutes,
}: RootClientWrapperProps) {
  return (
    <TanstackQueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <LayoutProvider>
            <Navbar routes={routes} />
            <ClientLayout sidebarRoutes={sidebarRoutes}>
              <main className="min-h-screen pt-16">{children}</main>
            </ClientLayout>
          </LayoutProvider>
        </ThemeProvider>
      </AuthProvider>
    </TanstackQueryProvider>
  );
}
