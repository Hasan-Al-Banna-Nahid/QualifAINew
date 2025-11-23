// app/providers/TanstackQueryProvider.tsx (Updated)
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: any) => {
              // Don't retry for network errors or offline errors
              if (
                error?.code === "network-error" ||
                error?.code === "unavailable"
              ) {
                return false;
              }
              return failureCount < 2; // Retry other errors up to 2 times
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: (failureCount, error: any) => {
              // Don't retry for network errors
              if (
                error?.code === "network-error" ||
                error?.code === "unavailable"
              ) {
                return false;
              }
              return failureCount < 1; // Retry other errors once
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
