import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import RootClientWrapper from "./RootClientWrapper";
import { sidebarRoutes } from "@/app/components/Sidebar/Routes";

const font = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QualifAI - AI-Powered Quality Assurance",
  description:
    "Transform your SOWs, briefs, and requirements into machine-verifiable quality checks. Stop missing deliverables and start shipping flawless client work.",
  keywords:
    "quality assurance, AI, automation, agency tools, SOW, scope management",
  authors: [{ name: "QualifAI Team" }],
  openGraph: {
    title: "QualifAI - AI-Powered Quality Assurance",
    description: "Transform your quality assurance process with AI",
    type: "website",
    locale: "en_US",
  },
};

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
        <RootClientWrapper sidebarRoutes={sidebarRoutes}>
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}
