"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Brain,
  FileSearch,
  ShieldCheck,
  Workflow,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  X,
  Zap,
  Target,
  Users,
  Clock,
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { GlowCard } from "@/app/components/ui/glow-card";
import { ScrollReveal } from "@/app/components/ui/scroll-reveal";
import { DemoModal } from "@/app/components/ui/modal";
import { AnimatedBadge } from "@/app/components/ui/animated-badge";

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <>
      <div
        className={clsx(
          "min-h-screen w-full transition-all duration-500 relative overflow-hidden",
          isDark
            ? "bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 text-blue-200"
            : "bg-gradient-to-br from-gray-50 via-blue-50/40 to-gray-100 text-gray-900"
        )}
      >
        {/* Animated Background Elements */}
        <AnimatedBackground isDark={isDark} />

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 pt-20 pb-32"
        >
          <HeroSection isDark={isDark} onDemoOpen={() => setIsDemoOpen(true)} />
        </motion.section>

        {/* Features Section */}
        <section ref={featuresRef} className="relative z-10 pb-32">
          <FeaturesSection isDark={isDark} />
        </section>

        {/* Stats Section */}
        <section className="relative z-10 pb-32">
          <StatsSection isDark={isDark} />
        </section>

        {/* Process Section */}
        <section className="relative z-10 pb-32">
          <ProcessSection isDark={isDark} />
        </section>

        {/* CTA Section */}
        <section className="relative z-10 pb-32">
          <CTASection isDark={isDark} onDemoOpen={() => setIsDemoOpen(true)} />
        </section>
      </div>

      {/* Demo Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        isDark={isDark}
      />
    </>
  );
}

// Background Component
function AnimatedBackground({ isDark }: { isDark: boolean }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className={clsx(
          "absolute top-1/4 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20",
          isDark ? "bg-blue-500" : "bg-blue-300"
        )}
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className={clsx(
          "absolute bottom-1/4 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20",
          isDark ? "bg-purple-500" : "bg-purple-300"
        )}
      />
      <motion.div
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className={clsx(
          "absolute top-3/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-15",
          isDark ? "bg-cyan-500" : "bg-cyan-300"
        )}
      />
    </div>
  );
}

// Hero Section Component
function HeroSection({
  isDark,
  onDemoOpen,
}: {
  isDark: boolean;
  onDemoOpen: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 text-center">
      <ScrollReveal direction="up" delay={0}>
        <AnimatedBadge
          icon={<Sparkles className="w-4 h-4" />}
          text="Powered by QualifAI"
          isDark={isDark}
          className="mx-auto mb-8"
        />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <h1 className="text-6xl md:text-7xl font-extrabold mb-8">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Scope-Aware
          </span>
          <br />
          <span className="text-4xl md:text-5xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Quality Assurance
          </span>
        </h1>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2}>
        <p
          className={clsx(
            "max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed mb-12",
            isDark ? "text-blue-300/80" : "text-gray-600"
          )}
        >
          Transform your SOWs, briefs, and requirements into{" "}
          <span className="font-semibold text-blue-500">
            machine-verifiable quality checks
          </span>
          . Stop missing deliverables and start shipping flawless client work.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.3}>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <PrimaryActionButton isDark={isDark} />
          <DemoActionButton isDark={isDark} onClick={onDemoOpen} />
        </div>
      </ScrollReveal>
    </div>
  );
}

// Primary Action Button Component
function PrimaryActionButton({ isDark }: { isDark: boolean }) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: isDark
          ? "0 20px 40px rgba(59, 130, 246, 0.3)"
          : "0 20px 40px rgba(59, 130, 246, 0.2)",
      }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        "px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 relative group overflow-hidden",
        isDark
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      )}
    >
      <Zap className="w-5 h-5" />
      Get Started Free
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
    </motion.button>
  );
}

// Demo Action Button Component
function DemoActionButton({
  isDark,
  onClick,
}: {
  isDark: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: isDark
          ? "0 20px 40px rgba(99, 102, 241, 0.2)"
          : "0 20px 40px rgba(99, 102, 241, 0.1)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        "px-10 py-4 rounded-2xl font-bold border-2 flex items-center gap-3 transition-all duration-300 group relative overflow-hidden",
        isDark
          ? "border-purple-600 text-purple-400 hover:bg-purple-600/10 hover:border-purple-500"
          : "border-purple-400 text-purple-600 hover:bg-purple-50 hover:border-purple-500"
      )}
    >
      <Play className="w-5 h-5" />
      View Interactive Demo
      {/* Animated border glow */}
      <div
        className={clsx(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          isDark
            ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20"
            : "bg-gradient-to-r from-purple-400/10 to-pink-400/10"
        )}
      />
    </motion.button>
  );
}

