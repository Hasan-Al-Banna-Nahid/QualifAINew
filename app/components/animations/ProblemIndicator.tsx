// components/ProblemIndicator.tsx
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Zap,
  Shield,
  Search,
  FileText,
  Code,
  Eye,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Problem } from "@/app/(main)/hooks/useWordpressAnalysis";

interface ProblemIndicatorProps {
  problem: Problem;
  onProblemClick: (problem: Problem) => void;
  index: number;
}

const ProblemIcon = ({
  type,
  severity,
}: {
  type: string;
  severity: string;
}) => {
  const iconProps = {
    className: cn(
      "w-4 h-4",
      severity === "critical"
        ? "text-red-500"
        : severity === "high"
        ? "text-orange-500"
        : severity === "medium"
        ? "text-yellow-500"
        : "text-blue-500"
    ),
  };

  const icons: { [key: string]: JSX.Element } = {
    performance: <Zap {...iconProps} />,
    security: <Shield {...iconProps} />,
    seo: <Search {...iconProps} />,
    content: <FileText {...iconProps} />,
    technical: <Code {...iconProps} />,
    accessibility: <Eye {...iconProps} />,
    ecommerce: <ShoppingCart {...iconProps} />,
    analytics: <BarChart3 {...iconProps} />,
  };

  return icons[type] || <AlertTriangle {...iconProps} />;
};

const GlowingBadge = ({ severity }: { severity: string }) => {
  const colors = {
    critical: "from-red-500 to-pink-500",
    high: "from-orange-500 to-red-500",
    medium: "from-yellow-500 to-orange-500",
    low: "from-blue-500 to-cyan-500",
  };

  return (
    <motion.div
      className={cn(
        "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r",
        colors[severity]
      )}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export const ProblemIndicator: React.FC<ProblemIndicatorProps> = ({
  problem,
  onProblemClick,
  index,
}) => {
  const severityColors = {
    critical: "border-red-500 bg-red-500/20",
    high: "border-orange-500 bg-orange-500/20",
    medium: "border-yellow-500 bg-yellow-500/20",
    low: "border-blue-500 bg-blue-500/20",
  };

  const pulseAnimations = {
    critical: {
      scale: [1, 1.1, 1],
      boxShadow: [
        "0 0 0 0 rgba(239, 68, 68, 0.7)",
        "0 0 0 10px rgba(239, 68, 68, 0)",
        "0 0 0 0 rgba(239, 68, 68, 0)",
      ],
    },
    high: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(249, 115, 22, 0.7)",
        "0 0 0 8px rgba(249, 115, 22, 0)",
        "0 0 0 0 rgba(249, 115, 22, 0)",
      ],
    },
    medium: {
      scale: [1, 1.03, 1],
      boxShadow: [
        "0 0 0 0 rgba(245, 158, 11, 0.7)",
        "0 0 0 6px rgba(245, 158, 11, 0)",
        "0 0 0 0 rgba(245, 158, 11, 0)",
      ],
    },
    low: {
      scale: [1, 1.02, 1],
      boxShadow: [
        "0 0 0 0 rgba(59, 130, 246, 0.7)",
        "0 0 0 4px rgba(59, 130, 246, 0)",
        "0 0 0 0 rgba(59, 130, 246, 0)",
      ],
    },
  };

  return (
    <motion.div
      initial={{
        scale: 0,
        opacity: 0,
        x: -50,
        y: -50,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
      }}
      exit={{
        scale: 0,
        opacity: 0,
        x: 50,
        y: 50,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.1,
      }}
      className={cn(
        "absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2",
        "border-2 rounded-full p-2 backdrop-blur-sm",
        severityColors[problem.severity]
      )}
      style={{
        left: problem.position.x,
        top: problem.position.y,
      }}
      onClick={() => onProblemClick(problem)}
    >
      <motion.div
        animate={pulseAnimations[problem.severity]}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          className="relative z-10"
        >
          <ProblemIcon type={problem.type} severity={problem.severity} />
        </motion.div>

        <GlowingBadge severity={problem.severity} />

        {/* Floating particles */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[0, 90, 180, 270].map((rotation) => (
            <motion.div
              key={rotation}
              className={cn(
                "absolute w-1 h-1 rounded-full",
                problem.severity === "critical"
                  ? "bg-red-400"
                  : problem.severity === "high"
                  ? "bg-orange-400"
                  : problem.severity === "medium"
                  ? "bg-yellow-400"
                  : "bg-blue-400"
              )}
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${rotation}deg) translateX(12px)`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (rotation / 90) * 0.5,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 pointer-events-none"
      >
        <div className="font-semibold capitalize">{problem.type}</div>
        <div className="text-xs opacity-80">{problem.message}</div>
        <div
          className={cn(
            "text-xs font-bold mt-1",
            problem.severity === "critical"
              ? "text-red-300"
              : problem.severity === "high"
              ? "text-orange-300"
              : problem.severity === "medium"
              ? "text-yellow-300"
              : "text-blue-300"
          )}
        >
          {problem.severity.toUpperCase()}
        </div>
      </motion.div>
    </motion.div>
  );
};
