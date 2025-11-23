// app/context/ScrollContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { usePathname } from "next/navigation";

interface ScrollContextType {
  isScrolled: boolean;
  scrollDirection: "up" | "down" | null;
  scrollProgress: number;
  isHomePage: boolean;
  disableBodyScroll: () => void;
  enableBodyScroll: () => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const isHomePage = pathname === "/";

  // Disable body scroll function
  const disableBodyScroll = () => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  // Enable body scroll function
  const enableBodyScroll = () => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  // Handle scroll behavior based on route
  useEffect(() => {
    if (isHomePage) {
      // Home page: No scroll allowed
      disableBodyScroll();
      window.scrollTo(0, 0);
    } else {
      // Other pages: Enable scroll with fixed behavior after threshold
      enableBodyScroll();
    }

    return () => {
      enableBodyScroll(); // Cleanup
    };
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage) return; // No scroll events for home page

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / scrollHeight) * 100;

      // Determine scroll direction
      if (scrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else if (scrollY < lastScrollY.current) {
        setScrollDirection("up");
      }

      // For other pages: fixed behavior after 100px scroll
      setIsScrolled(scrollY > 100);

      // Update scroll progress
      setScrollProgress(progress);

      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const value: ScrollContextType = {
    isScrolled,
    scrollDirection,
    scrollProgress,
    isHomePage,
    disableBodyScroll,
    enableBodyScroll,
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
}
