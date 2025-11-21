"use client";
import { useEffect } from "react";

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      const body = document.body;

      // Lock body scroll while preserving scroll position
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";

      return () => {
        // Restore body scroll and position
        body.style.overflow = "";
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
}
