// app/qualifai/[serviceType]/page.tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ServiceType } from "@/app/(main)/types/client.types";
import WordPressQAPage from "@/app/(main)/qualifai/wordpress/page";
import PPCQAPage from "@/app/(main)/qualifai/ppc/page";
import SEOQAPage from "@/app/(main)/qualifai/seo/page";
import AIAutomationQAPage from "@/app/(main)/qualifai/ai-automation/page";
import ContentQAPage from "@/app/(main)/qualifai/content/page";
import SocialMediaQAPage from "@/app/(main)/qualifai/social-media/page";

export default function ServicePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const serviceType = params.serviceType as ServiceType;
  const clientId = searchParams.get("clientId");
  const mode = searchParams.get("mode") || "configure"; // configure, quick-check, full-check

  const renderServicePage = () => {
    switch (serviceType) {
      case "wordpress":
        return <WordPressQAPage />;
      case "ppc":
        return <PPCQAPage />;
      case "seo":
        return <SEOQAPage />;
      case "ai-automation":
        return <AIAutomationQAPage />;
      case "content":
        return <ContentQAPage />;
      case "social-media":
        return <SocialMediaQAPage />;
      default:
        return <div>Service not found</div>;
    }
  };

  return renderServicePage();
}
