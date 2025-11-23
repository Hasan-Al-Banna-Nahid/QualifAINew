// app/qualifai/[serviceType]/page.tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ServiceType } from "@/app/(main)/types/client.types";
import WordPressQAPage from "@/app/(main)/qualifai/wordpress/page";
// import PPCQAPage from "@/app/(main)/ppc/page";
// import SEOQAPage from "@/app/(main)/seo/page";
import AIAutomationQAPage from "@/app/(main)/qualifai/ai-automation/page";
// import ContentQAPage from "@/app/(main)/content/page";
// import SocialMediaQAPage from "@/app/(main)/social-media/page";

export default function ServicePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const serviceType = params.serviceType as ServiceType;
  const clientId = searchParams.get("clientId");
  const mode = searchParams.get("mode") || "configure"; // configure, quick-check, full-check

  const renderServicePage = () => {
    switch (serviceType) {
      case "wordpress":
        return <WordPressQAPage clientId={clientId} mode={mode} />;
      case "ppc":
      // return <PPCQAPage clientId={clientId} mode={mode} />;
      case "seo":
      // return <SEOQAPage clientId={clientId} mode={mode} />;
      case "ai-automation":
        return <AIAutomationQAPage clientId={clientId} mode={mode} />;
      case "content":
      // return <ContentQAPage clientId={clientId} mode={mode} />;
      case "social-media":
      // return <SocialMediaQAPage clientId={clientId} mode={mode} />;
      default:
        return <div>Service not found</div>;
    }
  };

  return renderServicePage();
}
