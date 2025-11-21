"use client";
import { motion } from "framer-motion";
import AnimatedFeatureCard from "./FeatureCard";
import {
  BarChart3,
  Brain,
  FileSearch,
  ShieldCheck,
  Workflow,
  CheckCircle,
} from "lucide-react";

interface FeaturesGridProps {
  isDark: boolean;
  isVisible: boolean;
}

export default function FeaturesGrid({ isDark, isVisible }: FeaturesGridProps) {
  const features = [
    {
      icon: <FileSearch className="h-8 w-8" />,
      title: "Intelligent Requirement Parsing",
      description:
        "Upload scopes, briefs, or SOWs — QualifAI extracts structured JSON requirements automatically.",
      delay: 0,
    },
    {
      icon: <Workflow className="h-8 w-8" />,
      title: "Service-Specific QA Engines",
      description:
        "Website, SEO, PPC, Automation, Social — each powered by its own best‑practice engine.",
      delay: 0.1,
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Scope vs Delivery Matching",
      description:
        "Instantly see what was delivered correctly, what's missing, and what needs revision.",
      delay: 0.2,
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI‑Driven Evaluation",
      description:
        "LLM‑powered logic checks, visual audits, metadata extraction, and error detection.",
      delay: 0.3,
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "QA History & Reporting",
      description:
        "Track improvements over time, view discrepancies, and generate client‑safe reports.",
      delay: 0.4,
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Automated Compliance",
      description:
        "Ensure all deliverables meet industry standards and client-specific requirements automatically.",
      delay: 0.5,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-12 relative z-10"
    >
      {features.map((feature, index) => (
        <AnimatedFeatureCard key={index} {...feature} isDark={isDark} />
      ))}
    </motion.div>
  );
}
