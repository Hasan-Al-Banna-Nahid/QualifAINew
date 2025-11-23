// app/components/Auth/FirebaseAuthListener.tsx
"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/(main)/lib/firebase/config";
import { useQueryClient } from "@tanstack/react-query";

export default function FirebaseAuthListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, refetch current user data
        await queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        // User is signed out, clear user data
        queryClient.setQueryData(["user"], null);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  return null;
}