// Features Section Component
function FeaturesSection({ isDark }: { isDark: boolean }) {
  const features = [
    {
      icon: <FileSearch className="h-10 w-10" />,
      title: "Intelligent Requirement Parsing",
      description:
        "Upload scopes, briefs, or SOWs — QualifAI extracts structured JSON requirements automatically.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Workflow className="h-10 w-10" />,
      title: "Service-Specific QA Engines",
      description:
        "Website, SEO, PPC, Automation, Social — each powered by its own best‑practice engine.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "Scope vs Delivery Matching",
      description:
        "Instantly see what was delivered correctly, what's missing, and what needs revision.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Brain className="h-10 w-10" />,
      title: "AI‑Driven Evaluation",
      description:
        "LLM‑powered logic checks, visual audits, metadata extraction, and error detection.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: "QA History & Reporting",
      description:
        "Track improvements over time, view discrepancies, and generate client‑safe reports.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: "Automated Compliance",
      description:
        "Ensure all deliverables meet industry standards and client-specific requirements automatically.",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <ScrollReveal direction="up">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How QualifAI Works
          </h2>
          <p
            className={clsx(
              "text-xl max-w-2xl mx-auto",
              isDark ? "text-blue-300/80" : "text-gray-600"
            )}
          >
            End-to-end quality assurance powered by artificial intelligence and
            service-specific expertise.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <ScrollReveal key={feature.title} direction="up" delay={index * 0.1}>
            <GlowCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              isDark={isDark}
              delay={index * 0.2}
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

// Stats Section Component
function StatsSection({ isDark }: { isDark: boolean }) {
  const stats = [
    {
      number: "99%",
      label: "Accuracy Rate",
      icon: <Target className="w-6 h-6" />,
    },
    { number: "10x", label: "Faster QA", icon: <Zap className="w-6 h-6" /> },
    {
      number: "50+",
      label: "Checks Automated",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      number: "24/7",
      label: "Monitoring",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6">
      <ScrollReveal direction="up">
        <div
          className={clsx(
            "rounded-3xl p-12 backdrop-blur-sm border-2",
            isDark
              ? "bg-slate-900/40 border-slate-700/50"
              : "bg-white/60 border-gray-200/50"
          )}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} direction="up" delay={index * 0.1}>
                <StatCard stat={stat} isDark={isDark} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

// Individual Stat Card Component
function StatCard({
  stat,
  isDark,
  index,
}: {
  stat: any;
  isDark: boolean;
  index: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center group cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          delay: index * 0.2 + 0.5,
        }}
        className={clsx(
          "inline-flex items-center justify-center p-3 rounded-2xl mb-4 transition-colors duration-300",
          isDark
            ? "bg-blue-500/10 text-blue-300 group-hover:bg-blue-500/20"
            : "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20"
        )}
      >
        {stat.icon}
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          delay: index * 0.2 + 0.7,
        }}
        className={clsx(
          "text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent",
          isDark ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
        )}
      >
        {stat.number}
      </motion.div>

      <div
        className={clsx(
          "text-sm font-semibold uppercase tracking-wider",
          isDark ? "text-blue-300/80" : "text-gray-600"
        )}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

// Process Section Component
function ProcessSection({ isDark }: { isDark: boolean }) {
  const processSteps = [
    {
      step: "01",
      title: "Upload Scope",
      description: "Upload SOWs, briefs, or requirements in any format",
      icon: <FileSearch className="w-8 h-8" />,
    },
    {
      step: "02",
      title: "AI Parsing",
      description: "QualifAI extracts structured requirements automatically",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      step: "03",
      title: "Run QA",
      description: "Execute service-specific quality checks",
      icon: <Workflow className="w-8 h-8" />,
    },
    {
      step: "04",
      title: "Get Report",
      description: "Receive detailed compliance and gap analysis",
      icon: <BarChart3 className="w-8 h-8" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6">
      <ScrollReveal direction="up">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
            Simple 4-Step Process
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {processSteps.map((step, index) => (
          <ScrollReveal key={step.step} direction="up" delay={index * 0.1}>
            <ProcessCard step={step} isDark={isDark} index={index} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

// Process Card Component
function ProcessCard({
  step,
  isDark,
  index,
}: {
  step: any;
  isDark: boolean;
  index: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      className={clsx(
        "p-8 rounded-3xl border-2 text-center relative overflow-hidden group cursor-pointer",
        isDark
          ? "bg-slate-900/40 border-slate-700/50 hover:border-green-500/50"
          : "bg-white/60 border-gray-200/50 hover:border-green-400/50"
      )}
    >
      {/* Step number background */}
      <div
        className={clsx(
          "absolute -top-4 -right-4 text-8xl font-black opacity-5 select-none",
          isDark ? "text-white" : "text-gray-900"
        )}
      >
        {step.step}
      </div>

      {/* Animated connector line */}
      {index < 3 && (
        <div
          className={clsx(
            "hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 transform translate-y-4",
            isDark ? "bg-blue-500/30" : "bg-blue-400/30"
          )}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={clsx(
              "h-full w-full origin-left",
              isDark ? "bg-blue-500" : "bg-blue-400"
            )}
          />
        </div>
      )}

      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: index * 0.2 }}
        className={clsx(
          "inline-flex items-center justify-center p-4 rounded-2xl mb-6",
          isDark
            ? "bg-green-500/10 text-green-300"
            : "bg-green-500/10 text-green-600"
        )}
      >
        {step.icon}
      </motion.div>

      <h3
        className={clsx(
          "text-xl font-bold mb-3",
          isDark ? "text-white" : "text-gray-900"
        )}
      >
        {step.title}
      </h3>

      <p
        className={clsx(
          "text-sm leading-relaxed",
          isDark ? "text-blue-300/80" : "text-gray-600"
        )}
      >
        {step.description}
      </p>

      {/* Hover glow effect */}
      <div
        className={clsx(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          isDark
            ? "bg-gradient-to-br from-green-500/5 to-cyan-500/5"
            : "bg-gradient-to-br from-green-400/5 to-cyan-400/5"
        )}
      />
    </motion.div>
  );
}

// CTA Section Component
function CTASection({
  isDark,
  onDemoOpen,
}: {
  isDark: boolean;
  onDemoOpen: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 text-center">
      <ScrollReveal direction="up">
        <GlowCard
          icon={<Sparkles className="h-12 w-12" />}
          title="Ready to Transform Your QA Process?"
          description="Join hundreds of agencies that trust QualifAI to deliver flawless client work every time."
          gradient="from-purple-500 to-pink-500"
          isDark={isDark}
          className="text-center items-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <PrimaryActionButton isDark={isDark} />
            <DemoActionButton isDark={isDark} onClick={onDemoOpen} />
          </div>
        </GlowCard>
      </ScrollReveal>
    </div>
  );
}
