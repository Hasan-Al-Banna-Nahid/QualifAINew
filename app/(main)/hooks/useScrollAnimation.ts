"use client";
import { useScroll, useTransform, useSpring } from "framer-motion";

export function useScrollAnimation() {
  const { scrollYProgress } = useScroll();

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Various transformations based on scroll
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const y = useTransform(smoothProgress, [0, 1], [0, -100]);

  return {
    scrollYProgress: smoothProgress,
    scale,
    opacity,
    y,
  };
}
