// app/layout.tsx
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "../components/Navbar/Navbar";
import { routes } from "../components/Navbar/Routes";
import { sidebarRoutes } from "../components/Sidebar/Routes";
import ClientLayout from "./clientWrapper";
import { AuthProvider } from "../context/AuthContext";
import { LayoutProvider } from "../context/LayoutContext";
import { AuthRouteProvider } from "@/app/context/AuthRouteContext";
import TanstackQueryProvider from "./providers/TanstackQueryProvider";
import FirebaseAuthListener from "@/app/components/Auth/FirebaseAuthListener";
import { ScrollProvider } from "../context/ScrollContext";

const font = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QualifAI - AI-Powered Quality Assurance",
  description:
    "Transform your SOWs, briefs, and requirements into machine-verifiable quality checks.",
};

// Client wrapper that uses all contexts
function AppClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TanstackQueryProvider>
      <AuthRouteProvider>
        <AuthProvider>
          <ThemeProvider>
            <LayoutProvider>
              <FirebaseAuthListener />
              <Navbar routes={routes} />
              <ClientLayout sidebarRoutes={sidebarRoutes}>
                <main className="min-h-screen pt-16">{children}</main>
              </ClientLayout>
            </LayoutProvider>
          </ThemeProvider>
        </AuthProvider>
      </AuthRouteProvider>
    </TanstackQueryProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${font.className} antialiased`}
        suppressHydrationWarning
      >
        <AppClientWrapper>{children}</AppClientWrapper>
      </body>
    </html>
  );
}
